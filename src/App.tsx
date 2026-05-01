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
  Twitter,
  Menu
} from 'lucide-react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// --- Types & Constants ---

type ViewState = 'home' | 'product' | 'checkout' | 'all-products';

interface Product {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  instagram: string;
  onlyfans: string;
  bio: string;
  price: string;
  image: string;
  gallery: string[];
}

const MODELS: Product[] = [
  { 
    id: 'sophia', 
    name: 'Sophia', 
    subtitle: 'High-Fashion Elite', 
    location: 'Greater London', 
    instagram: '@sophia_marella', 
    onlyfans: 'onlyfans.com/sophia_elite',
    bio: 'The definition of London elegance. Sophia combines high-fashion aesthetics with a mischievous streak that keeps her fans hooked.',
    price: '£500/Session', 
    image: 'https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophcoverphoto-CGr776cV.png',
    gallery: [
      'https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=1000',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000'
    ]
  },
  { 
    id: 'isabella', 
    name: 'Isabella', 
    subtitle: 'Northern Silk', 
    location: 'Manchester', 
    instagram: '@bella_silk', 
    onlyfans: 'onlyfans.com/bellas_secrets',
    bio: 'Northern charm at its finest. Isabella is known for her authentic connection and unfiltered presence.',
    price: '£450/Session', 
    image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'mia', 
    name: 'Mia', 
    subtitle: 'Midlands Rose', 
    location: 'Birmingham', 
    instagram: '@mia_rose_uk', 
    onlyfans: 'onlyfans.com/miarose',
    bio: 'Classically beautiful with a contemporary edge. Mia captures the spirit of the Midlands.',
    price: '£400/Session', 
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'olivia', 
    name: 'Olivia', 
    subtitle: 'Yorkshire Belle', 
    location: 'Leeds', 
    instagram: '@liv_leeds', 
    onlyfans: 'onlyfans.com/oliviamodels',
    bio: 'A mix of sophisticated wit and natural beauty. Olivia is a fan favorite across the UK.',
    price: '£350/Session', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'ava', 
    name: 'Ava', 
    subtitle: 'Heritage Chic', 
    location: 'East Midlands', 
    instagram: '@ava_heritage', 
    onlyfans: 'onlyfans.com/ava_chic',
    bio: 'Timeless beauty with a modern OnlyFans strategy.',
    price: '£380/Session', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'lily', 
    name: 'Lily', 
    subtitle: 'Western Wild', 
    location: 'Bristol', 
    instagram: '@lily_bristol', 
    onlyfans: 'onlyfans.com/lilywild',
    bio: 'Creative, edgy, and unapologetically British.',
    price: '£300/Session', 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'emily', 
    name: 'Emily', 
    subtitle: 'Geordie Star', 
    location: 'Newcastle', 
    instagram: '@emily_ncl', 
    onlyfans: 'onlyfans.com/emilyncl',
    bio: 'Bringing Northern energy and high-earning content to the roster.',
    price: '£420/Session', 
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'grace', 
    name: 'Grace', 
    subtitle: 'Mersey Muse', 
    location: 'Liverpool', 
    instagram: '@grace_mersey', 
    onlyfans: 'onlyfans.com/grace_m',
    bio: 'A powerhouse of charm and commercial appeal.',
    price: '£390/Session', 
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'chloe', 
    name: 'Chloe', 
    subtitle: 'Scottish Spirit', 
    location: 'Edinburgh', 
    instagram: '@chloe_edi', 
    onlyfans: 'onlyfans.com/chloe_spirit',
    bio: 'Sophistication from the north of the border.',
    price: '£450/Session', 
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'sophie-c', 
    name: 'Sophie C.', 
    subtitle: 'Welsh Wonder', 
    location: 'Cardiff', 
    instagram: '@sophie_c_cardiff', 
    onlyfans: 'onlyfans.com/sophie_c',
    bio: 'Authentic connection and stunning visuals.',
    price: '£320/Session', 
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000',
    gallery: []
  }
];

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="aspect-[4/5] bg-brand-offwhite mb-4 overflow-hidden relative rounded-sm">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-widest px-2 py-1 font-bold rounded-full">
            {product.location}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <button className="bg-white px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-lg hover:bg-brand-black hover:text-white transition-colors">
            Book Session
           </button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-serif italic mb-1">{product.name}</h3>
          <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-1">{product.subtitle}</p>
          <p className="text-[9px] text-brand-black/60 font-medium lowercase font-mono">{product.instagram}</p>
        </div>
        <p className="text-sm font-medium">{product.price}</p>
      </div>
    </div>
  );
};

const AllProductsView = ({ onBack, onProductClick }: { onBack: () => void, onProductClick: (p: Product) => void }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  const locations = Array.from(new Set(MODELS.map(m => m.location)));

  const filteredModels = selectedLocation 
    ? MODELS.filter(m => m.location === selectedLocation)
    : MODELS;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-12 md:pt-16 px-6 md:px-12 bg-white"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 max-w-7xl mx-auto gap-8">
        <div>
          <nav className="flex items-center space-x-2 text-[9px] uppercase tracking-widest text-brand-black/40 mb-4">
            <span className="cursor-pointer hover:text-brand-black" onClick={onBack}>The Firm</span>
            <ChevronRight size={10} />
            <span className="text-brand-black">The Lineup</span>
          </nav>
          <h1 className="text-6xl italic">The Roster</h1>
          <p className="text-brand-black/50 mt-4 text-lg font-light tracking-wide">Elite United Kingdom talent curated for dominance.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowLocationFilter(!showLocationFilter)}
            className="flex items-center space-x-3 text-[11px] font-bold uppercase tracking-widest border-b border-brand-black pb-1 hover:opacity-50 transition-opacity"
          >
            <span>Focus: {selectedLocation || 'UK National'}</span>
            <ChevronRight size={14} className={`transition-transform duration-300 ${showLocationFilter ? 'rotate-[-90deg]' : 'rotate-90'}`} />
          </button>
          
          <AnimatePresence>
            {showLocationFilter && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 bg-white border border-brand-border p-6 z-50 w-64 shadow-xl grid grid-cols-1 gap-3"
              >
                <button 
                  onClick={() => { setSelectedLocation(null); setShowLocationFilter(false); }}
                  className={`text-[10px] uppercase tracking-widest text-left font-bold border-b border-brand-border pb-2 ${selectedLocation === null ? 'text-blue-600' : 'text-brand-black/40'}`}
                >
                  All Hubs
                </button>
                {locations.map(loc => (
                  <button 
                    key={loc}
                    onClick={() => { setSelectedLocation(loc); setShowLocationFilter(false); }}
                    className={`text-[10px] uppercase tracking-widest text-left hover:text-brand-black transition-colors ${selectedLocation === loc ? 'text-blue-600 font-bold' : 'text-brand-black/40'}`}
                  >
                    {loc}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 max-w-7xl mx-auto pb-24">
        {filteredModels.map((p) => (
          <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
        ))}
      </div>
    </motion.div>
  );
};

const COLLECTIONS = [
  { id: 'posh', label: 'Date Night', image: 'https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=1600&auto=format&fit=crop' },
  { id: 'bratty', label: 'Work Week', image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1600&auto=format&fit=crop' },
  { id: 'girl-next-door', label: 'Weekend Escape', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop' },
  { id: 'sophisticate', label: 'City Chic', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop' },
  { id: 'regional', label: 'Coastal Ease', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop' },
];

// Already defined at the top

// --- Components ---

const Navbar = ({ cartCount, onCartOpen }: { cartCount: number, onCartOpen: () => void }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { label: 'The Roster', id: 'shop' },
    { label: 'Mood Edits', id: 'collections' },
    { label: 'The Agency', id: 'about' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav 
      onMouseLeave={() => setActiveMenu(null)}
      className="fixed top-0 left-0 w-full z-50 bg-brand-offwhite border-b border-brand-border h-12 md:h-16 flex items-center px-4 md:px-12 transition-all duration-300"
    >
      <div className="flex-1 flex items-center">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="h-32 md:h-56 flex items-center mr-4 md:mr-16 translate-y-2 md:translate-y-4"
          >
            <img 
              src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2001_48_30%20AM.png" 
              alt="Marella Agency" 
              className="h-full w-auto object-contain mix-blend-multiply" 
              fetchPriority="high"
              loading="eager"
            />
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="hidden sm:block text-[10px] tracking-[0.2em] uppercase font-bold text-brand-black/60 hover:text-brand-black transition-colors"
          >
            The Firm
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase ml-12">
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

      <div className="flex justify-end items-center space-x-4 md:space-x-10 text-[11px] font-bold tracking-[0.15em] uppercase">
        <button className="hover:opacity-50 transition-opacity flex items-center">
          <Search size={16} />
          <span className="hidden lg:inline ml-3 font-semibold">Registry</span>
        </button>
        <button 
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="hover:opacity-50 transition-opacity flex items-center"
        >
          <User size={16} />
          <span className="hidden lg:inline ml-3 font-semibold">{user ? 'Portal' : 'Talent Login'}</span>
        </button>
        <button onClick={onCartOpen} className="hover:opacity-50 transition-opacity flex items-center">
          <ShoppingBag size={16} />
          <span className="hidden lg:inline ml-3 font-semibold">Selections ({cartCount})</span>
          {cartCount > 0 && <span className="lg:hidden ml-1">({cartCount})</span>}
        </button>
        
        {/* Mobile Hamburger */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden hover:opacity-50 transition-opacity ml-2"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-brand-offwhite lg:hidden flex flex-col p-8 pt-24"
          >
            <button 
              onClick={toggleMobileMenu}
              className="absolute top-6 right-6 p-2 text-brand-black"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col space-y-8">
              <button 
                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                className="text-[10px] tracking-[0.3em] uppercase font-bold text-left border-b border-brand-border pb-4 w-fit"
              >
                The Firm (Home)
              </button>
              {menuItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className="text-2xl font-serif italic text-left hover:pl-4 transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-6 pt-12 border-t border-brand-border">
               <button 
                onClick={() => { navigate(user ? '/dashboard' : '/login'); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-4 text-[11px] tracking-widest uppercase font-bold"
              >
                <User size={18} />
                <span>{user ? 'Talent Portal' : 'Talent Login'}</span>
              </button>
              <button 
                onClick={() => { onCartOpen(); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-4 text-[11px] tracking-widest uppercase font-bold"
              >
                <ShoppingBag size={18} />
                <span>My Selections ({cartCount})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Menus (Desktop) */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full bg-brand-offwhite border-b border-brand-border py-16 px-12 z-40 hidden lg:block"
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
    <section className="relative h-screen w-full flex items-center px-6 md:px-24 overflow-hidden pt-12 md:pt-16 bg-brand-offwhite">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophcoverphoto-CGr776cV.png" 
          alt="Sophia - Marella Agency"
          className="w-full h-full object-contain"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-brand-black/5"></div>
      </div>
      
      <div className="relative z-10 max-w-sm flex flex-col items-start">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white/80 text-[10px] uppercase tracking-[0.4em] font-bold mb-4"
        >
          hey im sophia
        </motion.p>
        <motion.button 
          onClick={onShopNow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-blue-600 text-white px-8 py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-blue-700 transition-all duration-300 relative group overflow-hidden"
        >
          <span className="relative z-10">Apply to Roster</span>
          <span className="absolute bottom-3 left-8 right-8 h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
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
            OnlyFans excellence,<br />
            without ever showing your face
          </h2>
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-black/5">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophia_Intro_website_1.mp4#t=5" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="md:pt-32 space-y-12 flex flex-col">
          <div className="max-w-md order-1">
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6">
              Bramingham Barely is a top tier OnlyFans management firm based in the UK.
            </p>
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6">
              We believe the beautiful part of kink is that there's room for everyone ❤️. Yes, it can be harder if you don't fit the usual "norm"... but that doesn't mean it's impossible.
            </p>
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6 font-medium italic">
              We specialize in turning talented British creators into high-earning stars by combining cultural appeal, smart strategy, and real business management.
            </p>
            <p className="text-2xl font-serif italic text-brand-black mb-8">
              In short: we make girls rich
            </p>
            <button className="text-[11px] font-bold tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity mb-12">
              The Agency Pillars
            </button>
          </div>
          
          <div className="space-y-4 order-2 flex flex-col items-center md:items-start">
            <div className="aspect-[9/16] w-full max-w-[320px] bg-black/5 rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                preload="auto"
                className="w-full h-full object-cover"
              >
                <source src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/gia_review%20(1).mp4" type="video/mp4" />
              </video>
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-black/40 text-center w-full max-w-[320px] md:text-left">
              model review
            </p>
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
          <span className="text-white/60 text-[11px] font-medium tracking-[0.3em] uppercase mb-4">Mood Edits</span>
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

      {/* Payment Logos Section */}
      <div className="py-20 px-6 bg-brand-offwhite flex flex-col items-center border-t border-brand-border">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-black/30 mb-12"
        >
          Secure Payment Methods
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-12 max-w-6xl"
        >
          <img src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/41fe5e9d3f2cd4474a88020f15561b6eda43ebef-3840x2160.png" alt="Visa" className="h-6 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="AMEX" className="h-5 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6 md:h-9 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          <div className="bg-[#003087] px-3 py-1 rounded-md opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-white font-bold italic text-sm md:text-lg">Pay+</span>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          
          {/* Klarna & Clearpay boxes */}
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <img src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Klarna_Payment_Badge.svg.png" alt="Klarna" className="h-8 md:h-12 w-auto rounded-lg" />
          </div>
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            <img src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/images.png" alt="Clearpay" className="h-8 md:h-12 w-auto rounded-lg" />
          </div>
          <div className="bg-white border border-brand-border px-4 py-2 rounded-lg flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 md:h-7 w-auto" />
          </div>
        </motion.div>
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
          <p className="text-brand-black font-bold mb-8">Mood Edits</p>
          <p className="hover:text-brand-black cursor-pointer">Date Night</p>
          <p className="hover:text-brand-black cursor-pointer">Work Week</p>
          <p className="hover:text-brand-black cursor-pointer">Weekend Escape</p>
          <p className="hover:text-brand-black cursor-pointer">City Chic</p>
          <p className="hover:text-brand-black cursor-pointer">Coastal Ease</p>
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
        
        <div className="h-24 md:h-48 flex items-center select-none opacity-10 grayscale">
          <img 
            src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2001_48_30%20AM.png" 
            alt="Marella Agency Logo" 
            className="h-full w-auto object-contain" 
          />
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

const ProductDetail = ({ product, onBack, onAddToCart }: { product: Product, onBack: () => void, onAddToCart: () => void }) => {
  const [selectedDate, setSelectedDate] = useState('Today');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-12 md:pt-16 px-6 md:px-12 bg-white"
    >
      <button onClick={onBack} className="mb-8 flex items-center space-x-2 text-[10px] uppercase tracking-widest group">
        <X size={14} className="transition-transform group-hover:rotate-90" />
        <span>Back to Roster</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="aspect-[4/5] bg-brand-offwhite rounded-sm overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.gallery.map((img, i) => (
              <div key={i} className="aspect-square bg-brand-offwhite rounded-sm overflow-hidden">
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 max-w-lg">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-brand-black text-white text-[9px] px-3 py-1 uppercase tracking-widest">Elite Talent</span>
              <span className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold">{product.location} Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-4 italic">{product.name}</h1>
            <p className="text-lg text-brand-black/60 mb-6 font-light">{product.subtitle}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold">Biography</h3>
            <p className="text-lg leading-relaxed font-light text-brand-black/80">
              {product.bio}
            </p>
          </div>

          <div className="pt-8 border-t border-brand-border space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-brand-border p-4 rounded-sm">
                  <p className="text-[9px] uppercase tracking-widest text-brand-black/40 mb-1">Fee</p>
                  <p className="text-xl font-medium">{product.price}</p>
                </div>
                <div className="border border-brand-border p-4 rounded-sm">
                  <p className="text-[9px] uppercase tracking-widest text-brand-black/40 mb-1">Availability</p>
                  <p className="text-lg font-medium text-green-600">Immediate</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold">Social Connection</p>
                <div className="flex space-x-6">
                   <a href="#" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
                     <Instagram size={14} />
                     <span>{product.instagram}</span>
                   </a>
                   <a href="#" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
                     <Globe size={14} />
                     <span>OnlyFans Profile</span>
                   </a>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold">Select Date for Session</p>
              <div className="flex flex-wrap gap-2">
                {['Today', 'Tomorrow', 'This Weekend', 'Next Week'].map(date => (
                  <button 
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${selectedDate === date ? 'bg-brand-black text-white' : 'bg-brand-offwhite text-brand-black hover:bg-brand-border'}`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={onAddToCart}
              className="w-full bg-brand-black text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors"
            >
              Confirm Booking Selection
            </button>
            <p className="text-[9px] text-center text-brand-black/40 uppercase tracking-widest mt-4 italic">
              *All sessions are managed through our secure UK architecture.
            </p>
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
                <span className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Recommended Talents</span>
                <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
                  {MODELS.slice(1, 4).map(p => (
                    <div key={p.id} className="min-w-[12rem] group">
                      <div className="aspect-square bg-brand-offwhite mb-2 overflow-hidden">
                        <img src={p.image} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-xs font-serif italic">{p.name}</p>
                      <button className="text-[9px] uppercase tracking-widest mt-2 border-b border-brand-black">View Profile</button>
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

const Home = ({ onViewChange, onProductClick }: { onViewChange: (v: ViewState) => void, onProductClick: (p: Product) => void }) => {
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl italic">The Lineup</h2>
              <p className="text-lg font-light text-brand-black/60 max-w-md">
                These are our girls. The sexiest, most obedient, and most insatiable talents we represent. 
                Pick one. Or pick several. Just know once you enter The Lineup… you won’t want to leave
              </p>
            </div>
            <button onClick={() => onViewChange('all-products')} className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
              View The Full Roster
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {MODELS.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => onProductClick(p)} />
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    setCartOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0, 0);
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
              <Home onViewChange={(v) => { setView(v); window.scrollTo(0, 0); }} onProductClick={handleProductClick} />
            </motion.div>
          ) : view === 'product' && selectedProduct ? (
            <motion.div key="product">
              <ProductDetail 
                product={selectedProduct} 
                onBack={() => setView('home')} 
                onAddToCart={handleAddToCart} 
              />
            </motion.div>
          ) : (
            <motion.div key="all-products">
              <AllProductsView onBack={() => setView('home')} onProductClick={handleProductClick} />
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
