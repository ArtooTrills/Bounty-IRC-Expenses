/// <reference path="node_modules/@types/ramda/index.d.ts" />
/// <reference path="node_modules/@types/mongodb/index.d.ts" />

import * as Parser from "./parser";
import * as R from "ramda";
import {MongoClient, Collection} from "mongodb";

interface Transaction {
    fromMember: string;
    toMember: string;
    amount: number;
}

const connectionString = "mongodb://localhost:27017/artoo";

function createTransaction(from: string, to: string, amount: number) : Transaction {
    const obj : Transaction = {
        fromMember: from,
        toMember: to,
        amount,
    };
    return obj;
}

function getMembers() : Promise<string[]> {
    return MongoClient.connect(connectionString)
        .then(db => db.collection("members").find({}).toArray().then(array => array.map(x => x.name)));
}

export function addTransaction(fromMember: string, toMember: string, amount: number) : Promise<string> {
    return getMembers().then(members => {
        if (members.length === 0) {
            return "Failed to add transaction, add few members first";
        }

        if (fromMember === "_all_") {
            const amountPerMember = Math.round(amount / members.length);
            const objs = R.map(member => createTransaction(member, toMember, amountPerMember), members);
            return MongoClient.connect(connectionString)
                .then(db => {
                    const transactions = db.collection("transactions");
                    return transactions.insertMany(objs);
                })
                .then(_ => "transaction recorded.");
        } else {
            const obj = createTransaction(fromMember, toMember, amount);
            return MongoClient.connect(connectionString)
                .then(db => {
                    const transactions = db.collection("transactions");
                    return transactions.insert(obj)
                })
                .then(_ => "transaction recorded.");
        }
    });
}

export function addMember(name: string) : Promise<string> {
    return MongoClient.connect(connectionString).then(db => {
        const members = db.collection("members");
        return members.insert({name});
    }).then(_ => `${name} created`)
    .catch(ex => "Add member failed " + ex);
}

function notSelfReference(t: Transaction) : boolean {
    return t.fromMember !== t.toMember;
}

function getTransactions() : Promise<Transaction[]> {
    return MongoClient.connect(connectionString)
        .then(db => db.collection("transactions").find({}).toArray()
            .then(a => a.map(x => createTransaction(x.fromMember, x.toMember, x.amount))));
}

function calcMemberGetsBack(name: string) : Promise<number> {
    return getTransactions().then(t => {
        return t
            .filter(notSelfReference)
            .filter(x => x.toMember === name)
            .map(x => x.amount)
            .reduce(R.add, 0);
    });
}

function calcMemberHasToGive(name: string) : Promise<number> {
    return getTransactions().then(t => {
        return t
            .filter(notSelfReference)
            .filter(x => x.fromMember === name)
            .map(x => x.amount)
            .reduce(R.add, 0);
    });
}

export function listMembers() : Promise<string> {
    return getMembers().then(members => {
        if (members.length === 0) {
            return "No members added";
        }

        return "Listing all Members:\n" + members.join(", ");
    });
}

export function listMemberToMember(member1: string, member2: string) : Promise<string> {
    return getTransactions().then(transactions => {
        const getsBack =
            transactions
            .filter(x => x.fromMember === member2 && x.toMember === member1)
            .map(x => x.amount)
            .reduce(R.add, 0);

        const hasToGive =
            transactions
            .filter(x => x.fromMember === member1 && x.toMember === member2)
            .map(x => x.amount)
            .reduce(R.add, 0);

        return getsBack > hasToGive
            ? `${member1} gets back ${getsBack - hasToGive} from ${member2}`
            : `${member1} has to pay ${hasToGive - getsBack} to ${member2}`;
    });
}

export function exportTransactions() : Promise<string> {
    return getTransactions().then(transactions => {
        return "from,to,amount\n" +
            transactions
            .map(t => [t.fromMember, t.toMember, t.amount].join(","))
            .join("\n");
    });
}
