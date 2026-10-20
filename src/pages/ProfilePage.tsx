import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, ShieldCheck, Award, Edit3, Check, Globe, Sprout } from 'lucide-react';
import { UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface ProfilePageProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [farmName, setFarmName] = useState(currentUser.farmName || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ fullName, farmName, location, bio });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-emerald-700 border-4 border-white/20 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold font-display">{currentUser.fullName}</h1>
              <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 font-bold text-[10px] rounded-full uppercase">
                {currentUser.role}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-bold text-[10px] rounded-full">
                ✓ Verified Merchant
              </span>
            </div>

            <p className="text-xs text-emerald-200">
              {currentUser.farmName || currentUser.companyName} • {currentUser.location}, {currentUser.country}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-stone-300 pt-1">
              <span>★ 4.98 Merchant Rating</span>
              <span>•</span>
              <span>Member since {currentUser.joinedDate}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-white/30 text-white hover:bg-white/10"
            icon={<Edit3 className="w-4 h-4" />}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Edit Form or Profile View */}
      {isEditing ? (
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Edit Profile Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / Organization Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Region</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Biography / Agricultural Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">Account Details</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Email:</span>
                <span className="font-semibold text-stone-900">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phone:</span>
                <span className="font-semibold text-stone-900">{currentUser.phone || '+254 712 345 678'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Country:</span>
                <span className="font-semibold text-stone-900">{currentUser.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Verification Status:</span>
                <span className="font-bold text-emerald-800">KEPHIS & Escrow Verified</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">Verified Badges & Certifications</h3>
            
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Phytosanitary Clearance</h4>
                  <p className="text-[10px] text-emerald-700">Certified zero aflatoxin levels in grain storage.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">100% Escrow Integrity Score</h4>
                  <p className="text-[10px] text-amber-700">12 completed shipments with zero buyer disputes.</p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      )}

    </div>
  );
};
