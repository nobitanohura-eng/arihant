
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Phone, CreditCard, Home, MessageSquare, MessageCircle, ArrowRight, Sparkles, Search } from 'lucide-react';
import { CONTACT_INFO, LOGO_URL } from '../constants';
import { motion } from 'framer-motion';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');

  const handleUPI = () => {
    window.location.href = `upi://pay?pa=${CONTACT_INFO.upi}&pn=Arihant%20Cabs&tr=${bookingId}&cu=INR`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello Arihant Cabs, I just completed a booking (ID: ${bookingId}). Please confirm my travel.`);
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4 py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full" 
        />
      </div>

      <div className="max-w-3xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white rounded-[64px] shadow-3xl border border-slate-100 p-8 md:p-20 text-center space-y-12 relative overflow-hidden"
        >
          <div className="space-y-8 relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative inline-block"
            >
              <div className="bg-amber-500 p-8 rounded-[40px] text-white shadow-2xl">
                <CheckCircle className="w-20 h-20" />
              </div>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Asset Reserved!</h1>
              <p className="text-xl text-slate-500 font-medium">Your request ID is <span className="text-slate-900 font-black">{bookingId}</span></p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[48px] p-10 space-y-8 shadow-2xl text-left">
            <h3 className="text-amber-500 font-black uppercase text-xs tracking-widest text-center">Next Steps</h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">1</div>
                  <p className="text-slate-300 font-medium">A fleet manager will call you shortly for dispatch confirmation.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">2</div>
                  <p className="text-slate-300 font-medium">Use the <Link to="/track" className="text-amber-500 underline font-black">Track Status</Link> page to monitor your journey updates.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={handleWhatsApp} 
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/10 text-white font-black rounded-3xl hover:bg-white/20 transition-all border border-white/10"
              >
                <MessageCircle className="text-green-400" /> WHATSAPP CONFIRM
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={handleUPI} 
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-900 font-black rounded-3xl hover:bg-slate-100 transition-all shadow-xl"
              >
                <CreditCard className="text-amber-500" /> PAY ADVANCE
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center pt-8">
            <Link to="/track" className="flex items-center gap-2 text-slate-900 font-black tracking-widest text-xs uppercase hover:text-amber-500 transition-all">
              <Search size={16} /> TRACK THIS RIDE
            </Link>
            <Link to="/" className="flex items-center gap-2 text-slate-400 font-black tracking-widest text-xs uppercase hover:text-amber-500 transition-all">
              <Home size={16} /> RETURN HOME
            </Link>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        .shadow-3xl {
          box-shadow: 0 45px 100px -20px rgba(245, 158, 11, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Success;
