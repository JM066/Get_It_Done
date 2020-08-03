var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");

const getImages = (req, res) => {
  db("SELECT * FROM images;")
    .then((results) => {
      res.send(results.data);
    })
    .catch((err) => res.status(500).send(err));
};

router.get("/", getImages);

router.post("/", (req, res) => {
  const { imagefile } = req.files;
  console.log(imagefile);

const extension = mime.extension(imagefile.mimetype);
const filename = uuidv4() + "." + extension;

var tmp_path = imagefile.tempFilePath;
var target_path = path.join(_dirname, "../public/img/") + filename;

fs.rename(tmp_path, target_path, function (err) {
  if(err) throw err;
  fs.unlink(tmp_path, function (err) {
    if(err) throw err;

    db(`INSERT INTO images (u_id, image) VALUES (1, "${filename}");`)
      .then((results) => {
        getImages(req, res);
      })
      .catch((err) => res.status(500).send(err));
  });
});
}) ;
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db(`SELECT * FROM images WHERE id = ${id}`)
  .then(results => {
    const filename = results.data[0].image
    const pathToDelete = path.join(_dirname, "../public/img/") + filename;
    fs.unlink(pathToDelete, function (err) {
    if(err) res.status(500).send(err);
    else {
      db(`DELETE FROM images WHERE id = ${id};`).then(results => {
        getImages(req, res);
      })
    }
    });
    });
});
module.exports = router;

