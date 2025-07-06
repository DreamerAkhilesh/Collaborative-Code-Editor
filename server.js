const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const ACTIONS = require('./src/Actons');
const path = require('path');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
const roomCodeMap = {};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => {
        if (userSocketMap[socketId]) {
            return {
                socketId,
                username: userSocketMap[socketId]
            }
        }
        return null;
    }).filter(Boolean);
}

io.on('connection' , (socket) => {
    console.log('socket connected' , socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);

        io.in(roomId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id
        });

        // Send current code to the new user if it exists
        if (roomCodeMap[roomId]) {
            socket.emit(ACTIONS.CODE_CHANGE, { code: roomCodeMap[roomId] });
        }
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        // Store the code for this room
        roomCodeMap[roomId] = code;
        // Broadcast to all other clients in the room
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();

        // Clean up room code if no users left in the room
        rooms.forEach((roomId) => {
            const clients = getAllConnectedClients(roomId);
            if (clients.length === 0) {
                delete roomCodeMap[roomId];
            }
        });
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server listening on PORT ${PORT}`));