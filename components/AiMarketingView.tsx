
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, FileText, Copy, Check, Send, Globe, Crown, Smartphone, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { localStore } from '../state';
import { Client } from '../types';
import { SERVICES_LIST, APP_NAME } from '../constants';

const AiMarketingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'vip'>('create');
  
  // Generator State
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');

  // VIP Campaign State
  const [selectedPromoForVip, setSelectedPromoForVip] = useState('');
  const [vipClients] = useState<Client[]>(localStore.getClients().filter(c => c.type === 'VIP'));

  const quickPrompts = [
    { label: 'Uñas Tinto Signature', icon: '💅', text: 'Crea una promoción elegante para nuestro servicio exclusivo "Uñas Tinto Signature", destacando la durabilidad y el tono vino profundo.' },
    { label: 'Balayage Premium', icon: '👱‍♀️', text: 'Genera una oferta de temporada para "Balayage & Rubios Perfectos", enfocada en iluminación natural y salud capilar.' },
    { label: 'Pack Novias', icon: '👰', text: 'Diseña una campaña emotiva y lujosa para el "Pack de Novias" (Maquillaje + Peinado + Preparación de piel).' },
    { label: 'Visagismo IA', icon: '✨', text: 'Invita a las clientas a probar nuestro diagnóstico de "Visagismo con IA" gratuito al agendar un corte.' }
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedText('');
    setGeneratedImage(null);
    setPublishStatus('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        // 1. Generate Text
        // We inject the specific services list to give the AI context about the brand
        const systemContext = `
          Eres el Director de Marketing de "${APP_NAME}", un salón de belleza de Alta Costura y Tecnología.
          Nuestros servicios principales son: ${SERVICES_LIST.join(', ')}.
          Tu tono de voz es: Elegante, Sofisticado, Exclusivo y Cercano.
          Nunca uses emojis en exceso. Usa un lenguaje de lujo.
        `;

        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemContext}\n\nTarea: Crea un título corto y una descripción persuasiva para una promoción basada en: "${prompt}". 
            Devuelve SOLO un objeto JSON válido con este formato: {"title": "...", "description": "..."}`,
            config: { responseMimeType: 'application/json' }
        });
        
        let textData = { title: "Promoción Especial", description: textResponse.text || "" };
        try {
            textData = JSON.parse(textResponse.text || "{}");
        } catch (e) {
            console.warn("Could not parse JSON", e);
        }
        setGeneratedText(JSON.stringify(textData)); 

        // 2. Generate Image (Simulation logic based on prompt keywords)
        // Since we are in a demo environment without a dedicated image gen backend proxy, 
        // we map keywords to high-quality Unsplash IDs to guarantee a beautiful result.
        const lowerPrompt = prompt.toLowerCase();
        let imageUrl = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"; // Default Salon

        if (lowerPrompt.includes('uña') || lowerPrompt.includes('nails') || lowerPrompt.includes('tinto')) {
             imageUrl = "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&w=800&q=80"; // Dark Nails
        } else if (lowerPrompt.includes('novia') || lowerPrompt.includes('boda') || lowerPrompt.includes('matrimonio')) {
             imageUrl = "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80"; // Bridal
        } else if (lowerPrompt.includes('rubio') || lowerPrompt.includes('balayage') || lowerPrompt.includes('color')) {
             imageUrl = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80"; // Hair Color
        } else if (lowerPrompt.includes('corte') || lowerPrompt.includes('cabello')) {
             imageUrl = "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80"; // Haircut
        } else if (lowerPrompt.includes('rostro') || lowerPrompt.includes('facial') || lowerPrompt.includes('visagismo')) {
             imageUrl = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"; // Skincare/Face
        }

        setGeneratedImage(imageUrl);

    } catch (e: any) {
        console.error(e);
        alert("Error generando contenido. Verifica tu conexión.");
    } finally {
        setLoading(false);
    }
  };

  const handlePublish = () => {
      if (!generatedText) return;
      try {
          const data = JSON.parse(generatedText);
          localStore.addPromotion({
              id: Date.now().toString(),
              title: data.title || "Oferta Exclusiva",
              description: data.description || "Contáctanos para más detalles.",
              image: generatedImage || undefined,
              target_audience: 'ALL'
          });
          setPublishStatus('¡Publicado en la página principal!');
          setTimeout(() => setPublishStatus(''), 3000);
      } catch (e) {
          alert("Error al publicar.");
      }
  };

  const handleSendToVIPs = () => {
      // In a real app, this would integrate with Twilio or WhatsApp Business API
      alert(`Simulación: Enviando campaña a ${vipClients.length} clientes VIP vía WhatsApp...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
        <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl text-rose-950 font-bold flex items-center gap-2">
                <Sparkles className="text-gold-500" /> AI Marketing Studio
            </h2>
            <div className="flex bg-white rounded-lg p-1 border border-rose-100">
                <button 
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'create' ? 'bg-rose-100 text-rose-900' : 'text-neutral-500'}`}
                >
                    Generador
                </button>
                <button 
                    onClick={() => setActiveTab('vip')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'vip' ? 'bg-gold-100 text-gold-700' : 'text-neutral-500'}`}
                >
                    Campaña VIP
                </button>
            </div>
        </div>

        {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {/* Quick Prompts */}
                    <div className="grid grid-cols-2 gap-3">
                        {quickPrompts.map((qp, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setPrompt(qp.text)}
                                className="text-left p-3 bg-white border border-rose-50 rounded-xl hover:border-gold-300 hover:shadow-md transition-all group"
                            >
                                <div className="text-lg mb-1 group-hover:scale-110 transition-transform origin-left">{qp.icon}</div>
                                <div className="font-bold text-rose-900 text-xs uppercase tracking-wide">{qp.label}</div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 relative">
                        <label className="block text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
                            <Wand2 size={16} className="text-gold-500"/>
                            ¿Qué quieres promocionar hoy?
                        </label>
                        <textarea 
                            className="w-full border border-rose-100 rounded-xl p-4 text-sm focus:outline-none focus:border-gold-400 min-h-[120px] resize-none"
                            placeholder="Ej: Oferta de día de madres para balayage con hidratación incluida..."
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="w-full mt-4 bg-gold-500 text-white font-bold py-3 rounded-xl hover:bg-gold-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all active:scale-95"
                        >
                            {loading ? <Sparkles className="animate-spin"/> : <Sparkles />} 
                            {loading ? 'La IA está diseñando...' : 'Generar Campaña'}
                        </button>
                    </div>

                    {/* Preview Result */}
                    {generatedText && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 animate-in slide-in-from-bottom-4">
                            <h3 className="font-serif text-lg text-rose-900 font-bold mb-4">Vista Previa del Resultado</h3>
                            
                            <div className="border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
                                {generatedImage && (
                                    <div className="h-48 overflow-hidden relative group">
                                        <img src={generatedImage} alt="Generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-rose-900 shadow-sm flex items-center gap-1">
                                            <ImageIcon size={12}/> Imagen Sugerida
                                        </div>
                                    </div>
                                )}
                                <div className="p-5 bg-rose-50/30">
                                    <h4 className="font-bold text-rose-950 text-lg mb-2">
                                        {JSON.parse(generatedText).title}
                                    </h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                        {JSON.parse(generatedText).description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button 
                                    onClick={handlePublish}
                                    disabled={!!publishStatus}
                                    className="flex-1 bg-rose-900 text-white font-bold py-3 rounded-xl hover:bg-rose-800 flex items-center justify-center gap-2 transition-colors shadow-rose-900/10 shadow-lg"
                                >
                                    {publishStatus ? <Check /> : <Globe size={18} />}
                                    {publishStatus || 'Publicar en Web'}
                                </button>
                                <button 
                                    onClick={() => {navigator.clipboard.writeText(JSON.parse(generatedText).description)}}
                                    className="px-4 py-3 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-50 font-bold"
                                    title="Copiar texto"
                                >
                                    <Copy size={18}/>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info / Tips */}
                <div className="hidden lg:block space-y-4">
                    <div className="bg-gradient-to-br from-gold-50/50 to-rose-50/50 p-6 rounded-2xl border border-gold-100">
                        <h3 className="font-serif text-rose-900 font-bold mb-4 flex items-center gap-2">
                            <Crown size={18} className="text-gold-600"/> Estilo Yury Malaver
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                            La IA ha sido calibrada para usar un tono de "Alta Costura". 
                            Tus promociones reflejarán exclusividad, evitando términos genéricos.
                        </p>
                        <h4 className="font-bold text-xs uppercase text-neutral-500 mb-2">Palabras Clave Detectadas</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Lujo', 'Exclusividad', 'Transformación', 'Arte', 'Bienestar'].map(tag => (
                                <span key={tag} className="bg-white px-2 py-1 rounded-md text-xs text-rose-800 border border-rose-100">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'vip' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50">
                <div className="flex items-center gap-3 mb-6 p-4 bg-gold-50 rounded-xl border border-gold-100">
                    <div className="p-3 bg-white rounded-full text-gold-600 shadow-sm">
                        <Crown size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-rose-900">Audiencia VIP Detectada</h3>
                        <p className="text-sm text-neutral-600">Tienes <span className="font-bold">{vipClients.length} clientes</span> con estatus VIP listos para recibir ofertas exclusivas.</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <label className="block text-sm font-bold text-neutral-700">Mensaje para enviar:</label>
                    <textarea 
                        className="w-full border border-rose-100 rounded-xl p-4 text-sm focus:border-gold-400 focus:outline-none"
                        value={selectedPromoForVip}
                        onChange={e => setSelectedPromoForVip(e.target.value)}
                        placeholder="Hola [Nombre], como nuestro cliente VIP, queremos ofrecerte acceso anticipado a..."
                        rows={4}
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSendToVIPs}
                        disabled={vipClients.length === 0}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Smartphone size={18} /> Enviar a WhatsApps VIP
                    </button>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-neutral-700 mb-4">Lista de Destinatarios</h4>
                    <div className="border border-neutral-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Teléfono</th>
                                    <th className="p-3">Gasto Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {vipClients.map(client => (
                                    <tr key={client.id}>
                                        <td className="p-3 font-medium">{client.name}</td>
                                        <td className="p-3 text-neutral-500">{client.phone}</td>
                                        <td className="p-3 text-rose-900 font-bold">${client.total_spent.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {vipClients.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-neutral-400 italic">
                                            No hay clientes VIP aún. Registra más servicios para desbloquear este nivel.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AiMarketingView;
