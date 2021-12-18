const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");

const jsonDbPath = __dirname + "/../data/words.json";

const defaultItems = [
  {
    id: 1,
    word: "test",
  },
];

class Words {
  constructor(dbPath = jsonDbPath, words = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = words;
  }

  getNextId() {
    const words = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (words.length === 0) nextId = 1;
    else nextId = words[words.length - 1].id + 1;

    return nextId;
  }

  /**
   * Returns the item identified by id
   * @param {number} id - id of the item to find
   * @returns {object} the item found or undefined if the id does not lead to a item
   */
  getOne(id) {
    const words = parse(this.jsonDbPath, this.defaultItems);
    const foundIndex = words.findIndex((item) => item.id == id);
    if (foundIndex < 0) return;

    return words[foundIndex];
  }

  /**
   * Add a word in the DB and returns the added word (containing a new id)
   * @param {object} body - it contains all required data to create a word
   * @returns {object} the word that was created (with id)
   */

  addOne(body) {
    const words = parse(this.jsonDbPath, this.defaultPizzas);

    const newWord = {
      id: this.getNextId(),
      word: body,
    };
    words.push(newWord);
    serialize(this.jsonDbPath, words);
    return newWord;
  }

  getOneRandom() {
    const words = parse(this.jsonDbPath, this.defaultItems);

    let randomId = Math.floor(Math.random() * words.length);

    return words[randomId];
  }
}

module.exports = { Words };
