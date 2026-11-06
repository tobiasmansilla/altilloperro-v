import React, { useState } from 'react';
import { PrivateTutor, University, Career } from '../types/academic';
import { 
  GraduationCap, 
  Star, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  MessageCircle, 
  Filter, 
  Percent, 
  PlusCircle, 
  Check, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface TutorsMarketplaceProps {
  tutors: PrivateTutor[];
  onAddTutor: (tutor: PrivateTutor) => void;
  currentUserUniversity?: University;
}

export const TutorsMarketplace: React.FC<TutorsMarketplaceProps> = ({
  tutors,
  onAddTutor,
  currentUserUniversity,
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<University | 'Todas'>(
    currentUserUniversity || 'Todas'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [bookingModalTutor, setBookingModalTutor] = useState<PrivateTutor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Apply Form State
  const [applyName, setApplyName] = useState('');
  const [applyUniversity, setApplyUniversity] = useState<University>('UBA');
  const [applyCareer, setApplyCareer] = useState<Career>('CBC (Ciclo Básico Común)');
  const [applySubject, setApplySubject] = useState('');
  const [applyCatedra, setApplyCatedra] = useState('');
  const [applyRate, setApplyRate] = useState(8500);
  const [applyBio, setApplyBio] = useState('');
  const [applyBadge, setApplyBadge] = useState('Profesor Particular Verificado');
  const [agreeCommission, setAgreeCommission] = useState(true);

  // Filter tutors
  const filteredTutors = tutors.filter((t) => {
    if (selectedUniversity !== 'Todas' && t.university !== selectedUniversity) return false;
    if (selectedSubject !== 'all') {
      const hasSubject = t.subjects.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));
      if (!hasSubject) return false;
    }
    return true;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applySubject.trim()) return;

    const newTutor: PrivateTutor = {
      id: `tutor-${Date.now()}`,
      name: applyName.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: applyUniversity,
      career: applyCareer,
      subjects: [applySubject.trim()],
      catedras: applyCatedra.trim() ? [applyCatedra.trim()] : ['Cátedra General'],
      hourlyRateARS: Number(applyRate) || 8000,
      platformCommissionPercent: 12,
      rating: 5.0,
      reviewsCount: 1,
      bio: applyBio.trim() || 'Docente universitario especializado en resolución de parciales.',
      modality: 'Online',
      availability: 'A coordinar con el alumno',
      badge: applyBadge.trim() || 'Nuevo Docente Altillo',
      whatsappDemo: '+5491122334455',
    };

    onAddTutor(newTutor);
    setShowApplyModal(false);
    // reset
    setApplyName('');
    setApplySubject('');
    setApplyBio('');
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalTutor(null);
    }, 2800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Red de Agentes Especializados & Profesores Particulares</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Clases Particulares & Asesores de Cátedra
          </h1>
          <p className="mt-2 text-stone-600 text-sm max-w-2xl leading-relaxed">
            ¿Te cuesta una materia filtro? Conectá con docentes y estudiantes avanzados que ya aprobaron o dieron clase en esa misma cátedra.
          </p>
        </div>

        {/* Action: Postularse como docente */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Publicitá tus clases como Agente</span>
          </button>
        </div>
      </div>

      {/* Transparent Commission & Student Protection Notice */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm">
              Modelo de Comisión Transparente del 12%
            </h4>
            <p className="text-stone-600 mt-0.5 leading-relaxed">
              Altillo retiene una comisión fija del 12% sobre el valor de la clase reservada. A cambio, los alumnos obtienen <strong>Garantía de Satisfacción</strong> (si el profesor no asiste o la clase no cumple el programa, te reintegramos el 100%) y los docentes reciben alumnos verificados sin costo mensual de suscripción.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Garantía Altillo Asegurada</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Universidad:
          </span>
          {(['Todas', 'UBA', 'UTN', 'UNLP'] as const).map((uni) => (
            <button
              key={uni}
              onClick={() => setSelectedUniversity(uni)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedUniversity === uni
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {uni}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500">
          {filteredTutors.length} profesores disponibles
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => {
          const commissionAmount = Math.round(tutor.hourlyRateARS * (tutor.platformCommissionPercent / 100));
          const netTutor = tutor.hourlyRateARS - commissionAmount;

          return (
            <article
              key={tutor.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between shadow-xs hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                
                {/* Header Profile */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-stone-100 group-hover:border-amber-400 transition-colors shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif text-base font-bold text-stone-900 truncate">
                        {tutor.name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        {tutor.rating}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 truncate mt-0.5">
                      <span>{tutor.university}</span> · <span>{tutor.career}</span>
                    </div>

                    {tutor.badge && (
                      <span className="inline-block text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-1 truncate max-w-full">
                        {tutor.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-stone-600 leading-relaxed mb-3.5 line-clamp-3">
                  {tutor.bio}
                </p>

                {/* Specialties / Cátedras */}
                <div className="mb-4 text-xs space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <div className="text-[11px] font-medium text-stone-500">
                    Materias & Cátedras que prepara:
                  </div>
                  <div className="font-semibold text-stone-800">
                    {tutor.subjects.join(', ')}
                  </div>
                  <div className="text-[11px] text-stone-500 italic">
                    {tutor.catedras.join(' · ')}
                  </div>
                </div>

              </div>

              {/* Pricing & Booking CTA */}
              <div className="pt-3.5 border-t border-stone-100 flex items-end justify-between gap-2">
                <div>
                  <div className="text-xs text-stone-400">Tarifa por hora</div>
                  <div className="text-base font-bold text-stone-900">
                    ${tutor.hourlyRateARS.toLocaleString('es-AR')}
                    <span className="text-xs font-normal text-stone-500 ml-0.5">/hr</span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Comisión Altillo 12%: ${commissionAmount}
                  </div>
                </div>

                <button
                  onClick={() => setBookingModalTutor(tutor)}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Solicitar Clase</span>
                </button>
              </div>

            </article>
          );
        })}
      </div>

      {/* Booking Modal */}
      {bookingModalTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setBookingModalTutor(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  ¡Solicitud enviada con éxito!
                </h3>
                <p className="text-xs text-stone-600 mb-2">
                  Nos comunicamos con <strong>{bookingModalTutor.name}</strong> para coordinar tu clase.
                </p>
                <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 border border-stone-200">
                  Comisión asegurada del 12% por la garantía de aprobación Altillo.
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                  <img
                    src={bookingModalTutor.avatar}
                    alt={bookingModalTutor.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      Clase con {bookingModalTutor.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {bookingModalTutor.university} · {bookingModalTutor.subjects[0]}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-stone-700 mb-5">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Valor de la hora:</span>
                    <strong className="text-stone-900">${bookingModalTutor.hourlyRateARS.toLocaleString('es-AR')} ARS</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Comisión Altillo (12%):</span>
                    <span>${Math.round(bookingModalTutor.hourlyRateARS * 0.12).toLocaleString('es-AR')} ARS</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Modalidad:</span>
                    <strong className="text-emerald-700">{bookingModalTutor.modality}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Disponibilidad habitual:</span>
                    <span>{bookingModalTutor.availability}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 mb-5">
                  🛡️ <strong>Garantía Estudiantil:</strong> Tu pago queda retenido hasta que finalice la primera hora de clase y confirmes tu total conformidad.
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Solicitud de Clase</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply as Tutor Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Publicitá tus Clases en Altillo Moderno
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Llegá a miles de estudiantes de UBA, UTN y facultades de todo el país que buscan ayuda para sus parciales.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre Completo y Título/Año de Carrera *</label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Julián Morales (Docente de IPC)"
                  value={applyName}
                  onChange={(e) => setApplyName(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Universidad *</label>
                  <select
                    value={applyUniversity}
                    onChange={(e) => setApplyUniversity(e.target.value as University)}
                    className="w-full p-2 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="UBA">UBA</option>
                    <option value="UTN">UTN</option>
                    <option value="UNLP">UNLP</option>
                    <option value="UNC">UNC</option>
                    <option value="UADE">UADE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarifa por hora ($ARS) *</label>
                  <input
                    type="number"
                    min="2000"
                    step="500"
                    value={applyRate}
                    onChange={(e) => setApplyRate(Number(e.target.value))}
                    required
                    className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Materia Principal *</label>
                  <input
                    type="text"
                    placeholder="Ej: Sociedad y Estado (ICSE)"
                    value={applySubject}
                    onChange={(e) => setApplySubject(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cátedras de Especialidad</label>
                  <input
                    type="text"
                    placeholder="Ej: Cátedra Pedrosa / Romero"
                    value={applyCatedra}
                    onChange={(e) => setApplyCatedra(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Breve Reseña / Experiencia Docente</label>
                <textarea
                  rows={2}
                  placeholder="Contá cómo dictás las clases, qué material entregás y tu metodología..."
                  value={applyBio}
                  onChange={(e) => setApplyBio(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeCommission}
                    onChange={(e) => setAgreeCommission(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-[11px] text-stone-600 leading-tight">
                    Acepto el esquema de <strong>comisión del 12% por clase reservada</strong> a través de Altillo. No pago nada por adelantado y recibo el pago garantizado tras finalizar la sesión.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!agreeCommission}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow-xs"
                >
                  Publicar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
