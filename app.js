const { Socket } = require('socket.io');
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var authsRouter = require("./routes/auths");
var usersRouter = require("./routes/users");
var roomsRouter = require("./routes/rooms");
var wordsRouter = require("./routes/words");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auths", authsRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);
app.use("/words", wordsRouter);

//const {addPlayer, playerLeave, playersList} = require("./models/players");
const { Rooms } = require("./models/rooms");
const { Users } = require("./models/users");
//const { Words } = require("./models/words");
const userModel = new Users();
const roomModel = new Rooms();
//const wordModel = new Words();


let http = require("http").createServer(app);

/**
 * @type {Socket}
 */
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost", //Client here is localhost:80
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`[connection] ${socket.id}`);

    socket.on('joinRoom', (data) => {
        let room = roomModel.getOne(data.id);
        
        userModel.changeSocketIdRoomId(data.username, socket.id, data.id);
        console.log(`[create room ] - ${data.id} - ${data.username}`);

        console.log("join:", data.id, data.username);

        roomModel.addPlayer(data.id, data.username);

        socket.broadcast.emit("broadcast", `${data.username} a rejoint la partie`);
        
        socket.join(data.id);
        io.to(socket.id).emit('join room', room.id)

        if(room.players.length > 1) {
            io.to(room.id).emit('start game', room.players);
        }

        io.emit('playersList', {
            rooms : roomModel.getAllPlayers(data.id)
        });

    });

    socket.on('chat', (txt) => {
        console.log(txt);
        const username = userModel.getUserBySocketId(socket.id);
        io.emit('message', (`${username} : ${txt}`));
    });

    /*
    socket.on('get rooms', () => {
        io.to(socket.id).emit('list rooms', roomModel.getAllRoomOpen());
    });

    
    socket.on('playerList', (id) => {
        let room = roomModel.getOne(id);
        console.log(room.players);
        io.to(socket.id).emit('list players', room.players);
    });
    */
    
});

http.listen(5000, () => {
    console.log('Socket server listening on *:5000');
})

module.exports = app;
