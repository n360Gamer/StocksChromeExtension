// api server for processing the stock data

//sets up express by importing, creating an instance and then setting the port
const express = require('express');
const app = express();
const PORT = 3000;

// This middleware logs the method and URL of every incoming request.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    // 'next()' passes control to the next middleware function or route handler.
    // Without next(), the request would hang.
    next();
});

// This is essential for handling data sent from clients (e.g., in POST requests).
// It populates req.body with the parsed JSON data.
app.use(express.json());

// --- Routes ---
// Routes define how the application responds to a client request to a particular
// endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, etc.).

/**
 * @route GET /
 * @description Handles GET requests to the root URL.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

/**
 * @route GET /api/data
 * @description Handles GET requests to /api/data and sends JSON data.
 */
app.get('/api/data', (req, res) => {
    const data = {
        message: 'This is some JSON data',
        timestamp: new Date().toISOString(),
        items: ['item1', 'item2', 'item3']
    };
    // res.json() automatically sets Content-Type to application/json
    // and stringifies the JavaScript object.
    res.json(data);
});

// --- Error Handling (Middleware for 404 Not Found) ---
// This middleware will be executed if no other route matches the request.
app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1><p>The page you requested could not be found.</p>');
});


app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
    console.log('Try visiting:');
    console.log(`- http://localhost:${PORT}/api/data`);
});

