# Frontend White Screen Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Check if Frontend Server is Running
```bash
cd predictwise-ai
npm run dev
```
**Expected output:** `Local: http://localhost:5173/`

### 2. Check Browser Console for Errors
- Open browser to `http://localhost:5173`
- Press F12 to open Developer Tools
- Go to Console tab
- Look for red error messages

### 3. Common Error Patterns & Fixes

#### Error: "Failed to fetch" or Network Errors
- **Cause:** Backend server not running
- **Fix:** Start backend server first
```bash
cd predictwise-ai/backend
node server.js
```

#### Error: "VITE_API_BASE is not defined"
- **Cause:** Missing environment variables
- **Fix:** Create `.env` file in `predictwise-ai/` directory:
```
VITE_API_BASE=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

#### Error: "Cannot resolve module" or Import Errors
- **Cause:** Missing dependencies
- **Fix:** Install dependencies
```bash
cd predictwise-ai
npm install
```

#### Error: "TypeError: Cannot read property" or React Errors
- **Cause:** Component rendering issue
- **Fix:** Check the specific component mentioned in error

### 4. Environment Setup Checklist

- [ ] `.env` file exists in `predictwise-ai/` directory
- [ ] `VITE_API_BASE=http://localhost:3001` is set
- [ ] Backend server is running on port 3001
- [ ] Frontend server is running on port 5173
- [ ] All npm packages are installed (`npm install`)

### 5. Full Reset Procedure

If nothing works, try a complete reset:

```bash
# Clean everything
cd predictwise-ai
rm -rf node_modules
rm -rf backend/node_modules
npm install
cd backend && npm install && cd ..

# Start fresh
npm run dev  # In one terminal
# In another terminal:
cd backend && node server.js
```

### 6. Share Debug Information

When asking for help, please share:
- Browser console errors (screenshots preferred)
- Terminal output from `npm run dev`
- Contents of your `.env` file (without sensitive keys)
- Which step is failing

## Most Common Issues

1. **Backend not running** → Start with `node server.js`
2. **Missing .env file** → Create with `VITE_API_BASE=http://localhost:3001`
3. **Port conflicts** → Check if ports 3001/5173 are available
4. **CORS errors** → Backend must be running for frontend to work
