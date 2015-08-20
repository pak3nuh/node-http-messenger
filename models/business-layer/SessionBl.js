
var dbSsn = require('../dal/DBContextChoser').ChatSession;
var dbMsg = require('../dal/DBContextChoser').Message;
var cs = require('../entities/ChatSession');
var SessionBl = {}

function checkIfSessionExists(sessionName, doneCb){
	dbSsn.find(function(item){ 
		return item.Name==sessionName; 
	}, function(err, item){
		if(err)
			return doneCb(err);

		if(item){
			var exists = new Error('Session already exists.');
			exists.userError=true;
			return doneCb(exists);
		}
		doneCb(null);
	});

}

SessionBl.add = function(session, doneCb){
	checkIfSessionExists(session.Name, function(err){
		if(err)
			return doneCb(err);

		dbSsn.add(session, function(addErr, insCnt){
			if(addErr)
				return doneCb(addErr);

			doneCb(null, insCnt);
		});
	});
}

SessionBl.getChatSessions = function(incPrivate, doneCb){
	dbSsn.get(
		function(item){
			return incPrivate || !item.IsPrivate;
		}
		,doneCb
	);
}

SessionBl.findChatSession = function(predicate, doneCb){
	dbSsn.find(predicate, doneCb);
}

SessionBl.getChatMessages = function(sessionId, doneCb){
	dbMsg.get(function(item){
		return item.SessionId == sessionId;
	}
	,function(err, objArray){
		return doneCb(err,objArray);
	});
}

SessionBl.addMessage = function(message, doneCb){
	dbMsg.add(message,doneCb);
}


module.exports = SessionBl;