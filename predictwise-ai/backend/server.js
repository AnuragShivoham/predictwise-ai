const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const { QuestionPredictor } = require('./ml-predictor');
const {
	prepareTrainingData,
	extractTopicFromQuestion,
	calculateQuestionProbability,
	calculateTextSimilarity,
	generateSummaryFromPredictions
} = require('./ml-functions');
=======
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const { QuestionPredictor } = require('./ml-predictor');
const {
	prepareTrainingData,
	extractTopicFromQuestion,
	calculateQuestionProbability,
	calculateTextSimilarity,
	generateSummaryFromPredictions
} = require('./ml-functions');
