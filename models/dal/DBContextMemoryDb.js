
var Database = require('memory-db');
var db = new Database();
function callback(error, data){
	console.log('Create table : ',data );
}
db.createTable('ChatSession',callback);
db.createTable('Message',callback);
db.createTable('AppUser',callback);

function DbOperations(tableName){
	this.add = function(item, doneCb){
		db.addRecord(tableName, item, doneCb);
	}
	this.find = function(predicate, doneCb){
		db.findRecord(tableName, predicate, doneCb);
	}
	this.get = function(predicate, doneCb){
		db.getRecords(tableName, predicate, doneCb);
	}
	this.setClosure = db.setClosure;
}

var context = {
	ChatSession:new DbOperations('ChatSession'),
	Message:new DbOperations('Message'),
	AppUser:new DbOperations('AppUser')
};

module.exports=context;