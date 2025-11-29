
import React, { useState } from 'react';
import { Client } from '../types';
import { MessageCircle, ChevronDown, ChevronUp, History, Plus, X, Save } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

interface ClientsViewProps {
  clients: Client[];
}

const ClientsView: React.FC<ClientsViewProps> = ({ clients }) => {
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });

  const getRecentVisitsCount = (history: any[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return history.filter(h => new Date(h.date) >= thirtyDaysAgo).length;
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    try {
        // Create an appointment dummy to register client logic if 'clients' collection isn't isolated yet
        // OR add directly to appointments collection as a historical record to trigger client detection
        // For this view, let's create a direct reservation with status 'completed' to register them
        await addDoc(collection(db, 'appointments'), {
            client_name: newClient.name,
            phone: newClient.phone,
            email: newClient.email,
            service: 'Registro Manual',
            date: new Date().toISOString().split('T')[0],
            time: '00:00',
            status: 'completed',
            created_at: new Date().toISOString()
        });
        setShowAddModal(false);
        setNewClient({ name: '', phone: '', email: '' });
        alert("Cliente agregado exitosamente");
    } catch (e) {
        console.error(e);
        alert("Error al agregar cliente");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-2xl text-rose-950 font-bold">Directorio de Clientes</h2>
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-rose-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-rose-800"
            >
                <Plus size={18} /> Nuevo Cliente
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-rose-50/50 text-rose-900 text-xs uppercase tracking-wider font-bold">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Registro</th>
                        <th className="p-4">Visitas (30d)</th>
                        <th className="p-4">Estatus</th>
                        <th className="p-4">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-50">
                    {clients.map(client => (
                        <React.Fragment key={client.id}>
                            <tr className={`hover:bg-rose-50/30 transition-colors ${expandedClientId === client.id ? 'bg-rose-50/50' : ''}`}>
                                <td className="p-4">
                                    <div className="font-medium text-neutral-800">{client.name}</div>
                                    <div className="text-xs text-neutral-400">{client.phone}</div>
                                </td>
                                <td className="p-4 text-sm text-neutral-600">{client.registration_date}</td>
                                <td className="p-4 text-sm text-neutral-600 font-bold">{getRecentVisitsCount(client.history || [])}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${client.type === 'VIP' ? 'bg-gold-100 text-gold-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                        {client.type}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                    <a 
                                        href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors border border-green-200"
                                    >
                                        <MessageCircle size={16} /> Chat
                                    </a>
                                    <button
                                        onClick={() => setExpandedClientId(expandedClientId === client.id ? null : client.id)}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                    >
                                        {expandedClientId === client.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                        {expandedClientId === client.id ? 'Ocultar' : 'Ver'}
                                    </button>
                                </td>
                            </tr>
                            {expandedClientId === client.id && (
                                <tr className="bg-neutral-50 shadow-inner">
                                    <td colSpan={5} className="p-6">
                                        <div className="bg-white rounded-xl border border-neutral-200 p-4">
                                            <h4 className="text-sm font-bold text-neutral-700 mb-4 flex items-center gap-2"><History size={16}/> Historial</h4>
                                            {client.history && client.history.length > 0 ? (
                                                <table className="w-full text-sm">
                                                    <thead className="text-neutral-500 text-xs border-b border-neutral-100">
                                                        <tr>
                                                            <th className="pb-2 text-left">Fecha</th>
                                                            <th className="pb-2 text-left">Servicio</th>
                                                            <th className="pb-2 text-right">Valor</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-50">
                                                        {client.history.map((record, idx) => (
                                                            <tr key={idx}>
                                                                <td className="py-2 text-neutral-600">{record.date}</td>
                                                                <td className="py-2 text-neutral-800 font-medium">{record.service}</td>
                                                                <td className="py-2 text-right text-neutral-600">${record.price.toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : <p className="text-sm text-neutral-400">Sin historial.</p>}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add Client Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif text-xl text-rose-950 font-bold">Agregar Cliente</h3>
                        <button onClick={() => setShowAddModal(false)}><X size={20} className="text-neutral-400"/></button>
                    </div>
                    <form onSubmit={handleAddClient} className="space-y-4">
                        <input 
                            placeholder="Nombre Completo" required
                            className="w-full border border-neutral-200 rounded-xl px-4 py-3"
                            value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                        />
                        <input 
                            placeholder="Teléfono (con país)" required type="tel"
                            className="w-full border border-neutral-200 rounded-xl px-4 py-3"
                            value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                        />
                         <input 
                            placeholder="Email" type="email"
                            className="w-full border border-neutral-200 rounded-xl px-4 py-3"
                            value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})}
                        />
                        <button type="submit" className="w-full bg-rose-900 text-white font-bold py-3 rounded-xl hover:bg-rose-800 flex items-center justify-center gap-2">
                            <Save size={18}/> Guardar Cliente
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default ClientsView;
