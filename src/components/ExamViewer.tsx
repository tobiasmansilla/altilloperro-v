import React, { useState } from 'react';
import { AcademicDocument, ExamQuestion } from '../types/academic';
import { calculateQuizResult, QuizResult } from '../utils/academic';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Award, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface ExamViewerProps {
  document: AcademicDocument;
  onBack: () => void;
  onOpenReader: () => void;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({
  document,
  onBack,
  onOpenReader,
}) => {
  const questions: ExamQuestion[] = document.examQuestions || [];

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResolutions, setShowResolutions] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleSelectOption = (questionNumber: number, optionId: string) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionId,
    }));
  };

  const handleEvaluateQuiz = () => {
    const result = calculateQuizResult(userAnswers, questions);
    setQuizResult(result);
    setQuizSubmitted(true);
    // Reveal all resolutions for feedback
    const allRevealed: Record<number, boolean> = {};
    questions.forEach((q) => {
      allRevealed[q.number] = true;
    });
    setShowResolutions(allRevealed);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowResolutions({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const toggleResolution = (num: number) => {
    setShowResolutions((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const allAnswered = questions.every((q) => !q.options || userAnswers[q.number]);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 py-6 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a exámenes</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
              <span>{document.university}</span>
              <span>·</span>
              <span>{document.subjectName}</span>
              <span>·</span>
              <span>{document.catedra}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {document.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReader}
              className="px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 border border-stone-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Apunte Teórico</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Intro Info Banner */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-0.5">
              Modo Práctica de Examen
            </div>
            <p className="text-sm text-stone-600">
              Podés intentar resolver las preguntas como en el parcial real y autoevaluarte para obtener tu calificación (escala 1 a 10), o desplegar la resolución paso a paso.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {quizSubmitted ? (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar Examen</span>
              </button>
            ) : (
              <button
                onClick={handleEvaluateQuiz}
                disabled={!allAnswered}
                className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
                  allAnswered
                    ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Corregir y Calificar</span>
              </button>
            )}
          </div>
        </div>

        {/* Scorecard Results Banner (if evaluated) */}
        {quizSubmitted && quizResult && (
          <div className="bg-white rounded-xl border-2 border-amber-500 p-6 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Resultado de la corrección automática
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-serif font-black text-amber-900">
                    Nota: {quizResult.gradeTenScale} / 10
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      quizResult.status === 'Promocionado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quizResult.status === 'Aprobado a Final'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {quizResult.status}
                  </span>
                </div>
              </div>

              <div className="text-sm text-stone-600 text-right">
                <p>
                  <strong>{quizResult.correctAnswers}</strong> de <strong>{quizResult.totalQuestions}</strong> respuestas correctas ({quizResult.scorePercentage}%)
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-stone-700 leading-relaxed">
              {quizResult.feedback}
            </p>
          </div>
        )}

        {/* Exam Questions List */}
        <div className="space-y-8">
          {questions.map((q) => {
            const isResolved = showResolutions[q.number];
            const selectedOpt = userAnswers[q.number];

            return (
              <section
                key={q.number}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Question Header */}
                <div className="p-5 pb-3 border-b border-stone-100 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-stone-900 text-white font-serif font-bold flex items-center justify-center text-sm shrink-0">
                      {q.number}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                        {q.topic}
                      </span>
                      <span className="text-xs text-stone-400 ml-2">({q.points} pts)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleResolution(q.number)}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800 flex items-center gap-1.5 p-1 rounded hover:bg-stone-100 transition-colors"
                  >
                    {isResolved ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ocultar solución</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver resolución paso a paso</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Question Statement */}
                <div className="p-5">
                  <p className="text-base font-medium text-stone-900 leading-relaxed mb-4">
                    {q.statement}
                  </p>

                  {/* Multiple Choice Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt) => {
                        const isChosen = selectedOpt === opt.id;
                        let optionStyle = 'border-stone-200 hover:border-stone-300 hover:bg-stone-50';

                        if (quizSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                          } else if (isChosen && !opt.isCorrect) {
                            optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                          }
                        } else if (isChosen) {
                          optionStyle = 'border-amber-600 bg-amber-50 text-amber-950 font-medium';
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(q.number, opt.id)}
                            className={`w-full text-left p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-colors ${optionStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                              {quizSubmitted && opt.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : quizSubmitted && isChosen && !opt.isCorrect ? (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              ) : (
                                opt.id.replace('opt-', '').toUpperCase()
                              )}
                            </span>
                            <div className="flex-1">
                              <span>{opt.text}</span>
                              {quizSubmitted && isChosen && (
                                <p className="text-xs text-stone-500 mt-1 italic">
                                  {opt.explanation}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Common Student Pitfall Alert */}
                  {q.commonStudentPitfall && (
                    <div className="p-3 bg-rose-50/70 border-l-2 border-rose-500 rounded-r text-xs text-rose-900 flex items-start gap-2 mb-4">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Error recurrente en correcciones:</strong> {q.commonStudentPitfall}
                      </div>
                    </div>
                  )}

                  {/* Step by Step Resolution (Collapsible) */}
                  {isResolved && (
                    <div className="mt-4 pt-4 border-t border-stone-200/90 bg-stone-50 -mx-5 -mb-5 p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Resolución analítica oficial de la cátedra:
                      </h4>
                      <ol className="space-y-2 text-xs sm:text-sm text-stone-700 pl-4 list-decimal">
                        {q.resolutionSteps.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div className="mt-3 p-2.5 rounded bg-amber-100/70 text-xs text-amber-950 font-medium">
                        <strong>Respuesta formal esperada:</strong> {q.idealAnswerSummary}
                      </div>
                    </div>
                  )}

                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom submit CTA if not submitted */}
        {!quizSubmitted && questions.length > 0 && (
          <div className="mt-8 text-center bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              ¿Listo para ver tu resultado?
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Respondé todas las preguntas para calcular tu calificación con el criterio de corrección de la cátedra.
            </p>
            <button
              onClick={handleEvaluateQuiz}
              disabled={!allAnswered}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition-all ${
                allAnswered
                  ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              Calcular Nota Final
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
