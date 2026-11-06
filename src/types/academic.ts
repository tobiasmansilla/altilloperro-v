export type University = 'UBA' | 'UTN' | 'UNLP' | 'UNC' | 'UADE';

export type Career = 
  | 'CBC (Ciclo Básico Común)'
  | 'Medicina'
  | 'Derecho'
  | 'Ingeniería'
  | 'Psicología'
  | 'Ciencias Económicas'
  | 'Ciencias Exactas';

export type DocumentType = 
  | 'resumen' 
  | 'primer_parcial' 
  | 'segundo_parcial' 
  | 'final' 
  | 'guia_ejercicios';

export interface ComparisonRow {
  aspect: string;
  conceptA: string;
  conceptB: string;
}

export interface NoteSection {
  id: string;
  title: string;
  lead?: string;
  paragraphs: string[];
  keyTakeaway?: string;
  professorTip?: string;
  examWarning?: string;
  comparison?: {
    titleA: string;
    titleB: string;
    rows: ComparisonRow[];
  };
  sampleQuestion?: {
    question: string;
    correctApproach: string;
  };
}

export interface ExamQuestion {
  number: number;
  topic: string;
  points: number;
  statement: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  resolutionSteps: string[];
  commonStudentPitfall: string;
  idealAnswerSummary: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  tip?: string;
}

export interface AcademicDocument {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  career: Career;
  university: University;
  type: DocumentType;
  catedra: string;
  year: number;
  cuatrimestre: '1C' | '2C' | 'Verano' | 'Diciembre' | 'Febrero';
  author: string;
  verified: boolean;
  rating: number;
  likesCount: number;
  readTimeMinutes: number;
  summary: string;
  tags: string[];
  sections: NoteSection[];
  examQuestions?: ExamQuestion[];
  flashcards?: Flashcard[];
  createdAt: string;
}

export interface SubjectSummary {
  id: string;
  code: string;
  name: string;
  career: Career;
  university: University;
  description: string;
  catedras: string[];
  documentsCount: number;
  difficulty: 'Accesible' | 'Media' | 'Exigente' | 'Filtro';
}

export interface CatedraReview {
  id: string;
  subjectId: string;
  catedra: string;
  author: string;
  year: number;
  verdict: 'Recomendada' | 'Exigente pero clara' | 'Mucho práctico' | 'Teórica';
  text: string;
  examType: 'Multiple Choice' | 'A desarrollar' | 'Mixto con oral';
  tips: string[];
  likes: number;
}

export interface UserHighlight {
  id: string;
  documentId: string;
  text: string;
  color: 'yellow' | 'green' | 'blue' | 'rose';
  date: string;
}

export interface ReadingPreferences {
  theme: 'paper' | 'clean' | 'sepia' | 'dark';
  fontFamily: 'serif' | 'sans';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
}

export interface PrivateTutor {
  id: string;
  name: string;
  avatar: string;
  university: University;
  career: Career;
  subjects: string[];
  catedras: string[];
  hourlyRateARS: number;
  platformCommissionPercent: number; // e.g. 12%
  rating: number;
  reviewsCount: number;
  bio: string;
  modality: 'Online' | 'Presencial' | 'Ambas';
  availability: string;
  badge?: string;
  whatsappDemo: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  university: University;
  career: Career;
  seoActionCompleted: 'whatsapp_group' | 'google_review' | 'social_share' | 'blog_mention';
  seoDetails?: string;
  registeredAt: string;
}

export interface HectorFoundations {
  primaryAuthor: string;
  sourceWork: string;
  keyRuleOrLaw?: string;
  academicThesis: string;
  doctrinalRationale: string;
  examPitfall: string;
  keyTakeaway: string;
}

export interface HectorInteractiveQuizQuestion {
  id: string;
  statement: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface HectorOralExamData {
  questionNumber: number;
  question: string;
  evaluatorPersona: string;
  requiredConcepts: string[];
  userAnswer?: string;
  grade?: number; // 1-10
  verdict?: 'Aprobado con Distinción' | 'Aprobado' | 'A examen final' | 'Insuficiente / Reprobado';
  missingPoints?: string[];
  feedback?: string;
}

export interface HectorMessage {
  id: string;
  sender: 'user' | 'hector';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  mode?: 'general' | 'foundations' | 'quiz' | 'oral' | 'comparison' | 'mnemonic';
  foundations?: HectorFoundations;
  interactiveQuiz?: HectorInteractiveQuizQuestion[];
  oralExam?: HectorOralExamData;
}
