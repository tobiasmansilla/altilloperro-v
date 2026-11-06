import React, { useState, useEffect, useMemo } from 'react';
import { 
  AcademicDocument, 
  University, 
  Career, 
  DocumentType, 
  CatedraReview, 
  SubjectSummary,
  PrivateTutor,
  StudentUser
} from './types/academic';
import { allDocuments, allSubjects, catedraReviews, allTutors } from './data/mockData';
import { filterAndSortDocuments } from './utils/academic';
import { Navbar } from './components/Navbar';
import { FiltersBar } from './components/FiltersBar';
import { DocumentCard } from './components/DocumentCard';
import { ReaderView } from './components/ReaderView';
import { ExamViewer } from './components/ExamViewer';
import { CatedraReviewsView } from './components/CatedraReviewsView';
import { MyBackpackView } from './components/MyBackpackView';
import { ContributeModal } from './components/ContributeModal';
import { TutorsMarketplace } from './components/TutorsMarketplace';
import { HectorAI } from './components/HectorAI';
import { RegistrationModal } from './components/RegistrationModal';
import { 
  BookOpen, 
  FileCheck2, 
  Sparkles, 
  GraduationCap, 
  Check, 
  ArrowRight,
  Search,
  BookMarked,
  Users
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'explorar' | 'parciales' | 'catedras' | 'tutores' | 'mochila'>('explorar');
  const [selectedDocument, setSelectedDocument] = useState<AcademicDocument | null>(null);
  const [isExamMode, setIsExamMode] = useState<boolean>(false);

  // User Registration State (Solidario SEO)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem('altillo_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Global Light / Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('altillo_dark_mode');
      if (stored !== null) return stored === 'true';
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('altillo_dark_mode', String(isDarkMode));
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Data State with LocalStorage Persistence
  const [documents, setDocuments] = useState<AcademicDocument[]>(() => {
    try {
      const stored = localStorage.getItem('altillo_custom_docs');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...allDocuments, ...parsed];
      }
    } catch {
      // fallback
    }
    return allDocuments;
  });

  const [tutors, setTutors] = useState<PrivateTutor[]>(() => {
    try {
      const stored = localStorage.getItem('altillo_custom_tutors');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...allTutors, ...parsed];
      }
    } catch {
      // fallback
    }
    return allTutors;
  });

  const [savedDocIds, setSavedDocIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('altillo_saved_ids');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['icse-resumen-estado']; // default demo saved
  });

  const [likedDocIds, setLikedDocIds] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('altillo_liked_ids');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {};
  });

  const [reviews, setReviews] = useState<CatedraReview[]>(() => {
    try {
      const stored = localStorage.getItem('altillo_reviews');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return catedraReviews;
  });

  const [likedReviewIds, setLikedReviewIds] = useState<Record<string, boolean>>({});

  // Filter States
  const [selectedUniversity, setSelectedUniversity] = useState<University | 'Todas'>('Todas');
  const [selectedCareer, setSelectedCareer] = useState<Career | 'Todas'>('Todas');
  const [selectedType, setSelectedType] = useState<DocumentType | 'todos'>('todos');
  const [selectedSort, setSelectedSort] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Feedback
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('altillo_saved_ids', JSON.stringify(savedDocIds));
    } catch {
      // ignore
    }
  }, [savedDocIds]);

  useEffect(() => {
    try {
      localStorage.setItem('altillo_liked_ids', JSON.stringify(likedDocIds));
    } catch {
      // ignore
    }
  }, [likedDocIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // User Registration Handler
  const handleRegisterSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('altillo_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    showToast(`¡Bienvenido ${user.name}! Pase Pro y Héctor IA activados con éxito.`);
  };

  // Tutor Add Handler
  const handleAddTutor = (newTutor: PrivateTutor) => {
    const updated = [newTutor, ...tutors];
    setTutors(updated);
    try {
      const customOnly = updated.filter((t) => t.id.startsWith('tutor-custom-'));
      localStorage.setItem('altillo_custom_tutors', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
    showToast('¡Tu perfil docente ha sido publicado en Altillo!');
  };

  // Document Like Toggle
  const handleToggleLike = (id: string) => {
    setLikedDocIds((prev) => {
      const isLiked = !prev[id];
      const updated = { ...prev, [id]: isLiked };

      setDocuments((docs) =>
        docs.map((d) => {
          if (d.id === id) {
            return {
              ...d,
              likesCount: d.likesCount + (isLiked ? 1 : -1),
            };
          }
          return d;
        })
      );

      if (isLiked) {
        showToast('¡Gracias por apoyar este apunte!');
      }

      return updated;
    });
  };

  // Document Save Toggle
  const handleToggleSave = (id: string) => {
    setSavedDocIds((prev) => {
      if (prev.includes(id)) {
        showToast('Apunte quitado de tu mochila');
        return prev.filter((i) => i !== id);
      } else {
        showToast('¡Apunte guardado en tu mochila!');
        return [...prev, id];
      }
    });
  };

  // Add Review
  const handleAddReview = (newReview: Omit<CatedraReview, 'id' | 'likes'>) => {
    const fullReview: CatedraReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      likes: 1,
    };
    const updated = [fullReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('altillo_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('¡Opinión de cátedra publicada con éxito!');
  };

  // Like Review
  const handleLikeReview = (reviewId: string) => {
    setLikedReviewIds((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Add Document
  const handleAddDocument = (newDoc: AcademicDocument) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    try {
      const customOnly = updated.filter((d) => d.id.startsWith('doc-custom-'));
      localStorage.setItem('altillo_custom_docs', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
    showToast('¡Tu apunte fue publicado en Altillo!');
  };

  // Open Document Detail
  const handleSelectDocument = (doc: AcademicDocument) => {
    setSelectedDocument(doc);
    const isExam = doc.type.includes('parcial') || doc.type === 'final';
    setIsExamMode(isExam && activeTab === 'parciales');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered documents calculation
  const filteredDocuments = useMemo(() => {
    // When on "parciales" tab, prioritize or filter to exam types unless user specified other
    const typeFilter = activeTab === 'parciales' && selectedType === 'todos' 
      ? 'primer_parcial' 
      : selectedType;

    return filterAndSortDocuments(documents, {
      university: selectedUniversity,
      career: selectedCareer,
      type: typeFilter,
      sortBy: selectedSort,
      query: searchQuery,
    });
  }, [documents, selectedUniversity, selectedCareer, selectedType, selectedSort, searchQuery, activeTab]);

  const savedDocuments = useMemo(() => {
    return documents.filter((d) => savedDocIds.includes(d.id));
  }, [documents, savedDocIds]);

  const resetFilters = () => {
    setSelectedUniversity('Todas');
    setSelectedCareer('Todas');
    setSelectedType('todos');
    setSearchQuery('');
  };

  // Quick subject jump helper
  const handleQuickJumpSubject = (subjectId: string) => {
    const matched = documents.find((d) => d.subjectId === subjectId);
    if (matched) {
      handleSelectDocument(matched);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 relative transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hector AI Assistant Widget (Always Accessible) */}
      <HectorAI
        currentDocument={selectedDocument}
        currentUser={currentUser}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        isAppDark={isDarkMode}
      />

      {/* Registration Modal (Viral SEO Marketing Model) */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        onAddDocument={handleAddDocument}
      />

      {/* View Branching: If Document Detail is Open */}
      {selectedDocument ? (
        isExamMode && selectedDocument.examQuestions ? (
          <ExamViewer
            document={selectedDocument}
            onBack={() => setSelectedDocument(null)}
            onOpenReader={() => setIsExamMode(false)}
          />
        ) : (
          <ReaderView
            document={selectedDocument}
            onBack={() => setSelectedDocument(null)}
            isSaved={savedDocIds.includes(selectedDocument.id)}
            onToggleSave={handleToggleSave}
            hasLiked={likedDocIds[selectedDocument.id] || false}
            onToggleLike={handleToggleLike}
            onOpenExamPractice={
              selectedDocument.examQuestions ? () => setIsExamMode(true) : undefined
            }
            onOpenHector={() => {
              if (!currentUser) setIsRegisterModalOpen(true);
            }}
            onOpenTutorMarketplace={() => {
              setSelectedDocument(null);
              setActiveTab('tutores');
            }}
            isAppDark={isDarkMode}
          />
        )
      ) : (
        /* Main Catalog & Tabs Layout */
        <>
          {/* Main Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'parciales') {
                setSelectedType('todos');
              }
            }}
            savedCount={savedDocIds.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenContributeModal={() => setIsContributeModalOpen(true)}
            currentUser={currentUser}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />

          {/* Hero Section (only on 'explorar' or 'parciales' without search query) */}
          {!searchQuery && (activeTab === 'explorar' || activeTab === 'parciales') && (
            <section className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-stone-100 py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
              <div className="max-w-5xl mx-auto text-center space-y-4">
                
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>El clásico repositorio universitario con lectura renovada</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
                  Apuntes simplificados y parciales resueltos, <span className="italic text-amber-300 font-normal">sin vueltas ni letra chica</span>.
                </h1>

                <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Resúmenes explicados paso a paso con advertencias de parcial, mnemotecnias docentes y banco de exámenes con resolución punto por punto.
                </p>

                {/* Quick jump popular subjects chips */}
                <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-stone-400 mr-1">Materias populares:</span>
                  <button
                    onClick={() => handleQuickJumpSubject('icse')}
                    className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-600/30 hover:border-amber-500/50 border border-stone-700 text-stone-200 transition-colors"
                  >
                    CBC · ICSE (Sociedad y Estado)
                  </button>
                  <button
                    onClick={() => handleQuickJumpSubject('ipc')}
                    className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-600/30 hover:border-amber-500/50 border border-stone-700 text-stone-200 transition-colors"
                  >
                    CBC · IPC (Popper vs Kuhn)
                  </button>
                  <button
                    onClick={() => handleQuickJumpSubject('analisis-1')}
                    className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-600/30 hover:border-amber-500/50 border border-stone-700 text-stone-200 transition-colors"
                  >
                    UTN / CBC · Análisis Matemático I
                  </button>
                  <button
                    onClick={() => handleQuickJumpSubject('anatomia-1')}
                    className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-600/30 hover:border-amber-500/50 border border-stone-700 text-stone-200 transition-colors"
                  >
                    Medicina UBA · Anatomía
                  </button>
                  <button
                    onClick={() => handleQuickJumpSubject('freud-1')}
                    className="px-3 py-1 rounded-full bg-stone-800 hover:bg-amber-600/30 hover:border-amber-500/50 border border-stone-700 text-stone-200 transition-colors"
                  >
                    Psicología UBA · Freud
                  </button>
                </div>

              </div>
            </section>
          )}

          {/* Main Content Body */}
          {activeTab === 'tutores' ? (
            <TutorsMarketplace
              tutors={tutors}
              onAddTutor={handleAddTutor}
              currentUserUniversity={currentUser?.university}
            />
          ) : activeTab === 'catedras' ? (
            <CatedraReviewsView
              reviews={reviews}
              subjects={allSubjects}
              onAddReview={handleAddReview}
              onLikeReview={handleLikeReview}
              likedReviews={likedReviewIds}
            />
          ) : activeTab === 'mochila' ? (
            <MyBackpackView
              savedDocuments={savedDocuments}
              onToggleSave={handleToggleSave}
              onToggleLike={handleToggleLike}
              likedDocs={likedDocIds}
              onSelectDocument={handleSelectDocument}
              onExploreMore={() => setActiveTab('explorar')}
            />
          ) : (
            /* Tab: Explorar or Parciales */
            <main className="flex-1">
              
              {/* Filters Bar */}
              <FiltersBar
                selectedUniversity={selectedUniversity}
                setSelectedUniversity={setSelectedUniversity}
                selectedCareer={selectedCareer}
                setSelectedCareer={setSelectedCareer}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                totalResults={filteredDocuments.length}
                onResetFilters={resetFilters}
              />

              {/* Cards Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header when searching */}
                {searchQuery && (
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-stone-600">
                      Resultados para: <strong className="text-stone-900">"{searchQuery}"</strong>
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-amber-700 hover:underline"
                    >
                      Borrar búsqueda
                    </button>
                  </div>
                )}

                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 max-w-lg mx-auto">
                    <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                      No se encontraron apuntes con esos filtros
                    </h3>
                    <p className="text-xs text-stone-500 mb-4">
                      Probá ajustando la universidad o carrera, o buscá por palabras clave generales.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg"
                    >
                      Restablecer todos los filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        isSaved={savedDocIds.includes(doc.id)}
                        onToggleSave={handleToggleSave}
                        onToggleLike={handleToggleLike}
                        hasLiked={likedDocIds[doc.id] || false}
                        onSelectDocument={handleSelectDocument}
                      />
                    ))}
                  </div>
                )}

              </div>
            </main>
          )}

          {/* Footer */}
          <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-10 px-4 sm:px-6 lg:px-8 mt-auto no-print">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
              
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="text-stone-200 font-semibold">Altillo Moderno</p>
                  <p className="text-stone-500">Hecho por y para la comunidad universitaria argentina y latinoamericana</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-stone-400">
                <span>UBA · UTN · UNLP · UNC</span>
                <span>·</span>
                <button
                  onClick={() => setActiveTab('tutores')}
                  className="hover:text-stone-200 transition-colors"
                >
                  Agentes & Profesores Particulares
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsContributeModalOpen(true)}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Aportar nuevo apunte
                </button>
              </div>

            </div>
          </footer>
        </>
      )}

    </div>
  );
}
