var express = require('express');
var router = express.Router();
const serverIp = require('../public/javascripts/serverIp').ip

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
  res.render('logout', { serverIp: serverIp });
});

module.exports = router;
