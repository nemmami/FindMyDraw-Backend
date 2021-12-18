var express = require("express");
const { Words } = require("../models/words");

var router = express.Router();
const wordModel = new Words();

//add a word
router.post("/:word", async function (req, res) {
  if (!req.body) return res.status(400).end();

  const word = wordModel.addOne(req.params.word);

  return res.json(word);
});

//get a random word
router.get("/", async function (req, res) {
  return res.json(wordModel.getOneRandom());
});

module.exports = router;
