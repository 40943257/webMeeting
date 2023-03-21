var express = require('express');
const { v4: uuidV4 } = require('uuid')
var router = express.Router();

/* GET room page. */
router.get('/', (req, res, next) => {
  res.redirect(`/room/${uuidV4()}`)
});

router.get('/:room', (req, res, next) => {
  // res.send(req.params.room)
  res.render('room/roomId', { roomId: req.params.room })
});

module.exports = router;
