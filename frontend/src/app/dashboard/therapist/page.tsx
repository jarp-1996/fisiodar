'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  patient_name?: string;
  therapist_id: string;
  therapist_name?: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
}

export default function TherapistDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Medical Record Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  
  const [fetching, setFetching] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Route guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role === 'patient') {
      router.push('/dashboard/patient');
    }
  }, [user, authLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!user || user.role === 'patient') return;

    async function loadTherapistData() {
      try {
        const [apptsData, patientsData] = await Promise.all([
          api.get<Appointment[]>('/appointments'),
          api.get<Patient[]>('/users/patients'),
        ]);

        setAppointments(apptsData);
        setPatients(patientsData);
      } catch (err: any) {
        console.error('Failed to load therapist dashboard data', err);
      } finally {
        setFetching(false);
      }
    }

    loadTherapistData();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev =>
        prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      alert(err.message || 'Error al actualizar el estado de la cita');
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedPatientId || !diagnosis || !treatment) {
      setError('Por favor, completa todos los campos del expediente');
      return;
    }

    setRecordLoading(true);
    try {
      await api.post('/records', {
        patient_id: selectedPatientId,
        diagnosis,
        treatment,
      });

      setSuccessMsg('¡Nota de evolución agregada con éxito al historial clínico!');
      
      // Reset form
      setSelectedPatientId('');
      setDiagnosis('');
      setTreatment('');
    } catch (err: any) {
      setError(err.message || 'Error al crear la nota clínica');
    } finally {
      setRecordLoading(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando tu panel de especialista...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Fisiodar
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">
              Kinesiólogo / Especialista
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-slate-905 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Agenda management */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  📋 Mi Agenda de Turnos
                </h2>
                <span className="text-xs text-slate-450 bg-slate-950 border border-slate-900 px-3 py-1 rounded-full font-semibold">
                  {appointments.filter(a => a.status === 'pending').length} pendientes
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-900">
                  <p className="text-slate-500 text-sm">No tienes turnos programados en tu agenda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => {
                    const dateObj = new Date(appt.appointment_time);
                    const formattedDate = dateObj.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    const formattedTime = dateObj.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={appt.id}
                        className="bg-slate-950 p-5 rounded-xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-bold text-slate-200">
                              {appt.patient_name || 'Paciente'}
                            </p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                                appt.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : appt.status === 'confirmed'
                                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                                  : appt.status === 'completed'
                                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}
                            >
                              {appt.status === 'pending' && 'Pendiente'}
                              {appt.status === 'confirmed' && 'Confirmado'}
                              {appt.status === 'completed' && 'Realizado'}
                              {appt.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 capitalize">
                            {formattedDate} - {formattedTime} hs
                          </p>
                          
                          {appt.notes && (
                            <p className="text-xs text-slate-500 italic mt-2">
                              Motivo consulta: &quot;{appt.notes}&quot;
                            </p>
                          )}
                        </div>

                        {/* Status update actions */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                          {appt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                                className="text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                                className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {appt.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'completed')}
                                className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-350 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Completado
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                                className="text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/5 px-3 py-1.5 rounded-lg transition-all"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Evolution note */}
          <div className="space-y-10">
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 sm:p-8 sticky top-28">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                ✍️ Nota de Evolución Clínica
              </h3>

              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 p-3 rounded-lg text-sm">
                  ✅ {successMsg}
                </div>
              )}

              <form onSubmit={handleCreateRecord} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Seleccionar Paciente *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">-- Elige un paciente --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Diagnóstico *
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Ej. Contractura cervical severa, sospecha de hernia de disco L4-L5..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Tratamiento Aplicado *
                  </label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Ej. Terapia manual, aplicación de ultrasonido durante 10 mins, ejercicios de elongación y reeducación postural..."
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={recordLoading}
                  className="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
                >
                  {recordLoading ? 'Guardando Nota...' : 'Guardar en Ficha Clínica'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
