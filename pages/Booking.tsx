
import { Booking as BookingType } from '../types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '../services/storageService';
import { tipService } from '../services/tipService';
import { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';
import { MapPin, Calendar, Clock, Sparkles, User, Key, ArrowRight, Loader2, CheckCircle2, ChevronLeft, Navigation, Users, Info } from 'lucide-react';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [tip, setTip] = React.useState("");

  const [formData, setFormData] = React.useState({
    pickup: '', drop: '', date: '', time: '', passengerCount: 1, name: '', phone: '', vehicleId: '',
    serviceType: 'with-driver' as 'with-driver' | 'self-drive',
    specialRequirements: ''
  });

  React.useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      const data = await storageService.getVehicles();
      setVehicles(data.filter(v => v.status === 'available'));
      setLoading(false);
    };
    loadVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => v.seats >= formData.passengerCount);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.pickup || !formData.date || !formData.time) return alert("Please fill the trip details!");
      if (formData.serviceType === 'with-driver' && !formData.drop) return alert("Drop location is required for driver service.");
      
      setLoading(true);
      setTimeout(() => {
        setTip(tipService.getInsights(formData.pickup, formData.drop, formData.passengerCount));
        setLoading(false);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    } else if (step === 2) {
      if (!formData.vehicleId) return alert("Please select a vehicle!");
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const bookingPayload: Omit<BookingType, 'id' | 'created_at' | 'status'> = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      pickup_location: formData.pickup,
      drop_location: formData.serviceType === 'self-drive' ? 'N/A (Self-Drive)' : formData.drop,
      date: formData.date,
      time: formData.time,
      vehicle_id: formData.vehicleId,
      service_type: formData.serviceType,
      passenger_count: formData.passengerCount,
      special_requirements: formData.specialRequirements
    };

    const booking = await storageService.createBooking(bookingPayload);
    
    if (booking) {
      setLoading(false);
      navigate(`/success?id=${booking.id}`);
    } else {
      setLoading(false);
      alert("Reservation failed. Please call us directly.");
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} 
            className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-12 md:w-20 bg-amber-500' : 'w-6 md:w-10 bg-slate-200'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${step === i ? 'text-amber-600' : 'text-slate-300'}`}>Step {i}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          key={step} 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] shadow-xl md:shadow-2xl p-8 md:p-14 border border-slate-100"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Your Journey <span className="text-amber-500">Starts Here.</span></h2>
                  <p className="text-slate-500 font-medium">Safe travel and professional service across Giridih.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-2 bg-slate-100 rounded-[2rem]">
                  <button 
                    onClick={() => setFormData({...formData, serviceType: 'with-driver'})}
                    className={`flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black transition-all ${formData.serviceType === 'with-driver' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500'}`}
                  >
                    <User size={20} className={formData.serviceType === 'with-driver' ? 'text-amber-500' : ''} />
                    WITH DRIVER
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, serviceType: 'self-drive'})}
                    className={`flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black transition-all ${formData.serviceType === 'self-drive' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500'}`}
                  >
                    <Key size={20} className={formData.serviceType === 'self-drive' ? 'text-amber-500' : ''} />
                    SELF DRIVE
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Pickup Point</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                      <input 
                        value={formData.pickup} 
                        onChange={e => setFormData({...formData, pickup: e.target.value})} 
                        placeholder="e.g. Barmasia, Giridih" 
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500/20 transition-all" 
                      />
                    </div>
                  </div>

                  {formData.serviceType === 'with-driver' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Drop Destination</label>
                      <div className="relative">
                        <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          value={formData.drop} 
                          onChange={e => setFormData({...formData, drop: e.target.value})} 
                          placeholder="e.g. Ranchi Airport" 
                          className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500/20 transition-all" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="date" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500/20" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Travel Time</label>
                    <div className="relative">
                      <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="time" 
                        value={formData.time} 
                        onChange={e => setFormData({...formData, time: e.target.value})} 
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500/20" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Number of Passengers</label>
                    <div className="flex gap-3">
                       {[1, 2, 3, 4, 5, 7, 12, 17].map(n => (
                         <button 
                           key={n}
                           onClick={() => setFormData({...formData, passengerCount: n})}
                           className={`flex-1 py-4 rounded-xl font-black transition-all ${formData.passengerCount === n ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                         >
                           {n}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNext} 
                  disabled={loading} 
                  className="w-full py-7 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-[2rem] text-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-4 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>ANALYSE & CHOOSE ASSET <ArrowRight /></>}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Sparkles className="text-amber-500" size={24} />
                    </div>
                    <h3 className="font-black text-amber-900 tracking-tight">Travel Intelligence</h3>
                  </div>
                  <div className="space-y-2">
                    {tip.split('\n• ').map((line, idx) => (
                      <p key={idx} className="text-amber-800 font-bold text-sm leading-relaxed flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-2">Assets matching {formData.passengerCount} passengers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {loading ? (
                      <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="animate-spin text-amber-500" size={40} />
                      </div>
                    ) : filteredVehicles.length > 0 ? filteredVehicles.map(v => (
                      <VehicleCard 
                        key={v.id} 
                        vehicle={v} 
                        onSelect={() => setFormData({...formData, vehicleId: v.id})} 
                        selected={formData.vehicleId === v.id} 
                      />
                    )) : (
                      <div className="col-span-full bg-slate-50 p-10 rounded-3xl text-center space-y-2">
                         <Info className="mx-auto text-slate-300" size={32} />
                         <p className="font-black text-slate-500">No available assets for this group size.</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleNext} 
                  disabled={!formData.vehicleId}
                  className="w-full py-7 bg-slate-900 text-white font-black rounded-[2rem] text-xl shadow-2xl transition-all disabled:opacity-50 hover:bg-amber-600"
                >
                  PROCEED TO VERIFICATION
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleFinalSubmit} className="space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Ready to <span className="text-amber-500">Dispatch.</span></h2>
                  <p className="text-slate-500 font-medium">Please verify your contact details for final confirmation.</p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-3xl outline-none font-bold text-xl border-2 border-transparent focus:border-amber-500/20" />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="WhatsApp Number" className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-3xl outline-none font-bold text-xl border-2 border-transparent focus:border-amber-500/20" />
                  </div>
                  <textarea 
                    value={formData.specialRequirements} 
                    onChange={e => setFormData({...formData, specialRequirements: e.target.value})} 
                    placeholder="Special Requirements? (e.g. Carrier, Pet-friendly)" 
                    className="w-full px-8 py-6 bg-slate-50 rounded-3xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500/20 h-32" 
                  />
                </div>

                <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl text-white space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Dispatch Summary</span>
                      <span className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase text-amber-500">{formData.serviceType}</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-black tracking-tighter">
                        {formData.pickup} {formData.serviceType === 'with-driver' ? '→ ' + formData.drop : '(Self-Drive)'}
                      </p>
                      <p className="text-slate-400 font-bold">{formData.date} at {formData.time} • {formData.passengerCount} Persons</p>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="font-black text-lg text-amber-500">{vehicles.find(v => v.id === formData.vehicleId)?.name}</p>
                      <CheckCircle2 className="text-amber-500" size={24} />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-7 bg-amber-500 text-white font-black rounded-[2rem] text-xl shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-amber-600"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "CONFIRM & RESERVE ASSET"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
