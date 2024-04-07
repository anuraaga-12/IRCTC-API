const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'train_system'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).send('Unauthorized: User not logged in');
    }
    // If user is logged in, proceed to next middleware/route handler
    next();
};

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the train system!');
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, password, isAdmin } = req.body;
    const query = `INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)`;
    db.query(query, [username, password, isAdmin], (err, result) => {
        if (err) {
            res.status(500).send('Error signing up');
        } else {
            res.status(200).send('Signup successful');
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, result) => {
        if (err) {
            res.status(500).send('Error logging in');
        } else if (result.length === 0) {
            res.status(401).send('Invalid credentials');
        } else {
            res.status(200).send('Login successful');
        }
    });
});

// Add middleware for user authentication for routes below this point
app.use(authenticateUser);

// Add a New Train route
app.post('/trains', (req, res) => {
    const { source, destination, userId } = req.body;
    const isAdminQuery = `SELECT is_admin FROM users WHERE id = ?`;
    db.query(isAdminQuery, userId, (err, result) => {
        if (err || result.length === 0) {
            res.status(401).send('Unauthorized');
        } else if (!result[0].is_admin) {
            res.status(403).send('Only admins are allowed to add trains');
        } else {
            const insertQuery = `INSERT INTO trains (source, destination) VALUES (?, ?)`;
            db.query(insertQuery, [source, destination], (err, result) => {
                if (err) {
                    res.status(500).send('Error adding train');
                } else {
                    res.status(200).send('Train added successfully');
                }
            });
        }
    });
});

// Get Seat Availability route
app.get('/trains', (req, res) => {
    const { source, destination } = req.query;
    const query = `SELECT * FROM trains WHERE source = ? AND destination = ?`;
    db.query(query, [source, destination], (err, result) => {
        if (err) {
            res.status(500).send('Error fetching trains');
        } else {
            res.status(200).json(result);
        }
    });
});

// Book a Seat route
app.post('/book', (req, res) => {
    const { userId, trainId } = req.body;
    let seatNumber = 0; // Initialize seatNumber to 0

    const checkAvailabilityQuery = `SELECT availability FROM trains WHERE id = ?`;

    db.query(checkAvailabilityQuery, trainId, (err, result) => {
        if (err) {
            res.status(500).send('Error booking seat');
        } else if (result.length === 0) {
            res.status(404).send('Train not found');
        } else {
            const availability = result[0].availability;
            if (availability <= 0) {
                res.status(400).send('No available seats on this train');
            } else {
                // Set seatNumber to availability if greater than 0
                seatNumber = availability;
                const bookSeatQuery = `INSERT INTO bookings (user_id, train_id, seat_number) VALUES (?, ?, ?)`;
                db.query(bookSeatQuery, [userId, trainId, seatNumber], (err, result) => {
                    if (err) {
                        res.status(500).send('Error booking seat');
                    } else {
                        // Decrease availability by 1 after successful booking
                        const updateAvailabilityQuery = `UPDATE trains SET availability = availability - 1 WHERE id = ?`;
                        db.query(updateAvailabilityQuery, trainId, (err, result) => {
                            if (err) {
                                console.error('Error updating availability:', err);
                            }
                        });
                        res.status(200).send('Seat booked successfully');
                    }
                });
            }
        }
    });
});

// Get Specific Booking Details route
app.get('/bookings/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM bookings WHERE user_id = ?`;
    db.query(query, userId, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching bookings');
        } else {
            res.status(200).json(result);
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Command for craeting new tables

// CREATE TABLE bookings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     train_id INT NOT NULL,
//     seat_number INT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (train_id) REFERENCES trains(id)
// );

// CREATE TABLE trains (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     source VARCHAR(255) NOT NULL,
//     destination VARCHAR(255) NOT NULL
// );

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
// );

