const supabase = require('../config/supabaseClient');

const laptops = [
  { name: 'MacBook Pro 16"', category: 'Apple' },
  { name: 'MacBook Air M2', category: 'Apple' },
  { name: 'MacBook Pro 14"', category: 'Apple' },
  { name: 'MacBook Air M1', category: 'Apple' },
  { name: 'iMac 24"', category: 'Apple' },
  { name: 'XPS 13', category: 'Dell' },
  { name: 'XPS 15', category: 'Dell' },
  { name: 'Inspiron 15', category: 'Dell' },
  { name: 'Latitude 7420', category: 'Dell' },
  { name: 'Alienware m15', category: 'Dell' },
  { name: 'Spectre x360', category: 'HP' },
  { name: 'Pavilion 15', category: 'HP' },
  { name: 'Envy 13', category: 'HP' },
  { name: 'Omen 15', category: 'HP' },
  { name: 'EliteBook 840', category: 'HP' },
  { name: 'ThinkPad X1 Carbon', category: 'Lenovo' },
  { name: 'ThinkPad T14', category: 'Lenovo' },
  { name: 'Yoga 9i', category: 'Lenovo' },
  { name: 'IdeaPad 3', category: 'Lenovo' },
  { name: 'Legion 5', category: 'Lenovo' },
  { name: 'ROG Zephyrus G14', category: 'ASUS' },
  { name: 'VivoBook 15', category: 'ASUS' },
  { name: 'ZenBook 13', category: 'ASUS' },
  { name: 'TUF Gaming A15', category: 'ASUS' },
  { name: 'ROG Strix G15', category: 'ASUS' },
  { name: 'Swift 3', category: 'Acer' },
  { name: 'Aspire 5', category: 'Acer' },
  { name: 'Predator Helios 300', category: 'Acer' },
  { name: 'Nitro 5', category: 'Acer' },
  { name: 'Spin 5', category: 'Acer' },
  { name: 'GS66 Stealth', category: 'MSI' },
  { name: 'GE76 Raider', category: 'MSI' },
  { name: 'Prestige 14', category: 'MSI' },
  { name: 'Katana GF66', category: 'MSI' },
  { name: 'Creator Z16', category: 'MSI' },
  { name: 'Blade 15', category: 'Razer' },
  { name: 'Blade 14', category: 'Razer' },
  { name: 'Blade 17', category: 'Razer' },
  { name: 'Book 13', category: 'Razer' },
  { name: 'Stealth 13', category: 'Razer' },
  { name: 'Galaxy Book Pro', category: 'Samsung' },
  { name: 'Galaxy Book2 Pro', category: 'Samsung' },
  { name: 'Galaxy Book Flex', category: 'Samsung' },
  { name: 'Surface Laptop 5', category: 'Microsoft' },
  { name: 'Surface Pro 9', category: 'Microsoft' },
  { name: 'Surface Book 3', category: 'Microsoft' },
  { name: 'Surface Laptop Studio', category: 'Microsoft' },
  { name: 'ThinkBook 14', category: 'Lenovo' },
  { name: 'Chromebook 14', category: 'Acer' },
  { name: 'Pixelbook Go', category: 'Google' },
  { name: 'Framework Laptop', category: 'Framework' },
];

async function seed() {
  const items = laptops.map(laptop => ({
    name: laptop.name,
    category: laptop.category,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('items').insert(items);

  if (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }

  console.log(`Seeded ${items.length} laptops`);
  process.exit(0);
}

seed();
