
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Phone, MapPin, Search } from 'lucide-react';
import { CONTACT_INFO, LOGO_URL } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Book', path: '/book' },
    { name: 'Track', path: '/track' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] px-4 pt-4 md:pt-6 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className={`glass rounded-[2rem] border transition-all duration-500 px-5 py-3 flex items-center justify-between ${
            scrolled 
              ? 'shadow-2xl border-white/40 bg-white/90' 
              : 'shadow-lg border-white/20 bg-white/60'
          }`}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xl border border-white bg-white shrink-0">
              <img src={LOGO_URL} alt="Arihant Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col -space-y-1 hidden sm:flex">
              <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-amber-600">
                ARIHANT<span className="text-amber-500">CABS</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Giridih, Jharkhand</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 rounded-xl text-xs font-black transition-all ${
                  location.pathname === link.path ? 'text-white' : 'text-slate-700 hover:text-amber-600'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-bg" className="absolute inset-0 bg-amber-500 shadow-lg shadow-amber-500/30 rounded-xl" />
                )}
                <span className="relative z-10 uppercase tracking-widest">{link.name}</span>
              </Link>
            ))}
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href={`tel:${CONTACT_INFO.phone}`}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600"
            >
              Support
            </motion.a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/track" className="p-2.5 bg-slate-900 text-white rounded-xl">
              <Search size={18} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-900 bg-white shadow-sm border border-slate-100"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-4 right-4 md:hidden"
          >
            <div className="glass rounded-[2rem] shadow-2xl p-4 flex flex-col gap-1 border border-white">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest ${
                    location.pathname === link.path ? 'bg-amber-500 text-white shadow-xl' : 'text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
