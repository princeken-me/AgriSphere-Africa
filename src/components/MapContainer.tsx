import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CropListing } from '../types';
import { formatPrice } from '../utils/currency';

interface MapContainerProps {
  listings: CropListing[];
  onSelectListing?: (listing: CropListing) => void;
  selectedListingId?: string;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Fix default leaflet icon URLs in Vite ESM environment
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MapContainer: React.FC<MapContainerProps> = ({
  listings,
  onSelectListing,
  selectedListingId,
  center = [1.2921, 36.8219], // Default: Nairobi, East Africa center
  zoom = 5,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center as [number, number], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AgriSphere Africa'
      }).addTo(map);

      leafletInstanceRef.current = map;
    } else {
      leafletInstanceRef.current.setView(center as [number, number], zoom);
    }

    const map = leafletInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for crop listings
    listings.forEach((listing) => {
      const { lat, lng } = listing.locationCoords;
      if (!lat || !lng) return;

      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[200px] text-stone-900';
      popupContent.innerHTML = `
        <div class="space-y-1">
          <span class="inline-block px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full">${listing.cropCategory}</span>
          <h4 class="text-xs font-bold">${listing.title}</h4>
          <p class="text-[11px] text-stone-500">${listing.farmerName} • ${listing.country}</p>
          <div class="flex items-center justify-between pt-1 border-t border-stone-200 mt-1">
            <span class="text-xs font-extrabold text-emerald-700">${formatPrice(listing.pricePerKgUSD)}/kg</span>
            <span class="text-[10px] text-stone-600 font-medium">${listing.quantityAvailableKg.toLocaleString()} kg avail.</span>
          </div>
        </div>
      `;

      if (onSelectListing) {
        popupContent.addEventListener('click', () => {
          onSelectListing(listing);
        });
      }

      marker.bindPopup(popupContent);

      if (selectedListingId === listing.id) {
        marker.openPopup();
      }
    });

    return () => {
      // Clean up map instance on unmount
    };
  }, [listings, center, zoom, selectedListingId, onSelectListing]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs">
      <div ref={mapRef} style={{ height }} className="w-full z-10" />
      <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-semibold text-stone-700 shadow-xs border border-stone-200 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
        Live Pan-African Agricultural Map
      </div>
    </div>
  );
};
