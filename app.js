const { Socket } = require("socket.io");
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
const { Words } = require("./models/words");
const userModel = new Users();
const roomModel = new Rooms();
const wordModel = new Words();

let http = require("http").createServer(app);

/**
 * @type {Socket}
 */
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost", //Client here is localhost:80
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[connection] ${socket.id}`);

  socket.on("joinRoom", (data) => {
    let room = roomModel.getOne(data.id);

    userModel.changeSocketIdRoomId(data.username, socket.id, data.id);
    console.log(`[create room ] - ${data.id} - ${data.username}`);

    console.log("join:", data.id, data.username);

    roomModel.addPlayer(data.id, data.username);

    socket.broadcast.emit("broadcast", `${data.username} a rejoint la partie`);

    socket.join(data.id);
    io.to(socket.id).emit("join room", room.id);

    if (room.players.length > 1) {
      io.to(room.id).emit("start game", room.players);
    }

    io.emit("playersList", {
      rooms: roomModel.getAllPlayers(data.id),
    });
  });

  //lancer la partie
  socket.on("start-game", () => {
    //socket recup un mot aléatoire
    socket.on("find-word", () => {
      let word = wordModel.getOneRandom();
      console.log(word);
      io.emit("get-word", { word });
    });

    //Socket  reset le timer
    socket.on("start-timer", () => {
      io.emit("reset-timer");
    });

    //Socket round
    socket.on("start-round", () => {
      io.emit("get-round");
    });
  });

  //socket.on('canvas', (data) => socket.broadcast.emit('drawing', data));

  //socket canvas
  socket.on("mouse", (data) => {
    console.log(data.x, data.y);
    io.emit("mouse", data);
  });

  //socket chat
  socket.on("chat", (txt) => {
    console.log(txt);
    const username = userModel.getUserBySocketId(socket.id);
    console.log(username);
    io.emit("message", userModel.formatMessage(username.username, txt));
  });
});

http.listen(5000, () => {
  console.log("Socket server listening on *:5000");
});

module.exports = app;
