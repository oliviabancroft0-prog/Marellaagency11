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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<{
    status: string;
    message: string;
    reference?: string;
    url?: string;
  } | null>(null);
  const [actionValue, setActionValue] = useState('');
  
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

  const subtotal = cart.reduce((acc, item) => {
    const chargePrice = item.name === 'Olivia' ? 20 : item.price;
    return acc + (chargePrice * item.quantity);
  }, 0);
  const hasPhysicalProducts = cart.some(item => item.type === 'product' || !item.type);
  const shipping = cart.length > 0 && hasPhysicalProducts ? 5.00 : 0.00;
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
    setErrorMessage(null);
    setPaymentStep(null);

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, cart, total })
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Payment failed');
      }

      handlePaymentResponse(data);
    } catch (err) {
      console.error('Payment failed:', err);
      setIsProcessing(false);
      setErrorMessage(err instanceof Error ? err.message : 'Payment failed. Please check your details and try again.');
    }
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentStep?.reference || !paymentStep?.status || !actionValue) return;

    setIsProcessing(true);
    try {
      const type = paymentStep.status.replace('send_', '');
      const response = await fetch('/api/payment-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          reference: paymentStep.reference,
          value: actionValue
        })
      });

      const data = await response.json();
      handlePaymentResponse(data);
      setActionValue('');
    } catch (err) {
      console.error('Action failed:', err);
      setIsProcessing(false);
      alert('Verification failed. Please try again.');
    }
  };

  const handlePaymentResponse = (data: any) => {
    if (data.data?.status === 'success' || data.status === 'success') {
      // Send Email Confirmation via Brevo (Backend Proxy)
      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          total: total.toFixed(2),
          orderDetails: cart.map(item => `<div style="margin-bottom: 5px;">• ${item.name} (x${item.quantity}) - £${(item.price * item.quantity).toFixed(2)}</div>`).join('')
        })
      }).catch(e => console.error('Email failed', e));

      setIsProcessing(false);
      setIsSuccess(true);
      setCart([]);
      return;
    }

    if (data.data?.status === 'send_pin' || data.data?.status === 'send_otp' || data.data?.status === 'send_phone' || data.data?.status === 'send_birthday') {
      setPaymentStep({
        status: data.data.status,
        message: data.data.display_text || `Please enter your ${data.data.status.split('_')[1]}`,
        reference: data.data.reference
      });
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      alert(data.message || 'Payment was not successful');
    }
  };

  const checkStatus = async () => {
    if (!paymentStep?.reference) return;
    setIsProcessing(true);
    try {
      const verifyRes = await fetch(`/api/verify-transaction/${paymentStep.reference}`);
      const data = await verifyRes.json();
      
      if (data.data?.status === 'success') {
        handlePaymentResponse(data);
      } else {
        alert('Transaction still pending or failed.');
        setIsProcessing(false);
      }
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
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
    <div className="min-h-screen bg-white font-sans text-brand-black relative">
      {/* Payment Step Overlays */}
      {paymentStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            {paymentStep.status && (
              <form onSubmit={handleActionSubmit} className="p-8 space-y-6">
                <div className="w-12 h-12 bg-[#5433ff]/10 rounded-full flex items-center justify-center mx-auto text-[#5433ff]">
                  <Lock size={20} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Verification Required</h3>
                  <p className="text-sm text-brand-black/60">{paymentStep.message}</p>
                </div>
                <input 
                  type="text" 
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  placeholder="Enter value"
                  required
                  autoFocus
                  className="w-full h-12 text-center text-2xl font-bold tracking-[0.5em] rounded-lg border border-brand-border focus:ring-2 focus:ring-[#5433ff]/10 focus:border-[#5433ff] transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={isProcessing || !actionValue}
                  className="w-full bg-[#5433ff] text-white h-12 rounded-lg font-bold text-base hover:opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {isProcessing ? 'Verifying...' : 'Verify'}
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentStep(null)}
                  className="w-full text-brand-black/40 text-xs font-semibold uppercase tracking-wider hover:text-brand-black transition-colors pt-2"
                >
                  Cancel
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Order Summary */}
        <div className="w-full lg:w-[45%] bg-white lg:bg-[#f8f9fa] p-8 lg:p-16 border-r border-brand-border">
          <div className="max-w-md ml-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center space-x-2 text-brand-black/50 hover:text-brand-black transition-colors mb-12"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white font-serif italic text-lg">B</div>
              <span className="text-sm font-semibold tracking-tight">Bramingham Barely</span>
            </button>

            <div className="mb-12">
              <p className="text-brand-black/60 text-sm font-medium mb-1">Pay Bramingham Barely</p>
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
                      {item.name === 'Olivia' && (
                        <p className="text-[10px] text-brand-black/50 mt-0.5 font-medium">
                          Standard Retainer: <span className="line-through">£500.00</span> • Booking Fee: £20.00
                        </p>
                      )}
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
                  <div className="text-right">
                    {item.name === 'Olivia' ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-brand-black/40 line-through">£{(item.price * item.quantity).toFixed(2)}</span>
                        <span className="text-sm font-semibold text-brand-black">£{(20 * item.quantity).toFixed(2)}</span>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-brand-black/80">£{(item.price * item.quantity).toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-brand-border text-sm">
              {cart.some(item => item.name === 'Olivia') && (
                <div className="p-4 bg-brand-offwhite border border-brand-border rounded text-xs text-brand-black/80 space-y-1 mb-4">
                  <span className="font-bold block uppercase tracking-wider text-[8px] text-brand-black/60">Bespoke Session Booking</span>
                  <p className="leading-relaxed">
                    Olivia's full £500.00 retainer fee is secured, but only a £20.00 booking fee is charged now. The remainder is settled post-session.
                  </p>
                </div>
              )}
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
              <span>Powered by <span className="font-bold text-brand-black/50">Stripe</span></span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full lg:w-[55%] bg-white p-8 lg:p-16">
          <div className="max-w-md mr-auto lg:ml-0">
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

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3 mt-8">
                  <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 mt-0.5">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-[#5433ff] text-white h-12 rounded-lg font-bold text-base hover:opacity-95 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-8 mb-4 transition-all"
              >
                {isProcessing ? 'Processing...' : `Pay £${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
