const express = require('express');
const axios = require('axios');
const stringify = require('json-stringify-safe')

// intialise a new express app
const app = express();

const port = process.env.PORT || 5000;

// load dotenv config files if not in a production environment
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// initialise GitHub API details
const username = process.env.GITHUB_USERNAME
const GITHUB_API_CLIENT_ID = process.env.GITHUB_API_CLIENT_ID;
const GITHUB_API_CLIENT_SECRET = process.env.GITHUB_API_CLIENT_SECRET;


app.get('/', (req, res, next) => {
    axios.get(`https://api.github.com/rate_limit`)
    .then(response => {
        console.log(response);
    })
})


app.listen(port, () => console.log("Server has started"))
