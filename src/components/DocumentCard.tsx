import React from 'react';
import { AcademicDocument } from '../types/academic';
import { 
  Heart, 
  Bookmark, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  FileCheck2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatDocumentTypeLabel } from '../utils/academic';

interface DocumentCardProps {
  document: AcademicDocument;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onToggleLike: (id: string) => void;
  hasLiked: boolean;
  onSelectDocument: (doc: AcademicDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isSaved,
  onToggleSave,
  onToggleLike,
  hasLiked,
  onSelectDocument,
}) => {
  const isParcial = document.type.includes('parcial') || document.type === 'final';

  return (
    <article className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 dark:hover:border-amber-500/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group overflow-hidden">
      
      {/* Top Academic Line Kicker (Unboxed text with dots) */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300 truncate">
            <span className="font-semibold text-amber-700 dark:text-amber-400">{document.university}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="truncate">{document.career}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span>{document.year} ({document.cuatrimestre})</span>
          </div>

          {/* Bookmark Action */}
          <button
            onClick={() => onToggleSave(document.id)}
            aria-label={isSaved ? "Quitar de mi mochila" : "Guardar en mi mochila"}
            className={`p-1.5 rounded-md transition-colors ${
              isSaved
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectDocument(document)}
          className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-900 dark:group-hover:text-amber-300 cursor-pointer transition-colors line-clamp-2"
        >
          {document.title}
        </h3>

        {/* Cátedra & Type subtitle */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-800 dark:text-stone-200">{document.subjectName}</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">/</span>
          <span className="text-stone-600 dark:text-stone-400 italic">{document.catedra}</span>
        </div>

        {/* Summary text */}
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
          {document.summary}
        </p>

        {/* Key Tips or Highlight Preview */}
        {document.sections[0]?.professorTip && (
          <div className="mt-3.5 p-2.5 bg-amber-50/70 dark:bg-amber-950/40 border-l-2 border-amber-500 rounded-r text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="font-semibold text-amber-900 dark:text-amber-300">Tip de examen:</strong> {document.sections[0].professorTip}
            </span>
          </div>
        )}
      </div>

      {/* Footer Meta & CTA */}
      <div className="px-5 py-3.5 bg-stone-50/70 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        
        {/* Left: Author & read time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
            <span>Aporte de <strong className="text-stone-800 dark:text-stone-200">{document.author}</strong></span>
            {document.verified && (
              <span title="Apunte verificado por la comunidad" className="inline-flex items-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </span>
            )}
          </div>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{document.readTimeMinutes} min</span>
          </div>
        </div>

        {/* Right: Like and Read Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLike(document.id)}
            aria-label={`${document.likesCount} me gusta`}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              hasLiked ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 font-semibold' : 'text-stone-500 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{document.likesCount}</span>
          </button>

          <button
            onClick={() => onSelectDocument(document)}
            className="flex items-center gap-1 bg-stone-900 dark:bg-stone-100 hover:bg-amber-600 dark:hover:bg-amber-500 text-stone-50 dark:text-stone-950 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-xs"
          >
            {isParcial ? (
              <>
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Ver Examen</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Leer Apunte</span>
              </>
            )}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </article>
  );
};
