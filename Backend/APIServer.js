// api server for processing the stock data

require("dotenv").config(); // This line loads the .env file
// use process.env to access variables in there

//sets up express by importing, creating an instance and then setting the port
const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");

// This middleware logs the method and URL of every incoming request.
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${
      req.method
    } ${req.url}`
  );
  // 'next()' passes control to the next middleware function or route handler.
  // Without next(), the request would hang.
  next();
});

// This is essential for handling data sent from clients (e.g., in POST requests).
// It populates req.body with the parsed JSON data.
app.use(express.json());

async function GetStockData(symbol) {
  try {
    // Ensure you have an API_KEY set in your .env file
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${process.env.API_KEY}`;
    const response = await axios.get(url);
    // console.log("Fetched posts:", response.data);
    // response.data contains the parsed JSON response
    // response.status contains the HTTP status code (e.g., 200)
    // response.headers contains the response headers
    // response.config contains the request configuration

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching stock data:",
      error.message
    );
    throw error;
  }
}

// --- Routes ---
// Routes define how the application responds to a client request to a particular
// endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, etc.).

/**
 * @route GET /
 * @description Handles GET requests to the root URL.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the Stock Data API!</h1><p>Try /api/data?symbol=IBM</p>"
  );
});

/**
 * @route GET /api/data
 * @description Handles GET requests to /api/data and sends JSON data.
 */
app.get("/api/data", async (req, res) => {
  // Made the callback function async
  const symbol = req.query.symbol;

  if (!symbol) {
    return res
      .status(400)
      .json({
        error:
          "Symbol query parameter is required.",
      });
  }

  //http://localhost:3000/api/data?symbol=MSFT

  try {
    // Await the promise returned by GetStockData
    const data = await GetStockData(symbol);
    console.log("Data to be sent:", data); // Log the actual data
    res.json(data);
  } catch (error) {
    console.error(
      "Error in /api/data route:",
      error.message
    );
    res
      .status(500)
      .json({
        error: "Failed to fetch stock data.",
      });
  }
});

// --- Error Handling (Middleware for 404 Not Found) ---
// This middleware will be executed if no other route matches the request.
app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1>404 Not Found</h1><p>The page you requested could not be found.</p>"
    );
});

app.listen(PORT, () => {
  console.log(
    `Express server running at http://localhost:${PORT}/`
  );
  console.log("Try visiting:");
  console.log(
    `- http://localhost:${PORT}/api/data?symbol=IBM` // Added a sample symbol
  );
});
