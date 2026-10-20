import React, { useState } from 'react';
import { Sprout, User, Mail, Lock, Globe, Phone, ShieldCheck, Check } from 'lucide-react';
import { authService } from '../lib/firebase';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [role, setRole] = useState<UserRole>('farmer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [phone, setPhone] = useState('+254 700 000 000');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await authService.signUp(email, password, fullName, role, country);
      onRegisterSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            Join AgriSphere Africa Platform
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Direct farmer-to-buyer escrow trade, phytosanitary verification, and AI crop advisory.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <Card className="p-6 space-y-6">
          
          {/* Role selector buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">Select Account Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { type: 'farmer' as UserRole, label: 'Farmer', desc: 'Sell crops & escrow' },
                { type: 'buyer' as UserRole, label: 'Buyer', desc: 'Bulk procurement' },
                { type: 'cooperative' as UserRole, label: 'Cooperative', desc: 'Group harvest' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setRole(item.type)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === item.type
                      ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900">{item.label}</span>
                    {role === item.type && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <p className="text-[10px] text-stone-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name / Organization</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel K. Ruto"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="Kenya">Kenya (KE)</option>
                  <option value="Ghana">Ghana (GH)</option>
                  <option value="Nigeria">Nigeria (NG)</option>
                  <option value="Ethiopia">Ethiopia (ET)</option>
                  <option value="Rwanda">Rwanda (RW)</option>
                  <option value="South Africa">South Africa (ZA)</option>
                  <option value="Tanzania">Tanzania (TZ)</option>
                  <option value="Uganda">Uganda (UG)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold"
              >
                Create Account & Join Escrow Network
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
};
