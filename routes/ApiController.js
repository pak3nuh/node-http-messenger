var router = require('express').Router();

var bl = require('../models/business-layer/SessionBl');
var MsgModel = require('../models/entities/Message');

router.get('/session/:sId/*',function(req,res,next){
	bl.findChatSession(function(item){
		return item.Id == req.params.sId;
	}
	,function(err, sObj){
		if(err)
			return next(err);
			
		if(sObj==null){
			err = new Error('Session does not exists');
			err.status=404;
			return next(err);
		}
		
		res.locals.chatSession = sObj;
		return next();
	});
});

router.get('/session/:sId/message', function(req,res,next){
	bl.getChatMessages(res.locals.chatSession.Id, function(err, objArray){
		if(err)
			return next(err);

		var tmp =[];
		var starting = Number(req.query.starting);
		objArray.forEach(function(item, idx){
			//Items retreived using Object.create
			if(starting < item.Date)
				tmp.push(Object.getPrototypeOf(item));
		});
		
		return res.status(200).json(JSON.stringify(tmp));
	});
});

router.post('/session/:sId/message/new', function(req,res,next){
	try{
		var usr = req.user ? req.user.Username : 'NoUserTest';
		var model = new MsgModel(usr, Date.now(), req.body.message, req.params.sId);
		res.locals.model = model;
		return next();
	}catch(ex){
		next(ex);
	}
}, function(req,res,next){
	var message = res.locals.model;
	bl.addMessage(message,function(err, insCnt){
		if(err)
			return next(err);
		
		res.status(200).send();
	});
});

router.use(function(err,req,res,next){
	var status = err.status || 500;
	res.status(status).json({error:err.message});
});

module.exports = router;