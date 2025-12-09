# Tech Assessment - Item Manager

A full-stack Node.js application for managing items with batch insertion and pagination. Built with Express, Supabase, and Vue 3.

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Vue 3 + Vite
- **Deployment**: Netlify (serverless functions + static hosting)

## Quick Start

### Install Dependencies

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Database Setup

Create the `items` table in Supabase:

```sql
-- Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the items table

CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on createdAt for better pagination performance
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items("createdAt" DESC);

-- Enable Row Level Security (optional, adjust as needed)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on items" ON items
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=4000
```

Get your Supabase credentials from: https://app.supabase.com → Your Project → Settings → API

### Run Development

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Backend runs on `http://localhost:4000`, frontend on `http://localhost:5173`.

### Seed Database

```bash
npm run seed
```

This creates 50 sample items.

## API Endpoints

### POST /api/batch

Batch insert items. Accepts an array of objects with `name`, `category`, and optional `createdAt`.

```bash
curl -X POST http://localhost:4000/api/batch \
  -H "Content-Type: application/json" \
  -d '[{"name": "Laptop", "category": "Electronics"}]'
```

Returns `{ successCount, errorCount, errors }`.

### GET /api/items

Get paginated items with optional filters.

**Query parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `search` - filters by name or category
- `category` - exact category match

```bash
curl "http://localhost:4000/api/items?page=1&limit=10&search=laptop"
```

Returns paginated results with metadata (`totalCount`, `totalPages`, `nextPage`, `prevPage`).

### GET /api/health

Health check endpoint.

## Notes

- The frontend uses Vite's proxy in development to forward `/api/*` requests to the backend
- In production, Netlify handles routing via `netlify.toml`
- The seed script can be run multiple times (creates duplicates)
- Batch endpoint validates each item and returns partial success if some fail
