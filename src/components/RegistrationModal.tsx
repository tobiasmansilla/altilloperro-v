import React, { useState } from 'react';
import { StudentUser, University, Career } from '../types/academic';
import { 
  X, 
  Sparkles, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  HeartHandshake,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: StudentUser) => void;
  initialReason?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  initialReason,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState<University>('UBA');
  const [career, setCareer] = useState<Career>('CBC (Ciclo Básico Común)');
  const [selectedSeoAction, setSelectedSeoAction] = useState<StudentUser['seoActionCompleted']>('whatsapp_group');
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);

  const shareTextWhatsApp = `¡Buenas! Les comparto este repositorio renovado de apuntes, resúmenes y exámenes resueltos de la facultad: https://altillo-moderno.edu.ar (¡tiene hasta simuladores de parcial!). Re sirve para la cursada 🙌📚`;

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(shareTextWhatsApp);
    setCopiedShareText(true);
    setActionConfirmed(true);
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: StudentUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      university,
      career,
      seoActionCompleted: selectedSeoAction,
      seoDetails: `Acción solidaria SEO completada: ${selectedSeoAction}`,
      registeredAt: new Date().toISOString(),
    };

    onRegisterSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-title"
      >
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 relative">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Pase Estudiantil Pro · Registro Solidario SEO</span>
          </div>
          <h2 id="reg-title" className="font-serif text-2xl font-bold text-white">
            Unite a Altillo sin pagar un solo peso
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            {initialReason || 'Desbloqueá a Héctor IA, el tutor virtual de tus apuntes con memoria en caché y todas las herramientas de estudio.'}
          </p>

          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Marketing Explanation & SEO Concept */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>¿Por qué es gratuito?</strong> Creemos en el acceso abierto al conocimiento universitario. En lugar de cobrarte una suscripción, te pedimos un apoyo simbólico de difusión digital (SEO y boca a boca) para ganarle en Google a las academias que cobran fortunas por apuntes.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Step 1: User data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tu Nombre o Alias Universitario *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sofía Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  placeholder="tuemail@estudiantes.uba.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <option value="UTN">UTN (Tecnológica Nacional)</option>
                  <option value="UNLP">UNLP (La Plata)</option>
                  <option value="UNC">UNC (Córdoba)</option>
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

            {/* Step 2: Choose SEO marketing action */}
            <div className="pt-2 border-t border-stone-200">
              <label className="block text-xs font-bold text-stone-900 mb-2">
                Elegí tu misión solidaria para activar tu cuenta (1 click):
              </label>

              <div className="space-y-2">
                
                {/* Option 1: WhatsApp Group Share */}
                <div 
                  onClick={() => { setSelectedSeoAction('whatsapp_group'); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSeoAction === 'whatsapp_group'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      Compartir en el grupo de WhatsApp de tu comisión
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Más popular (+10 SEO)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Copia el mensaje y pégalo en tu grupo de cursada para que más compañeros conozcan Altillo.
                  </p>

                  {selectedSeoAction === 'whatsapp_group' && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyShare}
                        className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedShareText ? '¡Mensaje Copiado!' : 'Copiar mensaje para WhatsApp'}</span>
                      </button>
                      {actionConfirmed && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Misión lista
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Option 2: Social media share */}
                <div 
                  onClick={() => { setSelectedSeoAction('social_share'); setActionConfirmed(true); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSeoAction === 'social_share'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                      Mención en X (Twitter), LinkedIn o Threads
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      Backlink Social
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Publicá un post recomendando los resúmenes con los hashtags #UBA #UTN #Altillo.
                  </p>
                </div>

                {/* Option 3: Google review or blog mention */}
                <div 
                  onClick={() => { setSelectedSeoAction('google_review'); setActionConfirmed(true); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSeoAction === 'google_review'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      Dejar 5 estrellas y reseña con palabras clave
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Calificación Google
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Ayuda a que los motores de búsqueda posicionen Altillo como repositorio universitario de referencia.
                  </p>
                </div>

              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                100% libre de spam · Nunca te pediremos tarjeta de crédito
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activar Cuenta y Héctor IA</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
