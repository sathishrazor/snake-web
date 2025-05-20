// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');
const pg = require('pg');
const { Client } = pg

const key = require("../config/appKey");
// User registration
router.post('/register', async (req, res) => {
    try {

        const { username, password, email } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const client = new Client(config);

        await client.connect()

        //const userFindQuery = `select id from public."User" where username = '${username}';`
        const userFindQuery = `SELECT username FROM public."users" WHERE username = $1;`

        const userFindParams = [username];

        const userRes = await client.query(userFindQuery, userFindParams);

        //console.log(userRes.rows)

        if (userRes.rows.length > 0) {
            await client.end()
            return res.status(500).json({ message: 'User Already Exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // const query = `INSERT INTO public."User"( username, password) VALUES ( '${username}', '${password}');`

        const ip =
            req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;

        const ua = req.useragent;

        const queryParams = [username, hashedPassword, email, new Date(), new Date(), `${ua.platform}:${ua.browser}:${ua.version}:${ua.os}`, ip];

        const query = `INSERT INTO public."users"( username, password_hash,email,date_created,last_login,last_login_device,last_login_ip)
         VALUES ($1,$2,$3,$4,$5,$6,$7);`

        const data = await client.query(query, queryParams)

        //console.log(data.rows)

        await client.end()

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const client = new Client(config);

        await client.connect()

        //const userFindQuery = `select id from public."User" where username = '${username}';`
        const userFindQuery = `SELECT username,password FROM public."users" WHERE username = $1;`

        const userFindParams = [username];

        const userRes = await client.query(userFindQuery, userFindParams);

        console.log(userRes.rows)

        if (userRes.rows.length === 0) {
            await client.end()
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const user = userRes.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            await client.end()
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user.id }, key.secret, {
            expiresIn: '8h',
        });



        await client.end()
        res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        await client.end()
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;