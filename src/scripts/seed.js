const supabase = require('../config/supabaseClient');

// mix of laptops and accessories for variety
const items = [
  { name: 'MacBook Pro 16"', category: 'Apple' },
  { name: 'MacBook Air M2', category: 'Apple' },
  { name: 'MacBook Pro 14"', category: 'Apple' },
  { name: 'XPS 13', category: 'Dell' },
  { name: 'XPS 15', category: 'Dell' },
  { name: 'Inspiron 15', category: 'Dell' },
  { name: 'Latitude 7420', category: 'Dell' },
  { name: 'Spectre x360', category: 'HP' },
  { name: 'Pavilion 15', category: 'HP' },
  { name: 'Envy 13', category: 'HP' },
  { name: 'ThinkPad X1 Carbon', category: 'Lenovo' },
  { name: 'ThinkPad T14', category: 'Lenovo' },
  { name: 'Yoga 9i', category: 'Lenovo' },
  { name: 'IdeaPad 3', category: 'Lenovo' },
  { name: 'ROG Zephyrus G14', category: 'ASUS' },
  { name: 'VivoBook 15', category: 'ASUS' },
  { name: 'ZenBook 13', category: 'ASUS' },
  { name: 'Swift 3', category: 'Acer' },
  { name: 'Aspire 5', category: 'Acer' },
  { name: 'Predator Helios 300', category: 'Acer' },
  { name: 'Blade 15', category: 'Razer' },
  { name: 'Surface Laptop 5', category: 'Microsoft' },
  { name: 'Surface Pro 9', category: 'Microsoft' },
  { name: 'Galaxy Book Pro', category: 'Samsung' },
  { name: 'Framework Laptop', category: 'Framework' },
  { name: 'Magic Mouse', category: 'Accessories' },
  { name: 'Logitech MX Master 3', category: 'Accessories' },
  { name: 'Dell UltraSharp Monitor', category: 'Accessories' },
  { name: 'LG 27" 4K Monitor', category: 'Accessories' },
  { name: 'Mechanical Keyboard', category: 'Accessories' },
  { name: 'USB-C Hub', category: 'Accessories' },
  { name: 'Webcam HD', category: 'Accessories' },
  { name: 'External SSD 1TB', category: 'Accessories' },
  { name: 'Laptop Stand', category: 'Accessories' },
  { name: 'Wireless Headphones', category: 'Accessories' },
  { name: 'USB-C Charger', category: 'Accessories' },
  { name: 'Laptop Bag', category: 'Accessories' },
  { name: 'Docking Station', category: 'Accessories' },
  { name: 'MacBook Air M1', category: 'Apple' },
  { name: 'Alienware m15', category: 'Dell' },
  { name: 'Omen 15', category: 'HP' },
  { name: 'Legion 5', category: 'Lenovo' },
  { name: 'ROG Strix G15', category: 'ASUS' },
  { name: 'Nitro 5', category: 'Acer' },
  { name: 'Blade 14', category: 'Razer' },
  { name: 'Surface Book 3', category: 'Microsoft' },
  { name: 'Galaxy Book2 Pro', category: 'Samsung' },
  { name: 'Pixelbook Go', category: 'Google' },
];

async function seed() {
  const itemsToInsert = items.map(item => ({
    name: item.name,
    category: item.category,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('items').insert(itemsToInsert);

  if (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${itemsToInsert.length} items`);
  process.exit(0);
}

seed();
