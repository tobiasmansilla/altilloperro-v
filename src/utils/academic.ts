import { AcademicDocument, DocumentType, University, Career } from '../types/academic';

export interface FilterOptions {
  query?: string;
  university?: University | 'Todas';
  career?: Career | 'Todas';
  subjectId?: string;
  type?: DocumentType | 'todos';
  tag?: string;
  sortBy?: 'popular' | 'recent' | 'rating';
}

export function filterAndSortDocuments(
  docs: AcademicDocument[],
  filters: FilterOptions
): AcademicDocument[] {
  const normalizedQuery = (filters.query || '').trim().toLowerCase();

  return docs
    .filter((doc) => {
      // University filter
      if (filters.university && filters.university !== 'Todas' && doc.university !== filters.university) {
        return false;
      }

      // Career filter
      if (filters.career && filters.career !== 'Todas' && doc.career !== filters.career) {
        return false;
      }

      // Subject filter
      if (filters.subjectId && filters.subjectId !== 'all' && doc.subjectId !== filters.subjectId) {
        return false;
      }

      // Document type filter
      if (filters.type && filters.type !== 'todos' && doc.type !== filters.type) {
        return false;
      }

      // Tag filter
      if (filters.tag && !doc.tags.includes(filters.tag)) {
        return false;
      }

      // Free text search
      if (normalizedQuery) {
        const matchesTitle = doc.title.toLowerCase().includes(normalizedQuery);
        const matchesSubject = doc.subjectName.toLowerCase().includes(normalizedQuery);
        const matchesCatedra = doc.catedra.toLowerCase().includes(normalizedQuery);
        const matchesSummary = doc.summary.toLowerCase().includes(normalizedQuery);
        const matchesTags = doc.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
        const matchesSections = doc.sections.some(
          (s) =>
            s.title.toLowerCase().includes(normalizedQuery) ||
            s.paragraphs.some((p) => p.toLowerCase().includes(normalizedQuery))
        );

        if (
          !matchesTitle &&
          !matchesSubject &&
          !matchesCatedra &&
          !matchesSummary &&
          !matchesTags &&
          !matchesSections
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'recent') {
        return b.year - a.year || b.createdAt.localeCompare(a.createdAt);
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // default: popular
      return b.likesCount - a.likesCount;
    });
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  gradeTenScale: number; // 1 to 10
  status: 'Promocionado' | 'Aprobado a Final' | 'Desaprobado';
  feedback: string;
}

export function calculateQuizResult(
  userAnswers: Record<number, string>,
  questions: { number: number; options?: { id: string; isCorrect: boolean }[] }[]
): QuizResult {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      scorePercentage: 0,
      gradeTenScale: 0,
      status: 'Desaprobado',
      feedback: 'No hay preguntas disponibles.',
    };
  }

  let correctCount = 0;
  for (const q of questions) {
    const selectedOptionId = userAnswers[q.number];
    if (selectedOptionId && q.options) {
      const option = q.options.find((opt) => opt.id === selectedOptionId);
      if (option && option.isCorrect) {
        correctCount += 1;
      }
    }
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  // Argentine university 1-10 grade conversion
  // >= 60% = 4 (aprobado), >= 80% = 7+ (promoción directa)
  let gradeTenScale = 1;
  if (scorePercentage >= 95) gradeTenScale = 10;
  else if (scorePercentage >= 88) gradeTenScale = 9;
  else if (scorePercentage >= 80) gradeTenScale = 8;
  else if (scorePercentage >= 70) gradeTenScale = 7;
  else if (scorePercentage >= 65) gradeTenScale = 6;
  else if (scorePercentage >= 60) gradeTenScale = 5;
  else if (scorePercentage >= 50) gradeTenScale = 4;
  else if (scorePercentage >= 35) gradeTenScale = 3;
  else gradeTenScale = 2;

  let status: QuizResult['status'] = 'Desaprobado';
  let feedback = 'Necesitás repasar los conceptos fundamentales antes del examen.';

  if (gradeTenScale >= 7) {
    status = 'Promocionado';
    feedback = '¡Excelente nivel! Tenés los conceptos claros y listos para promocionar la materia.';
  } else if (gradeTenScale >= 4) {
    status = 'Aprobado a Final';
    feedback = '¡Aprobaste! Buen dominio general, aunque conviene ajustar los detalles finos marcados en las explicaciones.';
  }

  return {
    totalQuestions,
    correctAnswers: correctCount,
    scorePercentage,
    gradeTenScale,
    status,
    feedback,
  };
}

export function formatDocumentTypeLabel(type: DocumentType): string {
  switch (type) {
    case 'resumen':
      return 'Resumen Completo';
    case 'primer_parcial':
      return '1er Parcial Resuelto';
    case 'segundo_parcial':
      return '2do Parcial Resuelto';
    case 'final':
      return 'Examen Final';
    case 'guia_ejercicios':
      return 'Guía Práctica Resuelta';
    default:
      return 'Apunte';
  }
}
