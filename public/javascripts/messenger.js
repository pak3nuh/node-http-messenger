
window.addEventListener('load',function(data){
	if($("#errorModalMessage").html().length>0)
		$("#errModal").modal();
});

var msg={}

msg.Client = function(){
	if($ == null){
		console.log('jquery ($) not found');
		return null;
	}
	
	var lastSyncTime = Date.now();
	
	function getMessages(sessionId, callback){
		var url = '/api/session/' 
			+ sessionId 
			+ '/message?starting='
			+ lastSyncTime;
		
		$.ajax(url, {
			error: function(jqXHR, textStatus, errorThrown ){
				console.log('Error on get messages');
				console.log('Err type: ' + textStatus);
				console.log('Err thrown: ' + errorThrown);
				callback(errorThrown);
			},
			success:function(data,textStatus,jqXHR ){
				var objData = JSON.parse(data);
				if(Array.isArray(objData) && objData.length>0){
					lastSyncTime = objData[objData.length-1].Date;
				}

				callback(null, objData);
			}
		});
	}
	this.getMessages = getMessages;
	
	function sendMessage(sessionId, message, callback){
		var url = '/api/session/' 
			+ sessionId 
			+ '/message/new';
		
		$.ajax(url, {
			type:'POST',
			data:{
				message:message
			},
			error: function(jqXHR, textStatus, errorThrown ){
				console.log('Error on send message');
				console.log('Err type: ' + textStatus);
				console.log('Err thrown: ' + errorThrown);
				callback(errorThrown);
			},
			success:function(data,textStatus,jqXHR ){
				callback(null, data);
			}
		});
	}
	this.sendMessage = sendMessage;
	
	var watcher;
	this.startWatcher = function startWatcher(sessionId, timeFrame, callback){
		watcher = setTimeout(function(){
			
			getMessages(sessionId, callback);
			
			startWatcher(sessionId, timeFrame, callback);
		} , timeFrame);
	}
	this.stopWatcher = function(){
		clearTimeout(watcher);
	}
	
}