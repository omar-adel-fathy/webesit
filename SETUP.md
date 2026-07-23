# Jimmy AI Setup Guide

The Jimmy AI assistant was failing because there was no API server handling requests during development. Here's what was fixed:

## Changes Made

1. **vite.config.mjs** - Removed duplicate API code and added proxy configuration to route `/api` requests to the dev server
2. **dev-server.js** - Created a new local API server that runs the Jimmy AI handler
3. **package.json** - Updated scripts and added dependencies (express, concurrently)
4. **.env.example** - Updated with PORT configuration

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env file
Copy `.env.example` to `.env` and fill in your DeepSeek API key:
```bash
cp .env.example .env
```

Edit `.env` and add your DeepSeek API credentials:
```
DEEPSEEK_API_KEY=sk-xxx...
```

### 3. Run development environment

**Option A: Run both servers together (recommended)**
```bash
npm run dev:all
```

**Option B: Run servers separately (in different terminals)**
```bash
# Terminal 1 - Start Vite frontend dev server
npm run dev

# Terminal 2 - Start API dev server
npm run dev:api
```

## How It Works

- **Vite dev server** runs on `http://localhost:5173` (frontend)
- **API server** runs on `http://localhost:3001` (backend)
- Vite proxies all `/api` requests to the API server
- The DeepSeek API handles the actual AI responses

## Troubleshooting

If Jimmy AI still shows errors:

1. Make sure both servers are running (check terminal output)
2. Check `.env` has a valid DEEPSEEK_API_KEY
3. Check browser console (F12) for network errors
4. Restart both servers

For production deployment on Vercel, use `api/jimmy.js` directly as a serverless function.
