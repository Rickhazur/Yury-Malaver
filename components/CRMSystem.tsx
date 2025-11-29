
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, orderBy, limit, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Reservation, Client, Promotion } from '../types';
import { localStore } from '../state';
import { RefreshCw, WifiOff } from 'lucide-react';

// Modular Imports
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import AgendaView from './AgendaView';
import AgendaFullView from './AgendaFullView';
import ClientsView from './ClientsView';
import InventoryView from './InventoryView';
import AiMarketingView from './AiMarketingView';

interface CRMSystemProps {
  onLogout: () => void;
}

const CRMSystem: React.FC<CRMSystemProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Shared State
  const [appointments, setAppointments] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionErrorMsg, setConnectionErrorMsg] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  // --- 1. Verify Connection ---
  const verifyConnection = async () => {
    setConnectionStatus('checking');
    setConnectionErrorMsg('');
    if (!db) {
        setConnectionStatus('error');
        setConnectionErrorMsg("Cliente Firebase no inicializado.");
        return;
    }
    try {
        await getDocs(query(collection(db, 'appointments'), limit(1)));
        setConnectionStatus('connected');
    } catch (error: any) {
        console.error("Connection Check Failed:", error);
        setConnectionStatus('error');
        setConnectionErrorMsg(error.message || "Error de conexión.");
    }
  };

  useEffect(() => { verifyConnection(); }, []);

  // --- 2. Data Fetching ---
  useEffect(() => {
    if (connectionStatus !== 'connected' || !db) return;
    setLoadingData(true);

    // Fetch Appointments
    const q = query(collection(db, "appointments"), orderBy("created_at", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reservation[];
        setAppointments(data);
        processClients(data); // Deduce clients from appointments
        setLoadingData(false);
    });

    // Promotions (Local)
    setPromotions(localStore.getPromotions());
    const unsubPromos = localStore.subscribe(() => setPromotions(localStore.getPromotions()));

    return () => { unsub(); unsubPromos(); };
  }, [connectionStatus]);

  // Helper: Deduce clients from history (Shared logic)
  const processClients = (data: Reservation[]) => {
      const map = new Map();
      [...data].reverse().forEach(app => {
          if (!map.has(app.phone)) {
              map.set(app.phone, {
                  id: app.phone, name: app.client_name, phone: app.phone, email: app.email || '',
                  type: 'Nuevo', registration_date: app.date, history: []
              });
          }
          const c = map.get(app.phone);
          c.history.push({ id: app.id, date: app.date, service: app.service, price: 80000 });
          if (c.history.length > 5) c.type = 'VIP';
          else if (c.history.length > 2) c.type = 'Frecuente';
      });
      setClients(Array.from(map.values()));
  };

  // Promotion Handlers (passed to Promotion View if separated, or kept here if simple)
  // For simplicity, we'll keep Promotion logic inline or make a simple view component later if needed.
  // The user asked for specific views, promotions wasn't explicitly requested as a separate file but serves as one.

  if (connectionStatus === 'checking') return <div className="min-h-screen flex items-center justify-center text-rose-900">Verificando...</div>;
  if (connectionStatus === 'error') return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <h2 className="text-xl font-bold text-red-600 flex gap-2"><WifiOff/> Error de Conexión</h2>
            <p className="text-neutral-600 mt-2 mb-4">{connectionErrorMsg}</p>
            <button onClick={verifyConnection} className="bg-rose-900 text-white px-4 py-2 rounded-lg">Reintentar</button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-rose-50/30 font-sans">
      <Sidebar 
        activeView={activeTab} 
        onViewChange={setActiveTab} 
        onLogout={onLogout} 
        isConnected={connectionStatus === 'connected'} 
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
         {activeTab === 'dashboard' && <DashboardView clients={clients} appointments={appointments} />}
         {activeTab === 'agenda' && <AgendaView appointments={appointments} />}
         {activeTab === 'agenda-list' && <AgendaFullView appointments={appointments} />}
         {activeTab === 'clients' && <ClientsView clients={clients} />}
         {activeTab === 'inventory' && <InventoryView />}
         {activeTab === 'marketing' && <AiMarketingView />}
         
         {/* Simple inline Promotions View since file wasn't requested explicitly but link exists */}
         {activeTab === 'promotions' && (
             <div className="animate-in fade-in">
                 <h2 className="font-serif text-2xl text-rose-950 font-bold mb-4">Promociones Activas</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {promotions.map(p => (
                         <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-rose-50">
                             <h4 className="font-bold">{p.title}</h4>
                             <p className="text-sm text-neutral-500">{p.description}</p>
                             <button 
                                onClick={() => localStore.deletePromotion(p.id)}
                                className="text-red-400 text-xs font-bold mt-2 hover:text-red-600"
                             >
                                 ELIMINAR
                             </button>
                         </div>
                     ))}
                     {promotions.length === 0 && <p>No hay promociones activas.</p>}
                 </div>
                 {/* Add form could be added here similar to before */}
             </div>
         )}
      </main>
    </div>
  );
};

export default CRMSystem;
