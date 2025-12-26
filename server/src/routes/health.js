const express = require('express');
const { getCacheStats } = require('../services/cache');

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with service status
 */
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      supabase: !!global.supabase
    },
    cache: getCacheStats(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
  };
  
  // Check Supabase connection
  if (global.supabase) {
    try {
      const { error } = await global.supabase.from('analysis_results').select('id').limit(1);
      health.services.supabaseConnected = !error;
    } catch {
      health.services.supabaseConnected = false;
    }
  }
  
  res.json(health);
});

module.exports = router;
