
var dbSsn = require('../dal/DBContextChoser').ChatSession;
var dbMsg = require('../dal/DBContextChoser').Message;
var cs = require('../entities/ChatSession');
var SessionBl = {}

function checkIfSessionExists(sessionName, doneCb){
	dbSsn.setClosure({sessionName:sessionName});
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
	dbSsn.setClosure({incPrivate:incPrivate});
	dbSsn.get(
		function(item){
			return incPrivate || !item.IsPrivate;
		}
		,doneCb
	);
}

SessionBl.findChatSessionById = function(sessionId, doneCb){
	dbSsn.setClosure({sessionId:sessionId});
	dbSsn.find(function(item){
		return item.Id == sessionId;
	}, doneCb);
}

SessionBl.getChatMessages = function(sessionId, doneCb){
	dbMsg.setClosure({sessionId:sessionId});
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