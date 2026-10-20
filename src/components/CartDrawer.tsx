import React from 'react';
import { X, ShoppingBag, Trash2, Lock, ShieldCheck, ArrowRight, Plus, Minus } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { Button } from './common/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (listingId: string, quantityKg: number) => void;
  onRemoveItem: (listingId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  currentCurrency: CurrencyCode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  currentCurrency
}) => {
  if (!isOpen) return null;

  const subtotalUSD = cartItems.reduce((acc, item) => acc + (item.listing.pricePerKgUSD * item.quantityKg), 0);
  const escrowFeeUSD = subtotalUSD * 0.015; // 1.5% neutral escrow guarantee fee
  const grandTotalUSD = subtotalUSD + escrowFeeUSD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-700 text-white rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Wholesale Escrow Cart</h2>
                <p className="text-xs text-stone-500">{cartItems.length} harvest {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 stroke-1" />
                <h3 className="text-sm font-bold text-stone-800">Your Escrow Cart is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Browse the Pan-African crop marketplace and add inspected harvests to your escrow cart.
                </p>
                <Button variant="outline" size="sm" onClick={onClose}>
                  Explore Marketplace
                </Button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemTotalUSD = item.listing.pricePerKgUSD * item.quantityKg;
                return (
                  <div key={item.listingId} className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 relative">
                    <div className="flex gap-3">
                      <img
                        src={item.listing.image}
                        alt={item.listing.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{item.listing.title}</h4>
                        <p className="text-[11px] text-stone-500">{item.listing.farmerName} • {item.listing.country}</p>
                        <p className="text-xs font-bold text-emerald-800 mt-1">
                          {formatPrice(item.listing.pricePerKgUSD, currentCurrency)} <span className="text-[10px] text-stone-400 font-normal">/ kg</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.listingId)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg bg-stone-50 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.listingId, Math.max(item.listing.minOrderKg, item.quantityKg - 500))}
                          className="text-stone-600 hover:text-stone-900 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 px-2 min-w-16 text-center">
                          {item.quantityKg.toLocaleString()} kg
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.listingId, item.quantityKg + 500)}
                          className="text-stone-600 hover:text-stone-900 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-medium">Subtotal</span>
                        <p className="text-xs font-bold text-stone-900">{formatPrice(itemTotalUSD, currentCurrency)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Harvest Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotalUSD, currentCurrency)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-700" /> Escrow Inspection Fee (1.5%)
                  </span>
                  <span className="font-semibold text-stone-900">{formatPrice(escrowFeeUSD, currentCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-800 text-base">{formatPrice(grandTotalUSD, currentCurrency)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/60 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Funds released to farmer only after KEPHIS/SGS quality verification upon port delivery.</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="md" onClick={onClearCart} className="text-xs">
                  Clear
                </Button>
                <Button variant="primary" size="md" onClick={onCheckout} className="flex-1 font-bold shadow-sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Proceed to Escrow Checkout
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
