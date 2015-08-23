var myClient = new msg.Client();

function updateDOM(msgArray){
	if(msgArray==null || !Array.isArray(msgArray))
		return;

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

window.addEventListener('load', function(event){
	var timer = 5 * 1000;
	
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
	
	myClient.startWatcher(sessionId, timer, function(err, msgArray){
		if(err)
			return;
	
		updateDOM(msgArray);
	});
	
	$('#btnAsync').click(function(){
		var msgText = $('#message');
		if(msgText.val().length > 0){
			myClient.sendMessage(sessionId, msgText.val(), function(err,data){
				if(err){
					console.log(err);
					alert('Error sending data');
					return;
				}
				
				myClient.getMessages(sessionId, function(err, msgArray){
					if(err)
						return;
				
					updateDOM(msgArray);
				});
			});
			msgText.val('');
			msgText.focus();
		}
	});
	
	scrollDiv();
});