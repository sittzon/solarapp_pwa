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

function generateSolarChart(x, y) {
	var ctx = document.getElementById('solarChart').getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: x,
	        datasets: [{
	            label: 'W',
	            data: y,
	            backgroundColor: [
	                'rgba(255, 255, 0, 0.3)'
	            ],
	            borderColor: [
	                'rgba(255, 255, 0, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true
	                }
	            }]
	        }
	    }
	});
}

// socket.io request update from server
function requestUpdate() {
	console.log(getDate() + ": Requesting update from server");
	$('#loadingSpinner').css("visibility", "visible");
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
	socket.on('updateEnergyNow', function(powerNow,unit,lastUpdate) {
		console.log(powerNow + " " + unit);
		console.log(lastUpdate);
	    updateTextWithAnimation("powerNowAndUnit", powerNow+" "+unit);
	    updateTextWithAnimation("lastUpdate", "Latest update: "+lastUpdate);
	});
	socket.on('updateStatus', function(status) {
		console.log("Status: "+status);
	    if (status == "Online") {
			$('#status').removeClass('text-warning');
			$('#status').addClass('text-success');
	    } else {
	    	powerNow = 0;
			$('#status').removeClass('text-success');
			$('#status').addClass('text-warning');
	    }
	    updateTextWithAnimation("status", status);
	});
	socket.on('updateTemp', function(temp) {
		console.log("Temperature: "+temp);
		updateTextWithAnimation("temperature", temp);
	});
	socket.on('updateSummary', function(today, month, year, total, unit) {
		console.log("Today: "+today);
		console.log("Month: "+month);
		console.log("Year: "+year);
		console.log("Total: "+total);
		var t = "Today: "+today+" "+unit+"\n"+
			"Month: "+month+" "+unit+"\n"+
			"Year: "+year+" "+unit+"\n"+
			"Total: "+total+" "+unit;
		updateTextWithAnimation("summary", t);

	});
	socket.on('updateChart', function(xData, yData) {
		generateSolarChart(xData, yData);
	});
	socket.on('updateDone', function() {
		console.log('Update done');
		$('#loadingSpinner').css("visibility", "hidden");
	});
	socket.on('connect', () => {
		console.log(getDate() + ": Connected");
		requestUpdate();
	});
});

//Request update according to interval
setInterval(function() {
	console.log(getDate() + ": Timer fired");
	requestUpdate()
}, 180000);