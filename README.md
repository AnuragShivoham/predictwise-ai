# PredictWiseAI

AI-powered exam question prediction platform that analyzes previous year question papers to predict likely questions for upcoming exams.

## Project Structure

```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Node.js backend (Express)
├── database/        # Database schema and migrations
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)
- OpenAI API key (for AI analysis)

### 1. Setup Environment Variables

**Client** (`client/.env`):
```env
VITE_API_BASE=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Server** (`server/.env`):
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

### 2. Install Dependencies

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 3. Setup Database

1. Create a Supabase project at https://supabase.com
2. Run `database/schema.sql` in the SQL Editor

### 4. Start Development

```bash
# Terminal 1 - Start server
cd server && npm run dev

# Terminal 2 - Start client
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Features

- 📄 Upload PDF question papers
- 🤖 AI-powered question extraction and analysis
- 📊 Interactive dashboard with charts
- 🎯 Predicted questions with confidence scores
- 📥 Download predicted question papers

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Node.js, Express, pdf-parse, OpenAI API
- **Database**: Supabase (PostgreSQL)

## API Endpoints

- `POST /api/analyze` - Upload and analyze PDFs
- `GET /api/predictions/:subjectCode` - Get predictions for a subject
- `GET /api/health` - Health check

## License

MIT
