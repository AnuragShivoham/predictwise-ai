const express = require('express');
const { exportToHTML, exportToJSON, exportToText, exportToCSV } = require('../services/exportService');
const { generalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * POST /api/export
 * Export predictions to various formats
 */
router.post('/', generalLimiter, (req, res) => {
  try {
    const { format = 'html', predictions, examInfo, stats } = req.body;
    
    if (!predictions || !Array.isArray(predictions)) {
      return res.status(400).json({ error: 'Predictions array is required' });
    }
    
    const exam = examInfo || { name: 'Exam', subject: 'Subject', subjectCode: 'CODE' };
    const statistics = stats || { papersAnalyzed: 0, questionsExtracted: 0, topicsCovered: 0, avgAccuracy: 85 };
    
    let content, contentType, filename;
    
    switch (format.toLowerCase()) {
      case 'html':
        content = exportToHTML(predictions, exam, statistics);
        contentType = 'text/html';
        filename = `predictions_${exam.subjectCode}_${Date.now()}.html`;
        break;
        
      case 'json':
        content = exportToJSON(predictions, exam, statistics);
        contentType = 'application/json';
        filename = `predictions_${exam.subjectCode}_${Date.now()}.json`;
        break;
        
      case 'text':
      case 'txt':
        content = exportToText(predictions, exam, statistics);
        contentType = 'text/plain';
        filename = `predictions_${exam.subjectCode}_${Date.now()}.txt`;
        break;
        
      case 'csv':
        content = exportToCSV(predictions, exam);
        contentType = 'text/csv';
        filename = `predictions_${exam.subjectCode}_${Date.now()}.csv`;
        break;
        
      default:
        return res.status(400).json({ error: `Unsupported format: ${format}. Use html, json, text, or csv.` });
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed', message: error.message });
  }
});

module.exports = router;
