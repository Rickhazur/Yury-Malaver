
import React from 'react';
import { Users, DollarSign, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Reservation, Client } from '../types';

interface DashboardViewProps {
  clients: Client[];
  appointments: Reservation[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ clients, appointments }) => {
  const totalRevenue = appointments.length * 80000; // Estimated
  const pendingApps = appointments.filter(a => a.status === 'pending').length;

  // Simple aggregation for busy days
  const daysCount: Record<string, number> = {};
  appointments.forEach(app => {
      const day = new Date(app.date).toLocaleDateString('es-ES', { weekday: 'short' });
      daysCount[day] = (daysCount[day] || 0) + 1;
  });
  
  // Normalize for chart
  const weekDays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
  const chartData = weekDays.map(day => ({
      day, 
      count: daysCount[day] || 0,
      height: Math.min(100, (daysCount[day] || 0) * 10) + '%' // Simple scaling
  }));

  // Payment Methods (Mocked based on appointments for demo visual)
  const paymentData = [
      { type: 'Efectivo', val: 30, color: 'bg-rose-300' },
      { type: 'Tarjeta', val: 45, color: 'bg-gold-400' },
      { type: 'Nequi', val: 25, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-rose-50 rounded-xl text-rose-900"><Users size={24}/></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
             </div>
             <h3 className="text-3xl font-bold text-neutral-800">{clients.length}</h3>
             <p className="text-neutral-400 text-xs uppercase tracking-wider mt-1">Total Clientes</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gold-50 rounded-xl text-gold-600"><DollarSign size={24}/></div>
             </div>
             <h3 className="text-3xl font-bold text-neutral-800">${(totalRevenue / 1000000).toFixed(1)}M</h3>
             <p className="text-neutral-400 text-xs uppercase tracking-wider mt-1">Ingresos Est.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><CalendarIcon size={24}/></div>
             </div>
             <h3 className="text-3xl font-bold text-neutral-800">{appointments.length}</h3>
             <p className="text-neutral-400 text-xs uppercase tracking-wider mt-1">Citas Totales</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><Clock size={24}/></div>
             </div>
             <h3 className="text-3xl font-bold text-neutral-800">{pendingApps}</h3>
             <p className="text-neutral-400 text-xs uppercase tracking-wider mt-1">Pendientes</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Busiest Days Chart */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-50">
               <h3 className="font-serif text-xl text-rose-900 mb-6">Días Más Concurridos</h3>
               <div className="flex items-end gap-4 h-48">
                  {chartData.map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-rose-100 rounded-t-lg relative overflow-hidden group-hover:bg-rose-200 transition-all" style={{height: item.height || '10%'}}>
                          </div>
                          <span className="text-xs text-neutral-500 font-medium uppercase">{item.day}</span>
                      </div>
                  ))}
               </div>
           </div>

           {/* Payment Methods Donut (CSS) */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-50 flex flex-col items-center justify-center">
               <h3 className="font-serif text-xl text-rose-900 mb-6 self-start">Métodos de Pago</h3>
               <div className="relative w-48 h-48 rounded-full border-8 border-rose-50 flex items-center justify-center bg-conic-gradient">
                    {/* Simplified CSS Pie Chart representation */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-gold-400 opacity-80" style={{clipPath: 'polygon(0 0, 100% 0, 100% 30%, 50% 50%)'}}></div>
                    <div className="absolute inset-0 rounded-full border-[16px] border-purple-500 opacity-80" style={{clipPath: 'polygon(50% 50%, 100% 30%, 100% 100%, 70% 100%)'}}></div>
                    <div className="absolute inset-0 rounded-full border-[16px] border-rose-300 opacity-80" style={{clipPath: 'polygon(50% 50%, 0 100%, 0 0)'}}></div>
                    
                    <div className="z-10 text-center">
                        <span className="block text-2xl font-bold text-neutral-800">Mix</span>
                        <span className="text-xs text-neutral-500">Pagos</span>
                    </div>
               </div>
               <div className="flex gap-4 mt-6">
                   {paymentData.map(pd => (
                       <div key={pd.type} className="flex items-center gap-2">
                           <span className={`w-3 h-3 rounded-full ${pd.color}`}></span>
                           <span className="text-xs text-neutral-600">{pd.type}</span>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );
};

export default DashboardView;
