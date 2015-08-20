var express = require("express");
var router = express.Router();
var htmlP = require('../models/presentation-layer/HtmlPresentation');
var SModel = require('../models/entities/ChatSession');
var MsgModel = require('../models/entities/Message');

//**************************AUX FUNC
function createSessionModel(req){
	var model = new SModel(req.body.sessionName, req.body.isPrivate);
	return model;
}
function createMessageModel(req){
	var usr = req.user ? req.user.Username : 'NoUserTest';
	var model = new MsgModel(
		usr,
		Date.now(),
		req.body.message,
		req.params.sId
	);
	return model;
}

//**************************NEW SESSION

router.get('/new',function(req, res, next){
	res.render('Messenger/new');
});

router.post('/new', function(req,res,next){
	res.locals.errorView='Messenger/new';
	try{
		res.locals.model = createSessionModel(req);
		return next();
	}catch(ex){
		next(ex);
	}
	
}, function(req,res,next){
	var session = res.locals.model;
	htmlP.addChatSession(session,function(err, insCnt){
		if(err)
			return next(err);
		
		res.redirect(303, '/session/' + session.Id);
	});
});


//**************************ERROR NEW SESSION
router.use(function(err,req,res,next){
	var errorView = res.locals.errorView || 'error';
	var model = SModel.Empty();
	model.Name = req.body.sessionName;
	model.IsPrivate = req.body.isPrivate; 
	res.render(errorView, {model:model, errorModalMessage:err.message, errorModalTitle:'Error'});
});

//**************************NEW MESSAGE
router.post('/:sId/message/new', function(req,res,next){
	try{
		res.locals.model = createMessageModel(req);
		return next();
	}catch(ex){
		next(ex);
	}
	
}, function(req,res,next){
	var message = res.locals.model;
	htmlP.addMessage(message,function(err, insCnt){
		if(err)
			return next(err);
		
		res.redirect(303, '/session/' + req.params.sId);
	});
});

//**************************GET SESSION LIST
router.get('/',function(req, res, next){
	htmlP.getChatSessions(false, function(err,objArray){
		res.locals.errorView='error';
		if(err)
			return next(err);
			
		var model = {model: objArray};

		res.render('Messenger/index',model);
	});
	
});

//**************************SESSION
router.get('/:sId'
	//Finds session
	,function(req,res,next){
		htmlP.getChatSessionDetail(req.params.sId, function(err, sObj){
			if(err)
				return next(err);
			if(sObj==null){
				err = new Error('Session does not exists');
				return next(err);
			}
			
			res.locals.chatSession = sObj;
			return next();
		});	
	}
	//Renders view
	,function(req,res,next){
		res.render('Messenger/session');
	}
);

//**************************ERROR MAIN
router.use(function(err,req,res,next){
	var errorView = 'error'; 
	res.render(errorView, {message:err.message, error:err.stack});
});


module.exports=router;