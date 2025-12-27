# Debug Instructions: PDF Question Extraction Issue

## Problem
The system is showing mock data instead of real analyzed questions from PDFs. This means the PDF text extraction and question parsing is failing.

## Quick Debug Steps

### 1. Test PDF Extraction
```bash
# Place a PDF file in the predictwise-ai directory, then run:
node debug-pdf.js
```

This will show you:
- Raw text extracted from PDF
- Text after cleaning
- Lines analyzed for questions
- Any questions found

### 2. Check Backend Logs
When you upload PDFs through the frontend:
1. Open backend terminal/console
2. Look for logs like:
   ```
   📄 File "filename.pdf": X chars extracted
   ❓ Questions found in "filename.pdf": X
   ✅ Total extracted questions: X
   ```

### 3. Common Issues & Fixes

#### Issue: "0 questions extracted"
**Cause**: Question patterns don't match your PDF format
**Fix**: The regex patterns may need adjustment for your specific PDF format

#### Issue: Raw text looks corrupted
**Cause**: PDF text extraction issues
**Fix**: Try different PDF files or check if PDFs are text-based (not image scans)

#### Issue: Questions found but not meaningful
**Cause**: Text cleaning removed too much content
**Fix**: The cleaning function may be too aggressive

### 4. Manual Testing

You can test the backend directly:
```bash
# Start backend
cd backend && node server.js

# In another terminal, test with curl
curl -X POST http://localhost:3001/api/analyze \
  -F "files=@your-pdf-file.pdf" \
  -F "examName=Test Exam" \
  -F "subject=Test Subject"
```

### 5. Expected Output

For working PDF extraction, you should see:
```
📄 File "sample.pdf": 15432 chars extracted
❓ Questions found in "sample.pdf": 15
   First question: "Explain the concept of..."
✅ Total extracted questions: 15
🤖 Using OpenAI for analysis...
📊 Generated 8 predictions
```

### 6. If Still Not Working

The issue might be:
1. **PDF Format**: Try with different PDF files
2. **Question Format**: AKTU papers may use different numbering
3. **Text Encoding**: PDFs might be image-based (need OCR)
4. **OpenAI Key**: Missing or invalid API key falls back to mock data

## Next Steps

Run the debug script first, then share the output so I can help fix the specific issue with your PDFs.
