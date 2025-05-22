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
}));


var user;

var indexRouter = require('./routes/index');
const verifyToken = require('./middleware/authMiddleware');

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


var players = [];

// Game state
let gameState = {
    snakes: {},
    food: { x: 100, y: 100 }
};

// Handle client connections
io.on('connection', (socket) => {


    console.log(`New client connected: ${socket.id}`);


    socket.on('joingame', (data) => {

        console.log("joining game data", data);

        addOrUpdatePlayer(socket.id, data.userId);

        console.table(players);

        // Initialize this player’s snake
        gameState.snakes[data.userId] = getRandomSnake();
    })


    // Broadcast current state to the new player
    socket.emit('stateUpdate', gameState);


    // Handle player movement
    socket.on('move', (data) => {
        console.log("move data", data);

        console.log(`Player ${data.userId} moved ${data.direction}`);

        gameState.snakes[data.userId].setDirection(data.direction);
        gameState.snakes[data.userId].update();
        io.emit('stateUpdate', gameState);


    });


    // When a player disconnects, remove their snake
    socket.on('disconnect', () => {

        delete gameState.snakes[socket.id];

    });

});

//100 hz -> game loop
setInterval(() => {
    updateGame(gameState);
    io.emit('stateUpdate', gameState); // broadcast new state
}, 10);




function updateGame(state) {
    // Update each snake's position based on its direction
    for (const id in state.snakes) {
        const snake = state.snakes[id];
        snake.update();
    }

}


class Snake {
    constructor({ x, y, color, length, radius, speed = 4 }) {
        this.color = color;
        this.radius = radius;
        this.speed = speed;

        // Compute number of segments based on total length and diameter
        this.segmentCount = Math.floor(length / (2 * radius));
        this.body = [];

        // Initialize body (head first)
        for (let i = 0; i < this.segmentCount; i++) {
            this.body.push({ x: x - i * 2 * radius, y: y });
        }

        this.direction = 'right'; // Initial direction
        this.nextDirection = 'right';
    }

    setDirection(dir) {
        const opposite = {
            up: 'down',
            down: 'up',
            left: 'right',
            right: 'left',
        };
        if (dir !== opposite[this.direction]) {
            this.nextDirection = dir;
        }
    }

    update() {
        // Update direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = this.body[0];
        let newHead = { x: head.x, y: head.y };

        switch (this.direction) {
            case 'up': newHead.y -= this.speed; break;
            case 'down': newHead.y += this.speed; break;
            case 'left': newHead.x -= this.speed; break;
            case 'right': newHead.x += this.speed; break;
        }

        // Add new head, remove tail
        this.body.unshift(newHead);
        while (this.body.length > this.segmentCount) {
            this.body.pop();
        }


        // // Check for collisions with food
        // if (this.checkCollisionWithFood()) {
        //     this.grow();
        //     this.eatFood();
        // }

        // Check for collisions with walls
        if (this.checkCollisionWithWalls()) {
            this.handleWallCollision();
        }

        // // Check for collisions with other snakes
        // if (this.checkCollisionWithSnakes()) {
        //     this.handleSnakeCollision();
        // }




    }


    checkCollisionWithWalls() {
        const head = this.body[0];
        return (
            head.x < 0 ||
            head.x > 640 ||
            head.y < 0 ||
            head.y > 480
        );
    }


    handleWallCollision() {

        // Handle wall collision (e.g., reset position, end game, etc.)
        console.log('Wall collision detected!');

        this.gameover = true;

        this.reset();

    }


    // draw(ctx) {
    //     ctx.fillStyle = this.color;
    //     for (const segment of this.body) {
    //         ctx.beginPath();
    //         ctx.arc(segment.x, segment.y, this.radius, 0, Math.PI * 2);
    //         ctx.fill();
    //     }
    // }
}


function addOrUpdatePlayer(id, userid) {

    var player = players.find(p => p.userid === userid);
    if (player) {
        // Update existing player
        player.userid = userid;
        player.lastUpdate = new Date();
    } else {
        // Add new player
        players.push({ id, userid, lastUpdate: new Date() });
    }

}


function getRandomSnake() {
    return new Snake({
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480),
        color: getRandomColor(),
        length: 100,
        radius: 5
    });
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


server.listen(port, () => {
    console.log('Server listening on http://localhost:3000');
});

module.exports = app;
