/**
 * Progress Tracking Service
 * Manages job progress for long-running operations with SSE support
 */

// In-memory job store
const jobs = new Map();

/**
 * Create a new job
 */
function createJob(jobId, totalSteps = 100) {
  const job = {
    id: jobId,
    status: 'pending',
    progress: 0,
    totalSteps,
    currentStep: 0,
    message: 'Initializing...',
    startTime: Date.now(),
    updates: [],
    clients: new Set()
  };
  jobs.set(jobId, job);
  return job;
}

/**
 * Update job progress
 */
function updateProgress(jobId, progress, message, data = {}) {
  const job = jobs.get(jobId);
  if (!job) return null;
  
  job.progress = Math.min(100, Math.max(0, progress));
  job.message = message;
  job.status = progress >= 100 ? 'completed' : 'processing';
  job.lastUpdate = Date.now();
  
  const update = {
    progress: job.progress,
    message,
    timestamp: job.lastUpdate,
    ...data
  };
  
  job.updates.push(update);
  
  // Notify all SSE clients
  job.clients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(update)}\n\n`);
    } catch (e) {
      job.clients.delete(client);
    }
  });
  
  return job;
}

/**
 * Set job as failed
 */
function failJob(jobId, error) {
  const job = jobs.get(jobId);
  if (!job) return null;
  
  job.status = 'failed';
  job.error = error;
  job.endTime = Date.now();
  
  const update = {
    progress: job.progress,
    message: `Error: ${error}`,
    status: 'failed',
    timestamp: Date.now()
  };
  
  job.clients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(update)}\n\n`);
      client.end();
    } catch (e) {}
  });
  
  return job;
}

/**
 * Complete a job
 */
function completeJob(jobId, result = {}) {
  const job = jobs.get(jobId);
  if (!job) return null;
  
  job.status = 'completed';
  job.progress = 100;
  job.result = result;
  job.endTime = Date.now();
  job.duration = job.endTime - job.startTime;
  
  const update = {
    progress: 100,
    message: 'Analysis complete!',
    status: 'completed',
    duration: job.duration,
    timestamp: Date.now()
  };
  
  job.clients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(update)}\n\n`);
      client.end();
    } catch (e) {}
  });
  
  return job;
}

/**
 * Get job status
 */
function getJob(jobId) {
  return jobs.get(jobId);
}

/**
 * Add SSE client to job
 */
function addClient(jobId, res) {
  const job = jobs.get(jobId);
  if (!job) return false;
  
  job.clients.add(res);
  
  // Send current status immediately
  res.write(`data: ${JSON.stringify({
    progress: job.progress,
    message: job.message,
    status: job.status
  })}\n\n`);
  
  return true;
}

/**
 * Remove SSE client from job
 */
function removeClient(jobId, res) {
  const job = jobs.get(jobId);
  if (job) {
    job.clients.delete(res);
  }
}

/**
 * Clean up old jobs (older than 1 hour)
 */
function cleanupOldJobs() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [jobId, job] of jobs.entries()) {
    if (job.startTime < oneHourAgo) {
      job.clients.forEach(client => {
        try { client.end(); } catch (e) {}
      });
      jobs.delete(jobId);
    }
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldJobs, 30 * 60 * 1000);

/**
 * Generate unique job ID
 */
function generateJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  createJob,
  updateProgress,
  failJob,
  completeJob,
  getJob,
  addClient,
  removeClient,
  generateJobId,
  cleanupOldJobs
};
