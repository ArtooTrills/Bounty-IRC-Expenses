/**
* Client 'coffea' configuration
* Define host, nick, channels etc
**/

var client = require('coffea')({
  host: 'chat.freenode.net',
  nick: 'bounty-bot',
  channels: ['#caffeineryz']
});

//Use mongoose for storing the data into Schema
var mongoose = require('mongoose');
var Member = require('./models/members');

mongoose.connect('mongodb://localhost/bounty-irc');

client.on('message', function(event) {
  if(/@bot\saddm\s[a-z]/i.test(event.message)) {
    var name = event.message.split("@bot addm new")[1].trim();
    Member.find({
      name: name
    }, function(err, resp) {
      if(err) {
        event.reply('Error' + err);
      } else if(resp && resp.length == -1) {
        event.reply('Member already present');
      } else {
        var newMember = Member({
          name: name,
          nickname: '_' + name + '_'
        });
        newMember.save(function(err) {
          if(err) {
            event.reply('Member could not be save' + err);
          } else {
            event.reply(newMember.name + ' created');
          }
        });
      }
    });
  }
  //  else if(/@bot\saddt\s[a-zA-Z0-9]+/i.test(event.message)) {
  //   var desc = event.message.split("@bot addt")[1].trim();
  //   if()
  // }
});
