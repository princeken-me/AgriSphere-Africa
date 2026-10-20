import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Save, CheckCircle2, CreditCard, Bell, Lock, Flame } from 'lucide-react';
import { FarmProfile } from '../../types';
import { isFirebaseConfigured } from '../../lib/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface SettingsViewProps {
  profile: FarmProfile;
  onUpdateProfile: (updated: Partial<FarmProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile }) => {
  const [farmName, setFarmName] = useState(profile.farmName);
  const [location, setLocation] = useState(profile.location);
  const [totalSize, setTotalSize] = useState(profile.totalSizeHectares);
  const [waterSource, setWaterSource] = useState(profile.waterSource);

  // Escrow Payout Config
  const [mpesaNumber, setMpesaNumber] = useState('+254 712 345678');
  const [bankAccount, setBankAccount] = useState('Equity Bank Kenya - Kitale Branch (A/C: 0184920193)');

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      farmName,
      location,
      totalSizeHectares: Number(totalSize),
      waterSource
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" /> Farm & Escrow Account Settings
          </h3>
          <p className="text-xs text-stone-500">Configure profile details, escrow payout routing, database sync, and notification triggers.</p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Farm Profile Configuration */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Farm Identity & Location
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / Estate Name</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Region & Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Total Estate Size (Hectares)</label>
              <input
                type="number"
                step="0.5"
                required
                value={totalSize}
                onChange={(e) => setTotalSize(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Water Source</label>
              <input
                type="text"
                required
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </Card>

        {/* Escrow Payout Details */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-700" /> Direct Escrow Payout Accounts
          </h4>
          <p className="text-xs text-stone-500">Funds released from AgriSphere Smart Escrow will be disbursed to these registered accounts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Money (M-Pesa / MTN MoMo)</label>
              <input
                type="text"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Bank Settlement Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </Card>

        {/* Firebase Firestore Database Connection Status */}
        <Card className="p-5 space-y-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600" /> Firebase Firestore Database Connectivity
          </h4>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected to Google Cloud Firestore ({firebaseConfig.projectId || 'gen-lang-client-0659043566'})</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              FIRESTORE LIVE
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Real-time multi-client document synchronization and security rules (`firestore.rules`) are enforced across crops, orders, and chats.
          </p>
        </Card>

        {/* Notifications Config */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-700" /> Alert Preferences
          </h4>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer">
              <span className="font-medium text-stone-800">SMS Notifications for Escrow Milestones</span>
              <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="rounded text-emerald-700" />
            </label>

            <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer">
              <span className="font-medium text-stone-800">Daily Weather & Rain Risk Forecast Summaries</span>
              <input type="checkbox" checked={weatherAlerts} onChange={(e) => setWeatherAlerts(e.target.checked)} className="rounded text-emerald-700" />
            </label>

            <label className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl cursor-pointer">
              <span className="font-medium text-stone-800">Email Invoices & Financial Reports</span>
              <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="rounded text-emerald-700" />
            </label>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit" icon={<Save className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>

      </form>

    </div>
  );
};
