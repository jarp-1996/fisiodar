'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#2c3e50] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#9fb39e] selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#9fb39e]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-[#889785] font-[family-name:var(--font-playfair),serif] inline-block"
          >
            FISIODAR
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-[#2c3e50] font-[family-name:var(--font-playfair),serif]">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-sm text-[#5c6e61]">
            O si lo prefieres,{' '}
            <Link href="/register" className="font-semibold text-teal-400 hover:text-teal-300">
              crea una cuenta nueva
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#eae6d8] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50]">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] text-sm focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2c3e50]">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] text-sm focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#9fb39e] hover:bg-[#8d9e8c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fb39e] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-sm font-medium text-[#9fb39e] hover:text-[#8d9e8c] transition-colors"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
