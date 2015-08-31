
var Exp = function MenuItem(link, innerHtml, children, _class){
	this.link = link;
	this.innerHtml = innerHtml;
	this.children = children;
	this.class = _class;
}

Exp.guest = [new Exp('/users/register','Sign Up', null, 'glyphicon glyphicon-user')
	, new Exp('/users/login','Login', null, 'glyphicon glyphicon-log-in')];

Exp.user = [new Exp('/session','List Sessions', null, null)
	, new Exp('/users/logout','Logout', null, 'glyphicon glyphicon-log-out')];

module.exports = Exp; 