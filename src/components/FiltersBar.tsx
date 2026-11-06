import React from 'react';
import { University, Career, DocumentType } from '../types/academic';
import { Filter, RotateCcw } from 'lucide-react';

interface FiltersBarProps {
  selectedUniversity: University | 'Todas';
  setSelectedUniversity: (u: University | 'Todas') => void;
  selectedCareer: Career | 'Todas';
  setSelectedCareer: (c: Career | 'Todas') => void;
  selectedType: DocumentType | 'todos';
  setSelectedType: (t: DocumentType | 'todos') => void;
  selectedSort: 'popular' | 'rating' | 'recent';
  setSelectedSort: (s: 'popular' | 'rating' | 'recent') => void;
  totalResults: number;
  onResetFilters: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedUniversity,
  setSelectedUniversity,
  selectedCareer,
  setSelectedCareer,
  selectedType,
  setSelectedType,
  selectedSort,
  setSelectedSort,
  totalResults,
  onResetFilters,
}) => {
  const universities: (University | 'Todas')[] = ['Todas', 'UBA', 'UTN', 'UNLP', 'UNC'];
  const careers: (Career | 'Todas')[] = [
    'Todas',
    'CBC (Ciclo Básico Común)',
    'Medicina',
    'Derecho',
    'Ingeniería',
    'Psicología',
    'Ciencias Económicas',
  ];
  const types: { value: DocumentType | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'resumen', label: 'Resúmenes' },
    { value: 'primer_parcial', label: '1er Parcial' },
    { value: 'segundo_parcial', label: '2do Parcial' },
    { value: 'final', label: 'Finales' },
  ];

  const hasActiveFilters =
    selectedUniversity !== 'Todas' ||
    selectedCareer !== 'Todas' ||
    selectedType !== 'todos';

  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-200/90 dark:border-stone-800 py-4 px-4 sm:px-6 lg:px-8 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto space-y-3.5">
        
        {/* Main Segmented Row: University & Career */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Universities filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              Universidad:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {universities.map((uni) => (
                <button
                  key={uni}
                  onClick={() => setSelectedUniversity(uni)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedUniversity === uni
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>

          {/* Document Types Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0">
              Formato:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedType === t.value
                      ? 'bg-amber-600 text-white shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Second Row: Careers Scroll & Results Counter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-stone-100 dark:border-stone-800">
          
          {/* Career Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-xs font-medium text-stone-400 shrink-0">Carrera:</span>
            {careers.map((car) => {
              const isSelected = selectedCareer === car;
              return (
                <button
                  key={car}
                  onClick={() => setSelectedCareer(car)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {car}
                </button>
              );
            })}
          </div>

          {/* Sort & Reset */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs text-stone-600 dark:text-stone-400">
            <span className="text-stone-500 dark:text-stone-400">
              {totalResults} {totalResults === 1 ? 'documento encontrado' : 'documentos encontrados'}
            </span>

            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="text-stone-400">Ordenar por:</label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as 'popular' | 'rating' | 'recent')}
                className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="popular">Más leídos</option>
                <option value="rating">Mejor calificación</option>
                <option value="recent">Más recientes</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  title="Restablecer filtros"
                  className="flex items-center gap-1 px-2 py-1 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
