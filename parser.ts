import * as R from "ramda";

export enum ActionType {
    addTransaction,
    addMember,
    noAction,
    listMembers,
    listSingleMember,
    listMemberToMember,
    exportTransactions
}

export interface parseTransactionOutput {
    paidBy: string;
    toPerson: string;
    amount: number;
    timestamp: number;
    reason: string;
}

export interface parseMemberOutput {
    name: string;
}

export interface parseMemberToMemberOutput {
    fromPerson: string;
    toPerson: string;
}

interface parseOutput {
    type: ActionType,
    speaker: string,
    output: parseMemberOutput | parseTransactionOutput | parseMemberToMemberOutput,
}

function normalizeWord(word: string) : string {
    // Only keep alphabets and numbers
    return word.toLowerCase().replace(/[^a-z0-9]/, '');
}

function matches(word1: string, word2: string) : boolean {
    const a = normalizeWord(word1);
    const b = normalizeWord(word2);
    return a === b;
}

function matchesCommonWords(word: string) : boolean {
    const commonWords = ["new", "member"];
    const normalized = normalizeWord(word);
    return R.contains(normalized, commonWords);
}

function parseDate(str: string) : number {
    const regex1 = /(yesterday|today)/i;

    if (regex1.test(str)) {
        const [_, when] = regex1.exec(str);

        if (when === "today") {
            return Date.now();
        } else if (when === "yesterday") {
            return Date.now() - (24 * 60 * 60 * 1000);
        }
    } else {
        const parsedDate = Date.parse(str);
        return parsedDate;
    }
}

function pronounToName(speaker: string, word: string) : string {
    const pronouns = ["I", "me", "myself"];
    return R.contains(word, pronouns) ? speaker : word;
}

function parseTransaction(speaker: string, words: string[]) : parseTransactionOutput {
    const sentence = words.join(" ");
    const reg1 = /(\w+)?\s*paid (\d+) for (\w+) (.*)/i;
    const reg2 = /(\w+) (owe|owes) (\w+) (\d+)(.*)/i;

    if (reg1.test(sentence)) {
        const [_, fromPerson, amount, reason, date] = reg1.exec(sentence);
        const timestamp = parseDate(date);

        const obj : parseTransactionOutput = {
            paidBy: pronounToName(speaker, R.defaultTo("I", fromPerson)),
            toPerson: "_all_",
            amount: parseFloat(amount),
            timestamp: timestamp,
            reason,
        };
        return obj;
    } else if (reg2.test(sentence)) {
        const [_, toPerson, direction, fromPerson, amount, reason] = reg2.exec(sentence);
        const obj : parseTransactionOutput = {
            paidBy: pronounToName(speaker, fromPerson),
            toPerson: pronounToName(speaker, toPerson),
            amount: parseFloat(amount),
            timestamp: Date.now(),
            reason: reason.trim()
        };
        return obj;
    } else {
        throw new Error("Failed to parse add transaction message");
    }
}

function parseMember(speaker: string, words: string[]) : parseMemberOutput {
    const a = R.dropWhile(matchesCommonWords, words);
    const obj : parseMemberOutput = {
        name: pronounToName(speaker, R.head(a))
    };
    return obj;
}

function matchesCommands(word: string) : boolean {
    const commands = ["addt", "addm", "listm", "how", "export"];
    return R.contains(normalizeWord(word), commands);
}

function notMatchesCommands(word: string) : boolean {
    return !matchesCommands(word);
}

function dropLastCharacter(str: string) : string {
    return str.slice(0, str.length - 1);
}

function parseMemberToMemberReport(speaker: string, words: string[]) : parseMemberToMemberOutput {
    const sentence = words.join(" ");
    const regex = /much do (\w+) owe (\w+)/i;
    const [_, fromPerson, toPerson] = regex.exec(sentence);
    const obj : parseMemberToMemberOutput = {
        fromPerson: pronounToName(speaker, fromPerson),
        toPerson: pronounToName(speaker, toPerson)
    };
    return obj;
}

export function parse(input: string) : parseOutput {
    const words = input.split(/\s+/);
    const speaker = dropLastCharacter(R.head(words));
    const rest = R.dropWhile(notMatchesCommands, words);

    if (rest.length === 0) {
        const obj : parseOutput = {
            type: ActionType.noAction,
            speaker: speaker,
            output: null
        };
        return obj;
    }

    const command = normalizeWord(R.head(rest));
    const parameters = R.tail(rest);

    if (matches(command, "addt")) {
        const result = parseTransaction(speaker, parameters);
        const obj : parseOutput = {
            type: ActionType.addTransaction,
            speaker: speaker,
            output: result
        };
        return obj;
    } else if (matches (command, "addm")) {
        const result = parseMember(speaker, parameters);
        const obj : parseOutput = {
            type: ActionType.addMember,
            speaker: speaker,
            output: result
        }
        return obj;
    } else if (matches(command, "listm")) {
        const result = parseMember(speaker, parameters);
        const obj : parseOutput = {
            type: ActionType.listMembers,
            speaker: speaker,
            output: result
        };
        return obj;
    } else if (matches(command, "how")) {
        const result = parseMemberToMemberReport(speaker, parameters);
        const obj : parseOutput = {
            type: ActionType.listMemberToMember,
            speaker: speaker,
            output: result
        };
        return obj;
    } else if (matches(command, "export")) {
        const obj : parseOutput = {
            type: ActionType.exportTransactions,
            speaker: speaker,
            output: null
        };
        return obj;
    } else throw new Error("Invalid command");
}
