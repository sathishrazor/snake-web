var express = require('express');
var router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const config = require('../config/dbconfig');
const pg = require('pg');
const { Client } = pg
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dashboard', verifyToken, async function (req, res, next) {

  const client = new Client(config);

  await client.connect()

  //const userFindQuery = `select id from public."User" where username = '${username}';`
  const userFindQuery = `SELECT username,email,high_score,profile_thumb,last_login_ip,last_login_device,date_created,last_login FROM public."users" WHERE username = $1 limit 1;`

  const userFindParams = [req.userId];

  const userRes = await client.query(userFindQuery, userFindParams);

  console.log(userRes.rows)

  if (userRes.rows.length === 0) {
    await client.end()
    return res.status(404).json({ error: 'Data not found' });
  }

  res.status(200).json(userRes.rows[0]);

  await client.end()

});

module.exports = router;
