const express = require('express');
const path = require('path')
const routes = require('./routes/index');
const app = express();
const http = require('http').createServer(app);
//const io = require('socket.io')(http);
const open = require('open');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', routes);
app.use(express.static('public'));

const server = http.listen(8181, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

module.exports = http;
