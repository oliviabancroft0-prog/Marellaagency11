import React, { useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import { 
  Users, 
  Search, 
  ExternalLink, 
  Calendar,
  Shield,
  FileText,
  DollarSign,
  ChevronRight,
  User as UserIcon,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreatorProfile {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  creator_profile: {
    stage_name: string;
    bio: string;
    payout_provider: string;
    payout_details: string;
    photos?: string[];
    id_url?: string;
    photos_count?: number;
    id_verification_pending?: boolean;
  };
  onboarding_completed: boolean;
  created_at: string;
}

export const AgencyRoster: React.FC = () => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('users')
        .select('*')
        .eq('onboarding_completed', true);

      if (error) throw error;
      setCreators(data || []);
    } catch (err) {
      console.error('Failed to fetch roster:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.creator_profile?.stage_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-offwhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/40 mb-4">
              <Shield size={14} />
              <span>Agency Official</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic leading-tight">Registry Management</h1>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
            <input 
              type="text"
              placeholder="Filter roster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-brand-border rounded-full text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-brand-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">Synchronising Registry Assets...</p>
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="py-24 text-center bg-white border border-brand-border rounded-sm">
            <Users size={48} className="mx-auto text-brand-black/10 mb-6" />
            <h3 className="text-xl font-serif italic mb-2">No Talent Found</h3>
            <p className="text-[10px] uppercase tracking-widest text-brand-black/40">The registry currently contains no active creator profiles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCreators.map((creator) => (
              <motion.div 
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedCreator(creator)}
                className="bg-white border border-brand-border p-8 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-brand-offwhite rounded-sm flex items-center justify-center text-brand-black border border-brand-border overflow-hidden">
                    {creator.creator_profile?.photos && creator.creator_profile.photos.length > 0 ? (
                      <img src={creator.creator_profile.photos[0]} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={24} className="opacity-20" />
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-sm font-bold uppercase tracking-widest">Signed</span>
                    <span className="text-[9px] text-brand-black/40 mt-1 uppercase tracking-widest italic">{new Date(creator.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-serif italic group-hover:underline">{creator.creator_profile?.stage_name || creator.full_name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold mt-1">Digital Sovereign</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-brand-offwhite">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-brand-black/40">Portfolio Size</span>
                    <span className="font-bold">{creator.creator_profile?.photos?.length || creator.creator_profile?.photos_count || 0} Assets</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-brand-black/40">Security Status</span>
                    <span className="font-bold flex items-center text-green-600">
                      <ShieldCheck size={12} className="mr-1" /> Verified
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center text-[9px] uppercase tracking-[0.3em] font-bold text-brand-black/20 group-hover:text-brand-black transition-colors">
                  <span>Open Operational Dossier</span>
                  <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Creator Detail Modal */}
      <AnimatePresence>
        {selectedCreator && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCreator(null)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white border border-brand-border rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-brand-border flex justify-between items-center bg-brand-offwhite">
                <div>
                  <h2 className="text-3xl font-serif italic mb-1">{selectedCreator.creator_profile?.stage_name}</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black/40">Creator Technical Dossier</p>
                </div>
                <button onClick={() => setSelectedCreator(null)} className="p-2 hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column: Visuals & Files */}
                  <div className="lg:col-span-2 space-y-10">
                    <div>
                      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black mb-6 flex items-center">
                        <Camera size={16} className="mr-3" /> Visual Portfolio
                      </h3>
                      {selectedCreator.creator_profile?.photos && selectedCreator.creator_profile.photos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedCreator.creator_profile.photos.map((url, i) => (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="aspect-[3/4] bg-brand-offwhite border border-brand-border rounded-sm overflow-hidden group relative"
                            >
                              <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-all flex items-center justify-center">
                                <ExternalLink size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 bg-brand-offwhite border border-dashed border-brand-border rounded-sm text-center">
                          <ImageIcon size={32} className="mx-auto text-brand-black/10 mb-4" />
                          <p className="text-[10px] uppercase tracking-widest text-brand-black/40">No portfolio assets uploaded yet.</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black mb-6 flex items-center">
                        <FileText size={16} className="mr-3" /> Identity Documents
                      </h3>
                      {selectedCreator.creator_profile?.id_url ? (
                        <a 
                          href={selectedCreator.creator_profile.id_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-6 border border-brand-black bg-brand-offwhite hover:bg-white transition-all group rounded-sm"
                        >
                          <div className="w-12 h-12 bg-white border border-brand-border flex items-center justify-center rounded-sm mr-6">
                            <Shield className="text-brand-black/40" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold uppercase tracking-widest">Government ID / Passport</p>
                            <p className="text-[9px] text-brand-black/40 uppercase tracking-widest mt-1">Verified Document • Click to view full capture</p>
                          </div>
                          <ExternalLink size={18} className="text-brand-black/20 group-hover:text-brand-black transition-all" />
                        </a>
                      ) : (
                        <div className="flex items-center p-6 border border-dashed border-brand-border bg-brand-offwhite rounded-sm text-brand-black/40">
                          <Clock size={16} className="mr-3" />
                          <span className="text-[10px] uppercase tracking-widest italic">Verification document is pending manual audit.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Bio & Financials */}
                  <div className="space-y-10">
                    <div className="bg-brand-offwhite p-8 border border-brand-border rounded-sm">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black mb-6 underline">Persona Background</h3>
                      <p className="text-sm font-light leading-relaxed text-brand-black/80">
                        {selectedCreator.creator_profile?.bio}
                      </p>
                    </div>

                    <div className="bg-brand-black text-white p-8 rounded-sm shadow-xl">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-6 text-white/60">Settlement Account</h3>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <DollarSign size={20} className="text-white/40" />
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Provider</p>
                            <p className="text-sm font-bold uppercase tracking-widest">{selectedCreator.creator_profile?.payout_provider || 'Standard Bank'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Routing / ID</p>
                          <p className="text-xs font-mono bg-white/10 p-3 rounded-sm break-all">{selectedCreator.creator_profile?.payout_details || 'Pending Verification'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button className="w-full py-4 bg-brand-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-black/90 transition-all mb-4">
                        Approve Talent Roster
                      </button>
                      <button className="w-full py-4 border border-red-200 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-50 transition-all">
                        Request Redocumentation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
