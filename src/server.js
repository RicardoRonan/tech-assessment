require('dotenv').config();
const express = require('express');

const batchRouter = require('./routes/batch');
const itemsRouter = require('./routes/items');

const app = express();

app.use(express.json());

// Routes
app.use('/api/batch', batchRouter);
app.use('/api/items', itemsRouter);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
