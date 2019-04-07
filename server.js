const express = require("express");
const axios = require("axios");
const mongoose = require('mongoose');
const util = require('util')

// intialise a new express app
const app = express();

const port = process.env.PORT || 5000;

// load dotenv config files if not in a production environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// initialise GitHub API details
const username = process.env.GITHUB_USERNAME;
const GITHUB_API_CLIENT_ID = process.env.GITHUB_API_CLIENT_ID;
const GITHUB_API_CLIENT_SECRET = process.env.GITHUB_API_CLIENT_SECRET;

const axiosRequestHeaders = {
    params: {
        client_id: GITHUB_API_CLIENT_ID,
        client_secret: GITHUB_API_CLIENT_SECRET
    }
}


app.get("/myRepos", (req, res, next) => {
  axios.get(`https://api.github.com/users/${username}/repos`, axiosRequestHeaders)
  .then(response => response.data)
  .then(response => {
      for(let repo in response){
          console.log(response[repo].name + " " + response[repo].stargazers_count)
      }
  })

})

app.listen(port, () => console.log("Server has started"));
