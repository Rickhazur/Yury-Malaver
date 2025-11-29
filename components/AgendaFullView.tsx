
import React, { useState } from 'react';
import { Reservation } from '../types';
import { Calendar as CalendarIcon, Clock, MessageCircle, Star, CheckCircle, XCircle, CheckCheck, ArrowUpDown } from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

interface AgendaFullViewProps {
  appointments: Reservation[];
}

const AgendaFullView: React.FC<AgendaFullViewProps> = ({ appointments }) => {
  const [sortCriteria, setSortCriteria] = useState<'date_asc' | 'date_desc' | 'status'>('date_asc');

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!db) return;
    try {
        await updateDoc(doc(db, "appointments", id), { status: newStatus });
    } catch (e) {
        alert("Error actualizando estado");
    }
  };

  const getSortedAppointments = () => {
    const sorted = [...appointments];
    switch (sortCriteria) {
      case 'date_asc':
        return sorted.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      case 'date_desc':
        return sorted.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
      case 'status':
        const priority = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
        return sorted.sort((a, b) => priority[a.status] - priority[b.status]);
      default:
        return sorted;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="font-serif text-2xl text-rose-950 font-bold">Lista de Agenda</h2>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-rose-100 shadow-sm">
                <ArrowUpDown size={16} className="text-rose-400"/>
                <select 
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value as any)}
                    className="text-sm text-neutral-600 focus:outline-none bg-transparent"
                >
                    <option value="date_asc">Próximas (Fecha Asc)</option>
                    <option value="date_desc">Lejanas (Fecha Desc)</option>
                    <option value="status">Prioridad (Pendientes)</option>
                </select>
            </div>
        </div>

        <div className="space-y-4">
            {getSortedAppointments().map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-all">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-neutral-800">{app.client_name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                app.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {app.status === 'completed' ? 'Completada' : app.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><CalendarIcon size={14} className="text-gold-500"/> {app.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14} className="text-gold-500"/> {app.time}</span>
                            <span className="flex items-center gap-1"><Star size={14} className="text-gold-500"/> {app.service}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a 
                            href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-green-100 transition-colors"
                        >
                            <MessageCircle size={16}/> Chat
                        </a>
                        
                        <div className="flex rounded-lg bg-gray-50 border border-gray-200 p-1">
                            <button onClick={() => handleUpdateStatus(app.id, 'confirmed')} className="p-1.5 hover:bg-white text-green-600 rounded" title="Confirmar"><CheckCircle size={18}/></button>
                            <button onClick={() => handleUpdateStatus(app.id, 'completed')} className="p-1.5 hover:bg-white text-blue-600 rounded" title="Completar"><CheckCheck size={18}/></button>
                            <button onClick={() => handleUpdateStatus(app.id, 'cancelled')} className="p-1.5 hover:bg-white text-red-600 rounded" title="Cancelar"><XCircle size={18}/></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AgendaFullView;
