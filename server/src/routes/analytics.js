const express = require('express');
const { getAnalyticsSummary, getDetailedAnalytics } = require('../services/analyticsService');
const { generalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * GET /api/analytics
 * Get analytics summary
 */
router.get('/', generalLimiter, (req, res) => {
  try {
    const summary = getAnalyticsSummary();
    res.json({
      success: true,
      ...summary
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * GET /api/analytics/detailed
 * Get detailed analytics (admin)
 */
router.get('/detailed', generalLimiter, (req, res) => {
  try {
    const detailed = getDetailedAnalytics();
    res.json({
      success: true,
      ...detailed
    });
  } catch (error) {
    console.error('Detailed analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch detailed analytics' });
  }
});

module.exports = router;
