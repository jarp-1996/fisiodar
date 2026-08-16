import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string; // e.g. "+5% desde el mes pasado"
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-[#e5ebe4] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#5c6b5b] uppercase tracking-wider">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-[#f4f7f4] flex items-center justify-center text-[#4a5749]">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-4xl font-serif text-[#2c362b]">{value}</span>
        {trend && (
          <span className="text-xs text-[#889785] mt-2 font-medium">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
