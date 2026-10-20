import React, { useState } from 'react';
import { MapPin, ShieldCheck, CheckCircle2, MessageSquare, Lock, ArrowLeft, Star, Award, Heart, ShoppingBag, Edit3, Trash2, Calculator } from 'lucide-react';
import { CropListing, CurrencyCode, ProductReview, UserProfile } from '../types';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MapContainer } from '../components/MapContainer';
import { ReviewSection } from '../components/ReviewSection';

interface ProductDetailsPageProps {
  listing: CropListing;
  currentCurrency: CurrencyCode;
  onBack: () => void;
  onContactFarmer: (listing: CropListing) => void;
  onOpenEscrowModal: (listing: CropListing, quantityKg?: number) => void;
  onAddToCart: (listing: CropListing, quantityKg: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (listingId: string) => void;
  reviews: ProductReview[];
  onAddReview: (listingId: string, rating: number, comment: string) => void;
  currentUser: UserProfile | null;
  onEditListing?: (listing: CropListing) => void;
  onDeleteListing?: (listingId: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  listing,
  currentCurrency,
  onBack,
  onContactFarmer,
  onOpenEscrowModal,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  currentUser,
  onEditListing,
  onDeleteListing
}) => {
  const [selectedImg, setSelectedImg] = useState(listing.image);
  const [customQtyKg, setCustomQtyKg] = useState<number>(listing.minOrderKg || 1000);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const isFarmerOwner = currentUser && (currentUser.id === listing.farmerId || currentUser.role === 'farmer');

  const estimatedTotalUSD = customQtyKg * listing.pricePerKgUSD;
  const escrowFeeUSD = estimatedTotalUSD * 0.015;

  const handleAddToCart = () => {
    onAddToCart(listing, customQtyKg);
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crop Marketplace
        </button>

        <div className="flex items-center gap-2">
          {/* Heart Favorite button */}
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save Favorite'}</span>
          </button>

          {/* Edit / Delete actions for farmer owner */}
          {isFarmerOwner && (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              {onEditListing && (
                <Button variant="outline" size="sm" onClick={() => onEditListing(listing)} icon={<Edit3 className="w-3.5 h-3.5" />}>
                  Edit Listing
                </Button>
              )}
              {onDeleteListing && (
                <Button variant="danger" size="sm" onClick={() => onDeleteListing(listing.id)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete Listing
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Gallery & Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-3 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 relative">
            
            <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-stone-100 relative group">
              <img
                src={selectedImg}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-stone-950/80 text-white backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full">
                  {listing.country}
                </span>
                {listing.organic && (
                  <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-3 py-1 rounded-full">
                    Organic Certified
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {listing.gallery && listing.gallery.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {listing.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                      selectedImg === imgUrl ? 'border-emerald-700 ring-2 ring-emerald-700/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Map */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" /> Farm Harvest Origin
            </h4>
            <MapContainer
              listings={[listing]}
              selectedListingId={listing.id}
              center={[listing.locationCoords?.lat || 1.0157, listing.locationCoords?.lng || 35.0062]}
              zoom={7}
              height="280px"
            />
          </div>
        </div>

        {/* Right Purchase & Spec Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="emerald">{listing.cropCategory}</Badge>
                {listing.organic && <Badge variant="amber">Organic</Badge>}
                <span className="text-xs text-stone-500 font-semibold ml-auto flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {listing.rating} ({listing.reviewsCount} reviews)
                </span>
              </div>

              <h1 className="text-2xl font-bold text-stone-900 leading-tight">{listing.title}</h1>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-stone-400" />
                <span>{listing.farmerLocation}, {listing.country}</span>
              </p>
            </div>

            {/* Price block */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Wholesale Escrow Price</span>
                <p className="text-2xl font-black text-emerald-900">
                  {formatPrice(listing.pricePerKgUSD, currentCurrency)} <span className="text-xs font-normal text-stone-600">/ kg</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 font-medium">Available Supply</span>
                <p className="text-sm font-bold text-stone-900">{listing.quantityAvailableKg.toLocaleString()} kg</p>
              </div>
            </div>

            {/* Spec Parameters Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block text-[10px]">Moisture Content</span>
                <span className="font-bold text-stone-900">{listing.moistureContent}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block text-[10px]">Grade Standard</span>
                <span className="font-bold text-stone-900">{listing.grade}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block text-[10px]">Harvest Date</span>
                <span className="font-bold text-stone-900">{listing.harvestDate}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-medium block text-[10px]">Min. Wholesale Order</span>
                <span className="font-bold text-stone-900">{listing.minOrderKg.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Interactive Quantity & Cost Estimator */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-700" /> Quantity Order Calculator
                </span>
                <span className="text-[10px] text-stone-500">Min. {listing.minOrderKg.toLocaleString()} kg</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={listing.minOrderKg}
                  max={listing.quantityAvailableKg}
                  step={500}
                  value={customQtyKg}
                  onChange={e => setCustomQtyKg(Math.max(listing.minOrderKg, parseInt(e.target.value) || listing.minOrderKg))}
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-xs font-bold text-stone-600">kg</span>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Harvest Amount ({customQtyKg.toLocaleString()} kg):</span>
                  <span className="font-bold text-stone-900">{formatPrice(estimatedTotalUSD, currentCurrency)}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>1.5% Escrow Inspection Fee:</span>
                  <span className="font-semibold text-stone-800">{formatPrice(escrowFeeUSD, currentCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-900 text-sm pt-1 border-t border-stone-200/60">
                  <span>Est. Total Wholesale Cost:</span>
                  <span>{formatPrice(estimatedTotalUSD + escrowFeeUSD, currentCurrency)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Farmer Overview</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Certifications list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Verified Certifications</h4>
              <div className="flex flex-wrap gap-1.5">
                {listing.certs.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 bg-stone-100/70 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                  {listing.farmerName.charAt(0)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900">{listing.farmerName}</h5>
                  <p className="text-[10px] text-stone-500">Verified Agricultural Merchant</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onContactFarmer(listing)} icon={<MessageSquare className="w-3.5 h-3.5" />}>
                Message Farmer
              </Button>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 font-bold"
                  icon={<ShoppingBag className="w-4 h-4 text-emerald-700" />}
                >
                  {addedToCartSuccess ? 'Added to Cart ✓' : 'Add to Cart'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onOpenEscrowModal(listing, customQtyKg)}
                  className="flex-1 font-bold shadow-md shadow-emerald-950/20"
                  icon={<Lock className="w-4 h-4" />}
                >
                  Buy with Escrow
                </Button>
              </div>

              <p className="text-[10px] text-stone-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                100% Escrow Protection • Quality verified before payment payout
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Ratings & Quality Reviews Section */}
      <ReviewSection
        listingId={listing.id}
        reviews={reviews}
        currentUser={currentUser}
        onAddReview={onAddReview}
      />

    </div>
  );
};
