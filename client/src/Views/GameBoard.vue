<!-- client/src/components/GameBoard.vue -->
<template>
    <canvas ref="game" width="640" height="480" style="border:1px solid #000" @mousemove="mouseMove"></canvas>
</template>

<script>
import io from 'socket.io-client';
import { authState } from '../authState';
import { ref } from "vue";
export default {
    name: 'GameBoard',
    async data() {

        var user = authState.getUser();
        console.log(user);

        return {
            lastMousePos: null,
            lastInput: new Date().getTime(),
            socket: null,
            context: null,
            user: user,
            gameState: {}, // holds positions of snakes, etc.
        };
    },
    created() {
        // Connect to Socket.IO server
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            auth: {
                token: this.user.token
            }
        });
        this.socket.on('connect', () => {
            console.log('Connected to server');
            // Optionally emit an event to join a game or send user info
            this.socket.emit('joinGame', { userId: this.user.id });
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        this.socket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });
        this.socket.on('connect_timeout', (err) => {
            console.error('Connection timeout:', err);
        });
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected to server after', attemptNumber, 'attempts');
        });
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log('Attempting to reconnect to server, attempt number:', attemptNumber);
        });
        this.socket.on('reconnect_error', (err) => {
            console.error('Reconnection error:', err);
        });
        this.socket.on('reconnect_failed', () => {
            console.error('Reconnection failed');
        });
        this.socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    },
    mounted() {
        this.context = this.$refs.game.getContext('2d');
        // Listen for server updates:
        this.socket.on('stateUpdate', (state) => {
            //console.log("stateUpdate", state);
            this.gameState = state;
            this.drawGame();
        });
        // Optionally handle game start, player ID, etc.
    },
    methods: {
        // Draw the game using canvas 2D context
        drawGame() {
            const ctx = this.context;
            // console.log("gamestate", this.gameState.snakes);


            ctx.clearRect(0, 0, 640, 480);
            // Draw food and snakes (example for one snake):

            for (var key in this.gameState.snakes) {
                var snake = this.gameState.snakes[key];
                // console.log("snake", snake);
                ctx.fillStyle = snake.color;
                snake.body.forEach(cell => {
                    ctx.fillRect(cell.x, cell.y, 10, 10);
                });

            }

            // Draw food similarly...
        },


        mouseMove(e) {

            const rect = this.$refs.game.getBoundingClientRect();

            const currentMousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            //console.log("currentMousePos", currentMousePos);

            if (this.lastMousePos) {
                const direction = getMouseDirection(this.lastMousePos, currentMousePos);
                if (direction) {
                    console.log("Mouse moved:", direction);

                    this.socket.emit('move', direction);
                }
            }
            this.lastMousePos = currentMousePos;
        }
    }

};

function handleMouseMove(e) {

}


function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}


function getMouseDirection(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        return null; // Ignore small movements
    }

    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
    } else {
        return dy > 0 ? 'down' : 'up';
    }
}




function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480)
    };
}
function getRandomFood() {
    return {
        x: Math.floor(Math.random() * 640),
        y: Math.floor(Math.random() * 480),
        color: getRandomColor()
    };
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
function getRandomSnakes(count) {
    const snakes = [];
    for (let i = 0; i < count; i++) {
        snakes.push(getRandomSnake());
    }
    return snakes;
}
function getRandomFoodItems(count) {
    const foodItems = [];
    for (let i = 0; i < count; i++) {
        foodItems.push(getRandomFood());
    }
    return foodItems;
}



</script>
