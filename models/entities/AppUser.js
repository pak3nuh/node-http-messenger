
var user = AppUser;

var base = require('./ModelItemPrototype');
user.prototype = Object.create(base.prototype);
user.prototype.constructor = AppUser;

function AppUser(username, password, email, id)
{
    base.call(this);

    if(AppUser.caller==AppUser.Empty) return;

    this.Validate(username, password, email);

    if(id==undefined)
        this.Id = require('node-uuid').v4();
    else
        this.Id = id;
    this.Username = username;
    this.Password = password;
    this.Email = email;
}

user.Empty = function () {
    var obj = new AppUser();
    obj.Id = null;
    obj.Username = null;
    obj.Password = null;
    obj.Email = null;
    return obj;
}
user.prototype.Validate = function (username, password, email) {
    if (username == undefined || username.trim().length == 0) throw new TypeError("Username is mandatory.");
    if(username.length>50) throw new TypeError("Username has 50 characters max.");

    if (password == undefined || password.trim().length == 0) throw new TypeError("Password is mandatory.");
    if(password.length>50) throw new TypeError("Password has 50 characters max.");

    if (email == undefined || email.trim().length == 0) throw new TypeError("Email is mandatory.");
    if(email.length>100) throw new TypeError("Email has 100 characters max.");
}

user.prototype.ValidatePassword = function (password) {
    return this.Password == password;
}

module.exports = user;