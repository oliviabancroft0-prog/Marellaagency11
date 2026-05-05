/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate, Link, useParams, useNavigationType } from 'react-router-dom';
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
  Menu,
  Trash2,
  CheckCircle,
  Search as SearchIcon
} from 'lucide-react';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Product, CartItem, KitProduct } from './types';
import { MODELS } from './constants/models';
import { KIT_PRODUCTS } from './constants/kitProducts';
import { MoodKitsPage } from './pages/MoodKitsPage';
import { CheckoutPage } from './pages/CheckoutPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType() as any;
  
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);
  
  return null;
};

// --- Types & Constants ---

export const MOOD_KITS = [
  {
    id: 'date-night',
    title: 'Date Night',
    tagline: 'Seductive. Intimate. Irresistible.',
    description: 'Sultry reds, glossy lips, and glowy skin that looks incredible in low light. Perfect for spicy solo content, boyfriend experience, or GFE vibes.',
    bestFor: 'Evening shoots, teasing videos, paid PPV content.',
    keyProducts: ['Liquid lipsticks', 'body shimmer oils', 'lace lingerie', 'scent layering perfumes', 'nipple covers', 'lighting-friendly highlighters'],
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1600'
  },
  {
    id: 'city-chic',
    title: 'City Chic',
    tagline: 'Expensive. Polished. Powerful.',
    description: 'Sharp, high-end aesthetic for the boss babe creator. Think luxury apartment shoots, “day in the life”, and high-value girlfriend content.',
    bestFor: 'Luxury branding, faceless content, high-ticket subs.',
    keyProducts: ['Matte liquid liners', 'tailored outfits', 'statement jewelry', 'sleek hairstyling tools', 'premium skincare'],
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1600'
  },
  {
    id: 'coastal-ease',
    title: 'Coastal Ease / Soft Girl',
    tagline: 'Dreamy. Soft. Addictive.',
    description: 'Sun-kissed skin, natural glow, flowy outfits and that innocent-but-dangerous energy. Perfect for the soft girl / beachy aesthetic.',
    bestFor: 'Morning content, pool shoots, “just woke up like this” fantasy.',
    keyProducts: ['Dewy skin tints', 'body butters', 'wavy hair tools', 'pastel lingerie', 'vanilla scents', 'self-tanners'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600'
  },
  {
    id: 'office-siren',
    title: 'Work Week / Office Siren',
    tagline: 'Professional by day, dangerous by night.',
    description: 'Sleek corporate looks that secretly scream dominance. Blazers, pencil skirts, glasses, and flawless “no makeup” makeup.',
    bestFor: 'Roleplay, secretary fantasy, power play content.',
    keyProducts: ['Long-wear foundations', 'power brow kits', 'sophisticated fragrances', 'seamless shapewear', 'elegant heels'],
    image: 'https://images.unsplash.com/photo-1485603673171-4608c028e530?q=80&w=1600'
  },
  {
    id: 'weekend-escape',
    title: 'Weekend Escape',
    tagline: 'Wild. Free. Unforgettable.',
    description: 'Festival-ready, travel content, or “getaway with me” vibes. Think glowing skin, messy hair, and barely-there outfits.',
    bestFor: 'Vacation content, bikini shoots, adventure-style posts.',
    keyProducts: ['Waterproof makeup', 'tanning mousse', 'hair repair masks', 'festival glitter', 'sexy sets'],
    image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?q=80&w=1600'
  }
];

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const allImages = [product.image, ...product.gallery];

  useEffect(() => {
    let interval: any;
    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setHoverIndex((prev) => (prev + 1) % allImages.length);
      }, 1500);
    } else {
      setHoverIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/roster/${product.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <div className="aspect-[4/5] bg-brand-offwhite mb-4 overflow-hidden relative rounded-sm">
        <AnimatePresence mode="wait">
          <motion.img 
            key={hoverIndex}
            src={allImages[hoverIndex]} 
            alt={product.name} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover" 
          />
        </AnimatePresence>
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-widest px-2 py-1 font-bold rounded-full">
            {product.location}
          </span>
        </div>
        
        {allImages.length > 1 && isHovered && (
          <div className="absolute bottom-20 left-0 w-full flex justify-center space-x-1 z-10">
            {allImages.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === hoverIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
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
      className="min-h-screen pt-24 md:pt-32 px-6 md:px-12 bg-white"
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
  { id: 'date-night', label: 'The Posh (Date Night)', count: '12 Assets', image: 'https://images.unsplash.com/photo-1596462502278-27bfaf410911?q=80&w=1600' },
  { id: 'work-week', label: 'The Bratty (Work Week)', count: '8 Assets', image: 'https://images.unsplash.com/photo-1570172234562-969c67678004?q=80&w=1600' },
  { id: 'weekend-escape', label: 'The Girl Next Door', count: '15 Assets', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600' },
  { id: 'city-chic', label: 'The Sophisticate (City Chic)', count: '10 Assets', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600' },
  { id: 'coastal-ease', label: 'The Regional (Coastal Ease)', count: '7 Assets', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600' },
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

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredModels = MODELS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKits = MOOD_KITS.filter(k => 
    k.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = KIT_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="pt-8 px-6 md:px-12 flex justify-between items-center mb-16">
            <div className="flex items-center flex-1 max-w-2xl border-b-2 border-brand-black pb-4">
              <SearchIcon size={24} className="text-brand-black/40 mr-6" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search talent registry, mood kits, or products..." 
                className="w-full bg-transparent text-2xl md:text-4xl font-serif italic focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={onClose} className="ml-8 p-4 hover:rotate-90 transition-transform">
              <X size={32} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              {searchTerm && (
                <>
                  <div className="md:col-span-1">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30 mb-8">Talent ({filteredModels.length})</h3>
                    <div className="space-y-6">
                      {filteredModels.map(m => (
                        <div 
                          key={m.id} 
                          onClick={() => { navigate(`/roster/${m.id}`); onClose(); }}
                          className="flex items-center space-x-6 group cursor-pointer"
                        >
                          <div className="w-20 h-20 bg-brand-offwhite rounded-sm overflow-hidden">
                            <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <h4 className="text-xl font-serif italic">{m.name}</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-black/40">{m.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30 mb-8">Mood Kits ({filteredKits.length})</h3>
                    <div className="space-y-6">
                      {filteredKits.map(k => (
                        <div 
                          key={k.id} 
                          onClick={() => { navigate(`/mood-kits#${k.id}`); onClose(); }}
                          className="flex items-center space-x-6 group cursor-pointer"
                        >
                          <div className="w-20 h-20 bg-brand-offwhite rounded-sm overflow-hidden">
                            <img src={k.image} alt={k.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <h4 className="text-xl font-serif italic">{k.title}</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-black/40">Mood Kit for Content</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30 mb-8">Wardrobe ({filteredProducts.length})</h3>
                    <div className="space-y-6">
                      {filteredProducts.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => { navigate(`/mood-kits#${p.kitId}`); onClose(); }}
                          className="flex items-center space-x-6 group cursor-pointer"
                        >
                          <div className="w-20 h-20 bg-brand-offwhite rounded-sm overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <h4 className="text-xl font-serif italic truncate">{p.name}</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-black/40">£{p.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {!searchTerm && (
                <div className="col-span-full">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30 mb-8">Trending Hubs</h3>
                  <div className="flex flex-wrap gap-4">
                    {['London', 'Manchester', 'Birmingham', 'Northern'].map(h => (
                      <button 
                        key={h}
                        onClick={() => { navigate(`/hubs/${h.toLowerCase()}`); onClose(); }}
                        className="text-2xl font-serif italic hover:text-blue-600 transition-colors"
                      >
                        {h} Hub.
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ cartCount, onCartOpen, onSearchOpen }: { cartCount: number, onCartOpen: () => void, onSearchOpen: () => void }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const menuItems = [
    { label: 'The Roster', id: 'shop', path: '/roster' },
    { label: 'Mood Kits for Content', id: 'collections', path: '/mood-kits' },
    { label: 'The Agency', id: 'about', path: '/agency/philosophy' },
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
        <button onClick={onSearchOpen} className="hover:opacity-50 transition-opacity flex items-center">
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
                  to={item.path}
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
                  <Link to="/hubs/emerging" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Emerging UK Models</Link>
                  <Link to="/roster" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Highest Earners</Link>
                </div>
                <div className="space-y-4">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">UK Hubs</p>
                  {['Greater London', 'Manchester Silk', 'The Midlands', 'The North East', 'Home Counties', 'UK National'].map(type => (
                    <Link key={type} to={`/hubs/${type.toLowerCase().split(' ')[0] === 'greater' ? 'london' : (type.toLowerCase().split(' ')[0] === 'the' ? type.toLowerCase().split(' ')[1] : type.toLowerCase().split(' ')[0])}`} className="block text-sm font-light hover:opacity-50 cursor-pointer">{type}</Link>
                  ))}
                </div>
                <div className="space-y-4 col-span-2">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">OF Specialism</p>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {['Management', 'Exclusive', 'Synergy'].map(spec => (
                      <Link key={spec} to={`/hubs/${spec.toLowerCase()}`} className="block text-sm font-light hover:opacity-50 cursor-pointer">{spec} Specifics</Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeMenu === 'collections' && (
              <div className="max-w-7xl mx-auto flex justify-between">
                {COLLECTIONS.map((c, i) => (
                  <Link key={c.id} to={`/collections/${c.id}`} className="text-center group cursor-pointer block">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border border-brand-border p-2">
                       <img src={c.image} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold">{c.label}</p>
                    <p className="text-[9px] text-brand-black/40 mt-1 uppercase tracking-widest italic">{c.count}</p>
                  </Link>
                ))}
              </div>
            )}
            {activeMenu === 'about' && (
              <div className="max-w-7xl mx-auto grid grid-cols-3 gap-24">
                <div className="space-y-6">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">The Philosophy</p>
                  <Link to="/agency/philosophy" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Bespoke Distinction</Link>
                  <Link to="/agency/pillars" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Three Pillars of Authority</Link>
                </div>
                <div className="space-y-6">
                  <p className="text-brand-black font-bold text-[10px] uppercase tracking-widest mb-8">Performance</p>
                  <Link to="/agency/management" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Elite Management</Link>
                  <Link to="/agency/strategy" className="block text-xl font-serif italic hover:opacity-50 cursor-pointer">Growth Architecture</Link>
                </div>
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

const MoodKitsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-7xl font-serif italic mb-4">Mood Kits for Content</h2>
          <div className="inline-block bg-brand-black text-white px-6 py-2 rounded-full overflow-hidden relative group">
            <motion.div
              animate={{ x: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="whitespace-nowrap flex space-x-12"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Special Offer: 25% Off for Managed Models</span>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Special Offer: 25% Off for Managed Models</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {MOOD_KITS.map((mood) => (
            <motion.div 
              key={mood.id}
              whileHover={{ y: -10 }}
              className="group bg-brand-offwhite rounded-sm overflow-hidden flex flex-col border border-brand-border hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={mood.image} alt={mood.title} className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif italic mb-1">{mood.title}</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-black/40 mb-4">{mood.tagline}</p>
                  <p className="text-xs font-light leading-relaxed text-brand-black/70 mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {mood.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-[8px] uppercase tracking-widest font-bold mb-2">Best For:</p>
                    <p className="text-[10px] font-medium text-brand-black/60 italic">{mood.bestFor}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-[8px] uppercase tracking-widest font-bold mb-2">Key Products:</p>
                    <div className="flex flex-wrap gap-1.5 focus-within:">
                      {mood.keyProducts.slice(0, 4).map((item, idx) => (
                        <span key={idx} className="text-[8px] uppercase tracking-tight bg-white border border-brand-border px-2 py-1 rounded-sm whitespace-nowrap">
                          {item}
                        </span>
                      ))}
                      {mood.keyProducts.length > 4 && <span className="text-[8px] text-brand-black/40 px-1">+ more</span>}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/mood-kits')}
                  className="w-full py-4 text-[9px] uppercase tracking-[0.3em] font-bold border border-brand-black hover:bg-brand-black hover:text-white transition-all duration-300"
                >
                  Shop This Kit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Premium Video Loop Idea Placeholder */}
        <div className="mt-32 relative aspect-[21/9] w-full overflow-hidden rounded-sm bg-brand-black group cursor-pointer">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[10s]"
            >
              <source src="https://raw.githubusercontent.com/oliviabancroft0-prog/marellaagency/main/Sophia_Intro_website_1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black/20">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif italic mb-6"
            >
              The 0.1% Aesthetic
            </motion.h3>
            <p className="text-[10px] uppercase tracking-[0.6em] font-bold opacity-70">Seductive. Powerful. Yours.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-offwhite">
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
          
          {/* Crypto Payment methods */}
          <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-lg border border-brand-border shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Bitcoin" className="h-5 md:h-7 w-auto" />
            <span className="text-[10px] font-bold text-gray-700">BTC</span>
          </div>
          <div className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-lg border border-brand-border shadow-sm">
            <img src="https://raw.githubusercontent.com/oliviabancroft0-prog/5-5-2026/main/USDT_Logo.png" alt="USDT" className="h-5 md:h-7 w-auto" />
            <span className="text-[10px] font-bold text-gray-700">USDT</span>
          </div>
          <div className="bg-white border border-brand-border px-4 py-2 rounded-lg flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-5 md:h-7 w-auto" />
          </div>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 py-24 border-t border-brand-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 text-[11px] tracking-widest uppercase text-brand-black/60">
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Performance Hubs</p>
          <Link to="/hubs/london" className="block hover:text-brand-black cursor-pointer">London Core</Link>
          <Link to="/hubs/manchester" className="block hover:text-brand-black cursor-pointer">Manchester Silk</Link>
          <Link to="/hubs/birmingham" className="block hover:text-brand-black cursor-pointer">Midlands Rose</Link>
          <Link to="/hubs/north" className="block hover:text-brand-black cursor-pointer">Northern Power</Link>
          <Link to="/hubs/national" className="block hover:text-brand-black cursor-pointer">Global Reach</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Mood Kits for Content</p>
          <Link to="/mood-kits#date-night" className="block hover:text-brand-black cursor-pointer">The Posh</Link>
          <Link to="/mood-kits#office-siren" className="block hover:text-brand-black cursor-pointer">Office Siren</Link>
          <Link to="/mood-kits#coastal-ease" className="block hover:text-brand-black cursor-pointer">Soft Girl</Link>
          <Link to="/mood-kits#city-chic" className="block hover:text-brand-black cursor-pointer">Metropolitan</Link>
          <Link to="/mood-kits#weekend-escape" className="block hover:text-brand-black cursor-pointer">Coastal Glow</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Management</p>
          <Link to="/roster/management" className="block hover:text-brand-black cursor-pointer">0.1% Architecture</Link>
          <Link to="/roster/emerging" className="block hover:text-brand-black cursor-pointer">Growth Pipeline</Link>
          <Link to="/roster/exclusive" className="block hover:text-brand-black cursor-pointer">Bespoke Talent</Link>
          <Link to="/roster/synergy" className="block hover:text-brand-black cursor-pointer">Creator Synergy</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">Private Access</p>
          <Link to="/login" className="block hover:text-brand-black cursor-pointer">Creator Portal</Link>
          <Link to="/login" className="block hover:text-brand-black cursor-pointer">Apply to Join</Link>
          <Link to="/login" className="block hover:text-brand-black cursor-pointer">Client Login</Link>
        </div>
        <div className="space-y-6">
          <p className="text-brand-black font-bold mb-8">The Agency</p>
          <Link to="/philosophy/philosophy" className="block hover:text-brand-black cursor-pointer">Our Distinction</Link>
          <Link to="/philosophy/pillars" className="block hover:text-brand-black cursor-pointer">Three Pillars</Link>
          <Link to="/philosophy/strategy" className="block hover:text-brand-black cursor-pointer">Yield Strategy</Link>
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

const ProductDetail = ({ product, onBack, onAddToCart }: { product?: Product, onBack?: () => void, onAddToCart?: (item: CartItem) => void }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const activeProduct = product || MODELS.find(m => m.id === productId);
  const [selectedDate, setSelectedDate] = useState('Today');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (!activeProduct) return <Navigate to="/roster" replace />;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-12 md:pt-32 px-6 md:px-12 bg-white"
    >
      <button onClick={handleBack} className="mb-8 flex items-center space-x-2 text-[10px] uppercase tracking-widest group">
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="aspect-[4/5] bg-brand-offwhite rounded-sm overflow-hidden">
            <img 
              src={activeProduct.image} 
              alt={activeProduct.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {activeProduct.gallery.map((img, i) => (
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
              <span className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold">{activeProduct.location} Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-4 italic">{activeProduct.name}</h1>
            <p className="text-lg text-brand-black/60 mb-6 font-light">{activeProduct.subtitle}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest font-bold">Biography</h3>
            <p className="text-lg leading-relaxed font-light text-brand-black/80">
              {activeProduct.bio}
            </p>
          </div>

          <div className="pt-8 border-t border-brand-border space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-brand-border p-4 rounded-sm">
                  <p className="text-[9px] uppercase tracking-widest text-brand-black/40 mb-1">Fee</p>
                  <p className="text-xl font-medium">{activeProduct.price}</p>
                </div>
                <div className="border border-brand-border p-4 rounded-sm">
                  <p className="text-[9px] uppercase tracking-widest text-brand-black/40 mb-1">Availability</p>
                  <p className="text-lg font-medium text-green-600">Immediate</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold">Social Connection</p>
                <div className="flex space-x-6">
                   <a href={`https://instagram.com/${activeProduct.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
                     <Instagram size={14} />
                     <span>{activeProduct.instagram}</span>
                   </a>
                   <a href={`https://${activeProduct.onlyfans}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[11px] font-mono hover:text-blue-600 transition-colors">
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
              onClick={() => {
                if (onAddToCart && activeProduct) {
                  onAddToCart({
                    id: activeProduct.id,
                    name: activeProduct.name,
                    price: parseInt(activeProduct.price.replace(/[^0-9]/g, '')),
                    quantity: 1,
                    image: activeProduct.image,
                    type: 'talent'
                  });
                }
              }}
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

const CartDrawer = ({ isOpen, onClose, cart, setCart }: { isOpen: boolean, onClose: () => void, cart: CartItem[], setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) => {
  const navigate = useNavigate();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

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
              {cart.length === 0 ? (
                <p className="text-center py-24 text-brand-black/40 font-light italic">Your selection is currently empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-start space-x-4 border-b border-brand-border pb-4">
                    <div className="w-20 aspect-square bg-brand-offwhite rounded-sm overflow-hidden border border-brand-border">
                      <img src={item.image} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif italic text-sm">{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-brand-black/20 hover:text-red-600 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-[9px] text-brand-black/50 uppercase tracking-widest mb-2">{item.type}</p>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center border border-brand-border rounded-sm px-2 py-0.5 scale-90 origin-left">
                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={10} /></button>
                            <span className="px-3 text-[10px] font-mono">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={10} /></button>
                         </div>
                         <p className="text-xs font-medium">£{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-12 space-y-6">
                <span className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Recommended Talents</span>
                <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
                  {MODELS.slice(1, 4).map(p => (
                    <div 
                      key={p.id} 
                      className="min-w-[10rem] group cursor-pointer"
                      onClick={() => { navigate(`/roster/${p.id}`); onClose(); }}
                    >
                      <div className="aspect-square bg-brand-offwhite mb-2 overflow-hidden border border-brand-border">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-[10px] font-serif italic truncate">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-border space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="uppercase tracking-widest font-bold">Total Retainer</span>
                <span className="font-medium">£{cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                onClick={() => { navigate('/checkout'); onClose(); }}
                className="w-full bg-brand-black text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Proceed to Settlement
              </button>
              <p className="text-[9px] text-center text-brand-black/40 uppercase tracking-widest">Calculated in GBP. Secure SSL Encryption.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

const AppLayout = ({ children, cartCount, onCartOpen, onSearchOpen }: { children: React.ReactNode, cartCount: number, onCartOpen: () => void, onSearchOpen: () => void }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen font-sans selection:bg-brand-black selection:text-white bg-brand-offwhite">
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} onSearchOpen={onSearchOpen} />
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

const Home = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero onShopNow={() => navigate('/roster')} />
      <Philosophy />
      
      <section id="roster" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl italic">The Lineup</h2>
              <p className="text-lg font-light text-brand-black/60 max-w-md">
                Strategic talent curation for the professional OnlyFans architecture. Pick your signature aesthetic.
              </p>
            </div>
            <button onClick={() => navigate('/roster')} className="text-[11px] font-medium tracking-[0.3em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity">
              View The Full Roster
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {MODELS.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <MoodKitsSection />



      <Footer />
    </motion.div>
  );
};

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (items: CartItem | CartItem[]) => {
    const itemsToAdd = Array.isArray(items) ? items : [items];
    setCart(prev => {
      let newCart = [...prev];
      itemsToAdd.forEach(item => {
        const existing = newCart.find(i => i.id === item.id);
        if (existing) {
          newCart = newCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        } else {
          newCart.push(item);
        }
      });
      return newCart;
    });
    setCartOpen(true);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const wrapInLayout = (content: React.ReactNode) => (
    <AppLayout cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onSearchOpen={() => setSearchOpen(true)}>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />
      {content}
    </AppLayout>
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={wrapInLayout(<Home />)} />
        <Route path="/roster" element={wrapInLayout(<AllProductsView onBack={() => {}} onProductClick={() => {}} />)} />
        <Route path="/roster/:productId" element={wrapInLayout(<ProductDetail onAddToCart={(item) => handleAddToCart(item)} />)} />
        <Route path="/mood-kits" element={wrapInLayout(<MoodKitsPage onAddToCart={(items) => handleAddToCart(items)} />)} />
        <Route path="/checkout" element={wrapInLayout(<CheckoutPage cart={cart} setCart={setCart} />)} />
        <Route path="/login" element={wrapInLayout(<Login />)} />
        <Route path="/hubs/:categoryId" element={wrapInLayout(<CategoryPage />)} />
        <Route path="/collections/:categoryId" element={wrapInLayout(<CategoryPage />)} />
        <Route path="/agency/:categoryId" element={wrapInLayout(<CategoryPage />)} />
        <Route path="/philosophy/:categoryId" element={wrapInLayout(<CategoryPage />)} />
        <Route path="/philosophy" element={<Navigate to="/philosophy/philosophy" replace />} />
        <Route path="/strategy" element={<Navigate to="/philosophy/strategy" replace />} />
        <Route path="/dashboard" element={wrapInLayout(<Dashboard />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
