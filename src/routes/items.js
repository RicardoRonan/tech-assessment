const express = require('express');
const { getPaginatedItems } = require('../services/itemsService');

const router = express.Router();

// GET /api/items?page=<number>&limit=<number>
router.get('/', async (req, res) => {
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);

  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;

  // Optional maximum limit to avoid silly values
  if (limit > 50) limit = 50;

  const { data, error, count } = await getPaginatedItems(page, limit);

  if (error) {
    return res.status(500).json({
      message: 'Failed to fetch items',
      detail: error.message,
    });
  }

  const totalCount = count || 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 1;
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return res.json({
    items: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    nextPage,
    prevPage,
  });
});

module.exports = router;
