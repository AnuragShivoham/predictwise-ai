const express = require('express');
const { validateSubjectCode } = require('../middleware/validation');
const { predictionsLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * GET /api/predictions/:subjectCode
 * Get predictions for a subject
 */
router.get('/:subjectCode',
  predictionsLimiter,
  validateSubjectCode,
  async (req, res) => {
    try {
      const { subjectCode } = req.validatedParams;
      
      // Try to fetch from database
      if (global.supabase) {
        const { data, error } = await global.supabase
          .from('analysis_results')
          .select('*')
          .eq('subject_code', subjectCode)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0) {
          return res.json({
            success: true,
            source: 'database',
            ...data[0].data
          });
        }
      }
      
      // Return demo data if no stored results
      res.json({
        success: true,
        source: 'demo',
        predictions: [
          { 
            id: 1,
            topic: 'Data Structures - Trees', 
            question: 'Explain the working of a binary search tree with insertion and deletion operations.', 
            difficulty: 'Medium', 
            probability: 0.85, 
            type: 'Long Answer',
            rationale: 'Trees are fundamental and appear in 80% of papers',
            section: 'B'
          },
          { 
            id: 2,
            topic: 'Algorithms - Sorting', 
            question: 'Compare and contrast quicksort and mergesort algorithms with their time complexities.', 
            difficulty: 'Medium', 
            probability: 0.78, 
            type: 'Long Answer',
            rationale: 'Sorting algorithms are consistently tested',
            section: 'B'
          },
          { 
            id: 3,
            topic: 'Graph Algorithms', 
            question: 'Explain Dijkstra\'s shortest path algorithm with an example.', 
            difficulty: 'Hard', 
            probability: 0.72, 
            type: 'Long Answer',
            rationale: 'Graph algorithms appear in most advanced sections',
            section: 'C'
          },
          { 
            id: 4,
            topic: 'Complexity Analysis', 
            question: 'Define Big-O notation and analyze the time complexity of binary search.', 
            difficulty: 'Easy', 
            probability: 0.90, 
            type: 'Short Answer',
            rationale: 'Complexity analysis is a fundamental topic',
            section: 'A'
          },
          { 
            id: 5,
            topic: 'Dynamic Programming', 
            question: 'Solve the 0/1 Knapsack problem using dynamic programming approach.', 
            difficulty: 'Hard', 
            probability: 0.65, 
            type: 'Numerical',
            rationale: 'DP problems are common in competitive sections',
            section: 'C'
          }
        ],
        summary: ['Trees', 'Sorting', 'Graphs', 'Complexity', 'Dynamic Programming'],
        trends: {
          difficultyProgression: [
            { year: '2021', easy: 5, medium: 8, hard: 4 },
            { year: '2022', easy: 4, medium: 10, hard: 5 },
            { year: '2023', easy: 6, medium: 7, hard: 6 },
            { year: '2024', easy: 5, medium: 9, hard: 5 },
            { year: '2025', easy: 7, medium: 6, hard: 6 }
          ]
        },
        recurrence: [
          { topic: 'Trees', frequency: 9, lastAsked: 2024 },
          { topic: 'Sorting', frequency: 8, lastAsked: 2024 },
          { topic: 'Graphs', frequency: 7, lastAsked: 2023 },
          { topic: 'Complexity', frequency: 9, lastAsked: 2024 },
          { topic: 'Dynamic Programming', frequency: 6, lastAsked: 2023 }
        ],
        analysis: { 
          papersAnalyzed: 5, 
          questionsExtracted: 150, 
          topicsCovered: 12, 
          avgAccuracy: 85 
        }
      });
    } catch (error) {
      console.error('Predictions fetch error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch predictions',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/predictions
 * List all available subjects with predictions
 */
router.get('/',
  predictionsLimiter,
  async (req, res) => {
    try {
      if (global.supabase) {
        const { data, error } = await global.supabase
          .from('analysis_results')
          .select('subject_code, created_at')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          // Group by subject code
          const subjects = {};
          data.forEach(item => {
            if (!subjects[item.subject_code]) {
              subjects[item.subject_code] = {
                subjectCode: item.subject_code,
                lastAnalyzed: item.created_at,
                analysisCount: 0
              };
            }
            subjects[item.subject_code].analysisCount++;
          });
          
          return res.json({
            success: true,
            subjects: Object.values(subjects)
          });
        }
      }
      
      // Return demo subjects
      res.json({
        success: true,
        subjects: [
          { subjectCode: 'KCS301', lastAnalyzed: new Date().toISOString(), analysisCount: 1 },
          { subjectCode: 'KCS302', lastAnalyzed: new Date().toISOString(), analysisCount: 1 }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  }
);

module.exports = router;
