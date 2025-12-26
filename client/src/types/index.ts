// API Response Types
export interface Prediction {
  id: number;
  topic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  probability: number;
  type: 'Short Answer' | 'Long Answer' | 'Numerical' | 'Derivation';
  rationale: string;
  section: 'A' | 'B' | 'C';
}

export interface RecurrenceItem {
  topic: string;
  frequency: number;
  lastAsked: number;
}

export interface DifficultyTrend {
  year: string;
  easy: number;
  medium: number;
  hard: number;
}

export interface AnalysisStats {
  papersAnalyzed: number;
  pagesProcessed?: number;
  questionsExtracted: number;
  topicsCovered: number;
  avgAccuracy: number;
  fileResults?: FileResult[];
}

export interface FileResult {
  filename: string;
  status: 'success' | 'error';
  pages?: number;
  questionsFound: number;
  error?: string;
  textLength?: number;
}

export interface ExamInfo {
  name: string;
  subject: string;
  subjectCode: string;
}

export interface AnalysisResult {
  predictions: Prediction[];
  summary: string[];
  trends: {
    difficultyProgression: DifficultyTrend[];
  };
  exam: ExamInfo;
  analysis: AnalysisStats;
  recurrence: RecurrenceItem[];
  warnings?: string[];
}

export interface AnalyzeResponse {
  success: boolean;
  cached: boolean;
  analysis: AnalysisResult;
  processingTime: number;
}

export interface PredictionsResponse {
  success: boolean;
  source: 'database' | 'demo';
  predictions: Prediction[];
  summary: string[];
  trends: {
    difficultyProgression: DifficultyTrend[];
  };
  recurrence: RecurrenceItem[];
  analysis: AnalysisStats;
}

// Form Types
export interface UploadFormData {
  examName: string;
  subject: string;
  subjectCode: string;
  files: File[];
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  year?: string;
}

// API Error
export interface ApiError {
  error: string;
  message: string;
  retryAfter?: string;
}
