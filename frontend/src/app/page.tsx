'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const services = [
    {
      title: 'Rehabilitación Deportiva',
      description: 'Recuperación optimizada y prevención de lesiones para atletas de alto rendimiento y aficionados.',
      icon: '🏃‍♂️',
      tag: 'Deportistas',
    },
    {
      title: 'Kinesiología Traumatológica',
      description: 'Tratamiento efectivo de fracturas, esguinces, tendinitis y dolores articulares crónicos.',
      icon: '🦴',
      tag: 'Articulaciones',
    },
    {
      title: 'Reeducación Postural (RPG)',
      description: 'Corrección de postura, dolores de columna, escoliosis y tensiones musculares acumuladas.',
      icon: '🧍‍♀️',
      tag: 'Postura',
    },
    {
      title: 'Fisioterapia Neurológica',
      description: 'Tratamiento especializado para secuelas de ACV, Parkinson y esclerosis múltiple.',
      icon: '🧠',
      tag: 'Neurología',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
                PhysioReserve
              </span>
              <span className="bg-teal-500/10 text-teal-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-teal-500/20">
                Clinic
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#servicios" className="hover:text-teal-400 transition-colors">Servicios</a>
              <a href="#beneficios" className="hover:text-teal-400 transition-colors">Beneficios</a>
              <a href="#contacto" className="hover:text-teal-400 transition-colors">Contacto</a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href={user.role === 'patient' ? '/dashboard/patient' : '/dashboard/therapist'}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-400/20"
                >
                  Ir a mi Panel ({user.first_name})
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-md shadow-teal-500/10"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 flex items-center justify-center flex-1">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-semibold mb-8 animate-fade-in">
            ✨ Tu salud física en manos de profesionales certificados
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-tight sm:leading-none">
            Recupera tu movimiento. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Transforma tu bienestar.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Reserva tus consultas kinesiológicas en segundos. Consulta tu historial clínico de forma privada y mantén el control de tu tratamiento desde un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? (user.role === 'patient' ? '/dashboard/patient' : '/dashboard/therapist') : '/register'}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-extrabold text-base transition-all duration-300 shadow-xl shadow-teal-500/20 hover:scale-[1.02]"
            >
              Reservar Cita Ahora
            </Link>
            <a
              href="#servicios"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all duration-300 border border-slate-800 hover:border-slate-700"
            >
              Explorar Especialidades
            </a>
          </div>

          {/* Quick stats banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-900">
            <div>
              <p className="text-3xl font-extrabold text-teal-400">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Digital y Seguro</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-400">+5,000</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Pacientes Felices</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-400">24/7</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Gestión de Turnos</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-400">15+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Especialistas Certificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-slate-900/40 border-t border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nuestras Especialidades</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Brindamos una cobertura integral de fisioterapia y kinesiología utilizando técnicas modernas y equipamiento de última generación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/5"
              >
                <div className="text-4xl mb-6 bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-800 group-hover:bg-teal-500/10 group-hover:border-teal-500/20 transition-all duration-300">
                  {service.icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-500/5 px-2.5 py-1 rounded-md border border-teal-500/10">
                  {service.tag}
                </span>
                <h3 className="text-xl font-bold mt-4 mb-2 text-slate-100 group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Call to Action */}
      <section id="contacto" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">¿Listo para comenzar tu recuperación?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Regístrate ahora, elige tu terapeuta, agenda tu primer turno en el horario de tu preferencia y accede a tus notas médicas al instante.
          </p>
          <Link
            href={user ? '/dashboard/patient' : '/register'}
            className="inline-flex px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base rounded-xl transition-all duration-300 shadow-xl shadow-teal-500/15"
          >
            Crear mi Cuenta de Paciente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PhysioReserve. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            Desarrollado con <span className="text-rose-500 font-semibold">❤️</span> usando Go & Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
