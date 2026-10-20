import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Check, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { CropListing, ProductFormData, UserProfile } from '../types';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: ProductFormData) => void;
  onSaveProduct?: (formData: ProductFormData) => void;
  editingListing?: CropListing | null;
  currentUser?: UserProfile | null;
}

const PRESET_CROPS = [
  { name: 'White Maize', category: 'Grains & Cereals', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
  { name: 'Yellow Beans', category: 'Pulses & Legumes', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ashanti Cocoa Beans', category: 'Cash Crops', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hass Avocado', category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
  { name: 'Raw Cashew Nuts', category: 'Nuts & Seeds', image: 'https://images.unsplash.com/photo-1509358271058-acd02cc93858?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cassava Starch Roots', category: 'Roots & Tubers', image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80' }
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSaveProduct,
  editingListing,
  currentUser
}) => {
  const saveHandler = onSubmit || onSaveProduct;

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    cropCategory: 'Grains & Cereals',
    cropName: '',
    pricePerKgUSD: 0.50,
    quantityAvailableKg: 10000,
    minOrderKg: 500,
    harvestDate: new Date().toISOString().split('T')[0],
    country: currentUser?.country || 'Kenya',
    farmerLocation: currentUser?.location || 'Kitale, Trans-Nzoia',
    lat: 1.0157,
    lng: 35.0062,
    organic: false,
    moistureContent: '12.5%',
    grade: 'Grade A',
    description: '',
    certs: ['KEPHIS Inspected', 'Moisture Certified'],
    image: PRESET_CROPS[0].image,
    gallery: [PRESET_CROPS[0].image]
  });

  const [certInput, setCertInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingListing) {
      setFormData({
        id: editingListing.id,
        title: editingListing.title,
        cropCategory: editingListing.cropCategory,
        cropName: editingListing.cropName,
        pricePerKgUSD: editingListing.pricePerKgUSD,
        quantityAvailableKg: editingListing.quantityAvailableKg,
        minOrderKg: editingListing.minOrderKg,
        harvestDate: editingListing.harvestDate,
        country: editingListing.country,
        farmerLocation: editingListing.farmerLocation,
        lat: editingListing.locationCoords?.lat || 1.0157,
        lng: editingListing.locationCoords?.lng || 35.0062,
        organic: editingListing.organic,
        moistureContent: editingListing.moistureContent,
        grade: editingListing.grade,
        description: editingListing.description,
        certs: editingListing.certs || [],
        image: editingListing.image,
        gallery: editingListing.gallery && editingListing.gallery.length > 0 ? editingListing.gallery : [editingListing.image]
      });
    } else {
      setFormData({
        title: '',
        cropCategory: 'Grains & Cereals',
        cropName: 'White Maize',
        pricePerKgUSD: 0.42,
        quantityAvailableKg: 15000,
        minOrderKg: 1000,
        harvestDate: new Date().toISOString().split('T')[0],
        country: currentUser?.country || 'Kenya',
        farmerLocation: currentUser?.location || 'Kitale, Trans-Nzoia',
        lat: 1.0157,
        lng: 35.0062,
        organic: false,
        moistureContent: '12.4%',
        grade: 'Grade A',
        description: 'High-quality agricultural produce grown under sustainable eco-friendly practices. Tested and ready for wholesale escrow trade.',
        certs: ['Certified Disease-Free', 'KEPHIS Clearance', 'Moisture <13%'],
        image: PRESET_CROPS[0].image,
        gallery: [PRESET_CROPS[0].image]
      });
    }
    setErrorMsg('');
  }, [editingListing, isOpen, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a descriptive product title');
      return;
    }
    if (formData.pricePerKgUSD <= 0) {
      setErrorMsg('Price per kg must be greater than zero');
      return;
    }
    if (formData.quantityAvailableKg <= 0) {
      setErrorMsg('Available quantity must be greater than zero');
      return;
    }
    if (saveHandler) {
      saveHandler(formData);
    }
    onClose();
  };

  const handleAddCert = () => {
    if (certInput.trim() && !formData.certs.includes(certInput.trim())) {
      setFormData(prev => ({ ...prev, certs: [...prev.certs, certInput.trim()] }));
      setCertInput('');
    }
  };

  const handleRemoveCert = (cert: string) => {
    setFormData(prev => ({ ...prev, certs: prev.certs.filter(c => c !== cert) }));
  };

  const handleAddGalleryImage = () => {
    if (galleryUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, galleryUrlInput.trim()]
      }));
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => {
      const updated = prev.gallery.filter((_, i) => i !== index);
      return {
        ...prev,
        gallery: updated,
        image: updated.length > 0 ? updated[0] : prev.image
      };
    });
  };

  const handleSelectPresetImage = (preset: typeof PRESET_CROPS[0]) => {
    setFormData(prev => ({
      ...prev,
      cropName: preset.name.split(' ')[1] || preset.name,
      cropCategory: preset.category as any,
      image: preset.image,
      gallery: Array.from(new Set([preset.image, ...prev.gallery]))
    }));
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate file upload by creating an object URL
      const urls = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        image: urls[0],
        gallery: Array.from(new Set([...prev.gallery, ...urls]))
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingListing ? 'Edit Crop Listing' : 'List Harvest Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Crop Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Grade-A Sun-Dried White Maize 2026"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Crop Category *</label>
              <select
                value={formData.cropCategory}
                onChange={e => setFormData({ ...formData, cropCategory: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Pulses & Legumes">Pulses & Legumes</option>
                <option value="Cash Crops">Cash Crops</option>
                <option value="Roots & Tubers">Roots & Tubers</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Nuts & Seeds">Nuts & Seeds</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Commodity Name *</label>
              <input
                type="text"
                required
                value={formData.cropName}
                onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                placeholder="e.g. Maize, Cocoa, Avocado"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Price per Kg (USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.pricePerKgUSD}
                onChange={e => setFormData({ ...formData, pricePerKgUSD: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Grade Standard</label>
              <select
                value={formData.grade}
                onChange={e => setFormData({ ...formData, grade: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Export Quality">Export Quality</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quantities & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100 pt-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Available Quantity (kg) *</label>
            <input
              type="number"
              min="100"
              required
              value={formData.quantityAvailableKg}
              onChange={e => setFormData({ ...formData, quantityAvailableKg: parseInt(e.target.value) || 0 })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Minimum Order (kg) *</label>
            <input
              type="number"
              min="50"
              required
              value={formData.minOrderKg}
              onChange={e => setFormData({ ...formData, minOrderKg: parseInt(e.target.value) || 0 })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Harvest Date *</label>
            <input
              type="date"
              required
              value={formData.harvestDate}
              onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Location & Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100 pt-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Country *</label>
            <select
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="South Africa">South Africa</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Farm Location / Region *</label>
            <input
              type="text"
              required
              value={formData.farmerLocation}
              onChange={e => setFormData({ ...formData, farmerLocation: e.target.value })}
              placeholder="e.g. Kitale, Trans-Nzoia"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Moisture Level</label>
            <input
              type="text"
              value={formData.moistureContent}
              onChange={e => setFormData({ ...formData, moistureContent: e.target.value })}
              placeholder="e.g. 12.5%"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Organic Checkbox & Certifications */}
        <div className="space-y-3 border-t border-stone-100 pt-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={e => setFormData({ ...formData, organic: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <span className="text-xs font-bold text-stone-800">Organic Certified Harvest</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Quality Certifications & Badges</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={certInput}
                onChange={e => setCertInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCert(); } }}
                placeholder="e.g. KEPHIS Inspected, FairTrade, Moisture <13%"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCert} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Cert
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.certs.map((cert, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {cert}
                  <button type="button" onClick={() => handleRemoveCert(cert)} className="text-stone-400 hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Crop Description & Details *</label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe crop quality, soil conditions, storage type, and export readiness..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Multiple Image Upload / Gallery */}
        <div className="space-y-3 border-t border-stone-100 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-700" /> Produce Photo Gallery ({formData.gallery.length} images)
            </h4>
          </div>

          {/* Presets */}
          <div>
            <p className="text-[11px] font-medium text-stone-500 mb-2">Select HD Preset Agricultural Image:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_CROPS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPresetImage(preset)}
                  className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    formData.image === preset.image ? 'border-emerald-700 ring-2 ring-emerald-700/30' : 'border-stone-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                  {formData.image === preset.image && (
                    <span className="absolute top-1 right-1 bg-emerald-700 text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button + Gallery Url Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="border-2 border-dashed border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/50 p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-emerald-700 mb-1" />
              <span className="text-xs font-bold text-stone-700">Upload Image File</span>
              <span className="text-[10px] text-stone-400">JPG, PNG, WEBP</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUploadSim} className="hidden" />
            </label>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-stone-500">Or Paste Image URL:</span>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={galleryUrlInput}
                  onChange={e => setGalleryUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryImage}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Active Gallery Strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
            {formData.gallery.map((url, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200 shrink-0 group">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {formData.image === url && (
                  <span className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[9px] font-bold px-1 rounded">Main</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {editingListing ? 'Update Listing' : 'Publish Harvest Product'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
