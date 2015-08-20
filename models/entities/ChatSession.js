var base = require('./ModelItemPrototype');

function ChatSession(name, isPrivate, id)
{
    base.call(this);
    
    if(ChatSession.caller == ChatSession.Empty) return;
    
    this.Validate(name);

    if (id == undefined)
        this.Id = require('node-uuid').v4();
    else
        this.Id = id;

    this.Name=name;
    this.IsPrivate=isPrivate || false;
}

ChatSession.prototype = Object.create(base.prototype);
ChatSession.prototype.constructor = ChatSession;

ChatSession.prototype.Validate = function(name) {
    if(name==undefined || name.length == 0){
        var err = new Error('Name must not be empty.');
        err.userError=true;
        throw err;
    }
}

ChatSession.Empty = function(){
    var cs = new ChatSession();
    cs.Id=null;
    cs.Name=null;
    return cs;
}

module.exports = ChatSession;