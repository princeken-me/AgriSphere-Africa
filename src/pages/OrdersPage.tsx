import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Truck, CheckCircle, Clock, Download, FileText, ChevronRight, Lock } from 'lucide-react';
import { Order, CurrencyCode, UserProfile } from '../types';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';

interface OrdersPageProps {
  currentUser: UserProfile;
  orders: Order[];
  currentCurrency: CurrencyCode;
  onReleaseEscrow?: (orderId: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  currentUser,
  orders,
  currentCurrency,
  onReleaseEscrow
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === 'all') return true;
    return o.status === selectedStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Escrow Trade & Shipment Tracking</h1>
          <p className="text-xs text-stone-500">
            Monitor real-time phytosanitary clearance, cold-chain logistics, and digital escrow deposits.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Escrow Protected Platform</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'escrow_paid', label: 'Escrow Locked' },
          { id: 'in_transit', label: 'In Transit' },
          { id: 'delivered', label: 'Delivered' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedStatus === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No orders found</h3>
            <p className="text-xs text-stone-500">There are no trade orders matching the selected status filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-6">
              
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <img src={order.cropImage} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-stone-900">{order.listingTitle}</span>
                      <Badge variant={order.status === 'delivered' ? 'emerald' : 'amber'}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500">
                      Order #{order.orderNumber} • Placed {order.orderDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-stone-400 font-medium">Escrow Total</span>
                    <p className="text-lg font-black text-emerald-800">{formatPrice(order.totalPriceUSD, currentCurrency)}</p>
                    <p className="text-[10px] text-stone-500">{order.quantityKg.toLocaleString()} kg @ {formatPrice(order.unitPriceUSD, currentCurrency)}/kg</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveInvoiceOrder(order)}
                    icon={<FileText className="w-3.5 h-3.5" />}
                  >
                    Invoice
                  </Button>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                <div>
                  <span className="text-stone-400 font-medium">Farmer / Supplier</span>
                  <p className="font-bold text-stone-900 mt-0.5">{order.farmerName}</p>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Buyer / Destination</span>
                  <p className="font-bold text-stone-900 mt-0.5">{order.deliveryAddress}</p>
                </div>
                <div>
                  <span className="text-stone-400 font-medium">Tracking Number</span>
                  <p className="font-bold text-emerald-800 mt-0.5 font-mono">{order.trackingNumber}</p>
                </div>
              </div>

              {/* Detailed Timeline Steps */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Shipment & Escrow Milestones</h4>
                <div className="space-y-3">
                  {order.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.completed ? 'bg-emerald-700 text-white font-bold' : 'bg-stone-200 text-stone-500'
                      }`}>
                        {item.completed ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${item.completed ? 'text-stone-900' : 'text-stone-400'}`}>{item.label}</span>
                          <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                        </div>
                        <p className="text-stone-500 text-[11px] mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow Release Button */}
              {order.status === 'in_transit' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-900">Shipment Arrived at Port?</h5>
                      <p className="text-[11px] text-emerald-700">Signing off will trigger instant escrow fund release to farmer.</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onReleaseEscrow && onReleaseEscrow(order.id)}
                    icon={<Lock className="w-4 h-4" />}
                  >
                    Release Escrow Payout (${order.totalPriceUSD.toLocaleString()})
                  </Button>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Digital Invoice Modal */}
      {activeInvoiceOrder && (
        <Modal isOpen={Boolean(activeInvoiceOrder)} onClose={() => setActiveInvoiceOrder(null)} title="Phytosanitary & Escrow Trade Invoice">
          <div className="space-y-6 text-xs text-stone-800">
            <div className="flex justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-display">AgriSphere Africa</h2>
                <p className="text-[10px] text-stone-500">Pan-African Agricultural Escrow Clearinghouse</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-900">{activeInvoiceOrder.orderNumber}</p>
                <p className="text-[10px] text-stone-500">Date: {activeInvoiceOrder.orderDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-stone-500 text-[10px] uppercase">Farmer Supplier:</span>
                <p className="font-semibold">{activeInvoiceOrder.farmerName}</p>
                <p className="text-stone-500">Kitale, Trans-Nzoia, Kenya</p>
              </div>
              <div>
                <span className="font-bold text-stone-500 text-[10px] uppercase">Buyer / Importer:</span>
                <p className="font-semibold">{activeInvoiceOrder.buyerName}</p>
                <p className="text-stone-500">{activeInvoiceOrder.deliveryAddress}</p>
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-[10px] uppercase text-stone-600 font-bold">
                  <tr>
                    <th className="p-2.5">Crop Commodity</th>
                    <th className="p-2.5">Quantity (kg)</th>
                    <th className="p-2.5">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="p-2.5 font-bold">{activeInvoiceOrder.listingTitle}</td>
                    <td className="p-2.5">{activeInvoiceOrder.quantityKg.toLocaleString()}</td>
                    <td className="p-2.5">${activeInvoiceOrder.unitPriceUSD}/kg</td>
                    <td className="p-2.5 text-right font-extrabold text-emerald-800">${activeInvoiceOrder.totalPriceUSD.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-900">
              <span className="font-bold">Escrow Payout Status:</span>
              <span className="font-extrabold">{activeInvoiceOrder.status === 'delivered' ? 'RELEASED TO FARMER' : 'LOCKED IN ESCROW'}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveInvoiceOrder(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
