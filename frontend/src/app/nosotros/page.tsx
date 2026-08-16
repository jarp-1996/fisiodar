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

export default function NosotrosPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
              <Link href="/servicios" className="hover:text-[#9fb39e] transition-colors">Servicios</Link>
              <Link href="/ubicanos" className="hover:text-[#9fb39e] transition-colors">Ubícanos</Link>
              <Link href="/nosotros" className="text-[#9fb39e] transition-colors border-b-2 border-[#9fb39e] pb-1">Nosotros</Link>
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
              <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="text-[#9fb39e] font-bold">Nosotros</Link>
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
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair),serif] font-bold text-[#2c3e50] mb-4">
            Sobre Fisiodar
          </h1>
          <p className="text-lg text-[#5c6e61] max-w-2xl mx-auto">
            Conoce más sobre nuestra filosofía de trabajo y la profesional a cargo de tu recuperación.
          </p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
          {/* Biography Text */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl font-[family-name:var(--font-playfair),serif] font-bold text-[#2c3e50] mb-4">
                Licenciada Dariana
              </h2>
              <p className="text-lg text-[#5c6e61] leading-relaxed mb-6 font-medium">
                "Mi misión es ayudarte a recuperar tu bienestar físico para que puedas disfrutar de la vida sin limitaciones."
              </p>
              <p className="text-[#5c6e61] leading-relaxed">
                Con años de experiencia en fisioterapia clínica y rehabilitación neurológica, la Licenciada Dariana lidera Fisiodar con un enfoque profundamente humano y empático. 
                Cada paciente recibe una evaluación exhaustiva y un plan de tratamiento 100% personalizado, utilizando las mejores técnicas manuales y equipos de vanguardia.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#eae6d8] shadow-sm">
                <div className="w-10 h-10 bg-[#f4f1e1] rounded-full flex items-center justify-center text-[#9fb39e] mb-4">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="font-bold text-[#2c3e50] mb-2 font-[family-name:var(--font-playfair),serif]">Nuestra Misión</h3>
                <p className="text-sm text-[#5c6e61]">Restaurar la funcionalidad física de nuestros pacientes con calidez, eficacia y tecnología, mejorando su calidad de vida integral.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#eae6d8] shadow-sm">
                <div className="w-10 h-10 bg-[#f4f1e1] rounded-full flex items-center justify-center text-[#9fb39e] mb-4">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
                <h3 className="font-bold text-[#2c3e50] mb-2 font-[family-name:var(--font-playfair),serif]">Nuestra Visión</h3>
                <p className="text-sm text-[#5c6e61]">Ser el centro de rehabilitación fisioterapéutica líder y de mayor confianza en nuestra comunidad, destacando por nuestros resultados.</p>
              </div>
            </div>
          </div>

          {/* Photo Placeholder */}
          <div className="w-full lg:w-1/2 relative">
             <div className="aspect-[4/5] w-full max-w-[450px] mx-auto bg-gradient-to-tr from-[#e5dfce] to-[#f4f1e1] rounded-[3rem] overflow-hidden shadow-xl relative border-[8px] border-white">
                <div className="absolute inset-0 flex items-center justify-center text-[#889785] font-[family-name:var(--font-playfair),serif] text-xl italic text-center p-8">
                  [ Fotografía de la Licenciada Dariana / Consultorio ]
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[radial-gradient(#9fb39e_2px,transparent_2px)] [background-size:12px_12px] opacity-30 -z-10 rounded-full"></div>
          </div>
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
