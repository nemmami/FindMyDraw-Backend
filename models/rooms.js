const { parse, serialize } = require("../utils/json");
//var escape = require("escape-html");
const { Users } = require("./users");

const jsonDbPath = __dirname + "/../data/rooms.json";

const defaultItems = [];

class Rooms {
  constructor(dbPath = jsonDbPath, items = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = items;
  }

  getNextId() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (items.length === 0) nextId = 1;
    else nextId = items[items.length - 1].id + 1;

    return nextId;
  }

  /**
   * Returns all items
   * @returns {Array} Array of items
   */
  getAll() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    return items;
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  getOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;

    return items[foundIndex];
  }

  /**
   * Delete a item in the DB and return the deleted item
   * @param {number} id - id of the item to be deleted
   * @returns {object} the item that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = items.splice(foundIndex, 1);
    serialize(this.jsonDbPath, items);

    return itemRemoved[0];
  }

  /**
   * Update a item in the DB and return the updated item
   * @param {number} idValue - id of the item to be updated
   * @param {object} body - it contains all the data to be updated
   * @param {number} idKey - key (or name) of the attribute to be used as id (id by default)
   * @returns {object} the updated item or undefined if the update operation failed
   */
  updateOne(idValue, body, idKey = "id") {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = items.findIndex((item) => item[idKey] == idValue);
    if (foundIndex < 0) return;
    // create a new object based on the existing item - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updateditem = { ...items[foundIndex], ...body };
    // replace the item found at index : (or use splice)
    items[foundIndex] = updateditem;

    serialize(this.jsonDbPath, items);
    return updateditem;
  }

  /**
   * Add a item in the DB and returns the added item (containing a new id)
   * @param {object} body - it contains all required data to create a item
   * @returns {object} the item that was created (with id)
   */
  createRoom(nbRound, nbPlayers) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const room = {
      id: this.roomId(),
      nbPlayers: nbPlayers,
      nbRound: nbRound,
      players: [],
      host: "",
      winner: "",
      open: true,
    };
    //let allUser = new Users();
    //let user = allUser.getOneByUsername(username);
    //user.roomId = room.id;
    //room.players.push(user);
    items.push(room);
    serialize(this.jsonDbPath, items);

    return room;
  }

  addPlayer(id, username) {
    let room = this.getOne(id);
    let tabRoom = room.players;

    let present = false;
    tabRoom.forEach(function (e) {
      //console.log(e);
      if (e === username) present = true;
    });

    if (present === false) {
      // on recup toutes les info sur la room
      let idR = room.id;
      let nbPlayersR = room.nbPlayers;
      let nbRoundR = room.nbRound;
      let playersR = room.players;
      let hostR = room.host;
      let winnerR = room.winner;
      let openR = room.open;

      let tab = room.players;
      // donner un host à la room
      if (tab.length === 0) hostR = username;

      // on ajoute le jouer dans la room
      tab.push(username);
      playersR = tab;

      // on met à jour la room
      this.deleteOne(id);
      return this.addRoomById(
        idR,
        nbPlayersR,
        nbRoundR,
        playersR,
        hostR,
        winnerR,
        openR
      );
    }
  }

  // afficher tous les user de la room
  getAllPlayers(id) {
    let user = this.getOne(id);
    return user.players;
  }

  getAllRoomOpen() {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const newTab = [];
    items.forEach(function (e) {
      if (e.open === true) newTab.push(e);
    });
    console.log(newTab);
    return newTab;
  }

  addRoomById(id, nbPlayers, nbRound, players, host, winner, open) {
    const items = parse(this.jsonDbPath, this.defaultItems);
    const room = {
      id: id,
      nbPlayers: nbPlayers,
      nbRound: nbRound,
      players: players,
      host: host,
      winner: winner,
      open: open,
    };
    items.push(room);
    serialize(this.jsonDbPath, items);

    return room;
  }

  roomId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

module.exports = { Rooms };
