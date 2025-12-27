#!/usr/bin/env node

/**
 * ML Model Evaluation Script for PredictWiseAI
 * Evaluates the trained model's performance and accuracy
 */

require('dotenv').config();
const { QuestionPredictor } = require('../ml-predictor');
const { prepareTrainingData } = require('../ml-functions');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function evaluateModel() {
	console.log('🔍 Starting PredictWiseAI ML Model Evaluation...\n');

	// Initialize Supabase client
	let supabase = null;
	if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
		supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
		global.supabase = supabase;
	} else {
		console.error('❌ Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
		process.exit(1);
	}

	// Initialize predictor
	const predictor = new QuestionPredictor();

	try {
		// Load or train model
		if (!predictor.isTrained) {
			console.log('📚 Model not trained. Training first...');
			const { trainModel } = require('./train-model');
			await trainModel();
		}

		// Prepare test data
		console.log('📊 Preparing evaluation data...');

		const { data: testData, error } = await supabase
			.from('predictions')
			.select('*')
			.limit(200);

		if (error) {
			console.error('❌ Error fetching test data:', error);
			process.exit(1);
		}

		if (!testData || testData.length === 0) {
			console.log('⚠️  No test data available. Using synthetic test cases...');
			await runSyntheticEvaluation(predictor);
			return;
		}

		// Split data into training and testing sets
		const shuffled = testData.sort(() => 0.5 - Math.random());
		const testSet = shuffled.slice(0, Math.floor(shuffled.length * 0.3)); // 30% for testing

		console.log(`🧪 Evaluating on ${testSet.length} test samples`);

		// Run evaluation
		const results = await evaluateOnTestSet(predictor, testSet);

		// Display results
		displayEvaluationResults(results);

		// Generate evaluation report
		generateEvaluationReport(results);

	} catch (error) {
		console.error('❌ Evaluation failed:', error.message);
		console.error(error.stack);
		process.exit(1);
	}
}

async function evaluateOnTestSet(predictor, testSet) {
	const results = {
		totalSamples: testSet.length,
		correctPredictions: 0,
		totalError: 0,
		topicAccuracy: {},
		difficultyAccuracy: {},
		probabilityErrors: [],
		confidenceScores: []
	};

	console.log('🔬 Running predictions on test set...');

	for (let i = 0; i < testSet.length; i++) {
		const item = testSet[i];
		const question = item.question;

		try {
			const predictions = await predictor.predict([question], testSet.slice(0, i));

			if (predictions && predictions.length > 0) {
				const prediction = predictions[0];
				const actualProbability = item.probability;
				const predictedProbability = prediction.probability;

				// Calculate accuracy metrics
				const error = Math.abs(predictedProbability - actualProbability);
				results.totalError += error;
				results.probabilityErrors.push(error);
				results.confidenceScores.push(prediction.confidence || 0.5);

				// Topic accuracy
				const topicCorrect = prediction.topic === item.topic;
				if (topicCorrect) results.correctPredictions++;

				results.topicAccuracy[item.topic] = results.topicAccuracy[item.topic] || { correct: 0, total: 0 };
				results.topicAccuracy[item.topic].total++;
				if (topicCorrect) results.topicAccuracy[item.topic].correct++;

				// Difficulty accuracy (if available)
				if (item.difficulty && prediction.difficulty) {
					results.difficultyAccuracy[item.difficulty] = results.difficultyAccuracy[item.difficulty] || { correct: 0, total: 0 };
					results.difficultyAccuracy[item.difficulty].total++;
					if (prediction.difficulty === item.difficulty) {
						results.difficultyAccuracy[item.difficulty].correct++;
					}
				}
			}

			// Progress indicator
			if ((i + 1) % 10 === 0) {
				console.log(`   Processed ${i + 1}/${testSet.length} samples...`);
			}

		} catch (error) {
			console.warn(`⚠️  Error predicting for sample ${i + 1}:`, error.message);
		}
	}

	return results;
}

function displayEvaluationResults(results) {
	console.log('\n📊 EVALUATION RESULTS');
	console.log('='.repeat(50));

	const avgError = results.totalError / results.totalSamples;
	const accuracy = (results.correctPredictions / results.totalSamples) * 100;

	console.log(`Total Samples: ${results.totalSamples}`);
	console.log(`Topic Accuracy: ${accuracy.toFixed(2)}%`);
	console.log(`Average Probability Error: ${avgError.toFixed(4)}`);
	console.log(`Median Confidence: ${(median(results.confidenceScores) * 100).toFixed(1)}%`);

	console.log('\n🎯 Topic-wise Accuracy:');
	Object.entries(results.topicAccuracy).forEach(([topic, stats]) => {
		const topicAccuracy = (stats.correct / stats.total) * 100;
		console.log(`   ${topic}: ${topicAccuracy.toFixed(1)}% (${stats.correct}/${stats.total})`);
	});

	if (Object.keys(results.difficultyAccuracy).length > 0) {
		console.log('\n📈 Difficulty-wise Accuracy:');
		Object.entries(results.difficultyAccuracy).forEach(([difficulty, stats]) => {
			const diffAccuracy = (stats.correct / stats.total) * 100;
			console.log(`   ${difficulty}: ${diffAccuracy.toFixed(1)}% (${stats.correct}/${stats.total})`);
		});
	}

	console.log('\n📉 Error Distribution:');
	const errorRanges = {
		'0-0.1': 0,
		'0.1-0.2': 0,
		'0.2-0.3': 0,
		'0.3+': 0
	};

	results.probabilityErrors.forEach(error => {
		if (error <= 0.1) errorRanges['0-0.1']++;
		else if (error <= 0.2) errorRanges['0.1-0.2']++;
		else if (error <= 0.3) errorRanges['0.2-0.3']++;
		else errorRanges['0.3+']++;
	});

	Object.entries(errorRanges).forEach(([range, count]) => {
		const percentage = (count / results.totalSamples) * 100;
		console.log(`   ${range}: ${percentage.toFixed(1)}% (${count})`);
	});
}

function generateEvaluationReport(results) {
	const report = {
		timestamp: new Date().toISOString(),
		summary: {
			totalSamples: results.totalSamples,
			topicAccuracy: (results.correctPredictions / results.totalSamples) * 100,
			averageError: results.totalError / results.totalSamples,
			medianConfidence: median(results.confidenceScores)
		},
		topicAccuracy: results.topicAccuracy,
		difficultyAccuracy: results.difficultyAccuracy,
		errorDistribution: {
			'0-0.1': results.probabilityErrors.filter(e => e <= 0.1).length,
			'0.1-0.2': results.probabilityErrors.filter(e => e > 0.1 && e <= 0.2).length,
			'0.2-0.3': results.probabilityErrors.filter(e => e > 0.2 && e <= 0.3).length,
			'0.3+': results.probabilityErrors.filter(e => e > 0.3).length
		},
		recommendations: generateRecommendations(results)
	};

	const reportPath = path.join(__dirname, '..', 'evaluation-report.json');
	fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

	console.log(`\n📄 Evaluation report saved to: ${reportPath}`);
}

function generateRecommendations(results) {
	const recommendations = [];

	const accuracy = (results.correctPredictions / results.totalSamples) * 100;
	const avgError = results.totalError / results.totalSamples;

	if (accuracy < 70) {
		recommendations.push('Model accuracy is below 70%. Consider retraining with more diverse data.');
	}

	if (avgError > 0.2) {
		recommendations.push('Average prediction error is high. Review feature engineering and model selection.');
	}

	const lowAccuracyTopics = Object.entries(results.topicAccuracy)
		.filter(([, stats]) => (stats.correct / stats.total) * 100 < 60)
		.map(([topic]) => topic);

	if (lowAccuracyTopics.length > 0) {
		recommendations.push(`Low accuracy for topics: ${lowAccuracyTopics.join(', ')}. Consider adding more training data for these topics.`);
	}

	if (recommendations.length === 0) {
		recommendations.push('Model performance is satisfactory. Continue monitoring and updating with new data.');
	}

	return recommendations;
}

async function runSyntheticEvaluation(predictor) {
	console.log('🧪 Running synthetic evaluation...');

	const syntheticTestCases = [
		{ question: 'Explain binary search algorithm', topic: 'Algorithms', probability: 0.85 },
		{ question: 'What is normalization in databases?', topic: 'Database', probability: 0.78 },
		{ question: 'Describe TCP/IP model', topic: 'Computer Networks', probability: 0.82 },
		{ question: 'What is deadlock prevention?', topic: 'Operating System', probability: 0.75 },
		{ question: 'Explain linked list data structure', topic: 'Data Structures', probability: 0.88 }
	];

	const predictions = await predictor.predict(
		syntheticTestCases.map(tc => tc.question),
		syntheticTestCases
	);

	console.log('\n📊 Synthetic Test Results:');
	predictions.forEach((pred, i) => {
		const actual = syntheticTestCases[i];
		const error = Math.abs(pred.probability - actual.probability);
		console.log(`${i + 1}. ${pred.question.substring(0, 40)}...`);
		console.log(`   Predicted: ${(pred.probability * 100).toFixed(1)}% (Actual: ${(actual.probability * 100).toFixed(1)}%)`);
		console.log(`   Error: ${(error * 100).toFixed(1)}%, Topic: ${pred.topic} (${pred.topic === actual.topic ? '✓' : '✗'})`);
	});

	console.log('\n⚠️  Note: This is synthetic evaluation. Train with real data for accurate results.');
}

function median(arr) {
	if (arr.length === 0) return 0;
	const sorted = arr.sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Run evaluation if called directly
if (require.main === module) {
	evaluateModel().catch(console.error);
}

module.exports = { evaluateModel };
