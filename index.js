 // index.js

// --- 1. Import Dependencies ---
// We need Express to create our server, sqlite3 for our database,
// nanoid to generate short, unique IDs, and qrcode to create QR codes.
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const qrcode = require('qrcode');
const path = require('path');

// --- 2. Initialize Express App ---
const app = express();
const port = 3000;
// This is the base URL for our shortened links.
// In a real application, you would replace this with your actual domain.
const baseUrl = ` https://27ef3d6c6b13.ngrok-free.app`;

// --- 3. Setup Database ---
// We're using SQLite, which is a simple file-based database.
// This line creates a new database file named 'database.db' if it doesn't exist.
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // We create a 'urls' table to store our links if it doesn't already exist.
    // The table will have columns for the short code, the original long URL,
    // and a timestamp for when it was created.
    db.run(`CREATE TABLE IF NOT EXISTS urls (
      shortCode TEXT PRIMARY KEY,
      longUrl TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// --- 4. Middleware ---
// This tells Express to parse incoming JSON request bodies.
// It's how we'll get the 'longUrl' from the POST /shorten request.
app.use(express.json());
// This serves static files from the 'public' directory.
// We'll use this to show a simple welcome page.
app.use(express.static('public'));

// --- 5. API Endpoints ---

// == Endpoint: POST /shorten ==
// This endpoint takes a long URL and creates a short link for it.
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;

  // Validate the URL. It must be a non-empty string.
  if (!longUrl || typeof longUrl !== 'string') {
    return res.status(400).json({ error: 'A valid "longUrl" must be provided.' });
  }

  // Generate a short, unique code. nanoid(7) creates a 7-character string.
  const shortCode = nanoid(7);
  const shortUrl = `${baseUrl}/${shortCode}`;

  // Store the mapping in the database.
  const sql = `INSERT INTO urls (shortCode, longUrl) VALUES (?, ?)`;
  db.run(sql, [shortCode, longUrl], function(err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: 'Failed to shorten URL. Please try again.' });
    }
    // If successful, return the new short URL.
    console.log(`URL shortened: ${longUrl} -> ${shortUrl}`);
    res.status(201).json({ shortUrl });
  });
});

// == Endpoint: GET /:shortCode ==
// This endpoint redirects a short URL to its original long URL.
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  const sql = `SELECT longUrl FROM urls WHERE shortCode = ?`;

  // Look up the short code in the database.
  db.get(sql, [shortCode], (err, row) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: 'Server error.' });
    }

    // If a row is found, it means the short code is valid.
    if (row) {
      console.log(`Redirecting ${shortCode} to ${row.longUrl}`);
      // Perform a 302 Found redirect to the original URL.
      res.redirect(302, row.longUrl);
    } else {
      // If no row is found, the short code is invalid.
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  });
});

// == Bonus Endpoint: GET /:shortCode/qr ==
// This endpoint generates and returns a QR code for a short URL.
app.get('/:shortCode/qr', (req, res) => {
  const { shortCode } = req.params;
  const shortUrl = `${baseUrl}/${shortCode}`;

  // First, verify the shortCode exists in the database.
  const sql = `SELECT longUrl FROM urls WHERE shortCode = ?`;
  db.get(sql, [shortCode], (err, row) => {
    if (err) {
        return res.status(500).json({ error: 'Server error.' });
    }

    if (!row) {
        return res.status(404).json({ error: 'Short URL not found.' });
    }
    
    // If it exists, generate the QR code.
    // We'll send the QR code image data directly in the response.
    qrcode.toBuffer(shortUrl, { errorCorrectionLevel: 'H' }, (err, buffer) => {
        if (err) {
            console.error('QR Code generation error:', err);
            return res.status(500).json({ error: 'Failed to generate QR code.' });
        }

        // Set the correct content type header and send the image buffer.
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
    });
  });
});


// --- 6. Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on ${baseUrl}`);
  console.log('Send a POST request to /shorten to create a link.');
  console.log('Example: curl -X POST -H "Content-Type: application/json" -d \'{"longUrl":"https://www.google.com"}\' http://localhost:3000/shorten');
});

