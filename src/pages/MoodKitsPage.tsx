import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KIT_PRODUCTS } from '../constants/kitProducts';
import { MOOD_KITS } from '../App';
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
      const element = kitRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const handleBuyKit = (kitId: string) => {
    const products = KIT_PRODUCTS.filter(p => p.kitId === kitId);
    onAddToCart(products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
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
            <span className="text-brand-black">Mood Kits for Content</span>
          </nav>
          <h1 className="text-6xl md:text-8xl font-serif italic mb-6">The Wardrobe Architecture</h1>
          <p className="text-lg md:text-xl font-light text-brand-black/60 max-w-2xl leading-relaxed">
            Essential physical assets curated for the elite British OnlyFans creator. Every item is selected for cultural resonance and technical camera compatibility.
          </p>
        </div>
      </section>

      {/* Mood Kits Sections */}
      {MOOD_KITS.map((kit) => (
        <section 
          key={kit.id} 
          ref={el => kitRefs.current[kit.id] = el}
          className="py-24 border-b border-brand-border"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
              <div className="lg:col-span-1 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/30">Mood Selection</span>
                <h2 className="text-4xl md:text-6xl font-serif italic leading-tight">{kit.title}</h2>
                <p className="text-brand-black/40 uppercase tracking-[0.2em] text-[10px] font-bold">{kit.tagline}</p>
                <p className="text-sm font-light leading-relaxed text-brand-black/70">
                  {kit.description}
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => handleBuyKit(kit.id)}
                    className="flex items-center space-x-4 bg-brand-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-black/90 transition-all shadow-xl group"
                  >
                    <span>Buy Complete Kit</span>
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
                      <div className="aspect-square bg-brand-offwhite mb-4 overflow-hidden rounded-sm relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                        />
                        <div className="absolute top-3 right-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart([{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                                image: product.image,
                                type: 'product'
                              }]);
                            }}
                            className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-border hover:bg-brand-black hover:text-white transition-colors"
                          >
                            <ShoppingBag size={12} />
                          </button>
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

      {/* Footer CTA */}
      <section className="py-24 px-6 text-center bg-brand-offwhite">
        <h3 className="text-4xl italic font-serif mb-8">Need Bespoke Advice?</h3>
        <p className="text-lg font-light text-brand-black/60 mb-12 max-w-xl mx-auto">
          Our management firm offers professional wardrobe consultations for top-tier creators. Let us architect your visual narrative.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="text-[11px] font-bold tracking-[0.4em] uppercase border-b border-brand-black pb-2 hover:opacity-50 transition-opacity"
        >
          Apply for Private Consultation
        </button>
      </section>
    </div>
  );
};
