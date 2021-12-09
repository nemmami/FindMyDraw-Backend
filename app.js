const { Socket } = require('socket.io');
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var authsRouter = require("./routes/auths");
var usersRouter = require("./routes/users");
var roomsRouter = require("./routes/rooms");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auths", authsRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

//const {addPlayer, playerLeave, playersList} = require("./models/players");
const { Rooms } = require("./models/rooms");
const { Users } = require("./models/users");
const userModel = new Users();
const roomModel = new Rooms();


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
        //let user = userModel.getOneByUsername(username);
        console.log("join:", data.id , data.username);

        roomModel.addPlayer(data.id, data.username);
        socket.broadcast.emit('broadcast',formatMessage(data.username," a rejoint la partie"));

        io.emit('playersList', {
            players : roomModel.getAllPlayers()
        });

    });

    socket.on('get rooms', () => {
        io.to(socket.id).emit('list rooms', roomModel.getAllRoomOpen());
    })
    
});

http.listen(5000, () => {
    console.log('Socket server listening on *:5000');
})

module.exports = app;
