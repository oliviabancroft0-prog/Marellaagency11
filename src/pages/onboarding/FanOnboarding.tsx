import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, CreditCard, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuth } from '../../context/AuthContext';

export const FanOnboarding: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    preferences: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshAuth } = useAuth();

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Try to update DB with full details.
      const { error: fullUpdateError } = await insforge.database
        .from('users')
        .update({
          full_name: formData.fullName,
          fan_profile: {
            preferences: formData.preferences,
            registration_date: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (fullUpdateError) {
        const isColumnError = fullUpdateError.message.includes('column') || 
                             fullUpdateError.message.includes('fan_profile') ||
                             fullUpdateError.message.includes('onboarding_completed');
        
        if (isColumnError) {
          console.warn('Specialized database columns missing, using full_name fallback for status.');
        } else {
          console.error('Error during full onboarding update:', fullUpdateError.message);
        }

        // Final fallback: just update full_name to remove the PENDING prefixes
        const { error: fallbackError } = await insforge.database
          .from('users')
          .update({
            full_name: formData.fullName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (fallbackError) {
          console.error('Critical failure: Fallback onboarding update failed:', fallbackError.message);
          return;
        }
      }

      await refreshAuth();
      // Use a small timeout to ensure state propagation before navigation logic in App.tsx kicks in
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['London Hub', 'Northern Silk', 'Date Night', 'City Chic', 'Corporate'];

  const togglePreference = (pref: string) => {
    setFormData(p => ({
      ...p,
      preferences: p.preferences.includes(pref) 
        ? p.preferences.filter(pr => pr !== pref)
        : [...p.preferences, pref]
    }));
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-border p-12 rounded-sm shadow-sm"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-offwhite rounded-full mb-6">
              <Sparkles className="text-brand-black" />
            </div>
            <h1 className="text-3xl font-serif italic mb-4">Welcome to the Registry</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Customise your digital experience.</p>
          </div>

          <div className="space-y-10">
            {/* Identity */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-black/60 mb-2">
                <User size={14} />
                <span>Identification</span>
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(p => ({...p, fullName: e.target.value}))}
                className="w-full px-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors"
                placeholder="Digital Alias or Full Name"
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4">
               <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-black/60 mb-2">
                <Heart size={14} />
                <span>Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => togglePreference(cat)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full border transition-all ${formData.preferences.includes(cat) ? 'bg-brand-black text-white border-brand-black' : 'bg-white border-brand-border text-brand-black/40 hover:border-brand-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Placeholder */}
            <div className="p-6 bg-brand-offwhite border border-brand-border rounded-sm">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-black/60">
                    <CreditCard size={14} />
                    <span>Payment Architecture</span>
                  </div>
                  <span className="text-[8px] bg-white border border-brand-border px-1.5 py-0.5 rounded-sm text-brand-black/40 uppercase tracking-widest font-bold">Encrypted</span>
                </div>
                <p className="text-[11px] text-brand-black/40 italic leading-relaxed">
                  Payment methods can be established during your first selection. We support internal credit settlements and global card architectures.
                </p>
            </div>

            <button
              onClick={completeOnboarding}
              disabled={loading || !formData.fullName}
              className="w-full bg-brand-black text-white py-4 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-brand-black/90 transition-all disabled:opacity-30 active:scale-95"
            >
              <span>{loading ? 'Finalising...' : 'Access Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
        
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.4em] text-brand-black/20 font-light">
          Secured By Bramingham Barely Infrastructure.
        </p>
      </div>
    </div>
  );
};
