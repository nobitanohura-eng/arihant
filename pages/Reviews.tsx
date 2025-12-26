
import React from 'react';
import { storageService } from '../services/storageService';
import { Review } from '../types';
import { Star, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const loadReviews = async () => {
    setLoading(true);
    const data = await storageService.getVisibleReviews();
    setReviews(data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await storageService.addReview({
      booking_id: 'manually-added',
      customer_name: form.name,
      rating: form.rating,
      comment: form.comment
    });
    setSubmitted(true);
    setForm({ name: '', rating: 5, comment: '' });
    setLoading(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">Customer <span className="text-amber-500">Voices.</span></h1>
          <p className="text-slate-500 text-lg font-medium">True experiences from those who traveled with Arihant Cabs.</p>
        </div>

        <div className="space-y-6">
          {loading && reviews.length === 0 ? (
            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : reviews.map(r => (
            <div key={r.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <p className="font-black text-slate-900 uppercase tracking-tight">{r.customer_name}</p>
                <div className="flex gap-1 text-amber-500">
                  {Array.from({length: 5}).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium italic">"{r.comment}"</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
          {!loading && reviews.length === 0 && (
            <p className="text-slate-400 font-bold uppercase tracking-widest text-center py-10 bg-slate-50 rounded-3xl">Be the first to share your journey.</p>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="sticky top-32 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Write a Review</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Display Name</label>
              <input 
                required
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-amber-500/20 font-bold"
                placeholder="Enter your name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Experience Rating</label>
              <div className="flex gap-3 px-2">
                {[1,2,3,4,5].map(star => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setForm({...form, rating: star})}
                    className={`p-3 rounded-xl transition-all ${form.rating >= star ? 'text-amber-500 bg-amber-50 shadow-md' : 'text-slate-300 bg-slate-50'}`}
                  >
                    <Star className={`w-6 h-6 ${form.rating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Your Thoughts</label>
              <textarea 
                required
                rows={4}
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-amber-500/20 font-bold"
                placeholder="How was the ride quality?"
                value={form.comment}
                onChange={e => setForm({...form, comment: e.target.value})}
              />
            </div>

            {submitted ? (
              <div className="flex items-center justify-center gap-3 p-5 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-inner">
                <CheckCircle className="w-5 h-5" /> Submitted for approval
              </div>
            ) : (
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Publish Review <Send className="w-4 h-4" /></>}
              </button>
            )}
            <p className="text-[9px] text-slate-400 font-bold text-center uppercase tracking-widest">Verification required before publishing.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
