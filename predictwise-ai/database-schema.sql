-- PredictWiseAI Database Schema
-- Run this SQL in your Supabase project's SQL Editor

-- Create PYQs table
CREATE TABLE pyqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  exam_type TEXT NOT NULL,
  file_url TEXT,
  extracted_text TEXT,
  questions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_code TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_type TEXT,
  probability DECIMAL(3,2),
  predicted_year INTEGER,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_code TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_pyqs_subject_year ON pyqs(subject_code, year);
CREATE INDEX idx_predictions_subject ON predictions(subject_code);
CREATE INDEX idx_analysis_subject_type ON analysis_results(subject_code, analysis_type);

-- Enable Row Level Security (RLS)
ALTER TABLE pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- For now, allowing all operations (you may want to restrict this later)
CREATE POLICY "Allow all operations on pyqs" ON pyqs FOR ALL USING (true);
CREATE POLICY "Allow all operations on predictions" ON predictions FOR ALL USING (true);
CREATE POLICY "Allow all operations on analysis_results" ON analysis_results FOR ALL USING (true);

-- Create storage bucket for PYQ files (run this in SQL Editor)
-- Note: You also need to create the bucket manually in Supabase Dashboard > Storage
-- Bucket name: pyq-files
-- Make it public for file access

-- Optional: Insert some sample data for testing
INSERT INTO predictions (subject_code, topic, question, difficulty, question_type, probability, predicted_year) VALUES
('KCS301', 'Data Structures', 'Explain the working of a binary search tree with an example.', 'Medium', 'Long Answer', 0.85, 2024),
('KCS301', 'Algorithms', 'What is the time complexity of quicksort in best and worst cases?', 'Medium', 'Short Answer', 0.78, 2024),
('KCS302', 'Operating Systems', 'Describe the concept of deadlock and its prevention methods.', 'Hard', 'Long Answer', 0.92, 2024);
