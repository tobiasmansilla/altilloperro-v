import React, { useState } from 'react';
import { AcademicDocument, Career, DocumentType, University } from '../types/academic';
import { X, Upload, Sparkles, Check } from 'lucide-react';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: AcademicDocument) => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [catedra, setCatedra] = useState('');
  const [career, setCareer] = useState<Career>('CBC (Ciclo Básico Común)');
  const [university, setUniversity] = useState<University>('UBA');
  const [type, setType] = useState<DocumentType>('resumen');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [contentParagraphs, setContentParagraphs] = useState('');
  const [professorTip, setProfessorTip] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectName.trim() || !catedra.trim() || !contentParagraphs.trim()) {
      return;
    }

    const paragraphs = contentParagraphs
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newDoc: AcademicDocument = {
      id: `doc-custom-${Date.now()}`,
      title: title.trim(),
      subjectId: subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subjectName: subjectName.trim(),
      career,
      university,
      type,
      catedra: catedra.trim(),
      year: new Date().getFullYear(),
      cuatrimestre: '1C',
      author: author.trim() || 'Estudiante Solidario',
      verified: true,
      rating: 5.0,
      likesCount: 1,
      readTimeMinutes: Math.max(3, Math.round(contentParagraphs.split(/\s+/).length / 150)),
      summary: summary.trim() || 'Apunte colaborativo aportado por la comunidad estudiantil.',
      tags: tags.length > 0 ? tags : ['Colaborativo', 'Comunidad'],
      createdAt: new Date().toISOString().split('T')[0],
      sections: [
        {
          id: 'sec-custom-1',
          title: '1. Desarrollo Principal del Apunte',
          paragraphs: paragraphs.length > 0 ? paragraphs : ['Contenido del apunte ingresado.'],
          professorTip: professorTip.trim() || undefined,
        },
      ],
    };

    onAddDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="font-serif text-lg font-bold">
                Aportar Apunte o Examen a Altillo
              </h2>
              <p className="text-xs text-stone-400">
                Ayudá a otros estudiantes compartiendo tus resúmenes o parciales resueltos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="text-stone-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Universidad *
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value as University)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
              >
                <option value="UBA">UBA (Universidad de Buenos Aires)</option>
                <option value="UTN">UTN (Universidad Tecnológica Nacional)</option>
                <option value="UNLP">UNLP (Universidad Nacional de La Plata)</option>
                <option value="UNC">UNC (Universidad Nacional de Córdoba)</option>
                <option value="UADE">UADE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Carrera o Ciclo *
              </label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value as Career)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
              >
                <option value="CBC (Ciclo Básico Común)">CBC (Ciclo Básico Común)</option>
                <option value="Medicina">Medicina</option>
                <option value="Derecho">Derecho</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Psicología">Psicología</option>
                <option value="Ciencias Económicas">Ciencias Económicas</option>
                <option value="Ciencias Exactas">Ciencias Exactas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nombre de la Materia *
              </label>
              <input
                type="text"
                placeholder="Ej: Álgebra, Bioquímica, ICSE..."
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cátedra o Profesor Titular *
              </label>
              <input
                type="text"
                placeholder="Ej: Cátedra Gentile, Buacar..."
                value={catedra}
                onChange={(e) => setCatedra(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tipo de Recurso *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
              >
                <option value="resumen">Resumen de Lectura / Teórico</option>
                <option value="primer_parcial">1er Parcial Resuelto</option>
                <option value="segundo_parcial">2do Parcial Resuelto</option>
                <option value="final">Examen Final Resuelto</option>
                <option value="guia_ejercicios">Guía de Ejercicios Prácticos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tu Nombre o Alias
              </label>
              <input
                type="text"
                placeholder="Ej: Martín_UBA"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Título Descriptivo del Documento *
            </label>
            <input
              type="text"
              placeholder="Ej: Resumen Integral de Unidades 1 a 4 con Esquemas Mnemotécnicos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Resumen Breve (1 o 2 oraciones introductorias)
            </label>
            <input
              type="text"
              placeholder="De qué trata este apunte y a quién le sirve..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Desarrollo del Apunte o Enunciado / Resolución *
            </label>
            <textarea
              rows={5}
              placeholder="Escribí los conceptos clave, fórmulas o desarrollo paso a paso del examen. Separá párrafos con saltos de línea..."
              value={contentParagraphs}
              onChange={(e) => setContentParagraphs(e.target.value)}
              required
              className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tip del Estudiante / Alerta de Parcial (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: ¡Atención con este tema porque siempre lo toman en el oral!"
              value={professorTip}
              onChange={(e) => setProfessorTip(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Etiquetas separadas por comas (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: CBC, Parcial, Teórico, Fórmulas"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Publicar en Altillo</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
