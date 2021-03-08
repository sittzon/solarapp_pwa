const app = require('express');
const router = app.Router();
const fs = require('fs');
const readline = require('readline');

var renderRoot = function (req, res, next) {
  fs.readFile('/Users/Mac/energy_now.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    splitString = data.split('\n')
    lastUpdate = splitString[0]
    powerNow = Number(splitString[1])
    unit = "W"
    if (powerNow > 1000){
      //Round with one decimal
      powerNow = powerNow/100
      powerNow = Math.round(powerNow)
      powerNow = powerNow/10
      unit = "kW"
    }

    res.render('body', {powerNow: powerNow, unit:  unit, lastUpdate: lastUpdate});
  });
}

router.get('/', [renderRoot]);

module.exports = router;