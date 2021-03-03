var authorized = false;

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

function authorize() {
	var machineButtons = getElementsStartsWithId('machineButton');
	for (i = 0; i < machineButtons.length; i++) {
		machineButtons[i].classList.remove('btn-default');
		machineButtons[i].disabled = false;
		machineButtons[i].classList.add('btn-primary');
	}
	authorized = true;
}

function deAuthorize() {
	var machineButtons = getElementsStartsWithId('machineButton');
	for (i = 0; i < machineButtons.length; i++) {
		machineButtons[i].classList.remove('btn-primary');
		machineButtons[i].disabled = true;
		machineButtons[i].classList.add('btn-default');
	}
	authorized = false;
};

function decreasePinsTimeLeft() {
	var pinsTimeLeft = document.getElementById("pinsTimeLeft");
	var timeLeft = pinsTimeLeft.innerHTML.split(',');
	var timeLeftResult = "";

	for (i = 0; i < timeLeft.length; i++) {
		var timeLeftInt = parseInt(timeLeft[i]);
		if (timeLeftInt > 0) {
			timeLeftInt -= 1;
		}
		timeLeftResult += timeLeftInt.toString()
		if (i < timeLeft.length - 1) {
			timeLeftResult += ',';
		}
	}
	timeLeftResult = timeLeftResult.substr(0, timeLeftResult.length);
	pinsTimeLeft.innerHTML = timeLeftResult;
};

function updateButtonClasses() {
	var pinsTimeLeft = document.getElementById("pinsTimeLeft");
	var machineButtons = getElementsStartsWithId('machineButton');
	var timeLeft = pinsTimeLeft.innerHTML.split(',');

	for (i = 0; i < timeLeft.length; i++) {
		var timeLeftInt = parseInt(timeLeft[i]);
		if (authorized) {
			machineButtons[i].disabled = false;
		}
		else {
			machineButtons[i].disabled = true;
		}

		if (timeLeftInt > 0) {
			machineButtons[i].classList.remove('btn-default');
			machineButtons[i].classList.add('btn-success');
		}
		else if (timeLeftInt == 0) {
			machineButtons[i].classList.remove('btn-success');
			machineButtons[i].classList.add('btn-default');
		}
	}
}

function updateButtonText() {
	var pinsTimeLeft = document.getElementById("pinsTimeLeft");
	var machineButtons = getElementsStartsWithId('machineButton');
	var machineNames = document.getElementById("machineNames");
	var timeLeft = pinsTimeLeft.innerHTML.split(',');
	var mNames = machineNames.innerHTML.split(',');
	for (i = 0; i < timeLeft.length; i++) {
		var timeLeftInt = parseInt(timeLeft[i]);
		if (timeLeftInt > 0) {
			machineButtons[i].innerHTML = mNames[i] + ' ' + timeLeft[i] + 's kvar'
		}
		else {
			machineButtons[i].innerHTML = mNames[i]
		}
	}
}

function updateTimerAndButtons() {
	decreasePinsTimeLeft();
	updateButtonClasses();
	updateButtonText();
}

//socket.io function to send start machine event to server
function startMachine(machineNr) {
	var socket = io();
	socket.emit('startMachine', machineNr);
}

//socket.io function to handle authorization and machine started events from server
$(function () {
	var socket = io();
	socket.on('authorized', function(msg) {
		console.log('Authorized: '+msg);
		if(msg) {
			authorize();
		}
		else {
			deAuthorize();
		}
	});
	socket.on('machineStarted', function(msg) {
		location.reload(true);
	});
});

//Update timers and classes every second
setInterval(function() {
	updateTimerAndButtons();
}, 1000);

updateTimerAndButtons();