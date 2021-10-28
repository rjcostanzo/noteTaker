const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
var port_number = process.env.PORT || 8080;
const mainDir = path.join(__dirname, '/public');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// The following HTML routes should be created:
// 
// -  `GET /notes` should return the `notes.html` file.
// -  `GET *` should return the `index.html` file.
// 

// The following API routes should be created:
// 
// -  `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
// -  `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` 
//      file, and then return the new note to the client.
// 

app.get('/notes', function(req, res) 
    {
        res.sendFile(path.join(mainDir, 'notes.html'));
    }
);

app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      res.json(JSON.parse(data));
    });
  });

app.get('/api/notes/:id', function(req, res) 
    {
        var savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        res.json(savedNotes[Number(req.params.id)]);
    }
);

app.post('/api/notes', function(req, res) 
    {
        var newNote = req.body;
        var savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        var uniqueID = (savedNotes.length).toString();
        newNote.id = uniqueID;
        savedNotes.push(newNote);

        fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
        console.log('db.json updated with ', newNote);
        res.json(savedNotes);
    }
);

app.get('*', function(req, res) 
    {
        res.sendFile(path.join(mainDir, 'index.html'));
    }
);

app.listen(port_number, function() 
    {
        console.log(`Listening on port ${port_number}.`);
    }
);