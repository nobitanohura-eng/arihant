
import React from 'react';
import { Vehicle } from '../types';
import { Users, Wind, CheckCircle2, IndianRupee, Star, ImageOff, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  vehicle: Vehicle;
  onSelect?: (v: Vehicle) => void;
  selected?: boolean;
}

const VehicleCard: React.FC<Props> = ({ vehicle, onSelect, selected }) => {
  const [imgStatus, setImgStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={() => onSelect && onSelect(vehicle)}
      className={`relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all cursor-pointer group flex flex-col h-full ${
        selected ? 'border-amber-500 ring-8 ring-amber-500/10 shadow-3xl' : 'border-slate-100 hover:border-amber-200 shadow-xl'
      }`}
    >
      <div className="relative h-64 md:h-72 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {imgStatus !== 'error' ? (
          <img 
            src={vehicle.image_url} 
            alt={vehicle.name} 
            onLoad={() => setImgStatus('loaded')}
            onError={() => setImgStatus('error')}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out ${imgStatus === 'loading' ? 'blur-lg' : 'blur-0'}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-300">
            <ImageOff size={40} strokeWidth={1.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Asset Unavailable</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <div className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
            <Star className="w-3 h-3 fill-current" /> Premium
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl shadow-xl border border-white/20 flex items-center gap-1">
             <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
             <span className="text-xl font-black text-slate-900">{vehicle.price_per_km}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase">/ km</span>
          </div>
          {selected && (
            <div className="bg-amber-500 p-3 rounded-xl text-white shadow-xl">
              <CheckCircle2 size={24} />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-amber-600 transition-colors">{vehicle.name}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vehicle.seats} Seater • {vehicle.ac ? 'Air Conditioned' : 'Non-AC'}</p>
        </div>
        
        <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">
          {vehicle.description}
        </p>

        {onSelect && (
          <div className={`mt-auto w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${selected ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-amber-600'}`}>
            {selected ? 'Vehicle Reserved' : 'Reserve Asset'}
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VehicleCard;
