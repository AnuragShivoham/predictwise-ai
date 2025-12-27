# PredictWiseAI - Deploy Now! 🚀

An AI-powered AKTU B.Tech PYQ (Previous Years' Questions) analysis platform that predicts likely exam questions.

## ⚡ Quick Deploy (5 minutes)

### Easiest Path: Render.com (Recommended)

1. **Prepare GitHub** (2 min)
   ```powershell
   cd c:\Users\ANURAG\Dropbox\PredictWiseAI\predictwise-ai
   .\deploy.ps1
   ```
   Then push to GitHub as instructed

2. **Deploy Backend** (2 min)
   - Go to [render.com](https://render.com)
   - New Web Service
   - Connect GitHub
   - Build: `cd backend && npm install`
   - Start: `cd backend && node server.js`
   - Add env vars (SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY)
   - Deploy ✅

3. **Deploy Frontend** (1 min)
   - New Static Site
   - Build: `npm run build`
   - Publish: `dist`
   - Add env var: `VITE_API_BASE=<backend_url>`
   - Deploy ✅

**Cost:** Free ($0/month) - Includes:
- Free backend on Render (pauses after 15 min inactivity)
- Free static frontend
- Free database on Supabase (500MB)
- OpenAI API costs ($5-20/month based on usage)

---

## 🔧 Local Development

### Prerequisites
- Node.js 20+ ([install](https://nodejs.org))
- Git ([install](https://git-scm.com))
- Supabase account ([free signup](https://supabase.com))
- OpenAI API key ([get key](https://platform.openai.com/api-keys))

### Setup

1. **Install dependencies**
   ```powershell
   npm install
   cd backend && npm install && cd ..
   ```

2. **Configure environment**
   ```powershell
   # Create backend/.env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   OPENAI_API_KEY=your_openai_key
   PORT=3001
   NODE_ENV=development
   ```

3. **Start development servers**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Access app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

---

## 📋 Deployment Options

| Platform | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| **Render** | 5 min | Free | Beginners, quick launch |
| **Railway** | 10 min | Free tier | More control |
| **Vercel** (Frontend) | 5 min | Free | Static hosting |
| **Self-Hosted** | 1 hour | $5-20/mo | Full control |

→ See `DEPLOYMENT_GUIDE.md` for detailed instructions

---

## 🎯 Features

✅ **PDF Question Extraction**
- Uploads multiple AKTU question papers
- Extracts questions using OCR (tesseract.js)
- Cleans corrupted text and metadata

✅ **AI-Powered Analysis**
- Uses OpenAI (gpt-4o-mini) to analyze questions
- Identifies topics and concepts
- Predicts question difficulty

✅ **Visual Dashboard**
- Chapter/topic weightage pie chart
- Difficulty level trends over years
- High-recurrence topic rankings
- AKTU-style predicted paper generation

✅ **Data Persistence**
- Supabase PostgreSQL database
- Stores analysis results
- Retrieves predictions by subject code

---

## 📚 Project Structure

```
predictwise-ai/
├── backend/
│   ├── server.js           # Express API
│   ├── package.json        # Dependencies
│   └── .env               # Environment variables
├── src/
│   ├── pages/
│   │   ├── Upload.tsx      # File upload interface
│   │   ├── Dashboard.tsx   # Analysis visualization
│   │   └── Index.tsx       # Landing page
│   ├── components/         # Reusable UI components
│   ├── integrations/
│   │   └── supabase/       # Database setup
│   └── App.tsx            # Router
├── DEPLOYMENT_GUIDE.md    # Full deployment docs
└── deploy.ps1             # Windows deployment script
```

---

## 🔌 API Endpoints

### Upload & Analyze
```http
POST /api/analyze
Content-Type: multipart/form-data

Body:
- files: [PDF files]
- examName: "BTECH (SEM III) THEORY"
- subjectCode: "BCS302"
- subjectName: "Computer Organization"
- year: 2024
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis complete",
  "dashboardData": {
    "predictions": [...],
    "stats": {...},
    "trends": {...}
  }
}
```

### Get Predictions
```http
GET /api/predictions/:subjectCode
```

---

## 🛠️ Environment Variables

**Backend (.env)**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_BASE=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`node backend/server.js`)
- [ ] Database credentials working
- [ ] OpenAI API key valid
- [ ] CORS configured correctly
- [ ] Error logging enabled
- [ ] Rate limiting added
- [ ] File upload limits set

---

## 📞 Troubleshooting

**"Cannot find module" error**
```powershell
npm install
cd backend && npm install
```

**"CORS error" in browser**
- Check `VITE_API_BASE` environment variable
- Verify backend URL is correct and accessible
- Update backend CORS configuration if needed

**"Port 3001 already in use"**
```powershell
Get-Process -Name node | Stop-Process -Force
```

**Empty dashboard after upload**
- Check browser console for errors
- Check backend logs for API errors
- Verify Supabase credentials

**PDF text looks corrupted**
- Text cleaning is applied automatically
- Check backend console for extraction logs
- Verify PDF is readable (not scanned)

---

## 📖 Learning Resources

- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app)
- [Express.js Guide](https://expressjs.com)

---

## 💡 Next Steps

After deployment:

1. **Test with real data**
   - Upload AKTU PDFs
   - Verify predictions accuracy

2. **Optimize performance**
   - Add database indexes
   - Enable caching
   - Compress uploads

3. **Scale infrastructure**
   - Upgrade to paid Render tier ($7+/mo)
   - Add CDN for static files
   - Implement background jobs

4. **Maintain system**
   - Monitor error logs daily
   - Update dependencies monthly
   - Backup database regularly
   - Rotate API keys quarterly

---

## 📄 License

MIT - Feel free to use and modify

---

## 🤝 Support

- Documentation: See `DEPLOYMENT_GUIDE.md`
- Issues: Check troubleshooting section above
- Questions: Review code comments and setup instructions

---

**Ready to deploy? Run:** `.\deploy.ps1` ✨
