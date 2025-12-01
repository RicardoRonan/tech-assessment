const express = require('express');
const { insertItems } = require('../services/itemService');

const router = express.Router();

router.post('/', async (req, res) => {
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return res.status(400).json({ message: 'Request body must be an array' });
  }

  const validItems = [];
  const errors = [];

  // quick validation pass - might extract to a helper if this grows
  payload.forEach((item, index) => {
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const category = typeof item.category === 'string' ? item.category.trim() : '';
    const createdAt = item.createdAt;

    if (!name) {
      errors.push({ index, message: 'Invalid name' });
      return;
    }

    if (!category) {
      errors.push({ index, message: 'Invalid category' });
      return;
    }

    validItems.push({
      name,
      category,
      created_at: createdAt || new Date().toISOString(),
    });
  });

  let successCount = 0;

  if (validItems.length > 0) {
    const { error } = await insertItems(validItems);
    if (error) {
      // console.log('Batch insert error:', error);
      return res.status(500).json({
        message: 'Something went wrong while inserting items',
        detail: error.message,
      });
    }
    successCount = validItems.length;
  }

  return res.json({
    successCount,
    errorCount: errors.length,
    errors,
  });
});

module.exports = router;
