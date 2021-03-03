const app = require('express');
const router = app.Router();
const fs = require('fs');
const readline = require('readline');

var renderRoot = function (req, res, next) {
  fs.readFile('../shinemonitor_api/energy_now.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    splitString = data.split('\n');
    powerNow = Number(splitString[1])

    res.render('body', {powerNow: powerNow/1000});
  });
}

router.get('/', [renderRoot]);

module.exports = router;