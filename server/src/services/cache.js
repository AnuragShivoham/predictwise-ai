const crypto = require('crypto');

/**
 * Simple In-Memory Cache Service
 * For production, replace with Redis
 */

// In-memory cache store
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate hash from file buffer
 */
function generateFileHash(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * Generate cache key from multiple files
 */
function generateCacheKey(files, subject, examName) {
  const fileHashes = files.map(f => generateFileHash(f.buffer)).sort().join('-');
  const contextHash = crypto.createHash('md5')
    .update(`${subject}-${examName}`)
    .digest('hex')
    .substring(0, 8);
  return `analysis:${fileHashes.substring(0, 32)}:${contextHash}`;
}

/**
 * Get cached analysis
 */
function getCachedAnalysis(key) {
  const cached = cache.get(key);
  
  if (!cached) return null;
  
  // Check if expired
  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  console.log(`📦 Cache hit for key: ${key.substring(0, 20)}...`);
  return cached.data;
}

/**
 * Store analysis in cache
 */
function cacheAnalysis(key, data, ttl = CACHE_TTL) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
    createdAt: Date.now()
  });
  
  console.log(`💾 Cached analysis with key: ${key.substring(0, 20)}...`);
  
  // Cleanup old entries periodically
  if (cache.size > 100) {
    cleanupExpiredEntries();
  }
}

/**
 * Remove expired cache entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now > value.expiresAt) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
  }
}

/**
 * Clear all cache
 */
function clearCache() {
  cache.clear();
  console.log('🗑️ Cache cleared');
}

/**
 * Get cache stats
 */
function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).map(([key, value]) => ({
      key: key.substring(0, 30) + '...',
      createdAt: new Date(value.createdAt).toISOString(),
      expiresAt: new Date(value.expiresAt).toISOString(),
      isExpired: Date.now() > value.expiresAt
    }))
  };
}

module.exports = {
  generateFileHash,
  generateCacheKey,
  getCachedAnalysis,
  cacheAnalysis,
  clearCache,
  getCacheStats,
  cleanupExpiredEntries
};
