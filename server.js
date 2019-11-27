const express = require("express");
const axios = require("axios");

const mongoose = require('mongoose');
const repoSchema = require('./mongooseSchemas/repo');

// importing my middleware
const middleware = require('./middleware');

// intialise a new express app
const app = express();

const port = process.env.PORT || 5000;

const databaseRefreshRate = process.env.DATABASE_REFRESH_RATE;

// load dotenv config files if not in a production environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// initialise GitHub API details
const username = process.env.GITHUB_USERNAME;
const GITHUB_API_CLIENT_ID = process.env.GITHUB_API_CLIENT_ID;
const GITHUB_API_CLIENT_SECRET = process.env.GITHUB_API_CLIENT_SECRET;

// initialise MongoDB connection details
const MONGOOSE_CONNECTION_STRING = process.env.MONGOOSE_CONNECTION_STRING;

mongoose.connect(MONGOOSE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => console.log("Database connected!"))

// define GitHub API keys in a header const ready for use with Axios
const axiosRequestHeaders = {
    params: {
        client_id: GITHUB_API_CLIENT_ID,
        client_secret: GITHUB_API_CLIENT_SECRET
    }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(middleware);

app.get("/", (req, res, next) => {
  res.status(200).send('GitHub API requests: /myRepoAPI/[request] | Photography API requests: /photography/[request]')
});


/*
remove previous repo documents from Mongo collection; call this
before generating new documents as to prevent duplicates
*/
function removePreviousRepos() {
    const repos = repoSchema.find({})
    .then(repos => {
        for(let repo in repos){
            repoSchema.findByIdAndDelete(repos[repo]._id)
            .then(doc => {
                console.log(`Repo ID '${doc._id}' was deleted`)
            })
        }
    });
}

/*
makes a fresh call to the GitHub API, and for every repo returned by the call,
create and store a new instance of the repoSchema in the collection
*/
function updateRepoDocuments() {
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
          // check Heroku logs for these
          .then( () => {
              console.log(`Repo number ${repo} was created`)
          })
          .catch(err => {
              console.log(err);
          })
      }
  })
}

function repoUpdateLogic(){
  removePreviousRepos(); // remove previous repos before updating collection with new ones
  updateRepoDocuments(); // query API and update Mongo collection with fresh documents
}

// schedule updates every 10 minutes if in production environment, else there is no need
if(process.env.NODE_ENV == 'production'){
  setInterval(repoUpdateLogic, databaseRefreshRate);
}else{
  console.log("not in production");
}

app.listen(port, () => console.log(`Server listening @${port}`));
