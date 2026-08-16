'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

const LogoIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9fb39e]">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#9fb39e" fillOpacity="0.1" />
    <path d="M12 18V12" />
    <path d="M8 11C8 11 9.5 13 12 13C14.5 13 16 11 16 11" />
    <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" />
    <path d="M12 6V8" />
  </svg>
);

const icons = {
  pain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M10 4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M6 6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M18 11c0 2.5-2.5 5.5-5 8a2 2 0 0 1-2.8 0C7.7 16.5 5 13.5 5 11"/>
    </svg>
  ),
  spine: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18"/><path d="M9 7h6"/><path d="M9 12h6"/><path d="M9 17h6"/><circle cx="12" cy="4" r="1"/><circle cx="12" cy="20" r="1"/>
    </svg>
  ),
  bone: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v0a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2h8a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2z"/><path d="M17 6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2h8a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2z"/><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  rehab: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M18 8a6 6 0 0 0-9.33-5"/>
    </svg>
  ),
  massage: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M10 10h4"/>
    </svg>
  ),
  brain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  speech: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 10h.01"/>
    </svg>
  ),
  baby: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>
    </svg>
  ),
};

export default function ServiciosPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const services = [
    {
      title: 'Terapia de Dolor',
      description: 'Tratamiento especializado para aliviar dolores musculares, articulares y crónicos. Utilizamos técnicas manuales y aparatología de última generación para reducir la inflamación y devolverte el bienestar.',
      icon: icons.pain,
    },
    {
      title: 'Hernias Discales',
      description: 'Abordaje fisioterapéutico seguro y efectivo para la descompresión vertebral. Ayudamos a reducir el dolor radicular (ciática) y a fortalecer la musculatura estabilizadora de tu columna.',
      icon: icons.spine,
    },
    {
      title: 'Fracturas y Fisuras',
      description: 'Acompañamiento post-inmovilización o post-quirúrgico. Nuestro objetivo es que recuperes la fuerza muscular, los rangos de movilidad completos y la independencia tras una lesión ósea.',
      icon: icons.bone,
    },
    {
      title: 'Esguinces y Tendinitis',
      description: 'Rehabilitación enfocada en la recuperación de ligamentos y tendones inflamados. Aplicamos terapia para acelerar la cicatrización y evitar recaídas en tus actividades diarias o deportivas.',
      icon: icons.rehab,
    },
    {
      title: 'Masajes Relajantes',
      description: 'Sesiones enfocadas en descargar la tensión acumulada por el estrés y las malas posturas. Ideal para aliviar contracturas profundas (cuello, espalda, lumbares) y revitalizar tu cuerpo.',
      icon: icons.massage,
    },
    {
      title: 'Neurología',
      description: 'Fisioterapia especializada para pacientes con lesiones del sistema nervioso (ACV, Parkinson, parálisis). Trabajamos la reeducación de la marcha, equilibrio y autonomía motriz.',
      icon: icons.brain,
    },
    {
      title: 'Terapia de Lenguaje',
      description: 'Evaluación y tratamiento de trastornos de comunicación, habla, y deglución. Intervención personalizada tanto para desarrollo infantil como para rehabilitación en adultos.',
      icon: icons.speech,
    },
    {
      title: 'Estimulación Temprana',
      description: 'Sesiones lúdicas y dirigidas para potenciar el desarrollo cognitivo, motor, y social en bebés y niños. Fundamental para alcanzar los hitos del crecimiento a un ritmo saludable.',
      icon: icons.baby,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c3e50] font-sans selection:bg-[#9fb39e] selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-transparent pt-6 pb-4 relative z-50 border-b border-[#eae6d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoIcon />
              <span className="text-xl font-bold tracking-tight text-[#889785] font-[family-name:var(--font-playfair),serif]">
                FISIODAR
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5c6e61]">
              <Link href="/" className="hover:text-[#9fb39e] transition-colors">Inicio</Link>
              <Link href="/servicios" className="text-[#9fb39e] transition-colors border-b-2 border-[#9fb39e] pb-1">Servicios</Link>
              <Link href="/ubicanos" className="hover:text-[#9fb39e] transition-colors">Ubícanos</Link>
              <Link href="/nosotros" className="hover:text-[#9fb39e] transition-colors">Nosotros</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href={user.role === 'patient' ? '/dashboard/patient' : '/dashboard/therapist'}
                  className="hidden md:inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-sm"
                >
                  Mi Panel ({user.first_name})
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="hidden md:inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-sm"
                >
                  Reservar Cita
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-[#5c6e61] hover:text-[#9fb39e] focus:outline-none p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white rounded-2xl shadow-xl border border-[#eae6d8] p-5 flex flex-col gap-4 absolute left-4 right-4 z-50">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#5c6e61] font-semibold hover:text-[#9fb39e]">Inicio</Link>
              <Link href="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-[#9fb39e] font-bold">Servicios</Link>
              <Link href="/ubicanos" onClick={() => setIsMobileMenuOpen(false)} className="text-[#5c6e61] font-semibold hover:text-[#9fb39e]">Ubícanos</Link>
              <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="text-[#5c6e61] font-semibold hover:text-[#9fb39e]">Nosotros</Link>
              <hr className="border-[#eae6d8]" />
              {user ? (
                <Link href={user.role === 'patient' ? '/dashboard/patient' : '/dashboard/therapist'} className="bg-[#9fb39e] text-center text-white font-medium px-5 py-3 rounded-xl shadow-sm">
                  Mi Panel ({user.first_name})
                </Link>
              ) : (
                <Link href="/register" className="bg-[#9fb39e] text-center text-white font-medium px-5 py-3 rounded-xl shadow-sm">
                  Reservar Cita
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair),serif] font-bold text-[#2c3e50] mb-4">
            Tratamientos Especializados
          </h1>
          <p className="text-lg text-[#5c6e61] max-w-2xl mx-auto">
            En Fisiodar ofrecemos una amplia gama de terapias diseñadas específicamente para acelerar tu recuperación y mejorar tu calidad de vida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-[2rem] border border-[#eae6d8] shadow-sm hover:shadow-lg hover:border-[#9fb39e]/30 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#f4f1e1] rounded-2xl flex items-center justify-center text-[#9fb39e] group-hover:bg-[#9fb39e] group-hover:text-white transition-colors duration-300 shadow-inner">
                  {service.icon}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-[family-name:var(--font-playfair),serif] font-bold text-[#2c3e50] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#5c6e61] leading-relaxed mb-4">
                  {service.description}
                </p>
                <Link href="/register" className="inline-flex items-center text-sm font-bold text-[#9fb39e] hover:text-[#889785] transition-colors uppercase tracking-wider">
                  Agendar este servicio <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eae6d8] py-8 mt-auto border-t border-[#d6cfbb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoIcon />
            <span className="text-lg font-bold tracking-tight text-[#889785] font-[family-name:var(--font-playfair),serif]">
              FISIODAR
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#5c6e61]">
            <Link href="/" className="hover:text-[#9fb39e]">Inicio</Link>
            <Link href="/servicios" className="hover:text-[#9fb39e]">Servicios</Link>
            <Link href="/ubicanos" className="hover:text-[#9fb39e]">Ubícanos</Link>
            <Link href="/nosotros" className="hover:text-[#9fb39e]">Nosotros</Link>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">in</div>
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">tw</div>
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">ig</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-between text-xs text-[#889785] font-medium">
          <span>Términos y Condiciones</span>
          <span>© 2026 Fisiodar Centro Clínico</span>
        </div>
      </footer>
    </div>
  );
}
