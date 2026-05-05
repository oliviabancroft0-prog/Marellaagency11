import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { ArrowLeft, Lock, Trash2 } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // Free for elite roster
  const total = subtotal + shipping;

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-brand-offwhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-12 flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-50 transition-opacity">
          <ArrowLeft size={14} />
          <span>Continue Selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif italic mb-2">Checkout</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-black/40">Secure Settlement Portal</p>
            </div>

            <div className="space-y-8">
              {cart.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-brand-border rounded-sm">
                  <p className="text-brand-black/40 italic font-light">Your selection is currently empty.</p>
                  <button onClick={() => navigate('/mood-kits')} className="mt-8 text-[11px] font-bold tracking-[0.3em] uppercase border-b border-brand-black pb-1">Shop Mood Kits</button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between border-b border-brand-border pb-8"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="w-24 aspect-square bg-white overflow-hidden rounded-sm border border-brand-border">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-serif italic">{item.name}</h3>
                        <p className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold">{item.type.toUpperCase()}</p>
                        <div className="flex items-center space-x-4 mt-4">
                           <div className="flex items-center border border-brand-border px-2 py-1 rounded-sm">
                             <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><ArrowLeft size={10} /></button>
                             <span className="px-3 text-xs font-mono">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rotate-180"><ArrowLeft size={10} /></button>
                           </div>
                           <button onClick={() => removeItem(item.id)} className="text-brand-black/40 hover:text-red-600 transition-colors">
                             <Trash2 size={14} />
                           </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-medium">£{(item.price * item.quantity).toLocaleString()}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Settlement Details */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-sm shadow-xl sticky top-32 space-y-8">
              <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold">Total Settlement</h2>
              
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-black/50 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="font-medium">£{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-black/50 uppercase tracking-widest text-[10px] font-bold">Priority Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="w-full h-[1px] bg-brand-border"></div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-xl font-serif italic">Total</span>
                  <span className="text-2xl font-bold">£{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button 
                  disabled={cart.length === 0}
                  className="w-full bg-brand-black text-white py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors disabled:opacity-30 flex items-center justify-center space-x-3"
                >
                  <Lock size={14} />
                  <span>Secure Settlement</span>
                </button>
                <div className="flex justify-center items-center space-x-2 text-[9px] uppercase tracking-widest text-brand-black/40 font-bold italic">
                   <span>Encrypted Transaction</span>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-5 gap-4 opacity-50 grayscale contrast-125 items-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-contain" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4 object-contain" />
                 <img src="https://raw.githubusercontent.com/oliviabancroft0-prog/5-5-2026/main/USDT_Logo.png" alt="USDT" className="h-4 object-contain" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Bitcoin" className="h-4 object-contain" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
