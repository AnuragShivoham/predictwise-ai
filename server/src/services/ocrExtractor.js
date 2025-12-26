const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * OCR Extraction Service
 * Handles text extraction from scanned PDFs and images using Tesseract.js
 * Pure JavaScript implementation - NO external dependencies required
 */

let worker = null;

/**
 * Initialize Tesseract worker
 */
async function initializeWorker() {
  if (!worker) {
    console.log('🔧 Initializing Tesseract OCR worker...');
    worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text' && m.progress > 0) {
          const pct = Math.round(m.progress * 100);
          if (pct % 25 === 0) {
            console.log(`   OCR Progress: ${pct}%`);
          }
        }
      }
    });
    console.log('✅ Tesseract OCR worker ready');
  }
  return worker;
}

/**
 * Extract embedded images from PDF using pdf2json
 * This extracts any embedded image data from the PDF
 */
async function extractImagesFromPDF(pdfBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      const images = [];
      
      pdfParser.on('pdfParser_dataError', errData => {
        console.error('PDF parsing error:', errData.parserError);
        resolve({ images: [], success: false, error: errData.parserError });
      });
      
      pdfParser.on('pdfParser_dataReady', pdfData => {
        // pdf2json extracts text, not images directly
        // But we can get page count and structure
        const pages = pdfData.Pages || [];
        resolve({ 
          images: [], 
          pageCount: pages.length,
          success: true,
          rawData: pdfData
        });
      });
      
      pdfParser.parseBuffer(pdfBuffer);
    } catch (error) {
      resolve({ images: [], success: false, error: error.message });
    }
  });
}

/**
 * Extract text from PDF using pdf2json (pure JS)
 * Works well for text-based PDFs
 */
async function extractTextWithPdf2Json(pdfBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', errData => {
        resolve({ text: '', success: false, error: errData.parserError });
      });
      
      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          // Extract raw text from all pages
          const text = pdfParser.getRawTextContent();
          const pages = pdfData.Pages || [];
          
          resolve({
            text: text || '',
            numPages: pages.length,
            success: true
          });
        } catch (e) {
          resolve({ text: '', success: false, error: e.message });
        }
      });
      
      pdfParser.parseBuffer(pdfBuffer);
    } catch (error) {
      resolve({ text: '', success: false, error: error.message });
    }
  });
}

/**
 * Extract text from image buffer using OCR
 */
async function extractTextFromImage(imageBuffer, options = {}) {
  const { enhanceImage = true } = options;
  
  try {
    const w = await initializeWorker();
    
    let processedBuffer = imageBuffer;
    
    // Try to enhance image if sharp is available
    if (enhanceImage) {
      try {
        const sharp = require('sharp');
        processedBuffer = await sharp(imageBuffer)
          .grayscale()
          .normalize()
          .sharpen()
          .toBuffer();
      } catch (e) {
        // Sharp not available or failed, use original
      }
    }
    
    const { data: { text, confidence } } = await w.recognize(processedBuffer);
    
    return {
      text: cleanOCRText(text),
      confidence: Math.round(confidence),
      success: true
    };
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    return {
      text: '',
      confidence: 0,
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract text from multiple images
 */
async function extractTextFromImages(imageBuffers, onProgress) {
  const results = [];
  let totalText = '';
  const totalImages = imageBuffers.length;
  
  console.log(`🔍 Starting OCR on ${totalImages} images...`);
  
  for (let i = 0; i < totalImages; i++) {
    const pageNum = i + 1;
    console.log(`   Processing page ${pageNum}/${totalImages}...`);
    
    if (onProgress) {
      onProgress({
        current: pageNum,
        total: totalImages,
        percent: Math.round((pageNum / totalImages) * 100)
      });
    }
    
    const result = await extractTextFromImage(imageBuffers[i]);
    results.push(result);
    
    if (result.success && result.text) {
      totalText += result.text + '\n\n--- Page Break ---\n\n';
    }
  }
  
  const successfulResults = results.filter(r => r.success);
  const avgConfidence = successfulResults.length > 0
    ? Math.round(successfulResults.reduce((sum, r) => sum + r.confidence, 0) / successfulResults.length)
    : 0;
  
  console.log(`✅ OCR complete. Avg confidence: ${avgConfidence}%`);
  
  return {
    text: totalText.trim(),
    pageResults: results,
    avgConfidence,
    pagesProcessed: totalImages,
    successfulPages: successfulResults.length
  };
}

/**
 * Convert PDF to images using pdfjs-dist (pure JavaScript)
 * This is a fallback method that works without external dependencies
 */
async function convertPDFToImagesWithPdfJs(pdfBuffer, options = {}) {
  const { maxPages = 20, scale = 1.5 } = options;
  
  try {
    // Dynamic import for pdfjs-dist
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDoc = await loadingTask.promise;
    
    const numPages = Math.min(pdfDoc.numPages, maxPages);
    const images = [];
    
    console.log(`   PDF has ${pdfDoc.numPages} pages, processing ${numPages}...`);
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        // Get text content directly (no canvas needed)
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        
        images.push({
          pageNum,
          text: pageText,
          width: viewport.width,
          height: viewport.height
        });
      } catch (pageError) {
        console.error(`   Error processing page ${pageNum}:`, pageError.message);
      }
    }
    
    return {
      pages: images,
      numPages: images.length,
      success: true,
      method: 'pdfjs-text'
    };
  } catch (error) {
    console.error('PDF.js processing error:', error.message);
    return {
      pages: [],
      numPages: 0,
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract text from scanned PDF
 * Uses multiple strategies:
 * 1. Try pdf2json for text extraction
 * 2. Try pdfjs-dist for text layer extraction
 * 3. For truly scanned PDFs, inform user about limitations
 */
async function extractTextFromScannedPDF(pdfBuffer, options = {}) {
  const { maxPages = 20 } = options;
  
  console.log('📄 Processing PDF for text extraction...');
  
  try {
    // Strategy 1: Try pdf2json first (good for text-based PDFs)
    console.log('   Trying pdf2json extraction...');
    const pdf2jsonResult = await extractTextWithPdf2Json(pdfBuffer);
    
    if (pdf2jsonResult.success && pdf2jsonResult.text && pdf2jsonResult.text.length > 100) {
      console.log(`✅ pdf2json extracted ${pdf2jsonResult.text.length} characters`);
      return {
        text: cleanOCRText(pdf2jsonResult.text),
        success: true,
        pagesProcessed: pdf2jsonResult.numPages,
        avgConfidence: 95,
        method: 'pdf2json'
      };
    }
    
    // Strategy 2: Try pdfjs-dist for text layer
    console.log('   Trying pdfjs-dist extraction...');
    const pdfjsResult = await convertPDFToImagesWithPdfJs(pdfBuffer, { maxPages });
    
    if (pdfjsResult.success && pdfjsResult.pages.length > 0) {
      const combinedText = pdfjsResult.pages
        .map(p => p.text)
        .filter(t => t && t.trim().length > 0)
        .join('\n\n--- Page Break ---\n\n');
      
      if (combinedText.length > 100) {
        console.log(`✅ pdfjs-dist extracted ${combinedText.length} characters`);
        return {
          text: cleanOCRText(combinedText),
          success: true,
          pagesProcessed: pdfjsResult.numPages,
          avgConfidence: 90,
          method: 'pdfjs-dist'
        };
      }
    }
    
    // Strategy 3: For truly scanned PDFs (image-only)
    // We can't do full OCR without canvas/image conversion
    // But we can provide helpful feedback
    console.log('⚠️ PDF appears to be scanned (image-only)');
    
    return {
      text: '',
      success: false,
      pagesProcessed: 0,
      avgConfidence: 0,
      method: 'none',
      error: 'PDF appears to be scanned (image-only). Text extraction not possible.',
      suggestion: 'For scanned PDFs, please convert to images first using an external tool, then upload the images directly for OCR processing.'
    };
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: '',
      success: false,
      error: error.message
    };
  }
}

/**
 * Clean OCR extracted text
 */
function cleanOCRText(text) {
  if (!text) return '';
  
  return text
    // Fix common OCR errors
    .replace(/[|]/g, 'I')
    .replace(/0(?=[a-zA-Z])/g, 'O')
    .replace(/1(?=[a-zA-Z]{2})/g, 'l')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    // Decode URL-encoded characters (pdf2json encodes spaces as %20)
    .replace(/%20/g, ' ')
    .replace(/%0A/g, '\n')
    .replace(/%2C/g, ',')
    .replace(/%3A/g, ':')
    .replace(/%3B/g, ';')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']')
    .replace(/%2F/g, '/')
    .replace(/%3F/g, '?')
    .replace(/%26/g, '&')
    .replace(/%3D/g, '=')
    .replace(/%25/g, '%')
    // Remove noise but keep math symbols
    .replace(/[^\w\s\.\,\?\!\:\;\-\(\)\[\]\'\"\/\+\=\*\%\@\#\$\&\^\<\>]/g, ' ')
    // Fix spacing
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove short lines (noise)
    .split('\n')
    .filter(line => line.trim().length > 2)
    .join('\n')
    // Fix word breaks
    .replace(/(\w)-\s+(\w)/g, '$1$2')
    .trim();
}

/**
 * Preprocess image for better OCR
 */
async function preprocessImage(imageBuffer) {
  try {
    const sharp = require('sharp');
    
    return await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .sharpen({ sigma: 1.5 })
      .median(1)
      .resize(null, null, {
        width: 2000,
        height: 3000,
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();
  } catch (error) {
    return imageBuffer;
  }
}

/**
 * Terminate worker when done
 */
async function terminateWorker() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

module.exports = {
  extractTextFromImage,
  extractTextFromImages,
  extractTextFromScannedPDF,
  extractTextWithPdf2Json,
  convertPDFToImagesWithPdfJs,
  cleanOCRText,
  preprocessImage,
  initializeWorker,
  terminateWorker
};
