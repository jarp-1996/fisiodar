'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Therapist {
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

interface MedicalRecord {
  id: string;
  therapist_name: string;
  diagnosis: string;
  treatment: string;
  created_at: string;
}

export default function PatientDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  
  // Booking Form State
  const [therapistId, setTherapistId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [fetching, setFetching] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redirect route guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'patient') {
      router.push('/dashboard/therapist');
    }
  }, [user, authLoading, router]);

  // Fetch data
  useEffect(() => {
    if (!user || user.role !== 'patient') return;

    const patientId = user.id;

    async function loadDashboardData() {
      try {
        const [apptsData, therapistsData, recordsData] = await Promise.all([
          api.get<Appointment[]>('/appointments'),
          api.get<Therapist[]>('/users/therapists'),
          api.get<MedicalRecord[]>(`/records/patient/${patientId}`),
        ]);

        setAppointments(apptsData);
        setTherapists(therapistsData);
        setRecords(recordsData);
      } catch (err: any) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setFetching(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!therapistId || !appointmentDate || !appointmentTime) {
      setError('Por favor, completa todos los campos del turno');
      return;
    }

    setBookingLoading(true);
    try {
      // Merge date and time into RFC3339 ISO string
      const fullDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
      
      const newAppt = await api.post<Appointment>('/appointments', {
        therapist_id: therapistId,
        appointment_time: fullDateTime.toISOString(),
        notes,
      });

      // Find therapist name for UI rendering
      const selectedTherapist = therapists.find(t => t.id === therapistId);
      const apptWithTherapistName: Appointment = {
        ...newAppt,
        therapist_name: selectedTherapist 
          ? `${selectedTherapist.first_name} ${selectedTherapist.last_name}` 
          : 'Kinesiólogo',
      };

      setAppointments(prev => [...prev, apptWithTherapistName]);
      setSuccessMsg('¡Turno reservado con éxito! Pendiente de confirmación.');
      
      // Reset form
      setTherapistId('');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Error al reservar el turno');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return;

    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      setAppointments(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    } catch (err: any) {
      alert(err.message || 'Error al cancelar el turno');
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando tu panel de paciente...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Fisiodar
            </span>
            <span className="bg-teal-500/10 text-teal-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-teal-500/20">
              Paciente
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
          
          {/* Left Column: Appointments & History */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Appointments Section */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                📅 Mis Turnos Programados
              </h2>

              {appointments.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-900">
                  <p className="text-slate-500 text-sm">No tienes turnos agendados todavía.</p>
                  <p className="text-teal-500/70 text-xs mt-2">¡Reserva tu primera cita en el formulario de la derecha!</p>
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
                        className="bg-slate-950 p-5 rounded-xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-300">
                            {appt.therapist_name || 'Kinesiólogo'}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {formattedDate} - {formattedTime} hs
                          </p>
                          {appt.notes && (
                            <p className="text-xs text-slate-500 italic mt-2">
                              Motivo: &quot;{appt.notes}&quot;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
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

                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 px-2.5 py-1 rounded-lg"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Medical Records Section */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                📋 Mi Historial Clínico
              </h2>

              {records.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-900">
                  <p className="text-slate-500 text-sm">Tu historial está vacío.</p>
                  <p className="text-slate-550 text-xs mt-1">Las notas que escriban tus kinesiólogos aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-slate-950/60 p-6 rounded-xl border border-slate-850 hover:border-slate-800 transition-all space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs text-slate-500">
                          {new Date(rec.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-xs font-bold text-teal-400">
                          Dr/a: {rec.therapist_name}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-350 mb-1">Diagnóstico</h4>
                        <p className="text-sm text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                          {rec.diagnosis}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-350 mb-1">Tratamiento / Indicaciones</h4>
                        <p className="text-sm text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                          {rec.treatment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Booking Form */}
          <div className="space-y-10">
            <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 sm:p-8 sticky top-28">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                🏥 Reservar Nuevo Turno
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

              <form onSubmit={handleBookAppointment} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Seleccionar Fisioterapeuta *
                  </label>
                  <select
                    value={therapistId}
                    onChange={(e) => setTherapistId(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">-- Elige un profesional --</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Notas o Motivo de Consulta
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Dolor lumbar, esguince de tobillo, reeducación postural..."
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:opacity-50"
                >
                  {bookingLoading ? 'Reservando...' : 'Reservar Cita'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
