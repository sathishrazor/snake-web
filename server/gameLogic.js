const io = require('socket.io')(server);

let position = { x: 200, y: 200 };
io.on('connection', (socket) => {
    // Send initial position
    socket.emit('stateUpdate', { position });

    // Handle client move commands
    socket.on('move', (direction) => {
        switch (direction) {
            case 'left': position.x -= 5; break;
            case 'right': position.x += 5; break;
            case 'up': position.y -= 5; break;
            case 'down': position.y += 5; break;
        }
        // Broadcast updated state to **all** clients
        io.emit('stateUpdate', { position });
    });
});
