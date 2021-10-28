const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const port = 5555;
const mainDir = path.join(__dirname, '/public');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// The following HTML routes should be created:
// 
// -  `GET /notes` should return the `notes.html` file.
// -  `GET *` should return the `index.html` file.
// 

app.get('/notes', function(req, res) 
    {
        res.sendFile(path.join(mainDir, 'notes.html'));
    }
);

app.get('*', function(req, res) 
    {
        res.sendFile(path.join(mainDir, 'index.html'));
    }
);

// The following API routes should be created:
// 
// -  `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
// -  `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` 
//      file, and then return the new note to the client.
// 

app.get('/api/notes', function(req, res) 
    {
        res.sendFile(path.join(__dirname, './db/db.json'));
    }
);

app.get('/api/notes/:id', function(req, res) 
    {
        let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        res.json(savedNotes[Number(req.params.id)]);
    }
);

app.post('/api/notes', function(req, res) 
    {
        let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        let newNote = req.body;
        let uniqueID = (savedNotes.length).toString();
        newNote.id = uniqueID;
        savedNotes.push(newNote);

        fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
        console.log('db.json updated with ', newNote);
        res.json(savedNotes);
    }
);

app.listen(port, function() 
    {
        console.log(`Listening on port ${port}.`);
    }
);