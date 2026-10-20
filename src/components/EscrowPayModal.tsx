import React, { useState } from 'react';
import { ShieldCheck, Lock, Truck, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { CropListing, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface EscrowPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: CropListing | null;
  currentCurrency: CurrencyCode;
  onConfirmOrder: (quantityKg: number, deliveryAddress: string) => void;
}

export const EscrowPayModal: React.FC<EscrowPayModalProps> = ({
  isOpen,
  onClose,
  listing,
  currentCurrency,
  onConfirmOrder
}) => {
  if (!listing) return null;

  const [quantityKg, setQuantityKg] = useState<number>(listing.minOrderKg || 1000);
  const [deliveryAddress, setDeliveryAddress] = useState('Tema Harbor Terminal 2, Accra, Ghana');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const totalPriceUSD = quantityKg * listing.pricePerKgUSD;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      setTimeout(() => {
        onConfirmOrder(quantityKg, deliveryAddress);
        setOrderComplete(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AgriSphere Trade Escrow Lockdown" maxWidth="lg">
      <div className="space-y-6">
        
        {/* Banner */}
        <div className="bg-emerald-900 text-white p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-800 rounded-xl text-emerald-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Pan-African Escrow Protection</h4>
            <p className="text-xs text-white">Funds are held in neutral escrow and only released to the farmer after quality verification at delivery.</p>
          </div>
        </div>

        {orderComplete ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Escrow Payment Locked Successfully!</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your order funds have been deposited into escrow. Farmer <strong>{listing.farmerName}</strong> has been notified to initialize lab inspection & loading.
            </p>
          </div>
        ) : (
          <>
            {/* Listing Summary */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-stone-900 truncate">{listing.title}</h4>
                <p className="text-[11px] text-stone-500">{listing.farmerName} • {listing.country}</p>
                <p className="text-xs font-semibold text-emerald-700">{formatPrice(listing.pricePerKgUSD, currentCurrency)}/kg</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">Order Quantity (kg)</label>
                  <span className="text-[11px] text-stone-500">Min: {listing.minOrderKg.toLocaleString()} kg | Max: {listing.quantityAvailableKg.toLocaleString()} kg</span>
                </div>
                <input
                  type="number"
                  min={listing.minOrderKg}
                  max={listing.quantityAvailableKg}
                  step={100}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Destination Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Port, packhouse, or warehouse address"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 bg-stone-100/70 rounded-2xl space-y-2 border border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Crop Subtotal ({quantityKg.toLocaleString()} kg)</span>
                <span>{formatPrice(totalPriceUSD, currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>AgriSphere Escrow & Quality Fee (0.5%)</span>
                <span>{formatPrice(totalPriceUSD * 0.005, currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Inspected Solar Transport Estimate</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="border-t border-stone-300 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Escrow Lock</span>
                <span className="text-emerald-800 font-extrabold">{formatPrice(totalPriceUSD * 1.005, currentCurrency)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                icon={<Lock className="w-4 h-4" />}
              >
                Deposit & Lock Escrow
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
