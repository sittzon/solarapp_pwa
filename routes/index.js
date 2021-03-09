const app = require('express');
const router = app.Router();
const readline = require('readline');

var renderRoot = function (req, res, next) {
  res.render('body');
}

router.get('/', [renderRoot]);

module.exports = router;