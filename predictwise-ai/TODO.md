# PredictWiseAI - TODO List

## CRITICAL: Setup Required First!
**The "Failed to fetch" error is because the backend server is not running!**

### Quick Setup (Windows):
1. Copy environment files:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. Add your API keys:
   - Get OpenAI API key from https://platform.openai.com/api-keys
   - Get Supabase keys from https://supabase.com/dashboard
   - Frontend .env: `VITE_API_BASE=http://localhost:3001`
   - Backend .env: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

3. Run setup script:
   ```bash
   .\setup-and-run.ps1
   ```

## PDF Question Extraction Issues
- 🔄 PDF upload shows "0 questions extracted"
- 🔄 Displays random mock questions like "Explain important concepts about file/descrete/pyq/aktu"
- 🔄 Question extraction failing for AKTU PYQ PDFs

## DEBUGGING STEPS (Run These Now!)
1. **Test PDF Extraction:**
   ```bash
   # Place a PDF in predictwise-ai directory
   node debug-pdf.js
   ```

2. **Check Backend Logs:**
   - Start backend: `.\start-backend.bat`
   - Upload PDF through frontend
   - Check backend console for extraction logs

3. **Common Issues:**
   - PDF is image-based (needs OCR)
   - Question format doesn't match regex patterns
   - Text cleaning too aggressive

## Tasks
- [ ] Run debug-pdf.js and share output
- [ ] Check backend logs during upload
- [ ] Test with different PDF formats
- [ ] Improve question detection regex patterns for AKTU formats
- [ ] Add better logging to debug extraction issues
- [ ] Modify simpleFallbackAnalysis to avoid generating questions from filenames/irrelevant words
- [ ] Test extraction with AKTU PDFs
- [ ] Verify dashboard shows real questions instead of mock ones

## Files to Edit
- `predictwise-ai/backend/server.js`

## Implementation Details
1. Enhance regex patterns to detect AKTU question formats (numbered questions, lettered options, etc.)
2. Add more detailed logging to understand what text is being processed
3. Filter out irrelevant words from fallback analysis (filenames, common terms)
4. Ensure fallback only triggers when truly no questions are found
