import { useState } from 'react';
import { ChevronDown, Check, GraduationCap } from 'lucide-react';
import { EXAM_TEMPLATES, type ExamTemplate, type Subject } from '@/data/examTemplates';

interface ExamTemplateSelectorProps {
  onSelect: (template: ExamTemplate, subject: Subject | null) => void;
  selectedTemplate?: ExamTemplate | null;
  selectedSubject?: Subject | null;
}

const ExamTemplateSelector = ({ onSelect, selectedTemplate, selectedSubject }: ExamTemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ExamTemplate | null>(selectedTemplate || null);

  const handleTemplateSelect = (template: ExamTemplate) => {
    setCurrentTemplate(template);
    if (template.subjects.length > 0 && template.id !== 'custom') {
      setShowSubjects(true);
    } else {
      onSelect(template, null);
      setIsOpen(false);
      setShowSubjects(false);
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    if (currentTemplate) {
      onSelect(currentTemplate, subject);
      setIsOpen(false);
      setShowSubjects(false);
    }
  };

  const displayText = selectedTemplate && selectedSubject
    ? `${selectedTemplate.displayName} - ${selectedSubject.name}`
    : selectedTemplate
    ? selectedTemplate.displayName
    : 'Select Exam Template';

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">Exam Template (Optional)</label>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setShowSubjects(false); }}
        className="w-full px-4 py-3 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-muted-foreground" />
          <span className={selectedTemplate ? 'text-foreground' : 'text-muted-foreground'}>
            {displayText}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {!showSubjects ? (
            <div className="max-h-64 overflow-y-auto">
              {EXAM_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium">{template.displayName}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowSubjects(false)}
                className="w-full px-4 py-2 text-sm text-primary hover:bg-muted/50 text-left border-b border-border"
              >
                ← Back to exams
              </button>
              <p className="px-4 py-2 text-xs text-muted-foreground bg-muted/30">
                Select subject for {currentTemplate?.displayName}
              </p>
              {currentTemplate?.subjects.map((subject) => (
                <button
                  key={subject.code}
                  type="button"
                  onClick={() => handleSubjectSelect(subject)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">{subject.code}</p>
                  </div>
                  {selectedSubject?.code === subject.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamTemplateSelector;
