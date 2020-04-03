// import express from the node library
const express = require("express");
// import path from node library
const path = require("path");
// import fs from node library
const fs = require("fs");

const app = express();

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
    res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
  });

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../Develop/public/notes.html"));
  });

// Create API routes to be created:
// GET /api/notes - should read the db.json file and return all saved notes as JSON

app.get("/api/notes", function(req, res) {
    res.json(finalNotesDB);
  });

// POST /api/notes - Should receive a new note to save on a request body
app.post("/api/notes", function(req,res){

  notesDB.push(req.body);

  // take the combined data and write to the db.json file
  //(notesDB, null, 2),
  fs.writeFile("./db/db.json", JSON.stringify(notesDB, null, 2), function(error){
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
app.delete('/api/tables/:Id', (req, res) => {
    // Should receive a query parameter containering the id of a note to delete.
    // This means you'll need to find a way to give each not a unique id when it's saved.
    // In order to delete a note, you'll need to read all notes from the db.json file; remove the note with the given id property, and then rewrite the notes to the db.json file
});

// LISTENER - starts the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });

