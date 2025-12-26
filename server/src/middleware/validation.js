const Joi = require('joi');

// Validation schemas
const analyzeSchema = Joi.object({
  examName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Exam name must be at least 2 characters',
    'string.max': 'Exam name must be less than 100 characters',
    'any.required': 'Exam name is required'
  }),
  subject: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Subject must be at least 2 characters',
    'string.max': 'Subject must be less than 100 characters',
    'any.required': 'Subject is required'
  }),
  subjectCode: Joi.string().alphanum().max(20).required().messages({
    'string.alphanum': 'Subject code must contain only letters and numbers',
    'string.max': 'Subject code must be less than 20 characters',
    'any.required': 'Subject code is required'
  })
});

const subjectCodeSchema = Joi.object({
  subjectCode: Joi.string().alphanum().max(20).required()
});

// Validation middleware
function validateAnalyze(req, res, next) {
  const { error, value } = analyzeSchema.validate({
    examName: req.body.examName,
    subject: req.body.subject,
    subjectCode: req.body.subjectCode
  });
  
  if (error) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      message: error.details[0].message 
    });
  }
  
  req.validatedBody = value;
  next();
}

function validateSubjectCode(req, res, next) {
  const { error, value } = subjectCodeSchema.validate({
    subjectCode: req.params.subjectCode
  });
  
  if (error) {
    return res.status(400).json({ 
      error: 'Invalid subject code',
      message: error.details[0].message 
    });
  }
  
  req.validatedParams = value;
  next();
}

// Sanitize text input
function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"\']/g, '') // Remove potentially dangerous chars
    .trim();
}

module.exports = {
  validateAnalyze,
  validateSubjectCode,
  sanitizeText,
  analyzeSchema,
  subjectCodeSchema
};
