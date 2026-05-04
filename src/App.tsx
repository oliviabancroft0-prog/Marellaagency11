/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link, useParams } from 'react-router-dom';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Minus, 
  Plus, 
  X, 
  ChevronRight, 
  ArrowRight,
  ArrowLeft,
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
    subtitle: 'High-Fashion Editorial', 
    location: 'Central London', 
    instagram: '@sophia_elite', 
    onlyfans: 'onlyfans.com/sophia_elite',
    bio: 'The archetype of London sophistication. Sophia bridges the gap between high-fashion editorial aesthetics and high-yield digital engagement. Her presence is a masterclass in UK-specific cultural appeal.',
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
    subtitle: 'Northern Elegance', 
    location: 'Manchester', 
    instagram: '@bella_silk', 
    onlyfans: 'onlyfans.com/bellas_secrets',
    bio: 'Authenticity is the cornerstone of the Northern brand. Isabella leverages her organic charm to build deep-rooted subscriber loyalty, achieving retention rates that exceed industry benchmarks.',
    price: '£450/Session', 
    image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'mia', 
    name: 'Mia', 
    subtitle: 'Contemporary Heritage', 
    location: 'Birmingham', 
    instagram: '@mia_rose_uk', 
    onlyfans: 'onlyfans.com/miarose',
    bio: 'Mia represents the evolution of the Midlands Rose. With a focus on sophisticated wit and high-fidelity production, she is a prime example of the high-earning potential within the UK market.',
    price: '£400/Session', 
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'olivia', 
    name: 'Olivia', 
    subtitle: 'Yorkshire Signature', 
    location: 'Leeds', 
    instagram: '@liv_leeds', 
    onlyfans: 'onlyfans.com/oliviamodels',
    bio: 'A signature blend of natural beauty and sharp northern intellect. Olivia specialises in high-retention fan engagement, proving that personality is the most valuable asset in the digital creator economy.',
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
    bio: 'Ava combines traditional British heritage aesthetics with a forward-thinking OnlyFans architecture, maximizing revenue through strategic content distribution.',
    price: '£380/Session', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
    gallery: []
  },
  { 
    id: 'lily', 
    name: 'Lily', 
    subtitle: 'Western Creative', 
    location: 'Bristol', 
    instagram: '@lily_bristol', 
    onlyfans: 'onlyfans.com/lilywild',
    bio: 'Bristol-based and unapologetically creative. Lily leverages her avant-garde aesthetic to dominate the Western market, offering a unique value proposition to her dedicated fanbase.',
    price: '£300/Session', 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000',
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
            <Link to="/" className="cursor-pointer hover:text-brand-black">Agency Intelligence</Link>
            <ChevronRight size={10} />
            <span className="text-brand-black">The Performance Roster</span>
          </nav>
          <h1 className="text-6xl italic">UK Talent Portfolio</h1>
          <p className="text-brand-black/50 mt-4 text-lg font-light tracking-wide">Strategic United Kingdom management for elite digital creators.</p>
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

const CATEGORY_CONTENT: Record<string, { title: string; subtitle: string; description: string; image: string }> = {
  'london': {
    title: 'London Hub',
    subtitle: 'The Pinnacle of UK Authority',
    description: 'Central London remains the global epicenter for creative digital assets. Our London hub specialises in high-fashion editorial management, bridging the gap between high-society aesthetics and high-yield digital engagement. We manage the elite, for the elite.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600'
  },
  'manchester': {
    title: 'Manchester Silk',
    subtitle: 'Northern Industrial Elegance',
    description: 'Manchester is the heartbeat of Northern authenticity. We leverage the raw, industrial aesthetic of the city to create a unique "Silk" signature—combining organic charm with sophisticated technical optimisation. Authenticity is the cornerstone of the Northern brand.',
    image: 'https://images.unsplash.com/photo-1515586067373-95420332756f?q=80&w=1600'
  },
  'birmingham': {
    title: 'Birmingham Style',
    subtitle: 'The Midlands Rose Evolution',
    description: 'Birmingham represents the intersection of heritage and contemporary sharp wit. Our Midlands hub focuses on the "Rose" signature—aesthetic excellence paired with a sophisticated personality that drives unparalleled subscriber retention.',
    image: 'https://images.unsplash.com/photo-1574007557239-aac76add8e0b?q=80&w=1600'
  },
  'north': {
    title: 'Northern Authority',
    subtitle: 'The Sovereign Regional Aesthetic',
    description: 'From Leeds to Newcastle, the Northern persona is a powerhouse of digital wealth. We manage the architecture of Northern creative assets, ensuring their cultural resonance translates into peak fan lifetime value.',
    image: 'https://images.unsplash.com/photo-1521444475649-165fb1707921?q=80&w=1600'
  },
  'national': {
    title: 'UK National',
    subtitle: 'The Unified British Signature',
    description: 'Our national strategy architecture ensures that regardless of location, your brand resonates with the specific cultural nuances of the British audience. We specialise in the "British Signature"—a global mark of quality and distinction.',
    image: 'https://images.unsplash.com/photo-1483197452165-7abc1b347947?q=80&w=1600'
  },
  'date-night': {
    title: 'Date Night',
    subtitle: 'The Sophisticated Fantasy',
    description: 'A curated edit focusing on the high-yield "Girlfriend Experience". We architecture the narrative of intimacy, combining high-resolution production with authentic British charm to create an irresistible subscriber escape.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=1600'
  },
  'work-week': {
    title: 'Work Week',
    subtitle: 'Professional Distinction',
    description: 'Management of the "Corporate Chic" aesthetic. We specialise in the professional persona—sophisticated, authoritative, and high-earning. Ideal for creators balancing public reputations with private digital wealth.',
    image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1600'
  },
  'weekend-escape': {
    title: 'Weekend Escape',
    subtitle: 'The Organic Unfiltered',
    description: 'An edit focused on the raw, rural beauty of the British countryside. Low-fidelity aesthetic with high-fidelity engagement. We manage the "Girl Next Door" narrative that consistently tops industry charts.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600'
  },
  'city-chic': {
    title: 'City Chic',
    subtitle: 'Urban Sophistication',
    description: 'For the metropolitan creator. We architecture a lifestyle of high-fashion, high-energy urban aesthetics. This edit is designed for the modern creator who lives at the intersection of luxury and digital influence.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600'
  },
  'coastal-ease': {
    title: 'Coastal Ease',
    subtitle: 'The Serene Aesthetic',
    description: 'A specialized edit reflecting the serenity of the British coast. We focus on soft aesthetics, natural light, and a relaxed persona that offers a premium contrast to urban saturation.',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600'
  },
  'management': {
    title: 'Top 0.1% Management',
    subtitle: 'Elite Performance Architecture',
    description: 'Our top-tier management is reserved for the highest performers. We provide a full-service operational suite, including 24/7 account management, specialised content strategy, and advanced financial optimisation.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600'
  },
  'emerging': {
    title: 'Emerging Creations',
    subtitle: 'The Growth Pipeline',
    description: 'Our incubator for the next generation of British talent. We provide the technical foundations and cultural strategy needed to scale new accounts to the top 1% within record timeframes.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600'
  },
  'exclusive': {
    title: 'UK Exclusive',
    subtitle: 'Bespoke Talent Representation',
    description: 'An exclusive roster of talent representing the very best of British digital beauty. Our exclusive creators receive prioritized management resources and bespoke PR strategies.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600'
  },
  'synergy': {
    title: 'Synergy Sync',
    subtitle: 'Collaborative Wealth Creation',
    description: 'Our proprietary network strategy that leverages internal creator collaborations to drive cross-fanbase growth and unparalleled engagement metrics. Wealth is built through synergy.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600'
  },
  'philosophy': {
    title: 'Our Philosophy',
    subtitle: 'Distinction, Privacy, Wealth',
    description: 'At Bramingham Barely, we believe that your digital persona is your most valuable asset. We architecture a business environment where privacy and elite performance coexist. We dont just manage; we engineer success.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600'
  },
  'pillars': {
    title: 'UK Three Pillars',
    subtitle: 'The Foundations of Authority',
    description: 'Our strategy stands on three immutable pillars: Cultural Resonance (understanding the British fan), Technical Optimisation (algorithmic dominance), and Financial Scalability (diversified wealth creation).',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600'
  },
  'strategy': {
    title: 'Growth Strategy',
    subtitle: 'The Roadmap to the 0.1%',
    description: 'A data-driven approach to OnlyFans management. We utilize advanced analytics and performance metrics to ensure every piece of content contributes to peak fan lifetime value and long-term financial stability.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600'
  }
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const content = categoryId ? CATEGORY_CONTENT[categoryId] : null;

  if (!content) return <Navigate to="/" replace />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-12 bg-brand-offwhite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-brand-black/40">
              <Link to="/" className="hover:text-brand-black">The Firm</Link>
              <ChevronRight size={12} />
              <span>{content.title}</span>
            </nav>
            <h1 className="text-6xl md:text-8xl font-serif italic leading-tight">{content.title}</h1>
            <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase text-brand-black/60">{content.subtitle}</h2>
            <div className="w-24 h-[1px] bg-brand-black/20"></div>
            <p className="text-lg md:text-xl font-light leading-relaxed text-brand-black/80 max-w-xl">
              {content.description}
            </p>
            <div className="pt-8">
              <Link 
                to="/login"
                className="bg-brand-black text-white px-10 py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-brand-black/90 transition-all rounded-sm shadow-xl"
              >
                Apply for Consultation
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
            <img src={content.image} alt={content.title} className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-brand-black/5"></div>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-border pt-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-brand-black/40">Strategic Aim</p>
            <p className="text-sm font-light leading-relaxed">Maximising digital authority through cultural resonance and technical precision. We specialise in the British signature.</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-brand-black/40">Market Authority</p>
            <p className="text-sm font-light leading-relaxed">Dominating the United Kingdom landscape with bespoke management architecture and data-driven engagement.</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-brand-black/40">Wealth Integrity</p>
            <p className="text-sm font-light leading-relaxed">Ensuring long-term financial scalability while maintaining absolute professional privacy and distinction.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Components ---

const Navbar = ({ cartCount, onCartOpen }: { cartCount: number, onCartOpen: () => void }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const menuItems = [
    { label: 'The Roster', id: 'shop' },
    { label: 'Mood Edits', id: 'collections' },
    { label: 'The Agency', id: 'about' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav 
      onMouseLeave={() => setActiveMenu(null)}
      className="fixed top-0 left-0 w-full z-50 bg-brand-offwhite border-b border-brand-border h-[calc(3rem+env(safe-area-inset-top))] md:h-16 flex items-center pt-[env(safe-area-inset-top)] px-4 md:px-12 transition-all duration-300"
    >
      <div className="flex-1 flex items-center h-full">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-6 md:mr-10 flex items-center space-x-2 text-brand-black hover:opacity-50 transition-opacity whitespace-nowrap"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Back</span>
          </button>
        )}
        
        <div className={`flex items-center transition-all duration-300 ${!isHome ? 'hidden sm:flex' : 'flex'}`}>
          <Link 
            to="/" 
            className="h-32 md:h-56 flex items-center mr-4 md:mr-16 translate-y-2 md:translate-y-4"
          >
            <img 
              src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2001_48_30%20AM.png" 
              alt="Bramingham Barely" 
              className="h-full w-auto object-contain mix-blend-multiply" 
              fetchPriority="high"
              loading="eager"
            />
          </Link>
          <Link 
            to="/" 
            className="hidden sm:block text-[10px] tracking-[0.2em] uppercase font-bold text-brand-black/60 hover:text-brand-black transition-colors"
          >
            The Firm
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-bold tracking-[0.2em] uppercase ml-12">
          {menuItems.map(item => (
            <Link 
              key={item.id}
              to="/"
              onMouseEnter={() => setActiveMenu(item.id)}
              className={`hover:opacity-50 transition-opacity ${activeMenu === item.id ? 'opacity-50' : ''}`}
            >
              {item.label}
            </Link>
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
          <span className="hidden lg:inline ml-3 font-semibold">{user ? 'Portal' : 'Creator Login'}</span>
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
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[10px] tracking-[0.3em] uppercase font-bold text-left border-b border-brand-border pb-4 w-fit"
              >
                The Firm (Home)
              </Link>
              {menuItems.map(item => (
                <Link 
                  key={item.id}
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif italic text-left hover:pl-4 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-6 pt-12 border-t border-brand-border">
               <Link 
                to={user ? '/dashboard' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-4 text-[11px] tracking-widest uppercase font-bold"
              >
                <User size={18} />
                <span>{user ? 'Creator Portal' : 'Creator Login'}</span>
              </Link>
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
                  <Link to="/roster" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">View Roster</Link>
                  <Link to="/roster/emerging" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Emerging UK Models</Link>
                  <Link to="/roster/high-earners" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Highest Earners</Link>
                </div>
                <div className="space-y-4">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">UK Hubs</p>
                  {['Greater London', 'Manchester Silk', 'The Midlands', 'The North East', 'Home Counties', 'UK National'].map(type => (
                    <Link key={type} to={`/hubs/${type.toLowerCase().replace(' ', '-')}`} className="block text-sm font-light hover:opacity-50 cursor-pointer">{type}</Link>
                  ))}
                </div>
                <div className="space-y-4 col-span-2">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">OF Specialism</p>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {['Vocal Signature GFE', 'Luxury Lifestyle', 'Sophisticated UK Wit', 'High-Yield PPV', 'Authentic UK Girlfriend', 'Digital Authority', 'Cultural Signature', 'Aesthetic Excellence'].map(concern => (
                      <Link key={concern} to={`/specialism/${concern.toLowerCase().replace(' ', '-')}`} className="block text-sm font-light hover:opacity-50 cursor-pointer">{concern}</Link>
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
                  <Link key={c.id} to={`/collections/${c.id}`} className="text-center group cursor-pointer block">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border border-brand-border p-2">
                       <img src={COLLECTIONS[i].image} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold">{c.label}</p>
                    <p className="text-[9px] text-brand-black/40 mt-1 uppercase tracking-widest italic">{c.count}</p>
                  </Link>
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
      <div className="absolute inset-0 z-0 pt-12 md:pt-20">
        <img 
          src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophcoverphoto-CGr776cV.png" 
          alt="Sophia - Bramingham Barely"
          className="w-full h-full object-contain object-bottom md:object-right"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-brand-black/5"></div>
      </div>
      
      <div className="absolute bottom-12 left-6 md:bottom-24 md:left-24 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link 
            to="/login"
            className="bg-brand-black text-white px-10 py-5 text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-brand-black transition-all duration-300 relative group overflow-hidden shadow-2xl inline-block border border-brand-black"
          >
            <span className="relative z-10">Join the Roster</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <h2 className="text-4xl md:text-5xl leading-tight uppercase font-serif tracking-tight">
            High-Yield Management <br />
            for the Anonymous British Creator
          </h2>
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-black/5 shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted
              playsInline 
              className="w-full h-full object-cover grayscale brightness-90"
            >
              <source src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophia_Intro_website_1.mp4#t=5" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="md:pt-32 space-y-12 flex flex-col">
          <div className="max-w-md order-1">
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6 font-serif italic border-l-2 border-brand-black pl-6">
              "We believe the beautiful part of the human form is that there's room for everyone. Distinction is our speciality."
            </p>
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6">
              Bramingham Barely is the United Kingdom's premier management firm. We architecture the business behind the beauty, transforming creative potential into high-yield digital assets.
            </p>
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6">
              In a crowded market, cultural resonance is currency. Whether you prefer the "Faceless" approach or a high-fashion signature, we specialise in scaling your reach without compromising your professional boundaries.
            </p>
            <p className="text-lg leading-relaxed font-light text-brand-black/80 mb-6 font-medium italic">
              Our bespoke strategy centres on the three pillars of British digital authority: Cultural Resonance, Technical Optimisation, and Financial Scalability.
            </p>
            <p className="text-2xl font-serif italic text-brand-black mb-8">
              Empowering the next generation of UK creative wealth.
            </p>
            <Link to="/login" className="text-[11px] font-bold tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity mb-12 inline-block">
              Explore Our Management Pillars
            </Link>
          </div>
          
          <div className="space-y-4 order-2 flex flex-col items-center md:items-start">
            <div className="aspect-[9/16] w-full max-w-[320px] bg-black/5 rounded-lg overflow-hidden shadow-2xl mx-auto md:mx-0">
              <video 
                autoPlay 
                loop 
                muted
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/gia_review%20(1).mp4" type="video/mp4" />
              </video>
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-black/40 text-center w-full max-w-[320px] md:text-left">
              Creator Testimonial: Performance & Privacy
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

      <div className="relative z-10 w-full px-6 md:px-24 flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end pb-12 md:pb-24 h-full">
        <div className="flex flex-col space-y-2 md:space-y-4 mb-8 md:mb-0">
          <span className="text-white/60 text-[10px] md:text-[11px] font-medium tracking-[0.3em] uppercase mb-2 md:mb-4">Mood Edits</span>
          {COLLECTIONS.map((c) => (
            <button 
              key={c.id}
              onClick={() => setActive(c.id)}
              onMouseEnter={() => setActive(c.id)}
              className={`text-2xl sm:text-3xl md:text-7xl italic font-serif text-left transition-all duration-300 ${active === c.id ? 'text-white translate-x-2 md:translate-x-4' : 'text-white/40 hover:text-white/70'}`}
            >
              ({c.label})
            </button>
          ))}
        </div>
        
        <div className="pb-4">
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-white/20 transition-colors">
            Explore Collection
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
          alt="Bramingham Barely Professional Management" 
          className="w-full h-full object-cover grayscale opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-6xl max-w-2xl leading-tight mb-8 font-serif italic">
            The British Persona is your most powerful asset. <br />
            Let us engineer the architecture for your OnlyFans success.
          </h2>
          <Link to="/login" className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
            Apply to the Roster
          </Link>
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
          <Link to="/hubs/london" className="block hover:text-brand-black cursor-pointer">London Hub</Link>
          <Link to="/hubs/manchester" className="block hover:text-brand-black cursor-pointer">Manchester Silk</Link>
          <Link to="/hubs/birmingham" className="block hover:text-brand-black cursor-pointer">Birmingham Style</Link>
          <Link to="/hubs/north" className="block hover:text-brand-black cursor-pointer">Northern Authority</Link>
          <Link to="/hubs/national" className="block hover:text-brand-black cursor-pointer">UK National</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Mood Edits</p>
          <Link to="/collections/date-night" className="block hover:text-brand-black cursor-pointer">Date Night</Link>
          <Link to="/collections/work-week" className="block hover:text-brand-black cursor-pointer">Work Week</Link>
          <Link to="/collections/weekend-escape" className="block hover:text-brand-black cursor-pointer">Weekend Escape</Link>
          <Link to="/collections/city-chic" className="block hover:text-brand-black cursor-pointer">City Chic</Link>
          <Link to="/collections/coastal-ease" className="block hover:text-brand-black cursor-pointer">Coastal Ease</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Our Roster</p>
          <Link to="/roster/management" className="block hover:text-brand-black cursor-pointer">Top 0.1% Management</Link>
          <Link to="/roster/emerging" className="block hover:text-brand-black cursor-pointer">Emerging Creations</Link>
          <Link to="/roster/exclusive" className="block hover:text-brand-black cursor-pointer">UK Exclusive</Link>
          <Link to="/roster/synergy" className="block hover:text-brand-black cursor-pointer">Synergy Sync</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Creator Portal</p>
          <Link to="/login" className="block hover:text-brand-black cursor-pointer">Login</Link>
          <Link to="/login" className="block hover:text-brand-black cursor-pointer">Join Now</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">The Agency</p>
          <Link to="/philosophy/philosophy" className="block hover:text-brand-black cursor-pointer">Our Philosophy</Link>
          <Link to="/philosophy/pillars" className="block hover:text-brand-black cursor-pointer">UK Three Pillars</Link>
          <Link to="/philosophy/strategy" className="block hover:text-brand-black cursor-pointer">Growth Strategy</Link>
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
          <p className="text-[11px] tracking-widest uppercase">Join the Bramingham Barely United Kingdom Roster</p>
          <div className="flex border-b border-brand-black pb-2">
            <input type="email" placeholder="OnlyFans Link / Social Footprint" className="bg-transparent text-sm w-64 focus:outline-none" />
            <button className="text-[10px] tracking-widest uppercase font-bold">Join</button>
          </div>
        </div>
        
        <div className="h-24 md:h-48 flex items-center select-none opacity-10 grayscale">
          <img 
            src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2001_48_30%20AM.png" 
            alt="Bramingham Barely Logo" 
            className="h-full w-auto object-contain" 
          />
        </div>

        <div className="text-[10px] tracking-widest uppercase text-brand-black/50 text-right space-y-2">
          <p>&copy; 2024, Bramingham Barely. All rights reserved.</p>
          <div className="flex space-x-4 justify-end">
            <Link to="/terms" className="hover:text-brand-black cursor-pointer">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-brand-black cursor-pointer">Privacy Policy</Link>
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
              <span className="bg-brand-black text-white text-[9px] px-3 py-1 uppercase tracking-widest">Verified Talent</span>
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
                   <a href={`https://instagram.com/${product.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
                     <Instagram size={14} />
                     <span>{product.instagram}</span>
                   </a>
                   <a href={`https://${product.onlyfans}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
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
                    <h4 className="font-serif italic mb-1">Professional Management</h4>
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
  const location = useLocation();
  
  return (
    <div className="min-h-screen font-sans selection:bg-brand-black selection:text-white bg-brand-offwhite">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="pt-[env(safe-area-inset-top)]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
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
            The OnlyFans landscape is competitive. Authentic United Kingdom signatures are high-yield assets. Bramingham Barely ensures your account is localised for peak fan LTV.
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
      
      <Route path="/hubs/:categoryId" element={wrapInLayout(<CategoryPage />)} />
      <Route path="/collections/:categoryId" element={wrapInLayout(<CategoryPage />)} />
      <Route path="/roster/:categoryId" element={wrapInLayout(<CategoryPage />)} />
      <Route path="/philosophy/:categoryId" element={wrapInLayout(<CategoryPage />)} />
      <Route path="/philosophy" element={<Navigate to="/philosophy/philosophy" replace />} />
      <Route path="/strategy" element={<Navigate to="/philosophy/strategy" replace />} />
      
      <Route path="/dashboard" element={wrapInLayout(<Dashboard />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
