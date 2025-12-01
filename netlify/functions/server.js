const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config();

const batchRouter = require('../../src/routes/batch');
const itemsRouter = require('../../src/routes/items');

const app = express();

app.use(express.json());

app.use('/api/batch', batchRouter);
app.use('/api/items', itemsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'API is running', path: req.path });
});

module.exports.handler = serverless(app);

