// init
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./test.db');

app.use(cors()); // setup server to use cors for testing
app.use(express.json())

//TODO: api routes

// sign up route
app.post('/api/users/signup', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    //TODO: better validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username or password empty.' })
    }

    // add user to db
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
        // error reporting
        if (err) {
            console.error(err.message)
            return res.status(500).json({ error: 'Internal server error.' })
        }

        // success
        res.status(201).json({ id: this.lastID, username })
    })
})

// log in route
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;

    console.log(username)
    console.log(password)

    // validate username and password
    //TODO: better validation
    if (!username || !password) {
        res.status(400).json({ error: 'Username or password empty.' })
    }

    // log in from db
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        // handle error
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log(row)

        // validate password
        if (row) {
            // User found, you may create a token or session here
            res.json({ message: 'Login successful', username: username });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    });
})

// get all user information for a single user 
app.post('/api/users/getOne', (req, res) => {
    const { username } = req.body;

    // null check
    if (!username) {
        res.status(400).json({ error: 'Username or password empty.' })
    }

    // get all info for that user 
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        // handle error
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log("got user info: ");
        console.log(row)

        // validate password
        if (row) {
            // User found, you may create a token or session here
            res.json({ message: 'got user info successful', row });
        } else {
            res.status(401).json({ error: 'Something went wrong' });
        }
    });
});

// get all tables 
app.get('/api/tables/getAll', (req, res) => {
    // Get all tables
    const query = 'SELECT * FROM tables';
    console.log('Executing query:', query);

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Retrieved all tables:', rows);
        res.status(200).json({
            message: 'Successfully retrieved all tables',
            data: rows
        });
    });
});

// user reports they are at a table add capacity
app.post('/api/tables/iAmHere', (req, res) => {
    console.log(req.body);
    const { curCapacity, tableId } = req.body;

    console.log(curCapacity);
    console.log(tableId);

    // stupid check
    if (!tableId || !curCapacity) {
        return res.status(400).json({ error: 'Table ID or capacity empty.' })
    }

    // add capacity
    const newCapacity = curCapacity + 1;

    // add user to db
    db.run('UPDATE tables SET capacity = ? WHERE id = ?', [newCapacity, tableId], function (err) {
        // error reporting
        if (err) {
            console.error(err.message)
            return res.status(500).json({ error: 'Internal server error.' })
        }

        // success
        res.status(200).json({ message: 'Capacity updated successfully.' })
    });
});


// add a table
app.post('/api/tables/addTable', (req, res) => {
    const { tableName, location, numChairs, poNearby, tNearby, lat, lon } = req.body;

    // stupid check
    if (!tableName || !capacity) {
        return res.status(400).json({ error: 'Table name or capacity empty.' })
    }

    // add user to db
    db.run('INSERT INTO tables (table_number, location, num_chairs, power_outlet_nearby, toilet_nearby, capacity, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [tableName, location, numChairs, poNearby, tNearby, 0, lat, lon], function (err) {
        // error reporting
        if (err) {
            console.error(err.message)
            return res.status(500).json({ error: 'Internal server error.' })
        }

        // success
        res.status(200).json({ message: 'Table added successfully.' })
    }
    );
}
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});