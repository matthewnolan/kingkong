var express = require('express');
var router = express.Router();

/*
 currently this file is unused... We may wish to use it instead of index.hmtl if we intend to use a view engine.
 Right now the index.html inside public/ is served by the res.sendFile call
*
* */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
