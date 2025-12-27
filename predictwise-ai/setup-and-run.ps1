Write-Host "========================================" -ForegroundColor Cyan
Write-Host " PredictWiseAI Setup and Run Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Frontend dependencies installed." -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..
Write-Host "✅ Backend dependencies installed." -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Checking environment files..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file and add your API keys!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Required environment variables:" -ForegroundColor Cyan
    Write-Host "- VITE_API_BASE=http://localhost:3001"
    Write-Host "- VITE_SUPABASE_URL=your_supabase_url"
    Write-Host "- VITE_SUPABASE_ANON_KEY=your_supabase_key"
    Write-Host ""
    Read-Host "Press Enter after editing the .env file"
}

if (!(Test-Path "backend\.env")) {
    Write-Host "⚠️  backend/.env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Please edit backend/.env file and add your API keys!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Required environment variables:" -ForegroundColor Cyan
    Write-Host "- SUPABASE_URL=your_supabase_url"
    Write-Host "- SUPABASE_ANON_KEY=your_supabase_key"
    Write-Host "- OPENAI_API_KEY=your_openai_key"
    Write-Host ""
    Read-Host "Press Enter after editing the backend/.env file"
}

Write-Host "✅ Environment files found." -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Starting backend server in new window..." -ForegroundColor Yellow
Start-Process "cmd" "/k cd backend && node server.js" -WindowStyle Normal

Write-Host ""
Write-Host "Step 5: Starting frontend development server..." -ForegroundColor Yellow
Write-Host "The frontend will be available at http://localhost:5173" -ForegroundColor Green
Write-Host ""
npm run dev
