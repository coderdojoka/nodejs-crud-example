const express = require('express');
const app = express();

// start server
const port = 3000;
app.listen(port, function() {
    console.log(`Server is running on localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// add CRUD routes for entity type
var entities = [{
    title: "This is the default item",
    done: false,
    createdAt: Date()
}];

const entityEndpoint = "/todos";
// GET 
app.get(entityEndpoint, (req, res) => {
    res.type('application/json');
    res.send(entities);
});