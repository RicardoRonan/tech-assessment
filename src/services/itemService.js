const supabase = require('../config/supabaseClient');

async function insertItems(items) {
  const { data, error } = await supabase.from('items').insert(items);
  return { data, error };
}

async function getPaginatedItems(page, limit, search = null, category = null) {
  const offset = (page - 1) * limit;

  let query = supabase
    .from('items')
    .select('*', { count: 'exact' });

  if (search && search.trim()) {
    const searchTerm = search.trim();
    const pattern = `%${searchTerm}%`;
    query = query.or(`name.ilike.${pattern},category.ilike.${pattern}`);
  }

  if (category && category.trim()) {
    query = query.eq('category', category.trim());
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error, count };
}

module.exports = {
  insertItems,
  getPaginatedItems,
};