const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const repoSchema = require("../mongooseSchemas/repo");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

router.get("/get-repos-from-db", (req, res, next) => {
  const repos = repoSchema
    .find({})
    .exec()
    .then(repos => res.status(200).json(repos));
});

router.get("/language-stats", (req, res, next) => {
  let languages = {};
  const repos = repoSchema
    .find({})
    .exec()
    .then(repos => {
      for (let repo in repos) {
        if(!(languages.hasOwnProperty(repos[repo].language))){
          languages[repos[repo].language] = 1;
        }else{
          languages[repos[repo].language] = languages[repos[repo].language] += 1;
        }
      }
    })
    .then( () => {
      res.status(200).send(languages)
    })
});

module.exports = router;
