const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const app = express();

const port = 3000;

// parse application/json and application/x-www-form-urlencoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// start the server and add root endpoint
app.listen(port, function() {
    console.log(`Server is running on localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// add CRUD routes for entity type
const entityEndpoint = "/todos";
var entities = [{
    id: uuidv4(),
    title: "This is the default ToDo item",
    done: false,
    createdAt: Date()
}];

// GET /todos
app.get(entityEndpoint, (req, res) => {
    // send an array of all current entities
    res.json(entities);
});

// POST /todos
app.post(entityEndpoint, (req, res) => {
    // validate that the required parameter (title) is present
    if (!req.body) return res.sendStatus(400);
    if (!req.body.title) return res.sendStatus(400);

    // create the new entity (set done to false by default)
    const doneValue = req.body.done || false;
    var newEntity = {
        id: uuidv4(),
        title: req.body.title,
        done: doneValue,
        createdAt: Date()
    };

    // save and return the new entity
    entities.push(newEntity);
    res.json(newEntity);
});

// helper method that searches for and returns an entity given a request with an id parameter
const findEntity = function(req, res) {
    // ensure the id parameter is present
    if (!req.body) return res.sendStatus(400);
    if (!req.body.id) return res.sendStatus(400);

    // find the right entity based on the given id
    var entity = entities.find((e) => e.id === req.body.id);
    if (!entity) return res.sendStatus(404);
    return entity
}

// PATCH /todos
app.patch(entityEndpoint, (req, res) => {
    // retrieve the entity so we can edit it
    var entity = findEntity(req, res);
    if (entity) {
        // update it based on the request parameters
        entity.done = req.body.done || entity.done;
        entity.title = req.body.title || entity.title;

        // return updated entity
        res.json(entity);
    }
});

// DELETE /todos
app.delete(entityEndpoint, (req, res) => {
    // retrieve the entity so we can return it (and make sure it exists)
    var entity = findEntity(req, res);

    if (entity) {
        // filter entities (removes the entity)
        entities = entities.filter((e) => e.id !== entity.id);
        // return deleted entity
        res.json(entity);
    }
});