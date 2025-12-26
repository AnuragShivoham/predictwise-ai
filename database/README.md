# Database Setup

This project uses Supabase (PostgreSQL) as the database.

## Setup Instructions

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to SQL Editor and run `schema.sql`
4. Copy your project URL and anon key to the `.env` files

## Tables

- `pyqs` - Stores uploaded question papers
- `predictions` - Stores AI-generated predictions
- `analysis_results` - Stores analysis data and trends

## Environment Variables

Add these to your server `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```
