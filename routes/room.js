var express = require('express');
var router = express.Router();
var mysql = require('mysql');
let config = require('../config');
let connection = mysql.createConnection(config);
const serverIp = require('../public/javascripts/serverIp').ip

router.get('/:room', (req, res, next) => {
  let sql = `SELECT * FROM courseInfo WHERE courseId = '${req.params.room}'`
  connection.query(sql, [true], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    if (results.length > 0) {
      const now = new Date()
      const courseDateStart = new Date(`${results[0]['courseDateStart']}`)
      courseDateStart.setDate(courseDateStart.getDate() + 1)
      const datePart1 = courseDateStart.toISOString().split("T")[0];

      const courseDateEnd = new Date(`${results[0]['courseDateEnd']}`)
      courseDateEnd.setDate(courseDateEnd.getDate() + 1)
      const datePart2 = courseDateEnd.toISOString().split("T")[0];

      const startTime = new Date(`${datePart1}T${results[0]['courseTimeStart']}`)
      const endTime = new Date(`${datePart2}T${results[0]['courseTimeEnd']}`)

      if (now >= startTime && now <= endTime) {
        let sql = `SELECT * FROM cookiedata WHERE phpSessionId = '${req.cookies["PHPSESSID"]}'`
        connection.query(sql, [true], (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          console.log(results.length)
          if (results.length > 0) {
            res.render('room/roomId', {
              roomId: req.params.room,
              serverIp: serverIp
            })
          }
          else
            res.redirect(`http://${serverIp}/htmlphp/user/loginpage.php`)
        })
      }
      else {
        res.send(`
          <script>
            if(confirm('不再會議時間'))
              window.location.href = 'http://${serverIp}/htmlphp/user/joinPage.php';
            else
              window.location.href = 'http://${serverIp}/htmlphp/user/joinPage.php';
          </script>
        `)
      }
    }
    else
      res.redirect(`http://${serverIp}/htmlphp/user/joinPage.php`)
  })
  /*let sql = `SELECT * FROM cookiedata WHERE phpSessionId = '${req.cookies["PHPSESSID"]}'`
  connection.query(sql, [true], (error, results, fields) => {
      if (error) {
          return console.error(error.message);
      }
      // console.log(results.length)
      if(results.length > 0)
        res.('room/roomId', { 
          roomId: req.params.room, 
          serverIp: serverIp
        })
      else
        res.redirect(`http://${serverIp}/htmlphp/loginpage.php`)
    })*/
});

module.exports = router;
