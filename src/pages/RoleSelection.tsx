import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { useAuth } from '../context/AuthContext';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, refreshAuth } = useAuth();

  const selectRole = async (role: 'creator' | 'fan') => {
    if (!user || !profile) return;

    try {
      // Get current clean name to handle fallbacks
      const currentRawName = profile.full_name || '';
      const newFullName = currentRawName.replace('ROLE_PENDING:', '');

      // Try updating both role and full_name (removing the pending flag)
      const { error } = await insforge.database
        .from('users')
        .update({ 
          role,
          full_name: newFullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error && (error.message.includes('column') || error.message.includes('role'))) {
        console.warn('Role column missing, only updating full_name to track choice');
        // If role column is missing, we use a prefix in full_name to store the role
        // e.g. "ROLE_FAN:ONBOARDING_PENDING:Name"
        const rolePrefix = role === 'creator' ? 'ROLE_CREATOR:' : 'ROLE_FAN:';
        await insforge.database
          .from('users')
          .update({ 
            full_name: currentRawName.replace('ROLE_PENDING:', rolePrefix),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } else if (error) {
        console.error('Error selecting role:', error.message);
        return;
      }

      await refreshAuth();
      navigate(role === 'creator' ? '/onboarding/creator' : '/onboarding/fan');
    } catch (err) {
      console.error('Failed to select role:', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full mb-6"
          >
            Awaiting Identity Selection
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Choose Your Path</h1>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Creator Option */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => selectRole('creator')}
            className="group relative bg-white border border-brand-border p-12 rounded-sm cursor-pointer overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-brand-black/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={160} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-brand-offwhite rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-black group-hover:text-white transition-colors duration-500">
                <Users size={32} />
              </div>
              
              <h2 className="text-3xl font-serif italic mb-4">Creator / Join the Roster</h2>
              <p className="text-sm font-light text-brand-black/60 leading-relaxed mb-8">
                Scale with Bramingham Barely. Professional management, algorithmic dominance, and elite data-driven growth architecture.
              </p>
              
              <div className="mt-auto pt-8 border-t border-brand-offwhite flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 group-hover:text-brand-black transition-colors">Start Application</span>
                <ArrowRight size={20} className="text-brand-black/20 group-hover:text-brand-black group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </motion.div>

          {/* Fan Option */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => selectRole('fan')}
            className="group relative bg-white border border-brand-border p-12 rounded-sm cursor-pointer overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-brand-black/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={160} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-brand-offwhite rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-black group-hover:text-white transition-colors duration-500">
                <User size={32} />
              </div>
              
              <h2 className="text-3xl font-serif italic mb-4">Fan / Member</h2>
              <p className="text-sm font-light text-brand-black/60 leading-relaxed mb-8">
                Access exclusive content, manage bookings & purchases. Experience the pinnacle of UK creative assets with priority access.
              </p>
              
              <div className="mt-auto pt-8 border-t border-brand-offwhite flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 group-hover:text-brand-black transition-colors">Enter Registry</span>
                <ArrowRight size={20} className="text-brand-black/20 group-hover:text-brand-black group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </motion.div>
        </div>
        
        <p className="mt-16 text-center text-[10px] uppercase tracking-[0.4em] text-brand-black/30">
          &copy; 2026 Bramingham Barely Int. Secure Identity Architecture.
        </p>
      </div>
    </div>
  );
};
