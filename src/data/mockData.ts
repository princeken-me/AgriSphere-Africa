import { CropListing, Order, Conversation, Message, NotificationItem, WeatherForecast, MarketPriceIndex, FarmPlot, UserProfile, ProductCategory, ProductReview } from '../types';

export const INITIAL_CROP_LISTINGS: CropListing[] = [
  {
    id: 'crop_001',
    title: 'Grade-A White Maize (Harvest 2026)',
    farmerId: 'usr_farmer_001',
    farmerName: 'Kwame Owusu',
    farmerLocation: 'Kitale, Trans-Nzoia',
    country: 'Kenya',
    cropCategory: 'Grains & Cereals',
    cropName: 'Maize',
    pricePerKgUSD: 0.38,
    quantityAvailableKg: 25000,
    minOrderKg: 1000,
    harvestDate: '2026-06-15',
    locationCoords: { lat: 1.0157, lng: 35.0062 },
    certs: ['Certified Disease-Free', 'KEPHIS Inspected', 'Moisture <13%'],
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80'
    ],
    organic: false,
    moistureContent: '12.4%',
    grade: 'Grade A',
    description: 'Freshly harvested sun-dried non-GMO yellow maize grown under sustainable soil management in Kenya’s prime grain belt. Excellent for milling, flour production, and animal feed.',
    rating: 4.9,
    reviewsCount: 38,
    featured: true
  },
  {
    id: 'crop_002',
    title: 'Organic Sun-Dried Ashanti Cocoa Beans',
    farmerId: 'usr_farmer_002',
    farmerName: 'Kofi Mensah Cooperative',
    farmerLocation: 'Kumasi, Ashanti Region',
    country: 'Ghana',
    cropCategory: 'Cash Crops',
    cropName: 'Cocoa',
    pricePerKgUSD: 3.85,
    quantityAvailableKg: 14000,
    minOrderKg: 500,
    harvestDate: '2026-05-20',
    locationCoords: { lat: 6.6885, lng: -1.6244 },
    certs: ['FairTrade Certified', 'Rainforest Alliance', 'Ghana COCOBOD Verified'],
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80'
    ],
    organic: true,
    moistureContent: '7.1%',
    grade: 'Export Quality',
    description: 'Premium organic single-origin cocoa beans fermented and solar-dried according to artisanal Ghanaian standards. High fat content, deep chocolate notes.',
    rating: 5.0,
    reviewsCount: 64,
    featured: true
  },
  {
    id: 'crop_003',
    title: 'White Teff Grain Superfood (Gluten-Free)',
    farmerId: 'usr_farmer_003',
    farmerName: 'Abebe Tadesse',
    farmerLocation: 'Debre Zeit, Oromia',
    country: 'Ethiopia',
    cropCategory: 'Grains & Cereals',
    cropName: 'Teff',
    pricePerKgUSD: 1.45,
    quantityAvailableKg: 18000,
    minOrderKg: 500,
    harvestDate: '2026-04-10',
    locationCoords: { lat: 8.75, lng: 38.9833 },
    certs: ['Gluten-Free Certified', 'Phytosanitary Approved'],
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    organic: true,
    moistureContent: '10.2%',
    grade: 'Grade A',
    description: 'Authentic Ethiopian Magna Teff. Packed with iron, protein, and calcium. Ideal for artisan bakeries, Injera production, and export superfood markets.',
    rating: 4.8,
    reviewsCount: 29,
    featured: true
  },
  {
    id: 'crop_004',
    title: 'High-Yield Cassava Roots (TME 419 Variety)',
    farmerId: 'usr_farmer_004',
    farmerName: 'Chidi Okonkwo Farms',
    farmerLocation: 'Oyo State',
    country: 'Nigeria',
    cropCategory: 'Roots & Tubers',
    cropName: 'Cassava',
    pricePerKgUSD: 0.18,
    quantityAvailableKg: 45000,
    minOrderKg: 2000,
    harvestDate: '2026-07-01',
    locationCoords: { lat: 7.843, lng: 3.9368 },
    certs: ['IITA Seed Certified', 'High Starch Yield'],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    organic: false,
    moistureContent: '62.0%',
    grade: 'Standard',
    description: 'Fresh cassava tubers ready for starch processing, Garri manufacturing, or industrial ethanol production. Harvested on buyer demand.',
    rating: 4.7,
    reviewsCount: 19,
    featured: false
  },
  {
    id: 'crop_005',
    title: 'Export Grade Hass Avocados',
    farmerId: 'usr_farmer_001',
    farmerName: 'Kwame Owusu',
    farmerLocation: 'Murang\'a County',
    country: 'Kenya',
    cropCategory: 'Fruits & Vegetables',
    cropName: 'Avocado',
    pricePerKgUSD: 1.95,
    quantityAvailableKg: 12000,
    minOrderKg: 400,
    harvestDate: '2026-07-10',
    locationCoords: { lat: -0.7167, lng: 37.15 },
    certs: ['GlobalGAP Certified', 'SMETA Audited', 'Cold-Chain Ready'],
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'
    ],
    organic: true,
    moistureContent: 'N/A (Dry Matter >23%)',
    grade: 'Export Quality',
    description: 'Creamy high-oil content Hass avocados grown in the rich volcanic foothills of Mt. Kenya. Sized 16-22 for European and Gulf sea freight export.',
    rating: 4.95,
    reviewsCount: 82,
    featured: true
  },
  {
    id: 'crop_006',
    title: 'Washed Arabica Coffee Beans (AA Grade)',
    farmerId: 'usr_farmer_006',
    farmerName: 'Kivu Highland Growers',
    farmerLocation: 'Gisenyi, Lake Kivu',
    country: 'Rwanda',
    cropCategory: 'Cash Crops',
    cropName: 'Coffee',
    pricePerKgUSD: 4.50,
    quantityAvailableKg: 8500,
    minOrderKg: 300,
    harvestDate: '2026-05-30',
    locationCoords: { lat: -1.7028, lng: 29.2564 },
    certs: ['Cup score 87.5', 'Single Origin Specialty', 'FairTrade'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    organic: true,
    moistureContent: '10.8%',
    grade: 'Export Quality',
    description: 'High altitude Bourbon specialty coffee beans with bright citrus acidity, jasmine florals, and black tea body. Hand-picked at 1,800m elevation.',
    rating: 4.98,
    reviewsCount: 45,
    featured: true
  },
  {
    id: 'crop_007',
    title: 'Raw Raw Nut Macadamia in Shell',
    farmerId: 'usr_farmer_007',
    farmerName: 'Limpopo Valley Agribusiness',
    farmerLocation: 'Tzaneen, Limpopo',
    country: 'South Africa',
    cropCategory: 'Nuts & Seeds',
    cropName: 'Macadamia',
    pricePerKgUSD: 3.20,
    quantityAvailableKg: 30000,
    minOrderKg: 1000,
    harvestDate: '2026-06-01',
    locationCoords: { lat: -23.8333, lng: 30.1667 },
    certs: ['ISO 22000', 'HACCP Certified'],
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c03d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599599810694-b5b37304c03d?auto=format&fit=crop&w=800&q=80'
    ],
    organic: false,
    moistureContent: '9.5%',
    grade: 'Grade A',
    description: 'Style 1 kernel recovery premium Macadamia nuts in shell. Machine sorted, lab tested, ready for cracking and confectionery processing.',
    rating: 4.85,
    reviewsCount: 31,
    featured: false
  },
  {
    id: 'crop_008',
    title: 'Sweet Red Birdseye Chilis (Dried)',
    farmerId: 'usr_farmer_008',
    farmerName: 'Kilimo Bora Women Co-op',
    farmerLocation: 'Morogoro',
    country: 'Tanzania',
    cropCategory: 'Fruits & Vegetables',
    cropName: 'Chili Peppers',
    pricePerKgUSD: 2.75,
    quantityAvailableKg: 6000,
    minOrderKg: 200,
    harvestDate: '2026-06-25',
    locationCoords: { lat: -6.8219, lng: 37.6612 },
    certs: ['Zero Pesticide Residue', 'Aflatoxin Tested'],
    image: 'https://images.unsplash.com/photo-1588877507490-449e0839e1e7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588877507490-449e0839e1e7?auto=format&fit=crop&w=800&q=80'
    ],
    organic: true,
    moistureContent: '8.0%',
    grade: 'Grade A',
    description: 'Sun-dried intense red African Birdseye chilis. SHU rating 100,000+. Ideal for hot sauce extraction, spices, and oleoresin production.',
    rating: 4.9,
    reviewsCount: 17,
    featured: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'AGRI-2026-8812',
    buyerId: 'usr_google_009',
    buyerName: 'Amara Diallo (GoldCoast Agribusiness)',
    farmerId: 'usr_farmer_001',
    farmerName: 'Kwame Owusu',
    listingId: 'crop_001',
    listingTitle: 'Grade-A White Maize (Harvest 2026)',
    cropImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    quantityKg: 5000,
    unitPriceUSD: 0.38,
    totalPriceUSD: 1900.00,
    currency: 'USD',
    status: 'in_transit',
    orderDate: '2026-07-20',
    estimatedDelivery: '2026-07-31',
    deliveryAddress: 'Plot 14, Industrial Area Port, Mombasa, Kenya',
    trackingNumber: 'AGR-LOG-KE-9921',
    paymentEscrowProtected: true,
    timeline: [
      { status: 'pending', label: 'Order Created', timestamp: '2026-07-20 09:15', note: 'Buyer initialized 5,000kg maize purchase', completed: true },
      { status: 'escrow_paid', label: 'Escrow Locked', timestamp: '2026-07-20 10:00', note: 'Payment of $1,900.00 secured in AgriSphere Escrow', completed: true },
      { status: 'harvesting', label: 'Baging & Lab Test', timestamp: '2026-07-22 14:30', note: 'Moisture content verified at 12.2%. Bagged in 50kg sacks.', completed: true },
      { status: 'in_transit', label: 'Dispatched in Transit', timestamp: '2026-07-25 08:00', note: 'Loaded on Solar-Cooled Truck #KE-442-Z bound for Mombasa Port', completed: true },
      { status: 'delivered', label: 'Final Delivery & Release', timestamp: 'Estimated Jul 31', note: 'Escrow funds will auto-release to farmer upon digital signature', completed: false }
    ]
  },
  {
    id: 'ord_1002',
    orderNumber: 'AGRI-2026-9043',
    buyerId: 'usr_google_009',
    buyerName: 'Amara Diallo (GoldCoast Agribusiness)',
    farmerId: 'usr_farmer_002',
    farmerName: 'Kofi Mensah Cooperative',
    listingId: 'crop_002',
    listingTitle: 'Organic Sun-Dried Ashanti Cocoa Beans',
    cropImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    quantityKg: 2000,
    unitPriceUSD: 3.85,
    totalPriceUSD: 7700.00,
    currency: 'USD',
    status: 'escrow_paid',
    orderDate: '2026-07-27',
    estimatedDelivery: '2026-08-05',
    deliveryAddress: 'Tema Harbor Freight Terminal, Accra, Ghana',
    trackingNumber: 'AGR-LOG-GH-1104',
    paymentEscrowProtected: true,
    timeline: [
      { status: 'pending', label: 'Order Created', timestamp: '2026-07-27 11:20', note: 'Bulk cocoa request approved', completed: true },
      { status: 'escrow_paid', label: 'Escrow Locked', timestamp: '2026-07-27 11:45', note: '$7,700 escrow deposit confirmed', completed: true },
      { status: 'harvesting', label: 'Quality Verification', timestamp: 'In progress', note: 'COCOBOD inspector sample collection', completed: false },
      { status: 'in_transit', label: 'Transit', timestamp: 'Pending', note: 'Awaiting container loading', completed: false },
      { status: 'delivered', label: 'Delivery', timestamp: 'Pending', note: 'Port sign-off', completed: false }
    ]
  },
  {
    id: 'ord_1003',
    orderNumber: 'AGRI-2026-7210',
    buyerId: 'usr_google_009',
    buyerName: 'Amara Diallo',
    farmerId: 'usr_farmer_005',
    farmerName: 'Kwame Owusu',
    listingId: 'crop_005',
    listingTitle: 'Export Grade Hass Avocados',
    cropImage: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    quantityKg: 1000,
    unitPriceUSD: 1.95,
    totalPriceUSD: 1950.00,
    currency: 'USD',
    status: 'delivered',
    orderDate: '2026-06-10',
    estimatedDelivery: '2026-06-18',
    deliveryAddress: 'Nairobi Packhouse #4, JKIA Cargo Terminal',
    trackingNumber: 'AGR-LOG-KE-4081',
    paymentEscrowProtected: true,
    timeline: [
      { status: 'pending', label: 'Order Created', timestamp: '2026-06-10', note: 'Completed', completed: true },
      { status: 'escrow_paid', label: 'Escrow Paid', timestamp: '2026-06-10', note: 'Completed', completed: true },
      { status: 'harvesting', label: 'Harvested', timestamp: '2026-06-12', note: 'Completed', completed: true },
      { status: 'in_transit', label: 'In Transit', timestamp: '2026-06-14', note: 'Completed', completed: true },
      { status: 'delivered', label: 'Delivered & Paid', timestamp: '2026-06-18', note: 'Funds $1,950 released to Kwame Owusu', completed: true }
    ]
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_01',
    partnerId: 'usr_google_009',
    partnerName: 'Amara Diallo (Buyer)',
    partnerRole: 'buyer',
    partnerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'Is the 5,000kg white maize moisture content certified below 13%?',
    lastTimestamp: '10:42 AM',
    unreadCount: 1
  },
  {
    id: 'conv_02',
    partnerId: 'usr_farmer_002',
    partnerName: 'Kofi Mensah (Ghana Cocoa Co-op)',
    partnerRole: 'farmer',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    lastMessage: 'We have attached the latest COCOBOD grade 1 certificate for your review.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_01: [
    {
      id: 'm1',
      conversationId: 'conv_01',
      senderId: 'usr_google_009',
      senderName: 'Amara Diallo',
      receiverId: 'usr_farmer_001',
      receiverName: 'Kwame Owusu',
      text: 'Hello Kwame, I am interested in placing an escrow order for your Trans-Nzoia white maize harvest.',
      timestamp: '10:30 AM',
      isRead: true
    },
    {
      id: 'm2',
      conversationId: 'conv_01',
      senderId: 'usr_farmer_001',
      senderName: 'Kwame Owusu',
      receiverId: 'usr_google_009',
      receiverName: 'Amara Diallo',
      text: 'Jambo Amara! Yes, the harvest is ready in 50kg UV-stabilized bags. We can fulfill up to 25 metric tons.',
      timestamp: '10:35 AM',
      isRead: true
    },
    {
      id: 'm3',
      conversationId: 'conv_01',
      senderId: 'usr_google_009',
      senderName: 'Amara Diallo',
      receiverId: 'usr_farmer_001',
      receiverName: 'Kwame Owusu',
      text: 'Is the 5,000kg white maize moisture content certified below 13%?',
      timestamp: '10:42 AM',
      isRead: false,
      offerDetails: {
        listingId: 'crop_001',
        offeredPriceUSD: 0.38,
        offeredQuantityKg: 5000,
        status: 'pending'
      }
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'weather',
    title: 'Extreme Weather Warning - Trans-Nzoia',
    description: 'Heavy rainfall forecasted in Kitale over next 48 hours. Ensure harvested grain bags are covered in dry storage.',
    timestamp: '25 mins ago',
    read: false
  },
  {
    id: 'notif_2',
    type: 'order',
    title: 'Escrow Payment Secured ($1,900.00)',
    description: 'Order AGRI-2026-8812 payment has been placed into Escrow. You may now dispatch delivery truck.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/orders'
  },
  {
    id: 'notif_3',
    type: 'market',
    title: 'Maize Market Price Surge (+6.4%)',
    description: 'Regional demand in Kenya & Uganda drove white maize prices to $0.38/kg.',
    timestamp: '5 hours ago',
    read: true
  }
];

export const MARKET_PRICE_INDICES: MarketPriceIndex[] = [
  {
    id: 'idx_1',
    commodity: 'White Maize',
    country: 'Kenya',
    currentPriceUSD: 0.38,
    priceChange24h: 6.4,
    unit: 'USD/kg',
    history: [
      { date: 'Mon', price: 0.34 },
      { date: 'Tue', price: 0.35 },
      { date: 'Wed', price: 0.35 },
      { date: 'Thu', price: 0.36 },
      { date: 'Fri', price: 0.37 },
      { date: 'Sat', price: 0.37 },
      { date: 'Sun', price: 0.38 }
    ]
  },
  {
    id: 'idx_2',
    commodity: 'Ashanti Cocoa',
    country: 'Ghana',
    currentPriceUSD: 3.85,
    priceChange24h: 3.2,
    unit: 'USD/kg',
    history: [
      { date: 'Mon', price: 3.70 },
      { date: 'Tue', price: 3.72 },
      { date: 'Wed', price: 3.75 },
      { date: 'Thu', price: 3.78 },
      { date: 'Fri', price: 3.80 },
      { date: 'Sat', price: 3.82 },
      { date: 'Sun', price: 3.85 }
    ]
  },
  {
    id: 'idx_3',
    commodity: 'Magna Teff',
    country: 'Ethiopia',
    currentPriceUSD: 1.45,
    priceChange24h: -0.8,
    unit: 'USD/kg',
    history: [
      { date: 'Mon', price: 1.48 },
      { date: 'Tue', price: 1.47 },
      { date: 'Wed', price: 1.46 },
      { date: 'Thu', price: 1.46 },
      { date: 'Fri', price: 1.45 },
      { date: 'Sat', price: 1.45 },
      { date: 'Sun', price: 1.45 }
    ]
  },
  {
    id: 'idx_4',
    commodity: 'Hass Avocado',
    country: 'Kenya',
    currentPriceUSD: 1.95,
    priceChange24h: 4.1,
    unit: 'USD/kg',
    history: [
      { date: 'Mon', price: 1.82 },
      { date: 'Tue', price: 1.85 },
      { date: 'Wed', price: 1.88 },
      { date: 'Thu', price: 1.90 },
      { date: 'Fri', price: 1.92 },
      { date: 'Sat', price: 1.94 },
      { date: 'Sun', price: 1.95 }
    ]
  }
];

export const WEATHER_FORECAST: WeatherForecast[] = [
  { day: 'Today', tempMax: 27, tempMin: 16, condition: 'Partly Cloudy', precipitationChance: 20, humidity: 65, windSpeedKmH: 14 },
  { day: 'Thu', tempMax: 25, tempMin: 15, condition: 'Heavy Rain', precipitationChance: 85, humidity: 82, windSpeedKmH: 22 },
  { day: 'Fri', tempMax: 26, tempMin: 16, condition: 'Scattered Showers', precipitationChance: 45, humidity: 70, windSpeedKmH: 16 },
  { day: 'Sat', tempMax: 28, tempMin: 17, condition: 'Sunny', precipitationChance: 10, humidity: 55, windSpeedKmH: 12 },
  { day: 'Sun', tempMax: 29, tempMin: 18, condition: 'Sunny', precipitationChance: 5, humidity: 50, windSpeedKmH: 10 }
];

export const MOCK_USER_FARMER: UserProfile = {
  id: 'usr_farmer_001',
  fullName: 'Kwame Owusu',
  email: 'kwame.owusu@agrisphere.africa',
  role: 'farmer',
  country: 'Kenya',
  phone: '+254 712 345 678',
  farmName: 'Trans-Nzoia Green Valley Farm',
  location: 'Kitale, Trans-Nzoia',
  bio: 'Specialist smallholder farmer producing Grade-A sun-dried white maize, leguminous beans, and certified seeds under sustainable eco-friendly practices.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  joinedDate: '2024-03-12'
};

export const FARM_PLOTS: FarmPlot[] = [
  { id: 'plot_1', name: 'North Field A (Maize)', crop: 'White Maize', areaHectares: 12.5, healthScore: 92, soilMoisture: 42, soilpH: 6.5, lat: 1.0157, lng: 35.0062, lastInspected: '2026-07-28' },
  { id: 'plot_2', name: 'Hillside Orchard (Hass Avocado)', crop: 'Avocado', areaHectares: 8.0, healthScore: 96, soilMoisture: 38, soilpH: 6.8, lat: -0.7167, lng: 37.1500, lastInspected: '2026-07-27' },
  { id: 'plot_3', name: 'River Basin B (Beans)', crop: 'Cowpeas', areaHectares: 5.2, healthScore: 84, soilMoisture: 58, soilpH: 6.2, lat: 1.0200, lng: 35.0120, lastInspected: '2026-07-25' }
];

export const MOCK_USER_BUYER: UserProfile = {
  id: 'usr_buyer_002',
  fullName: 'Amara Diallo',
  email: 'amara.diallo@goldcoastagri.com',
  role: 'buyer',
  country: 'Ghana',
  phone: '+233 24 123 4567',
  companyName: 'GoldCoast Agribusiness Exports',
  location: 'Accra Port Terminal',
  bio: 'Wholesale agricultural export manager procuring grains, cocoa, avocados, and cashews for international distribution.',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  joinedDate: '2024-01-15'
};

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat_1', name: 'Grains & Cereals', slug: 'grains-cereals', iconName: 'Wheat', description: 'White Maize, Wheat, Sorghum, Millet, Teff & Rice', count: 142 },
  { id: 'cat_2', name: 'Pulses & Legumes', slug: 'pulses-legumes', iconName: 'Bean', description: 'Yellow Beans, Cowpeas, Soybeans & Groundnuts', count: 86 },
  { id: 'cat_3', name: 'Cash Crops', slug: 'cash-crops', iconName: 'Coffee', description: 'Organic Cocoa Beans, Arabica Coffee, Tea & Sesame', count: 64 },
  { id: 'cat_4', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', iconName: 'Apple', description: 'Hass Avocados, Mangoes, Bananas & Citrus', count: 98 },
  { id: 'cat_5', name: 'Nuts & Seeds', slug: 'nuts-seeds', iconName: 'Nut', description: 'Raw Cashew Nuts, Macadamia & Sunflower Seeds', count: 42 },
  { id: 'cat_6', name: 'Roots & Tubers', slug: 'roots-tubers', iconName: 'Carrot', description: 'Cassava Starch, Yams & Sweet Potatoes', count: 35 }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev_001',
    listingId: 'crop_001',
    reviewerId: 'usr_buyer_002',
    reviewerName: 'Amara Diallo',
    reviewerRole: 'Wholesale Export Buyer',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    comment: 'Exceptional quality maize! The moisture level was verified at 12.3% upon arrival at Mombasa Port. Escrow payment was released effortlessly after KEPHIS clearance.',
    createdAt: '2026-07-20',
    verifiedPurchase: true
  },
  {
    id: 'rev_002',
    listingId: 'crop_001',
    reviewerId: 'usr_buyer_003',
    reviewerName: 'Tariq Al-Mansoor',
    reviewerRole: 'Grain Processor',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    comment: 'Superb crop density and clean sorting with almost zero broken kernels. Kwame Owusu is a reliable farmer. Looking forward to season 2 orders.',
    createdAt: '2026-07-15',
    verifiedPurchase: true
  },
  {
    id: 'rev_003',
    listingId: 'crop_002',
    reviewerId: 'usr_buyer_002',
    reviewerName: 'Amara Diallo',
    reviewerRole: 'Export Manager',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    comment: 'Grade A Ghanaian cocoa with distinct flavor profiles. COCOBOD certs were genuine. Smooth delivery timeline.',
    createdAt: '2026-06-28',
    verifiedPurchase: true
  }
];

export const MOCK_USER_ADMIN: UserProfile = {
  id: 'usr_admin_000',
  fullName: 'Dr. Amina Bello',
  email: 'admin@agrisphere.africa',
  role: 'admin',
  country: 'Kenya',
  phone: '+254 700 999 888',
  companyName: 'AgriSphere Pan-African Control Board',
  location: 'Nairobi HQ / Digital Hub',
  bio: 'Platform System Administrator overseeing trade compliance, KEPHIS/COCOBOD inspector verification, Escrow dispute resolution, and market index algorithms.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  joinedDate: '2023-01-01',
  verifiedStatus: true
};

export const INITIAL_USERS: UserProfile[] = [
  MOCK_USER_ADMIN,
  MOCK_USER_FARMER,
  MOCK_USER_BUYER,
  {
    id: 'usr_farmer_002',
    fullName: 'Kofi Mensah Cooperative',
    email: 'kofi.mensah@ashanticocoa.org',
    role: 'cooperative',
    country: 'Ghana',
    phone: '+233 20 888 7766',
    farmName: 'Ashanti Smallholder Cocoa Union',
    location: 'Kumasi, Ashanti Region',
    bio: 'Cooperative representing 350+ smallholder cocoa farmers in central Ghana.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2024-02-10',
    verifiedStatus: true
  },
  {
    id: 'usr_logistics_003',
    fullName: 'Trans-Africa Freight & Logistics',
    email: 'dispatch@transafrica-freight.com',
    role: 'logistics',
    country: 'Kenya',
    phone: '+254 722 000 111',
    companyName: 'Trans-Africa Logistics Ltd',
    location: 'Mombasa Port & Rift Valley Corridor',
    bio: 'Cold-chain trucking and cross-border customs clearing for agricultural commodities across East & West Africa.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    joinedDate: '2024-04-01',
    verifiedStatus: true
  }
];

export const MOCK_CROP_LISTINGS = INITIAL_CROP_LISTINGS;
export const MOCK_ORDERS = INITIAL_ORDERS;
export const MOCK_CONVERSATIONS = INITIAL_CONVERSATIONS;
export const MOCK_MESSAGES = INITIAL_MESSAGES;
export const MOCK_NOTIFICATIONS = INITIAL_NOTIFICATIONS;

