import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  CreditCard, 
  Settings, 
  LogOut,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Bell,
  User
} from 'lucide-react';
import { motion } from 'motion/react';

export const FanDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const [activity, setActivity] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [assets, setAssets] = React.useState<any[]>([]);
  const [cart, setCart] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Initialize as empty to remove mock data
    setActivity([]);
    setOrders([]);
    setAssets([]);
    setCart([]);
  }, []);

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-12 px-6 md:px-12 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Member Portal: {profile?.full_name || user?.email?.split('@')[0]}</h1>
            <div className="flex items-center space-x-3 text-sm font-light text-brand-black/50 uppercase tracking-widest">
              <span>Bramingham Barely Priority Member</span>
              <span className="w-4 h-[1px] bg-brand-border"></span>
              <div className="flex items-center space-x-1 text-blue-600">
                <ShieldCheck size={14} />
                <span>Verified Account</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button className="p-3 border border-brand-border rounded-full hover:bg-white text-brand-black/40 hover:text-brand-black transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-brand-offwhite"></span>
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-brand-black/60 hover:text-brand-black transition-colors px-6 py-3 border border-brand-border rounded-full hover:bg-white"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'The Roster', icon: Search, path: '/roster', description: 'Book Talent' },
                { label: 'Bookings', icon: Calendar, path: '#', description: 'Manage dates' },
                { label: 'My Vault', icon: ShoppingBag, path: '#', description: 'Bought assets' },
                { label: 'Direct', icon: MessageCircle, path: '#', description: '24/7 Agency' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className="bg-white border border-brand-border p-6 rounded-sm flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-all group"
                >
                  <div className="p-3 bg-brand-offwhite rounded-full text-brand-black group-hover:bg-brand-black group-hover:text-white transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/60 group-hover:text-brand-black block">{item.label}</span>
                    <span className="text-[8px] uppercase tracking-widest text-brand-black/30 block mt-1">{item.description}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Delivery & Order Status */}
            <div className="bg-white border border-brand-border rounded-sm p-8">
              <div className="flex justify-between items-center mb-8 border-b border-brand-offwhite pb-4">
                <h2 className="text-xl font-serif italic">Deliveries & Orders</h2>
                <ShoppingBag size={16} className="text-brand-black/40" />
              </div>
              <div className="space-y-6">
                {orders.length > 0 ? orders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-offwhite border border-brand-border rounded-sm group hover:border-brand-black transition-colors">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full">
                        <Layers size={18} className="text-brand-black/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.item}</p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold">Order {order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:space-x-12">
                      <div className="text-right sm:text-left">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${order.color}`}>{order.status}</p>
                        <p className="text-[9px] text-brand-black/40 uppercase tracking-widest">ETA: {order.ETA}</p>
                      </div>
                      <button className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowUpRight size={16} className="text-brand-black/40 group-hover:text-brand-black" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center border border-dashed border-brand-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-brand-black/30">No active deliveries</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Assets / Digital Collectibles */}
            <div className="bg-white border border-brand-border rounded-sm p-8">
               <div className="flex justify-between items-center mb-8 border-b border-brand-offwhite pb-4">
                <h2 className="text-xl font-serif italic">Signature Assets</h2>
                <Layers size={16} className="text-brand-black/40" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {assets.length > 0 ? assets.map((asset, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-brand-offwhite rounded-sm mb-3 overflow-hidden border border-brand-border group-hover:border-brand-black transition-colors">
                      <img src={asset.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest truncate">{asset.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[9px] text-brand-black/40 uppercase tracking-widest">{asset.creator}</p>
                      <p className="text-[9px] font-bold text-blue-600">{asset.price}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center border border-dashed border-brand-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-brand-black/30">No signature assets acquired</p>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Selection */}
            <div className="bg-brand-black text-white p-10 rounded-sm relative overflow-hidden">
               <div className="relative z-10 max-w-md">
                 <h2 className="text-3xl font-serif italic mb-4">The Curator's Edit</h2>
                 <p className="text-sm font-light text-white/60 leading-relaxed mb-8">
                   We've analyzed your preferences. These creators fit the "Sovereign Northern" profile you're exploring.
                 </p>
                 <Link to="/roster" className="inline-flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest bg-white text-brand-black px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
                   <span>Explore Personalized Registry</span>
                   <ArrowUpRight size={14} />
                 </Link>
               </div>
               <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                 <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600" className="h-full w-full object-cover" />
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <div className="bg-white border border-brand-border p-8 rounded-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif italic">Active Cart</h2>
                  <ShoppingBag size={16} className="text-brand-black/40" />
                </div>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                   {cart.length > 0 ? cart.map((item, i) => (
                     <div key={i} className="flex items-center space-x-3 text-[10px]">
                       <div className="w-10 h-10 bg-brand-offwhite rounded-sm"></div>
                       <div className="flex-1">
                          <p className="font-bold uppercase tracking-widest truncate">{item.name}</p>
                          <p className="text-brand-black/40">{item.quantity}x {item.price}</p>
                       </div>
                     </div>
                   )) : (
                     <p className="text-[10px] uppercase tracking-widest text-brand-black/30 text-center py-4 italic">Your cart is empty</p>
                   )}
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-black/90 transition-colors"
                >
                  Checkout Now
                </button>
             </div>

             <div className="bg-white border border-brand-border p-8 rounded-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif italic">Vault & Credits</h2>
                  <CreditCard size={16} className="text-brand-black/40" />
                </div>
                <div className="p-6 bg-brand-offwhite border border-brand-border rounded-sm text-center mb-6">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40 mb-1">Available Settlement</p>
                  <p className="text-4xl font-serif">£0.00</p>
                </div>
                <button className="w-full bg-brand-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-black/90 transition-colors mb-4">
                  Add Credits
                </button>
                <button className="w-full border border-brand-border text-brand-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-offwhite transition-colors">
                  Withdrawal History
                </button>
             </div>

             <div className="bg-white border border-brand-border p-8 rounded-sm">
               <h2 className="text-xl font-serif italic mb-6">Preferences</h2>
               <div className="space-y-4">
                  {[
                    { label: 'Profile Settings', icon: User },
                    { label: 'Security & Privacy', icon: ShieldCheck },
                    { label: 'Notification Hub', icon: Bell },
                    { label: 'Registry Filters', icon: Settings },
                  ].map((item) => (
                    <button key={item.label} className="flex items-center space-x-3 w-full text-left p-3 hover:bg-brand-offwhite transition-colors rounded-sm group">
                      <item.icon size={18} className="text-brand-black/40 group-hover:text-brand-black" />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
               </div>
             </div>

             <div className="p-8 border border-brand-black/10 rounded-sm bg-gradient-to-br from-white to-brand-offwhite">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black mb-4">Agency Priority</p>
                <p className="text-xs font-light leading-relaxed text-brand-black/60 italic">
                  As a priority member, you receive early notification of roster rotations and signature asset drops.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
