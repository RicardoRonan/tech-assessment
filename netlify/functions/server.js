// Netlify serverless function wrapper for Express app
// This allows the Express API to run as a Netlify function

const express = require('express');
const serverless = require('serverless-http');

// Import the Express app setup
// We need to recreate it here since we can't directly import server.js
require('dotenv').config();

const batchRouter = require('../../src/routes/batch');
const itemsRouter = require('../../src/routes/items');

const app = express();

app.use(express.json());

// When Netlify redirects /api/* to this function, the :splat becomes the path
// So /api/items becomes /items, /api/batch becomes /batch
// We need to mount routes at the root since serverless-http will handle the path correctly
// But actually, serverless-http preserves the original path, so we keep /api prefix
app.use('/api/batch', batchRouter);
app.use('/api/items', itemsRouter);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle root path for the function
app.get('/', (req, res) => {
  res.json({ message: 'API is running', path: req.path });
});

// Export the serverless handler
module.exports.handler = serverless(app);

