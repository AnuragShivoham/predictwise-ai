import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, FileText, Brain, Sparkles } from 'lucide-react';

interface ProgressTrackerProps {
  jobId: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

interface ProgressState {
  progress: number;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const ProgressTracker = ({ jobId, onComplete, onError }: ProgressTrackerProps) => {
  const [state, setState] = useState<ProgressState>({
    progress: 0,
    message: 'Initializing...',
    status: 'pending',
  });

  useEffect(() => {
    if (!jobId) return;

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
    const eventSource = new EventSource(`${API_BASE}/api/progress/${jobId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState({
          progress: data.progress || 0,
          message: data.message || 'Processing...',
          status: data.status || 'processing',
        });

        if (data.status === 'completed' && onComplete) {
          onComplete(data.result);
          eventSource.close();
        }

        if (data.status === 'failed' && onError) {
          onError(data.message);
          eventSource.close();
        }
      } catch (e) {
        console.error('Error parsing progress event:', e);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [jobId, onComplete, onError]);

  const getIcon = () => {
    if (state.status === 'completed') return <CheckCircle className="w-6 h-6 text-accent" />;
    if (state.status === 'failed') return <AlertCircle className="w-6 h-6 text-destructive" />;
    if (state.progress < 30) return <FileText className="w-6 h-6 text-primary" />;
    if (state.progress < 80) return <Brain className="w-6 h-6 text-primary" />;
    return <Sparkles className="w-6 h-6 text-primary" />;
  };

  const getStepLabel = () => {
    if (state.progress < 10) return 'Preparing files';
    if (state.progress < 80) return 'Extracting questions';
    if (state.progress < 95) return 'AI Analysis';
    return 'Finalizing';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {state.status === 'processing' ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            getIcon()
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium">{getStepLabel()}</p>
          <p className="text-sm text-muted-foreground">{state.message}</p>
        </div>
        <span className="text-2xl font-bold text-primary">{state.progress}%</span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${state.progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex justify-between mt-3 text-xs text-muted-foreground">
        <span className={state.progress >= 10 ? 'text-primary' : ''}>Upload</span>
        <span className={state.progress >= 40 ? 'text-primary' : ''}>Extract</span>
        <span className={state.progress >= 80 ? 'text-primary' : ''}>Analyze</span>
        <span className={state.progress >= 100 ? 'text-primary' : ''}>Complete</span>
      </div>
    </div>
  );
};

export default ProgressTracker;
