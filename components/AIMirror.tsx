import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Loader2, Camera, ScanFace } from 'lucide-react';
import { analyzeImageAndSuggestStyle } from '../services/geminiService';
import { VisionAnalysis } from '../types';

interface AIMirrorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIMirror: React.FC<AIMirrorProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisionAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data url prefix for API
        const base64Data = base64String.split(',')[1];
        setImage(base64Data);
        // Display image needs the prefix
        setPreviewImage(base64String);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const analysis = await analyzeImageAndSuggestStyle(image);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Lo sentimos, hubo un error conectando con el consultor IA. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-midnight-800 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white bg-black/50 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Panel: Image Input */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-midnight-900 to-midnight-800 border-r border-white/5">
          <h2 className="text-3xl font-serif text-gold-400 mb-2">Espejo Virtual</h2>
          <p className="text-white/60 text-center mb-8 text-sm">Sube una selfie para un análisis de visagismo instantáneo.</p>

          <div 
            className="relative w-full aspect-[3/4] max-w-sm bg-black/40 border-2 border-dashed border-gold-500/30 rounded-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-gold-500/60 transition-colors group"
            onClick={() => !previewImage && fileInputRef.current?.click()}
          >
            {previewImage ? (
              <>
                <img src={previewImage} alt="User" className="w-full h-full object-cover" />
                {!loading && !result && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(null);
                      setImage(null);
                      setResult(null);
                    }}
                    className="absolute bottom-4 bg-black/70 text-white px-4 py-2 rounded-full text-xs hover:bg-red-900/80 transition-colors"
                  >
                    Cambiar Foto
                  </button>
                )}
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="text-gold-500" size={32} />
                </div>
                <p className="text-gold-200 font-medium">Sube tu foto</p>
                <p className="text-white/30 text-xs mt-2">JPG o PNG</p>
              </div>
            )}
            
            {/* Analysis Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <Loader2 className="text-gold-500 animate-spin mb-2" size={48} />
                <p className="text-gold-200 animate-pulse font-serif">Analizando facciones...</p>
              </div>
            )}
            
             {/* Scan Effect Overlay */}
             {loading && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-gold-500/50 shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-[float_2s_linear_infinite]" style={{ animation: 'scan 2s linear infinite' }}></div>
              </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />

          {!result && previewImage && !loading && (
            <button 
              onClick={handleAnalysis}
              className="mt-6 px-8 py-3 bg-gold-500 text-black font-semibold rounded-none tracking-widest hover:bg-white transition-colors flex items-center gap-2"
            >
              <Sparkles size={18} />
              ANALIZAR AHORA
            </button>
          )}
        </div>

        {/* Right Panel: Results */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-midnight-900/50">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <ScanFace size={64} className="mb-4" />
              <p className="font-serif text-xl">Los resultados aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right duration-700">
              <div className="border-b border-gold-500/20 pb-4">
                <h3 className="text-gold-500 font-serif text-2xl mb-1">Tu Diagnóstico de Estilo</h3>
                <div className="flex gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gold-500 rounded-full"></span> {result.faceShape}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gold-500 rounded-full"></span> {result.skinTone}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4 rounded-lg border-l-2 border-l-gold-500">
                  <p className="text-xs text-gold-400 uppercase tracking-widest mb-1">Cabello Recomendado</p>
                  <p className="text-xl font-serif text-white">{result.suggestedHair}</p>
                </div>
                
                <div className="glass-card p-4 rounded-lg border-l-2 border-l-gold-500">
                  <p className="text-xs text-gold-400 uppercase tracking-widest mb-1">Maquillaje Ideal</p>
                  <p className="text-xl font-serif text-white">{result.suggestedMakeup}</p>
                </div>
                
                <div className="glass-card p-4 rounded-lg border-l-2 border-l-gold-500">
                  <p className="text-xs text-gold-400 uppercase tracking-widest mb-1">Uñas Signature</p>
                  <p className="text-xl font-serif text-white">{result.suggestedNails}</p>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-lg mt-6">
                <p className="text-gold-200 italic font-serif leading-relaxed">"{result.reasoning}"</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full mt-4 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all uppercase tracking-widest text-sm"
              >
                Reservar este Look
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AIMirror;
