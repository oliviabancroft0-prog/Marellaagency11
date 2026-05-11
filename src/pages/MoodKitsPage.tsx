import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KIT_PRODUCTS } from '../constants/kitProducts';
import { MOOD_KITS } from '../constants/moodKits';
import { ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';

interface MoodKitsPageProps {
  onAddToCart: (items: any[]) => void;
}

export const MoodKitsPage: React.FC<MoodKitsPageProps> = ({ onAddToCart }) => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const kitRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = kitRefs.current[id];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  const handleBuyKit = (kitId: string) => {
    const kit = MOOD_KITS.find(k => k.id === kitId);
    if (!kit) return;
    
    const products = KIT_PRODUCTS.filter(p => p.kitId === kitId);
    onAddToCart(products.map(p => ({
      id: p.id,
      name: p.name,
      price: Math.floor(p.price * 0.85), // Apply 15% discount for whole kit order
      quantity: 1,
      image: p.image,
      type: 'product'
    })));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 md:px-12 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <nav className="flex items-center justify-center md:justify-start space-x-2 text-[10px] uppercase tracking-[0.3em] text-brand-black/40 mb-8">
            <span className="cursor-pointer hover:text-brand-black" onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={12} />
            <span className="text-brand-black">Vibe Kits</span>
          </nav>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-6">Vibe Kits</h1>
          <div className="space-y-2 mb-8">
            <p className="text-lg md:text-xl font-light text-brand-black/80 max-w-2xl leading-relaxed">
              Curated glow kits for the content you actually want to create.
            </p>
            <p className="text-brand-black/50 text-xs uppercase tracking-[0.2em] font-bold">
              Free UK shipping on orders over £150 • Vegan & cruelty free.
            </p>
          </div>

        </div>
      </section>

      {/* Vibe Kits Sections */}
      {MOOD_KITS.map((kit) => (
        <section 
          key={kit.id} 
          id={kit.id}
          ref={el => kitRefs.current[kit.id] = el}
          className="py-24 border-b border-brand-border scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
              <div className="lg:col-span-1 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30">Mood Selection</span>
                <div className="flex flex-col items-end mb-2">
                  <h2 className="text-4xl md:text-6xl font-serif italic leading-tight w-full">{kit.title}</h2>
                  <div className="flex items-center space-x-3 w-full mt-2">
                    <p className="text-brand-black/40 line-through text-lg">£{kit.originalPrice}</p>
                    <p className="text-2xl font-bold text-brand-black">£{kit.discountedPrice}</p>
                    <span className="text-[10px] bg-brand-black text-white px-2 py-1 font-bold rounded-sm">15% OFF</span>
                  </div>
                </div>
                <p className="text-brand-black/40 uppercase tracking-[0.2em] text-[10px] font-bold">{kit.tagline}</p>
                <p className="text-sm font-light leading-relaxed text-brand-black/70">
                  {kit.description}
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => handleBuyKit(kit.id)}
                    className="flex items-center space-x-4 bg-brand-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-black/90 transition-all shadow-xl group"
                  >
                    <span>{kit.buttonText || 'Buy Complete Kit'}</span>
                    <ShoppingBag size={14} className="transition-transform group-hover:scale-110" />
                  </button>
                  <p className="mt-4 text-[9px] uppercase tracking-widest text-brand-black/40 font-bold italic">*Save 15% when ordering the full collection</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {KIT_PRODUCTS.filter(p => p.kitId === kit.id).map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <div 
                        className="aspect-square bg-brand-offwhite mb-4 overflow-hidden rounded-sm relative cursor-pointer"
                        onClick={() => {
                          onAddToCart([{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.image,
                            type: 'product'
                          }]);
                        }}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                        />
                        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/5 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <span className="bg-white px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold shadow-sm">
                              Add to Selection
                            </span>
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium mb-1 line-clamp-1">{product.name}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-brand-black/40 uppercase tracking-widest">{product.category}</p>
                        <p className="text-xs font-bold">£{product.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

    </div>
  );
};
