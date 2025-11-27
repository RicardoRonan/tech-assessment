const supabase = require('../config/supabaseClient');

// Batch insert service
async function insertItems(items) {
  const { data, error } = await supabase.from('items').insert(items);
  return { data, error };
}



// Paginated fetch service
async function getPaginatedItems(page, limit) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('items')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error, count };
}

module.exports = {
  insertItems,
  getPaginatedItems,
};