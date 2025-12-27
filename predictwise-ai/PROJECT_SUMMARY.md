# PredictWiseAI - Project Summary

## Project Overview

PredictWiseAI is an AI-powered platform designed to analyze AKTU (Dr. A.P.J. Abdul Kalam Technical University) B.Tech Previous Years' Questions (PYQ) and predict likely exam questions. The platform helps students prepare more effectively by identifying patterns, topic weightage, and difficulty trends from historical question papers.

**Primary Goal:** Transform PDF question papers into actionable insights using OCR, AI analysis, and data visualization.

## Tech Stack & Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** shadcn/ui components with Radix UI primitives
- **Styling:** Tailwind CSS with custom animations (Framer Motion)
- **State Management:** React Query for API state, React Hook Form for forms
- **Charts:** Recharts for data visualization
- **File Upload:** React Dropzone

### Backend
- **Runtime:** Node.js with Express.js
- **Language:** JavaScript (ES6+)
- **PDF Processing:** pdf-parse for text extraction, tesseract.js for OCR
- **AI Integration:** OpenAI GPT-4o-mini for question analysis
- **Database:** Supabase (PostgreSQL) for data persistence

### Infrastructure
- **Database:** Supabase PostgreSQL with real-time capabilities
- **Deployment:** Render.com (recommended) or Railway/Vercel
- **Version Control:** Git with GitHub
- **Package Management:** npm (frontend), npm (backend)

### Architecture Flow
```
PDF Upload → OCR/Text Extraction → AI Analysis → Database Storage → Dashboard Visualization
```

## Key Features

### ✅ Implemented Features
- **PDF Question Extraction:** Upload multiple AKTU question papers with OCR support
- **Text Cleaning:** Automatic cleaning of corrupted text and metadata
- **AI-Powered Analysis:** OpenAI integration for topic identification and difficulty prediction
- **Visual Dashboard:** Interactive charts showing:
  - Chapter/topic weightage (pie chart)
  - Difficulty level trends over years
  - High-recurrence topic rankings
  - AKTU-style predicted paper generation
- **Data Persistence:** Supabase database for storing analysis results
- **Subject-based Retrieval:** Get predictions by subject code

### 🔄 In Development
- Enhanced question detection regex patterns for AKTU formats
- Improved fallback analysis to avoid generating irrelevant questions
- Better error handling and logging

## Current Status & Issues

### ✅ Working Components
- Frontend UI with responsive design
- Basic PDF upload functionality
- Supabase database integration
- OpenAI API integration for analysis
- Dashboard with chart visualizations
- Deployment scripts and documentation

### ❌ Known Issues
- **PDF Extraction Problems:** "0 questions extracted" error for some PDFs
- **Mock Questions Display:** Shows random questions like "Explain important concepts about file/descrete/pyq/aktu"
- **Question Detection:** Regex patterns not matching AKTU question formats properly
- **Fallback Analysis:** Generates questions from filenames/irrelevant words
- **Backend Setup:** Requires manual environment configuration

### 🔧 Critical Setup Required
- Backend server must be running to avoid "Failed to fetch" errors
- Environment variables need configuration (OpenAI API key, Supabase credentials)
- PDF extraction debugging needed for AKTU-specific formats

## Workflow

### Development Workflow
1. **Setup Environment:**
   ```bash
   # Install dependencies
   npm install
   cd backend && npm install

   # Configure environment variables
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. **Start Development Servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

3. **Upload & Analyze:**
   - Access frontend at http://localhost:5173
   - Upload AKTU PDF question papers
   - Backend processes PDF → extracts text → AI analysis → stores results
   - View predictions on dashboard

### Deployment Workflow
1. **Prepare for Deployment:** Run `deploy.ps1` script
2. **Deploy Backend:** Render.com web service with environment variables
3. **Deploy Frontend:** Render.com static site with build settings
4. **Configure Environment:** Set API keys and database credentials

## Setup & Deployment

### Prerequisites
- Node.js 20+
- Git
- Supabase account
- OpenAI API key

### Quick Setup (Windows)
```powershell
# Run setup script
.\setup-and-run.ps1
```

### Environment Variables

**Backend (.env):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_BASE=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Deployment Options
- **Render.com:** Free tier, 5-minute setup (recommended)
- **Railway:** More control, free tier available
- **Vercel:** Frontend-only hosting
- **Self-hosted:** Full control with VPS

## API Endpoints

### POST /api/analyze
Upload and analyze PDF question papers.

**Request:**
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

### GET /api/predictions/:subjectCode
Retrieve stored predictions for a subject.

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [...],
    "stats": {...}
  }
}
```

## Development Notes

### Project Structure
```
predictwise-ai/
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment
├── src/
│   ├── pages/
│   │   ├── Upload.tsx      # File upload interface
│   │   ├── Dashboard.tsx   # Analysis visualization
│   │   └── Index.tsx       # Landing page
│   ├── components/         # Reusable UI components (shadcn/ui)
│   ├── integrations/
│   │   └── supabase/       # Database client & types
│   └── App.tsx            # React Router setup
├── public/                 # Static assets
├── database-schema.sql    # Supabase schema
├── deploy.ps1             # Windows deployment script
├── setup-and-run.ps1      # Development setup script
└── TODO.md               # Current tasks & issues
```

### Key Files to Monitor
- `backend/server.js`: Main API logic, PDF processing, AI integration
- `src/pages/Upload.tsx`: File upload handling
- `src/pages/Dashboard.tsx`: Data visualization
- `database-schema.sql`: Database structure
- `TODO.md`: Current development status

### Performance Considerations
- PDF processing is CPU-intensive (OCR + AI analysis)
- Large PDFs may require background processing
- OpenAI API costs scale with usage
- Database queries optimized for subject-based retrieval

### Security Notes
- API keys stored in environment variables
- File upload size limits should be implemented
- CORS configured for frontend-backend communication
- Rate limiting recommended for production

### Future Enhancements
- Batch processing for multiple PDFs
- Real-time progress updates during analysis
- Advanced filtering and search capabilities
- Mobile-responsive dashboard improvements
- Integration with learning management systems

---

**Last Updated:** December 2024
**Status:** Development (PDF extraction issues being debugged)
**Next Priority:** Fix question extraction and improve regex patterns
