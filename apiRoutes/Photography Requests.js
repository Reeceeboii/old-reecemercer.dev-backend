const express = require("express");
const router = express.Router();


// require .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


router.get("/", (req, res, next) => {
  res.status(200).send({"message":"backend request has landed"})
})


module.exports = router;
