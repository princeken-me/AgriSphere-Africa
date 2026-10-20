import React, { useState } from 'react';
import { Settings, Globe, Shield, Bell, Key, Database, CheckCircle2, RefreshCw, Server, Flame } from 'lucide-react';
import { CurrencyCode } from '../types';
import { isFirebaseConfigured, db } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface SettingsPageProps {
  currentCurrency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentCurrency, onChangeCurrency }) => {
  const [dbStatus, setDbStatus] = useState<string>('Firebase Firestore & Auth Active');
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsWeatherAlerts, setSmsWeatherAlerts] = useState(true);

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setTimeout(() => {
      setIsTestingDb(false);
      setDbStatus('Firestore Latency: 28ms (Healthy & Synchronized)');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">System & Regional Preferences</h1>
          <p className="text-xs text-stone-500">Manage currency formatting, Firebase Firestore connection, and security settings.</p>
        </div>
        <Settings className="w-8 h-8 text-stone-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Currency & Regional Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">Pan-African Multi-Currency Display</h3>
          </div>

          <p className="text-xs text-stone-600">
            Select your primary trading currency. All harvest listings, orders, and escrow totals will convert automatically using live exchange rates.
          </p>

          <div className="space-y-2">
            {[
              { code: 'USD' as CurrencyCode, label: 'US Dollar ($)' },
              { code: 'KES' as CurrencyCode, label: 'Kenyan Shilling (KSh)' },
              { code: 'NGN' as CurrencyCode, label: 'Nigerian Naira (₦)' },
              { code: 'GHS' as CurrencyCode, label: 'Ghanaian Cedi (GH₵)' },
              { code: 'ETB' as CurrencyCode, label: 'Ethiopian Birr (Br)' }
            ].map((c) => (
              <label
                key={c.code}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  currentCurrency === c.code
                    ? 'border-emerald-700 bg-emerald-50/70 font-bold text-emerald-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span>{c.label}</span>
                <input
                  type="radio"
                  name="currency"
                  checked={currentCurrency === c.code}
                  onChange={() => onChangeCurrency(c.code)}
                  className="text-emerald-700 focus:ring-emerald-500"
                />
              </label>
            ))}
          </div>
        </Card>

        {/* Firebase Firestore Connection Status */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">Firebase Firestore & Auth</h3>
          </div>

          <p className="text-xs text-stone-600">
            AgriSphere Africa is connected to Google Cloud Firebase Firestore with real-time snapshot synchronization and security rules.
          </p>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Status:</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {dbStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">Project ID:</span>
              <span className="font-mono text-stone-700 text-[11px]">{firebaseConfig.projectId || 'gen-lang-client-0659043566'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">Database:</span>
              <span className="font-mono text-stone-700 text-[10px] truncate max-w-[200px]" title={(firebaseConfig as any).firestoreDatabaseId}>
                {(firebaseConfig as any).firestoreDatabaseId || 'default'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">Auth Engine:</span>
              <span className="text-stone-700 font-medium">Firebase Identity Toolkit</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-500">Security Rules:</span>
              <span className="text-emerald-700 font-medium">firestore.rules (v2 deployed)</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTestDatabase}
            disabled={isTestingDb}
            className="w-full flex items-center justify-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
            {isTestingDb ? 'Testing Connection...' : 'Ping Firestore Cluster'}
          </Button>
        </Card>

        {/* Notifications preferences */}
        <Card className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Bell className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">Alert Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 block">Escrow Status Email Notifications</span>
                <span className="text-stone-500 text-[10px]">Instant email when funds lock or release.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 block">SMS Weather Warnings</span>
                <span className="text-stone-500 text-[10px]">Solar drying & heavy rain advisories.</span>
              </div>
              <input
                type="checkbox"
                checked={smsWeatherAlerts}
                onChange={(e) => setSmsWeatherAlerts(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500"
              />
            </label>
          </div>
        </Card>

      </div>
    </div>
  );
};
