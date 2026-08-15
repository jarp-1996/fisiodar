'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(email, password, firstName, lastName, phone);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-teal-500 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent inline-block"
          >
            Fisiodar
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-100">
            Crea tu cuenta de paciente
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-md py-8 px-4 border border-slate-800 shadow-xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                  Nombre *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-800 rounded-xl bg-slate-950 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-100 text-sm transition-all"
                  placeholder="María"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                  Apellido *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-800 rounded-xl bg-slate-950 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-100 text-sm transition-all"
                  placeholder="Gómez"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                Teléfono / WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-100 text-sm transition-all"
                placeholder="+54 9 11 5555-5555"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-100 text-sm transition-all"
                placeholder="maria@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Contraseña *
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-slate-800 rounded-xl bg-slate-950 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-100 text-sm transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Registrando Cuenta...' : 'Registrarme'}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
