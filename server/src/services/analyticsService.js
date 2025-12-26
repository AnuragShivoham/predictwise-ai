/**
 * Analytics Service
 * Tracks and aggregates usage metrics
 */

// In-memory analytics store (use Redis/DB in production)
const analytics = {
  totalAnalyses: 0,
  totalPredictions: 0,
  totalQuestionsExtracted: 0,
  subjectAnalyses: {},
  dailyStats: {},
  hourlyStats: {},
  recentAnalyses: []
};

/**
 * Record an analysis event
 */
function recordAnalysis(data) {
  const { subjectCode, subject, questionsExtracted, predictionsGenerated, processingTime, cached } = data;
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  const hourKey = `${dateKey}-${now.getHours()}`;
  
  // Update totals
  analytics.totalAnalyses++;
  analytics.totalPredictions += predictionsGenerated || 0;
  analytics.totalQuestionsExtracted += questionsExtracted || 0;
  
  // Update subject stats
  if (!analytics.subjectAnalyses[subjectCode]) {
    analytics.subjectAnalyses[subjectCode] = {
      code: subjectCode,
      name: subject,
      count: 0,
      totalQuestions: 0,
      avgProcessingTime: 0
    };
  }
  const subjectStats = analytics.subjectAnalyses[subjectCode];
  subjectStats.count++;
  subjectStats.totalQuestions += questionsExtracted || 0;
  subjectStats.avgProcessingTime = Math.round(
    (subjectStats.avgProcessingTime * (subjectStats.count - 1) + processingTime) / subjectStats.count
  );
  subjectStats.lastAnalyzed = now.toISOString();
  
  // Update daily stats
  if (!analytics.dailyStats[dateKey]) {
    analytics.dailyStats[dateKey] = { analyses: 0, questions: 0, cached: 0 };
  }
  analytics.dailyStats[dateKey].analyses++;
  analytics.dailyStats[dateKey].questions += questionsExtracted || 0;
  if (cached) analytics.dailyStats[dateKey].cached++;
  
  // Update hourly stats
  if (!analytics.hourlyStats[hourKey]) {
    analytics.hourlyStats[hourKey] = { analyses: 0, questions: 0 };
  }
  analytics.hourlyStats[hourKey].analyses++;
  analytics.hourlyStats[hourKey].questions += questionsExtracted || 0;
  
  // Keep recent analyses (last 50)
  analytics.recentAnalyses.unshift({
    subjectCode,
    subject,
    questionsExtracted,
    predictionsGenerated,
    processingTime,
    cached,
    timestamp: now.toISOString()
  });
  if (analytics.recentAnalyses.length > 50) {
    analytics.recentAnalyses.pop();
  }
  
  // Cleanup old stats (keep last 30 days)
  cleanupOldStats();
}

/**
 * Get analytics summary
 */
function getAnalyticsSummary() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const todayStats = analytics.dailyStats[today] || { analyses: 0, questions: 0, cached: 0 };
  
  // Get top subjects
  const topSubjects = Object.values(analytics.subjectAnalyses)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Get last 7 days trend
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    last7Days.push({
      date: dateKey,
      analyses: analytics.dailyStats[dateKey]?.analyses || 0,
      questions: analytics.dailyStats[dateKey]?.questions || 0
    });
  }
  
  // Calculate cache hit rate
  const totalCached = Object.values(analytics.dailyStats).reduce((sum, d) => sum + (d.cached || 0), 0);
  const cacheHitRate = analytics.totalAnalyses > 0 
    ? Math.round((totalCached / analytics.totalAnalyses) * 100) 
    : 0;
  
  return {
    overview: {
      totalAnalyses: analytics.totalAnalyses,
      totalPredictions: analytics.totalPredictions,
      totalQuestionsExtracted: analytics.totalQuestionsExtracted,
      uniqueSubjects: Object.keys(analytics.subjectAnalyses).length,
      cacheHitRate
    },
    today: {
      analyses: todayStats.analyses,
      questions: todayStats.questions,
      cached: todayStats.cached
    },
    topSubjects,
    trend: last7Days,
    recentAnalyses: analytics.recentAnalyses.slice(0, 10)
  };
}

/**
 * Get detailed analytics
 */
function getDetailedAnalytics() {
  return {
    ...getAnalyticsSummary(),
    allSubjects: Object.values(analytics.subjectAnalyses),
    dailyStats: Object.entries(analytics.dailyStats)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 30)
      .map(([date, stats]) => ({ date, ...stats })),
    hourlyDistribution: getHourlyDistribution()
  };
}

/**
 * Get hourly distribution for today
 */
function getHourlyDistribution() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const distribution = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const hourKey = `${today}-${hour}`;
    distribution.push({
      hour,
      analyses: analytics.hourlyStats[hourKey]?.analyses || 0
    });
  }
  
  return distribution;
}

/**
 * Cleanup old stats
 */
function cleanupOldStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
  
  // Clean daily stats
  for (const dateKey of Object.keys(analytics.dailyStats)) {
    if (dateKey < cutoffDate) {
      delete analytics.dailyStats[dateKey];
    }
  }
  
  // Clean hourly stats
  for (const hourKey of Object.keys(analytics.hourlyStats)) {
    const dateKey = hourKey.split('-').slice(0, 3).join('-');
    if (dateKey < cutoffDate) {
      delete analytics.hourlyStats[hourKey];
    }
  }
}

/**
 * Reset analytics (for testing)
 */
function resetAnalytics() {
  analytics.totalAnalyses = 0;
  analytics.totalPredictions = 0;
  analytics.totalQuestionsExtracted = 0;
  analytics.subjectAnalyses = {};
  analytics.dailyStats = {};
  analytics.hourlyStats = {};
  analytics.recentAnalyses = [];
}

module.exports = {
  recordAnalysis,
  getAnalyticsSummary,
  getDetailedAnalytics,
  getHourlyDistribution,
  resetAnalytics
};
