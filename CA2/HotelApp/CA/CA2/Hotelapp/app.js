// Required modules
const express = require('express');
const mysql = require('mysql2');
const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
    //This is all for Localhost connection to the database
    //host: '127.0.0.1',
    //user: 'root',
    //password: '',
    //database: 'hotelw'
    host:'db4free.net',
    user:'hotelw1',
    password:'Weixiya2926!',
    database:'hotelw1',

});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set view engine and static files directory
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Route to display all room types
app.get('/', (req, res) => {
    connection.query('SELECT * FROM rooms', (err, results) => {
        if (err) {
            console.error('Error retrieving rooms:', err);
            res.status(500).send('Error retrieving rooms');
            return;
        }
        res.render('index', { rooms: results });
    });
});

// Route to display details of a specific room type
app.get('/room/:id', (req, res) => {
    const roomId = req.params.id;
    if (!roomId) {
        res.status(400).send('Room ID is required');
        return;
    }
    connection.query('SELECT * FROM rooms WHERE RoomID = ?', [roomId], (err, results) => {
        if (err) {
            console.error('Error retrieving room details:', err);
            res.status(500).send('Error retrieving room details');
            return;
        }
        if (results.length > 0) {
            res.render('room', { room: results[0] });
        } else {
            res.status(404).send('Room not found');
        }
    });
});

// Route to display booking form for a specific room
app.get('/room/:id/book', (req, res) => {
    const roomId = req.params.id;
    if (!roomId) {
        res.status(400).send('Room ID is required');
        return;
    }
    connection.query('SELECT * FROM rooms WHERE RoomID = ?', [roomId], (err, results) => {
        if (err) {
            console.error('Error retrieving room for booking:', err);
            res.status(500).send('Error retrieving room for booking');
            return;
        }
        if (results.length > 0) {
            res.render('book', { room: results[0] });
        } else {
            res.status(404).send('Room not found');
        }
    });
});

// Route to handle booking form submission
app.post('/room/:id/book', (req, res) => {
    const roomId = req.params.id;
    const { name, email, checkin, checkout } = req.body;
    if (!roomId || !name || !email || !checkin || !checkout) {
        res.status(400).send('All fields are required');
        return;
    }

    connection.query('SELECT RoomTypeName FROM rooms WHERE RoomID = ?', [roomId], (err, results) => {
        if (err) {
            console.error('Error retrieving room type:', err);
            res.status(500).send('Error retrieving room type');
            return;
        }

        const roomTypeName = results[0].RoomTypeName;
        getNextRoomNumber((err, roomNumber) => {
            if (err) {
                console.error('Error retrieving room number:', err);
                res.status(500).send('Error retrieving room number');
                return;
            }

            const sql = 'INSERT INTO booking (UserName, UserEmail, RoomTypeID, RoomTypeName, RoomNumber, CheckInDate, CheckOutDate) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, [name, email, roomId, roomTypeName, roomNumber, checkin, checkout], (err, results) => {
                if (err) {
                    console.error('Error booking room:', err);
                    res.status(500).send('Error booking room');
                    return;
                }
                res.redirect('/booking');
            });
        });
    });
});

// Route to display edit booking form
app.get('/booking/:id/edit', (req, res) => {
    const bookingId = req.params.id;
    if (!bookingId) {
        res.status(400).send('Booking ID is required');
        return;
    }

    // Fetch the booking details
    connection.query('SELECT * FROM booking WHERE BookingID = ?', [bookingId], (err, bookingResults) => {
        if (err) {
            console.error('Error retrieving booking:', err);
            res.status(500).send('Error retrieving booking');
            return;
        }
        if (bookingResults.length > 0) {
            const booking = bookingResults[0];

            // Fetch all room types
            connection.query('SELECT * FROM rooms', (err, roomResults) => {
                if (err) {
                    console.error('Error retrieving rooms:', err);
                    res.status(500).send('Error retrieving rooms');
                    return;
                }

                // Render the editbooking page with booking details and room types
                res.render('editbooking', { booking: booking, rooms: roomResults });
            });
        } else {
            res.status(404).send('Booking not found');
        }
    });
});


// Route to handle updating booking
app.post('/booking/:id/edit', (req, res) => {
    const bookingId = req.params.id;
    const { name, email, checkin, checkout } = req.body;
    if (!bookingId || !name || !email || !checkin || !checkout) {
        res.status(400).send('All fields are required');
        return;
    }
    const sql = 'UPDATE booking SET UserName = ?, UserEmail = ?, CheckInDate = ?, CheckOutDate = ? WHERE BookingID = ?';
    connection.query(sql, [name, email, checkin, checkout, bookingId], (err, results) => {
        if (err) {
            console.error('Error updating booking:', err);
            res.status(500).send('Error updating booking');
            return;
        }
        res.redirect('/booking');
    });
});

// Route to handle deleting booking
app.get('/booking/:id/delete', (req, res) => {
    const bookingId = req.params.id;
    if (!bookingId) {
        res.status(400).send('Booking ID is required');
        return;
    }
    connection.query('DELETE FROM booking WHERE BookingID = ?', [bookingId], (err, results) => {
        if (err) {
            console.error('Error deleting booking:', err);
            res.status(500).send('Error deleting booking');
            return;
        }
        res.redirect('/booking');
    });
});

// Route to display all bookings
app.get('/booking', (req, res) => {
    const sql = 'SELECT * FROM booking';
    connection.query(sql, (err, resultsbook) => {
        if (err) throw err;

        // Query rooms separately
        const sqlrooms = 'SELECT * FROM rooms';
        connection.query(sqlrooms, (error, results) => {
            if (error) throw error;

            // Render HTML page with both booking and room data
            res.render('booking', { booking: resultsbook, rooms: results });
        });
    });
});

// Function to get next available room number
function getNextRoomNumber(callback) {
    const sql = 'SELECT MAX(RoomNumber) AS maxRoomNumber FROM booking';
    connection.query(sql, (err, results) => {
        if (err) return callback(err);
        const maxRoomNumber = results[0].maxRoomNumber || 0;
        callback(null, maxRoomNumber + 1);
    });
}

// Route to display booking search results
app.get('/booking/search', (req, res) => {
    const query = req.query.query.toLowerCase();

    connection.query('SELECT * FROM booking WHERE LOWER(UserName) LIKE ? OR BookingID LIKE ?', [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Error retrieving bookings:', err);
            res.status(500).send('Error retrieving bookings');
            return;
        }
        res.render('booking', { booking: results });
    });
});

// Route to display all staff members
app.get('/staff', (req, res) => {
    connection.query('SELECT * FROM staff', (err, results) => {
        if (err) {
            console.error('Error retrieving staff members:', err);
            res.status(500).send('Error retrieving staff members');
            return;
        }
        res.render('staff', { staff: results });
    });
});

// Route to display the add staff form
app.get('/addstaff', (req, res) => {
    res.render('addstaff');
});

// Route to handle adding a new staff member
app.post('/staff', (req, res) => {
    const { name, role, contact, department } = req.body;
    const sql = 'INSERT INTO staff (StaffName, StaffPosition, StaffPhoneNumber, StaffDepartment) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, role, contact, department], (err, results) => {
        if (err) {
            console.error('Error adding staff member:', err);
            res.status(500).send('Error adding staff member');
            return;
        }
        res.redirect('/staff');
    });
});
// Route to display edit staff form
app.get('/staff/:id/edit', (req, res) => {
    const staffId = req.params.id;
    if (!staffId) {
        res.status(400).send('Staff ID is required');
        return;
    }

    // Fetch the staff member details
    connection.query('SELECT * FROM staff WHERE StaffID = ?', [staffId], (err, results) => {
        if (err) {
            console.error('Error retrieving staff:', err);
            res.status(500).send('Error retrieving staff');
            return;
        }
        if (results.length > 0) {
            const staff = results[0];
            res.render('editstaff', { staff: staff });
        } else {
            res.status(404).send('Staff member not found');
        }
    });
});

// Route to handle deleting a staff member
app.get('/staff/:id/delete', (req, res) => {
    const staffId = req.params.id;
    if (!staffId) {
        res.status(400).send('Staff ID is required');
        return;
    }
    const sql = 'DELETE FROM staff WHERE StaffID = ?';
    connection.query(sql, [staffId], (err, results) => {
        if (err) {
            console.error('Error deleting staff member:', err);
            res.status(500).send('Error deleting staff member');
            return;
        }
        res.redirect('/staff');
    });
});


// Route to handle updating staff member
app.post('/staff/:id/edit', (req, res) => {
    const staffId = req.params.id;
    const { name, position, phone, department } = req.body;
    if (!staffId || !name || !position || !phone || !department) {
        res.status(400).send('All fields are required');
        return;
    }
    const sql = 'UPDATE staff SET StaffName = ?, StaffPosition = ?, StaffPhoneNumber = ?, StaffDepartment = ? WHERE StaffID = ?';
    connection.query(sql, [name, position, phone, department, staffId], (err, results) => {
        if (err) {
            console.error('Error updating staff:', err);
            res.status(500).send('Error updating staff');
            return;
        }
        res.redirect('/staff');
    });
});

app.get('/staff/search', (req, res) => {
    const query = req.query.query.toLowerCase();

    connection.query(
        'SELECT * FROM staff WHERE LOWER(StaffName) LIKE ? OR StaffID LIKE ?', 
        [`%${query}%`, `%${query}%`], 
        (err, results) => {
            if (err) {
                console.error('Error retrieving staff:', err);
                res.status(500).send('Error retrieving staff');
                return;
            }
            res.render('staff', { staff: results });
        }
    );
});


// Route to display the Room edit form
app.get('/rooms/:id/update', (req, res) => {
    const roomId = req.params.id;
    if (!roomId) {
        res.status(400).send('Room ID is required');
        return;
    }
    connection.query('SELECT * FROM rooms WHERE RoomID = ?', [roomId], (err, results) => {
        if (err) {
            console.error('Error retrieving room:', err);
            res.status(500).send('Error retrieving room');
            return;
        }
        if (results.length > 0) {
            res.render('edit', { room: results[0] });
        } else {
            res.status(404).send('Room not found');
        }
    });
});

// Route to handle updating a room
app.post('/rooms/:id/update', (req, res) => {
    const roomId = req.params.id;
    const { type, quantity, price, description } = req.body;
    

    if (!roomId || !type || !quantity || !price || !description) {
        res.status(400).send('All fields are required');
        return;
    }

    const sql = 'UPDATE rooms SET RoomTypeName = ?, RoomQuantity = ?, PricePerNight = ?, Description = ? WHERE RoomID = ?';
    connection.query(sql, [type, quantity, price, description, roomId], (err, results) => {
        if (err) {
            console.error('Error updating room:', err);
            res.status(500).send('Error updating room');
            return;
        }
        res.redirect('/');
    });
});


// Route to display the add room form
app.get('/addroom', (req, res) => {
    res.render('addroom');
});

// Route to handle adding a new room
app.post('/rooms', (req, res) => {
    const { type, quantity, price, description, image } = req.body;
    const sql = 'INSERT INTO rooms (RoomTypeName, RoomQuantity, PricePerNight, Description, Image) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [type, quantity, price, description, image], (err, results) => {
        if (err) {
            console.error('Error adding room:', err);
            res.status(500).send('Error adding room');
            return;
        }
        res.redirect('/');
    });
});

// Route to handle deleting a room
app.get('/rooms/:id/delete', (req, res) => {
    const roomId = req.params.id;
    if (!roomId) {
        res.status(400).send('Room ID is required');
        return;
    }
    const sql = 'DELETE FROM rooms WHERE RoomID = ?';
    connection.query(sql, [roomId], (err, results) => {
        if (err) {
            console.error('Error deleting room:', err);
            res.status(500).send('Error deleting room');
            return;
        }
        res.redirect('/');
    });
});
//search bar for rooms
app.get('/rooms/search', (req, res) => {
    const query = req.query.query.toLowerCase();

    connection.query('SELECT * FROM rooms WHERE LOWER(RoomTypeName) LIKE ? OR RoomID LIKE ?', [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Error retrieving rooms:', err);
            res.status(500).send('Error retrieving rooms');
            return;
        }
        res.render('index', { rooms: results });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
