var base = require('./ModelItemPrototype');
var util = require('util');

function Message(username, date, message, sessionId, id)
{
    base.call(this);
    this.Validate();

    if (id == undefined)
        this.Id = require('node-uuid').v4();
    else
        this.Id = id;

    this.Username=username;
    this.Date=date;
    this.Message=message;
    this.SessionId=sessionId;
}

Message.prototype = Object.create(base.prototype);
Message.prototype.constructor = Message;

Message.prototype.Validate = function() {
}

module.exports = Message;