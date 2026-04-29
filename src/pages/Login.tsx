import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Globe, User, Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('verify your email')) {
        setShowOtp(true);
        setMessage('Please enter the 6-digit code sent to your email.');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await insforge.auth.verifyEmail({
      email,
      otp,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // After verification, we usually need to sign in again or the session might be established
      // Try to sign in with the password we still have in state
      const { error: loginError } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError('Verification successful. Please sign in now.');
        setShowOtp(false);
        setLoading(false);
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await insforge.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: window.location.origin + '/dashboard',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Redirect happens automatically for OAuth
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await insforge.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setShowOtp(true);
      setMessage('A verification code has been sent to your email.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 flex flex-col items-center bg-brand-offwhite">
      <div className="w-full max-w-md bg-white border border-brand-border p-12 rounded-sm shadow-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif italic mb-4">Talent Login</h1>
          <p className="text-sm font-light text-brand-black/50 uppercase tracking-widest">Access the Elite Roster Portal</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-8 p-4 bg-brand-offwhite border border-brand-border text-brand-black text-xs uppercase tracking-widest text-center">
            {message}
          </div>
        )}

        {!showOtp ? (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/60">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-black text-white py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full border border-brand-border text-brand-black py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-offwhite transition-colors disabled:opacity-50"
                >
                  Request Access (Sign Up)
                </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-black/60">Verification Code</label>
              <div className="relative">
                <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" size={16} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-offwhite border border-brand-border focus:outline-none focus:border-brand-black text-sm transition-colors tracking-[1em] text-center font-bold"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-black/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full text-[10px] uppercase tracking-widest text-brand-black/40 hover:text-brand-black transition-colors"
            >
              Back to Login
            </button>
          </form>
        ) }

        <div className="my-10 flex items-center">
          <div className="flex-1 h-[1px] bg-brand-border"></div>
          <span className="px-4 text-[10px] uppercase tracking-widest text-brand-black/30 font-bold">Or</span>
          <div className="flex-1 h-[1px] bg-brand-border"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 border border-brand-border py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-brand-offwhite transition-colors"
        >
          <Globe size={16} />
          <span>Continue with Google</span>
        </button>

        <p className="mt-12 text-center text-[10px] uppercase tracking-widest text-brand-black/40 leading-relaxed">
          Access is restricted to verified talent within the Bramingham Barely network.<br />
          Contact your manager for credentials if required.
        </p>
      </div>
    </div>
  );
};
