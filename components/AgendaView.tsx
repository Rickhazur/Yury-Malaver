
import React from 'react';
import { Reservation } from '../types';

interface AgendaViewProps {
  appointments: Reservation[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ appointments }) => {
  // Simple custom calendar grid logic for the current month
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const getAppsForDay = (day: number) => {
      // Mock matching logic assuming current month
      // In real app, match date string accurately
      return appointments.filter(a => {
          const d = new Date(a.date);
          return d.getDate() === day;
      });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-2xl text-rose-950 font-bold capitalize">{currentMonth}</h2>
            <div className="text-sm text-neutral-500">Vista Mensual</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
            <div className="grid grid-cols-7 bg-rose-50/50 border-b border-rose-100">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} className="py-3 text-center text-xs font-bold text-rose-900 uppercase tracking-wider">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
                {/* Empty slots for start of month offset mock */}
                <div className="min-h-[120px] border-b border-r border-rose-50 bg-neutral-50/30"></div>
                <div className="min-h-[120px] border-b border-r border-rose-50 bg-neutral-50/30"></div>
                
                {daysInMonth.map(day => {
                    const dailyApps = getAppsForDay(day);
                    return (
                        <div key={day} className="min-h-[120px] border-b border-r border-rose-50 p-2 relative hover:bg-rose-50/10 transition-colors">
                            <span className="text-xs font-bold text-neutral-400 absolute top-2 right-2">{day}</span>
                            <div className="mt-4 space-y-1">
                                {dailyApps.map(app => (
                                    <div key={app.id} className={`text-[10px] px-2 py-1 rounded border truncate cursor-pointer ${
                                        app.status === 'confirmed' ? 'bg-green-50 border-green-100 text-green-700' : 
                                        'bg-rose-50 border-rose-100 text-rose-700'
                                    }`}>
                                        {app.time} {app.client_name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default AgendaView;
