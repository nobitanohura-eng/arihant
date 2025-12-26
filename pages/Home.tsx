
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Star, 
  Users, 
  Map, 
  Phone, 
  ChevronRight, 
  Sparkles,
  HeartHandshake,
  Key,
  Plane,
  Building2,
  CheckCircle2,
  Clock,
  Quote,
  Trophy,
  Activity,
  Award,
  Car
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { CONTACT_INFO, LOGO_URL } from '../constants';
import { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';

const Home: React.FC = () => {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      await storageService.init();
      const data = await storageService.getVehicles();
      setVehicles(data.slice(0, 3)); // Just show top 3 on home
    };
    loadData();
  }, []);

  return (
    <div className="space-y-24 md:space-y-40 pb-40 overflow-hidden bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-105"
            alt="Jharkhand Landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/30 to-slate-900/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-4xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Giridih's Leading Fleet</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[9rem] font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl"
            >
              GIRIDIH TO <br />
              <span className="text-amber-500 italic">ANYWHERE.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-lg md:text-2xl text-slate-200 max-w-xl font-bold leading-relaxed opacity-90 pr-10"
            >
              Safe, sanitized, and professional travel. Trusted city rides, outstation journeys, and spiritual pilgrimage tours.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link to="/book" className="px-10 py-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-lg transition-all active:scale-95">
                BOOK RIDE NOW <ChevronRight />
              </Link>
              <a href={`tel:${CONTACT_INFO.phone}`} className="px-10 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 flex items-center justify-center gap-3 text-lg transition-all">
                <Phone size={22} /> CALL {CONTACT_INFO.phone}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Travel Excellence</span>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">EVERYTHING YOU <span className="text-amber-500">NEED.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Local City Rides', icon: <MapPin />, desc: 'Swift city transfers with Baleno & Dzire. Hourly packages available.' },
            { title: 'Outstation Travel', icon: <Map />, desc: 'Safe trips to Dhanbad, Ranchi, Patna & beyond. Reliable inter-city transport.' },
            { title: 'Self-drive Freedom', icon: <Key />, desc: 'Rent from our premium fleet for your independent journey across Jharkhand.' },
            { title: 'Wedding & Events', icon: <HeartHandshake />, desc: 'Decorated luxury cars for your special day with professional chauffeurs.' },
            { title: 'Airport Transfers', icon: <Plane />, desc: 'On-time pickup/drop for Birsa Munda Airport and railway stations.' },
            { title: 'Pilgrimage Tours', icon: <Building2 />, desc: 'Comfortable journeys to Deoghar Baidyanath, Gaya, and Varanasi.' },
          ].map((s, i) => (
            <motion.div 
              key={i} whileHover={{ y: -8 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 group hover:border-amber-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                {React.cloneElement(s.icon as any, { size: 24 })}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{s.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visionary Section: FIXED MOBILE SCALING & POSITIONING */}
      <section className="max-w-7xl mx-auto px-6 py-20 mb-20 md:mb-0 overflow-visible">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            className="relative h-[500px] md:h-[850px] flex items-end justify-center"
          >
            {/* Ambient Lighting Layer */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-visible">
              <div className="w-[120%] h-[120%] bg-gradient-radial from-amber-500/15 via-transparent to-transparent opacity-70 blur-[100px]"></div>
              <div className="absolute bottom-[-10%] w-full h-[30%] bg-amber-500/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Author Portrait Image */}
            <motion.img 
              src="https://res.cloudinary.com/dwf8i4pmn/image/upload/v1766754134/Gemini_Generated_Image_xi6vnaxi6vnaxi6v-removebg-preview_hveqya.png" 
              className="relative z-10 h-full w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              alt={CONTACT_INFO.owner}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Info Plate - Adjusted bottom offset and font sizes for mobile */}
            <div className="absolute bottom-[-30px] md:bottom-[-70px] left-1/2 -translate-x-1/2 bg-white p-10 md:p-16 rounded-[3.5rem] md:rounded-[4.5rem] shadow-4xl border border-slate-50 z-20 w-[95%] md:w-[85%] text-center">
               <div className="flex flex-col items-center gap-2 md:gap-3">
                 <div className="w-10 md:w-12 h-1 bg-amber-500 rounded-full mb-1 md:mb-2" />
                 <span className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">Founder & Managing Head</span>
                 <p className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{CONTACT_INFO.owner}</p>
                 <p className="text-[10px] md:text-[14px] font-bold text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em] mt-2 md:mt-3">Direct Ownership • Personal Commitment • Arihant Fleet Owner</p>
               </div>
            </div>
          </motion.div>

          <div className="space-y-12 pt-20 lg:pt-0">
            <div className="space-y-6">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest px-4 py-2 bg-amber-50 rounded-full w-max">The Visionary</span>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">GUIDING <br /><span className="text-amber-500 italic">VALUES.</span></h2>
              <div className="relative pt-6">
                <Quote className="absolute -top-6 -left-8 text-amber-50 w-24 h-24 -z-10 opacity-60" />
                <p className="text-xl md:text-3xl text-slate-600 font-bold leading-relaxed italic relative z-10 pr-6">
                  "At Arihant Cabs, every journey is a relationship of trust. We bridge distances with safety and unmatched commitment."
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Reliability', icon: <Clock /> },
                { label: 'Elite Fleet', icon: <Car /> },
                { label: 'Integrity', icon: <Award /> },
                { label: 'Native Roots', icon: <Users /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    {React.cloneElement(item.icon as any, { size: 18 })}
                  </div>
                  <span className="font-black text-slate-800 text-[11px] uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Section */}
      <section className="bg-slate-900 py-32 md:py-48 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 md:mb-32">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                THE <span className="text-amber-500 italic">FLEET.</span>
              </h2>
              <p className="text-lg md:text-2xl text-slate-400 font-bold max-w-2xl leading-relaxed">Pristine condition. Professional maintenance. The highest standards in Jharkhand.</p>
            </div>
            <Link to="/book" className="px-12 py-5 bg-white text-slate-900 font-black rounded-xl hover:bg-amber-500 hover:text-white transition-all uppercase text-sm tracking-widest shadow-2xl">
              EXPLORE ALL ASSETS
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-20 py-10">
        <h2 className="text-6xl md:text-[11rem] font-black text-slate-900 tracking-tighter leading-[0.8] uppercase italic">
          READY FOR <br />
          <span className="text-amber-500">THE ROAD?</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
           <Link to="/book" className="w-full md:w-auto px-20 py-10 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-4xl hover:bg-amber-600 transition-all text-2xl uppercase tracking-widest active:scale-95">Book My Journey</Link>
           <div className="flex flex-col items-center md:items-start gap-1">
             <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-6 text-4xl md:text-6xl font-black text-slate-900 hover:text-amber-500 transition-colors tracking-tighter">
                <Phone size={40} className="text-amber-500" /> {CONTACT_INFO.phone}
             </a>
             <span className="text-[10px] font-black text-slate-400 tracking-[0.5em] uppercase md:pl-20">24/7 Priority Helpline</span>
           </div>
        </div>
      </section>

      <style>{`
        .shadow-4xl { box-shadow: 0 45px 100px -20px rgba(0,0,0,0.18); }
        .bg-gradient-radial { background-image: radial-gradient(var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
};

export default Home;
