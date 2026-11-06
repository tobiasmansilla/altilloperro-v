import React, { useState } from 'react';
import { AcademicDocument, ReadingPreferences } from '../types/academic';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Printer, 
  Share2, 
  Type, 
  BookOpen, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Highlighter, 
  Check, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { formatDocumentTypeLabel } from '../utils/academic';
import { StudyEnvironment } from './StudyEnvironment';

interface ReaderViewProps {
  document: AcademicDocument;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  hasLiked: boolean;
  onToggleLike: (id: string) => void;
  onOpenExamPractice?: () => void;
  onOpenHector: () => void;
  onOpenTutorMarketplace?: () => void;
  isAppDark?: boolean;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  document,
  onBack,
  isSaved,
  onToggleSave,
  hasLiked,
  onToggleLike,
  onOpenExamPractice,
  onOpenHector,
  onOpenTutorMarketplace,
  isAppDark = false,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'reading' | 'study'>('reading');

  // Reading preferences state: defaults to dark if app is dark, or paper
  const [preferences, setPreferences] = useState<ReadingPreferences>(() => ({
    theme: isAppDark ? 'dark' : 'paper',
    fontFamily: 'serif',
    fontSize: 'base',
  }));

  const [activeSectionId, setActiveSectionId] = useState<string>(
    document.sections[0]?.id || ''
  );

  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [highlighterActive, setHighlighterActive] = useState(false);
  const [highlighterColor, setHighlighterColor] = useState<'yellow' | 'green' | 'blue'>('yellow');
  const [userHighlights, setUserHighlights] = useState<Record<string, 'yellow' | 'green' | 'blue'>>({});

  // Explicit color palette per reading theme to prevent invisible white-on-white text
  const themeClasses = {
    paper: {
      container: 'bg-[#faf8f4] text-stone-900',
      panel: 'bg-[#f4efe8] border-stone-200 text-stone-800',
      callout: 'bg-[#f4ecd8] border-amber-600/40 text-stone-900',
      card: 'bg-white border-stone-200 text-stone-800',
      title: 'text-stone-900',
      heading: 'text-stone-900',
      lead: 'text-stone-700 border-amber-600',
      body: 'text-stone-800',
      muted: 'text-stone-600',
      kicker: 'text-amber-800',
      tableTh: 'bg-stone-100 text-stone-800 border-stone-200',
      tableTd: 'text-stone-800 border-stone-200 hover:bg-stone-50',
      sampleQ: 'border-stone-300 bg-white/90 text-stone-900',
      sampleAns: 'bg-amber-50 text-stone-800 border-stone-200',
    },
    clean: {
      container: 'bg-white text-stone-950',
      panel: 'bg-stone-50 border-stone-200 text-stone-900',
      callout: 'bg-amber-50/90 border-amber-500/50 text-stone-950',
      card: 'bg-white border-stone-200 text-stone-900',
      title: 'text-stone-950',
      heading: 'text-stone-900',
      lead: 'text-stone-700 border-amber-500',
      body: 'text-stone-800',
      muted: 'text-stone-600',
      kicker: 'text-amber-700',
      tableTh: 'bg-stone-50 text-stone-900 border-stone-200',
      tableTd: 'text-stone-800 border-stone-200 hover:bg-stone-50',
      sampleQ: 'border-stone-200 bg-stone-50 text-stone-950',
      sampleAns: 'bg-amber-50/70 text-stone-800 border-stone-200',
    },
    sepia: {
      container: 'bg-[#f5ebd7] text-[#332717]',
      panel: 'bg-[#eddcb9] border-[#d8be92] text-[#332717]',
      callout: 'bg-[#e5d2a9] border-[#b8955c] text-[#2c2112]',
      card: 'bg-[#f9f3e4] border-[#d8be92] text-[#332717]',
      title: 'text-[#2a1f12]',
      heading: 'text-[#332717]',
      lead: 'text-[#443625] border-[#b8955c]',
      body: 'text-[#3d3224]',
      muted: 'text-[#5c4a35]',
      kicker: 'text-[#8c5e24]',
      tableTh: 'bg-[#ebdec5] text-[#2a1f12] border-[#d8be92]',
      tableTd: 'text-[#3d3224] border-[#d8be92] hover:bg-[#eddcb9]',
      sampleQ: 'border-[#d8be92] bg-[#f9f3e4] text-[#2c2112]',
      sampleAns: 'bg-[#ebdec5] text-[#332717] border-[#d8be92]',
    },
    dark: {
      container: 'bg-[#141416] text-stone-100',
      panel: 'bg-stone-900 border-stone-800 text-stone-200',
      callout: 'bg-stone-900 border-amber-500/40 text-stone-100',
      card: 'bg-stone-900 border-stone-800 text-stone-200',
      title: 'text-white',
      heading: 'text-stone-100',
      lead: 'text-stone-300 border-amber-500',
      body: 'text-stone-200',
      muted: 'text-stone-400',
      kicker: 'text-amber-400',
      tableTh: 'bg-stone-800 text-stone-200 border-stone-700',
      tableTd: 'text-stone-200 border-stone-800 hover:bg-stone-800/60',
      sampleQ: 'border-stone-800 bg-stone-900 text-stone-100',
      sampleAns: 'bg-stone-800/80 text-stone-200 border-stone-700',
    },
  }[preferences.theme];

  const fontSizeClasses = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose',
  }[preferences.fontSize];

  const fontStyle = preferences.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleRevealQuestion = (secId: string) => {
    setRevealedQuestions((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  const toggleHighlightSection = (secId: string) => {
    if (!highlighterActive) return;
    setUserHighlights((prev) => {
      const copy = { ...prev };
      if (copy[secId] === highlighterColor) {
        delete copy[secId];
      } else {
        copy[secId] = highlighterColor;
      }
      return copy;
    });
  };

  const getHighlightStyle = (color?: 'yellow' | 'green' | 'blue') => {
    if (!color) return '';
    if (color === 'yellow') return 'bg-amber-200/50 rounded px-1 transition-colors';
    if (color === 'green') return 'bg-emerald-200/50 rounded px-1 transition-colors';
    return 'bg-sky-200/50 rounded px-1 transition-colors';
  };

  const isExam = document.type.includes('parcial') || document.type === 'final';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses.container}`}>
      
      {/* Sticky Reader Bar with controls */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors no-print ${themeClasses.panel}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Back button & academic breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver al catálogo de apuntes"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold hover:text-amber-600 transition-colors p-1 rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <div className={`text-xs font-medium hidden sm:flex items-center gap-1.5 ${themeClasses.muted}`}>
              <span>{document.subjectName}</span>
              <span aria-hidden="true">·</span>
              <span>{document.catedra}</span>
            </div>
          </div>

          {/* Controls: Theme, Font, Size, Highlighter, Print, Bookmark */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Highlighter selector */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setHighlighterActive(!highlighterActive)}
                title={highlighterActive ? "Desactivar resaltador" : "Activar modo resaltador de apuntes"}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  highlighterActive ? 'bg-amber-500 text-white font-bold' : 'hover:bg-black/5'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Resaltar</span>
              </button>

              {highlighterActive && (
                <div className="flex items-center gap-1 px-1">
                  <button
                    onClick={() => setHighlighterColor('yellow')}
                    title="Amarillo"
                    className={`w-4 h-4 rounded-full bg-amber-300 border ${highlighterColor === 'yellow' ? 'border-amber-700 ring-1 ring-amber-700' : 'border-transparent'}`}
                  />
                  <button
                    onClick={() => setHighlighterColor('green')}
                    title="Verde"
                    className={`w-4 h-4 rounded-full bg-emerald-300 border ${highlighterColor === 'green' ? 'border-emerald-700 ring-1 ring-emerald-700' : 'border-transparent'}`}
                  />
                  <button
                    onClick={() => setHighlighterColor('blue')}
                    title="Azul"
                    className={`w-4 h-4 rounded-full bg-sky-300 border ${highlighterColor === 'blue' ? 'border-sky-700 ring-1 ring-sky-700' : 'border-transparent'}`}
                  />
                </div>
              )}
            </div>

            {/* Typography Family Toggle (Serif / Sans) */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg text-xs">
              <button
                onClick={() => setPreferences((p) => ({ ...p, fontFamily: 'serif' }))}
                className={`px-2 py-1 rounded font-serif ${
                  preferences.fontFamily === 'serif' ? 'bg-white text-stone-900 shadow-xs font-bold' : ''
                }`}
                title="Tipografía Serif Editorial de lectura"
              >
                Serif
              </button>
              <button
                onClick={() => setPreferences((p) => ({ ...p, fontFamily: 'sans' }))}
                className={`px-2 py-1 rounded font-sans ${
                  preferences.fontFamily === 'sans' ? 'bg-white text-stone-900 shadow-xs font-bold' : ''
                }`}
                title="Tipografía Sans Moderna"
              >
                Sans
              </button>
            </div>

            {/* Font Size Selector (A- / A+) */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg text-xs">
              {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setPreferences((p) => ({ ...p, fontSize: sz }))}
                  className={`px-2 py-0.5 rounded font-mono ${
                    preferences.fontSize === sz ? 'bg-white text-stone-900 shadow-xs font-bold' : ''
                  }`}
                >
                  {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Background Theme Selector: Papel, Sepia, Blanco Puro, Noche */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setPreferences((p) => ({ ...p, theme: 'paper' }))}
                title="Modo Papel Marfil"
                className={`w-5 h-5 rounded-full bg-[#faf8f4] border border-stone-300 ${
                  preferences.theme === 'paper' ? 'ring-2 ring-amber-600' : ''
                }`}
              />
              <button
                onClick={() => setPreferences((p) => ({ ...p, theme: 'clean' }))}
                title="Modo Blanco Puro"
                className={`w-5 h-5 rounded-full bg-white border border-stone-400 ${
                  preferences.theme === 'clean' ? 'ring-2 ring-amber-600' : ''
                }`}
              />
              <button
                onClick={() => setPreferences((p) => ({ ...p, theme: 'sepia' }))}
                title="Modo Sepia Biblioteca"
                className={`w-5 h-5 rounded-full bg-[#f4ecd8] border border-amber-300 ${
                  preferences.theme === 'sepia' ? 'ring-2 ring-amber-600' : ''
                }`}
              />
              <button
                onClick={() => setPreferences((p) => ({ ...p, theme: 'dark' }))}
                title="Modo Noche"
                className={`w-5 h-5 rounded-full bg-[#18181b] border border-stone-700 ${
                  preferences.theme === 'dark' ? 'ring-2 ring-amber-500' : ''
                }`}
              />
            </div>

            {/* Print & Bookmark */}
            <button
              onClick={handlePrint}
              title="Imprimir o guardar PDF"
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyLink}
              title="Copiar enlace"
              className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleSave(document.id)}
              title={isSaved ? "Guardado en Mi Mochila" : "Guardar en Mi Mochila"}
              className={`p-1.5 rounded transition-colors ${
                isSaved ? 'text-amber-600' : 'hover:bg-black/5'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

          </div>

        </div>
      </div>

      {/* Main Content Layout with optional Table of Contents */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Sticky Table of Contents (Desktop) */}
          <aside className="lg:col-span-3 sticky top-20 hidden lg:block no-print">
            <div className={`p-4 rounded-xl border text-xs space-y-3 ${themeClasses.card}`}>
              <div className="font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-200/50">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Índice del Apunte</span>
              </div>
              <nav className="space-y-1">
                {document.sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`block py-1.5 px-2 rounded transition-colors ${
                      activeSectionId === sec.id
                        ? 'font-semibold text-amber-700 bg-amber-500/10'
                        : `${themeClasses.muted} hover:text-amber-600`
                    }`}
                  >
                    <span className="truncate block">
                      {idx + 1}. {sec.title.replace(/^[0-9.]+\s*/, '')}
                    </span>
                  </a>
                ))}

                {isExam && onOpenExamPractice && (
                  <button
                    onClick={onOpenExamPractice}
                    className="w-full text-left mt-3 py-2 px-2.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium flex items-center justify-between"
                  >
                    <span>Simulador de Parcial</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </nav>

              <div className="pt-3 border-t border-stone-200/50 text-[11px] text-stone-500">
                <p>💡 <em>Tip: Podés activar el resaltador en la barra superior para marcar partes clave.</em></p>
              </div>
            </div>
          </aside>

          {/* Center: Reading Document Paper */}
          <main className="lg:col-span-9 max-w-3xl mx-auto w-full">
            
            {/* Mode Switcher: Lectura vs Mesa de Estudio Interactiva */}
            <div className="mb-6 flex items-center gap-1.5 p-1.5 bg-stone-200/80 dark:bg-stone-800 rounded-xl no-print text-xs border border-stone-300/60 dark:border-stone-700">
              <button
                onClick={() => setActiveMainTab('reading')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMainTab === 'reading'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Modo Lectura (Apunte)</span>
              </button>

              <button
                onClick={() => setActiveMainTab('study')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMainTab === 'study'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Mesa de Estudio & Simulacro (Flashcards, Pomodoro, Quiz)</span>
              </button>
            </div>

            {activeMainTab === 'study' ? (
              <StudyEnvironment
                document={document}
                onOpenHector={onOpenHector}
                onOpenTutorMarketplace={onOpenTutorMarketplace}
              />
            ) : (
              <>
            {/* Document Header */}
            <header className="mb-8 pb-6 border-b border-stone-300/60">
              
              {/* Unboxed Metadata Header (Zero-Pill Rule) */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span className={`font-semibold ${themeClasses.kicker}`}>{document.university}</span>
                <span aria-hidden="true" className={themeClasses.muted}>·</span>
                <span className={themeClasses.muted}>{document.career}</span>
                <span aria-hidden="true" className={themeClasses.muted}>·</span>
                <span className={themeClasses.muted}>{document.subjectName}</span>
                <span aria-hidden="true" className={themeClasses.muted}>·</span>
                <span className={themeClasses.muted}>{formatDocumentTypeLabel(document.type)}</span>
                <span aria-hidden="true" className={themeClasses.muted}>·</span>
                <span className={themeClasses.muted}>Año {document.year} ({document.cuatrimestre})</span>
              </div>

              {/* Title: Pure theme heading color, never white-on-white */}
              <h1 className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${themeClasses.title}`}>
                {document.title}
              </h1>

              {/* Author and Cátedra Kicker */}
              <div className={`flex flex-wrap items-center justify-between gap-4 mt-4 text-xs sm:text-sm ${themeClasses.muted}`}>
                <div className="flex items-center gap-2">
                  <span>Cátedra: <strong className={themeClasses.title}>{document.catedra}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Aporte de: <strong className={themeClasses.title}>{document.author}</strong></span>
                  {document.verified && (
                    <span className="text-emerald-700 font-medium">✓ Verificado</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(document.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      hasLiked
                        ? 'border-rose-300 text-rose-600 bg-rose-50'
                        : 'border-stone-300 text-stone-700 hover:border-rose-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                    <span>{document.likesCount} estudiantes agradecidos</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary Box */}
              <div className={`mt-5 p-4 rounded-xl border ${themeClasses.callout}`}>
                <p className="text-xs sm:text-sm leading-relaxed">
                  <strong className={`font-semibold uppercase tracking-wider block mb-1 text-xs ${themeClasses.kicker}`}>
                    Síntesis del Apunte:
                  </strong>
                  {document.summary}
                </p>
              </div>

            </header>

            {/* Document Content Sections: All typography classes derive strictly from themeClasses */}
            <article className={`space-y-10 ${fontStyle}`}>
              {document.sections.map((section) => {
                const isHighlighted = userHighlights[section.id];
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    onClick={() => toggleHighlightSection(section.id)}
                    className={`scroll-mt-24 pb-6 transition-all rounded-lg ${
                      highlighterActive ? 'cursor-pointer hover:ring-1 hover:ring-amber-400 p-2' : ''
                    } ${getHighlightStyle(isHighlighted)}`}
                  >
                    {/* Section Heading: Dark in light themes, bright in dark theme */}
                    <h2 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${themeClasses.heading}`}>
                      {section.title}
                    </h2>

                    {/* Section Lead */}
                    {section.lead && (
                      <p className={`text-lg italic font-serif mb-4 pl-3 border-l-2 ${themeClasses.lead}`}>
                        {section.lead}
                      </p>
                    )}

                    {/* Paragraphs: Explicitly styled so white background gets dark text */}
                    <div className={`space-y-3.5 ${themeClasses.body} ${fontSizeClasses}`}>
                      {section.paragraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Key Takeaway / Idea Fuerza */}
                    {section.keyTakeaway && (
                      <div className="my-5 p-4 rounded-lg bg-amber-500/10 border-l-4 border-amber-500 text-sm sm:text-base font-medium">
                        <strong className={`block mb-1 text-xs uppercase tracking-wider font-sans ${themeClasses.kicker}`}>
                          💡 Idea Fuerza para el examen:
                        </strong>
                        <span className={themeClasses.body}>{section.keyTakeaway}</span>
                      </div>
                    )}

                    {/* Exam Alert Warning */}
                    {section.examWarning && (
                      <div className="my-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold block mb-0.5">Alerta de trampa común:</strong>
                          <span>{section.examWarning}</span>
                        </div>
                      </div>
                    )}

                    {/* Professor Tip */}
                    {section.professorTip && (
                      <div className="my-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold block mb-0.5">Consejo del ayudante de cátedra:</strong>
                          <span>{section.professorTip}</span>
                        </div>
                      </div>
                    )}

                    {/* Comparison Table */}
                    {section.comparison && (
                      <div className={`my-6 overflow-x-auto rounded-xl border ${themeClasses.card}`}>
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className={`border-b ${themeClasses.tableTh}`}>
                              <th className="py-2.5 px-4 font-semibold">Aspecto de análisis</th>
                              <th className={`py-2.5 px-4 font-semibold ${themeClasses.kicker}`}>{section.comparison.titleA}</th>
                              <th className="py-2.5 px-4 font-semibold">{section.comparison.titleB}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200/80">
                            {section.comparison.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={themeClasses.tableTd}>
                                <td className={`py-2.5 px-4 font-medium whitespace-nowrap ${themeClasses.muted}`}>{row.aspect}</td>
                                <td className="py-2.5 px-4">{row.conceptA}</td>
                                <td className="py-2.5 px-4">{row.conceptB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Sample Question with reveal button */}
                    {section.sampleQuestion && (
                      <div className={`my-6 p-4 rounded-xl border ${themeClasses.sampleQ}`}>
                        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ${themeClasses.kicker}`}>
                          <HelpCircle className="w-4 h-4" />
                          <span>Pregunta real de final / parcial:</span>
                        </div>
                        <p className={`font-medium text-sm sm:text-base mb-3 ${themeClasses.title}`}>
                          "{section.sampleQuestion.question}"
                        </p>
                        <button
                          onClick={() => toggleRevealQuestion(section.id)}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                        >
                          {revealedQuestions[section.id] ? 'Ocultar respuesta modelo' : 'Ver cómo responder correctamente para aprobar'}
                        </button>
                        {revealedQuestions[section.id] && (
                          <div className={`mt-3 pt-3 border-t p-3 rounded-lg text-xs sm:text-sm leading-relaxed ${themeClasses.sampleAns}`}>
                            <strong className={`block mb-1 font-semibold ${themeClasses.kicker}`}>Criterio de corrección del docente:</strong>
                            {section.sampleQuestion.correctApproach}
                          </div>
                        )}
                      </div>
                    )}

                  </section>
                );
              })}
            </article>

            {/* Bottom Actions & Community Callout */}
            <div className="mt-12 pt-8 border-t border-stone-300/60 no-print flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className={`text-xs ${themeClasses.muted}`}>
                ¿Encontraste un error o querés enriquecer este apunte? Podés enviar una sugerencia en el foro de la cátedra.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  Volver al listado
                </button>
                <button
                  onClick={() => onToggleSave(document.id)}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  {isSaved ? 'Guardado en Mochila' : 'Guardar para estudiar después'}
                </button>
              </div>
            </div>
            </>
            )}

          </main>
        </div>
      </div>

    </div>
  );
};
