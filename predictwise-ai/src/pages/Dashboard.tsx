import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Download,
  TrendingUp,
  BarChart3,
  Target,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Percent,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [chapterWeightage, setChapterWeightage] = useState<any[]>([]);
  const [difficultyTrend, setDifficultyTrend] = useState<any[]>([
    { year: '2021', easy: 5, medium: 8, hard: 4 },
    { year: '2022', easy: 4, medium: 10, hard: 5 },
    { year: '2023', easy: 6, medium: 7, hard: 6 },
    { year: '2024', easy: 5, medium: 9, hard: 5 },
    { year: '2025', easy: 7, medium: 6, hard: 6 },
  ]);
  const [predictedQuestions, setPredictedQuestions] = useState<any[]>([]);
  const [topicRecurrence, setTopicRecurrence] = useState<any[]>([]);
  const [stats, setStats] = useState({
    papersAnalyzed: 0,
    questionsExtracted: 0,
    topicsCovered: 0,
    avgAccuracy: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const state = location.state as any;
        if (state?.analysis) {
          // Use analysis data passed from upload
          setAnalysisData(state.analysis);
          processAnalysisData(state.analysis);
        } else {
          // Fetch from backend if no state data
          const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
          const subjectCode = 'KCS301'; // Default, can be made dynamic
          const response = await fetch(`${API_BASE}/api/predictions/${subjectCode}`);
          if (response.ok) {
            const data = await response.json();
            setAnalysisData(data);
            processAnalysisData(data);
          } else {
            toast.error("Failed to load dashboard data");
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [location.state]);

  const processAnalysisData = (data: any) => {
    if (!data) return;

    console.log('Processing analysis data:', data);

    // Process predicted questions (main data from backend)
    if (data.predictions && Array.isArray(data.predictions)) {
      const questions = data.predictions.map((pred: any, idx: number) => {
        let questionText = pred.question || '';
        if (!questionText && pred.topic) {
          questionText = `Explain important concepts about ${pred.topic}`;
        }
        
        return {
          id: pred.id || (idx + 1),
          topic: pred.topic || 'Unknown Topic',
          chapter: pred.topic || 'Unknown Topic',
          probability: typeof pred.probability === 'number' ? Math.round(pred.probability * 100) : 0,
          difficulty: pred.difficulty || 'Medium',
          question: questionText,
          type: pred.type || 'Long Answer',
          rationale: pred.rationale || `This topic has appeared in previous exam papers with high frequency.`,
          section: pred.section || 'A'
        };
      });
      setPredictedQuestions(questions);
      console.log('Processed questions:', questions);
    }

    // Process recurrence data (always present, never empty)
    if (data.recurrence && Array.isArray(data.recurrence) && data.recurrence.length > 0) {
      setTopicRecurrence(data.recurrence);
    } else if (data.predictions?.length > 0) {
      // Generate recurrence from predictions
      const topicMap = new Map();
      data.predictions.forEach((p: any, idx: number) => {
        if (!topicMap.has(p.topic)) {
          topicMap.set(p.topic, { frequency: 0, lastAsked: idx + 1 });
        }
        const entry = topicMap.get(p.topic);
        entry.frequency += p.probability || 0.5;
      });
      
      const recurrence = Array.from(topicMap.entries())
        .map(([topic, data]) => ({
          topic,
          frequency: Math.round(data.frequency * 100) / 100,
          lastAsked: data.lastAsked,
          recurrenceScore: Math.round((data.frequency / 10) * 100)
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10);
      
      setTopicRecurrence(recurrence);
    }

    // Process trends data (always present, never empty)
    if (data.trends?.difficultyProgression) {
      setDifficultyTrend(data.trends.difficultyProgression);
    }

    // Process summary
    if (data.summary && Array.isArray(data.summary) && data.summary.length > 0) {
      const topics = data.summary.map((item: any, idx: number) => ({
        name: typeof item === 'string' ? item : item.topic || `Topic ${idx + 1}`,
        value: idx + 1,
        color: ['#4f46e5', '#0891b2', '#10b981', '#f59e0b', '#ef4444'][idx % 5],
      }));
      setChapterWeightage(topics);
    } else if (data.predictions?.length > 0) {
      // If no summary, create one from predictions
      const topics = data.predictions.slice(0, 5).map((pred: any, idx: number) => ({
        name: pred.topic || `Topic ${idx + 1}`,
        value: pred.probability || (5 - idx),
        color: ['#4f46e5', '#0891b2', '#10b981', '#f59e0b', '#ef4444'][idx % 5],
      }));
      setChapterWeightage(topics);
    }

    // Set mock difficulty trend data if not available
    if ((!data.trends || !data.trends.difficultyTrends) && data.predictions?.length > 0) {
      const mockTrend = [
        { year: '2021', easy: 5, medium: 8, hard: 4 },
        { year: '2022', easy: 4, medium: 10, hard: 5 },
        { year: '2023', easy: 6, medium: 7, hard: 6 },
        { year: '2024', easy: 5, medium: 9, hard: 5 },
        { year: '2025', easy: 7, medium: 6, hard: 6 },
      ];
      setDifficultyTrend(mockTrend);
    }

    // Set stats from analysis object
    setStats({
      papersAnalyzed: data.analysis?.papersAnalyzed || 0,
      questionsExtracted: data.analysis?.questionsExtracted || 0,
      topicsCovered: data.analysis?.topicsCovered || 0,
      avgAccuracy: data.analysis?.avgAccuracy || 0,
    });
  };

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-accent bg-accent/10";
      case "Medium":
        return "text-secondary bg-secondary/10";
      case "Hard":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const downloadPredictedPaper = () => {
    if (!predictedQuestions.length) {
      toast.error("No predicted questions available to download");
      return;
    }

    // Create a simple HTML document for predicted paper
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Predicted Question Paper - PredictWiseAI</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h1 { margin: 0; }
        .metadata { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 0.9em; }
        .question { margin: 20px 0; padding: 15px; border-left: 4px solid #4f46e5; background-color: #f5f5f5; }
        .question-num { font-weight: bold; color: #4f46e5; }
        .question-text { margin: 8px 0; }
        .topic { display: inline-block; background-color: #e0e7ff; padding: 3px 8px; border-radius: 3px; font-size: 0.85em; margin: 5px 5px 5px 0; }
        .difficulty { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 0.85em; font-weight: bold; }
        .easy { background-color: #d1fae5; color: #065f46; }
        .medium { background-color: #fef3c7; color: #92400e; }
        .hard { background-color: #fee2e2; color: #991b1b; }
        .probability { color: #666; font-size: 0.85em; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 0.85em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Predicted Question Paper</h1>
        <p style="margin: 5px 0;">Generated by PredictWiseAI</p>
    </div>

    <div class="metadata">
        <div><strong>Subject:</strong> ${analysisData?.exam?.subject || 'N/A'}</div>
        <div><strong>Subject Code:</strong> ${analysisData?.exam?.subjectCode || 'N/A'}</div>
        <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
    </div>

    <div class="metadata">
        <div><strong>Papers Analyzed:</strong> ${stats.papersAnalyzed}</div>
        <div><strong>Accuracy:</strong> ${stats.avgAccuracy}%</div>
        <div><strong>Total Questions:</strong> ${predictedQuestions.length}</div>
    </div>

    ${predictedQuestions.map((q, idx) => `
    <div class="question">
        <div><span class="question-num">Q.${idx + 1}</span></div>
        <div class="question-text"><strong>${q.question}</strong></div>
        <div>
            <span class="topic">${q.topic}</span>
            <span class="difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            <span class="probability">Confidence: ${q.probability}%</span>
        </div>
        ${q.rationale ? `<div style="margin-top: 8px; font-size: 0.9em; color: #666;"><em>Why this question: ${q.rationale}</em></div>` : ''}
    </div>
    `).join('')}

    <div class="footer">
        <p>This predicted paper is based on AI analysis of ${stats.papersAnalyzed} previous years' question papers.</p>
        <p>Use this as a study guide to prepare for the upcoming examination.</p>
    </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Predicted_Paper_${analysisData?.exam?.subjectCode || 'Paper'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Predicted paper downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Loading Dashboard Data</h2>
              <p className="text-muted-foreground">Analyzing your question papers...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Prediction <span className="text-gradient">Dashboard</span>
                </h1>
                <p className="text-muted-foreground">
                  JEE Main Physics • Analysis of 5 years (2019-2023)
                </p>
              </div>
              <Button variant="hero" onClick={downloadPredictedPaper}>
                <Download className="w-4 h-4 mr-2" />
                Download Predicted Paper
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: FileText, label: "Papers Analyzed", value: stats.papersAnalyzed.toString() },
              { icon: Target, label: "Questions Extracted", value: stats.questionsExtracted.toString() },
              { icon: BookOpen, label: "Topics Covered", value: stats.topicsCovered.toString() },
              { icon: Percent, label: "Avg Accuracy", value: `${stats.avgAccuracy}%` },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-5 border border-border shadow-soft"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Topic Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border shadow-soft"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Topic Trend Over Years</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="mechanics" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
                    <Line type="monotone" dataKey="thermodynamics" stroke="#0891b2" strokeWidth={2} dot={{ fill: "#0891b2" }} />
                    <Line type="monotone" dataKey="modern" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
                  Mechanics
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                  Thermodynamics
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  Modern Physics
                </div>
              </div>
            </motion.div>

            {/* Chapter Weightage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border shadow-soft"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold">Chapter-wise Weightage</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chapterWeightage}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chapterWeightage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chapterWeightage.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name} ({item.value}%)
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Difficulty Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-xl p-6 border border-border shadow-soft"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Difficulty Level Progression</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={difficultyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="easy" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke="#0891b2" fill="#0891b2" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="hard" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  Easy
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#0891b2]" />
                  Medium
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  Hard
                </div>
              </div>
            </motion.div>

            {/* Topic Recurrence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card rounded-xl p-6 border border-border shadow-soft"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">High Recurrence Topics</h3>
              </div>
              <div className="space-y-3">
                {topicRecurrence.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{topic.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        Last asked: {topic.lastAsked}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${(topic.frequency / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{topic.frequency}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Topics Breakdown by Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Topics by Question</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {predictedQuestions.length} topics identified
              </span>
            </div>

            <div className="space-y-3">
              {predictedQuestions.map((q) => (
                <div
                  key={`topic-${q.id}`}
                  className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-bold">
                          Q{q.id}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{q.topic}</span>
                      </div>
                      {q.question && (
                        <p className="text-sm text-foreground font-medium mb-3 p-2 bg-white/50 rounded border-l-2 border-primary">
                          {q.question}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-muted-foreground">Type: {q.type}</span>
                        <span className="text-muted-foreground font-semibold">Confidence: {q.probability}%</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-primary">{q.probability}%</div>
                      <p className="text-xs text-muted-foreground">probability</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AKTU Style Predicted Paper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-soft mb-8"
          >
            <div className="mb-8 pb-4 border-b-2 border-primary">
              <h2 className="text-2xl font-bold mb-2">Predicted Question Paper</h2>
              <p className="text-sm text-muted-foreground">
                {analysisData?.exam?.subject} ({analysisData?.exam?.subjectCode}) • {stats.papersAnalyzed} Years Analyzed
              </p>
            </div>

            {['A', 'B', 'C'].map((section) => {
              const sectionQuestions = predictedQuestions.filter(q => q.section === section);
              
              if (sectionQuestions.length === 0) return null;

              return (
                <div key={section} className="mb-8">
                  <h3 className="text-lg font-bold mb-4 text-primary">Section {section}</h3>
                  <div className="space-y-4">
                    {sectionQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-base">
                              {section}{idx + 1}. {q.question}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                                {q.topic}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(q.difficulty)}`}>
                                {q.difficulty}
                              </span>
                              <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                                {q.probability}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Predicted Questions Detail View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-xl p-6 border border-border shadow-soft"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Top Predicted Questions</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                Showing top 5 high-probability questions
              </span>
            </div>

            <div className="space-y-4">
              {predictedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedQuestion(expandedQuestion === q.id ? null : q.id)
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {q.probability}%
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{q.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {q.chapter} • {q.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      {expandedQuestion === q.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  {expandedQuestion === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">
                            Predicted Question:
                          </p>
                          <p className="text-foreground leading-relaxed">{q.question}</p>
                        </div>
                        
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <p className="text-sm font-semibold text-muted-foreground mb-2">
                            Topic Detail:
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <div>
                                <p className="font-medium text-foreground">{q.topic}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Type: {q.type}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {q.rationale && (
                          <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                              Why This Question:
                            </p>
                            <p className="text-sm text-foreground italic">{q.rationale}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-card rounded-lg border border-border text-center">
                            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                            <p className="text-lg font-bold text-primary">{q.probability}%</p>
                          </div>
                          <div className="p-3 bg-card rounded-lg border border-border text-center">
                            <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
                            <p className={`text-sm font-bold ${getDifficultyColor(q.difficulty)}`}>
                              {q.difficulty}
                            </p>
                          </div>
                          <div className="p-3 bg-card rounded-lg border border-border text-center">
                            <p className="text-xs text-muted-foreground mb-1">Question #</p>
                            <p className="text-lg font-bold">{q.id}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
