@echo off
echo ========================================
echo  PredictWiseAI Setup and Run Script
echo ========================================
echo.

echo Step 1: Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed!
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed.

echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed.

echo.
echo Step 3: Checking environment files...
if not exist ".env" (
    echo ⚠️  .env file not found. Copying from .env.example...
    copy .env.example .env
    echo Please edit .env file and add your API keys!
    echo.
    echo Required environment variables:
    echo - VITE_API_BASE=http://localhost:3001
    echo - VITE_SUPABASE_URL=your_supabase_url
    echo - VITE_SUPABASE_ANON_KEY=your_supabase_key
    echo.
    pause
    exit /b 1
)

if not exist "backend\.env" (
    echo ⚠️  backend/.env file not found. Copying from .env.example...
    copy backend\.env.example backend\.env
    echo Please edit backend/.env file and add your API keys!
    echo.
    echo Required environment variables:
    echo - SUPABASE_URL=your_supabase_url
    echo - SUPABASE_ANON_KEY=your_supabase_key
    echo - OPENAI_API_KEY=your_openai_key
    echo.
    pause
    exit /b 1
)

echo ✅ Environment files found.

echo.
echo Step 4: Starting backend server in new window...
start "PredictWiseAI Backend" cmd /k "cd backend && node server.js"

echo.
echo Step 5: Starting frontend development server...
echo The frontend will be available at http://localhost:5173
echo.
npm run dev
