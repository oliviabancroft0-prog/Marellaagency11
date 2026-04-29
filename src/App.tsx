/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Minus, 
  Plus, 
  X, 
  ChevronRight, 
  ArrowRight,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Twitter
} from 'lucide-react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// --- Types & Constants ---

type ViewState = 'home' | 'product' | 'checkout' | 'all-products';

const PRODUCTS = [
  { id: 'account-management', name: 'Elite OF Management', subtitle: '24/7 Chat & PPV Optimization', price: '£1,499/mo', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop' },
  { id: 'market-strategy', name: 'UK Market Strategy', subtitle: 'High-LTV UK Fan Targeting', price: '£999/plan', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop' },
  { id: 'cross-promotion', name: 'Network Synergy', subtitle: 'Exclusive UK Roster Sync', price: 'Bespoke', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop' },
  { id: 'production', name: 'Premium Production', subtitle: 'Vocal Signature & Visuals', price: '£2,495/pkg', image: 'https://images.unsplash.com/photo-1590156221170-ce35ee77cb7a?q=80&w=1000&auto=format&fit=crop' },
];

type Product = typeof PRODUCTS[0];

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="aspect-[4/5] bg-[#f5f5f5] mb-4 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-brand-black hover:text-white transition-colors">
            <Plus size={18} />
           </button>
        </div>
      </div>
      <h3 className="text-xl font-serif italic mb-1">{product.name}</h3>
      <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-3">{product.subtitle}</p>
      <p className="text-sm font-medium">{product.price}</p>
    </div>
  );
};

const AllProductsView = ({ onBack, onProductClick }: { onBack: () => void, onProductClick: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 px-6 md:px-12 bg-white"
    >
      <div className="flex justify-between items-end mb-16 max-w-7xl mx-auto">
        <div>
          <nav className="flex items-center space-x-2 text-[9px] uppercase tracking-widest text-brand-black/40 mb-4">
            <span className="cursor-pointer hover:text-brand-black" onClick={onBack}>The Firm</span>
            <ChevronRight size={10} />
            <span className="text-brand-black">Bespoke Services</span>
          </nav>
          <h1 className="text-6xl italic">The OnlyFans Suite</h1>
          <p className="text-brand-black/50 mt-4 text-lg font-light tracking-wide">Strategic architecture for elite United Kingdom creators.</p>
        </div>
        <button className="flex items-center space-x-3 text-[11px] font-bold uppercase tracking-widest border-b border-brand-black pb-1">
          <span>Focus</span>
          <ChevronRight size={14} className="rotate-90" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 max-w-7xl mx-auto pb-24">
        {[...PRODUCTS, ...PRODUCTS].map((p, i) => (
          <ProductCard key={`${p.id}-${i}`} product={p} onClick={onProductClick} />
        ))}
      </div>
    </motion.div>
  );
};

const COLLECTIONS = [
  { id: 'posh', label: 'Posh', image: 'https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=1600&auto=format&fit=crop' },
  { id: 'bratty', label: 'Bratty', image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1600&auto=format&fit=crop' },
  { id: 'girl-next-door', label: 'Girl-next-door', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop' },
  { id: 'sophisticate', label: 'Sophisticate', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop' },
  { id: 'regional', label: 'Regional', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop' },
];

// Already defined at the top

// --- Components ---

const Navbar = ({ cartCount, onCartOpen }: { cartCount: number, onCartOpen: () => void }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { label: 'The Roster', id: 'shop' },
    { label: 'UK Archetypes', id: 'collections' },
    { label: 'The Agency', id: 'about' },
    { label: 'OF Strategy', id: 'treatments' },
  ];

  return (
    <nav 
      onMouseLeave={() => setActiveMenu(null)}
      className="fixed top-0 left-0 w-full z-50 bg-brand-offwhite border-b border-brand-border h-16 md:h-20 flex items-center px-6 md:px-12 transition-all duration-300"
    >
      <div className="flex-1 flex items-center">
        <button onClick={() => navigate('/')} className="flex items-center space-x-2 md:space-x-3 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase font-display mr-8 md:mr-16">
          <span>Bramingham</span>
          <div className="w-4 md:w-8 h-[1px] bg-brand-black"></div>
          <span>Barely</span>
        </button>

        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onMouseEnter={() => setActiveMenu(item.id)}
              onClick={() => navigate('/')}
              className={`hover:opacity-50 transition-opacity ${activeMenu === item.id ? 'opacity-50' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center space-x-6 md:space-x-10 text-[11px] font-bold tracking-[0.15em] uppercase">
        <div className="hidden xl:flex items-center space-x-2 text-brand-black/40">
          <span>Currency: GBP / £</span>
        </div>
        <button className="hover:opacity-50 transition-opacity flex items-center">
          <Search size={16} />
          <span className="hidden sm:inline ml-3">Registry</span>
        </button>
        <button 
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="hover:opacity-50 transition-opacity flex items-center"
        >
          <User size={16} />
          <span className="hidden sm:inline ml-3">{user ? 'Portal' : 'Talent Login'}</span>
        </button>
        <button onClick={onCartOpen} className="hover:opacity-50 transition-opacity flex items-center">
          <ShoppingBag size={16} />
          <span className="ml-3">Selections ({cartCount})</span>
        </button>
      </div>

      {/* Dropdown Menus */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full bg-brand-offwhite border-b border-brand-border py-16 px-12 z-40"
          >
            {activeMenu === 'shop' && (
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-24">
                <div className="space-y-6">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">By Demand</p>
                  <p className="text-xl font-serif italic hover:opacity-50 cursor-pointer">View Elite Roster</p>
                  <p className="text-xl font-serif italic hover:opacity-50 cursor-pointer">Emerging UK Models</p>
                  <p className="text-xl font-serif italic hover:opacity-50 cursor-pointer">Highest Earners</p>
                </div>
                <div className="space-y-4">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">UK Hubs</p>
                  {['Greater London', 'Manchester Silk', 'The Midlands', 'The North East', 'Home Counties', 'UK National'].map(type => (
                    <p key={type} className="text-sm font-light hover:opacity-50 cursor-pointer">{type}</p>
                  ))}
                </div>
                <div className="space-y-4 col-span-2">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">OF Specialism</p>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {['Vocal Signature GFE', 'Luxury Lifestyle', 'Sophisticated UK Wit', 'High-Yield PPV', 'Authentic UK Girlfriend', 'Digital Authority', 'Cultural Signature', 'Aesthetic Excellence'].map(concern => (
                      <p key={concern} className="text-sm font-light hover:opacity-50 cursor-pointer">{concern}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeMenu === 'collections' && (
              <div className="max-w-7xl mx-auto flex justify-between">
                {[
                  { id: 'posh', label: 'The Posh', count: '12 Assets' },
                  { id: 'bratty', label: 'The Bratty', count: '8 Assets' },
                  { id: 'girl-next-door', label: 'The Girl Next Door', count: '15 Assets' },
                  { id: 'sophisticate', label: 'The Sophisticate', count: '10 Assets' },
                  { id: 'regional', label: 'The Regional Signature', count: '7 Assets' },
                ].map((c, i) => (
                  <div key={c.id} className="text-center group cursor-pointer">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border border-brand-border p-2">
                       <img src={COLLECTIONS[i].image} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold">{c.label}</p>
                    <p className="text-[9px] text-brand-black/40 mt-1 uppercase tracking-widest italic">{c.count}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onShopNow }: { onShopNow: () => void }) => {
  return (
    <section className="relative h-screen w-full flex items-center px-6 md:px-24 overflow-hidden pt-16 bg-brand-offwhite">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophcoverphoto-CGr776cV.png" 
          alt="Hero Model"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-brand-black/5"></div>
      </div>
      
      <div className="relative z-10 max-w-sm">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl text-white mb-6 leading-[1.1]"
        >
          The Premier OnlyFans Agency for UK Creators
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white/80 text-lg mb-8 leading-relaxed font-light"
        >
          Scaling elite United Kingdom talent through professional management, high-converting PPV strategies, and domestic market dominance.
        </motion.p>
        <motion.button 
          onClick={onShopNow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-white text-[11px] font-medium tracking-[0.3em] uppercase border-b border-white pb-2 hover:opacity-70 transition-opacity"
        >
          Apply to Roster
        </motion.button>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <h2 className="text-4xl md:text-5xl leading-tight">
            United Kingdom Authenticity.<br />
            OnlyFans Excellence.
          </h2>
          <div className="relative aspect-[4/5] w-64">
            <img 
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1200&auto=format&fit=crop" 
              alt="Philosophy Firm"
              className="w-full h-full object-cover rounded-sm h-112"
            />
          </div>
        </div>
        <div className="md:pt-32 space-y-12">
          <div className="aspect-[16/9] w-full">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop" 
              alt="Philosophy Lifestyle"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="max-w-md">
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-8">
              Bramingham Barely is a top-tier OnlyFans management firm established to identify and scale elite creators within the United Kingdom. We operate at the intersection of cultural authority and professional business management, transforming raw talent into high-revenue commercial entities by leveraging the psychological appeal of the UK persona.
            </p>
            <button className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
              The Agency Pillars
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const CollectionsSlider = () => {
  const [active, setActive] = useState(COLLECTIONS[0].id);

  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <AnimatePresence mode='wait'>
          <motion.img 
            key={active}
            src={COLLECTIONS.find(c => c.id === active)?.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-24 flex justify-between items-end pb-24 h-full">
        <div className="flex flex-col space-y-4">
          <span className="text-white/60 text-[11px] font-medium tracking-[0.3em] uppercase mb-4">UK Archetypes</span>
          {COLLECTIONS.map((c) => (
            <button 
              key={c.id}
              onClick={() => setActive(c.id)}
              onMouseEnter={() => setActive(c.id)}
              className={`text-4xl md:text-7xl italic font-serif text-left transition-all duration-300 ${active === c.id ? 'text-white translate-x-4' : 'text-white/40 hover:text-white/70'}`}
            >
              ({c.label})
            </button>
          ))}
        </div>
        
        <div className="pb-4">
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-white/20 transition-colors">
            View Archetype
          </button>
        </div>
      </div>
    </section>
  );
};

// Removed ProductCard and props from here - moved to top

const Footer = () => {
  return (
    <footer className="bg-brand-offwhite">
      <div className="relative h-[60vh] w-full mt-24">
        <img 
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2600&auto=format&fit=crop" 
          alt="Footer background" 
          className="w-full h-full object-cover grayscale opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-6xl max-w-2xl leading-tight mb-8">
            The UK persona is an elite financial asset. Let us manage the OnlyFans architecture.
          </h2>
          <button className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
            Apply to the Roster
          </button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-24 border-t border-brand-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 text-[11px] tracking-widest uppercase text-brand-black/60">
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">UK Market Hubs</p>
          <p className="hover:text-brand-black cursor-pointer">London Elite</p>
          <p className="hover:text-brand-black cursor-pointer">Manchester Silk</p>
          <p className="hover:text-brand-black cursor-pointer">Birmingham Style</p>
          <p className="hover:text-brand-black cursor-pointer">Northern Authority</p>
          <p className="hover:text-brand-black cursor-pointer">UK National</p>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">UK Archetypes</p>
          <p className="hover:text-brand-black cursor-pointer">Posh</p>
          <p className="hover:text-brand-black cursor-pointer">Bratty</p>
          <p className="hover:text-brand-black cursor-pointer">Girl-Next-Door</p>
          <p className="hover:text-brand-black cursor-pointer">Sophisticate</p>
          <p className="hover:text-brand-black cursor-pointer">Regional Hub</p>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Elite Roster</p>
          <p className="hover:text-brand-black cursor-pointer">Top 0.1% Management</p>
          <p className="hover:text-brand-black cursor-pointer">Emerging Creations</p>
          <p className="hover:text-brand-black cursor-pointer">UK Exclusive</p>
          <p className="hover:text-brand-black cursor-pointer">Synergy Sync</p>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Creator Portal</p>
          <p className="hover:text-brand-black cursor-pointer">Login</p>
          <p className="hover:text-brand-black cursor-pointer">Apply Now</p>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">The Agency</p>
          <p className="hover:text-brand-black cursor-pointer">Our Philosophy</p>
          <p className="hover:text-brand-black cursor-pointer">UK Three Pillars</p>
          <p className="hover:text-brand-black cursor-pointer">Growth Strategy</p>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Authority</p>
          <div className="flex items-center space-x-4">
            <Instagram size={14} className="hover:text-brand-black cursor-pointer" />
            <Facebook size={14} className="hover:text-brand-black cursor-pointer" />
            <Twitter size={14} className="hover:text-brand-black cursor-pointer" />
            <Youtube size={14} className="hover:text-brand-black cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-12 border-t border-brand-border flex flex-col lg:flex-row justify-between items-center space-y-12 lg:space-y-0">
        <div className="flex flex-col space-y-4">
          <p className="text-[11px] tracking-widest uppercase">Apply for the Bramingham Barely United Kingdom Elite Roster</p>
          <div className="flex border-b border-brand-black pb-2">
            <input type="email" placeholder="OnlyFans Link / Social Footprint" className="bg-transparent text-sm w-64 focus:outline-none" />
            <button className="text-[10px] tracking-widest uppercase font-bold">Apply</button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-4xl md:text-8xl font-black uppercase font-display select-none opacity-10">
          <span>Bramingham</span>
          <div className="w-12 h-[2px] bg-brand-black"></div>
          <span>Barely</span>
        </div>

        <div className="text-[10px] tracking-widest uppercase text-brand-black/50 text-right space-y-2">
          <p>&copy; 2024, Bramingham Barely. All rights reserved.</p>
          <div className="flex space-x-4 justify-end">
            <span className="hover:text-brand-black cursor-pointer">Terms of Service</span>
            <span className="hover:text-brand-black cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ProductDetail = ({ onBack, onAddToCart }: { onBack: () => void, onAddToCart: () => void }) => {
  const [qty, setQty] = useState(1);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-6 md:px-12 bg-white"
    >
      <button onClick={onBack} className="mb-8 flex items-center space-x-2 text-[10px] uppercase tracking-widest group">
        <X size={14} className="transition-transform group-hover:rotate-90" />
        <span>Close</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-square bg-brand-offwhite">
          <img 
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2000&auto=format&fit=crop" 
            alt="Product detail" 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        <div className="space-y-8 max-w-lg">
          <div>
            <span className="inline-block bg-brand-black text-white text-[9px] px-3 py-1 uppercase tracking-widest mb-4">Elite OnlyFans Management</span>
            <h1 className="text-5xl md:text-6xl mb-4 italic">OF Operational Excellence</h1>
            <p className="text-lg text-brand-black/60 mb-6 font-light">24/7 Chat Dominance / High-LTV Retention</p>
          </div>

          <p className="text-lg leading-relaxed font-light">
            Bramingham Barely provides 24/7 professional oversight of all creator communications on OnlyFans. Our management team employs seductive sales techniques and expert PPV optimization to maximize your revenue.
          </p>

          <ul className="space-y-4 text-sm font-light list-disc list-inside border-t border-brand-border pt-8">
            <li>Account & 24/7 Chat Management</li>
            <li>High-Converting PPV Strategies</li>
            <li>Subscriber Retention & Fan LTV Management</li>
            <li>Administrative & Scaling Excellence</li>
          </ul>

          <div className="pt-8 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-brand-border rounded-full px-4 py-3">
                <button onClick={() => setQty(Math.max(1, qty-1))}><Minus size={14} /></button>
                <span className="px-6 font-medium">{qty}</span>
                <button onClick={() => setQty(qty+1)}><Plus size={14} /></button>
              </div>
              <p className="text-2xl font-medium">£1,499</p>
            </div>

            <button 
              onClick={onAddToCart}
              className="w-full bg-brand-black text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors"
            >
              Add to Shortlist
            </button>
            <button className="w-full border border-brand-border py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-offwhite transition-colors">
              Request Strategy Call
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-12">
            <div>
              <p className="text-4xl font-serif italic mb-2">£1M+</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50">Projected annual UK account revenue</p>
            </div>
            <div>
              <p className="text-4xl font-serif italic mb-2">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50">Authentic UK Persona Guarantee</p>
            </div>
            <div>
              <p className="text-4xl font-serif italic mb-2">24/7</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50">OnlyFans Chat & PPV Optimization</p>
            </div>
            <div>
              <p className="text-4xl font-serif italic mb-2">Elite</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/50">Network Synergy & Scale</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CartDrawer = ({ isOpen, onClose, cartCount }: { isOpen: boolean, onClose: () => void, cartCount: number }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold">Selections ({cartCount})</h2>
              <button onClick={onClose} className="group flex items-center space-x-2 text-[10px] uppercase tracking-widest">
                <span>Close</span>
                <X size={16} className="transition-transform group-hover:rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8">
              {cartCount === 0 ? (
                <p className="text-center py-24 text-brand-black/40 font-light italic">Your selection is currently empty.</p>
              ) : (
                <div className="flex items-start space-x-4">
                  <div className="w-24 aspect-square bg-brand-offwhite">
                    <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif italic mb-1">Elite Management</h4>
                    <p className="text-[10px] text-brand-black/50 uppercase tracking-widest mb-4">Scalability / Frictionless</p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center border border-brand-border rounded-full px-3 py-1">
                          <button><Minus size={12} /></button>
                          <span className="px-4 text-xs">{cartCount}</span>
                          <button><Plus size={12} /></button>
                       </div>
                       <p className="text-sm font-medium">£1,499</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-12 border-t border-brand-border space-y-6">
                <span className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Recommended Extensions</span>
                <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
                  {PRODUCTS.slice(1, 3).map(p => (
                    <div key={p.id} className="min-w-[12rem] group">
                      <div className="aspect-square bg-brand-offwhite mb-2 overflow-hidden">
                        <img src={p.image} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-xs font-serif italic">{p.name}</p>
                      <button className="text-[9px] uppercase tracking-widest mt-2 border-b border-brand-black">Add to brief</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-border space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="uppercase tracking-widest font-bold">Total Retainer</span>
                <span className="font-medium">£{cartCount > 0 ? (cartCount * 1499).toLocaleString() : '0'}</span>
              </div>
              <button 
                disabled={cartCount === 0}
                className="w-full bg-brand-black text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit selection
              </button>
              <p className="text-[9px] text-center text-brand-black/40 uppercase tracking-widest">Calculated at proposal. All figures in GBP.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

const AppLayout = ({ children, cartCount, onCartOpen }: { children: React.ReactNode, cartCount: number, onCartOpen: () => void }) => {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-black selection:text-white">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />
      {children}
    </div>
  );
};

const Home = ({ onViewChange }: { onViewChange: (v: ViewState) => void }) => {
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero onShopNow={() => onViewChange('all-products')} />
      <Philosophy />
      
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl italic">UK Market Dominance</h2>
              <p className="text-lg font-light text-brand-black/60 max-w-xs">We provide the strategic OnlyFans architecture required to turn raw UK talent into elite commercial assets.</p>
            </div>
            <button onClick={() => onViewChange('all-products')} className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
              View OnlyFans Suite
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => onViewChange('product')} />
            ))}
          </div>
        </div>
      </section>

      <CollectionsSlider />

      <section className="py-24 bg-brand-offwhite border-t border-brand-border">
        <div className="max-w-3xl mx-auto text-center px-6">
          <p className="text-2xl md:text-3xl font-light leading-relaxed italic mb-8">
            The OnlyFans landscape is competitive. Authentic United Kingdom signatures are high-yield assets. Bramingham Barely ensures your account is localized for peak fan LTV.
          </p>
          <button className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-1 hover:opacity-50 transition-opacity">
            The United Kingdom Advantage
          </button>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
         <div className="aspect-[16/10] bg-brand-offwhite overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542314810-9486c40d164a?q=80&w=1600" alt="Reseller imagery" className="w-full h-full object-cover" />
         </div>
         <div className="space-y-12">
            <h2 className="text-5xl italic">325+ Global Brand Partnerships</h2>
            <div className="flex space-x-12 items-start">
               <div className="w-32 aspect-square bg-brand-offwhite flex items-center justify-center border border-brand-border">
                  <ShoppingBag className="text-brand-black/20" size={48} strokeWidth={1} />
               </div>
               <div className="max-w-sm space-y-6">
                  <p className="text-lg font-light leading-relaxed">Our network of premium partners and high-LTV brands offer exclusive synergies for our roster, ensuring long-term retention and commercial authority.</p>
                  <button className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-1 flex items-center group">
                    <span>Partner with us</span>
                    <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    setCartOpen(true);
  };

  const wrapInLayout = (content: React.ReactNode) => (
    <AppLayout cartCount={cartCount} onCartOpen={() => setCartOpen(true)}>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cartCount={cartCount} />
      {content}
    </AppLayout>
  );

  return (
    <Routes>
      <Route path="/" element={wrapInLayout(
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div key="home">
              <Home onViewChange={(v) => { setView(v); window.scrollTo(0, 0); }} />
            </motion.div>
          ) : view === 'product' ? (
            <motion.div key="product">
              <ProductDetail onBack={() => setView('home')} onAddToCart={handleAddToCart} />
            </motion.div>
          ) : (
            <motion.div key="all-products">
              <AllProductsView onBack={() => setView('home')} onProductClick={() => setView('product')} />
            </motion.div>
          )}
        </AnimatePresence>
      )} />
      
      <Route path="/login" element={wrapInLayout(<Login />)} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {wrapInLayout(<Dashboard />)}
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
