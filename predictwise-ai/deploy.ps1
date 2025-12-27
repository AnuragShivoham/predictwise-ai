# PredictWiseAI Quick Deployment Setup for Windows
# Run as: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "=== PredictWiseAI Deployment Setup (Windows) ===" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$gitExists = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
if (-not $gitExists) {
    Write-Host "❌ Git not found. Install from: https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git found" -ForegroundColor Green

$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "❌ Node.js not found. Install from: https://nodejs.org" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "✅ Node.js found ($nodeVersion)" -ForegroundColor Green

# Get GitHub details
Write-Host ""
Write-Host "=== GitHub Setup ===" -ForegroundColor Yellow
$GITHUB_USER = Read-Host "Enter your GitHub username"
$REPO_NAME = Read-Host "Enter repository name (default: predictwise-ai)"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "predictwise-ai"
}

# Initialize git
Write-Host ""
Write-Host "=== Initializing Git Repository ===" -ForegroundColor Yellow

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

if (Test-Path .\.git) {
    Write-Host "Git repository already initialized"
} else {
    git init
    git add .
    git commit -m "Initial PredictWiseAI commit"
}

# Add remote
git remote remove origin 2>$null
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
git branch -M main

Write-Host "✅ Repository configured" -ForegroundColor Green

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Go to GitHub and create a new repository named '$REPO_NAME'" -ForegroundColor White
Write-Host "2. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Visit render.com and sign up with GitHub" -ForegroundColor White
Write-Host ""
Write-Host "4. DEPLOY BACKEND:" -ForegroundColor Cyan
Write-Host "   • New Web Service" -ForegroundColor Gray
Write-Host "   • Select your repository" -ForegroundColor Gray
Write-Host "   • Build Command: cd backend && npm install" -ForegroundColor Gray
Write-Host "   • Start Command: cd backend && node server.js" -ForegroundColor Gray
Write-Host "   • Add Environment Variables:" -ForegroundColor Gray
Write-Host "     - SUPABASE_URL (from your Supabase project)" -ForegroundColor Gray
Write-Host "     - SUPABASE_ANON_KEY (from your Supabase project)" -ForegroundColor Gray
Write-Host "     - OPENAI_API_KEY (from your OpenAI account)" -ForegroundColor Gray
Write-Host ""
Write-Host "5. DEPLOY FRONTEND:" -ForegroundColor Cyan
Write-Host "   • New Static Site" -ForegroundColor Gray
Write-Host "   • Same repository" -ForegroundColor Gray
Write-Host "   • Build Command: npm run build" -ForegroundColor Gray
Write-Host "   • Publish Directory: dist" -ForegroundColor Gray
Write-Host "   • Add Environment Variable:" -ForegroundColor Gray
Write-Host "     - VITE_API_BASE = (your backend URL from step 4)" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Get your frontend URL and share it!" -ForegroundColor Cyan
Write-Host ""
Write-Host "DOCUMENTATION:" -ForegroundColor Cyan
Write-Host "   • Full guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "   • Environment setup: README.md" -ForegroundColor Gray
Write-Host ""

Pop-Location

Write-Host "Ready to deploy! 🚀" -ForegroundColor Green
