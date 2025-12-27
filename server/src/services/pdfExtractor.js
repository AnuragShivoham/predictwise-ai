/**
 * PDF Text Extraction Service
 * Basic PDF handling - main extraction done by Gemini Vision
 */

/**
 * Extract text from PDF buffer
 * Returns minimal info since Gemini Vision handles actual extraction
 */
async function extractTextFromPDF(buffer) {
  try {
    // Basic PDF validation - check for PDF header
    const header = buffer.slice(0, 5).toString();
    if (!header.startsWith('%PDF-')) {
      return {
        text: '',
        numPages: 0,
        error: 'Invalid PDF file'
      };
    }
    
    // Estimate page count from PDF (rough estimate)
    const content = buffer.toString('binary');
    const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
    const numPages = pageMatches ? pageMatches.length : 1;
    
    // Return empty text - Gemini Vision will do the actual extraction
    return {
      text: '',
      numPages: numPages,
      info: {},
      metadata: {}
    };
  } catch (error) {
    console.error('PDF validation error:', error.message);
    return {
      text: '',
      numPages: 0,
      error: error.message
    };
  }
}

/**
 * Clean extracted PDF text
 */
function cleanExtractedText(text) {
  if (!text) return '';
  
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Check if PDF is likely scanned (image-based)
 * Always returns true since we use Gemini Vision for all PDFs
 */
function isLikelyScannedPDF(extractedText, numPages) {
  return true; // Always use OCR path
}

/**
 * Extract metadata from PDF
 */
function extractPDFMetadata(info, metadata) {
  return {
    title: info?.Title || metadata?.['dc:title'] || null,
    author: info?.Author || metadata?.['dc:creator'] || null,
    subject: info?.Subject || metadata?.['dc:subject'] || null,
    creator: info?.Creator || null,
    producer: info?.Producer || null,
    creationDate: info?.CreationDate || null,
    modificationDate: info?.ModDate || null
  };
}

module.exports = {
  extractTextFromPDF,
  cleanExtractedText,
  isLikelyScannedPDF,
  extractPDFMetadata
};
