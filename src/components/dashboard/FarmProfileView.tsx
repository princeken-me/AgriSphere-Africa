import React, { useState } from 'react';
import { Sprout, MapPin, Award, Droplets, Compass, ShieldCheck, Plus, Trash2, HeartPulse } from 'lucide-react';
import { FarmProfile, FarmCropItem, LivestockItem } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface FarmProfileViewProps {
  profile: FarmProfile;
  crops: FarmCropItem[];
  livestock: LivestockItem[];
  onAddCrop: (crop: Omit<FarmCropItem, 'id'>) => void;
  onAddLivestock: (item: Omit<LivestockItem, 'id'>) => void;
  onDeleteCrop: (id: string) => void;
  onDeleteLivestock: (id: string) => void;
}

export const FarmProfileView: React.FC<FarmProfileViewProps> = ({
  profile,
  crops,
  livestock,
  onAddCrop,
  onAddLivestock,
  onDeleteCrop,
  onDeleteLivestock
}) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isLivestockModalOpen, setIsLivestockModalOpen] = useState(false);

  // Crop Form State
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState('Grains & Cereals');
  const [areaHectares, setAreaHectares] = useState(10);
  const [expectedYieldKg, setExpectedYieldKg] = useState(15000);

  // Livestock Form State
  const [animalType, setAnimalType] = useState('Dairy Cattle');
  const [breed, setBreed] = useState('Friesian');
  const [count, setCount] = useState(10);
  const [notes, setNotes] = useState('');

  const handleCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCrop({
      farmId: profile.id,
      cropName: cropName || 'Hybrid Crop',
      variety: variety || 'Standard High-Yield',
      category,
      areaHectares: Number(areaHectares),
      expectedYieldKg: Number(expectedYieldKg),
      healthStatus: 'Excellent',
      status: 'Growing'
    });
    setIsCropModalOpen(false);
    setCropName('');
    setVariety('');
  };

  const handleLivestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLivestock({
      farmId: profile.id,
      animalType,
      breed,
      count: Number(count),
      healthStatus: 'Healthy',
      vaccinationStatus: 'Up to Date',
      housingType: 'Sheltered Paddock',
      notes
    });
    setIsLivestockModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-8">
      
      {/* Farm Overview Card */}
      <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Certified Estate
              </span>
              <span className="text-xs text-stone-400">Est. {profile.establishedYear}</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">{profile.farmName}</h2>
            <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{profile.location}, {profile.country}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-800/80 p-3 rounded-2xl text-center border border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Estate Area</span>
              <span className="text-lg font-black text-emerald-400">{profile.totalSizeHectares} Ha</span>
            </div>
            <div className="bg-stone-800/80 p-3 rounded-2xl text-center border border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Arable Land</span>
              <span className="text-lg font-black text-amber-300">{profile.arableHectares} Ha</span>
            </div>
          </div>
        </div>

        {/* Spec Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-stone-950/40 rounded-2xl border border-stone-800">
            <span className="text-stone-400 text-[10px] font-bold uppercase block flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-400" /> Soil Classification
            </span>
            <span className="font-bold text-white mt-1 block">{profile.soilType}</span>
          </div>

          <div className="p-3 bg-stone-950/40 rounded-2xl border border-stone-800">
            <span className="text-stone-400 text-[10px] font-bold uppercase block flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" /> Water Supply
            </span>
            <span className="font-bold text-white mt-1 block">{profile.waterSource}</span>
          </div>

          <div className="p-3 bg-stone-950/40 rounded-2xl border border-stone-800">
            <span className="text-stone-400 text-[10px] font-bold uppercase block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Certification
            </span>
            <span className="font-bold text-white mt-1 block">{profile.certificationStatus}</span>
          </div>

          <div className="p-3 bg-stone-950/40 rounded-2xl border border-stone-800">
            <span className="text-stone-400 text-[10px] font-bold uppercase block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Agro-ecological Zone
            </span>
            <span className="font-bold text-white mt-1 block">{profile.climateZone}</span>
          </div>
        </div>
      </div>

      {/* Crop Variety & Land Usage Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700" /> Cultivated Crop Inventory
            </h3>
            <p className="text-xs text-stone-500">Tracked acreage, crop varieties, and expected harvest output.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsCropModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Crop Field
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crops.map((c) => (
            <Card key={c.id} className="p-5 space-y-3 relative group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="emerald">{c.category}</Badge>
                    <Badge variant={c.status === 'Ready for Harvest' ? 'amber' : 'stone'}>{c.status}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-stone-900">{c.cropName}</h4>
                  <p className="text-xs text-stone-500">Variety: <strong>{c.variety}</strong></p>
                </div>

                <button
                  onClick={() => onDeleteCrop(c.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove crop field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Field Acreage</span>
                  <span className="font-extrabold text-stone-900 text-sm">{c.areaHectares} Ha</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Est. Yield</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{c.expectedYieldKg.toLocaleString()} kg</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Livestock Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-700" /> Livestock & Animal Husbandry
            </h3>
            <p className="text-xs text-stone-500">Herd counts, breed registries, health & vaccination status.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsLivestockModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Register Livestock Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {livestock.map((ls) => (
            <Card key={ls.id} className="p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="emerald">{ls.animalType}</Badge>
                  <span className="text-xs font-black text-stone-900">{ls.count} Head</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{ls.breed}</h4>
                <p className="text-xs text-stone-500 mt-1">{ls.housingType}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400 text-[11px]">Vaccination:</span>
                  <span className="font-semibold text-stone-800">{ls.vaccinationStatus}</span>
                </div>
                <p className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg italic">"{ls.notes}"</p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onDeleteLivestock(ls.id)}
                    className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete Entry
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Crop Modal */}
      <Modal isOpen={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} title="Add Crop Field Inventory">
        <form onSubmit={handleCropSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Name</label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g. White Sorghum / Yellow Maize"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Gadam Sorghum"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Cash Crops">Cash Crops</option>
                <option value="Pulses & Legumes">Pulses & Legumes</option>
                <option value="Roots & Tubers">Roots & Tubers</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Area (Hectares)</label>
              <input
                type="number"
                step="0.5"
                value={areaHectares}
                onChange={(e) => setAreaHectares(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Expected Yield (kg)</label>
              <input
                type="number"
                value={expectedYieldKg}
                onChange={(e) => setExpectedYieldKg(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCropModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Crop Field
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Livestock Modal */}
      <Modal isOpen={isLivestockModalOpen} onClose={() => setIsLivestockModalOpen(false)} title="Register Livestock Entry">
        <form onSubmit={handleLivestockSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Animal Type</label>
              <input
                type="text"
                required
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                placeholder="e.g. Dairy Cattle, Goats"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Breed</label>
              <input
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Friesian Cross"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Head Count</label>
            <input
              type="number"
              required
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Yield Records</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Daily milk production average..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsLivestockModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Livestock Group
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
