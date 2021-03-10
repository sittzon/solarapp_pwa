function getDate() {
	var d = new Date();
	d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
	return d;
}

document.addEventListener('visibilitychange', () => {
  console.log(document.visibilityState);
  if (document.visibilityState == 'visible') {
  	requestUpdate();
  }
});

/*
function getElementsStartsWithId( id ) {
	var children = document.body.getElementsByTagName('*');
	var elements = [], child;
	for (var i = 0, length = children.length; i < length; i++) {
		child = children[i];
		if (child.id.substr(0, id.length) == id) {
			elements.push(child);
		}
	}
	return elements;
}
*/
// socket.io request update from server
function requestUpdate() {
	console.log(getDate() + ": Requesting update from server");
	var socket = io();
	socket.emit('requestUpdate');
}

function updateTextWithAnimation(elName, newText) {
	var el = $('#'+elName);
	el.text(newText);
	el.addClass('update-bkg');

	var elm = document.getElementById(elName);
	var newone = elm.cloneNode(true);
	elm.parentNode.replaceChild(newone, elm);
}

$(function () {
	var socket = io();
	socket.on('updateFromServer', function(powerNow,unit,lastUpdate,status) {
		console.log(powerNow + " " + unit);
		console.log(lastUpdate);
		console.log("Status: "+status);

		var power = document.getElementById("powerNowAndUnit");
		var lastUpdateText = document.getElementById("lastUpdate");
		var statusObj = document.getElementById("status");

    if (status == 0) {
    	status = "Online";
			$('#status').removeClass('text-warning');
			$('#status').addClass('text-success');
    } else {
    	status = "Offline"
    	powerNow = 0;
			$('#status').removeClass('text-success');
			$('#status').addClass('text-warning');
    }

    updateTextWithAnimation("powerNowAndUnit", powerNow+" "+unit);
    updateTextWithAnimation("lastUpdate", lastUpdate);
    updateTextWithAnimation("status", status);
	});
	socket.on('connect', () => {
		console.log(getDate() + ": Connected");
		requestUpdate();
	})
});

//Request update every minute
setInterval(function() {
	console.log(getDate() + ": Timer fired");
	requestUpdate()
}, 30000);