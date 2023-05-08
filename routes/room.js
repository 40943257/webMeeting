var express = require('express');
const { v4: uuidV4 } = require('uuid')
var router = express.Router();
var mysql = require('mysql');
let config = require('../config');
let connection = mysql.createConnection(config);
const serverIp = require('../public/javascripts/serverIp').ip

/* GET room page. */
router.get('/', (req, res, next) => {
  res.redirect(`/room/${uuidV4()}`)
});

router.get('/:room', (req, res, next) => {
  // res.send(req.params.room)
  let sql = `SELECT * FROM cookiedata WHERE phpSessionId = '${req.cookies["PHPSESSID"]}'`
  connection.query(sql, [true], (error, results, fields) => {
      if (error) {
          return console.error(error.message);
      }
      // console.log(results.length)
      if(results.length > 0)
        res.render('room/roomId', { 
          roomId: req.params.room, 
          serverIp: serverIp
        })
      else
        res.redirect(`http://${serverIp}/htmlphp/loginpage.php`)
    })
});

module.exports = router;
