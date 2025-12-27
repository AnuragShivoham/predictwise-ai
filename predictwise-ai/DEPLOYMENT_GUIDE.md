# PredictWiseAI - Deployment Guide

## Option 1: Full-Stack Deployment (Recommended for Beginners)

### Using Render.com (Free with Paid Options)
Both frontend and backend on one platform.

#### Step 1: Prepare Your Code
```bash
cd c:\Users\ANURAG\Dropbox\PredictWiseAI\predictwise-ai
git init
git add .
git commit -m "Initial commit: PredictWiseAI"
git remote add origin https://github.com/YOUR_USERNAME/predictwise-ai.git
git push -u origin main
```

#### Step 2: Create Backend on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: predictwise-ai-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free (or Starter for reliability)

6. Add Environment Variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: 10000 (Render's default)
   - `NODE_ENV`: production

7. Deploy

#### Step 3: Create Frontend on Render
1. Click "New +" → "Static Site"
2. Connect same repo
3. Configure:
   - **Name**: predictwise-ai-frontend
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   - `VITE_API_BASE`: https://predictwise-ai-backend.onrender.com (from Step 2)
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase key

5. Deploy

---

## Option 2: Separate Deployments (More Control)

### Backend on Railway
https://railway.app (Free tier available)

1. Connect GitHub
2. Create new project → select your repo
3. Configure environment variables (same as above)
4. Deploy automatically on git push
5. Get public URL (e.g., `https://predictwise-backend-production.railway.app`)

### Frontend on Vercel
https://vercel.com (Free)

1. Go to Vercel
2. Import project from GitHub
3. Framework: Vite
4. Configure build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Set environment variable:
   - `VITE_API_BASE`: Your Railway backend URL
6. Deploy

---

## Option 3: Self-Hosted (VPS)

### Using DigitalOcean or AWS EC2

#### Prerequisites:
- VPS with Ubuntu 22.04 LTS
- SSH access
- Domain name (optional but recommended)

#### Deployment Steps:

```bash
# 1. SSH into your server
ssh root@your_server_ip

# 2. Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install nginx (reverse proxy)
sudo apt-get install -y nginx

# 4. Clone your repo
cd /var/www
git clone https://github.com/YOUR_USERNAME/predictwise-ai.git
cd predictwise-ai

# 5. Install dependencies
npm install
cd backend && npm install && cd ..

# 6. Create .env file
nano backend/.env
# (Paste your environment variables)

# 7. Install PM2 (process manager)
sudo npm install -g pm2

# 8. Start backend with PM2
cd backend
pm2 start server.js --name "predictwise-backend"
pm2 save
pm2 startup

# 9. Build frontend
npm run build

# 10. Configure nginx
sudo nano /etc/nginx/sites-available/default
```

#### Nginx Configuration:
```nginx
upstream backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    # Frontend
    location / {
        alias /var/www/predictwise-ai/dist/;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable HTTPS (Free with Let's Encrypt):
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
sudo systemctl restart nginx
```

---

## Option 4: Docker Deployment

### Create Docker Files

#### `Dockerfile` (Backend)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

EXPOSE 3001

CMD ["node", "server.js"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PORT=3001
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE=http://backend:3001
    depends_on:
      - backend
```

#### Deploy to Docker Hub or Heroku:
```bash
# Build and push to Docker Hub
docker build -t yourusername/predictwise-backend .
docker push yourusername/predictwise-backend

# Or deploy to Heroku
heroku container:push web
heroku container:release web
```

---

## Step-by-Step: Render.com (Easiest Path)

### Prerequisites Checklist:
- [ ] GitHub account
- [ ] GitHub repo created with your code pushed
- [ ] Render.com account (free signup)
- [ ] Supabase project created
- [ ] OpenAI API key obtained

### Detailed Instructions:

1. **Push code to GitHub**
   ```bash
   cd c:\Users\ANURAG\Dropbox\PredictWiseAI\predictwise-ai
   git init
   git add .
   git commit -m "Initial PredictWiseAI commit"
   git remote add origin https://github.com/YOUR_USERNAME/predictwise-ai.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy Backend (10 min)**
   - Visit render.com → Dashboard
   - New Web Service
   - Connect GitHub repo
   - Name: `predictwise-ai-backend`
   - Build: `cd backend && npm install`
   - Start: `cd backend && node server.js`
   - Plan: Free (or Starter $7/month)
   - Add 3 env vars from backend/.env
   - Deploy
   - Copy the URL (e.g., `https://predictwise-ai-backend.onrender.com`)

3. **Deploy Frontend (5 min)**
   - New Static Site
   - Same repo
   - Name: `predictwise-ai-frontend`
   - Build: `npm run build`
   - Publish: `dist`
   - Add env var: `VITE_API_BASE=https://predictwise-ai-backend.onrender.com`
   - Deploy

4. **Update Backend CORS** (if needed)
   - In `backend/server.js`, update CORS origin:
   ```javascript
   app.use(cors({
     origin: ['https://predictwise-ai-frontend.onrender.com', 'http://localhost:5173'],
     credentials: true
   }));
   ```

5. **Test Live**
   - Visit `https://predictwise-ai-frontend.onrender.com`
   - Upload a PDF
   - Verify dashboard loads

---

## Production Checklist

- [ ] Environment variables configured (no secrets in code)
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Database backups enabled (Supabase)
- [ ] Error logging set up (optional: Sentry.io)
- [ ] Domain name configured (optional)
- [ ] Rate limiting added (for API endpoints)
- [ ] File upload size limits configured
- [ ] API keys rotated
- [ ] Database RLS policies verified

---

## Cost Estimate (Monthly)

| Service | Free | Starter | Pro |
|---------|------|---------|-----|
| Render Backend | $0 | $7 | $25+ |
| Render Frontend | $0 | $0 | $0 |
| Supabase (Database) | $0* | $25 | $50+ |
| OpenAI (API) | Pay-as-you-go ($5-20) | | |
| Domain | - | $12/year | $12/year |
| **Total** | **$0-20** | **$44-60** | **$50+** |

*Free tier limited to 500MB storage

---

## Quick Commands Reference

```bash
# Local testing before deploy
npm run build          # Build frontend
npm run preview        # Preview production build locally

# Backend environment
set VITE_API_BASE=http://localhost:3001

# Check for build errors
npm run build -- --verbose

# Production frontend build
npm run build -- --mode production
```

---

## Troubleshooting

**Error: "Cannot find package 'vite'"**
- Run `npm install` in root directory

**Error: "CORS error"**
- Update `VITE_API_BASE` to production backend URL
- Update backend CORS configuration

**Error: "Port already in use"**
- Backend: Kill process on port 3001
- Frontend: Vite uses 5173 by default

**Dashboard shows empty/no data**
- Check browser console for errors
- Verify `VITE_API_BASE` env variable is set
- Check backend logs for API errors

---

## Next Steps After Deployment

1. **Monitor Performance**
   - Use Render/Railway dashboards
   - Check error logs daily first week

2. **Optimize**
   - Add database indexes
   - Enable caching
   - Compress uploads

3. **Scale**
   - Upgrade to paid tier if needed
   - Add CDN for static files
   - Implement background jobs

4. **Maintain**
   - Update dependencies monthly
   - Monitor API costs
   - Backup database regularly
