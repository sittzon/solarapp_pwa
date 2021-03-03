const app = require('express');
const router = app.Router();

var renderRoot = function (req, res, next) {
	res.render('body');
}

router.get('/', [renderRoot]);

module.exports = router;