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


var players = {};

// Game state
let gameState = {
    snakes: {},
    food: { x: 100, y: 100 }
};

// Handle client connections
io.on('connection', (socket) => {


    console.log(`New client connected: ${socket.id}`);


    socket.on('joingame', (data) => {
        console.log(`Player ${socket.id} joined the game`);

        console.log("joining game data", data);

        // Initialize this player’s snake
        gameState.snakes[data.userId] = {
            body: [{ x: 320, y: 240 }],
            dir: 'up', color: "#00FF00"
        };
    })



    // Notify client of its own player ID, etc. (optional)
    socket.emit('init', { playerId: socket.id });

    // Broadcast current state to the new player
    socket.emit('stateUpdate', gameState);


    // Handle player movement
    socket.on('move', (data) => {
        console.log(`Player ${data.userId} moved ${data.direction}`);

        gameState.snakes[data.userId].dir = direction;
        io.emit('stateUpdate', gameState);


    });

    // When a player disconnects, remove their snake
    socket.on('disconnect', () => {
        delete gameState.snakes[socket.id];
    });

});


setInterval(() => {
    updateGame(gameState);         // update snake positions, collisions, food, etc.
    io.emit('stateUpdate', gameState); // broadcast new state
}, 100);



function updateGame(state) {
    // Update each snake's position based on its direction
    for (const id in state.snakes) {
        const snake = state.snakes[id];
        const head = snake.body[0];
        let newHead = { x: head.x, y: head.y };
        switch (snake.dir) {
            case 'up': newHead.y -= 5; break;
            case 'down': newHead.y += 5; break;
            case 'left': newHead.x -= 5; break;
            case 'right': newHead.x += 5; break;
        }
        // Add new head to the snake's body
        snake.body.unshift(newHead);
        // Remove the last segment of the snake's body
        snake.body.pop();
        // Check for collisions with food
        if (newHead.x === state.food.x && newHead.y === state.food.y) {
            // Grow the snake
            snake.body.push({}); // Add an empty segment to grow the snake
            // Respawn food at a random position
            state.food.x = Math.floor(Math.random() * 640);
            state.food.y = Math.floor(Math.random() * 480);
        }
        // Check for collisions with walls or itself
        if (newHead.x < 0 || newHead.x > 640 || newHead.y < 0 || newHead.y > 480 ||
            snake.body.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            // Reset the snake's position
            snake.body = [{ x: 320, y: 240 }];
        }
    }
    // // Check for collisions between snakes
    // const snakeIds = Object.keys(state.snakes);
    // for (let i = 0; i < snakeIds.length; i++) {
    //     const snakeA = state.snakes[snakeIds[i]];
    //     for (let j = i + 1; j < snakeIds.length; j++) {
    //         const snakeB = state.snakes[snakeIds[j]];
    //         if (snakeA.body[0].x === snakeB.body[0].x && snakeA.body[0].y === snakeB.body[0].y) {
    //             // Reset both snakes' positions
    //             snakeA.body = [{ x: 320, y: 240 }];
    //             snakeB.body = [{ x: 320, y: 240 }];
    //         }
    //     }
    // }
    // // Check for collisions with food
    // for (const id in state.snakes) {
    //     const snake = state.snakes[id];
    //     const head = snake.body[0];
    //     if (head.x === state.food.x && head.y === state.food.y) {
    //         // Grow the snake
    //         snake.body.push({}); // Add an empty segment to grow the snake
    //         // Respawn food at a random position
    //         state.food.x = Math.floor(Math.random() * 640);
    //         state.food.y = Math.floor(Math.random() * 480);
    //     }
    // }

}


class Snake {
    constructor({ x, y, color, length, radius, speed = 2 }) {
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


server.listen(port, () => {
    console.log('Server listening on http://localhost:3000');
});

module.exports = app;
