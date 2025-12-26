
import React from 'react';
import { motion } from 'framer-motion';
import { storageService } from '../services/storageService';
import { Vehicle, Booking, Review, BookingStatus } from '../types';
import { 
  Car, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  Trash2, 
  Plus,
  RefreshCcw,
  Settings,
  Loader2,
  XCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = React.useState<'bookings' | 'vehicles' | 'reviews'>('bookings');
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [v, b, r] = await Promise.all([
        storageService.getVehicles(),
        storageService.getBookings(),
        storageService.getReviews()
      ]);
      setVehicles(v);
      setBookings(b);
      setReviews(r);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = await storageService.adminLogin(password);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        alert("Invalid Admin Password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, status: BookingStatus, vehicleId?: string) => {
    if (processingId) return;
    
    setProcessingId(id);
    console.log(`[Admin] Triggering update for ${id} to ${status}`);

    try {
      await storageService.updateBookingStatus(id, status, vehicleId);
      await refreshData();
    } catch (err: any) {
      console.error("[Admin] Failed:", err);
      alert(`Update Failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleVehicleStatus = async (id: string, current: string) => {
    setLoading(true);
    try {
      await storageService.updateVehicleStatus(id, current === 'available' ? 'booked' : 'available');
      await refreshData();
    } catch (e) {
      alert("Failed to toggle vehicle status.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white/5 p-12 rounded-[40px] border border-white/10 space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl shadow-amber-500/20">
              <Lock size={40} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Arihant Admin</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Database Secure Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Secret" 
              className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/30 text-white font-medium text-center transition-all" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "SIGN IN TO SUPABASE"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-72 space-y-3">
          {[
            { id: 'bookings', label: 'Ride Requests', icon: <BookOpen /> },
            { id: 'vehicles', label: 'Fleet Status', icon: <Car /> },
            { id: 'reviews', label: 'Review Hub', icon: <MessageSquare /> }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setTab(item.id as any)} 
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black transition-all ${tab === item.id ? 'bg-amber-500 text-white shadow-xl translate-x-2' : 'text-slate-600 hover:bg-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button onClick={() => setIsAuthenticated(false)} className="w-full mt-10 flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-red-500 hover:bg-red-50"><LogOut /> LOGOUT</button>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tighter">{tab}</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Live Database Feed</p>
            </div>
            <button onClick={refreshData} disabled={loading} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-amber-500 transition-all shadow-lg">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <RefreshCcw size={24} />}
            </button>
          </div>

          <div className="space-y-6">
            {tab === 'bookings' && bookings.length === 0 && !loading && (
              <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-black uppercase tracking-widest">No Active Bookings</p>
              </div>
            )}

            {tab === 'bookings' && bookings.map(b => (
              <div key={b.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                {processingId === b.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-50 flex items-center justify-center">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl flex items-center gap-4 font-black shadow-2xl">
                      <Loader2 className="animate-spin" /> SYNCING SUPABASE...
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg uppercase border border-amber-100">{b.id}</span>
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase border ${
                        b.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                        b.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>{b.status}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">{b.customer_name}</h3>
                      <p className="text-amber-600 font-black text-lg">{b.customer_phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        {b.pickup_location} → {b.drop_location}
                      </p>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{b.date} • {b.time}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 self-end md:self-center">
                    {b.status === 'pending' && (
                      <button onClick={() => updateBooking(b.id, 'confirmed', b.vehicle_id)} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest">APPROVE</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateBooking(b.id, 'completed', b.vehicle_id)} className="px-10 py-5 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest">MARK DONE</button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button 
                        type="button" 
                        onClick={() => updateBooking(b.id, 'cancelled', b.vehicle_id)} 
                        className="px-10 py-5 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2 uppercase text-xs tracking-widest"
                      >
                        <XCircle size={18} /> CANCEL RIDE
                      </button>
                    )}
                    {(b.status === 'completed' || b.status === 'cancelled') && (
                      <div className="flex items-center gap-2 text-slate-300 font-black text-xs uppercase tracking-[0.2em] italic">
                        <CheckCircle2 size={16} /> Data Archived
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {tab === 'vehicles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vehicles.map(v => (
                  <div key={v.id} className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col gap-8 shadow-sm">
                    <div className="flex gap-6">
                      <img src={v.image_url} className="w-28 h-28 rounded-3xl object-cover shadow-xl" alt={v.name} />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-black text-2xl text-slate-900">{v.name}</h3>
                        <div className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg inline-block border ${
                          v.status === 'available' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {v.status}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">₹{v.price_per_km}/km • {v.seats} Seats</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleVehicleStatus(v.id, v.status)} 
                      disabled={loading}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        v.status === 'available' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-amber-500 text-white shadow-xl shadow-amber-500/20'
                      }`}
                    >
                      {v.status === 'available' ? 'Force Mark Booked' : 'Set to Available'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
