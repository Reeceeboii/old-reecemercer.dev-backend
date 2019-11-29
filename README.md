# reecemercer.dev-backend
## This is currently live on a Heroku container - the root contains a webpage documenting the endpoints - view it [here](https://rm-backend-services.herokuapp.com/).

This is the backend for my websites, written using NodeJS utilising the Express.js server framework. It is responsible for dynamic content served on my [personal website](https://reecemercer.dev) and my [photography site](https://photography.reecemercer.dev). It provides integrations to a MongoDB instance and an Amazon Web Services S3 Bucket such that the frontends of these two sites can easily have access to the data they need.

The server is on a loop, mirroring my public GitHub information from the [GitHub API](https://developer.github.com/v3/) into the MongoDB instance after some arbitrary time period that I can pass to the Node runtime as an environment variable. All requests from the frontend of my personal site are referred to the DB rather than the GitHub API. This allows me to not be limited by the GitHub API request limit. This server uses authorised keys so this isn't really an issue but there's nothing wrong with designing with scalability in mind :)

In terms of the S3 Bucket, the server does nothing more than receive a list of objects in storage and generate their corresponding public URLs that it then forwards to the frontend to render.
