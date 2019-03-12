const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const app = express();

const port = 3000;

// Parameter im JSON-Format und aus einem Web-Formular korrekt einlesen
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Server starten und einen Einstiegspunkt auf localhost:port/ veröffentlichen 
app.listen(port, function() {
    console.log(`Server is running on localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// CRUD (create-read-update-delete, d.h. erstellen-lesen-bearbeiten-löschen) Endpoints erstellen
const entityEndpoint = "/todos";

// dieses Array speichert alle Objekte (im Arbeitsspeicher)
var entities = [{
    id: uuidv4(),
    title: "This is the default ToDo item",
    done: false,
    createdAt: Date()
}];

// GET /todos (alle ToDos lesen)
app.get(entityEndpoint, (req, res) => {
    // unsere Variable 'entities' als JSON-Array zurückgeben
    res.json(entities);
});

// POST /todos (neues ToDo erstellen)
app.post(entityEndpoint, (req, res) => {
    // sicherstellen, dass die für ein ToDo-Item nötigen Parameter übergeben wurden (sonst Error 400 ausgeben ("Bad Request"))
    if (!req.body) return res.sendStatus(400);
    if (!req.body.title) return res.sendStatus(400);

    // das neue ToDo-Item erstellen mit dem Titel aus den Parametern
    const doneValue = req.body.done || false;
    var newEntity = {
        id: uuidv4(),
        title: req.body.title,
        done: doneValue,
        createdAt: Date()
    };

    // das neue ToDo-Item an unsere Liste anhängen und zurückgeben
    entities.push(newEntity);
    res.json(newEntity);
});

// Hilfs-Funktion, die gegeben ein Request "req" mit einem "id"-Parameter im Body ein ToDo-Item mit dieser ID sucht und ggf. zurückgibt
const findEntity = function(req, res) {
    // sicherstellen, dass ein "id"-Parameter übergeben wurde
    if (!req.body) return res.sendStatus(400);
    if (!req.body.id) return res.sendStatus(400);

    // durch unsere Liste an ToDo-Items gehen und nach einem Eintrag mit der passenden ID suchen (falls nicht gefunden Error 404 ausgeben ("Not Found"))
    var entity = entities.find((e) => e.id === req.body.id);
    if (!entity) return res.sendStatus(404);
    return entity
}

// PATCH /todos (ein existierendes ToDo-Item bearbeiten, d.h. den Titel ändern und/oder es als (nicht) "done" markieren)
app.patch(entityEndpoint, (req, res) => {
    // ToDo-Item mit der gegebenen ID suchen, damit wir es bearbeiten können
    var entity = findEntity(req, res);
    if (entity) {
        // ToDo-Item falls gefunden basierend auf den Parametern bearbeiten
        entity.done = req.body.done || entity.done;
        entity.title = req.body.title || entity.title;

        // bearbeitetes ToDo-Item zurückgeben
        res.json(entity);
    }
});

// DELETE /todos (ein existierendes ToDo-Item löschen)
app.delete(entityEndpoint, (req, res) => {
    // ToDo-Item mit der gegebenen ID suchen, damit wir wissen, dass es existiert und wir es zurückgeben können
    var entity = findEntity(req, res);
    if (entity) {
        // unsere Liste an ToDo-Items ändern, indem wir alle Items mit der gegebenen ID löschen
        entities = entities.filter((e) => e.id !== entity.id);
        // das aus der Liste gelöschte ToDo-Item zurückgeben
        res.json(entity);
    }
});