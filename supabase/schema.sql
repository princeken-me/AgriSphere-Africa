-- Supabase Schema for AgriSphere Africa Farmer Dashboard
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farms Profile Table
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Kenya',
  total_size_hectares NUMERIC(10, 2) NOT NULL DEFAULT 50.0,
  arable_hectares NUMERIC(10, 2) NOT NULL DEFAULT 42.5,
  soil_type TEXT DEFAULT 'Volcanic Loam',
  climateZone TEXT DEFAULT 'Highland Tropical',
  certification_status TEXT DEFAULT 'GlobalG.A.P Organic Verified',
  established_year INT DEFAULT 2018,
  water_source TEXT DEFAULT 'River Irrigation & Rainfed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farm Crops Inventory Table
CREATE TABLE IF NOT EXISTS farm_crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  category TEXT NOT NULL,
  area_hectares NUMERIC(10, 2) NOT NULL,
  expected_yield_kg NUMERIC(12, 2) NOT NULL,
  health_status TEXT CHECK (health_status IN ('Excellent', 'Good', 'Needs Attention', 'At Risk')) DEFAULT 'Good',
  status TEXT CHECK (status IN ('Growing', 'Ready for Harvest', 'Planted', 'Fallow')) DEFAULT 'Growing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Livestock Management Table
CREATE TABLE IF NOT EXISTS livestock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  animal_type TEXT NOT NULL,
  breed TEXT NOT NULL,
  count INT NOT NULL DEFAULT 1,
  health_status TEXT CHECK (health_status IN ('Healthy', 'Under Treatment', 'Quarantined')) DEFAULT 'Healthy',
  vaccination_status TEXT DEFAULT 'Up to Date',
  housing_type TEXT DEFAULT 'Free Range Shed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Schedules (Planting & Harvest Calendar) Table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('planting', 'harvest', 'irrigation', 'fertilizer', 'pest_control')) NOT NULL,
  title TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  plot_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'delayed')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Financial Ledger (Income & Expense Tracker) Table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  amount_usd NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  order_id TEXT,
  payment_method TEXT DEFAULT 'Escrow',
  status TEXT CHECK (status IN ('completed', 'pending')) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Task Manager Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  due_date DATE NOT NULL,
  assigned_to TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Products (Crop Listings) Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_location TEXT NOT NULL,
  country TEXT NOT NULL,
  crop_category TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  price_per_kg_usd NUMERIC(10, 2) NOT NULL,
  quantity_available_kg NUMERIC(12, 2) NOT NULL,
  min_order_kg NUMERIC(12, 2) NOT NULL,
  harvest_date DATE NOT NULL,
  certs TEXT[] DEFAULT ARRAY[]::TEXT[],
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  organic BOOLEAN DEFAULT FALSE,
  moisture_content TEXT,
  grade TEXT DEFAULT 'Grade A',
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  listing_id UUID REFERENCES products(id),
  quantity_kg NUMERIC(12, 2) NOT NULL,
  unit_price_usd NUMERIC(10, 2) NOT NULL,
  total_price_usd NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'escrow_paid',
  order_date DATE DEFAULT CURRENT_DATE,
  estimated_delivery DATE,
  delivery_address TEXT,
  tracking_number TEXT,
  payment_escrow_protected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI Assistant Conversations Table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  topic TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Assistant Messages Table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  topic TEXT,
  key_takeaways TEXT[] DEFAULT ARRAY[]::TEXT[],
  suggested_followups TEXT[] DEFAULT ARRAY[]::TEXT[],
  voice_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for demonstration purposes
CREATE POLICY "Public farms read access" ON farms FOR SELECT USING (true);
CREATE POLICY "Public products read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public orders read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Public ai_conversations read access" ON ai_conversations FOR SELECT USING (true);
CREATE POLICY "Public ai_messages read access" ON ai_messages FOR SELECT USING (true);

