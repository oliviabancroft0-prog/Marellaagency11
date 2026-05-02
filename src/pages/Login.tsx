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

    try {
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
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Connection failed. Please ensure the InsForge URL is configured correctly in Vercel settings.');
      } else {
        setError('An unexpected network error occurred.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await insforge.auth.verifyEmail({
        email,
        otp,
      });

      if (error) {
        setError(error.message);
      } else {
        const { error: loginError } = await insforge.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          setError('Verification successful. Please sign in now.');
          setShowOtp(false);
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError('Connection failed. Please check your network.');
      console.error('Verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin + '/dashboard',
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError('OAuth connection failed. Ensure your InsForge configuration allows this domain.');
      setLoading(false);
    }
    // Redirect happens automatically for OAuth
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await insforge.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setShowOtp(true);
        setMessage('A verification code has been sent to your email.');
      }
    } catch (err: any) {
      setError('Registration failed. Check your network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 md:pt-16 pb-12 px-6 flex flex-col items-center bg-brand-offwhite">
      <div className="w-full max-w-md bg-white border border-brand-border p-12 rounded-sm shadow-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif italic mb-4">Creator Login</h1>
          <p className="text-sm font-light text-brand-black/50 uppercase tracking-widest">Join our global creator network</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs uppercase tracking-widest text-center leading-relaxed">
            {error}
            {(error.includes('Connection failed') || error.includes('403')) && (
              <p className="mt-2 text-[10px] lowercase italic normal-case">
                Note: If you receive a Google "403" page, your InsForge project may be set to "Internal" access only. Please check your credentials or contact support.
              </p>
            )}
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
                  Join the Roster (Sign Up)
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
            Joining the Bramingham Barely network is open to all ambitious creators.<br />
            Step into professional management designed for your growth.
          </p>
      </div>
    </div>
  );
};
