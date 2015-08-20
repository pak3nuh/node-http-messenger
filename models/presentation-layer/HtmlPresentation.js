
var htmlP = module.exports;
var blSsn = require('../business-layer/SessionBl');

/**
 * Returns chat sessions
 */
htmlP.getChatSessions = function(incPrivate, doneCb){
	blSsn.getChatSessions(incPrivate,doneCb);
}

/**
 * Returns chat session and its messages
 */
htmlP.getChatSessionDetail = function(sessionId, doneCb){
	blSsn.findChatSession(function(item){
		return 	item.Id = sessionId;
	}
	,function(err, itemFound){
		if(err)
			return doneCb(err);
		
		if(itemFound==null)
			return doneCb(null,null);
		
		blSsn.getChatMessages(sessionId, function(err, objArray){
			
			itemFound.messages = objArray;
			
			return doneCb(err,itemFound);
		});
		
	});
}

htmlP.findChatSession = function(predicate,doneCb){
	blSsn.findChatSession(predicate,doneCb);
}

htmlP.addChatSession = function(session, doneCb){
	blSsn.add(session, doneCb);
}

htmlP.addMessage = function(message, doneCb){
	blSsn.add(message,doneCb);
}