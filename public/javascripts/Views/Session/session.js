var myClient = new msg.Client();
var maxTimer = 30 * 1000;
var cntDefault = 3;
var timerDefault = 5 * 1000;
var timerIncrement = 2000;

var timer = timerDefault;
var cnt = cntDefault;

function manageTimer(msgArray){
	if(msgArray.length == 0){
		if(cnt>0){
			cnt--;
		} else {
			if(timer<=maxTimer){
				timer += timerIncrement;
				cnt = cntDefault;
				reloadWatcher();
			}
		}
	} else {
		timer = timerDefault;
		cnt = cntDefault;
		reloadWatcher();
	}
}

function updateDOM(msgArray){
	if(msgArray==null || !Array.isArray(msgArray))
		return;

	manageTimer(msgArray);

	function lineBreaks(input){
		var str = '';
		input.split('\n').forEach(function(line){
			str+='<p>'+line+'</p>';
		});
		return str;
	}

	msgArray.forEach(function(item){
		var elem = '<tr>'
			+ '<td>' + lineBreaks(item.Message) + '</td>'
			+ '<td>' + item.Username + '</td>'
			+ '<td>' + new Date(item.Date).toISOString() + '</td>'
			+ '</tr>'
		$('#msgTable tr:last').after(elem);
	});
	scrollDiv();
}

function scrollDiv(){
	var objDiv = document.getElementsByClassName('div-table-chatsession');
	if(objDiv.length)
		objDiv[0].scrollTop = objDiv[0].scrollHeight;
}

function reloadWatcher(){
	myClient.stopWatcher();
	myClient.startWatcher(sessionId, timer, function(err, msgArray){
		if(err)
			return;
	
		updateDOM(msgArray);
	});
}

window.addEventListener('load', function(event){
	
	$('#clientRefresh').click(function(){
		if(this.value == 'Stop Refresh'){
			myClient.stopWatcher();
			this.value = 'Start Refresh';
		} else {
			myClient.startWatcher(sessionId, timer, function(err, msgArray){
				if(err)
					return;
			
				updateDOM(msgArray);
			});
			this.value = 'Stop Refresh';
		}
	});
	
	$('#message').keypress(function(event){
		var key = event.keyCode || event.charCode || event.key || event.char; 
		
		if ((key == 10) && event.ctrlKey){
			$('#btnAsync').click();
		}
	});
	
	$('#btnAsync').click(function(){
		var msgText = $('#message');
		if(msgText.val().length > 0){
			msgText.attr('disabled','disabled');
			myClient.stopWatcher();
			myClient.sendMessage(sessionId, msgText.val(), function(err,data){
				if(err){
					msgText.removeAttr('disabled');
					reloadWatcher();
					console.log(err);
					alert('Error sending data');
					return;
				}
				
				myClient.getMessages(sessionId, function(err, msgArray){
					msgText.removeAttr('disabled');
					reloadWatcher();
					if(err)
						return;
				
					updateDOM(msgArray);
				});
			});
			msgText.val('');
			msgText.focus();
		}
	});
	
	reloadWatcher();
	scrollDiv();
});