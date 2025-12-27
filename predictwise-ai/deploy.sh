#!/bin/bash
# PredictWiseAI Quick Deployment to Render

echo "=== PredictWiseAI Deployment Setup ==="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git not installed. Install from https://git-scm.com"
    exit 1
fi
echo "✅ Git found"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Install from https://nodejs.org"
    exit 1
fi
echo "✅ Node.js found ($(node --version))"

# Get GitHub details
echo ""
echo "=== GitHub Setup ==="
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter your GitHub repository name (default: predictwise-ai): " REPO_NAME
REPO_NAME=${REPO_NAME:-predictwise-ai}

# Initialize git
echo ""
echo "=== Initializing Git Repository ==="
cd "$(dirname "$0")"

if [ -d .git ]; then
    echo "Git repository already initialized"
else
    git init
    git add .
    git commit -m "Initial PredictWiseAI commit"
fi

# Add remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
git branch -M main

echo "✅ Repository configured"
echo ""
echo "NEXT STEPS:"
echo "1. Go to GitHub and create a new repository named '$REPO_NAME'"
echo "2. Then run: git push -u origin main"
echo ""
echo "3. Visit render.com and sign up with GitHub"
echo ""
echo "4. DEPLOY BACKEND:"
echo "   - New Web Service"
echo "   - Select your repository"
echo "   - Build Command: cd backend && npm install"
echo "   - Start Command: cd backend && node server.js"
echo "   - Add Environment Variables:"
echo "     • SUPABASE_URL"
echo "     • SUPABASE_ANON_KEY"
echo "     • OPENAI_API_KEY"
echo ""
echo "5. DEPLOY FRONTEND:"
echo "   - New Static Site"
echo "   - Same repository"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist"
echo "   - Add Environment Variable:"
echo "     • VITE_API_BASE = (your backend URL from step 4)"
echo ""
echo "6. Get your frontend URL and share it!"
echo ""
