const express = require('express');
const path = require('path')
const routes = require('./routes/index');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const open = require('open');
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', routes);
app.use(express.static('public'));
app.use('/icons', express.static('icons'));
app.use('/launch-screens', express.static('launch-screens'));
app.use('/favicons', express.static('favicons'));

function getDate() {
  var d = new Date();
  d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
  return d;
}

io.on('connection', (socket) => {
  socket.on('requestUpdate', (socket) => {
    console.log(getDate() + ": Received request for update from client")
    //Check latest update on server
    powerNow = 0;
    lastUpdate = "";
    unit = "W"
    fs.readFile('/Users/Mac/energy_now.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      splitString = data.split('\n')
      lastUpdate = splitString[0]
      powerNow = Number(splitString[1])
      status = Number(splitString[2])
      if (powerNow > 1000){
        //Round with one decimal
        powerNow = powerNow/100
        powerNow = Math.round(powerNow)
        powerNow = powerNow/10
        unit = "kW"
      }
      console.log(getDate() + ": Last update on server: " +lastUpdate);
      console.log("Status: "+status + "\n")
      io.emit('updateFromServer', powerNow, unit, lastUpdate, status);
    })
  })
})
  
const server = http.listen(8181, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

module.exports = http;
