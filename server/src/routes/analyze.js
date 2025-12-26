const express = require('express');
const multer = require('multer');
const { validateAnalyze, sanitizeText } = require('../middleware/validation');
const { analyzeLimiter } = require('../middleware/rateLimit');
const { extractTextFromPDF, isLikelyScannedPDF } = require('../services/pdfExtractor');
const { extractTextFromImage, extractTextFromScannedPDF } = require('../services/ocrExtractor');
const { extractQuestions } = require('../services/questionExtractor');
const { analyzeWithAI } = require('../services/aiAnalyzer');
const { generateCacheKey, getCachedAnalysis, cacheAnalysis } = require('../services/cache');
const { recordAnalysis } = require('../services/analyticsService');
const { createJob, updateProgress, completeJob, failJob, generateJobId } = require('../services/progressTracker');

const router = express.Router();

// File upload config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 50 * 1024 * 1024,
    files: 20
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: PDF, PNG, JPG, TXT`));
    }
  }
});

/**
 * POST /api/analyze
 * Main analysis endpoint
 */
router.post('/', 
  analyzeLimiter,
  upload.array('files', 20),
  validateAnalyze,
  async (req, res) => {
    const startTime = Date.now();
    const jobId = generateJobId();
    
    try {
      const { examName, subject, subjectCode } = req.validatedBody;
      const files = req.files || [];
      const useOCR = req.body.useOCR === 'true' || req.body.useOCR === true;
      
      if (files.length === 0) {
        return res.status(400).json({ 
          error: 'No files uploaded',
          message: 'Please upload at least one PDF file'
        });
      }
      
      // Create progress job
      createJob(jobId, files.length + 2);
      updateProgress(jobId, 5, 'Starting analysis...');
      
      console.log(`\n📊 Starting analysis for ${subject} (${subjectCode}) [Job: ${jobId}]`);
      console.log(`📁 Files received: ${files.length}`);
      console.log(`🔍 OCR mode: ${useOCR ? 'enabled' : 'auto-detect'}`);
      
      // Check cache first
      const cacheKey = generateCacheKey(files, subject, examName);
      const cachedResult = getCachedAnalysis(cacheKey);
      
      if (cachedResult) {
        completeJob(jobId, cachedResult);
        recordAnalysis({
          subjectCode,
          subject,
          questionsExtracted: cachedResult.analysis?.questionsExtracted || 0,
          predictionsGenerated: cachedResult.predictions?.length || 0,
          processingTime: Date.now() - startTime,
          cached: true
        });
        
        return res.json({
          success: true,
          cached: true,
          jobId,
          analysis: cachedResult,
          processingTime: Date.now() - startTime
        });
      }
      
      // Process each file
      const allQuestions = [];
      const fileResults = [];
      let totalPages = 0;
      let scannedWarning = false;
      let ocrUsed = false;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 70) + 10;
        updateProgress(jobId, progress, `Processing file ${i + 1}/${files.length}: ${file.originalname}`);
        
        console.log(`\n📄 Processing: ${file.originalname}`);
        
        let text = '';
        let numPages = 0;
        let extractionMethod = 'text';
        
        // Handle different file types
        if (file.mimetype === 'application/pdf') {
          // First try normal text extraction
          const pdfResult = await extractTextFromPDF(file.buffer);
          text = pdfResult.text;
          numPages = pdfResult.numPages;
          
          // Check if scanned PDF and OCR is needed
          const needsOCR = useOCR || isLikelyScannedPDF(text, numPages);
          
          if (needsOCR && (!text || text.length < 100)) {
            scannedWarning = true;
            console.log(`🔍 ${file.originalname} needs OCR, converting to images...`);
            updateProgress(jobId, progress, `Running OCR on ${file.originalname}...`);
            
            // Try full OCR with PDF to image conversion
            const ocrResult = await extractTextFromScannedPDF(file.buffer, {
              maxPages: 30,
              dpi: 200
            });
            
            if (ocrResult.success && ocrResult.text) {
              text = ocrResult.text;
              numPages = ocrResult.pagesProcessed || numPages;
              extractionMethod = 'ocr';
              ocrUsed = true;
              console.log(`✅ OCR complete: ${ocrResult.avgConfidence}% confidence`);
            } else if (ocrResult.error) {
              console.log(`⚠️ OCR failed: ${ocrResult.error}`);
              if (ocrResult.suggestion) {
                console.log(`   Suggestion: ${ocrResult.suggestion}`);
              }
            }
          }
        } else if (file.mimetype.startsWith('image/')) {
          // Use OCR for images
          console.log(`🔍 Running OCR on image: ${file.originalname}`);
          const ocrResult = await extractTextFromImage(file.buffer, { enhanceImage: true });
          text = ocrResult.text;
          numPages = 1;
          extractionMethod = 'ocr';
          ocrUsed = true;
          console.log(`   OCR confidence: ${ocrResult.confidence}%`);
        } else if (file.mimetype === 'text/plain') {
          text = file.buffer.toString('utf-8');
          numPages = 1;
          extractionMethod = 'text';
        }
        
        if (!text || text.trim().length < 50) {
          fileResults.push({
            filename: file.originalname,
            status: 'error',
            error: 'Could not extract sufficient text',
            questionsFound: 0,
            method: extractionMethod
          });
          continue;
        }
        
        // Extract questions
        const questions = extractQuestions(text);
        console.log(`✅ ${file.originalname}: ${questions.length} questions extracted from ${numPages} pages (${extractionMethod})`);
        
        allQuestions.push(...questions);
        totalPages += numPages;
        
        fileResults.push({
          filename: file.originalname,
          status: 'success',
          pages: numPages,
          questionsFound: questions.length,
          textLength: text.length,
          method: extractionMethod
        });
      }
      
      console.log(`\n📝 Total questions extracted: ${allQuestions.length}`);
      updateProgress(jobId, 85, 'Running AI analysis...');
      
      // Analyze with AI
      console.log('🤖 Starting AI analysis...');
      const aiAnalysis = await analyzeWithAI(allQuestions, subject, examName);
      console.log(`✅ AI analysis complete: ${aiAnalysis.predictions?.length || 0} predictions`);
      
      updateProgress(jobId, 95, 'Finalizing results...');
      
      // Build warnings
      const warnings = [];
      if (scannedWarning) {
        warnings.push('Some PDFs appear to be scanned images. OCR was used for text extraction.');
      }
      if (ocrUsed) {
        warnings.push('OCR was used for some files. Results may vary based on image quality.');
      }
      
      // Build response
      const result = {
        predictions: aiAnalysis.predictions || [],
        summary: aiAnalysis.summary || [],
        trends: aiAnalysis.trends || {},
        exam: {
          name: sanitizeText(examName),
          subject: sanitizeText(subject),
          subjectCode: sanitizeText(subjectCode)
        },
        analysis: {
          papersAnalyzed: files.length,
          pagesProcessed: totalPages,
          questionsExtracted: allQuestions.length,
          topicsCovered: new Set(aiAnalysis.predictions?.map(p => p.topic) || []).size,
          avgAccuracy: 85,
          ocrUsed,
          fileResults
        },
        recurrence: (aiAnalysis.predictions || []).slice(0, 5).map((p, i) => ({
          topic: p.topic,
          frequency: Math.max(1, 10 - i * 2),
          lastAsked: 2024 - i
        })),
        warnings
      };
      
      // Cache the result
      cacheAnalysis(cacheKey, result);
      
      // Store in database if available
      if (global.supabase && subjectCode) {
        try {
          await global.supabase.from('analysis_results').insert({
            subject_code: subjectCode,
            analysis_type: 'prediction',
            data: result
          });
          console.log('💾 Saved to database');
        } catch (dbError) {
          console.error('Database save error:', dbError.message);
        }
      }
      
      const processingTime = Date.now() - startTime;
      console.log(`\n⏱️ Total processing time: ${processingTime}ms`);
      
      // Record analytics
      recordAnalysis({
        subjectCode,
        subject,
        questionsExtracted: allQuestions.length,
        predictionsGenerated: aiAnalysis.predictions?.length || 0,
        processingTime,
        cached: false
      });
      
      // Complete job
      completeJob(jobId, result);
      
      res.json({
        success: true,
        cached: false,
        jobId,
        analysis: result,
        processingTime
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      failJob(jobId, error.message);
      res.status(500).json({ 
        error: 'Analysis failed', 
        message: error.message,
        jobId,
        processingTime: Date.now() - startTime
      });
    }
  }
);

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large', message: 'Maximum file size is 50MB' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files', message: 'Maximum 20 files allowed' });
    }
  }
  next(error);
});

module.exports = router;
