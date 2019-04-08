const express = require('express');
const app = express();

const myAPIRequests = require('./apiRoutes/Non-GitHub API Requests');


app.use('/myRepoAPI', myAPIRequests);

module.exports = app;
