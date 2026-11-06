import React, { useState } from 'react';
import { CatedraReview, SubjectSummary } from '../types/academic';
import { 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';

interface CatedraReviewsViewProps {
  reviews: CatedraReview[];
  subjects: SubjectSummary[];
  onAddReview: (newReview: Omit<CatedraReview, 'id' | 'likes'>) => void;
  onLikeReview: (reviewId: string) => void;
  likedReviews: Record<string, boolean>;
}

export const CatedraReviewsView: React.FC<CatedraReviewsViewProps> = ({
  reviews,
  subjects,
  onAddReview,
  onLikeReview,
  likedReviews,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || 'icse');
  const [formCatedra, setFormCatedra] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formVerdict, setFormVerdict] = useState<CatedraReview['verdict']>('Recomendada');
  const [formExamType, setFormExamType] = useState<CatedraReview['examType']>('Multiple Choice');
  const [formText, setFormText] = useState('');
  const [formTip, setFormTip] = useState('');

  const filteredReviews = selectedSubjectId === 'all'
    ? reviews
    : reviews.filter((r) => r.subjectId === selectedSubjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatedra.trim() || !formText.trim()) return;

    onAddReview({
      subjectId: formSubjectId,
      catedra: formCatedra.trim(),
      author: formAuthor.trim() || 'Estudiante anónimo',
      year: new Date().getFullYear(),
      verdict: formVerdict,
      examType: formExamType,
      text: formText.trim(),
      tips: formTip.trim() ? [formTip.trim()] : [],
    });

    // Reset and close
    setFormCatedra('');
    setFormText('');
    setFormTip('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Guía de Supervivencia Universitaria</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Opiniones de Cátedra & Profesores
          </h1>
          <p className="mt-2 text-stone-600 text-sm max-w-2xl">
            La verdad sobre cómo es cursar cada materia: nivel de exigencia, modalidad de examen (choice u oral) y consejos directos de estudiantes que ya la aprobaron.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 self-start md:self-auto transition-colors shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showAddForm ? 'Cerrar formulario' : 'Compartir mi experiencia'}</span>
        </button>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 p-6 mb-8 shadow-sm space-y-4"
        >
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b pb-2">
            Dejar consejo o reseña de cursada
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Materia</label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.university})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Cátedra o Profesor</label>
              <input
                type="text"
                placeholder="Ej: Cátedra Pedrosa / Romero"
                value={formCatedra}
                onChange={(e) => setFormCatedra(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Tu nombre o alias</label>
              <input
                type="text"
                placeholder="Ej: Nico_UBA"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Veredicto general</label>
              <select
                value={formVerdict}
                onChange={(e) => setFormVerdict(e.target.value as CatedraReview['verdict'])}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50"
              >
                <option value="Recomendada">Recomendada</option>
                <option value="Exigente pero clara">Exigente pero clara</option>
                <option value="Mucho práctico">Mucho práctico</option>
                <option value="Teórica">Teórica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              ¿Cómo fue la cursada y qué toman en los parciales?
            </label>
            <textarea
              rows={3}
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Contá cómo explican los profesores, qué bibliografía es obligatoria y qué temas toman sí o sí..."
              required
              className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Tip o advertencia de oro para el final / parcial (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Presten especial atención a los ejercicios de la unidad 2..."
              value={formTip}
              onChange={(e) => setFormTip(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Aporte</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter by subject */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <span className="text-xs font-medium text-stone-500 shrink-0">Filtrar por materia:</span>
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
            selectedSubjectId === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          Todas las materias
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubjectId(sub.id)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              selectedSubjectId === sub.id
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => {
          const isLiked = likedReviews[rev.id];
          const matchedSubject = subjects.find((s) => s.id === rev.subjectId);

          return (
            <article
              key={rev.id}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-amber-400/80 transition-colors"
            >
              <div>
                
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                      {matchedSubject?.name || 'Materia Universitaria'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {rev.catedra}
                    </h3>
                  </div>

                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                    {rev.verdict}
                  </span>
                </div>

                {/* Body review */}
                <p className="text-sm text-stone-700 leading-relaxed mb-4">
                  "{rev.text}"
                </p>

                {/* Tips bullets */}
                {rev.tips && rev.tips.length > 0 && (
                  <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                    <strong className="text-stone-900 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Tips de cursada:
                    </strong>
                    {rev.tips.map((tip, tIdx) => (
                      <p key={tIdx} className="pl-2 border-l border-amber-400">
                        {tip}
                      </p>
                    ))}
                  </div>
                )}

              </div>

              {/* Footer info */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span>Por <strong>{rev.author}</strong> ({rev.year})</span>
                  <span>·</span>
                  <span>Examen: {rev.examType}</span>
                </div>

                <button
                  onClick={() => onLikeReview(rev.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                    isLiked
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{rev.likes + (isLiked ? 1 : 0)} útil</span>
                </button>
              </div>

            </article>
          );
        })}
      </div>

    </div>
  );
};
