/**
 * Just for enabling fast switch between contextes;
 * */

//var context = require("./DBContextMemory");
var context = require("./DBContextMemoryDb");

var loadInitData = true;
if (loadInitData) {
    function done(err) {
        if (err)
            console.log(err.message);
    }
    var data = require('./InitData.json');
    var AppUser = require("../entities/AppUser");
    var ChatSession = require("../entities/ChatSession");
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