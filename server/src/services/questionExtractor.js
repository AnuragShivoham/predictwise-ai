/**
 * Advanced Question Extraction Service
 * Handles multiple question formats from various exam papers
 */

// Comprehensive question patterns
const QUESTION_PATTERNS = [
  // Numbered questions: 1. 2. 3.
  /^\s*(\d+)\.\s*(.+?\?)/gm,
  // Q1, Q2, Q.1 format
  /^\s*Q\.?\s*(\d+)[\.\)]\s*(.+?\?)/gim,
  // Section-based: (a) (b) (c)
  /^\s*\([a-z]\)\s*(.+?\?)/gim,
  // Roman numerals: (i) (ii) (iii)
  /^\s*\([ivxlcdm]+\)\s*(.+?\?)/gim,
  // Square brackets: [1] [2]
  /^\s*\[\d+\]\s*(.+?\?)/gim,
  // Keywords starting questions with ?
  /^\s*(Explain|Define|Describe|What|How|Why|Compare|Differentiate|List|State|Derive|Prove|Calculate|Find|Solve|Discuss|Enumerate|Illustrate|Analyze|Evaluate|Justify|Examine)\s+.+?\?/gim,
  // Questions without ? but with keywords (statements)
  /^\s*(Explain|Define|Describe|Discuss|Compare|Derive|Prove|State|List|Enumerate|Illustrate|Analyze)\s+.{20,300}\.$/gim,
  // AKTU specific: Q no. format
  /^\s*Q\s*no\.?\s*(\d+)[\.\:\)]\s*(.+)/gim,
  // Short answer format: Write short notes on
  /^\s*(Write\s+short\s+notes?\s+on|Write\s+a\s+note\s+on)\s+.+/gim,
  // Numerical problems
  /^\s*(\d+)\.\s*(Calculate|Find|Determine|Compute|Solve|Evaluate)\s+.+/gim,
];

// Keywords that indicate a question
const QUESTION_KEYWORDS = [
  'explain', 'define', 'describe', 'what', 'how', 'why', 'compare',
  'differentiate', 'list', 'state', 'derive', 'prove', 'calculate',
  'find', 'solve', 'discuss', 'enumerate', 'illustrate', 'analyze',
  'evaluate', 'justify', 'examine', 'write', 'draw', 'sketch',
  'distinguish', 'elaborate', 'mention', 'give', 'name'
];

// Words to filter out (not actual questions)
const FILTER_WORDS = [
  'note:', 'hint:', 'given:', 'assume:', 'figure', 'diagram',
  'marks', 'time:', 'instructions', 'attempt', 'compulsory',
  'section', 'part', 'unit', 'module', 'chapter'
];

/**
 * Extract questions from text using multiple patterns
 */
function extractQuestions(text) {
  if (!text || typeof text !== 'string') return [];
  
  const questions = new Set();
  const normalizedText = normalizeText(text);
  
  // Try each pattern
  for (const pattern of QUESTION_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(normalizedText)) !== null) {
      // Get the actual question text (last capture group or full match)
      let question = match[match.length - 1] || match[0];
      question = cleanQuestion(question);
      
      if (isValidQuestion(question)) {
        questions.add(question);
      }
    }
  }
  
  // Also try line-by-line extraction for edge cases
  const lines = normalizedText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (looksLikeQuestion(trimmed) && isValidQuestion(trimmed)) {
      questions.add(cleanQuestion(trimmed));
    }
  }
  
  return Array.from(questions);
}

/**
 * Normalize text for better pattern matching
 */
function normalizeText(text) {
  return text
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Fix common OCR errors
    .replace(/[|l](?=\s*\d)/g, '1')
    .replace(/[O0](?=\s*\.)/g, '0')
    // Normalize question marks
    .replace(/[？]/g, '?')
    // Add line breaks before question numbers
    .replace(/(\d+)\.\s+/g, '\n$1. ')
    .replace(/Q\.?\s*(\d+)/gi, '\nQ.$1')
    .trim();
}

/**
 * Clean extracted question text
 */
function cleanQuestion(text) {
  if (!text) return '';
  
  return text
    // Remove leading question numbers/markers
    .replace(/^[\s\d\.\)\(\[\]Q:]+/i, '')
    // Remove trailing whitespace and periods (but keep ?)
    .replace(/\s+$/, '')
    // Remove marks indicators
    .replace(/\[\d+\s*marks?\]/gi, '')
    .replace(/\(\d+\s*marks?\)/gi, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if text looks like a question
 */
function looksLikeQuestion(text) {
  if (!text || text.length < 15) return false;
  
  const lower = text.toLowerCase();
  
  // Has question mark
  if (text.includes('?')) return true;
  
  // Starts with question keyword
  for (const keyword of QUESTION_KEYWORDS) {
    if (lower.startsWith(keyword + ' ') || lower.startsWith(keyword + ':')) {
      return true;
    }
  }
  
  // Starts with number followed by question keyword
  if (/^\d+[\.\)]\s*(explain|define|describe|what|how|why)/i.test(text)) {
    return true;
  }
  
  return false;
}

/**
 * Validate if extracted text is a valid question
 */
function isValidQuestion(text) {
  if (!text || typeof text !== 'string') return false;
  
  const trimmed = text.trim();
  
  // Length checks
  if (trimmed.length < 15 || trimmed.length > 500) return false;
  
  // Must have some alphabetic content
  if (!/[a-zA-Z]{3,}/.test(trimmed)) return false;
  
  // Filter out non-questions
  const lower = trimmed.toLowerCase();
  for (const filterWord of FILTER_WORDS) {
    if (lower.startsWith(filterWord)) return false;
  }
  
  // Filter out if it's just numbers and symbols
  if (/^[\d\s\.\,\-\+\=\(\)]+$/.test(trimmed)) return false;
  
  // Filter out very short "questions" that are likely headers
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 4 && !trimmed.includes('?')) return false;
  
  return true;
}

/**
 * Extract questions with metadata
 */
function extractQuestionsWithMetadata(text) {
  const questions = extractQuestions(text);
  
  return questions.map((q, index) => ({
    id: index + 1,
    text: q,
    hasQuestionMark: q.includes('?'),
    wordCount: q.split(/\s+/).length,
    estimatedType: estimateQuestionType(q),
    keywords: extractKeywords(q)
  }));
}

/**
 * Estimate question type based on content
 */
function estimateQuestionType(question) {
  const lower = question.toLowerCase();
  
  if (/calculate|find|solve|compute|determine|evaluate\s+\d/.test(lower)) {
    return 'Numerical';
  }
  if (/define|what\s+is|meaning\s+of/.test(lower)) {
    return 'Short Answer';
  }
  if (/explain|describe|discuss|elaborate|analyze/.test(lower)) {
    return 'Long Answer';
  }
  if (/compare|differentiate|distinguish/.test(lower)) {
    return 'Comparison';
  }
  if (/list|enumerate|name|mention/.test(lower)) {
    return 'List';
  }
  if (/derive|prove|show\s+that/.test(lower)) {
    return 'Derivation';
  }
  if (/draw|sketch|diagram/.test(lower)) {
    return 'Diagram';
  }
  
  return 'Long Answer';
}

/**
 * Extract keywords from question
 */
function extractKeywords(question) {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once', 'and',
    'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither', 'not',
    'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also'
  ]);
  
  const words = question.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  // Return unique keywords
  return [...new Set(words)].slice(0, 10);
}

module.exports = {
  extractQuestions,
  extractQuestionsWithMetadata,
  cleanQuestion,
  isValidQuestion,
  estimateQuestionType,
  extractKeywords,
  QUESTION_PATTERNS,
  QUESTION_KEYWORDS
};
