const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- ADD THIS LINE
const db = require('./config/db'); // ✅ It's a pool, not a Promise
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Configure CORS
// This is essential to allow your React frontend (e.g., on localhost:5173)
// to make requests to this backend (on localhost:3000).
app.use(cors({
  origin: 'http://localhost:5173', // IMPORTANT: Set this to your React app's development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
  credentials: true // Allow cookies and authorization headers to be sent cross-origin
}));

// Route handler for the API routes
// Any requests to /api will be handled by userRoutes
app.use('/api', userRoutes);

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Define the port for the server to listen on
// Falls back to 3000 if process.env.PORT is not set
const port = process.env.PORT || 3000;

// Self-executing async function to connect to the database and start the server
(async () => {
  try {
    // Attempt to connect to the database by executing a simple query
    await db.query('SELECT 1');
    console.log('Database connection successful');

    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    // If database connection fails, log the error and exit the process
    console.error('Database connection failed:', err);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
})();