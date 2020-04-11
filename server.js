// import express from the node library
const express = require("express");
// import path from node library
const path = require("path");
// import fs from node library
const fs = require("fs");

const app = express();
const uuidv1 = require('uuid/v1');

const data = fs.readFileSync("./db/db.json", "utf8");

// import db.json
const notesDB = JSON.parse(data);

const finalNotesDB = Object.keys(notesDB).map(i => notesDB[i]);


// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

// Create API routes to be created:
// GET /api/notes - should read the db.json file and return all saved notes as JSON

app.get("/api/notes", function(req, res) {
    res.json(finalNotesDB);
  });

// POST /api/notes - Should receive a new note to save on a request body
app.post("/api/notes", function(req,res){

  const { title, text } = req.body;
  const newNote = { title, text, id: uuidv1() };

  finalNotesDB.push(newNote);

  // take the combined data and write to the db.json file
  fs.writeFile("db/db.json", JSON.stringify(finalNotesDB, null, 2), function(error){
    if (error) {
      console.log(error);
    }
})
    // return the new note to the client
    res.json(finalNotesDB);
})

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', function (req, res) {
finalNotesDB.splice(req.params.id, 1)

fs.writeFile("./db/db.json", JSON.stringify(finalNotesDB), function (err) {
  if (err) {
    throw err;
  }
})
 res.json(true);
})

// LISTENER - starts the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });

