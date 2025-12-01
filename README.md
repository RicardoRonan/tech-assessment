# Tech Assessment - Node.js Application with Database & Reverse Proxy

A full-stack Node.js application featuring a Supabase database connection, batch insertion, pagination, and a Vue.js front-end, all configured with Netlify reverse proxy routing.

## Project Overview

A full-stack web application for managing and displaying laptop inventory. The app features a Vue.js front-end with search and filtering capabilities, a Node.js/Express backend API, and uses Supabase (PostgreSQL) for data storage. It supports batch item insertion, paginated data retrieval, and is deployed on Netlify with serverless functions handling API requests.

## Tech Stack

- **Database**: Supabase (PostgreSQL)
- **Backend**: Node.js with Express.js
- **Hosting**: Netlify (serverless functions + static hosting)
- **Reverse Proxy**: Netlify redirects/rewrites (configured in `netlify.toml`)
- **Front-End**: Vue.js 3 with Vite
- **Runtime**: Node.js

## Project Structure

```
/
├── netlify/
│   └── functions/
│       └── server.js          # Netlify serverless function wrapper
├── client/                    # Vue.js front-end
│   ├── src/
│   │   ├── App.vue            # Main component with pagination
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── config/
│   │   └── supabaseClient.js  # Supabase client configuration
│   ├── routes/
│   │   ├── batch.js           # POST /api/batch endpoint
│   │   └── items.js           # GET /api/items endpoint
│   ├── services/
│   │   └── itemService.js     # Database access layer
│   ├── scripts/
│   │   └── seed.js            # Database seeding script
│   └── server.js              # Express server (for local dev)
├── netlify.toml               # Netlify configuration (reverse proxy)
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier: https://supabase.com)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tech-assessment-1
```

### 2. Install Dependencies

Install backend dependencies:
```bash
npm install
```

Install front-end dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
# Copy .env.example to .env
cp .env.example .env
```

Or on Windows:
```powershell
Copy-Item .env.example .env
```

Then edit `.env` and replace the placeholder values with your actual Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
PORT=4000
```

**Example `.env` file:**
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=4000
```

**How to get Supabase credentials:**

1. Go to https://app.supabase.com
2. Create a new project (or use an existing one)
3. Go to **Settings** → **API**
4. Copy the **Project URL** → use as `SUPABASE_URL`
5. Copy the **service_role** key (not the anon key) → use as `SUPABASE_SERVICE_ROLE_KEY`

**Important**: Create the `items` table in Supabase with the following schema:

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

You can run this SQL in the Supabase SQL Editor.

## Running Locally

### Start the Backend Server

```bash
npm run dev
```

The API will run on `http://localhost:4000`

### Start the Front-End (with Vite proxy)

In a separate terminal:

```bash
cd client
npm run dev
```

The front-end will run on `http://localhost:5173` (or another port if 5173 is taken)

**Local Development Setup:**
- The Vite dev server (`vite.config.js`) proxies `/api/*` requests to `http://localhost:4000`
- This simulates the reverse proxy behavior you'll have in production
- All API calls use the same origin (`/api/*`) - no CORS issues
- Open `http://localhost:5173` in your browser to view the application

### Seed the Database

Before testing, seed the database with sample data:

```bash
npm run seed
```

This will insert 50 items into the database.

## API Endpoints & Examples

### POST /api/batch

Batch insert multiple items with validation.

**Request:**
```bash
curl -X POST http://localhost:4000/api/batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "MacBook Pro 16\"",
      "category": "Apple",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "name": "XPS 13",
      "category": "Dell"
    },
    {
      "name": "ThinkPad X1 Carbon",
      "category": "Lenovo"
    },
    {
      "name": "",
      "category": "HP"
    }
  ]'
```

**Response:**
```json
{
  "successCount": 3,
  "errorCount": 1,
  "errors": [
    {
      "index": 3,
      "message": "Invalid name"
    }
  ]
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `category`: Required, non-empty string
- `createdAt`: Optional, defaults to current date/time if omitted

### GET /api/items

Get paginated items with optional search and category filtering.

**Request:**
```bash
# Basic pagination
curl "http://localhost:4000/api/items?page=1&limit=10"

# With search filter
curl "http://localhost:4000/api/items?page=1&limit=10&search=MacBook"

# With category filter
curl "http://localhost:4000/api/items?page=1&limit=10&category=Apple"

# Combined filters
curl "http://localhost:4000/api/items?page=1&limit=10&search=Pro&category=Apple"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, minimum: 1, maximum: 50)
- `search` (optional): Search term to filter by name or category (case-insensitive partial match)
- `category` (optional): Filter by exact category name

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "MacBook Air M2",
      "category": "Apple",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "MacBook Pro 14\"",
      "category": "Apple",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "totalCount": 50,
  "totalPages": 5,
  "currentPage": 1,
  "nextPage": 2,
  "prevPage": null,
  "search": null,
  "category": null
}
```

## Reverse Proxy Configuration

### How It Works

The reverse proxy ensures that:
1. The front-end makes requests to `/api/*` on the same origin (no CORS issues)
2. Netlify routes these requests to the serverless function
3. The serverless function handles the Express API logic

### Local Development

In `client/vite.config.js`, Vite's dev server proxies `/api/*` to `http://localhost:4000`, simulating the reverse proxy.

### Production (Netlify)

The `netlify.toml` file configures the reverse proxy:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**How it works:**
1. Front-end makes request: `fetch('/api/items?page=1')`
2. Netlify intercepts `/api/*` requests
3. Netlify routes to: `/.netlify/functions/server/api/items?page=1`
4. Serverless function (`netlify/functions/server.js`) processes the request
5. Response is returned to the front-end on the same origin

This configuration ensures:
- All requests use the same origin (no CORS)
- API routes are handled by serverless functions
- Front-end routes are handled by the SPA (index.html)

## Deployment Instructions

### Deploying to Netlify

#### Step 1: Prepare Your Repository

1. Ensure all code is committed and pushed to GitHub/GitLab/Bitbucket
2. Make sure `.env` is in `.gitignore` (it should be)

#### Step 2: Set Up Netlify Project

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider and select your repository
4. Configure build settings (these should be auto-detected from `netlify.toml`, but verify):
   - **Build command**: `npm install && cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
   - **Base directory**: (leave empty or set to root)

#### Step 3: Configure Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add the following variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `NODE_ENV`: `production`

#### Step 4: Install Dependencies for Functions

Netlify needs to install dependencies for the serverless functions. The `netlify.toml` build command handles the front-end, but you may need to ensure the root `package.json` dependencies are installed.

The `netlify.toml` file already includes the correct build command that installs both root and client dependencies.

#### Step 5: Deploy

1. Click **"Deploy site"** in Netlify
2. Wait for the build to complete
3. Your site will be live at `https://your-site-name.netlify.app`

#### Step 6: Verify Deployment

1. Visit your deployed site
2. The front-end should load and display items
3. Check the browser console for any errors
4. Test pagination buttons
5. Verify API calls are going through `/api/*` (check Network tab)

### Troubleshooting Deployment

**Issue: Functions not found**
- Ensure `netlify/functions/server.js` exists
- Check that `serverless-http` is in `package.json` dependencies
- Verify the redirect path in `netlify.toml` matches the function location

**Issue: Environment variables not working**
- Double-check variable names in Netlify dashboard
- Ensure they match exactly what's in your code (`SUPABASE_URL`, not `SUPABASE_URL_1`)
- Redeploy after adding/changing environment variables

**Issue: Build fails**
- Check Netlify build logs
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility (Netlify uses Node 18 by default)

**Issue: API returns 404**
- Verify `netlify.toml` redirects are correct
- Check that the function file path matches the redirect target
- Ensure the function exports `handler` correctly

## Testing Pagination & Batch Insertion

### 1. Seed the Database

```bash
npm run seed
```

This creates 50 items in the database.

### 2. Test Batch Insertion

Using curl:
```bash
curl -X POST http://localhost:4000/api/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "MacBook Air M2", "category": "Apple"},
    {"name": "XPS 15", "category": "Dell"},
    {"name": "Spectre x360", "category": "HP"},
    {"name": "", "category": "Lenovo"}
  ]'
```

Using Postman:
- Method: POST
- URL: `http://localhost:4000/api/batch`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
[
  {"name": "MacBook Air M2", "category": "Apple"},
  {"name": "XPS 15", "category": "Dell"},
  {"name": "ThinkPad X1 Carbon", "category": "Lenovo"}
]
```

### 3. Test Pagination via Front-End

1. Start the front-end: `cd client && npm run dev`
2. Open `http://localhost:5173`
3. You should see 10 items per page
4. Click "Next" to go to page 2
5. Click "Previous" to go back
6. Buttons should disable when at first/last page

### 4. Test Pagination via API

```bash
# Page 1
curl "http://localhost:4000/api/items?page=1&limit=10"

# Page 2
curl "http://localhost:4000/api/items?page=2&limit=10"

# Custom limit
curl "http://localhost:4000/api/items?page=1&limit=5"
```

## Code Quality Features

- **Modular Structure**: Clear separation between routes, services, and configuration
- **Error Handling**: Proper HTTP status codes and structured error responses
- **Input Validation**: Request body and query parameter validation
- **Environment Variables**: No hardcoded credentials
- **Database-Level Pagination**: Uses Supabase's `range()` for efficient queries
- **Batch Operations**: Uses Supabase's bulk insert capabilities

## Additional Notes

- The reverse proxy eliminates CORS issues by keeping all requests on the same origin
- In production, Netlify handles the routing automatically via `netlify.toml`
- Local development uses Vite's proxy feature to simulate the same behavior
- The seed script can be run multiple times (though it will create duplicates)

## License

ISC

