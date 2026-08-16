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
  const [weight, setWeight] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
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
      const numericWeight = weight ? parseFloat(weight) : undefined;
      await register(
        email,
        password,
        firstName,
        lastName,
        phone,
        numericWeight,
        medicalHistory
      );
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
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
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-[#5c6e61]">
            O si ya tienes una,{' '}
            <Link href="/login" className="font-semibold text-[#9fb39e] hover:text-[#8d9e8c]">
              inicia sesión aquí
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#2c3e50]">
                  Nombre *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                  placeholder="María"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#2c3e50]">
                  Apellido *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                  placeholder="Gómez"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-[#2c3e50]">
                  Peso (kg) <span className="text-xs text-[#5c6e61]">(Opcional)</span>
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#2c3e50]">
                  Teléfono / WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                  placeholder="958 108 389"
                />
              </div>
            </div>

            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium text-[#2c3e50]">
                Historial Médico Importante <span className="text-xs text-[#5c6e61]">(Opcional)</span>
              </label>
              <textarea
                id="medicalHistory"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2.5 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] text-sm focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent transition-all h-20 resize-none"
                placeholder="Ej: Hipertensión, operado de rodilla, etc."
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50]">
                Correo Electrónico *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                placeholder="maria@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2c3e50]">
                Contraseña *
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-2.5 border border-[#eae6d8] rounded-xl bg-[#fcfbf9] text-[#2c3e50] focus:outline-none focus:ring-2 focus:ring-[#9fb39e] focus:border-transparent text-sm transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#9fb39e] hover:bg-[#8d9e8c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9fb39e] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarme'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-[#9fb39e] hover:text-[#8d9e8c] transition-colors"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
