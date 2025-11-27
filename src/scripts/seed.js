const supabase = require('../config/supabaseClient');

async function seed() {
  const items = Array.from({ length: 50 }).map((_, i) => ({
    name: `Item ${i + 1}`,
    category: i % 2 === 0 ? 'Category A' : 'Category B',
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('items').insert(items);

  if (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }

  console.log('Seeded 50 items');
  process.exit(0);
}

seed();
