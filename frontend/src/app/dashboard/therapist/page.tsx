'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  weight?: number;
  medical_history?: string;
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
  service_type: string;
  pain_scale: number;
  symptoms: string;
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
      <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5c6b5b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5c6b5b] font-medium tracking-wide">Cargando tu panel de especialista...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f4] font-sans selection:bg-[#5c6b5b] selection:text-white pb-12">
      {/* Header */}
      <header className="border-b border-[#e4ebe4] bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5c6b5b]">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#5c6b5b" fillOpacity="0.1" />
              <path d="M12 18V12" />
              <path d="M8 11C8 11 9.5 13 12 13C14.5 13 16 11 16 11" />
              <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" />
              <path d="M12 6V8" />
            </svg>
            <span className="text-2xl font-serif text-[#2c362b] font-bold tracking-tight">
              Fisiodar
            </span>
            <span className="bg-[#5c6b5b]/10 text-[#5c6b5b] text-xs px-2.5 py-1 rounded-full font-semibold border border-[#5c6b5b]/20">
              Kinesiólogo / Especialista
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#2c362b]">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-[#5c6b5b]">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="hover:bg-red-50 text-[#5c6b5b] hover:text-red-600 border border-[#e4ebe4] hover:border-red-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
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
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4ebe4]">
              <div className="flex items-center justify-between mb-6 border-b border-[#f4f7f4] pb-4">
                <h2 className="text-xl font-serif text-[#2c362b] flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#5c6b5b]" /> Mi Agenda de Turnos
                </h2>
                <span className="text-xs text-[#5c6b5b] bg-[#f4f7f4] px-3 py-1 rounded-full font-semibold">
                  {appointments.filter(a => a.status === 'pending').length} pendientes
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-16 bg-[#f4f7f4]/50 rounded-xl border border-dashed border-[#e4ebe4]">
                  <p className="text-[#5c6b5b] font-medium">No tienes turnos programados en tu agenda.</p>
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
                        className="bg-white p-5 rounded-xl border border-[#e4ebe4] hover:border-[#5c6b5b]/30 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 w-full">
                          <div className="flex items-center justify-between sm:justify-start gap-3 mb-2">
                            <p className="text-base font-bold text-[#2c362b]">
                              {appt.patient_name || 'Paciente'}
                            </p>
                            <span
                              className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                appt.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : appt.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : appt.status === 'completed'
                                  ? 'bg-[#5c6b5b]/10 text-[#5c6b5b]'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {appt.status === 'pending' && 'Pendiente'}
                              {appt.status === 'confirmed' && 'Confirmado'}
                              {appt.status === 'completed' && 'Realizado'}
                              {appt.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </div>
                          
                          <p className="text-sm font-medium text-[#5c6b5b] capitalize">
                            {formattedDate} - {formattedTime} hs
                          </p>
                          <p className="text-sm text-[#5c6b5b]">
                            Servicio: <span className="font-semibold text-[#2c362b]">{appt.service_type}</span>
                          </p>
                          <p className="text-sm text-[#5c6b5b]">
                            Nivel de dolor: <span className="font-semibold text-[#2c362b]">{appt.pain_scale}/10</span>
                          </p>
                          {appt.symptoms && (
                            <p className="text-sm text-[#5c6b5b] mt-2 italic leading-relaxed bg-[#f4f7f4] p-3 rounded-lg border border-[#e4ebe4]/50">
                              "{appt.symptoms}"
                            </p>
                          )}
                          {appt.notes && (
                            <p className="text-sm text-[#5c6b5b] italic mt-1 leading-relaxed bg-[#f4f7f4] p-3 rounded-lg border border-[#e4ebe4]/50">
                              Notas: "{appt.notes}"
                            </p>
                          )}
                        </div>

                        {/* Status update actions */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end mt-4 sm:mt-0">
                          {appt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                                className="text-sm font-medium text-white bg-[#5c6b5b] hover:bg-[#4a5749] px-4 py-2 rounded-lg transition-colors shadow-sm"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                                className="text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {appt.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'completed')}
                                className="text-sm font-medium text-white bg-[#5c6b5b] hover:bg-[#4a5749] px-4 py-2 rounded-lg transition-colors shadow-sm"
                              >
                                Completado
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                                className="text-sm font-medium text-[#5c6b5b] hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
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
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4ebe4] sticky top-28">
              <h3 className="text-xl font-serif text-[#2c362b] mb-6 border-b border-[#f4f7f4] pb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#5c6b5b]" /> Nota de Evolución Clínica
              </h3>

              {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> {successMsg}
                </div>
              )}

              <form onSubmit={handleCreateRecord} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#2c362b] mb-2">
                    Seleccionar Paciente *
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="block w-full px-4 py-3 border border-[#e4ebe4] rounded-xl bg-white text-[#2c362b] text-sm focus:outline-none focus:ring-2 focus:ring-[#5c6b5b] focus:border-transparent transition-all shadow-sm"
                    required
                  >
                    <option value="">-- Elige un paciente --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name} ({p.email})
                      </option>
                    ))}
                  </select>

                  {/* Mostrar Datos Médicos del Paciente Seleccionado */}
                  {(() => {
                    const selectedPatientObj = patients.find(p => p.id === selectedPatientId);
                    if (!selectedPatientObj) return null;
                    return (
                       <div className="bg-[#f4f7f4] p-4 rounded-xl text-sm space-y-2 mt-4 text-[#5c6b5b]">
                         <p className="font-bold text-[#2c362b]">Ficha del Paciente:</p>
                         <p><span className="font-medium text-[#2c362b]">Peso:</span> {selectedPatientObj.weight ? `${selectedPatientObj.weight} kg` : 'No registrado'}</p>
                         <p className="leading-relaxed whitespace-pre-wrap"><span className="font-medium text-[#2c362b]">Condiciones/Operaciones:</span> {selectedPatientObj.medical_history || 'Sin antecedentes.'}</p>
                       </div>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2c362b] mb-2">
                    Diagnóstico *
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="block w-full px-4 py-3 border border-[#e4ebe4] rounded-xl bg-white text-[#2c362b] text-sm focus:outline-none focus:ring-2 focus:ring-[#5c6b5b] focus:border-transparent transition-all shadow-sm resize-none"
                    placeholder="Ej. Contractura cervical severa, sospecha de hernia de disco L4-L5..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2c362b] mb-2">
                    Tratamiento Aplicado *
                  </label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="block w-full px-4 py-3 border border-[#e4ebe4] rounded-xl bg-white text-[#2c362b] text-sm focus:outline-none focus:ring-2 focus:ring-[#5c6b5b] focus:border-transparent transition-all shadow-sm resize-none"
                    placeholder="Ej. Terapia manual, aplicación de ultrasonido durante 10 mins, ejercicios de elongación y reeducación postural..."
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={recordLoading}
                  className="w-full flex justify-center py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#5c6b5b] hover:bg-[#4a5749] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c6b5b] transition-all duration-300 disabled:opacity-50 mt-2"
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
