const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res, next) => {
    res.json({
        message: "Hello from backend!"
    })
})


app.listen(port, () => console.log("Server has started"))
