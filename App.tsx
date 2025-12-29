
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import Booking from './pages/Booking.tsx';
import Success from './pages/Success.tsx';
import Reviews from './pages/Reviews.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import TrackBooking from './pages/TrackBooking.tsx';
import { storageService } from './services/storageService.ts';
import { MapPin, Phone, Instagram, User, Search } from 'lucide-react';
import { CONTACT_INFO, LOGO_URL } from './constants.ts';

const App: React.FC = () => {
  React.useEffect(() => {
    storageService.init();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/success" element={<Success />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/track" element={<TrackBooking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                    <img src={LOGO_URL} alt="Arihant Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tighter uppercase">ARIHANT<span className="text-amber-500">CABS</span></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giridih Travel Experts</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                    Owned & Operated by <span className="text-slate-900 font-black">{CONTACT_INFO.owner}</span>. 
                    Serving Giridih and Jharkhand with pride since years.
                  </p>
                  <div className="flex gap-4">
                    <a href={CONTACT_INFO.instagram} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-all border border-slate-100">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Self Service</h4>
                <ul className="space-y-4 text-slate-500 font-bold">
                  <li><Link to="/track" className="hover:text-amber-500 transition-colors flex items-center gap-2"><Search size={14} /> Track My Ride</Link></li>
                  <li><Link to="/book" className="hover:text-amber-500 transition-colors">Book a Ride</Link></li>
                  <li><Link to="/reviews" className="hover:text-amber-500 transition-colors">Customer Reviews</Link></li>
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Get in Touch</h4>
                <ul className="space-y-4 text-slate-500 font-bold">
                  <li className="flex items-start gap-3"><MapPin size={18} className="text-amber-500 shrink-0 mt-1" /> {CONTACT_INFO.location}</li>
                  <li className="flex items-center gap-3"><Phone size={18} className="text-amber-500" /> {CONTACT_INFO.phone}</li>
                  <li className="flex items-center gap-3"><Phone size={18} className="text-amber-500" /> {CONTACT_INFO.phone2}</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            <div className="flex flex-col items-center md:items-start gap-2">
  <p>© 2025 Arihant Cabs - Pawan Kumar Dubey. All Rights Reserved.</p>
  <p className="text-[10px] font-bold tracking-widest text-slate-400">
  Built with <span className="text-red-500">♥</span> by{" "}
  <a
    href="https://www.instagram.com/iamavi_89"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-600 hover:text-amber-500 transition-colors"
  >
    Avinash Kumar
  </a>
</p>
</div>
              <div className="flex gap-10">
                <Link to="/admin" className="hover:text-amber-600 transition-colors flex items-center gap-2">
                  <User size={14} /> ADMIN ACCESS
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
