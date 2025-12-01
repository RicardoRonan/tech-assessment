# Tech Assessment - Node.js Application with Database & Reverse Proxy

A full-stack Node.js application featuring a Supabase database connection, batch insertion, pagination, and a Vue.js front-end, all configured with Netlify reverse proxy routing.

## Project Overview

This application demonstrates:
- **Database Integration**: Connection to Supabase (PostgreSQL) with seeded data
- **Batch Operations**: API endpoint for bulk item insertion with validation
- **Pagination**: Database-level pagination for efficient data retrieval
- **Reverse Proxy**: Netlify configuration routing `/api/*` requests to serverless functions
- **Front-End**: Vue.js 3 application displaying paginated results

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
- Open `http://localhost:5173` in your browser

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
      "name": "Item 1",
      "category": "Electronics",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "name": "Item 2",
      "category": "Books"
    },
    {
      "name": "",
      "category": "Invalid"
    }
  ]'
```

**Response:**
```json
{
  "successCount": 2,
  "errorCount": 1,
  "errors": [
    {
      "index": 2,
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

Get paginated items.

**Request:**
```bash
curl "http://localhost:4000/api/items?page=1&limit=10"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, minimum: 1, maximum: 50)

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "category": "Category A",
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    ...
  ],
  "totalCount": 50,
  "totalPages": 5,
  "currentPage": 1,
  "nextPage": 2,
  "prevPage": null
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

The `netlify.toml` file configures:
- **Redirects**: `/api/*` → `/.netlify/functions/server/:splat`
- **SPA Fallback**: All other routes → `/index.html`

This means:
- Front-end calls: `fetch('/api/items?page=1')`
- Netlify routes to: `/.netlify/functions/server/api/items?page=1`
- The serverless function processes the request

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
    {"name": "Test Item 1", "category": "Test"},
    {"name": "Test Item 2", "category": "Test"},
    {"name": "", "category": "Should fail"}
  ]'
```

Using Postman:
- Method: POST
- URL: `http://localhost:4000/api/batch`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
[
  {"name": "Test Item 1", "category": "Test"},
  {"name": "Test Item 2", "category": "Test"}
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

