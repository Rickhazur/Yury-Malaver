
import React from 'react';
import { TrendingUp, Calendar, Users, ShoppingBag, Sparkles, Tag, LogOut, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout, isConnected }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'agenda', label: 'Calendario', icon: Calendar },
    { id: 'agenda-list', label: 'Agenda Lista', icon: LayoutGrid },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'inventory', label: 'Inventario', icon: ShoppingBag },
    { id: 'marketing', label: 'IA Marketing', icon: Sparkles },
    { id: 'promotions', label: 'Promociones', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-white border-r border-rose-100 hidden md:flex flex-col h-full">
      <div className="p-8 border-b border-rose-50">
        <h2 className="font-serif text-2xl text-rose-950 font-bold">Panel Admin</h2>
        <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <p className="text-xs text-green-700 tracking-widest uppercase">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-rose-900 text-white shadow-lg shadow-rose-900/20' : 'text-neutral-500 hover:bg-rose-50 hover:text-rose-900'}`}
          >
            <item.icon size={20} /> 
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-rose-50">
          <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 text-red-400 hover:text-red-600 px-4 py-2 transition-colors text-sm"
          >
              <LogOut size={16} /> Cerrar Sesión
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
