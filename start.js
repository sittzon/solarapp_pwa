const express = require('express');
const path = require('path')
const routes = require('./routes/index');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const open = require('open');
const fs = require('fs');
const request = require('request');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', routes);
app.use(express.static('public'));
app.use('/icons', express.static('icons'));
app.use('/launch-screens', express.static('launch-screens'));
app.use('/favicons', express.static('favicons'));
app.use('/body-scroll-lock', express.static('node_modules/body-scroll-lock/lib'));
app.use('/chartjs', express.static('node_modules/chart.js'));

var backend_url = "https://api:443/"

function getDate() {
  var d = new Date();
  d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
  return d;
}

io.on('connection', (socket) => {
  socket.on('requestUpdate', (socket) => {
    console.log(getDate() + ": Received request for update from client")
    request.get({url:backend_url+"Status",rejectUnauthorized: false},function(err, res, body) {
      if (err) {return console.log(err)}
      var jsonData = JSON.parse(body);
      status = jsonData.status;
      //console.log(status);
      io.emit('updateStatus', status);
    });
    request.get({url:backend_url+"EnergyNow",rejectUnauthorized: false},function(err, res, body) {
      if (err) {return console.log(err)}
      var jsonData = JSON.parse(body);
      //console.log(jsonData)
      lastUpdate = jsonData.date;
      powerNow = jsonData.energy;
      unit = jsonData.unit;
      if (powerNow > 1000){
        //Round with one decimal
        powerNow = powerNow/100
        powerNow = Math.round(powerNow)
        powerNow = powerNow/10
        unit = "kW"
      }
      io.emit('updateFromServer', powerNow, unit, lastUpdate);
    });
    request.get({url:backend_url+"Timeline",rejectUnauthorized: false},function(err, res, body) {
      if (err) {return console.log(err)}
      var jsonData = JSON.parse(body);
      var x = [1000];
      var y = [1000];
      for (i = 0; i < jsonData.length; i++) {
        x[i] = jsonData[i].timeStamp.substring(11).substring(0,5) //Time
        y[i] = jsonData[i].value*1000; //Power
      }
      io.emit('updateChart', x, y);
    });
    request.get({url: 'http://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.349/lat/56.678/data.json'},function(err, res, body) {
      if (err) {return console.log(err)}
      //Find Temperature object
      var jsonData = JSON.parse(body);
      const key = Object.keys(jsonData.timeSeries[0].parameters).find(user => jsonData.timeSeries[0].parameters[user].name === 't')
      const temp = jsonData.timeSeries[0].parameters[key].values[0] + "°C";
      //console.log(temp)
      io.emit('updateTemp', temp);
    });
  })
})
  
const server = http.listen(8181, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

module.exports = http;