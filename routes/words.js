var express = require("express");
const{ Words } = require("../models/words");

var router = express.Router();
const wordModel = new Words();

//add a word
router.post("/:word", async function(req, res){
  if (!req.body)
        return res.status(400).end();

        const word = wordModel.addOne(req.params.word);

        return res.json(word);
});

//get a word
router.get("/:id", async function(req, res){
  const word = wordModel.getOne(req.params.id);
  if(!room) return res.status(404).end();

  return res.json(room);
} );

module.exports = router;