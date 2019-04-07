const express = require("express");
const axios = require("axios");

const mongoose = require('mongoose');
const repoSchema = require('./mongooseSchemas/repo');


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
const MONGOOSE_CONNECTION_STRING = process.env.MONGOOSE_CONNECTION_STRING;

mongoose.connect(MONGOOSE_CONNECTION_STRING, { useNewUrlParser: true }).then( () => console.log("Database connected!"))

const axiosRequestHeaders = {
    params: {
        client_id: GITHUB_API_CLIENT_ID,
        client_secret: GITHUB_API_CLIENT_SECRET
    }
}


function getMyRepos() {
  axios.get(`https://api.github.com/users/${username}/repos`, axiosRequestHeaders)
  .then(response => response.data)
  .then(response => {
      for(let repo in response){
          const newRepo  = new repoSchema({
              _id: new mongoose.Types.ObjectId(),
              name: response[repo].name,
              desc: response[repo].description,
              link: response[repo].html_url,
              starCount: response[repo].stargazers_count,
              language: response[repo].language,
              forks: response[repo].forks
          })
          newRepo
          .save()
          .then( () => {
              console.log(`Repo ${repo} was created`)
          })
          .catch(err => {
              console.log(err);
          })
      }
  })
}

getMyRepos();

//setInterval(getMyRepos, 1000);

app.listen(port, () => console.log(`Server listening @${port}`));
