var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const useragent = require('express-useragent');

var app = express();

app.use(cors({
    origin: '*'
}))

var indexRouter = require('./routes/index');


const port = 3000
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(useragent.express());
app.set('trust proxy', true);
app.use('/', indexRouter);

app.use((req, res, next) => {
    const ip =
        req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;

    const ua = req.useragent;

    console.log('IP:', ip);
    console.log('Device Info:', {
        platform: ua.platform,
        browser: ua.browser,
        version: ua.version,
        os: ua.os,
        isMobile: ua.isMobile,
        isDesktop: ua.isDesktop,
    });
    next();
});

app.use('/auth', authRoutes);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // your Vite/Vue dev server
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New Client Connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log('Server listening on http://localhost:3000');
});

module.exports = app;
