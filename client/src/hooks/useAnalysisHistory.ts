import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalysisHistoryItem {
  id: string;
  subject_code: string;
  subject_name: string;
  exam_name: string;
  files_count: number;
  questions_extracted: number;
  predictions_count: number;
  processing_time: number;
  created_at: string;
  analysis_data: any;
}

export function useAnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setHistory(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveAnalysis = useCallback(async (analysisData: {
    subjectCode: string;
    subjectName: string;
    examName: string;
    filesCount: number;
    questionsExtracted: number;
    predictionsCount: number;
    processingTime: number;
    data: any;
  }) => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('user_analyses')
        .insert({
          user_id: user.id,
          subject_code: analysisData.subjectCode,
          subject_name: analysisData.subjectName,
          exam_name: analysisData.examName,
          files_count: analysisData.filesCount,
          questions_extracted: analysisData.questionsExtracted,
          predictions_count: analysisData.predictionsCount,
          processing_time: analysisData.processingTime,
          analysis_data: analysisData.data,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Refresh history
      await fetchHistory();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user, fetchHistory]);

  const deleteAnalysis = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('user_analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      
      // Refresh history
      await fetchHistory();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [user, fetchHistory]);

  return {
    history,
    loading,
    error,
    saveAnalysis,
    deleteAnalysis,
    refresh: fetchHistory,
  };
}

export default useAnalysisHistory;
