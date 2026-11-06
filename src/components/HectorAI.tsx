import React, { useState, useEffect, useRef } from 'react';
import { AcademicDocument, StudentUser, HectorMessage, HectorFoundations, HectorInteractiveQuizQuestion, HectorOralExamData } from '../types/academic';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Lightbulb,
  CheckCircle2,
  Lock,
  Award,
  BookMarked,
  Check,
  AlertCircle,
  Columns,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  findFoundationsForDoc, 
  generateOralExamSession, 
  gradeOralAnswer, 
  generateInteractiveQuizForDoc 
} from '../utils/hectorBrain';

interface HectorAIProps {
  currentDocument?: AcademicDocument | null;
  currentUser?: StudentUser | null;
  onOpenRegisterModal: () => void;
  isAppDark?: boolean;
}

export const HectorAI: React.FC<HectorAIProps> = ({
  currentDocument,
  currentUser,
  onOpenRegisterModal,
  isAppDark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<HectorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);

  // Active Tool Mode
  const [activeTool, setActiveTool] = useState<'chat' | 'foundations' | 'quiz' | 'oral' | 'comparison' | 'mnemonic'>('chat');
  
  // Ongoing Oral Exam State
  const [activeOralExam, setActiveOralExam] = useState<HectorOralExamData | null>(null);

  // User Interactive Quiz selections
  const [quizSelections, setQuizSelections] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Storage cache key unique to user and current document (or general)
  const cacheKey = currentUser
    ? `altillo_hector_chat_${currentUser.id}_${currentDocument?.id || 'general'}`
    : null;

  // Load chat cache when context or user changes
  useEffect(() => {
    if (!cacheKey) {
      setMessages([]);
      return;
    }

    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Initial greeting personalized to current context
        const userName = currentUser?.name || 'Estudiante';
        const docTitle = currentDocument ? `"${currentDocument.title}" (${currentDocument.subjectName})` : 'el repositorio de Altillo';
        
        const welcomeMsg: HectorMessage = {
          id: `msg-init-${Date.now()}`,
          sender: 'hector',
          text: `¡Hola ${userName}! 📚 Soy Héctor, tu tutor con fundamentación académica real de cátedra. Estoy listo para ayudarte con ${docTitle}. No te voy a dar respuestas genéricas: te justifico cada concepto con autores del programa, fallos, teoremas o preparados cadavéricos.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            'Fundamentar tema central con autores',
            'Tomarme un mini test de 3 preguntas',
            'Simular examen oral de tribunal',
            'Generar regla mnemotécnica de cátedra',
          ],
        };

        setMessages([welcomeMsg]);
      }
    } catch {
      // fallback
    }
  }, [cacheKey, currentDocument?.id, currentUser]);

  // Save chat cache on change
  useEffect(() => {
    if (cacheKey && messages.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [cacheKey, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleClearCache = () => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      setActiveOralExam(null);
      setQuizSelections({});
      setMessages([
        {
          id: `msg-reset-${Date.now()}`,
          sender: 'hector',
          text: `Historial y caché reiniciados para este archivo. ¡Elegí una función arriba o preguntame cualquier duda! 📖`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Trigger Foundational Explanation Function
  const triggerFoundationsFunction = () => {
    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const found = findFoundationsForDoc(currentDocument);
    const newMsg: HectorMessage = {
      id: `msg-fnd-${Date.now()}`,
      sender: 'hector',
      text: `Aquí tenés la fundamentación teórica de cátedra para "${currentDocument?.subjectName || 'la materia'}", respaldada en la bibliografía obligatoria de examen:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'foundations',
      foundations: found,
      suggestedActions: [
        '¿Cómo justificar esto en el examen?',
        'Tomarme un test sobre esta fundamentación',
        'Simular examen oral de este punto'
      ]
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Trigger Interactive Quiz Function
  const triggerQuizFunction = () => {
    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const quizQuestions = generateInteractiveQuizForDoc(currentDocument);
    const newMsg: HectorMessage = {
      id: `msg-quiz-${Date.now()}`,
      sender: 'hector',
      text: `Preparé este test rápido de 3 preguntas con el formato y nivel de exigencia de la cátedra para evaluar tu comprensión. Seleccioná tu opción y te doy la justificación inmediata:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'quiz',
      interactiveQuiz: quizQuestions,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Trigger Oral Exam Simulation Function
  const triggerOralExamFunction = () => {
    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const oralSession = generateOralExamSession(currentDocument);
    setActiveOralExam(oralSession);

    const newMsg: HectorMessage = {
      id: `msg-oral-${Date.now()}`,
      sender: 'hector',
      text: `⚖️ **Simulador de Examen Oral Activado**\n\nEl ${oralSession.evaluatorPersona} te hace la siguiente pregunta de mesa examinadora. Escribí tu exposición oral y te evalúo con nota de 1 a 10 y devolución de conceptos faltantes:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'oral',
      oralExam: oralSession,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Trigger Comparison Chart Function
  const triggerComparisonFunction = () => {
    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const subj = (currentDocument?.subjectId || '').toLowerCase();
    let compText = '';

    if (subj.includes('cardio') || subj.includes('anat')) {
      compText = `📊 **Cuadro Comparativo: Cavidades Cardíacas Derechas vs Izquierdas**\n\n• **Presión & Resistencia:** Corazón Derecho maneja baja presión (circulación menor / pulmonar a 20 mmHg). Corazón Izquierdo maneja alta presión sistémica (120 mmHg) con miocardio 3x más grueso.\n• **Válvulas AV:** Tricúspide (3 valvas: anterior, posterior, septal) en el derecho vs Mitral / Bicúspide en el izquierdo.\n• **Contenido de Oxígeno:** Sangre carbooxigenada venosa (cavas y seno coronario) en el derecho vs Sangre oxigenada arterial (4 venas pulmonares) en el izquierdo.\n• **Clave de Parcial:** En el ventrículo derecho está la trabécula septomarginal con la rama derecha del Haz de His.`;
    } else if (subj.includes('icse')) {
      compText = `📊 **Cuadro Comparativo: Estado vs Régimen Político vs Gobierno**\n\n• **Estado (Permanencia):** Estructura institucional y relación social de dominación con monopolio indiscutido de la fuerza sobre un territorio (Oszlak).\n• **Régimen Político (Reglas de Juego):** Conjunto de normas formales e informales que regulan el acceso y ejercicio del poder (Democrático vs Autoritario vs Híbrido).\n• **Gobierno (Administradores Transitorios):** Conjunto de funcionarios y ministros que conducen el poder ejecutivo temporalmente (ej: mandato constitucional de 4 años).\n• **Trampa de Examen:** Un cambio de gobierno en elecciones NO altera el régimen; un golpe de Estado sí destruye el régimen.`;
    } else if (subj.includes('ipc')) {
      compText = `📊 **Cuadro Comparativo: Falsacionismo (Popper) vs Paradigmas (Kuhn)**\n\n• **Criterio de Demarcación:** Para Popper es la refutabilidad lógica empírica. Para Kuhn es la capacidad del paradigma de plantear enigmas en Ciencia Normal.\n• **Mecanismo de Progreso:** Popper sostiene progreso acumulativo por eliminación de teorías refutadas por Modus Tollens. Kuhn postula saltos revolucionarios con inconmensurabilidad.\n• **Actitud Científica:** Popper idealiza científicos críticos que buscan falsar sus hipótesis; Kuhn demuestra que los científicos defienden su paradigma y culpan a los instrumentos ante las anomalías.`;
    } else {
      compText = `📊 **Cuadro Analítico de Cátedra: Fundamentos y Dimensiones**\n\n• **Marco Teórico Principal:** Autores canónicos del programa de ${currentDocument?.subjectName || 'la materia'}.\n• **Hipótesis Central:** Explicación causal del fenómeno sin apelar a opiniones subjetivas.\n• **Criterio de Corrección:** El tribunal premia la utilización del vocabulario técnico de cátedra y penaliza la vaguedad discursiva.`;
    }

    const newMsg: HectorMessage = {
      id: `msg-cmp-${Date.now()}`,
      sender: 'hector',
      text: compText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'comparison',
      suggestedActions: [
        '¿Cómo plasmar este cuadro en una hoja de parcial?',
        'Haceme una pregunta sobre este cuadro',
        'Dame una mnemotecnia para recordarlo'
      ]
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Trigger Mnemonic Generator
  const triggerMnemonicFunction = () => {
    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const found = findFoundationsForDoc(currentDocument);
    const newMsg: HectorMessage = {
      id: `msg-mnemo-${Date.now()}`,
      sender: 'hector',
      text: `🧩 **Laboratorio de Mnemotecnias de Cátedra:**\n\n${found.keyTakeaway}\n\n💡 **Técnica de anclaje mental:** Relacioná siempre la primera letra del autor con su concepto axial. Por ejemplo:\n• **Oszlak = Orden y Organización nacional (1880)**\n• **Popper = Poda y Prohíbe inductivismo**\n• **Dahl = Debate público + Dimensiones democráticas**\n\n¿Querés que creemos una regla mnemotécnica personalizada para algún listado que te cueste memorizar?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'mnemonic',
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Handle user selecting an option in an interactive quiz
  const handleSelectQuizOption = (qId: string, optId: string) => {
    setQuizSelections((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!currentUser) {
      onOpenRegisterModal();
      return;
    }

    const userMsg: HectorMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // If an oral exam question is active, grade the student's oral exposition!
    if (activeOralExam && !activeOralExam.userAnswer) {
      setTimeout(() => {
        const evaluation = gradeOralAnswer(activeOralExam, text);
        const gradedSession: HectorOralExamData = {
          ...activeOralExam,
          userAnswer: text,
          grade: evaluation.grade,
          verdict: evaluation.verdict,
          missingPoints: evaluation.missingPoints,
          feedback: evaluation.feedback
        };

        const resultMsg: HectorMessage = {
          id: `msg-eval-${Date.now()}`,
          sender: 'hector',
          text: `🎓 **Dictamen del Tribunal Evaluador:**\nCalificación Obtenida: **${evaluation.grade}/10** (${evaluation.verdict})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'oral',
          oralExam: gradedSession,
          suggestedActions: [
            'Probar otra pregunta de examen oral',
            'Ver la fundamentación teórica completa',
            'Hacerme un test multiple choice'
          ]
        };

        setMessages((prev) => [...prev, resultMsg]);
        setActiveOralExam(null); // finish turn
        setIsTyping(false);
      }, 700);
      return;
    }

    // Otherwise, generate thoughtful grounded answer
    setTimeout(() => {
      const q = text.toLowerCase();
      const doc = currentDocument;
      const foundations = findFoundationsForDoc(doc, text);

      let responseText = '';
      let msgMode: 'general' | 'foundations' | 'quiz' | 'oral' | 'comparison' | 'mnemonic' = 'general';

      if (q.includes('test') || q.includes('multiple') || q.includes('choice') || q.includes('preguntame')) {
        triggerQuizFunction();
        setIsTyping(false);
        return;
      }

      if (q.includes('oral') || q.includes('tribunal') || q.includes('mesa')) {
        triggerOralExamFunction();
        setIsTyping(false);
        return;
      }

      if (q.includes('cuadro') || q.includes('compar') || q.includes('tabla')) {
        triggerComparisonFunction();
        setIsTyping(false);
        return;
      }

      if (q.includes('mnemo') || q.includes('regla') || q.includes('memoria')) {
        triggerMnemonicFunction();
        setIsTyping(false);
        return;
      }

      // Foundational detailed doctrinal answer
      responseText = `📚 **Respuesta con Fundamentación de Cátedra:**\n\n• **Autor y Fuente:** ${foundations.primaryAuthor} (*${foundations.sourceWork}*).\n\n• **Tesis Central:** ${foundations.academicThesis}\n\n• **Justificación Dogmática:** ${foundations.doctrinalRationale}\n\n⚠️ **Alerta de Trampa en Parciales:** ${foundations.examPitfall}\n\n💡 **Conclusión Operativa:** ${foundations.keyTakeaway}`;
      msgMode = 'foundations';

      const hectorMsg: HectorMessage = {
        id: `msg-hector-${Date.now()}`,
        sender: 'hector',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: msgMode,
        foundations: foundations,
        suggestedActions: [
          '¿Cómo justificar esto en el examen?',
          'Tomarme un test de este tema',
          'Simular examen oral',
          'Generar cuadro comparativo'
        ]
      };

      setMessages((prev) => [...prev, hectorMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none no-print">
      
      {/* Speech Bubble when chat is closed */}
      {!isOpen && showSpeechBubble && (
        <div 
          onClick={() => setIsOpen(true)}
          className="absolute bottom-20 right-2 bg-stone-900 text-stone-100 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-amber-500/40 cursor-pointer hover:bg-stone-850 transition-all max-w-[220px] animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-start justify-between gap-1.5">
            <span className="font-medium leading-snug">
              ¡Hola! Soy <strong>Héctor</strong> 📚 Con fundamentos de cátedra, test y oral.
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSpeechBubble(false); }}
              className="text-stone-400 hover:text-white p-0.5 -mt-0.5"
              aria-label="Cerrar globo"
            >
              ×
            </button>
          </div>
          <div className="w-2.5 h-2.5 bg-stone-900 border-r border-b border-amber-500/40 rotate-45 absolute -bottom-1.5 right-6" />
        </div>
      )}

      {/* Retro Floating Character Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir tutor virtual Héctor IA"
          className="group relative focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-full"
        >
          {/* Subtle glow disk behind Hector */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/40 to-yellow-400/40 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
          
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-50 border-2 border-amber-400 shadow-xl overflow-hidden flex items-center justify-center p-1.5 animate-retro-bob cursor-pointer">
            <img
              src="/assets/aistudio/imagen_cf498cd9.png"
              alt="Héctor, el Libro Tutor de Altillo"
              className="w-full h-full object-contain filter drop-shadow-sm hover:scale-110 transition-transform"
            />
          </div>

          {/* Small online badge */}
          <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Héctor está en línea con funciones activas" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-800 shadow-2xl w-[94vw] sm:w-[420px] h-[560px] max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Window Header */}
          <div className="bg-stone-900 text-stone-100 p-3.5 px-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-400 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src="/assets/aistudio/imagen_cf498cd9.png"
                  alt="Héctor"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold text-white leading-none">
                    Héctor
                  </h3>
                  <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-950/80 border border-amber-700/80 px-1 py-0.2 rounded">
                    Tutor con Fundamentos
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 truncate max-w-[210px] mt-0.5">
                  {currentDocument ? currentDocument.subjectName : 'Navegando en Altillo'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {currentUser && (
                <button
                  onClick={handleClearCache}
                  title="Reiniciar chat y caché de este archivo"
                  className="text-stone-400 hover:text-stone-200 p-1.5 rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white p-1.5 rounded transition-colors"
                aria-label="Cerrar chat con Héctor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Area */}
          {!currentUser ? (
            /* Unregistered User Locking Banner */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-stone-50 dark:bg-stone-950">
              <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                Activá a Héctor con tu Registro Solidario
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-5 leading-relaxed max-w-xs">
                Para hablar con Héctor sin límites, realizar simulacros orales, tests interactivos y guardar la memoria de cada apunte, registrate gratis apoyando la difusión de Altillo.
              </p>
              <button
                onClick={onOpenRegisterModal}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Registrarme Gratis (Apoyar SEO)</span>
              </button>
              <span className="text-[10px] text-stone-400 mt-3">
                0 costos ocultos · Solo 1 click solidario
              </span>
            </div>
          ) : (
            /* Registered Chat Flow */
            <>
              {/* Functional Interactive Toolbar: Fundamentos, Test Rápido, Examen Oral, Cuadro, Mnemotecnia */}
              <div className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 p-1.5 flex items-center gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={triggerFoundationsFunction}
                  title="Fundamentar con bibliografía de cátedra"
                  className="px-2 py-1 rounded bg-white dark:bg-stone-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fundamentar</span>
                </button>
                <button
                  onClick={triggerQuizFunction}
                  title="Generar mini test de 3 preguntas"
                  className="px-2 py-1 rounded bg-white dark:bg-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test Rápido</span>
                </button>
                <button
                  onClick={triggerOralExamFunction}
                  title="Simular examen oral de tribunal con calificación 1-10"
                  className="px-2 py-1 rounded bg-white dark:bg-stone-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Simular Oral</span>
                </button>
                <button
                  onClick={triggerComparisonFunction}
                  title="Generar cuadro comparativo de cátedra"
                  className="px-2 py-1 rounded bg-white dark:bg-stone-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Columns className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cuadro</span>
                </button>
                <button
                  onClick={triggerMnemonicFunction}
                  title="Generar regla mnemotécnica"
                  className="px-2 py-1 rounded bg-white dark:bg-stone-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mnemotecnia</span>
                </button>
              </div>

              {/* Context bar */}
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/60 px-3 py-1 text-[10px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <span className="truncate">
                  Memoria activa: <strong>{currentDocument?.catedra || 'Comunidad Universitaria'}</strong>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                  ● Caché Local Activa
                </span>
              </div>

              {/* Messages feed */}
              <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-stone-50 dark:bg-stone-950 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                          isUser
                            ? 'bg-amber-600 text-white rounded-tr-xs'
                            : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <div className="whitespace-pre-line font-sans">{m.text}</div>

                        {/* Interactive Foundations Card if attached */}
                        {m.foundations && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-stone-900 dark:text-stone-100 space-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold uppercase text-[10px]">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Fuentes Obligatorias de Cátedra</span>
                            </div>
                            <p className="font-semibold text-stone-900 dark:text-white">
                              {m.foundations.primaryAuthor}
                            </p>
                            <p className="italic text-stone-600 dark:text-stone-400 text-[11px]">
                              {m.foundations.sourceWork}
                            </p>
                            {m.foundations.keyRuleOrLaw && (
                              <div className="p-1.5 rounded bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-800 text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-300">
                                {m.foundations.keyRuleOrLaw}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Quiz Widget if attached */}
                        {m.interactiveQuiz && (
                          <div className="mt-3 space-y-3 pt-2 border-t border-stone-200 dark:border-stone-700">
                            {m.interactiveQuiz.map((q, idx) => {
                              const selected = quizSelections[q.id];
                              return (
                                <div key={q.id} className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
                                  <span className="font-bold text-amber-800 dark:text-amber-400 text-[11px] block">
                                    Pregunta #{idx + 1}:
                                  </span>
                                  <p className="font-medium text-stone-900 dark:text-stone-100">{q.statement}</p>
                                  <div className="space-y-1.5 pt-1">
                                    {q.options.map((opt) => {
                                      const isChosen = selected === opt.id;
                                      let optStyle = 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-100';
                                      if (selected) {
                                        if (opt.isCorrect) optStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                                        else if (isChosen && !opt.isCorrect) optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200';
                                      }

                                      return (
                                        <button
                                          key={opt.id}
                                          onClick={() => handleSelectQuizOption(q.id, opt.id)}
                                          className={`w-full text-left p-2 rounded border text-xs transition-colors flex items-start gap-1.5 ${optStyle}`}
                                        >
                                          <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                                            {opt.id.toUpperCase()}
                                          </span>
                                          <div className="flex-1">
                                            <span>{opt.text}</span>
                                            {selected && isChosen && (
                                              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 italic">
                                                {opt.explanation}
                                              </p>
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Interactive Oral Exam Evaluation if attached */}
                        {m.oralExam && m.oralExam.grade !== undefined && (
                          <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-purple-900 dark:text-purple-300 text-[11px] flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-purple-600" />
                                {m.oralExam.evaluatorPersona}
                              </span>
                              <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                                m.oralExam.grade >= 7 ? 'bg-emerald-600 text-white' : m.oralExam.grade >= 4 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                              }`}>
                                Nota: {m.oralExam.grade}/10
                              </span>
                            </div>

                            <p className="text-stone-800 dark:text-stone-200">{m.oralExam.feedback}</p>

                            {m.oralExam.missingPoints && m.oralExam.missingPoints.length > 0 && (
                              <div className="p-2 rounded bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-800">
                                <span className="font-semibold text-rose-700 dark:text-rose-400 block mb-1 text-[11px]">
                                  Puntos doctrinales que te faltó enunciar:
                                </span>
                                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-stone-700 dark:text-stone-300">
                                  {m.oralExam.missingPoints.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Suggested actions if present */}
                      {m.suggestedActions && (
                        <div className="mt-2 space-y-1 w-full max-w-[95%]">
                          <span className="text-[10px] text-stone-400 font-medium block">
                            Preguntas y acciones sugeridas:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {m.suggestedActions.map((action, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleSendMessage(action)}
                                className="text-left text-[11px] p-1.5 px-2 bg-amber-100/70 dark:bg-amber-950/50 hover:bg-amber-200/80 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 rounded-lg transition-colors border border-amber-200 dark:border-amber-800"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-stone-400 mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 w-28">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span className="animate-pulse">Fundamentando...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-2.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder={
                      activeOralExam && !activeOralExam.userAnswer
                        ? "Escribí tu exposición oral para el tribunal..."
                        : "Preguntale a Héctor sobre este apunte o autor..."
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-amber-500 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    aria-label="Enviar mensaje a Héctor"
                    className={`p-2.5 rounded-xl transition-colors ${
                      inputValue.trim()
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
};
