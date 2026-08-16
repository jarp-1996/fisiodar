'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import StatCard from '@/components/admin/StatCard';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminStats {
  total_patients: number;
  pending_appointments: number;
  completed_appointments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, loading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Security check on client side before even making the request
    if (user?.role !== 'admin') {
      setError('Acceso denegado. Se requiere rol de administrador.');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Our api.ts automatically attaches the JWT Bearer token
        const endpoint = process.env.NEXT_PUBLIC_API_URL?.endsWith('/api') ? '/admin/stats' : '/api/admin/stats';
        const data = await api.get<AdminStats>(endpoint);
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user, isAuthLoading, router]);

  if (loading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f4]">
        <div className="animate-pulse text-[#5c6b5b] font-medium tracking-wide">Autenticando credenciales...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f4]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-red-100 max-w-md w-full">
          <h2 className="text-xl font-serif text-red-600 mb-4">Error de Seguridad</h2>
          <p className="text-[#5c6b5b] mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-[#5c6b5b] text-white py-2 rounded-lg hover:bg-[#4a5749] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-serif text-[#2c362b]">Panel de Administración</h1>
          <p className="text-[#5c6b5b] mt-2 font-medium">Visión general y métricas del negocio</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Pacientes Registrados" 
            value={stats?.total_patients || 0} 
            icon={<Users size={20} />} 
          />
          <StatCard 
            title="Citas Pendientes" 
            value={stats?.pending_appointments || 0} 
            icon={<Calendar size={20} />} 
          />
          <StatCard 
            title="Citas Completadas" 
            value={stats?.completed_appointments || 0} 
            icon={<CheckCircle size={20} />} 
          />
        </div>
      </div>
    </div>
  );
}
