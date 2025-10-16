
export type Subject = 'Chemistry' | 'Mathematics';

export interface MarkingSchemeItem {
  step: string;
  marks: string;
}

export interface Question {
  questionNumber: number;
  questionText: string;
  totalMarks: number;
  markingScheme: MarkingSchemeItem[];
}

export interface GeminiResponse {
  questions: Question[];
}
