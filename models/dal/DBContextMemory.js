

//*******************************TABLES********************************
var context = new Object();
var db = require('db-context').Memory;

var AppUser = require("../entities/AppUser");
context.AppUser = new db.Table("AppUser",AppUser);
var ChatSession = require("../entities/ChatSession");
context.ChatSession = new db.Table("ChatSession", ChatSession);
var Message = require("../entities/Message");
context.Message = new db.Table("Message", Message);

//*******************************DUMMY DATA********************************
var loadInitData = true;
if (loadInitData) {
    function done(err) {
        if (err)
            console.log(err.message);
    }
    var data = require('./InitData.json')
    for (var i = 0; i < data.Users.length; i++) {
        var u = new AppUser(data.Users[i].Username,
            data.Users[i].Password,
            data.Users[i].Email,
            data.Users[i].Id);
        console.log('Adding user ', u);
        context.AppUser.add(u, done);
    }
    for (var i = 0; i < data.Sessions.length; i++) {
        var u = new ChatSession(data.Sessions[i].Name,
            data.Sessions[i].Private,
            data.Sessions[i].Id);
        console.log('Adding Session ', u);
        context.ChatSession.add(u, done);
    }
}

module.exports = context;