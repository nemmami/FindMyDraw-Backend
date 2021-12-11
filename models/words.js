const { parse, serialize } = require("../utils/json");
var escape = require("escape-html");

const jsonDbPath = __dirname + "/../data/words.json";

const defaultItems = [{
  id: 1,
  word: "test"
}];

class Words{
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
   * Returns all items
   * @returns {Array} Array of items
   */
   getAll() {
    const words = parse(this.jsonDbPath, this.defaultItems);
    return words;
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
   * Add a pizza in the DB and returns the added pizza (containing a new id)
   * @param {object} body - it contains all required data to create a pizza
   * @returns {object} the pizza that was created (with id)
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

  /**
   * Delete a pizza in the DB and return the deleted pizza
   * @param {number} id - id of the pizza to be deleted
   * @returns {object} the pizza that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const words = parse(this.jsonDbPath, this.defaultPizzas);
    const foundIndex = words.findIndex((word) => word.id == id);
    if (foundIndex < 0) return;
    const itemRemoved = words.splice(foundIndex, 1);
    serialize(this.jsonDbPath, words);

    return itemRemoved[0];
  }

}

module.exports = { Words };