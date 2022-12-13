const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser } = require('./utils/users.js');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot'

// run when client connects 
io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // welcome current user 
        socket.emit('message', formatMessage(botName, 'Welcome to ChatApp!'));

        // broadcast when user connects
        socket.broadcast
            .to(user.room).
            emit('message', formatMessage(botName, 'A user has joined the chat!'));
    });

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('User', msg));
    })

    // runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));