export interface Subject {
  code: string;
  name: string;
}

export interface ExamTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  subjects: Subject[];
  questionFormat: string;
}

export const EXAM_TEMPLATES: ExamTemplate[] = [
  {
    id: 'aktu',
    name: 'AKTU',
    displayName: 'AKTU B.Tech',
    description: 'Dr. A.P.J. Abdul Kalam Technical University',
    subjects: [
      { code: 'KCS301', name: 'Data Structures' },
      { code: 'KCS302', name: 'Computer Organization' },
      { code: 'KCS401', name: 'Operating Systems' },
      { code: 'KCS402', name: 'Theory of Automata' },
      { code: 'KCS501', name: 'Software Engineering' },
      { code: 'KCS502', name: 'Computer Networks' },
      { code: 'KCS601', name: 'Compiler Design' },
      { code: 'KCS701', name: 'Artificial Intelligence' },
      { code: 'KCS702', name: 'Machine Learning' },
    ],
    questionFormat: 'AKTU B.Tech Pattern',
  },
  {
    id: 'jee',
    name: 'JEE',
    displayName: 'JEE Main/Advanced',
    description: 'Joint Entrance Examination',
    subjects: [
      { code: 'PHY', name: 'Physics' },
      { code: 'CHE', name: 'Chemistry' },
      { code: 'MAT', name: 'Mathematics' },
    ],
    questionFormat: 'JEE Pattern',
  },
  {
    id: 'neet',
    name: 'NEET',
    displayName: 'NEET UG',
    description: 'National Eligibility cum Entrance Test',
    subjects: [
      { code: 'PHY', name: 'Physics' },
      { code: 'CHE', name: 'Chemistry' },
      { code: 'BIO', name: 'Biology' },
      { code: 'BOT', name: 'Botany' },
      { code: 'ZOO', name: 'Zoology' },
    ],
    questionFormat: 'NEET Pattern',
  },
  {
    id: 'gate',
    name: 'GATE',
    displayName: 'GATE CS',
    description: 'Graduate Aptitude Test in Engineering - Computer Science',
    subjects: [
      { code: 'DS', name: 'Data Structures' },
      { code: 'ALGO', name: 'Algorithms' },
      { code: 'OS', name: 'Operating Systems' },
      { code: 'DBMS', name: 'Database Management' },
      { code: 'CN', name: 'Computer Networks' },
      { code: 'TOC', name: 'Theory of Computation' },
      { code: 'CD', name: 'Compiler Design' },
      { code: 'COA', name: 'Computer Organization' },
      { code: 'DM', name: 'Discrete Mathematics' },
    ],
    questionFormat: 'GATE Pattern',
  },
  {
    id: 'cbse',
    name: 'CBSE',
    displayName: 'CBSE Board',
    description: 'Central Board of Secondary Education',
    subjects: [
      { code: 'PHY12', name: 'Physics Class 12' },
      { code: 'CHE12', name: 'Chemistry Class 12' },
      { code: 'MAT12', name: 'Mathematics Class 12' },
      { code: 'CS12', name: 'Computer Science Class 12' },
      { code: 'BIO12', name: 'Biology Class 12' },
    ],
    questionFormat: 'CBSE Board Pattern',
  },
  {
    id: 'upsc',
    name: 'UPSC',
    displayName: 'UPSC CSE',
    description: 'Union Public Service Commission - Civil Services',
    subjects: [
      { code: 'GS1', name: 'General Studies Paper 1' },
      { code: 'GS2', name: 'General Studies Paper 2' },
      { code: 'GS3', name: 'General Studies Paper 3' },
      { code: 'GS4', name: 'Ethics' },
      { code: 'ESSAY', name: 'Essay' },
    ],
    questionFormat: 'UPSC Pattern',
  },
  {
    id: 'custom',
    name: 'Custom',
    displayName: 'Custom Exam',
    description: 'Enter your own exam details',
    subjects: [],
    questionFormat: 'Custom',
  },
];

export function getTemplateById(id: string): ExamTemplate | undefined {
  return EXAM_TEMPLATES.find(t => t.id === id);
}

export function getTemplateByName(name: string): ExamTemplate | undefined {
  return EXAM_TEMPLATES.find(t => t.name.toLowerCase() === name.toLowerCase());
}
