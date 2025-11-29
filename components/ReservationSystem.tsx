
import React, { useState } from 'react';
import { SERVICES_LIST } from '../constants';
import { User, Phone, CheckCircle, ChevronDown, AlertCircle, Mail } from 'lucide-react';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore'; 

const ReservationSystem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    service: SERVICES_LIST[0],
    date: '',
    time: ''
  });

  // Alternative Hours State
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [suggestedHours, setSuggestedHours] = useState<string[]>([]);
  
  const [successMsg, setSuccessMsg] = useState('');

  // Simulates checking availability when user types a time
  const handleTimeBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    // Simulate that 10:00 and 15:00 are "busy"
    if (time === '10:00' || time === '15:00') {
      setShowAlternatives(true);
      const hour = parseInt(time.split(':')[0]);
      setSuggestedHours([
        `${hour - 1}:30`,
        `${hour}:45`,
        `${hour + 1}:15`
      ]);
    } else {
      setShowAlternatives(false);
    }
  };

  const selectAlternative = (time: string) => {
    setFormData({ ...formData, time });
    setShowAlternatives(false);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const newReservation = {
      client_name: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (db) {
      try {
        // Enviar EXCLUSIVAMENTE a Firebase. 
        // El nuevo CRM escuchará estos cambios automáticamente.
        await addDoc(collection(db, 'appointments'), newReservation);
        
        // Feedback de éxito
        setSuccessMsg('¡Reserva solicitada con éxito! Te contactaremos por WhatsApp para confirmar.');
        setFormData({ clientName: '', phone: '', email: '', service: SERVICES_LIST[0], date: '', time: '' });
        setTimeout(() => setSuccessMsg(''), 6000);
      } catch (err) {
        console.error("Error al guardar en Firebase", err);
        setErrorMsg("Hubo un problema de conexión. Por favor intenta contactarnos por WhatsApp.");
      }
    } else {
        console.warn("Firebase no configurado");
        setErrorMsg("Error de configuración del sistema.");
    }

    setLoading(false);
  };

  return (
    <div id="reservations" className="py-24 bg-rose-50 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-rose-950 mb-4">Agenda tu Experiencia</h2>
          <p className="mt-4 text-neutral-500 max-w-lg mx-auto">Selecciona el día y la hora para consentirte. Nosotros nos encargamos del resto.</p>
        </div>

        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_40px_rgba(251,113,133,0.1)] border border-rose-100">
            {successMsg ? (
              <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl text-green-800 font-serif mb-2">¡Solicitud Recibida!</h3>
                <p className="text-green-700/80 text-sm mb-6">{successMsg}</p>
                <button onClick={() => setSuccessMsg('')} className="text-xs uppercase font-bold text-green-600 hover:text-green-800 underline">Hacer otra reserva</button>
              </div>
            ) : (
            <form onSubmit={handleBook} className="space-y-5">
              <div>
                <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">Nombre Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.clientName}
                    onChange={e => setFormData({...formData, clientName: e.target.value})}
                    className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-3 pl-12 pr-4 text-neutral-700 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-neutral-400"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">WhatsApp</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-3 pl-12 pr-4 text-neutral-700 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-neutral-400"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-3 pl-12 pr-4 text-neutral-700 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-neutral-400"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">Fecha</label>
                  <div className="relative">
                      <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-3 px-4 text-neutral-700 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">Hora</label>
                  <div className="relative">
                    <input 
                      required
                      type="time" 
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      onBlur={handleTimeBlur}
                      className={`w-full bg-rose-50/50 border rounded-xl py-3 px-4 text-neutral-700 focus:outline-none focus:ring-2 transition-all text-sm ${showAlternatives ? 'border-orange-300 ring-2 ring-orange-100' : 'border-rose-100 focus:border-rose-400 focus:bg-white focus:ring-rose-100'}`}
                    />
                  </div>
                </div>
              </div>

              {showAlternatives && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold uppercase">Hora muy solicitada</span>
                  </div>
                  <p className="text-xs text-orange-600/80 mb-3">Ese horario suele estar lleno. Te sugerimos estas alternativas:</p>
                  <div className="flex gap-2">
                    {suggestedHours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => selectAlternative(h)}
                        className="px-3 py-1.5 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold text-rose-900/60 mb-2 ml-1">Servicio Deseado</label>
                <div className="relative">
                  <select 
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-3 pl-4 pr-10 text-neutral-700 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all appearance-none cursor-pointer"
                  >
                    {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-rose-300 pointer-events-none" size={16} />
                </div>
              </div>

              {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} /> {errorMsg}
                  </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 mt-2 bg-rose-900 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-rose-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReservationSystem;
