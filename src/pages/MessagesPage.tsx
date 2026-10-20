import React, { useState } from 'react';
import { Send, CheckCircle2, XCircle, ShieldCheck, DollarSign, MessageSquare, User, Sparkles } from 'lucide-react';
import { Conversation, Message, UserProfile, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

interface MessagesPageProps {
  currentUser: UserProfile;
  conversations: Conversation[];
  messagesState: Record<string, Message[]>;
  currentCurrency: CurrencyCode;
  onSendMessage: (conversationId: string, text: string, offerDetails?: any) => void;
  onRespondOffer?: (conversationId: string, messageId: string, status: 'accepted' | 'declined') => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  conversations,
  messagesState,
  currentCurrency,
  onSendMessage,
  onRespondOffer
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'conv_01');
  const [inputText, setInputText] = useState('');
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [offerPrice, setOfferPrice] = useState(0.36);
  const [offerQty, setOfferQty] = useState(5000);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeMessages = messagesState[activeConvId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !isOfferMode) return;

    if (isOfferMode) {
      onSendMessage(activeConvId, inputText || `Formal Offer: $${offerPrice}/kg for ${offerQty.toLocaleString()} kg`, {
        listingId: 'crop_001',
        offeredPriceUSD: Number(offerPrice),
        offeredQuantityKg: Number(offerQty),
        status: 'pending'
      });
      setIsOfferMode(false);
    } else {
      onSendMessage(activeConvId, inputText);
    }

    setInputText('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Trade Negotiations & Messaging</h1>
          <p className="text-xs text-stone-500">Direct buyer-to-farmer communication with encrypted bid offer locks.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>AgriSphere Negotiator</span>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* Left Sidebar Conversations List */}
        <div className="lg:col-span-4 border-r border-stone-200/80 p-4 space-y-3 bg-stone-50/50">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-2">Active Conversations</h3>
          <div className="space-y-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
                    isActive
                      ? 'bg-white shadow-xs border border-stone-200/80 ring-2 ring-emerald-700/10'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <img src={conv.partnerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{conv.partnerName}</h4>
                      <span className="text-[10px] text-stone-400">{conv.lastTimestamp}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Thread */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {/* Partner Chat Top Bar */}
          {activeConv && (
            <div className="p-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/30">
              <div className="flex items-center gap-3">
                <img src={activeConv.partnerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{activeConv.partnerName}</h3>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md capitalize">
                    Verified {activeConv.partnerRole}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOfferMode(!isOfferMode)}
                className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-amber-700" />
                {isOfferMode ? 'Cancel Offer' : 'Send Trade Offer'}
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[440px] flex-1 bg-stone-50/20">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id || msg.senderName === currentUser.fullName;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-stone-400">
                    <span className="font-semibold text-stone-700">{msg.senderName}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-800 text-white rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Trade Offer card if present */}
                    {msg.offerDetails && (
                      <div className="mt-3 p-3 bg-stone-900 text-white rounded-xl space-y-2 border border-stone-800">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-amber-300 uppercase">Formal Price Offer</span>
                          <span className="bg-stone-800 px-2 py-0.5 rounded text-stone-300 capitalize">{msg.offerDetails.status}</span>
                        </div>
                        <p className="text-xs font-semibold">
                          Offered Rate: <strong className="text-emerald-400">${msg.offerDetails.offeredPriceUSD}/kg</strong> for {msg.offerDetails.offeredQuantityKg.toLocaleString()} kg
                        </p>
                        
                        {msg.offerDetails.status === 'pending' && !isMe && (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => onRespondOffer && onRespondOffer(activeConvId, msg.id, 'accepted')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                            >
                              Accept Offer
                            </button>
                            <button
                              onClick={() => onRespondOffer && onRespondOffer(activeConvId, msg.id, 'declined')}
                              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-lg text-[10px]"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Offer Input Mode Drawer */}
          {isOfferMode && (
            <div className="p-4 bg-amber-50 border-t border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" /> Negotiate Custom Price & Quantity
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700">Offered Price / kg (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700">Quantity (kg)</label>
                  <input
                    type="number"
                    step="100"
                    value={offerQty}
                    onChange={(e) => setOfferQty(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-bold text-stone-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-stone-200/80 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isOfferMode ? "Add a note with your price offer..." : "Type your message or inquiry..."}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
            <Button variant="primary" size="md" type="submit" icon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </form>

        </div>
      </div>

    </div>
  );
};
