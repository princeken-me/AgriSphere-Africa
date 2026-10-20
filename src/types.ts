export type UserRole = 'farmer' | 'buyer' | 'cooperative' | 'logistics' | 'admin';

export type CurrencyCode = 'USD' | 'KES' | 'NGN' | 'GHS' | 'ETB' | 'ZAR';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  country: string;
  location?: string;
  avatar?: string;
  avatarUrl?: string;
  farmName?: string;
  companyName?: string;
  bio?: string;
  joinedDate?: string;
  verifiedStatus?: boolean;
  memberSince?: string;
  totalTransactionsUSD?: number;
  rating?: number;
}

export interface CropListing {
  id: string;
  title: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  country: string;
  cropCategory: 'Grains & Cereals' | 'Pulses & Legumes' | 'Roots & Tubers' | 'Cash Crops' | 'Fruits & Vegetables' | 'Nuts & Seeds';
  cropName: string;
  pricePerKgUSD: number;
  quantityAvailableKg: number;
  minOrderKg: number;
  harvestDate: string;
  locationCoords: {
    lat: number;
    lng: number;
  };
  certs: string[];
  image: string;
  gallery: string[];
  organic: boolean;
  moistureContent: string;
  grade: 'Grade A' | 'Grade B' | 'Export Quality' | 'Standard';
  description: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface OrderTimelineItem {
  status: 'pending' | 'escrow_paid' | 'inspection' | 'harvesting' | 'loading' | 'in_transit' | 'delivered' | 'cancelled';
  label: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  listingId: string;
  listingTitle: string;
  cropImage: string;
  quantityKg: number;
  unitPriceUSD: number;
  totalPriceUSD: number;
  currency: CurrencyCode;
  status: 'pending' | 'escrow_paid' | 'inspection' | 'loading' | 'harvesting' | 'in_transit' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  trackingNumber: string;
  timeline: OrderTimelineItem[];
  paymentEscrowProtected: boolean;
}

export type TopicCategory = 
  | 'Planting' 
  | 'Diseases' 
  | 'Fertilizer' 
  | 'Weather' 
  | 'Pests' 
  | 'Harvest' 
  | 'Market Prices' 
  | 'General';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: TopicCategory;
  keyTakeaways?: string[];
  suggestedFollowups?: string[];
  isVoiceInput?: boolean;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  topic: TopicCategory;
  updatedAt: string;
  messages: AIMessage[];
}


export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  offerDetails?: {
    listingId: string;
    offeredPriceUSD: number;
    offeredQuantityKg: number;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerRole: UserRole;
  partnerAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'weather' | 'market' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface WeatherForecast {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Heavy Rain' | 'Scattered Showers' | 'Dry Season Wind';
  precipitationChance: number;
  humidity: number;
  windSpeedKmH: number;
}

export interface MarketPriceIndex {
  id: string;
  commodity: string;
  country: string;
  currentPriceUSD: number;
  priceChange24h: number; // percentage e.g. +3.5 or -1.2
  unit: string;
  history: { date: string; price: number }[];
}

export interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  areaHectares: number;
  healthScore: number; // 0 - 100
  soilMoisture: number; // %
  soilpH: number;
  lat: number;
  lng: number;
  lastInspected: string;
}

export interface CartItem {
  listingId: string;
  listing: CropListing;
  quantityKg: number;
}

export interface ProductReview {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  count: number;
}

export interface FarmProfile {
  id: string;
  farmerId: string;
  farmName: string;
  location: string;
  country: string;
  totalSizeHectares: number;
  arableHectares: number;
  soilType: string;
  climateZone: string;
  certificationStatus: string;
  establishedYear: number;
  waterSource: string;
}

export interface FarmCropItem {
  id: string;
  farmId: string;
  cropName: string;
  variety: string;
  category: string;
  areaHectares: number;
  expectedYieldKg: number;
  healthStatus: 'Excellent' | 'Good' | 'Needs Attention' | 'At Risk';
  status: 'Growing' | 'Ready for Harvest' | 'Planted' | 'Fallow';
}

export interface LivestockItem {
  id: string;
  farmId: string;
  animalType: string;
  breed: string;
  count: number;
  healthStatus: 'Healthy' | 'Under Treatment' | 'Quarantined';
  vaccinationStatus: string;
  housingType: string;
  notes: string;
}

export interface ScheduleEvent {
  id: string;
  farmId: string;
  type: 'planting' | 'harvest' | 'irrigation' | 'fertilizer' | 'pest_control';
  title: string;
  cropName: string;
  plotName: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  notes?: string;
}

export interface FinancialTransaction {
  id: string;
  farmId: string;
  type: 'income' | 'expense';
  category: 'Crop Sales' | 'Livestock Sales' | 'Seeds & Fertilizers' | 'Equipment & Fuel' | 'Labor & Payroll' | 'Logistics' | 'Utilities & Water';
  amountUSD: number;
  date: string;
  description: string;
  orderId?: string;
  paymentMethod: 'Escrow' | 'Mobile Money' | 'Bank Transfer' | 'Cash';
  status: 'completed' | 'pending';
}

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  category: string;
}

export interface FarmReportSummary {
  period: string;
  totalRevenueUSD: number;
  totalExpensesUSD: number;
  netProfitUSD: number;
  totalHarvestKg: number;
  salesVolumeKg: number;
  topCrop: string;
  cropYieldEfficiency: number; // percentage e.g. 96
}

export interface ProductFormData {
  id?: string;
  title: string;
  cropCategory: CropListing['cropCategory'];
  cropName: string;
  pricePerKgUSD: number;
  quantityAvailableKg: number;
  minOrderKg: number;
  harvestDate: string;
  country: string;
  farmerLocation: string;
  lat: number;
  lng: number;
  organic: boolean;
  moistureContent: string;
  grade: CropListing['grade'];
  description: string;
  certs: string[];
  image: string;
  gallery: string[];
}
