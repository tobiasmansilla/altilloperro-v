import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Search, 
  Upload, 
  GraduationCap, 
  MessageSquare, 
  FileCheck2,
  Menu,
  X,
  Users,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { StudentUser } from '../types/academic';

interface NavbarProps {
  activeTab: 'explorar' | 'parciales' | 'catedras' | 'tutores' | 'mochila';
  setActiveTab: (tab: 'explorar' | 'parciales' | 'catedras' | 'tutores' | 'mochila') => void;
  savedCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenContributeModal: () => void;
  currentUser: StudentUser | null;
  onOpenRegisterModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  searchQuery,
  setSearchQuery,
  onOpenContributeModal,
  currentUser,
  onOpenRegisterModal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-amber-600/90 text-amber-50 text-xs py-1 px-4 text-center font-medium tracking-wide">
        <span>El clásico altillo.com renovado · Apuntes universitarios simplificados, exámenes resueltos y agentes especializados</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('explorar')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                    Altillo
                  </span>
                  <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded text-[10px]">
                    Moderno
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-none hidden sm:block">
                  Comunidad Académica Universitaria
                </p>
              </div>
            </button>
          </div>

          {/* Search bar in header */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar materia, cátedra, tema o examen (ej: ICSE, Stewart, Freud)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/90 text-stone-100 placeholder-stone-400 text-sm rounded-lg pl-9 pr-4 py-2 border border-stone-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explorar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'explorar'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Resúmenes
              </span>
            </button>

            <button
              onClick={() => setActiveTab('parciales')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'parciales'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Banco de Parciales
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catedras')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'catedras'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Cátedras
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tutores')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tutores'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Agentes / Clases
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mochila')}
              className={`px-3 py-2 rounded-md text-sm font-medium relative transition-colors ${
                activeTab === 'mochila'
                  ? 'bg-stone-800 text-amber-400 font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                Mi Mochila
                {savedCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-stone-950 text-xs px-1.5 py-0.2 rounded-full font-bold">
                    {savedCount}
                  </span>
                )}
              </span>
            </button>
          </nav>

          {/* Action Button: Dark/Light Mode, Subir Apunte & User Status */}
          <div className="flex items-center gap-2">
            
            {/* Global Light / Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-300" />
              )}
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 text-stone-200 text-xs border border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold max-w-[100px] truncate">{currentUser.name}</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1 rounded">PRO</span>
              </div>
            ) : (
              <button
                onClick={onOpenRegisterModal}
                className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 hover:text-white bg-amber-950/70 hover:bg-amber-900 px-2.5 py-1.5 rounded-lg border border-amber-800/70 transition-colors"
                title="Activá a Héctor IA con tu apoyo SEO"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pase Pro Solidario</span>
              </button>
            )}

            <button
              onClick={onOpenContributeModal}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <Upload className="w-4 h-4" />
              <span>Aportar Apunte</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar materia, cátedra o tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 text-sm rounded-lg pl-9 pr-4 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-800 py-3 space-y-1">
            <button
              onClick={() => { setActiveTab('explorar'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'explorar' ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Resúmenes y Apuntes
            </button>
            <button
              onClick={() => { setActiveTab('parciales'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'parciales' ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800/40'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Banco de Parciales y Exámenes
            </button>
            <button
              onClick={() => { setActiveTab('catedras'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'catedras' ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800/40'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Opiniones de Cátedras
            </button>
            <button
              onClick={() => { setActiveTab('tutores'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'tutores' ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800/40'
              }`}
            >
              <Users className="w-4 h-4" />
              Agentes / Profesores Particulares
            </button>
            <button
              onClick={() => { setActiveTab('mochila'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'mochila' ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800/40'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4" />
                Mi Mochila Guardada
              </span>
              {savedCount > 0 && (
                <span className="bg-amber-500 text-stone-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {!currentUser && (
              <button
                onClick={() => { onOpenRegisterModal(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Pase Pro Solidario (Héctor IA)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
