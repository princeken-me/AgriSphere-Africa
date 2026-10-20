import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Grid, Map as MapIcon, ShieldCheck, Heart, ShoppingBag, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CropListing, CurrencyCode, UserProfile } from '../types';
import { formatPrice } from '../utils/currency';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { MapContainer } from '../components/MapContainer';

interface MarketplacePageProps {
  listings: CropListing[];
  currentCurrency: CurrencyCode;
  onSelectListing: (listing: CropListing) => void;
  onOpenAIAgronomist: () => void;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  onAddToCart: (listing: CropListing, quantityKg: number) => void;
  currentUser: UserProfile | null;
  onOpenAddProductModal?: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  listings,
  currentCurrency,
  onSelectListing,
  onOpenAIAgronomist,
  favorites,
  onToggleFavorite,
  onAddToCart,
  currentUser,
  onOpenAddProductModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(5.00);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'harvest_newest' | 'quantity_desc'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const itemsPerPage = 6;

  const categories = ['All', 'Grains & Cereals', 'Pulses & Legumes', 'Cash Crops', 'Roots & Tubers', 'Fruits & Vegetables', 'Nuts & Seeds'];
  const countries = ['All', 'Kenya', 'Ghana', 'Nigeria', 'Ethiopia', 'Rwanda', 'South Africa', 'Tanzania', 'Uganda'];
  const grades = ['All', 'Grade A', 'Grade B', 'Export Quality', 'Standard'];

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || l.cropCategory === selectedCategory;
      const matchesCountry = selectedCountry === 'All' || l.country === selectedCountry;
      const matchesGrade = selectedGrade === 'All' || l.grade === selectedGrade;
      const matchesOrganic = !organicOnly || l.organic;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(l.id);
      const matchesPrice = l.pricePerKgUSD <= maxPriceUSD;

      return matchesSearch && matchesCategory && matchesCountry && matchesGrade && matchesOrganic && matchesFavorites && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerKgUSD - b.pricePerKgUSD;
      if (sortBy === 'price_desc') return b.pricePerKgUSD - a.pricePerKgUSD;
      if (sortBy === 'harvest_newest') return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
      if (sortBy === 'quantity_desc') return b.quantityAvailableKg - a.quantityAvailableKg;
      return b.rating - a.rating;
    });
  }, [listings, searchTerm, selectedCategory, selectedCountry, selectedGrade, organicOnly, showFavoritesOnly, maxPriceUSD, sortBy, favorites]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCountry('All');
    setSelectedGrade('All');
    setOrganicOnly(false);
    setShowFavoritesOnly(false);
    setMaxPriceUSD(5.00);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Crop Marketplace</h1>
          <p className="text-stone-500 text-sm">
            Direct wholesale harvests from verified Pan-African smallholders & co-ops with 100% escrow trade security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && currentUser.role === 'farmer' && onOpenAddProductModal && (
            <Button variant="primary" size="sm" onClick={onOpenAddProductModal}>
              + List Harvest Product
            </Button>
          )}

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-4 h-4" /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4" /> Map View
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        
        {/* Top Search & Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search crop name, farmer, region, or grade (e.g. Maize, Cocoa, Trans-Nzoia)..."
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Favorites toggle */}
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setCurrentPage(1);
              }}
              className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-600' : ''}`} />
              <span>Saved ({favorites.length})</span>
            </button>

            {/* Filter drawer toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                showAdvancedFilters
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="harvest_newest">Harvest: Newest First</option>
              <option value="quantity_desc">Supply: Most Available</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-2 border-t border-stone-100 max-w-full">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-2 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer / Section */}
        {showAdvancedFilters && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Country / Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Grade Standard</label>
              <select
                value={selectedGrade}
                onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Max Price: ${maxPriceUSD.toFixed(2)}/kg</label>
              <input
                type="range"
                min="0.10"
                max="10.00"
                step="0.10"
                value={maxPriceUSD}
                onChange={(e) => { setMaxPriceUSD(parseFloat(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => { setOrganicOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span>Organic Certified</span>
              </label>

              <button
                onClick={resetFilters}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Main View Display */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <MapContainer
            listings={filteredListings}
            onSelectListing={onSelectListing}
            height="550px"
          />
          <p className="text-xs text-stone-500 text-center">
            Showing {filteredListings.length} harvest listings on Leaflet Pan-African Map. Click markers for crop specs.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
              <Search className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">No crop listings match your criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">Try resetting your active search terms or filters.</p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((listing) => {
                const isFav = favorites.includes(listing.id);
                return (
                  <Card
                    key={listing.id}
                    hoverEffect
                    className="overflow-hidden flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-48 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectListing(listing)}>
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          <span className="bg-emerald-950/80 text-white backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {listing.country}
                          </span>
                          {listing.organic && (
                            <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2.5 py-1 rounded-full">
                              Organic
                            </span>
                          )}
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(listing.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 cursor-pointer ${
                            isFav
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-600'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                        </button>

                        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-stone-900 font-extrabold text-[11px] px-2.5 py-1 rounded-xl shadow-xs">
                          {listing.moistureContent} moisture
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 cursor-pointer" onClick={() => onSelectListing(listing)}>
                        <div className="flex items-center justify-between">
                          <Badge variant="emerald">{listing.cropCategory}</Badge>
                          <span className="text-[11px] font-semibold text-stone-500">★ {listing.rating} ({listing.reviewsCount})</span>
                        </div>

                        <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors">
                          {listing.title}
                        </h3>
                        
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{listing.farmerName} • {listing.farmerLocation}</span>
                        </p>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {listing.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {listing.certs.map((c, i) => (
                            <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                      <div>
                        <span className="text-[10px] text-stone-400 font-medium block">Wholesale Escrow Price</span>
                        <p className="text-base font-black text-emerald-800">
                          {formatPrice(listing.pricePerKgUSD, currentCurrency)} <span className="text-xs font-medium text-stone-500">/ kg</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToCart(listing, listing.minOrderKg)}
                          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors cursor-pointer"
                          title="Add min order to cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>

                        <Button variant="primary" size="sm" onClick={() => onSelectListing(listing)}>
                          Inspect & Buy
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

    </div>
  );
};
