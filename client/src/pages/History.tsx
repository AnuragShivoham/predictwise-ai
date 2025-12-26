import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GradientOrbs from '@/components/GradientOrbs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { History as HistoryIcon, FileText, Trash2, Eye, Loader2, LogIn, Clock, Target, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const History = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { history, loading, deleteAnalysis } = useAnalysisHistory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    setDeletingId(id);
    const success = await deleteAnalysis(id);
    setDeletingId(null);
    
    if (success) {
      toast.success('Analysis deleted');
    } else {
      toast.error('Failed to delete analysis');
    }
  };

  const handleView = (item: any) => {
    navigate('/dashboard', {
      state: {
        subjectCode: item.subject_code,
        analysis: item.analysis_data,
        subject: item.subject_name,
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center"
          >
            <HistoryIcon className="w-8 h-8 text-white" />
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <GradientOrbs variant="page" />
        <Navbar />
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow"
              >
                <LogIn className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3">Sign in to view history</h2>
              <p className="text-muted-foreground mb-8">
                Create an account or sign in to save and view your analysis history.
              </p>
              <Button variant="hero" onClick={() => navigate('/login')} className="shadow-glow">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Your Analyses</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Analysis <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground">View and manage your past analyses</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center"
              >
                <HistoryIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          ) : history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6"
              >
                <HistoryIcon className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h2 className="text-xl font-semibold mb-3">No history yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your analysis history will appear here after you analyze some question papers.
              </p>
              <Button variant="hero" onClick={() => navigate('/upload')} className="shadow-glow">
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="glass-card p-5 rounded-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="w-14 h-14 rounded-xl bg-gradient-primary/10 flex items-center justify-center flex-shrink-0"
                        >
                          <FileText className="w-7 h-7 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-lg">{item.subject_name}</h3>
                          <p className="text-sm text-muted-foreground">{item.exam_name} • {item.subject_code}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                              <FileText className="w-3.5 h-3.5" />
                              {item.files_count} files
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                              <Target className="w-3.5 h-3.5" />
                              {item.questions_extracted} questions
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleView(item)}
                          className="glass-card hover:shadow-elevated"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
