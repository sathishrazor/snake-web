var express = require('express');
var router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dashboard', verifyToken, function (req, res, next) {

  res.json({
    title: 'dashboard',
    highscore: 245,
    user: req.user,
    profile: "/images/tile_0_0.jpg",
    lastlogin: "2023-10-01 12:00:00",
    lastloginip: ""
  });

});

module.exports = router;
