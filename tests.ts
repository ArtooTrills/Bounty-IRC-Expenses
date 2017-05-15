import {
    ActionType,
    parse,
    parseTransactionOutput,
    parseMemberOutput,
    parseMemberToMemberOutput
} from "./parser";

import * as R from "ramda";

function assert(a: any, b: any) : boolean {
    if (R.equals(a, b)) {
        return true;
    } else throw new Error("Failed Test");
}

const test1 = parse("sameer: let's build this app over the weekend");
assert(test1.type, ActionType.noAction);

const test2 = parse("sameer: @bot addt paid 600 for dinner yesterday. all");
assert(test2.type, ActionType.addTransaction);
assert(test2.speaker, "sameer");
assert((<parseTransactionOutput>test2.output).paidBy, "sameer");
assert((<parseTransactionOutput>test2.output).toPerson, "_all_");
assert((<parseTransactionOutput>test2.output).amount, 600);
assert((<parseTransactionOutput>test2.output).reason, "dinner");

const test2a = parse("sameer: @bot addt I paid 600 for dinner yesterday. all");
assert(test2a.type, ActionType.addTransaction);
assert(test2a.speaker, "sameer");
assert((<parseTransactionOutput>test2a.output).paidBy, "sameer");
assert((<parseTransactionOutput>test2a.output).toPerson, "_all_");
assert((<parseTransactionOutput>test2a.output).amount, 600);
assert((<parseTransactionOutput>test2a.output).reason, "dinner");

const test3 = parse("shubham: addt. kaushik paid 100 for coffee on Feb 3");
assert(test3.type, ActionType.addTransaction);
assert(test3.speaker, "shubham");
assert((<parseTransactionOutput>test3.output).paidBy, "kaushik");
assert((<parseTransactionOutput>test3.output).toPerson, "_all_");
assert((<parseTransactionOutput>test3.output).amount, 100);
assert((<parseTransactionOutput>test3.output).reason, "coffee");

const test4 = parse("kaushik: @bot addt I owe Dilip 50");
assert(test4.type, ActionType.addTransaction);
assert(test4.speaker, "kaushik");
assert((<parseTransactionOutput>test4.output).paidBy, "Dilip");
assert((<parseTransactionOutput>test4.output).toPerson, "kaushik");
assert((<parseTransactionOutput>test4.output).amount, 50);
assert((<parseTransactionOutput>test4.output).reason, "");

const test5 = parse("dilip: @bot addm new Shrivatsa");
assert(test5.type, ActionType.addMember);
assert(test5.speaker,"dilip");
assert((<parseMemberOutput>test5.output).name, "Shrivatsa");

const test6 = parse("kaushik: @bot addt Dilip owes me 150 for taxi");
assert(test6.type, ActionType.addTransaction);
assert(test6.speaker, "kaushik");
assert((<parseTransactionOutput>test6.output).paidBy, "kaushik");
assert((<parseTransactionOutput>test6.output).toPerson, "Dilip");
assert((<parseTransactionOutput>test6.output).amount, 150);
assert((<parseTransactionOutput>test6.output).reason, "for taxi");

const test7 = parse("niloy: how much do I owe aaditya?");
assert(test7.type, ActionType.listMemberToMember);
assert(test7.speaker, "niloy");
assert((<parseMemberToMemberOutput>test7.output).fromPerson, "niloy");
assert((<parseMemberToMemberOutput>test7.output).toPerson, "aaditya");

const test8 = parse("niloy: @bot export data");
assert(test8.type, ActionType.exportTransactions);
assert(test8.speaker, "niloy");
