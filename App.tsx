
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Instagram, Facebook, Calendar, MapPin, MessageCircle, Star, Heart, Check, Scissors, Coffee, User, Tag, Lock, X } from 'lucide-react';
import ReservationSystem from './components/ReservationSystem';
import CRMSystem from './components/CRMSystem';
import { PALETTE_COLORS, SERVICES_LIST } from './constants';
import { localStore } from './state';
import { Promotion } from './types';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>(localStore.getPromotions());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Admin Login State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Subscribe to promotions updates
    setActivePromotions(localStore.getPromotions());
    const unsubscribe = localStore.subscribe(() => {
        setActivePromotions([...localStore.getPromotions()]);
    });

    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
        window.removeEventListener('scroll', handleScroll);
        unsubscribe();
        observer.disconnect();
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === 'estilos25') {
          setIsAdminLoggedIn(true);
          setShowLoginModal(false);
          setAdminPassword('');
      } else {
          alert('Contraseña incorrecta');
      }
  };

  // If Admin is logged in, show CRM instead of Landing Page
  if (isAdminLoggedIn) {
      return <CRMSystem onLogout={() => setIsAdminLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden" onMouseMove={handleMouseMove}>
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-lg py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-rose-950 tracking-wider cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            YURY MALAVER
            <span className="text-gold-600 text-[10px] block font-sans font-medium tracking-[0.3em] uppercase">Beauty & Wellness</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-neutral-600 font-medium">
            <button onClick={() => scrollToSection('menu')} className="hover:text-gold-600 transition-colors">Servicios</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-gold-600 transition-colors">Experiencia</button>
            <button onClick={() => scrollToSection('reservations')} className="hover:text-gold-600 transition-colors">Citas</button>
          </div>
          <button 
            onClick={() => scrollToSection('reservations')}
            className="px-6 py-2 bg-rose-50 border border-rose-200 text-rose-900 hover:bg-rose-100 hover:shadow-md transition-all duration-300 uppercase text-xs tracking-widest font-bold rounded-full"
          >
            Agendar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2574&auto=format&fit=crop" 
            alt="Fusión IA y Alta Costura" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-white/5 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-200/10 to-gold-200/10 animate-pulse mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl pt-20">
          <div className="inline-block mb-8 px-4 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-sm animate-fade-in-up">
            <p className="text-rose-950 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={12} className="text-white drop-shadow-md" />
              Tu mejor versión comienza aquí
            </p>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-8 leading-[0.85] tracking-tight relative perspective-1000">
             <div 
                className="inline-block text-rose-100/90 mix-blend-overlay drop-shadow-lg transition-transform duration-100 ease-out"
                style={{ 
                    transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
                }}
             >
                Belleza que
             </div>
             <br/>
             <div 
                className="inline-block italic text-white/95 mix-blend-overlay transition-transform duration-100 ease-out bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent"
                style={{ 
                    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) rotate(${mousePos.x * 1}deg)`,
                }}
             >
                Inspira
             </div>
          </h1>
          
          <p 
            className="text-lg md:text-xl text-rose-950/80 max-w-xl mx-auto mb-10 font-medium leading-relaxed animate-fade-in-up drop-shadow-sm bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-lg" 
            style={{
                animationDelay: '0.2s',
                transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`
            }}
          >
            Fusionamos <span className="font-bold text-rose-950">Inteligencia Artificial</span> con <span className="font-bold text-rose-950">Alta Peluquería</span> para diseñar tu estilo personal. Analiza tus rasgos, visualiza tu look ideal y transfórmate con nuestros expertos.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <button 
              onClick={() => scrollToSection('reservations')}
              className="px-10 py-4 bg-rose-900/90 backdrop-blur-sm text-white font-medium rounded-full hover:bg-rose-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-rose-900/20"
            >
              Reservar mi Cita <Heart size={16} className="fill-current" />
            </button>
            <button 
               onClick={() => scrollToSection('menu')}
               className="px-10 py-4 bg-white/40 backdrop-blur-md text-rose-950 font-bold rounded-full border border-white/50 hover:bg-white/60 transition-all duration-300 shadow-sm"
            >
              Ver Servicios
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC PROMOTIONS SECTION */}
      {activePromotions.length > 0 && (
        <section className="py-16 bg-rose-950 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="max-w-7xl mx-auto px-6 relative z-10">
                 <div className="mb-10 text-center md:text-left">
                     <h3 className="text-3xl font-serif font-bold text-white flex items-center justify-center md:justify-start gap-3">
                         <Tag className="text-gold-500" /> Ofertas Exclusivas
                     </h3>
                     <p className="text-rose-200/80 mt-2">Disfruta de nuestros beneficios por tiempo limitado.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {activePromotions.map(promo => (
                         <div key={promo.id} className="bg-white rounded-2xl overflow-hidden shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                             {promo.image && (
                                 <div className="h-48 overflow-hidden relative">
                                     <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                                     <div className="absolute top-4 right-4 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                         Oferta
                                     </div>
                                 </div>
                             )}
                             <div className="p-6 flex-1 flex flex-col">
                                 <h4 className="font-serif font-bold text-xl text-rose-950 mb-2">{promo.title}</h4>
                                 <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">{promo.description}</p>
                                 
                                 <div className="pt-4 border-t border-rose-50 flex justify-between items-center">
                                     {promo.discount_code ? (
                                         <div className="flex flex-col">
                                             <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Tu Código</span>
                                             <span className="font-mono font-bold text-gold-600 text-lg">{promo.discount_code}</span>
                                         </div>
                                     ) : <span></span>}
                                     <button onClick={() => scrollToSection('reservations')} className="text-xs font-bold bg-rose-900 text-white px-4 py-2 rounded-lg hover:bg-rose-800 transition-colors uppercase">
                                         Canjear
                                     </button>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </section>
      )}

      {/* Featured Services (Bento Grid) */}
      <section id="featured" className="py-20 px-6 bg-cream-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-rose-950 mb-4">Favoritos del Salón</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-rows-[auto_auto]">
            
            {/* Card 1: Hair Cuts */}
            <div className="md:col-span-2 lg:col-span-2 row-span-2 group relative h-[500px] overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-500 scroll-animate opacity-0" style={{ animationDelay: '0.1s' }}>
              <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1000&auto=format&fit=crop" alt="Corte de Cabello Alta Costura" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Trending</span>
                <h3 className="text-4xl font-serif mb-2">Diseño Capilar Couture</h3>
                <p className="text-rose-100 mb-6 text-sm max-w-md font-light">
                  Tendencias globales y cortes de precisión que definen tu estilo. Desde Bobs italianos hasta capas texturizadas que transforman tu presencia.
                </p>
                <button onClick={() => scrollToSection('reservations')} className="text-white border-b border-white/50 pb-1 hover:border-white transition-colors text-xs uppercase tracking-widest">
                  Quiero este look
                </button>
              </div>
            </div>

            {/* Card 2: Styling */}
            <div className="md:col-span-1 lg:col-span-1 h-[240px] group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-shadow scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1000&auto=format&fit=crop" alt="Hair Salon" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-serif mb-1">Corte & Estilo</h3>
                <p className="text-xs text-white/90">Diseños que resaltan tu rostro.</p>
              </div>
            </div>

            {/* Card 3: Advisory */}
            <div className="md:col-span-1 lg:col-span-1 h-[240px] bg-rose-100 group relative overflow-hidden rounded-3xl flex flex-col justify-center items-center text-center p-6 hover:bg-rose-200 transition-colors scroll-animate opacity-0" style={{ animationDelay: '0.3s' }}>
               <Sparkles className="text-rose-900 mb-3" size={32} />
               <h3 className="text-xl font-serif text-rose-950 mb-2">Asesoría de Imagen</h3>
               <p className="text-xs text-rose-800/80 leading-relaxed">
                 Descubre qué tonos y cortes te favorecen con nuestra tecnología exclusiva.
               </p>
            </div>

            {/* Card 4: Color */}
            <div className="md:col-span-2 lg:col-span-2 h-[240px] group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-shadow scroll-animate opacity-0" style={{ animationDelay: '0.4s' }}>
              <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1000&auto=format&fit=crop" alt="Color Hair Balayage" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-serif mb-1">Coloración Experta</h3>
                <p className="text-sm text-rose-100/90">Balayage, Babylights y Rubios saludables.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED MENU SECTION */}
      <section id="menu" className="py-24 bg-rose-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
           <div className="text-center mb-16">
              <span className="text-gold-600 uppercase tracking-widest text-xs font-bold">Carta de Servicios</span>
              <h2 className="text-4xl md:text-5xl font-serif text-rose-950 mt-3">Nuestro Menú de Belleza</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
              <div className="space-y-10">
                 <div>
                    <h3 className="text-2xl font-serif text-rose-900 border-b border-rose-100 pb-3 mb-6 flex items-center gap-2">
                       <Scissors size={20} className="text-gold-500"/> Cabello
                    </h3>
                    <ul className="space-y-6">
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Corte Diseño Visagismo</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">Desde $80.000</span>
                       </li>
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Balayage / Babylights</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">Desde $250.000</span>
                       </li>
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Hidratación Profunda</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">Desde $90.000</span>
                       </li>
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Peinados para Eventos</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">Consultar</span>
                       </li>
                    </ul>
                 </div>
              </div>

              <div className="space-y-10">
                 <div>
                    <h3 className="text-2xl font-serif text-rose-900 border-b border-rose-100 pb-3 mb-6 flex items-center gap-2">
                       <Star size={20} className="text-gold-500"/> Manos y Pies
                    </h3>
                    <ul className="space-y-6">
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <div className="flex flex-col">
                             <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Manicura Semipermanente</span>
                             <span className="text-xs text-neutral-400">Incluye limpieza rusa</span>
                          </div>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">$60.000</span>
                       </li>
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Uñas Esculpidas (Acrílico/Gel)</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">$120.000</span>
                       </li>
                       <li className="flex justify-between items-baseline group cursor-pointer">
                          <span className="text-neutral-700 font-medium group-hover:text-rose-600 transition-colors">Pedicura Spa</span>
                          <span className="w-full border-b border-dotted border-neutral-300 mx-4"></span>
                          <span className="text-neutral-500 text-sm">$70.000</span>
                       </li>
                    </ul>
                 </div>
                 
                 <div className="bg-white p-6 rounded-2xl border border-rose-100 mt-8 shadow-sm">
                    <h4 className="font-serif text-lg text-rose-900 mb-2">Asesoría de Imagen Personalizada</h4>
                    <p className="text-sm text-neutral-600 mb-4">
                       Incluye análisis de colorimetría, visagismo facial y propuesta de cambio de look integral.
                    </p>
                    <button onClick={() => scrollToSection('reservations')} className="text-xs font-bold text-gold-600 uppercase tracking-widest hover:text-gold-700 flex items-center gap-1">
                       Agendar Diagnóstico <ArrowRight size={12}/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-600 uppercase tracking-widest text-xs font-bold">El Proceso</span>
            <h2 className="text-4xl md:text-5xl font-serif text-rose-950 mt-3">Vive la Experiencia</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-gold-200 to-transparent z-0"></div>

             <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
                <div className="w-24 h-24 rounded-full bg-white border border-rose-100 shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-500 relative">
                   <div className="absolute inset-0 rounded-full bg-rose-50 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                   <Calendar className="text-rose-900 group-hover:text-gold-600 transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-serif text-rose-950 mb-3">1. Reserva Tu Espacio</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs px-4">
                  Selecciona tu servicio ideal y horario preferido en nuestra plataforma online o vía WhatsApp.
                </p>
             </div>

             <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
                <div className="w-24 h-24 rounded-full bg-white border border-rose-100 shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-500 relative">
                    <div className="absolute inset-0 rounded-full bg-rose-50 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                   <User className="text-rose-900 group-hover:text-gold-600 transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-serif text-rose-950 mb-3">2. Diagnóstico Experto</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs px-4">
                  Nuestros estilistas analizan tus rasgos y tono de piel para diseñar un look a tu medida.
                </p>
             </div>

             <div className="relative z-10 flex flex-col items-center text-center group cursor-default">
                <div className="w-24 h-24 rounded-full bg-white border border-rose-100 shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400 transition-all duration-500 relative">
                   <div className="absolute inset-0 rounded-full bg-rose-50 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                   <Coffee className="text-rose-900 group-hover:text-gold-600 transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-serif text-rose-950 mb-3">3. Transformación Luxury</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs px-4">
                  Relájate con una bebida de cortesía mientras realzamos tu belleza natural.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Palette Marquee */}
      <section className="py-12 bg-white overflow-hidden border-t border-rose-100">
        <div className="flex whitespace-nowrap gap-12 animate-shimmer w-[200%]">
           {[...PALETTE_COLORS, ...PALETTE_COLORS, ...PALETTE_COLORS, ...PALETTE_COLORS].map((color, i) => (
             <span key={i} className="text-3xl md:text-5xl font-serif text-rose-950/20 font-medium uppercase tracking-widest mx-4">
               {color}
             </span>
           ))}
        </div>
      </section>

      {/* Reservation System */}
      <ReservationSystem />

      {/* Footer */}
      <footer className="bg-rose-950 text-rose-100/80 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
          <div className="md:w-1/3">
            <div className="text-2xl font-serif font-bold text-white tracking-wider mb-6">
              YURY MALAVER
            </div>
            <p className="text-rose-200/60 text-sm leading-relaxed mb-6">
              Tu santuario de belleza. Creemos en realzar tu esencia natural con técnicas de vanguardia y productos de lujo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-rose-950 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-rose-950 transition-colors"><Facebook size={18} /></a>
            </div>
          </div>
          
          <div className="md:w-1/3">
             <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">Visítanos</h4>
             <div className="flex items-start gap-3 text-rose-200/60 text-sm mb-4">
                <MapPin className="mt-1 shrink-0 text-gold-500" size={18} />
                <p>Av. Luxury 123, Zona Rosa<br />Bogotá, Colombia</p>
             </div>
             <div className="flex items-center gap-3 text-rose-200/60 text-sm">
                <Calendar className="shrink-0 text-gold-500" size={18} />
                <p>Lun - Sab: 9:00 AM - 8:00 PM</p>
             </div>
          </div>

          <div className="md:w-1/4">
             <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-xs">Contáctanos</h4>
             <ul className="space-y-4 text-rose-200/60 text-sm">
               <li>+57 300 123 4567</li>
               <li>citas@yurymalaver.com</li>
             </ul>
          </div>
        </div>
        
        {/* Footer Bottom with Discreet Admin Lock */}
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Yury Malaver Beauty Salon.</span>
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="p-2 hover:text-white/50 transition-colors"
            title="Admin Login"
          >
            <Lock size={12} />
          </button>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/573001234567" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-110 transition-transform animate-bounce flex items-center gap-2 group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} fill="white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium text-sm">Agenda tu cita</span>
      </a>

      {/* ADMIN LOGIN MODAL */}
      {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/80 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl text-rose-950 font-bold">Admin Access</h3>
                      <button onClick={() => setShowLoginModal(false)} className="text-neutral-400 hover:text-neutral-600"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                          <label className="text-xs uppercase font-bold text-neutral-500 mb-2 block">Contraseña</label>
                          <input 
                              type="password"
                              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none"
                              autoFocus
                              value={adminPassword}
                              onChange={e => setAdminPassword(e.target.value)}
                          />
                      </div>
                      <button type="submit" className="w-full bg-rose-900 text-white font-bold py-3 rounded-lg hover:bg-rose-800 transition-colors">
                          Entrar
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;
