import React, { useState } from 'react';
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, KeyRound, AlertCircle, Database } from 'lucide-react';
import { authService, isFirebaseConfigured } from '../lib/firebase';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('kwame.owusu@agrisphere.africa');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSentMessage, setResetSentMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await authService.signInWithEmail(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await authService.signInWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await authService.resetPassword(email);
      setResetSentMessage(`Password reset link sent to ${email}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoUser = (role: UserRole) => {
    if (role === 'farmer') {
      setEmail('kwame.owusu@agrisphere.africa');
    } else {
      setEmail('amara.diallo@goldcoastagri.com');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            {isResetMode ? 'Reset Your Password' : 'Welcome back to AgriSphere'}
          </h2>
          <p className="text-xs text-stone-500">
            {isResetMode
              ? 'Enter your registered email to receive password recovery instructions'
              : 'Sign in to access your Pan-African crop listings, orders & escrow balance'}
          </p>
        </div>

        {/* Status notice */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
          <Database className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Firebase Backend Connected:</span> Real-time Firestore document sync & Firebase Authentication are live. Use your credentials or click any demo profile below.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {resetSentMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resetSentMessage}</span>
          </div>
        )}

        <Card className="p-6">
          {!isResetMode ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@agrisphere.africa"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold"
              >
                Sign In
              </Button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] text-stone-400 font-bold uppercase">Or continue with</span>
              </div>

              {/* Google Auth button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google Single Sign-On
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsResetMode(false)}
                  className="w-1/2"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-1/2 font-bold"
                >
                  Send Recovery Link
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Quick role selection helper */}
        <div className="p-4 bg-stone-100 rounded-2xl text-center space-y-2 border border-stone-200">
          <p className="text-xs font-bold text-stone-700">Quick One-Click Demo Account Login:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleQuickDemoUser('farmer')}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Kwame (Farmer)
            </button>
            <button
              onClick={() => handleQuickDemoUser('buyer')}
              className="px-3 py-1.5 bg-amber-700 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
            >
              Amara (Buyer)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500">
          Don't have an AgriSphere account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Create Free Account
          </button>
        </p>
      </div>
    </div>
  );
};
