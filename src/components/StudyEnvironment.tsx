import React, { useState, useEffect } from 'react';
import { AcademicDocument, Flashcard, ExamQuestion, PrivateTutor } from '../types/academic';
import { allTutors } from '../data/mockData';
import { 
  Timer, 
  RotateCw, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  Award, 
  Layers, 
  Edit3, 
  ChevronRight, 
  ChevronLeft,
  XCircle,
  Eye,
  MessageCircle,
  Percent,
  Check
} from 'lucide-react';

interface StudyEnvironmentProps {
  document: AcademicDocument;
  onOpenHector: () => void;
  onOpenTutorMarketplace?: () => void;
  isAppDark?: boolean;
}

export const StudyEnvironment: React.FC<StudyEnvironmentProps> = ({
  document,
  onOpenHector,
  onOpenTutorMarketplace,
}) => {
  // Study sub-tabs
  const [studyTab, setStudyTab] = useState<'flashcards' | 'multiplechoice' | 'simulacro' | 'notas'>('flashcards');

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');

  // Flashcards state
  const flashcards: Flashcard[] = document.flashcards && document.flashcards.length > 0
    ? document.flashcards
    : [
        {
          id: 'fc-default-1',
          category: 'Concepto Clave',
          question: `¿Cuál es el núcleo teórico fundamental de ${document.subjectName}?`,
          answer: document.summary,
          tip: 'Revisá la introducción de la unidad 1.',
        },
        {
          id: 'fc-default-2',
          category: 'Cátedra y Enfoque',
          question: `¿Qué enfoque metodológico exige la ${document.catedra}?`,
          answer: document.sections[0]?.professorTip || 'Justificación rigurosa de cada concepto sin omitir condiciones formales.',
        },
      ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Multiple Choice State
  const examQuestions: ExamQuestion[] = document.examQuestions || [];
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({});
  const [mcSubmitted, setMcSubmitted] = useState(false);

  // Student Personal Notes per Document
  const notesStorageKey = `altillo_notes_${document.id}`;
  const [personalNote, setPersonalNote] = useState<string>(() => {
    try {
      return localStorage.getItem(notesStorageKey) || '';
    } catch {
      return '';
    }
  });
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Relevant Private Tutor for this Subject
  const matchedTutor: PrivateTutor | undefined = allTutors.find((t) =>
    t.subjects.some((s) => s.toLowerCase().includes(document.subjectName.toLowerCase())) ||
    t.university === document.university
  ) || allTutors[0];

  // Pomodoro effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setPomodoroRunning(false);
      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroSeconds(5 * 60);
      } else {
        setPomodoroMode('work');
        setPomodoroSeconds(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroRunning, pomodoroSeconds, pomodoroMode]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNote = () => {
    try {
      localStorage.setItem(notesStorageKey, personalNote);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleMarkMastered = (cardId: string) => {
    setMasteredCards((prev) => ({ ...prev, [cardId]: true }));
    handleNextCard();
  };

  const currentCard = flashcards[currentCardIndex];
  const totalMastered = Object.keys(masteredCards).length;

  return (
    <div className="space-y-6">
      
      {/* Top Ambient Bar: Pomodoro & Study Stats */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Pomodoro Clock Widget */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              pomodoroMode === 'work' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                {pomodoroMode === 'work' ? 'Bloque de Foco Activo' : 'Pausa de Descanso'}
              </div>
              <div className="font-mono text-2xl font-bold text-white tracking-wider">
                {formatTimer(pomodoroSeconds)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-lg">
            <button
              onClick={() => setPomodoroRunning(!pomodoroRunning)}
              className="p-1.5 rounded hover:bg-stone-700 text-stone-200 transition-colors"
              title={pomodoroRunning ? 'Pausar Pomodoro' : 'Iniciar Pomodoro'}
            >
              {pomodoroRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setPomodoroRunning(false);
                setPomodoroSeconds(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
              }}
              className="p-1.5 rounded hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reiniciar reloj"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hector AI Direct Tutor Prompt */}
        <div className="flex items-center gap-3 bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700/80 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-100 overflow-hidden shrink-0 border border-amber-400">
              <img src="/assets/aistudio/imagen_cf498cd9.png" alt="Héctor" className="w-full h-full object-contain" />
            </div>
            <div className="text-left text-xs">
              <span className="font-semibold text-stone-200 block">¿Dudas con este tema?</span>
              <span className="text-[11px] text-amber-400">Héctor IA te ayuda en directo</span>
            </div>
          </div>
          <button
            onClick={onOpenHector}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
          >
            Preguntar
          </button>
        </div>

      </div>

      {/* Study Navigation Segmented Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setStudyTab('flashcards')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            studyTab === 'flashcards'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Tarjetas Flashcards ({flashcards.length})</span>
        </button>

        <button
          onClick={() => setStudyTab('multiplechoice')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            studyTab === 'multiplechoice'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Multiple Choice de Repaso</span>
        </button>

        <button
          onClick={() => setStudyTab('simulacro')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            studyTab === 'simulacro'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Award className="w-4 h-4 text-purple-600" />
          <span>Simulacro de Evaluación</span>
        </button>

        <button
          onClick={() => setStudyTab('notas')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            studyTab === 'notas'
              ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Edit3 className="w-4 h-4 text-sky-600" />
          <span>Mis Notas del Archivo</span>
        </button>
      </div>

      {/* Tab 1: 3D Flashcards */}
      {studyTab === 'flashcards' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <div>
              <span>Tarjeta <strong>{currentCardIndex + 1}</strong> de <strong>{flashcards.length}</strong></span>
              <span className="mx-2">·</span>
              <span className="text-amber-800 font-semibold">{currentCard.category}</span>
            </div>
            <div className="text-emerald-700 font-semibold">
              {totalMastered} dominadas
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 min-h-[240px] sm:min-h-[280px] cursor-pointer group"
          >
            <div
              className={`w-full min-h-[240px] sm:min-h-[280px] rounded-2xl border-2 transition-transform duration-500 transform-style-3d p-6 sm:p-8 flex flex-col justify-between relative shadow-sm ${
                isFlipped
                  ? 'rotate-y-180 bg-[#faf8f4] border-amber-400'
                  : 'bg-white border-stone-200 group-hover:border-amber-300'
              }`}
            >
              {/* Front Face (Question) */}
              {!isFlipped ? (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Pregunta de Examen
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-4 leading-snug">
                      {currentCard.question}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span>Hacé clic en cualquier parte de la tarjeta para girarla</span>
                    <RotateCw className="w-4 h-4 text-amber-600 group-hover:rotate-180 transition-transform" />
                  </div>
                </div>
              ) : (
                /* Back Face (Answer) */
                <div className="flex flex-col justify-between h-full transform rotate-y-180">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Respuesta Modelo de Cátedra
                    </span>
                    <p className="font-serif text-base sm:text-lg text-stone-800 mt-4 leading-relaxed font-medium">
                      {currentCard.answer}
                    </p>
                    {currentCard.tip && (
                      <div className="mt-3 text-xs text-amber-900 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Tip:</strong> {currentCard.tip}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                    <span>Hacé clic para volver a la pregunta</span>
                    <RotateCw className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flashcard Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              <button
                onClick={handleNextCard}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs flex items-center gap-1"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNextCard()}
                className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
              >
                Necesito repasar luego
              </button>
              <button
                onClick={() => handleMarkMastered(currentCard.id)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>¡La domino bien!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Multiple Choice Interactivo */}
      {studyTab === 'multiplechoice' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Multiple Choice de Autoevaluación
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Probá tus conocimientos con opciones formuladas al estilo de los exámenes de la cátedra.
            </p>
          </div>

          {examQuestions.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              Este apunte no tiene preguntas cargadas aún. ¡Podés pedirle a Héctor IA que te genere 3 preguntas al vuelo!
            </div>
          ) : (
            <div className="space-y-6">
              {examQuestions.map((q) => {
                const selectedOptId = mcAnswers[q.number];
                return (
                  <div key={q.number} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-amber-800">
                        Pregunta #{q.number} · {q.topic}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-stone-900">
                      {q.statement}
                    </p>

                    {q.options && (
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedOptId === opt.id;
                          let style = 'border-stone-200 bg-white hover:bg-stone-50';

                          if (mcSubmitted) {
                            if (opt.isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                            else if (isSelected && !opt.isCorrect) style = 'border-rose-400 bg-rose-50 text-rose-950';
                          } else if (isSelected) {
                            style = 'border-amber-600 bg-amber-50 text-amber-950 font-medium';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (mcSubmitted) return;
                                setMcAnswers((prev) => ({ ...prev, [q.number]: opt.id }));
                              }}
                              className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${style}`}
                            >
                              <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                                {opt.id.replace('opt-', '').toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <span>{opt.text}</span>
                                {mcSubmitted && isSelected && (
                                  <p className="text-[11px] text-stone-600 mt-1 italic">
                                    {opt.explanation}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                {mcSubmitted ? (
                  <button
                    onClick={() => {
                      setMcAnswers({});
                      setMcSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium"
                  >
                    Reintentar Multiple Choice
                  </button>
                ) : (
                  <button
                    onClick={() => setMcSubmitted(true)}
                    disabled={Object.keys(mcAnswers).length === 0}
                    className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs"
                  >
                    Verificar Respuestas
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Simulacro de Evaluación */}
      {studyTab === 'simulacro' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Simulacro de Parcial: {document.subjectName}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Simula las condiciones reales del examen parcial con tiempo y corrección reglamentaria de la cátedra.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg shrink-0">
              Cátedra {document.catedra}
            </span>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200/80 text-xs text-purple-950 space-y-2">
            <h4 className="font-semibold text-purple-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-700" />
              Instrucciones del Tribunal Evaluador:
            </h4>
            <p>1. Disponés de 60 minutos para responder el cuestionario teórico-práctico sin material de consulta.</p>
            <p>2. Cada respuesta incorrecta en choice resta 0.25 puntos; respuestas en blanco no restan.</p>
            <p>3. Para promocionar directo sin final requerís calificación 7 o superior (mínimo 60% para aprobar a final).</p>
          </div>

          <div className="space-y-4">
            {document.sections.map((sec, sIdx) => (
              <div key={sec.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Punto de Examen #{sIdx + 1}
                </span>
                <h4 className="font-serif text-sm font-bold text-stone-900 mt-1 mb-2">
                  Desarrollo sobre: {sec.title}
                </h4>
                <p className="text-xs text-stone-600 mb-3">
                  {sec.lead || 'Explicar los fundamentos centrales y la relación con los autores obligatorios del programa.'}
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-0.5">Criterio que evaluará el docente:</strong>
                  {sec.keyTakeaway || 'Precisión conceptual y coherencia argumentativa.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Bloc de Notas Personales */}
      {studyTab === 'notas' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Mi Cuaderno de Estudio para este Archivo
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Anotaciones personales, dudas para la clase y fórmulas. Se guardan automáticamente en tu navegador.
              </p>
            </div>
            {noteSavedFeedback && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
          </div>

          <textarea
            rows={8}
            placeholder="Escribí aquí tus notas mientras repasás el apunte... (ej: Preguntar al profe sobre la página 14, recordar fórmula del multiplicador...)"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            className="w-full text-xs sm:text-sm p-4 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 bg-[#faf8f4] font-serif leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNote}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Guardar Notas en Caché
            </button>
          </div>
        </div>
      )}

      {/* Contextual Specialized Tutor Advertisement Widget */}
      {matchedTutor && (
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-stone-100 rounded-2xl p-5 border border-amber-800/80 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3.5">
              <img
                src={matchedTutor.avatar}
                alt={matchedTutor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0 mt-0.5"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-700">
                    Agente Especializado
                  </span>
                  <span className="text-xs text-amber-200">★ {matchedTutor.rating}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-white mt-0.5">
                  ¿Te cuesta {document.subjectName}? Tomá una clase con {matchedTutor.name}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
                  {matchedTutor.bio}
                </p>
                <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-3">
                  <span>Tarifa: <strong>${matchedTutor.hourlyRateARS.toLocaleString('es-AR')}/hr</strong></span>
                  <span>·</span>
                  <span>Comisión asegurada Altillo: <strong>12%</strong></span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">{matchedTutor.modality}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
              {onOpenTutorMarketplace && (
                <button
                  onClick={onOpenTutorMarketplace}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ver Profesores de esta Cátedra</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
