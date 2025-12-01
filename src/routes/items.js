const express = require('express');
const { getPaginatedItems } = require('../services/itemService');

const router = express.Router();

router.get('/', async (req, res) => {
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);
  const search = req.query.search || null;
  const category = req.query.category || null;

  // normalize pagination params
  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;
  if (limit > 50) limit = 50; // cap at 50 to avoid huge queries

  const { data, error, count } = await getPaginatedItems(page, limit, search, category);

  if (error) {
    return res.status(500).json({
      message: 'Something went wrong while fetching items, try again',
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
    search: search || null,
    category: category || null,
  });
});

module.exports = router;
