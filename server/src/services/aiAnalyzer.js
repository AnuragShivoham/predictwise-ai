const OpenAI = require('openai');

/**
 * AI Analysis Service
 * Handles OpenAI integration for question analysis and prediction
 */

let openai = null;

function initializeOpenAI() {
  if (process.env.OPENAI_API_KEY && !openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

/**
 * Generate analysis prompt
 */
function generateAnalysisPrompt(questions, subject, examName) {
  return `You are an expert exam paper analyzer specializing in ${subject} for ${examName || 'academic exams'}.

Analyze the following ${questions.length} questions extracted from previous year papers.

Your task:
1. Identify the most frequently tested topics and concepts
2. Detect patterns in question types (numerical, theoretical, application-based, derivation)
3. Assess difficulty distribution trends
4. Predict 10 most likely questions for the upcoming exam based on patterns

For each prediction, provide:
- topic: The specific topic/chapter (be specific, not generic)
- question: A complete, well-formed question (not just topic name)
- difficulty: "Easy", "Medium", or "Hard" based on historical patterns
- probability: 0.0-1.0 confidence score based on recurrence
- type: "Short Answer", "Long Answer", "Numerical", or "Derivation"
- rationale: Brief explanation of why this question is likely (cite patterns observed)
- section: "A", "B", or "C" based on typical exam structure

Also provide:
- summary: Array of top 5 most important topics
- trends: Object with difficultyProgression (array of {year, easy, medium, hard})

Return ONLY valid JSON in this exact format:
{
  "predictions": [...],
  "summary": ["topic1", "topic2", ...],
  "trends": {
    "difficultyProgression": [{"year": "2021", "easy": 5, "medium": 8, "hard": 4}, ...]
  }
}

Questions to analyze:
${questions.slice(0, 50).map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
}

/**
 * Analyze questions with OpenAI
 */
async function analyzeWithAI(questions, subject, examName) {
  const client = initializeOpenAI();
  
  if (!client || questions.length === 0) {
    console.log('Using fallback predictions (no OpenAI or no questions)');
    return generateFallbackPredictions(questions, subject);
  }
  
  try {
    const prompt = generateAnalysisPrompt(questions, subject, examName);
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert exam analyzer. Always respond with valid JSON only. No markdown, no explanations outside JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
      temperature: 0.7
    });
    
    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Validate response structure
    if (!parsed.predictions || !Array.isArray(parsed.predictions)) {
      throw new Error('Invalid response structure');
    }
    
    // Ensure all predictions have required fields
    parsed.predictions = parsed.predictions.map((p, i) => ({
      id: i + 1,
      topic: p.topic || 'Unknown Topic',
      question: p.question || `Explain key concepts of ${p.topic}`,
      difficulty: ['Easy', 'Medium', 'Hard'].includes(p.difficulty) ? p.difficulty : 'Medium',
      probability: typeof p.probability === 'number' ? Math.min(1, Math.max(0, p.probability)) : 0.5,
      type: p.type || 'Long Answer',
      rationale: p.rationale || 'Based on historical pattern analysis',
      section: ['A', 'B', 'C'].includes(p.section) ? p.section : 'A'
    }));
    
    return parsed;
  } catch (error) {
    console.error('OpenAI analysis error:', error.message);
    return generateFallbackPredictions(questions, subject);
  }
}

/**
 * Generate fallback predictions when AI is unavailable
 */
function generateFallbackPredictions(questions, subject) {
  // Extract topics from questions using keyword analysis
  const topicCounts = {};
  const keywords = [
    'algorithm', 'data structure', 'tree', 'graph', 'sorting', 'searching',
    'array', 'linked list', 'stack', 'queue', 'hash', 'heap',
    'complexity', 'recursion', 'dynamic programming', 'greedy',
    'database', 'sql', 'normalization', 'transaction',
    'operating system', 'process', 'thread', 'memory', 'scheduling',
    'network', 'protocol', 'tcp', 'ip', 'routing',
    'compiler', 'parsing', 'lexical', 'syntax',
    'machine learning', 'neural network', 'classification', 'regression'
  ];
  
  questions.forEach(q => {
    const lower = q.toLowerCase();
    keywords.forEach(kw => {
      if (lower.includes(kw)) {
        topicCounts[kw] = (topicCounts[kw] || 0) + 1;
      }
    });
  });
  
  // Sort topics by frequency
  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Generate predictions from top topics or use defaults
  const predictions = sortedTopics.length > 0
    ? sortedTopics.map(([topic, count], i) => ({
        id: i + 1,
        topic: topic.charAt(0).toUpperCase() + topic.slice(1),
        question: questions.find(q => q.toLowerCase().includes(topic)) || 
                  `Explain the concept of ${topic} with examples`,
        difficulty: i < 3 ? 'Easy' : i < 7 ? 'Medium' : 'Hard',
        probability: Math.round((0.9 - (i * 0.08)) * 100) / 100,
        type: i % 2 === 0 ? 'Long Answer' : 'Short Answer',
        rationale: `This topic appeared ${count} times in the analyzed papers`,
        section: i < 3 ? 'A' : i < 7 ? 'B' : 'C'
      }))
    : generateDefaultPredictions(subject);
  
  return {
    predictions,
    summary: predictions.slice(0, 5).map(p => p.topic),
    trends: {
      difficultyProgression: [
        { year: '2021', easy: 5, medium: 8, hard: 4 },
        { year: '2022', easy: 4, medium: 10, hard: 5 },
        { year: '2023', easy: 6, medium: 7, hard: 6 },
        { year: '2024', easy: 5, medium: 9, hard: 5 },
        { year: '2025', easy: 7, medium: 6, hard: 6 }
      ]
    }
  };
}

/**
 * Generate default predictions for a subject
 */
function generateDefaultPredictions(subject) {
  const defaultTopics = [
    { topic: 'Fundamentals', question: `Explain the fundamental concepts of ${subject}` },
    { topic: 'Core Principles', question: `Describe the core principles and their applications in ${subject}` },
    { topic: 'Problem Solving', question: `Solve a typical problem related to ${subject}` },
    { topic: 'Applications', question: `Discuss real-world applications of ${subject}` },
    { topic: 'Advanced Topics', question: `Analyze advanced concepts in ${subject}` }
  ];
  
  return defaultTopics.map((t, i) => ({
    id: i + 1,
    topic: `${subject} - ${t.topic}`,
    question: t.question,
    difficulty: ['Easy', 'Medium', 'Medium', 'Hard', 'Hard'][i],
    probability: 0.7 - (i * 0.1),
    type: i % 2 === 0 ? 'Long Answer' : 'Short Answer',
    rationale: 'Based on common exam patterns',
    section: i < 2 ? 'A' : i < 4 ? 'B' : 'C'
  }));
}

module.exports = {
  analyzeWithAI,
  generateFallbackPredictions,
  generateAnalysisPrompt,
  initializeOpenAI
};
