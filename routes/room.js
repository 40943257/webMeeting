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
      const courseDateStart = new Date()
      courseDateStart.setTime(results[0].courseDateStart)
      let [hour, minute, second] = results[0].courseTimeStart.split(":")
      courseDateStart.setHours(hour)
      courseDateStart.setMinutes(minute)
      courseDateStart.setSeconds(second)

      const courseDateEnd = new Date()
      courseDateEnd.setTime(results[0].courseDateEnd)
      let [hour2, minute2, second2] = results[0].courseTimeEnd.split(":")
      courseDateEnd.setHours(hour2)
      courseDateEnd.setMinutes(minute2)
      courseDateEnd.setSeconds(second2)

      // console.log(courseDateStart.toString())
      // console.log(courseDateEnd.toString())

      if (now >= courseDateStart && now <= courseDateEnd) {
        let sql = `SELECT userAccount FROM cookiedata WHERE phpSessionId = '${req.cookies["PHPSESSID"]}'`
        connection.query(sql, [true], (error, results2, fields) => {
          if (error) {
            return console.error(error.message);
          }

          if (results2.length > 0) {
            if (results[0].openCourse == 1) {
              res.render('room/roomId', {
                roomId: req.params.room,
                serverIp: serverIp
              })
            }
            else {
              sql = `SELECT userInfo.userClass
                          FROM userInfo INNER JOIN coursemember ON userInfo.userClass = coursemember.courseMember 
                          WHERE coursemember.courseId ='${req.params.room}' and userInfo.userAccount = '${results2.userAccount}'`
              connection.query(sql, [true], (error, results3, fields) => {
                if (error) {
                  res.send('error')
                }
                console.log(results3.length)
                if (results3.length > 0) {
                  res.render('room/roomId', {
                    roomId: req.params.room,
                    serverIp: serverIp
                  })
                }
                else
                  res.redirect(`http://${serverIp}/htmlphp/user/joinPage.php`)
              })
            }
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
});

module.exports = router;
