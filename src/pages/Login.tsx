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
          <h1 className="text-4xl font-serif italic mb-4">Creator Portal</h1>
          <p className="text-sm font-light text-brand-black/50 uppercase tracking-widest">Scale your digital authority with Bramingham Barely</p>
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
          className="w-full flex items-center justify-center space-x-3 border border-brand-border py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:border-brand-black transition-all bg-white"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-brand-black">Continue with Google</span>
        </button>

          <p className="mt-12 text-center text-[10px] uppercase tracking-widest text-brand-black/40 leading-relaxed">
            Joining the Bramingham Barely network is open to all ambitious creators.<br />
            Step into professional management designed for your growth.
          </p>
      </div>
    </div>
  );
};
