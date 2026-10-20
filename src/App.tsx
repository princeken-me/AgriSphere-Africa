import React, { useState, useEffect } from 'react';
import { UserProfile, CropListing, Order, CurrencyCode, NotificationItem, Conversation, Message, CartItem, ProductReview, ProductFormData, UserRole } from './types';
import { MOCK_USER_FARMER, MOCK_USER_BUYER, INITIAL_USERS, MOCK_CROP_LISTINGS, MOCK_ORDERS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_MESSAGES, INITIAL_REVIEWS } from './data/mockData';
import { firestoreService } from './lib/firebase';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { CropAdvisoryModal } from './components/CropAdvisoryModal';
import { EscrowPayModal } from './components/EscrowPayModal';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { OrdersPage } from './pages/OrdersPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AIFarmingAssistantPage } from './pages/AIFarmingAssistantPage';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_USER_FARMER);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App Data State
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [listings, setListings] = useState<CropListing[]>(MOCK_CROP_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messagesState, setMessagesState] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(MOCK_CROP_LISTINGS[0]);

  // Buyer & Farmer Extensions: Favorites, Cart, Reviews & Modals
  const [favorites, setFavorites] = useState<string[]>(['crop_001', 'crop_003']);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      listing: MOCK_CROP_LISTINGS[0],
      quantityKg: 2000
    }
  ]);
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);

  // Modals & Drawers State
  const [isCropAdvisoryOpen, setIsCropAdvisoryOpen] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [escrowTargetListing, setEscrowTargetListing] = useState<CropListing | null>(null);
  const [escrowInitialQty, setEscrowInitialQty] = useState<number | undefined>(undefined);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<CropListing | null>(null);

  // Initialize Firestore seeding and real-time synchronization
  useEffect(() => {
    firestoreService.seedInitialDataIfNeeded();

    const unsubListings = firestoreService.subscribeToListings((data) => {
      if (data && data.length > 0) setListings(data);
    });
    const unsubOrders = firestoreService.subscribeToOrders((data) => {
      if (data && data.length > 0) setOrders(data);
    });
    const unsubUsers = firestoreService.subscribeToUsers((data) => {
      if (data && data.length > 0) setUsers(data);
    });
    const unsubNotifs = firestoreService.subscribeToNotifications((data) => {
      if (data && data.length > 0) setNotifications(data);
    });
    const unsubConvs = firestoreService.subscribeToConversations((data) => {
      if (data && data.length > 0) setConversations(data);
    });

    return () => {
      unsubListings();
      unsubOrders();
      unsubUsers();
      unsubNotifs();
      unsubConvs();
    };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Listing selection
  const handleSelectListing = (listing: CropListing) => {
    setSelectedListing(listing);
    setActivePage('product-details');
  };

  // Favorites
  const handleToggleFavorite = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  // Cart Handlers
  const handleAddToCart = (listing: CropListing, quantityKg: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.listing.id === listing.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantityKg += quantityKg;
        return updated;
      }
      return [...prev, { listing, quantityKg }];
    });
  };

  const handleUpdateCartQuantity = (listingId: string, quantityKg: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.listing.id === listingId ? { ...item, quantityKg } : item))
    );
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCartItems((prev) => prev.filter((item) => item.listing.id !== listingId));
  };

  const handleCheckoutCart = () => {
    if (cartItems.length === 0) return;

    const newOrders: Order[] = cartItems.map((item) => ({
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber: `AGRI-${Math.floor(100000 + Math.random() * 900000)}`,
      listingId: item.listing.id,
      listingTitle: item.listing.title,
      cropImage: item.listing.image,
      farmerId: item.listing.farmerId,
      farmerName: item.listing.farmerName,
      buyerId: currentUser ? currentUser.id : 'usr_buyer_002',
      buyerName: currentUser ? currentUser.fullName : 'Amara Diallo',
      quantityKg: item.quantityKg,
      unitPriceUSD: item.listing.pricePerKgUSD,
      totalPriceUSD: item.quantityKg * item.listing.pricePerKgUSD,
      status: 'escrow_paid',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: '2026-08-12',
      currency: currentCurrency,
      deliveryAddress: currentUser?.location || 'Mombasa Port Silo 4, Kenya',
      trackingNumber: `AG-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentEscrowProtected: true,
      timeline: [
        { status: 'escrow_paid', label: 'Escrow Funds Locked', timestamp: 'Just now', completed: true, note: 'Payment deposited into AgriSphere neutral escrow.' },
        { status: 'inspection', label: 'Quality & Moisture Inspection', timestamp: 'Pending', completed: false, note: 'KEPHIS inspector assigned for batch sampling.' },
        { status: 'loading', label: 'Dispatched to Transport', timestamp: 'Pending', completed: false, note: 'Awaiting container loading.' },
        { status: 'in_transit', label: 'In Transit to Destination Port', timestamp: 'Pending', completed: false, note: 'Logistics in motion.' },
        { status: 'delivered', label: 'Delivery & Escrow Release', timestamp: 'Pending', completed: false, note: 'Buyer sign-off triggers payout to farmer.' }
      ]
    }));

    newOrders.forEach(order => firestoreService.saveOrder(order));
    setOrders((prev) => [...newOrders, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setActivePage('orders');
  };

  // Escrow Direct Order Modal
  const handleOpenEscrowModal = (listing: CropListing, quantityKg?: number) => {
    setEscrowTargetListing(listing);
    setEscrowInitialQty(quantityKg);
    setIsEscrowModalOpen(true);
  };

  const handleConfirmOrder = (quantityKg: number, deliveryAddress: string) => {
    if (!escrowTargetListing) return;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `AGRI-${Math.floor(100000 + Math.random() * 900000)}`,
      listingId: escrowTargetListing.id,
      listingTitle: escrowTargetListing.title,
      cropImage: escrowTargetListing.image,
      farmerId: escrowTargetListing.farmerId,
      farmerName: escrowTargetListing.farmerName,
      buyerId: currentUser ? currentUser.id : 'usr_buyer_002',
      buyerName: currentUser ? currentUser.fullName : 'Amara Diallo',
      quantityKg,
      unitPriceUSD: escrowTargetListing.pricePerKgUSD,
      totalPriceUSD: quantityKg * escrowTargetListing.pricePerKgUSD,
      status: 'escrow_paid',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: '2026-08-10',
      currency: currentCurrency,
      deliveryAddress,
      trackingNumber: `AG-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentEscrowProtected: true,
      timeline: [
        { status: 'escrow_paid', label: 'Escrow Funds Locked', timestamp: 'Just now', completed: true, note: 'Payment verified and deposited into neutral escrow account.' },
        { status: 'inspection', label: 'Quality & Phytosanitary Clearance', timestamp: 'Pending', completed: false, note: 'KEPHIS inspector assigned for sampling.' },
        { status: 'loading', label: 'Dispatched to Transport', timestamp: 'Pending', completed: false, note: 'Awaiting truck loading.' },
        { status: 'in_transit', label: 'Border / Transit Port', timestamp: 'Pending', completed: false, note: 'Logistics in motion.' },
        { status: 'delivered', label: 'Delivery & Escrow Release', timestamp: 'Pending', completed: false, note: 'Buyer sign-off triggers payout.' }
      ]
    };

    firestoreService.saveOrder(newOrder);
    setOrders([newOrder, ...orders]);
    setActivePage('orders');
  };

  // Product CRUD Modal Handlers (Farmer)
  const handleOpenAddProductModal = () => {
    setEditingListing(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (listing: CropListing) => {
    setEditingListing(listing);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    if (formData.id) {
      // Edit existing
      const existingListing = listings.find(l => l.id === formData.id);
      const updatedListing: CropListing = {
        ...(existingListing || {}),
        id: formData.id,
        title: formData.title,
        cropCategory: formData.cropCategory,
        cropName: formData.cropName,
        pricePerKgUSD: formData.pricePerKgUSD,
        quantityAvailableKg: formData.quantityAvailableKg,
        minOrderKg: formData.minOrderKg,
        harvestDate: formData.harvestDate,
        farmerLocation: formData.farmerLocation,
        country: formData.country,
        moistureContent: formData.moistureContent,
        grade: formData.grade,
        organic: formData.organic,
        description: formData.description,
        image: formData.image,
        gallery: formData.gallery.length ? formData.gallery : [formData.image],
        certs: formData.certs.length ? formData.certs : (existingListing?.certs || ['AgriSphere Verified']),
        farmerId: existingListing?.farmerId || (currentUser ? currentUser.id : 'usr_farmer_001'),
        farmerName: existingListing?.farmerName || (currentUser ? currentUser.fullName : 'Kwame Owusu'),
        rating: existingListing?.rating || 5.0,
        reviewsCount: existingListing?.reviewsCount || 1,
        featured: existingListing?.featured ?? true
      };

      firestoreService.saveListing(updatedListing);
      setListings((prev) =>
        prev.map((l) => (l.id === formData.id ? updatedListing : l))
      );
      if (selectedListing && selectedListing.id === formData.id) {
        setSelectedListing(updatedListing);
      }
    } else {
      // Create new
      const newListing: CropListing = {
        id: `crop_${Date.now()}`,
        title: formData.title,
        farmerId: currentUser ? currentUser.id : 'usr_farmer_001',
        farmerName: currentUser ? currentUser.fullName : 'Kwame Owusu',
        farmerLocation: formData.farmerLocation,
        country: formData.country,
        cropCategory: formData.cropCategory,
        cropName: formData.cropName,
        pricePerKgUSD: formData.pricePerKgUSD,
        quantityAvailableKg: formData.quantityAvailableKg,
        minOrderKg: formData.minOrderKg,
        harvestDate: formData.harvestDate,
        locationCoords: { lat: 1.0157, lng: 35.0062 },
        certs: formData.certs.length ? formData.certs : ['Phytosanitary Certified', 'AgriSphere Inspected'],
        image: formData.image,
        gallery: formData.gallery.length ? formData.gallery : [formData.image],
        organic: formData.organic,
        moistureContent: formData.moistureContent,
        grade: formData.grade,
        description: formData.description,
        rating: 5.0,
        reviewsCount: 1,
        featured: true
      };
      firestoreService.saveListing(newListing);
      setListings([newListing, ...listings]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteListing = (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this crop harvest listing?')) {
      firestoreService.deleteListing(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      if (selectedListing && selectedListing.id === listingId) {
        setActivePage('marketplace');
      }
    }
  };

  // Review Handlers
  const handleAddReview = (listingId: string, rating: number, comment: string) => {
    const newRev: ProductReview = {
      id: `rev_${Date.now()}`,
      listingId,
      reviewerId: currentUser ? currentUser.id : 'usr_anon',
      reviewerName: currentUser ? currentUser.fullName : 'Verified Wholesale Buyer',
      reviewerRole: currentUser ? currentUser.role : 'buyer',
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update listing rating and reviewsCount
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const listingReviews = [...reviews.filter((r) => r.listingId === listingId), newRev];
          const avgRating = Number((listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length).toFixed(1));
          const updated = { ...l, rating: avgRating, reviewsCount: listingReviews.length };
          firestoreService.saveListing(updated);
          if (selectedListing && selectedListing.id === listingId) {
            setSelectedListing(updated);
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Messages
  const handleSendMessage = (conversationId: string, text: string, offerDetails?: any) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser ? currentUser.id : 'usr_farmer_001',
      senderName: currentUser ? currentUser.fullName : 'Kwame Owusu',
      receiverId: 'usr_partner',
      receiverName: 'Trade Partner',
      text,
      timestamp: 'Just now',
      isRead: true,
      offerDetails
    };

    firestoreService.saveMessage(newMsg);

    setMessagesState((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: text, lastTimestamp: 'Just now' } : c))
    );
  };

  const handleRespondOffer = (conversationId: string, messageId: string, status: 'accepted' | 'declined') => {
    setMessagesState((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) => {
        if (m.id === messageId && m.offerDetails) {
          return {
            ...m,
            offerDetails: { ...m.offerDetails, status }
          };
        }
        return m;
      })
    }));
  };

  const handleReleaseEscrow = (orderId: string) => {
    firestoreService.updateOrder(orderId, { status: 'delivered' });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'delivered' } : o))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'buyer') {
      setCurrentUser(MOCK_USER_BUYER);
    } else {
      setCurrentUser(MOCK_USER_FARMER);
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = 2; // Active unread mock messages

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        onRoleSwitch={handleSwitchRole}
        unreadNotifsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenAIAgronomist={() => setIsCropAdvisoryOpen(true)}
        onSignOut={() => {
          setCurrentUser(null);
          setActivePage('landing');
        }}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Sidebar Navigation for Interior Application Views */}
        {activePage !== 'landing' && activePage !== 'login' && activePage !== 'register' && currentUser && (
          <Sidebar
            userRole={currentUser.role}
            activePage={activePage}
            onNavigate={setActivePage}
            onOpenAIAgronomist={() => setIsCropAdvisoryOpen(true)}
          />
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0">
          {activePage === 'landing' && (
            <LandingPage
              listings={listings}
              currentCurrency={currentCurrency}
              onNavigate={setActivePage}
              onSelectListing={handleSelectListing}
              onOpenAIAgronomist={() => setIsCropAdvisoryOpen(true)}
            />
          )}

          {activePage === 'login' && (
            <LoginPage
              onNavigate={setActivePage}
              onLoginSuccess={() => {
                if (currentUser?.role === 'buyer') setActivePage('buyer-dashboard');
                else setActivePage('farmer-dashboard');
              }}
            />
          )}

          {activePage === 'register' && (
            <RegisterPage
              onNavigate={setActivePage}
              onRegisterSuccess={() => setActivePage('farmer-dashboard')}
            />
          )}

          {activePage === 'farmer-dashboard' && currentUser && (
            <FarmerDashboardPage
              currentUser={currentUser}
              listings={listings}
              orders={orders}
              currentCurrency={currentCurrency}
              onNavigate={setActivePage}
              onOpenAIAgronomist={() => setIsCropAdvisoryOpen(true)}
              onOpenAddProductModal={handleOpenAddProductModal}
              onEditListing={handleOpenEditProductModal}
              onDeleteListing={handleDeleteListing}
            />
          )}

          {activePage === 'buyer-dashboard' && currentUser && (
            <BuyerDashboardPage
              currentUser={currentUser}
              orders={orders}
              listings={listings}
              currentCurrency={currentCurrency}
              onNavigate={setActivePage}
              onSelectListing={handleSelectListing}
            />
          )}

          {activePage === 'marketplace' && (
            <MarketplacePage
              listings={listings}
              currentCurrency={currentCurrency}
              onSelectListing={handleSelectListing}
              onOpenAIAgronomist={() => setIsCropAdvisoryOpen(true)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              currentUser={currentUser}
              onOpenAddProductModal={handleOpenAddProductModal}
            />
          )}

          {activePage === 'product-details' && selectedListing && (
            <ProductDetailsPage
              listing={selectedListing}
              currentCurrency={currentCurrency}
              onBack={() => setActivePage('marketplace')}
              onContactFarmer={(l) => setActivePage('messages')}
              onOpenEscrowModal={handleOpenEscrowModal}
              onAddToCart={handleAddToCart}
              isFavorite={favorites.includes(selectedListing.id)}
              onToggleFavorite={handleToggleFavorite}
              reviews={reviews.filter((r) => r.listingId === selectedListing.id)}
              onAddReview={handleAddReview}
              currentUser={currentUser}
              onEditListing={handleOpenEditProductModal}
              onDeleteListing={handleDeleteListing}
            />
          )}

          {activePage === 'orders' && currentUser && (
            <OrdersPage
              currentUser={currentUser}
              orders={orders}
              currentCurrency={currentCurrency}
              onReleaseEscrow={handleReleaseEscrow}
            />
          )}

          {activePage === 'messages' && currentUser && (
            <MessagesPage
              currentUser={currentUser}
              conversations={conversations}
              messagesState={messagesState}
              currentCurrency={currentCurrency}
              onSendMessage={handleSendMessage}
              onRespondOffer={handleRespondOffer}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllRead}
              onClearNotifications={handleClearNotifications}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'ai-assistant' && (
            <AIFarmingAssistantPage
              currentUser={currentUser}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'profile' && currentUser && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              currentCurrency={currentCurrency}
              onChangeCurrency={setCurrentCurrency}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CropAdvisoryModal
        isOpen={isCropAdvisoryOpen}
        onClose={() => setIsCropAdvisoryOpen(false)}
      />

      <EscrowPayModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
        listing={escrowTargetListing}
        currentCurrency={currentCurrency}
        onConfirmOrder={handleConfirmOrder}
        initialQuantityKg={escrowInitialQty}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSaveProduct={handleSaveProduct}
        editingListing={editingListing}
        currentUser={currentUser}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutCart}
        currentCurrency={currentCurrency}
      />

      {/* Footer */}
      <Footer onNavigate={setActivePage} />

    </div>
  );
}
