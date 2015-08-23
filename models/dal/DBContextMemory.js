

//*******************************TABLES********************************
var context = new Object();
var db = require('db-context').Memory;

var AppUser = require("../entities/AppUser");
context.AppUser = new db.Table("AppUser",AppUser);
var ChatSession = require("../entities/ChatSession");
context.ChatSession = new db.Table("ChatSession", ChatSession);
var Message = require("../entities/Message");
context.Message = new db.Table("Message", Message);

module.exports = context;