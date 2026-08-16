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

export default function Home() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const services = [
    {
      title: 'Terapia de Dolor',
      description: 'Alivio y tratamiento de dolores musculares y articulares.',
      icon: icons.pain,
    },
    {
      title: 'Hernias Discales',
      description: 'Cuidado especializado para la columna vertebral.',
      icon: icons.spine,
    },
    {
      title: 'Fracturas y Fisuras',
      description: 'Recuperación progresiva de la movilidad y fuerza.',
      icon: icons.bone,
    },
    {
      title: 'Esguinces y Tendinitis',
      description: 'Rehabilitación de lesiones deportivas y cotidianas.',
      icon: icons.rehab,
    },
    {
      title: 'Masajes Relajantes',
      description: 'Alivio del estrés y tensión muscular profunda.',
      icon: icons.massage,
    },
    {
      title: 'Neurología',
      description: 'Tratamiento de enfermedades neurológicas y equilibrio.',
      icon: icons.brain,
    },
    {
      title: 'Terapia de Lenguaje',
      description: 'Tratamiento especializado de trastornos de comunicación.',
      icon: icons.speech,
    },
    {
      title: 'Estimulación Temprana',
      description: 'Desarrollo psicomotor para infantes y niños.',
      icon: icons.baby,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c3e50] font-sans selection:bg-[#9fb39e] selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-transparent pt-6 pb-4 relative z-50">
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
              <Link href="/servicios" className="hover:text-[#9fb39e] transition-colors">Servicios</Link>
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
              <Link href="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="text-[#5c6e61] font-semibold hover:text-[#9fb39e]">Servicios</Link>
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

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 items-center">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50] leading-[1.1] mb-6">
            Fisioterapia Premium <br className="hidden md:block"/>
            y Rehabilitación para <br className="hidden md:block"/>
            tu Salud Óptima.
          </h1>
          <p className="text-[#5c6e61] text-lg mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
            Potenciando tu recuperación con cuidado experto, tratamientos personalizados y bienestar integral en el consultorio de la Lic. Dariana.
          </p>
          <Link
            href={user ? '/dashboard/patient' : '/register'}
            className="inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-semibold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Agenda tu Sesión Hoy
          </Link>
        </div>

        {/* Right Image Placeholder */}
        <div className="flex-1 relative w-full flex justify-end">
          <div className="w-full max-w-[500px] aspect-[4/3] bg-gradient-to-br from-[#e5dfce] to-[#d6cfbb] rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 flex items-center justify-center text-[#889785] font-[family-name:var(--font-playfair),serif] text-xl italic">
              [ Imagen de Paciente Aquí ]
            </div>
          </div>
          {/* Decorative floating dots */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[radial-gradient(#d6cfbb_2px,transparent_2px)] [background-size:10px_10px] opacity-50"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2c3e50]">Nuestros Servicios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-[#eae6d8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(159,179,158,0.2)] transition-all duration-300 group"
              >
                <div className="mb-6 bg-[#9fb39e] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#8d9e8c] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-[family-name:var(--font-playfair),serif] font-bold mb-3 text-[#2c3e50]">
                  {service.title}
                </h3>
                <p className="text-[#5c6e61] text-sm leading-relaxed mb-6 font-medium">
                  {service.description}
                </p>
                <a href="#" className="text-[#9fb39e] text-sm font-semibold underline underline-offset-4 decoration-2 decoration-[#9fb39e]/30 hover:decoration-[#9fb39e] transition-colors">
                  Ver Detalles
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Fisiodar Experience / Testimonial */}
      <section className="py-24 bg-[#faf9f6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2c3e50]">La Experiencia Fisiodar</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Video Placeholder */}
            <div className="flex-1 w-full">
              <div className="w-full aspect-[16/9] bg-[#d6cfbb] rounded-2xl flex items-center justify-center relative shadow-lg overflow-hidden">
                 <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors z-10 shadow-md">
                   <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[#2c3e50] border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center text-[#889785] font-[family-name:var(--font-playfair),serif] text-lg italic opacity-70">
                   [ Video de Experiencia Aquí ]
                 </div>
              </div>
            </div>
            {/* Testimonials */}
            <div className="flex-1 space-y-8">
              <blockquote className="space-y-3">
                <p className="text-lg text-[#5c6e61] font-[family-name:var(--font-playfair),serif] italic leading-relaxed">
                  &quot;Recuperé mi estado físico con su cuidado experto. Excelente ambiente y profesionales de primer nivel. Muy recomendado para dolores de espalda.&quot;
                </p>
                <footer className="text-sm font-bold text-[#9fb39e] uppercase tracking-wider">Testimonio</footer>
              </blockquote>
              <div className="w-12 h-px bg-[#d6cfbb]"></div>
              <blockquote className="space-y-3">
                <p className="text-lg text-[#5c6e61] font-[family-name:var(--font-playfair),serif] italic leading-relaxed">
                  &quot;Gracias por la increíble fisioterapia. Volví a mi vida normal en tiempo récord después de mi cirugía de rodilla.&quot;
                </p>
                <footer className="text-sm font-bold text-[#9fb39e] uppercase tracking-wider">Testimonio</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-[#f4f1e1] rounded-[2rem] p-8 md:p-14 shadow-xl border border-[#e5dfce]">
          <div className="text-center mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#2c3e50] block mb-4">Reserva</span>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50]">Comienza tu Camino a la Recuperación</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Nombre Completo</label>
              <input type="text" placeholder="Ej. Juan Pérez" className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Teléfono</label>
              <input type="tel" placeholder="+51 958 108 389" className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Seleccionar Servicio</label>
              <select className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white">
                <option>Terapia de Dolor</option>
                <option>Hernias Discales</option>
                <option>Masajes relajantes</option>
                <option>Terapia de Lenguaje</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Fecha Preferida</label>
              <input type="text" placeholder="Calendario / Hora" disabled className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-slate-100" />
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 text-center">
              <Link
                href={user ? '/dashboard/patient' : '/register'}
                className="w-full inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg tracking-wider"
              >
                RESERVAR MI TURNO
              </Link>
            </div>
          </form>

          <div className="mt-12 text-center text-[#5c6e61] font-medium border-t border-[#e5dfce] pt-8">
            <h3 className="text-xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50] font-bold mb-2">Contáctanos</h3>
            <p>Teléfonos: 958 108 389 y 944 130 760 | Horario: Lunes, Miércoles y Viernes (8:00 am - 8:00 pm)</p>
            <p className="mt-1 text-sm text-[#889785]">Refrigerio: 1:00 pm a 2:00 pm. Domingos: Consultar por WhatsApp.</p>
          </div>
        </div>
      </section>

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
            <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-between text-xs text-[#889785] font-medium">
          <span>Términos y Condiciones</span>
          <Link href="/login" className="text-[#d6cfbb] hover:text-[#889785] transition-colors" aria-label="Portal de personal">Admin</Link>
          <span>© 2026 Fisiodar Centro Clínico</span>
        </div>
      </footer>
    </div>
  );
}
