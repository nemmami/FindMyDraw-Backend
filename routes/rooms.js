const { json } = require("express");
var express = require("express");
var router = express.Router();
const { Rooms } = require("../models/rooms");
const { Users } = require("../models/users");
const roomModel = new Rooms();
const userModel = new Users();
//const { authorize } = require("../utils/authorize");

//create a room 
router.post("/:nbRound", async function(req, res) {
    if (!req.body)
        return res.status(400).end();
    
    const room = roomModel.createRoom(req.params.nbRound);
    
    return res.json(room)
});

//get a room
router.get("/:id", async function(req, res){
    const room = roomModel.getOne(req.params.id);
     if(!room) return res.status(404).end();

    return res.json(room);
});

//get all room open
router.get("/", async function(req, res){
    if (!req.body)
        return res.status(400).end();
    const room = roomModel.getAllRoomOpen();
    if(!room) return res.status(404).end();

    return res.json(room);
});

//get all players of a room
router.get("/allPlayers/:id", async function(req, res) {
    const players = roomModel.getAllPlayers(req.params.id);
    if(!players) return res.status(404).end();

    return res.json(players);
});


//update the player
router.put("/updateRoomId/:username", function(req, res) {
    if (!req.body
        || req.body.username)
        return res.status(400).end();
    
    const user = userModel.getOneByUsername(req.params.username);
    // Send an error code '404 Not Found' if the user was not found
    if (!user) return res.sendStatus(404);
    
    const users = userModel.updateOne(req.params.username, req.body, "username");
    return res.json(users);
});

// add a player to the room
router.put("/addPlayer/:id/:username", function(req, res) {
    if (!req.body)
        return res.status(400).end();
    
    const room = roomModel.addPlayer(req.params.id, req.params.username);
    return res.json(room);
});

router.put("/updateNbRound/:id", function(req, res){
    if (!req.body
        || req.body.id)
        return res.status(400).end();
    
    const room = roomModel.getOne(req.params.id);
    if(!room) return res.sendStatus(404);

    const rooms = roomModel.updateOne(req.params.id, req.body, "id");
    return res.json(rooms);
});

//update the player
router.put("/updatePlayers/:id", function(req, res) {
    if (!req.body
        || req.body.id)
        return res.status(400).end();
    
        const room = roomModel.getOne(req.params.id);
        if(!room) return res.sendStatus(404);
    
        const rooms = roomModel.updateOne(req.params.id, req.body, "id");
        return res.json(rooms);
});


module.exports = router;