const express = require('express');
const { getJob, addClient, removeClient } = require('../services/progressTracker');

const router = express.Router();

/**
 * GET /api/progress/:jobId
 * SSE endpoint for job progress
 */
router.get('/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  
  // Add client to job
  addClient(jobId, res);
  
  // Handle client disconnect
  req.on('close', () => {
    removeClient(jobId, res);
  });
  
  // If job is already completed, send final status and close
  if (job.status === 'completed' || job.status === 'failed') {
    res.write(`data: ${JSON.stringify({
      progress: job.progress,
      message: job.message,
      status: job.status,
      result: job.result
    })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/progress/:jobId/status
 * Get job status (non-SSE)
 */
router.get('/:jobId/status', (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    message: job.message,
    startTime: job.startTime,
    duration: job.endTime ? job.endTime - job.startTime : Date.now() - job.startTime
  });
});

module.exports = router;
