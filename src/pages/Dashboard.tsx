import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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

// Sample data
const trendData = [
  { year: "2019", mechanics: 25, thermodynamics: 20, optics: 15, modern: 18, electro: 22 },
  { year: "2020", mechanics: 28, thermodynamics: 18, optics: 18, modern: 20, electro: 16 },
  { year: "2021", mechanics: 22, thermodynamics: 22, optics: 20, modern: 18, electro: 18 },
  { year: "2022", mechanics: 30, thermodynamics: 15, optics: 17, modern: 22, electro: 16 },
  { year: "2023", mechanics: 26, thermodynamics: 20, optics: 16, modern: 24, electro: 14 },
];

const chapterWeightage = [
  { name: "Mechanics", value: 28, color: "#4f46e5" },
  { name: "Thermodynamics", value: 18, color: "#0891b2" },
  { name: "Optics", value: 16, color: "#10b981" },
  { name: "Modern Physics", value: 22, color: "#f59e0b" },
  { name: "Electromagnetism", value: 16, color: "#ef4444" },
];

const difficultyTrend = [
  { year: "2019", easy: 35, medium: 45, hard: 20 },
  { year: "2020", easy: 30, medium: 48, hard: 22 },
  { year: "2021", easy: 28, medium: 47, hard: 25 },
  { year: "2022", easy: 25, medium: 48, hard: 27 },
  { year: "2023", easy: 22, medium: 50, hard: 28 },
];

const predictedQuestions = [
  {
    id: 1,
    topic: "Newton's Laws of Motion",
    chapter: "Mechanics",
    probability: 92,
    difficulty: "Medium",
    question: "A block of mass 5 kg is placed on a rough inclined plane. Calculate the minimum force required to prevent sliding...",
    type: "Numerical",
  },
  {
    id: 2,
    topic: "Thermodynamic Cycles",
    chapter: "Thermodynamics",
    probability: 88,
    difficulty: "Hard",
    question: "An ideal gas undergoes a cyclic process consisting of two isochoric and two isobaric processes...",
    type: "Long Answer",
  },
  {
    id: 3,
    topic: "Wave Optics",
    chapter: "Optics",
    probability: 85,
    difficulty: "Medium",
    question: "In Young's double slit experiment, the separation between the slits is 0.1 mm...",
    type: "Numerical",
  },
  {
    id: 4,
    topic: "Photoelectric Effect",
    chapter: "Modern Physics",
    probability: 82,
    difficulty: "Medium",
    question: "Light of wavelength 400 nm is incident on a metal surface. If the work function is 2.3 eV...",
    type: "Numerical",
  },
  {
    id: 5,
    topic: "Electromagnetic Induction",
    chapter: "Electromagnetism",
    probability: 78,
    difficulty: "Hard",
    question: "A circular coil of radius 10 cm and 50 turns is rotated about its vertical diameter with angular speed...",
    type: "Long Answer",
  },
];

const topicRecurrence = [
  { topic: "Projectile Motion", frequency: 8, lastAsked: 2023 },
  { topic: "Carnot Engine", frequency: 7, lastAsked: 2022 },
  { topic: "Interference", frequency: 9, lastAsked: 2023 },
  { topic: "Nuclear Fission", frequency: 6, lastAsked: 2023 },
  { topic: "RC Circuits", frequency: 7, lastAsked: 2021 },
];

const Dashboard = () => {
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
              <Button variant="hero">
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
              { icon: FileText, label: "Papers Analyzed", value: "5" },
              { icon: Target, label: "Questions Extracted", value: "450" },
              { icon: BookOpen, label: "Topics Covered", value: "42" },
              { icon: Percent, label: "Avg Accuracy", value: "89%" },
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

          {/* Predicted Questions */}
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
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Predicted Question:
                        </p>
                        <p className="text-foreground">{q.question}</p>
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
