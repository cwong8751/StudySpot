// init
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('test.db');

//TODO: api routes

// sign up route
app.post('/api/users/signup', (req, res) => {
    const {username, password} = req.body;

    // Validate username and password
    //TODO: better validation
    if(!username || !password){
        return res.status(400).json({error: 'Username or password empty.'})
    }

    // add user to db
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err){
        // error reporting
        if(err){
            console.error(err.message)
            return res.status(500).json({error: 'Internal server error.'})
        }

        // success
        res.status(201).json({id: this.lastID, username})
    })
})

// log in route
app.post('/api/users/login', (req, res) => {
    const {username, password} = req.body;

    // validate username and password
    //TODO: better validation
    if(!username || !password){
        res.status(400).json({error: 'Username or password empty.'})
    }

    // log in from db
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        // handle error
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // validate password
        if (row) {
            // User found, you may create a token or session here
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    });
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});