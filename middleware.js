const express = require('express');
const app = express();

const myAPIRequests = require('./apiRoutes/Non-GitHub API Requests');
const photographyRequests = require('./apiRoutes/Photography Requests')

// setting up base API endpoints
app.use('/myRepoAPI', myAPIRequests);
app.use('/photography', photographyRequests);

module.exports = app;
