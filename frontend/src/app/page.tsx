'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const services = [
    {
      title: 'Manual Therapy',
      description: 'Spine/Joint Care, hands-on treatment.',
      icon: '🙌',
    },
    {
      title: 'Sports Rehabilitation',
      description: 'Injury recovery, movement optimization.',
      icon: '🏃',
    },
    {
      title: 'Neuro-Rehabilitation',
      description: 'Neurological recovery, balance training.',
      icon: '🧠',
    },
    {
      title: 'Post-Op Recovery',
      description: 'Personalized recovery plans, regain mobility.',
      icon: '💪',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c3e50] font-sans selection:bg-[#9fb39e] selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-transparent pt-6 pb-4 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#889785] font-[family-name:var(--font-playfair),serif]">
                FISIODAR
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5c6e61]">
              <a href="#services" className="hover:text-[#9fb39e] transition-colors">Services</a>
              <a href="#clinic" className="hover:text-[#9fb39e] transition-colors">Our Clinic</a>
              <a href="#team" className="hover:text-[#9fb39e] transition-colors">Team</a>
              <a href="#patients" className="hover:text-[#9fb39e] transition-colors">Patients</a>
              <a href="#contact" className="hover:text-[#9fb39e] transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href={user.role === 'patient' ? '/dashboard/patient' : '/dashboard/therapist'}
                  className="bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-sm"
                >
                  My Dashboard ({user.first_name})
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-sm"
                >
                  Book Appointment
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 items-center">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50] leading-[1.1] mb-6">
            Premium Physiotherapy <br className="hidden md:block"/>
            &amp; Rehabilitation for <br className="hidden md:block"/>
            Optimal Health.
          </h1>
          <p className="text-[#5c6e61] text-lg mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
            Empowering your recovery with expert care, personalized treatments, and holistic wellness at Fisiodar Clinic.
          </p>
          <Link
            href={user ? '/dashboard/patient' : '/register'}
            className="inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-semibold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Book Your Session Today
          </Link>
        </div>

        {/* Right Image Placeholder */}
        <div className="flex-1 relative w-full flex justify-end">
          <div className="w-full max-w-[500px] aspect-[4/3] bg-gradient-to-br from-[#e5dfce] to-[#d6cfbb] rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 flex items-center justify-center text-[#889785] font-[family-name:var(--font-playfair),serif] text-xl italic">
              [ Patient Image Here ]
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
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2c3e50]">Our Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-[#eae6d8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(159,179,158,0.2)] transition-all duration-300 group"
              >
                <div className="text-3xl mb-6 bg-[#9fb39e] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#8d9e8c] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-[family-name:var(--font-playfair),serif] font-bold mb-3 text-[#2c3e50]">
                  {service.title}
                </h3>
                <p className="text-[#5c6e61] text-sm leading-relaxed mb-6 font-medium">
                  {service.description}
                </p>
                <a href="#" className="text-[#9fb39e] text-sm font-semibold underline underline-offset-4 decoration-2 decoration-[#9fb39e]/30 hover:decoration-[#9fb39e] transition-colors">
                  Learn More
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
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#2c3e50]">The Fisiodar Experience</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Video Placeholder */}
            <div className="flex-1 w-full">
              <div className="w-full aspect-[16/9] bg-[#d6cfbb] rounded-2xl flex items-center justify-center relative shadow-lg overflow-hidden">
                 <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors z-10 shadow-md">
                   <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[#2c3e50] border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center text-[#889785] font-[family-name:var(--font-playfair),serif] text-lg italic opacity-70">
                   [ Experience Video Placeholder ]
                 </div>
              </div>
            </div>
            {/* Testimonials */}
            <div className="flex-1 space-y-8">
              <blockquote className="space-y-3">
                <p className="text-lg text-[#5c6e61] font-[family-name:var(--font-playfair),serif] italic leading-relaxed">
                  &quot;I recovered my physical fitness with their expert care. Excellent environment and top-tier professionals. Highly recommended for back pain.&quot;
                </p>
                <footer className="text-sm font-bold text-[#9fb39e] uppercase tracking-wider">Testimonial</footer>
              </blockquote>
              <div className="w-12 h-px bg-[#d6cfbb]"></div>
              <blockquote className="space-y-3">
                <p className="text-lg text-[#5c6e61] font-[family-name:var(--font-playfair),serif] italic leading-relaxed">
                  &quot;Thank you for the amazing physiotherapy. I returned to my normal life in record time after my knee surgery.&quot;
                </p>
                <footer className="text-sm font-bold text-[#9fb39e] uppercase tracking-wider">Testimonial</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-[#f4f1e1] rounded-[2rem] p-8 md:p-14 shadow-xl border border-[#e5dfce]">
          <div className="text-center mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#2c3e50] block mb-4">Reservation</span>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50]">Begin Your Journey to Recovery</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Phone Number</label>
              <input type="tel" placeholder="+51 958 108 389" className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Select Service</label>
              <select className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-white">
                <option>Manual Therapy</option>
                <option>Sports Rehabilitation</option>
                <option>Neuro-Rehabilitation</option>
                <option>Post-Op Recovery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#2c3e50]">Preferred Date & Time</label>
              <input type="text" placeholder="Calendar / Time" disabled className="w-full px-4 py-3 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-[#9fb39e] text-slate-800 bg-slate-100" />
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 text-center">
              <Link
                href={user ? '/dashboard/patient' : '/register'}
                className="w-full inline-block bg-[#9fb39e] hover:bg-[#8d9e8c] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg tracking-wider"
              >
                RESERVE YOUR APPOINTMENT
              </Link>
            </div>
          </form>

          <div className="mt-12 text-center text-[#5c6e61] font-medium border-t border-[#e5dfce] pt-8">
            <h3 className="text-xl font-[family-name:var(--font-playfair),serif] text-[#2c3e50] font-bold mb-2">Contact Us</h3>
            <p>123 Health Ave, London | Phone: 020 7123 4567 | Hours: Mon-Fri 8am-8pm</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#eae6d8] py-8 mt-auto border-t border-[#d6cfbb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#889785] font-[family-name:var(--font-playfair),serif]">
              FISIODAR
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#5c6e61]">
            <a href="#services" className="hover:text-[#9fb39e]">Services</a>
            <a href="#clinic" className="hover:text-[#9fb39e]">Our Clinic</a>
            <a href="#team" className="hover:text-[#9fb39e]">Team</a>
            <a href="#patients" className="hover:text-[#9fb39e]">Patients</a>
            <a href="#contact" className="hover:text-[#9fb39e]">Contact</a>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">in</div>
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">tw</div>
            <div className="w-8 h-8 rounded-full bg-[#9fb39e] text-white flex items-center justify-center cursor-pointer hover:bg-[#8d9e8c] text-xs font-bold">ig</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-between text-xs text-[#889785] font-medium">
          <span>Footer</span>
          <span>© 2024 Fisiodar Clinic</span>
        </div>
      </footer>
    </div>
  );
}
