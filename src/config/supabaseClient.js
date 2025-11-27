const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase environment variables!');
  console.error('Please create a .env file in the root directory with:');
  console.error('  SUPABASE_URL=your_supabase_project_url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  console.error('\nGet these from: https://app.supabase.com → Your Project → Settings → API\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
