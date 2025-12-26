require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const healthRoutes = require('./routes/health');
const analyzeRoutes = require('./routes/analyze');
const predictionsRoutes = require('./routes/predictions');
const progressRoutes = require('./routes/progress');
const analyticsRoutes = require('./routes/analytics');
const exportRoutes = require('./routes/export');

// Import middleware
const { generalLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client (global for routes to access)
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  global.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized');
} else {
  console.log('⚠️ Supabase not configured - running without database');
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 PredictWiseAI Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Analyze endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`📈 Predictions endpoint: http://localhost:${PORT}/api/predictions`);
  console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
  console.log(`📤 Export endpoint: http://localhost:${PORT}/api/export\n`);
});
