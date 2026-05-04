import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { syncUserProfile } from '../lib/setup';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Settings, 
  LogOut,
  Calendar,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  useEffect(() => {
    syncUserProfile();
  }, []);

  const stats = [
    { label: 'Total Earnings', value: '£42,910', change: '+12.5%', icon: DollarSign },
    { label: 'Active Fans', value: '1,204', change: '+3.2%', icon: Users },
    { label: 'PPV Conversion', value: '18.4%', change: '+5.1%', icon: TrendingUp },
    { label: 'Chat Response', value: '2.4m', change: '-40s', icon: MessageSquare },
  ];

  const inventory = [
    { name: 'The London Package', status: 'Active', type: 'Signature Style' },
    { name: 'Voice Note Script: Vol 1', status: 'In Review', type: 'Communication' },
    { name: 'Peak Hour Posting Grid', status: 'Optimized', type: 'Strategy' },
  ];

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-12 px-6 md:px-12 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Internal Performance: {user?.email?.split('@')[0]}</h1>
            <div className="flex items-center space-x-3 text-sm font-light text-brand-black/50 uppercase tracking-widest">
              <span>Bramingham Barely Creator Network</span>
              <span className="w-4 h-[1px] bg-brand-border"></span>
              <div className="flex items-center space-x-1 text-green-600">
                <ShieldCheck size={14} />
                <span>Verified Asset</span>
              </div>
            </div>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-brand-black/60 hover:text-brand-black transition-colors px-6 py-3 border border-brand-border rounded-full hover:bg-white"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 border border-brand-border rounded-sm shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-brand-offwhite rounded-sm text-brand-black">
                  <stat.icon size={20} />
                </div>
                <span className={`text-[10px] font-bold tracking-widest ${stat.change.startsWith('+') ? 'text-green-600' : 'text-brand-black/40'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/40 mb-1">{stat.label}</p>
              <p className="text-3xl font-serif">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-brand-border rounded-sm p-8">
              <div className="flex justify-between items-center mb-8 border-b border-brand-offwhite pb-4">
                <h2 className="text-xl font-serif italic">OnlyFans Management: Active Campaigns</h2>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-black/40 flex items-center hover:text-brand-black">
                  View Analytics <ArrowUpRight size={14} className="ml-1" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-brand-offwhite border border-brand-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/60 mb-4">Subscriber Retention Grid</p>
                    <div className="h-40 flex items-center justify-center text-brand-black/20 italic font-serif text-center">
                      [ Retention Heatmap Visualization ]
                    </div>
                  </div>
                  <div className="p-6 bg-brand-offwhite border border-brand-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/60 mb-4">Messaging Efficiency</p>
                    <div className="h-40 flex items-center justify-center text-brand-black/20 italic font-serif text-center">
                      [ Response Velocity Chart ]
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black/40">Upcoming Directives</h3>
                  {[
                    { title: 'PPV Batch Reveal: The Chelsea Shoot', time: '14:00 GMT', status: 'Scheduled' },
                    { title: 'Fan Mass DM: Weekend Teaser', time: '18:00 GMT', status: 'Draft' },
                  ].map((directive, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-brand-offwhite hover:bg-brand-offwhite transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-brand-black"></div>
                        <span className="text-sm font-medium">{directive.title}</span>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-bold flex items-center space-x-4">
                        <span className="text-brand-black/40">{directive.time}</span>
                        <span className="px-2 py-1 bg-white border border-brand-border rounded-sm">{directive.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-border rounded-sm p-8">
              <div className="flex justify-between items-center mb-8 border-b border-brand-offwhite pb-4">
                <h2 className="text-xl font-serif italic">Network Strategy Directives</h2>
                <Layers size={16} className="text-brand-black/40" />
              </div>
              <div className="space-y-6">
                {[
                  { title: 'New Content Pillar: Posh British Wit', date: '2 hours ago', tag: 'Strategy' },
                  { title: 'PPV Batch Optimization Scheduled', date: 'Yesterday', tag: 'Operational' },
                  { title: 'Vocal Signature Session at London Studio', date: '3 days ago', tag: 'Production' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer text-[10px]">
                    <div>
                      <p className="text-sm font-medium hover:underline">{item.title}</p>
                      <p className="text-[10px] text-brand-black/40 uppercase tracking-widest mt-1">{item.date}</p>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 bg-brand-offwhite rounded-sm">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <div className="bg-brand-black text-white p-8 rounded-sm shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-xl font-serif italic mb-6">Upcoming Agency Sync</h2>
                 <div className="flex items-start space-x-4 mb-4">
                   <Calendar className="mt-1" size={18} />
                   <div>
                     <p className="text-sm font-medium">Bramingham Barely Intelligence Summit</p>
                     <p className="text-xs text-white/60 mb-2">June 12, 2026 - 11:00 AM</p>
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Mayfair, London</p>
                   </div>
                 </div>
                 <button className="w-full mt-4 bg-white text-brand-black py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                   Confirm Attendance
                 </button>
               </div>
               <div className="absolute -right-8 -bottom-8 text-white/5 rotate-12">
                 <Users size={160} />
               </div>
             </div>

             <div className="bg-white border border-brand-border p-8 rounded-sm">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-serif italic">Agency Registry</h2>
                 <ShoppingBag size={16} className="text-brand-black/40" />
               </div>
               <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/40 mb-6">Your Acquired Assets & Tools</p>
               <div className="space-y-4 mb-8">
                 {inventory.map((item, i) => (
                   <div key={i} className="p-4 bg-brand-offwhite border border-brand-border rounded-sm group hover:border-brand-black transition-colors cursor-pointer">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold uppercase tracking-widest group-hover:text-brand-black transition-colors">{item.name}</span>
                       <span className="text-[8px] px-1.5 py-0.5 bg-white border border-brand-border rounded-sm group-hover:bg-brand-black group-hover:text-white transition-colors">{item.status}</span>
                     </div>
                     <p className="text-[10px] text-brand-black/40 uppercase tracking-widest">{item.type}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full flex items-center justify-center space-x-2 py-4 border border-brand-border rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-offwhite transition-colors">
                 <Package size={14} />
                 <span>Expand Suite (The Shop)</span>
               </button>
             </div>

             <div className="bg-white border border-brand-border p-8 rounded-sm">
               <h2 className="text-xl font-serif italic mb-6">Credential Management</h2>
               <div className="space-y-4">
                 <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-brand-offwhite transition-colors rounded-sm">
                   <Settings size={18} className="text-brand-black/40" />
                   <span className="text-xs font-bold uppercase tracking-widest">Portal Settings</span>
                 </button>
                 <button className="flex items-center space-x-3 w-full text-left p-3 hover:bg-brand-offwhite transition-colors rounded-sm">
                   <ShieldCheck size={18} className="text-brand-black/40" />
                   <span className="text-xs font-bold uppercase tracking-widest">Security & API Keys</span>
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
