const pdfParse = require('pdf-parse');

/**
 * PDF Text Extraction Service
 * Handles text extraction from PDF files with cleaning
 */

/**
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer, {
      // Increase max pages if needed
      max: 50
    });
    
    return {
      text: cleanExtractedText(data.text),
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('PDF extraction error:', error.message);
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
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove common PDF artifacts
    .replace(/QP\d+[A-Z]*_\d+\s*\|\s*/gi, '')
    .replace(/Printed Page:\s*\d+\s*of\s*\d+/gi, '')
    // Remove IP addresses (often in headers)
    .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '')
    // Remove timestamps
    .replace(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?/gi, '')
    // Remove date patterns
    .replace(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/g, '')
    // Remove repeated pipe characters
    .replace(/\|+/g, ' ')
    // Remove page numbers at start of lines
    .replace(/^\s*Page\s*\d+\s*$/gim, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove lines that are just numbers
    .replace(/^\s*\d+\s*$/gm, '')
    // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Check if PDF is likely scanned (image-based)
 */
function isLikelyScannedPDF(extractedText, numPages) {
  if (!extractedText || numPages === 0) return true;
  
  // Calculate characters per page
  const charsPerPage = extractedText.length / numPages;
  
  // If very few characters per page, likely scanned
  if (charsPerPage < 100) return true;
  
  // If mostly non-alphabetic characters, likely OCR issues
  const alphaRatio = (extractedText.match(/[a-zA-Z]/g) || []).length / extractedText.length;
  if (alphaRatio < 0.3) return true;
  
  return false;
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
