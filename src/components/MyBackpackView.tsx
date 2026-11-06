import React from 'react';
import { AcademicDocument } from '../types/academic';
import { DocumentCard } from './DocumentCard';
import { 
  Bookmark, 
  BookOpen, 
  Clock, 
  Trash2, 
  FileCheck2, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface MyBackpackViewProps {
  savedDocuments: AcademicDocument[];
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  likedDocs: Record<string, boolean>;
  onSelectDocument: (doc: AcademicDocument) => void;
  onExploreMore: () => void;
}

export const MyBackpackView: React.FC<MyBackpackViewProps> = ({
  savedDocuments,
  onToggleSave,
  onToggleLike,
  likedDocs,
  onSelectDocument,
  onExploreMore,
}) => {
  const totalReadTime = savedDocuments.reduce((acc, d) => acc + d.readTimeMinutes, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Colección Personal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Mi Mochila de Estudio
          </h1>
          <p className="mt-2 text-stone-600 text-sm max-w-xl">
            Tus apuntes y parciales guardados para repasar antes del examen, disponibles rápidamente para imprimir o leer en pantalla completa.
          </p>
        </div>

        {savedDocuments.length > 0 && (
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block">Guardados</span>
              <strong className="text-stone-900 text-base">{savedDocuments.length}</strong>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <span className="text-stone-400 block">Tiempo de lectura</span>
              <strong className="text-stone-900 text-base flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {totalReadTime} min
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedDocuments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Tu mochila todavía está vacía
          </h3>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            Explorá el catálogo de materias y hacé clic en el ícono de marcador <Bookmark className="w-3.5 h-3.5 inline text-amber-600" /> para guardar resúmenes y exámenes que necesitás para tus fechas de parcial.
          </p>
          <button
            onClick={onExploreMore}
            className="px-5 py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorar apuntes destacados</span>
          </button>
        </div>
      ) : (
        /* Document Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isSaved={true}
              onToggleSave={onToggleSave}
              onToggleLike={onToggleLike}
              hasLiked={likedDocs[doc.id] || false}
              onSelectDocument={onSelectDocument}
            />
          ))}
        </div>
      )}

    </div>
  );
};
