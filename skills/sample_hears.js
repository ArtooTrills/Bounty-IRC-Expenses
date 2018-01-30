/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/
const models = require('../models');
const async = require('async');
const uuidv4 = require('uuid/v4');

module.exports = function(controller) {

    controller.hears(['^hello *'], 'direct_message,direct_mention,mention', function(bot, message) {
        console.log(message)
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });

    controller.hears(['^addm *'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.reply(message, "Add member : started");
        text = message.text.split(/[ ,]+/)
        if (/^<.*?>$/.test(text[1])) {
            var slack_id = text[1].replace(/<@/, '').replace(/>/, '')
            bot.api.users.info(
                {user: slack_id},
                (error, response) => {
                    if (error){
                        bot.reply(message, 'Add member failed');
                    } else {
                        // console.log(response.user)
                        var user_data = {
                            name: response.user['profile']['real_name'],
                            nickName: response.user['profile']['display_name'],
                            slackId: slack_id,
                            createdAt: Date.now()
                        }
                        models.Members.create(user_data).then(
                            function(Member) {
                                bot.reply(message, 'Add member successful');
                            }
                            ).catch(
                                function(err){
                                    console.log(err);
                                    bot.reply(message, 'Add member failed');
                                }
                            )
                    }
            });
        } else {
            bot.reply(message, "Not a slack user");
            if (text.length > 2){
                user_data = {
                    nickName: text[2],
                    name: text[1]
                }
            } else {
                user_data = {
                    nickName: text[1],
                    name: text[1]
                }
                user_data['slackId'] = '';
                user_data['createdAt'] = Date.now();
            }

            models.Members.create(user_data).then(
                function(Member) {
                    bot.reply(message, 'Add member successful');
                }
                ).catch(
                    function(err){
                        console.log(err['errors']);
                        bot.reply(message, 'Add member failed');
                    }
                )
        }
    });

    controller.hears(['^addt *'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.reply(message, "Add transaction : started")
        var err_reply_msg = 'Invalid message type '
        err_reply_msg += 'message show have the following format '
        err_reply_msg +=  ' {spender} paid {amount} for {reason} on {date}. [{receiver}] OR '
        err_reply_msg +=  ' {receiver} owes {spender} {amount} [for {reason} on {date}]'
        var t_list = message.text.toLowerCase().split(/[ ,]+/)
        var cmd_index = t_list.indexOf('addt')
        var last_index = t_list.length - 1
        var continue_flag = true
        var message_user = message.user

        if (/^(.*?(\bpaid\b)[^$]*)$/i.test(message.text)){
            var paid_index = t_list.indexOf('paid')
            var for_index = t_list.indexOf('for')
            var on_index = t_list.indexOf('on')
            var with_index = t_list.indexOf('with')
            var tnx_data = {type:'spent','desc' : message.text}

            // processing message.text to idendify raw transactional data

            // gathering spender(one who gives money) info
            if (continue_flag && paid_index != -1) {
                if (paid_index-cmd_index == 1){
                    tnx_data['spender'] = 'i';
                } else {
                    tnx_data['spender'] = t_list.slice(cmd_index+1, paid_index).join(' ');
                }
            }else {
                continue_flag = false
            }

            // gathering amount
            if (continue_flag && for_index != -1){
                tnx_data['amount'] = t_list[paid_index+1];
            }
            else{
                bot.reply(message, reply_msg)
                continue_flag = false
            }

            // gathering reason and Transaction date
            if (continue_flag && on_index != -1){
                tnx_data['reason'] = t_list.slice(for_index+1, on_index).join(' ')
                if (with_index != -1){
                    tnx_data['transactionDate'] = t_list.slice(on_index+1, with_index)
                }else{
                    tnx_data['transactionDate'] = t_list.slice(on_index+1, last_index+1)
                }

            } else if (continue_flag && on_index == -1){
                // if on is not there in message_text look for today, yesterday
                tnx_data['reason'] = t_list.slice(for_index+1, last_index-1).join(' ')
                yesterday_index = t_list.indexOf('yesterday')
                today_index = t_list.indexOf('today')
                if (yesterday_index == -1 && today_index == -1){
                    // default transaction date is 'today'
                    tnx_data['transactionDate'] = 'today'
                } else if (yesterday_index != -1) {
                    tnx_data['transactionDate'] = 'yesterday'
                } else if (today_index != -1){
                    tnx_data['transactionDate'] = 'today'
                }
            }

            // gathering receiver(one who owns money to spender) information
            if (continue_flag && with_index != -1){
                var all_index = t_list.indexOf('all')
                if (all_index != -1 && all_index == last_index) {
                    tnx_data['receiver'] = []
                    models.Members.findAll(
                        { attributes: ['nickName'] }
                    ).then(function(members){
                        for (i=0; i<members.length; i++) {
                            tnx_data['receiver'][i] = members[i].nickName
                        }
                    }).catch(function(err){
                        continue_flag = false
                    })
                } else {
                    tnx_data['receiver'] = t_list.slice(with_index+1, last_index+1)
                    // concat sender to receiver because transaction between two ppl should create 2 transactions in db
                    tnx_data['receiver'].concat([tnx_data['sender']])

                }
            } else {
                tnx_data['receiver'] = ['me']
            }

            //continue flag failed hence returning error msg
            if (continue_flag == false){
                bot.reply(message, err_reply_msg)
                return
            }
            // processing transaction data to store in db

        }else if(/^(.*?(\bowe(s)?\b)[^$]*)$/i.test(message.text)){

            var owe_index = t_list.indexOf('owe')
            if (owe_index == -1){
                owe_index = t_list.indexOf('owes')
            }
            var for_index = t_list.indexOf('for')
            var on_index = t_list.indexOf('on')
            var tnx_data = {type:'owe', 'desc' : message.text}

            // processing message.text to idendify raw transactional data

            // gathering spender(one who gives money) and receiver(one who owns money to spender) information
            if (continue_flag && owe_index != -1){
                tnx_data['spender'] = t_list[owe_index+1]
                tnx_data['amount'] = t_list[owe_index+2]
                if (owe_index-cmd_index == 1){
                    tnx_data['receiver'] = ['me']
                } else {
                    tnx_data['receiver'] = t_list.slice(cmd_index+1, owe_index)
                }
            } else { continue_flag = false }


            // gathering  info
            if (continue_flag && for_index != -1){
                if (on_index == -1){
                    tnx_data['reason'] = t_list.slice(for_index+1, last_index + 1).join(' ')
                }else {
                    tnx_data['reason'] = t_list.slice(for_index+1, on_index).join(' ')
                }
            } else { continue_flag = false}

            if (continue_flag && on_index != -1){
                tnx_data['transactionDate'] = t_list.slice(on_index+1, last_index+1)
            }else{
                if (t_list[last_index] == 'yesterday'){
                    tnx_data['transactionDate'] = 'yesterday'
                } else {
                    tnx_data['transactionDate'] = 'today'
                }
            }
        }else {
            bot.reply(message, err_reply_msg)
            return
        }

        console.log(tnx_data);
        console.log('------------------------------------');
        async.waterfall([
            function _fetchMessageUserFromDB(callback) {
                models.Members.findOne({
                    where: {slackId: message.user}
                }).then( function(member){
                    if (member){
                        callback(null, member)
                    }
                }).catch( function(err){
                    callback(err, null)
                })
            },
            function _processRawTransactionData(current_member, callback){
                receivers = tnx_data['receiver']
                var tnx_dict = {}
                var current_member = current_member

                async.each(receivers,
                    function _processEachWaterfall(receiver, each_callback){
                        var wf_error_flag = false
                        var wf_error = null
                        async.waterfall([
                            function _createTransactionObjectData(process_callback){
                                var error_flag = false
                                var error = null
                                try{
                                    tnx_dict[receiver] = {
                                        desc: tnx_data['desc'],
                                        type: tnx_data['type'],
                                        reason: tnx_data['reason'],
                                        createdAt: Date.now(),
                                        id: uuidv4(),
                                        //rev: receiver,
                                    }
                                }catch(err){
                                    error_flag = true
                                    error = err
                                }
                                if (error_flag){
                                    process_callback(error, null);
                                }else{
                                    //console.log(tnx_dict);
                                    process_callback(null, tnx_dict);
                                }
                            },
                            function _getAmount(tnx_dict, process_callback){
                                var error_flag = false
                                var err = null
                                try {
                                    total_amount = parseFloat(tnx_data['amount'])
                                    tnx_dict[receiver]['amount'] = parseFloat(total_amount / tnx_data['receiver'].length)
                                } catch(err) {
                                    error_flag = true
                                    error = err
                                }
                                if (error_flag){
                                    process_callback(error, null)
                                }else{

                                    process_callback(null, tnx_dict);
                                }
                            },
                            function _getTransactionDate(tnx_dict, process_callback){
                                var error_flag = false
                                var err = null
                                try {
                                    if (tnx_data['transactionDate'] == 'today'){
                                        tnx_dict[receiver]['transactionDate'] = new Date()
                                    }else if (tnx_data['transactionDate'] == 'yesterday'){
                                        var today = new Date();
                                        var yesterday = new Date(today);
                                        yesterday.setDate(today.getDate() - 1);
                                        tnx_dict[receiver]['transactionDate'] = yesterday
                                    } else {
                                        console.log('------------280-------------------')
                                        tdate = tnx_data['transactionDate']

                                        var today = new Date()
                                        if (tnx_data['transactionDate'].length==2){
                                            t_date = tnx_data['transactionDate'].join(' ')
                                            var cur_year = today.getFullYear()
                                            var last_year = cur_year - 1
                                            var cur_year_date = new Date(Date.parse( t_date + ' ' + cur_year))
                                            var last_year_date = new Date(Date.parse(t_date + ' ' + last_year))
                                            if (cur_year_date > today) {
                                                // meaning date is of future
                                                tnx_dict[receiver]['transactionDate'] = last_year_date
                                            } else {
                                                tnx_dict[receiver]['transactionDate'] = cur_year_date
                                            }
                                            //process_callback(null, tnx_dict);
                                        } else if (tdate.length==3){
                                            t_date = tnx_data['transactionDate'].join(' ')
                                            given_date = new Date(Date.parse(t_date))

                                            if (given_date <= today) {
                                                tnx_dict[receiver]['transactionDate'] = given_date

                                            }else{
                                                error = 'Incorrect transaction date :' + tnx_data['transactionDate']
                                                error_flag = true
                                            }
                                        }// endif len=3
                                    }// endelse

                                }catch (err){
                                    error_flag = true
                                    error = err
                                }
                                console.log('-------------317-----------------')
                                if (error_flag){
                                    process_callback(error, null)
                                }else{
                                    process_callback(null, tnx_dict);
                                }
                            },
                            function _getReceiverDetails(tnx_dict, process_callback){
                                if (receiver == 'i' || receiver == 'me'){
                                    if (current_member){
                                        console.log('-------------328-----------------')
                                        tnx_dict[receiver]['receiver'] = current_member.id
                                        process_callback(null, tnx_dict);
                                    }
                                } else {
                                    console.log('-------------333-----------------')
                                    models.Members.findOne({
                                        where: {nickName: receiver}
                                    }).then( function(member){
                                        if (member){
                                            console.log('-------------336-----------------')
                                            tnx_dict[receiver]["receiver"] = member.id
                                            process_callback(null, tnx_dict);
                                        }
                                    }).catch( function(err){
                                        process_callback(err, null)
                                    });
                                }
                            },
                            function _getSenderDetails(tnx_dict, process_callback){
                                spender = tnx_data['spender']
                                console.log('-------------349-----------------')
                                if (spender == 'i' || spender == 'me' || spender == 'self'){
                                    if (current_member){
                                        console.log('-------------351-----------------')
                                        tnx_dict[receiver]["spender"] = current_member.id
                                        process_callback(null, tnx_dict);
                                    }
                                } else {
                                    models.Members.findOne({
                                        where: {nickName: spender}
                                    }).then( function(member){
                                        if (member){
                                            tnx_dict[receiver]["spender"] = member.id
                                            process_callback(null, tnx_dict);
                                        }else{
                                            err = spender + ' member not found'
                                            process_callback(err, null)
                                        }
                                    }).catch( function(err){
                                        if (err){
                                            console.log(err)
                                            process_callback(err, null)
                                        }

                                    });
                                }
                            },

                            // function _printTran(tnx_dict, process_callback){
                            //     var error_flag=false
                            //     var error = null
                            //     try{
                            //         console.log('=====================')
                            //         console.log(receiver)
                            //         console.log(tnx_dict)
                            //         console.log('=====================')
                            //     }catch(err)
                            //     {
                            //         error_flag = true
                            //         error = err
                            //     }

                            //     if (error_flag){
                            //         process_callback(error, null)
                            //     }else{
                            //         process_callback(null, tnx_dict);
                            //     }
                            // }

                        ], function(error, result) {
                            if (error){
                                wf_error_flag = true
                                wf_error = error
                            } else {
                                console.log( '_processRawTransactionData for receiver ' + receiver + ' : successfully')
                                //process_callback(null)
                            }
                            console.log('------------406-----------')
                            each_callback(error)

                        }); // end async waterfall
                },
                function (error){
                        if (error){
                            console.log(error)
                            callback(error)
                        }else {
                            console.log('async each completed===================')
                            callback(null, tnx_dict)
                        }
                    }); // end async.each
            },
            function _saveAllTransactions(transaction_dict, callback){
                // console.log(transaction_dict)
                tnx_records =  Object.keys(transaction_dict).map(
                    function(key){
                        return transaction_dict[key];
                    });
                console.log(tnx_records)
                models.Transactions.bulkCreate(tnx_records).then(function(records){
                    if (records){
                        //console.log(records);
                        if (records){
                            callback(null, records)
                        }
                    }
                }).catch(function(err){
                    if (err){
                        console.log(err);
                        callback(err, null)
                    }
                })
            },
        ], function(error, result) {
                if (error) {
                    bot.reply(message, err_reply_msg)
                }else{
                    bot.reply(message, 'Transaction added successfully')
                }
        });// end async waterfall
    });
};
