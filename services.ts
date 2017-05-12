/// <reference path="node_modules/@types/ramda/index.d.ts" />

import * as Parser from "./parser";
import * as R from "ramda";

interface Transaction {
    fromMember: string;
    toMember: string;
    amount: number;
}

const members : string[] = [];
const transactions : Transaction[] = [];

function createTransaction(from: string, to: string, amount: number) : Transaction {
    const obj : Transaction = {
        fromMember: from,
        toMember: to,
        amount,
    };
    return obj;
}

export function addTransaction(fromMember: string, toMember: string, amount: number) : string {
    if (members.length === 0) {
        return "Failed to add transaction, add few members first";
    }

    if (fromMember === "_all_") {
        const amountPerMember = Math.round(amount / members.length);
        const objs = R.map(member => createTransaction(member, toMember, amountPerMember), members);
        objs.forEach(t => transactions.push(t));
    } else {
        const obj = createTransaction(fromMember, toMember, amount);
        transactions.push(obj);
    }

    return "transaction recorded.";
}

export function addMember(name: string) : string {
    members.push(name);
    return `${name} created`;
}

function notSelfReference(t: Transaction) : boolean {
    return t.fromMember !== t.toMember;
}

function calcMemberGetsBack(name: string) : number {
    return transactions
        .filter(notSelfReference)
        .filter(x => x.toMember === name)
        .map(x => x.amount)
        .reduce(R.add, 0);
}

function calcMemberHasToGive(name: string) : number {
    return transactions
        .filter(notSelfReference)
        .filter(x => x.fromMember === name)
        .map(x => x.amount)
        .reduce(R.add, 0);
}

export function listMembers() : string {
    if (members.length === 0) {
        return "No members added";
    }

    return "Listing all Members:\n" + members.map(member => {
        const getsBack = calcMemberGetsBack(member);
        const hasToGive = calcMemberHasToGive(member);
        return `${member} gets back ${getsBack}, has to give ${hasToGive}`;
    }).join("\n");
}

export function listSingleMember(name: string) : string {
    const getsBackFrom = R.pipe(
        R.filter(notSelfReference),
        R.filter((x: Transaction) => x.toMember === name),
        R.groupBy((t: Transaction) => t.fromMember)
    )(transactions);

    const hasToGive = R.pipe(
        R.filter(notSelfReference),
        R.filter((x: Transaction) => x.fromMember === name),
        R.groupBy((t: Transaction) => t.toMember)
    )(transactions);

    console.log(getsBackFrom);

    return "";
}

export function listMemberToMember(member1: string, member2: string) : string {
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
}

export function exportTransactions() : string {
    return "from,to,amount\n" +
        transactions
        .map(t => [t.fromMember, t.toMember, t.amount].join(","))
        .join("\n");
}
