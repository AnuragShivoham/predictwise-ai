import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GradientOrbs from '@/components/GradientOrbs';
import { BarChart3, TrendingUp, Users, FileText, Clock, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  overview: {
    totalAnalyses: number;
    totalPredictions: number;
    totalQuestionsExtracted: number;
    uniqueSubjects: number;
    cacheHitRate: number;
  };
  today: {
    analyses: number;
    questions: number;
    cached: number;
  };
  topSubjects: Array<{
    code: string;
    name: string;
    count: number;
    avgProcessingTime: number;
  }>;
  trend: Array<{
    date: string;
    analyses: number;
    questions: number;
  }>;
  recentAnalyses: Array<{
    subjectCode: string;
    subject: string;
    questionsExtracted: number;
    processingTime: number;
    cached: boolean;
    timestamp: string;
  }>;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/analytics`);
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6"
            >
              <BarChart3 className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center glass-card p-8 rounded-2xl">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const overview = data?.overview || { totalAnalyses: 0, totalPredictions: 0, totalQuestionsExtracted: 0, uniqueSubjects: 0, cacheHitRate: 0 };
  const today = data?.today || { analyses: 0, questions: 0, cached: 0 };

  const stats = [
    { icon: BarChart3, label: 'Total Analyses', value: overview.totalAnalyses, gradient: 'from-violet-500 to-purple-500' },
    { icon: FileText, label: 'Questions Extracted', value: overview.totalQuestionsExtracted, gradient: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, label: 'Predictions Made', value: overview.totalPredictions, gradient: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Unique Subjects', value: overview.uniqueSubjects, gradient: 'from-amber-500 to-orange-500' },
    { icon: Zap, label: 'Cache Hit Rate', value: `${overview.cacheHitRate}%`, gradient: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GradientOrbs variant="minimal" />
      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Platform Metrics</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-gradient">Analytics</span> Dashboard
              </h1>
            </div>
            <Button onClick={fetchAnalytics} variant="outline" className="glass-card">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </motion.div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5 rounded-2xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Today's Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Today's Activity</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Analyses', value: today.analyses, color: 'text-primary' },
                { label: 'Questions', value: today.questions, color: 'text-secondary' },
                { label: 'Cache Hits', value: today.cached, color: 'text-accent' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center p-4 bg-muted/30 rounded-xl"
                >
                  <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 7-Day Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">7-Day Trend</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={data?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.split('-').slice(1).join('/')} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="analyses" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} name="Analyses" />
                    <Line type="monotone" dataKey="questions" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} name="Questions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Subjects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Top Subjects</h3>
              </div>
              {data?.topSubjects && data.topSubjects.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={data.topSubjects.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="code" type="category" tick={{ fontSize: 12 }} width={80} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 8, 8, 0]} name="Analyses" />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No subject data yet
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">Recent Analyses</h3>
            </div>
            {data?.recentAnalyses && data.recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {data.recentAnalyses.map((analysis, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{analysis.subject}</p>
                        <p className="text-sm text-muted-foreground">{analysis.subjectCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{analysis.questionsExtracted} questions</p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.cached ? (
                          <span className="text-emerald-500">Cached</span>
                        ) : (
                          `${analysis.processingTime}ms`
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No analyses yet. Start by uploading some question papers!</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
