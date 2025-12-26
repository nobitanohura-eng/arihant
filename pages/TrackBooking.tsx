
import React from 'react';
import { storageService } from '../services/storageService';
import { Booking } from '../types';
import { Search, Loader2, MapPin, Calendar, Clock, Car, ShieldCheck, Phone, CheckCircle2, Circle, AlertCircle, XCircle, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTACT_INFO } from '../constants';

const TrackBooking: React.FC = () => {
  const [bookingId, setBookingId] = React.useState('');
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [cancelLoading, setCancelLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Load history on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('arihant_track_history');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  const saveToHistory = (id: string) => {
    const upperId = id.toUpperCase().trim();
    if (!upperId) return;
    
    const newHistory = [upperId, ...recentSearches.filter(s => s !== upperId)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('arihant_track_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('arihant_track_history');
  };

  const handleTrack = async (e?: React.FormEvent, manualId?: string) => {
    if (e) e.preventDefault();
    const targetId = (manualId || bookingId).toUpperCase().trim();
    if (!targetId) return;

    setLoading(true);
    setError('');
    try {
      const result = await storageService.getBookingById(targetId);
      if (result) {
        setBooking(result);
        saveToHistory(targetId);
        if (manualId) setBookingId(manualId);
      } else {
        setError('Booking ID not found. Please check and try again.');
        setBooking(null);
      }
    } catch (err) {
      setError('An error occurred while tracking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking? This will release the assigned vehicle immediately.");
    if (!confirmCancel) return;

    setCancelLoading(true);
    try {
      // Execute cancellation in DB
      await storageService.updateBookingStatus(booking.id, 'cancelled', booking.vehicle_id);
      
      // Optimistically update UI
      setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      
      // Attempt to re-fetch clean data to ensure sync
      const refreshed = await storageService.getBookingById(booking.id);
      if (refreshed) {
        setBooking(refreshed);
      }
      
      alert("Booking successfully cancelled. We hope to serve you again soon.");
    } catch (err: any) {
      console.error("Manual cancellation failed:", err);
      alert(`Error: ${err.message || "Something went wrong. Please call us to cancel."}`);
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-500 bg-amber-50';
      case 'confirmed': return 'text-blue-500 bg-blue-50';
      case 'completed': return 'text-green-500 bg-green-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const steps = [
    { label: 'Booking Received', status: ['pending', 'confirmed', 'completed'] },
    { label: 'Asset Confirmed', status: ['confirmed', 'completed'] },
    { label: 'Trip Started', status: [] }, 
    { label: 'Journey Complete', status: ['completed'] }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">Track Your <span className="text-amber-500">Ride.</span></h1>
          <p className="text-slate-500 font-bold">Enter your unique Booking ID to see real-time status.</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                value={bookingId} 
                onChange={e => setBookingId(e.target.value)} 
                placeholder="e.g. BK-ABC-123" 
                className="w-full pl-16 pr-8 py-6 bg-white rounded-3xl shadow-xl border-2 border-transparent focus:border-amber-500 outline-none font-black text-xl uppercase tracking-widest transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-12 py-6 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'TRACK STATUS'}
            </button>
          </form>

          {/* Recent Searches */}
          <AnimatePresence>
            {recentSearches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-3 px-4"
              >
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                  <History size={12} /> Recent:
                </div>
                {recentSearches.map((id) => (
                  <button
                    key={id}
                    onClick={() => handleTrack(undefined, id)}
                    className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[11px] font-black text-slate-600 hover:border-amber-500 hover:text-amber-500 transition-all shadow-sm"
                  >
                    {id}
                  </button>
                ))}
                <button 
                  onClick={clearHistory}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold flex items-center gap-3">
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}

          {booking && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Identity</span>
                    <h3 className="text-3xl font-black text-slate-900">{booking.id}</h3>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0"><MapPin size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
                        <p className="text-xl font-black text-slate-900">{booking.pickup_location} → {booking.drop_location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 shrink-0"><Calendar size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                        <p className="text-xl font-black text-slate-900">{booking.date} at {booking.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 shrink-0"><Car size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Category</p>
                        <p className="text-xl font-black text-slate-900">{booking.vehicle?.name || 'Assigned soon'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 shrink-0"><ShieldCheck size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passengers</p>
                        <p className="text-xl font-black text-slate-900">{booking.passenger_count} Persons</p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.status !== 'cancelled' && (
                  <div className="pt-10 space-y-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Journey Progress</p>
                     <div className="relative flex justify-between items-center">
                        <div className="absolute left-0 right-0 h-1 bg-slate-100 top-1/2 -translate-y-1/2 -z-10" />
                        {steps.map((step, i) => (
                          <div key={i} className="flex flex-col items-center gap-3 bg-[#fafafa] px-2">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status.includes(booking.status) ? 'bg-amber-500 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                               {step.status.includes(booking.status) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                             </div>
                             <span className={`text-[9px] font-black uppercase tracking-tighter text-center max-w-[60px] ${step.status.includes(booking.status) ? 'text-amber-600' : 'text-slate-400'}`}>{step.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="pt-10 flex flex-col items-center gap-4 bg-red-50 p-8 rounded-3xl border border-red-100">
                    <XCircle className="text-red-500" size={48} />
                    <div className="text-center">
                      <p className="text-xl font-black text-red-900">BOOKING CANCELLED</p>
                      <p className="text-sm font-bold text-red-600">This ride has been voided. Any advance payments will be refunded as per policy.</p>
                    </div>
                  </div>
                )}

                <div className="pt-10 flex flex-col md:flex-row gap-4">
                   <a href={`tel:${CONTACT_INFO.phone}`} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                     <Phone size={18} /> CONTACT DISPATCH
                   </a>
                   {(booking.status === 'pending' || booking.status === 'confirmed') ? (
                     <button 
                       onClick={handleCancel}
                       disabled={cancelLoading}
                       className="flex-1 py-5 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                     >
                       {cancelLoading ? <Loader2 className="animate-spin" size={18} /> : 'CANCEL REQUEST'}
                     </button>
                   ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackBooking;
