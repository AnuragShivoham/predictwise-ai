const Tesseract = require('tesseract.js');

/**
 * OCR Extraction Service
 * Handles text extraction from scanned PDFs and images
 * Uses pdf-to-png-converter locally, falls back to text extraction on Vercel
 */

let worker = null;
let pdfToPngAvailable = null;

/**
 * Check if pdf-to-png-converter is available
 */
async function checkPdfToPngAvailable() {
  if (pdfToPngAvailable !== null) return pdfToPngAvailable;
  
  try {
    await import('pdf-to-png-converter');
    pdfToPngAvailable = true;
    console.log('✅ pdf-to-png-converter available');
  } catch (e) {
    pdfToPngAvailable = false;
    console.log('⚠️ pdf-to-png-converter not available, using text extraction only');
  }
  return pdfToPngAvailable;
}

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
          if (pct % 20 === 0) {
            process.stdout.write(`\r   OCR Progress: ${pct}%`);
          }
        }
      }
    });
    console.log('\n✅ Tesseract OCR worker ready');
  }
  return worker;
}

/**
 * Extract text from image buffer using OCR
 */
async function extractTextFromImage(imageBuffer) {
  try {
    const w = await initializeWorker();
    const { data: { text, confidence } } = await w.recognize(imageBuffer);
    
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
 * Convert PDF to images and run OCR (works locally, may fail on Vercel)
 */
async function convertPDFAndOCR(pdfBuffer, options = {}) {
  const { maxPages = 30 } = options;
  
  try {
    const { pdfToPng } = await import('pdf-to-png-converter');
    
    console.log(`   Converting PDF pages to images...`);
    
    const pngPages = await pdfToPng(pdfBuffer, {
      disableFontFace: true,
      useSystemFonts: true,
      viewportScale: 2.0,
      pagesToProcess: maxPages > 0 ? Array.from({ length: maxPages }, (_, i) => i + 1) : undefined
    });
    
    console.log(`   Converted ${pngPages.length} pages to images`);
    
    let allText = '';
    let totalConfidence = 0;
    let successfulPages = 0;
    
    for (let i = 0; i < pngPages.length; i++) {
      const page = pngPages[i];
      console.log(`   Running OCR on page ${i + 1}/${pngPages.length}...`);
      
      const ocrResult = await extractTextFromImage(page.content);
      
      if (ocrResult.success && ocrResult.text) {
        allText += `\n--- Page ${i + 1} ---\n${ocrResult.text}\n`;
        totalConfidence += ocrResult.confidence;
        successfulPages++;
        console.log(`   Page ${i + 1}: ${ocrResult.text.length} chars, ${ocrResult.confidence}% confidence`);
      }
    }
    
    const avgConfidence = successfulPages > 0 ? Math.round(totalConfidence / successfulPages) : 0;
    
    console.log(`\n✅ PDF OCR complete: ${allText.length} chars total, ${avgConfidence}% avg confidence`);
    
    return {
      text: allText.trim(),
      success: allText.length > 50,
      pagesProcessed: pngPages.length,
      avgConfidence,
      method: 'pdf-to-png-ocr'
    };
    
  } catch (error) {
    console.error('PDF to PNG conversion error:', error.message);
    return {
      text: '',
      success: false,
      error: error.message,
      method: 'pdf-to-png-ocr'
    };
  }
}

/**
 * Extract text from PDF using pdf2json
 */
async function extractTextWithPdf2Json(pdfBuffer) {
  return new Promise((resolve) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', errData => {
        resolve({ text: '', success: false, error: errData.parserError });
      });
      
      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const text = pdfParser.getRawTextContent();
          const pages = pdfData.Pages || [];
          resolve({
            text: cleanOCRText(text || ''),
            numPages: pages.length,
            success: true,
            method: 'pdf2json'
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
 * Extract text using pdf-parse library
 */
async function extractTextWithPdfParse(pdfBuffer) {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(pdfBuffer);
    
    return {
      text: cleanOCRText(data.text || ''),
      numPages: data.numpages,
      success: data.text && data.text.length > 50,
      method: 'pdf-parse'
    };
  } catch (error) {
    return { text: '', success: false, error: error.message };
  }
}

/**
 * Extract text from scanned PDF
 * Tries multiple methods - OCR for scanned, text extraction for digital
 */
async function extractTextFromScannedPDF(pdfBuffer, options = {}) {
  console.log('📄 Processing PDF for text extraction...');
  
  try {
    // Method 1: Try pdf-parse first (fast, for text-based PDFs)
    console.log('   Trying pdf-parse extraction...');
    const pdfParseResult = await extractTextWithPdfParse(pdfBuffer);
    
    if (pdfParseResult.success && pdfParseResult.text.length > 200) {
      console.log(`✅ pdf-parse extracted ${pdfParseResult.text.length} characters`);
      return {
        text: pdfParseResult.text,
        success: true,
        pagesProcessed: pdfParseResult.numPages,
        avgConfidence: 95,
        method: 'pdf-parse'
      };
    }
    
    // Method 2: Try pdf2json
    console.log('   Trying pdf2json extraction...');
    const pdf2jsonResult = await extractTextWithPdf2Json(pdfBuffer);
    
    if (pdf2jsonResult.success && pdf2jsonResult.text && pdf2jsonResult.text.length > 200) {
      console.log(`✅ pdf2json extracted ${pdf2jsonResult.text.length} characters`);
      return {
        text: pdf2jsonResult.text,
        success: true,
        pagesProcessed: pdf2jsonResult.numPages,
        avgConfidence: 90,
        method: 'pdf2json'
      };
    }
    
    // Method 3: PDF appears scanned - try OCR if available
    const canDoOCR = await checkPdfToPngAvailable();
    
    if (canDoOCR) {
      console.log('   PDF appears scanned, converting to images for OCR...');
      const ocrResult = await convertPDFAndOCR(pdfBuffer, options);
      
      if (ocrResult.success && ocrResult.text) {
        return ocrResult;
      }
    }
    
    // Combine any partial results
    const combinedText = [pdfParseResult.text, pdf2jsonResult.text]
      .filter(t => t && t.length > 0)
      .join('\n\n');
    
    if (combinedText.length > 100) {
      return {
        text: combinedText,
        success: true,
        pagesProcessed: pdfParseResult.numPages || pdf2jsonResult.numPages || 1,
        avgConfidence: 70,
        method: 'combined'
      };
    }
    
    // Nothing worked
    return {
      text: '',
      success: false,
      pagesProcessed: 0,
      avgConfidence: 0,
      method: 'none',
      error: 'Could not extract text. PDF may be scanned images.'
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
 * Clean OCR/PDF extracted text
 */
function cleanOCRText(text) {
  if (!text) return '';
  
  return text
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
    .replace(/[|]/g, 'I')
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .split('\n')
    .filter(line => line.trim().length > 2)
    .join('\n')
    .trim();
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
  extractTextFromScannedPDF,
  extractTextWithPdf2Json,
  extractTextWithPdfParse,
  convertPDFAndOCR,
  cleanOCRText,
  initializeWorker,
  terminateWorker
};
