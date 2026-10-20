import { FarmProfile, FarmCropItem, LivestockItem, ScheduleEvent, FinancialTransaction, FarmTask, FarmReportSummary } from '../types';

export const INITIAL_FARM_PROFILE: FarmProfile = {
  id: 'farm_001',
  farmerId: 'usr_farmer_001',
  farmName: 'Green Valley Organic Estate',
  location: 'Kitale, Trans-Nzoia County',
  country: 'Kenya',
  totalSizeHectares: 65.5,
  arableHectares: 54.0,
  soilType: 'Rich Volcanic Loam (pH 6.5)',
  climateZone: 'Highland Tropical Agro-ecological',
  certificationStatus: 'GlobalG.A.P & East Africa Organic Verified',
  establishedYear: 2017,
  waterSource: 'Nzoia River Drip Irrigation + Solar Borehole'
};

export const INITIAL_FARM_CROPS: FarmCropItem[] = [
  {
    id: 'fc_001',
    farmId: 'farm_001',
    cropName: 'Sun-Dried Yellow Maize',
    variety: 'H614D High-Yield Hybrid',
    category: 'Grains & Cereals',
    areaHectares: 25.0,
    expectedYieldKg: 45000,
    healthStatus: 'Excellent',
    status: 'Ready for Harvest'
  },
  {
    id: 'fc_002',
    farmId: 'farm_001',
    cropName: 'Organic Arabica Coffee',
    variety: 'SL28 / Ruiru 11',
    category: 'Cash Crops',
    areaHectares: 15.0,
    expectedYieldKg: 18000,
    healthStatus: 'Excellent',
    status: 'Growing'
  },
  {
    id: 'fc_003',
    farmId: 'farm_001',
    cropName: 'Red Kidney Beans',
    variety: 'GLP-2 Rosecoco',
    category: 'Pulses & Legumes',
    areaHectares: 10.0,
    expectedYieldKg: 12000,
    healthStatus: 'Good',
    status: 'Planted'
  },
  {
    id: 'fc_004',
    farmId: 'farm_001',
    cropName: 'Sweet Potatoes (Orange-Fleshed)',
    variety: 'VITA Variety',
    category: 'Roots & Tubers',
    areaHectares: 4.0,
    expectedYieldKg: 8500,
    healthStatus: 'Good',
    status: 'Growing'
  }
];

export const INITIAL_LIVESTOCK: LivestockItem[] = [
  {
    id: 'ls_001',
    farmId: 'farm_001',
    animalType: 'Dairy Cattle',
    breed: 'Friesian / Jersey Cross',
    count: 32,
    healthStatus: 'Healthy',
    vaccinationStatus: 'FMD & Anthrax Up to Date',
    housingType: 'Zero-Grazing Unit with Solar Cooling',
    notes: 'Average yield: 28 Liters/cow/day'
  },
  {
    id: 'ls_002',
    farmId: 'farm_001',
    animalType: 'Meat Goats',
    breed: 'Kalahari Red & Boer',
    count: 55,
    healthStatus: 'Healthy',
    vaccinationStatus: 'PPR Vaccinated',
    housingType: 'Elevated Wooden Paddock',
    notes: 'Selective breeding program for fast growth'
  },
  {
    id: 'ls_003',
    farmId: 'farm_001',
    animalType: 'Poultry',
    breed: 'KALRO Kienyeji Dual-Purpose',
    count: 240,
    healthStatus: 'Healthy',
    vaccinationStatus: 'Newcastle & Gumboro Complete',
    housingType: 'Deep Litter Semi-Range System',
    notes: 'Egg production at 82% daily rate'
  }
];

export const INITIAL_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'sch_001',
    farmId: 'farm_001',
    type: 'harvest',
    title: 'Maize Batch #1 Harvest & Dehusking',
    cropName: 'Yellow Maize',
    plotName: 'Plot A - North Field',
    startDate: '2026-08-05',
    endDate: '2026-08-10',
    status: 'in_progress',
    notes: 'Ensure moisture level drops below 13.5% before bagging.'
  },
  {
    id: 'sch_002',
    farmId: 'farm_001',
    type: 'fertilizer',
    title: 'Organic Compost Top-Dressing',
    cropName: 'Arabica Coffee',
    plotName: 'Plot B - East Slope',
    startDate: '2026-08-12',
    endDate: '2026-08-15',
    status: 'scheduled',
    notes: 'Apply 5kg cured manure per coffee tree.'
  },
  {
    id: 'sch_003',
    farmId: 'farm_001',
    type: 'planting',
    title: 'Short-Rains Soybeans Sowing',
    cropName: 'Soybeans',
    plotName: 'Plot C - West Field',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    status: 'scheduled',
    notes: 'Inoculate seeds with Rhizobium prior to drilling.'
  },
  {
    id: 'sch_004',
    farmId: 'farm_001',
    type: 'irrigation',
    title: 'Drip Line Flushing & Sensor Calibration',
    cropName: 'Red Kidney Beans',
    plotName: 'Plot D - South Riverbed',
    startDate: '2026-08-02',
    endDate: '2026-08-03',
    status: 'completed',
    notes: 'All 12 solenoid valves operating at peak pressure.'
  }
];

export const INITIAL_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'ft_001',
    farmId: 'farm_001',
    type: 'income',
    category: 'Crop Sales',
    amountUSD: 16500,
    date: '2026-07-25',
    description: 'Wholesale Maize Escrow Payout (Order #AGRI-849201)',
    orderId: 'ord_101',
    paymentMethod: 'Escrow',
    status: 'completed'
  },
  {
    id: 'ft_002',
    farmId: 'farm_001',
    type: 'income',
    category: 'Crop Sales',
    amountUSD: 14400,
    date: '2026-07-18',
    description: 'Arabica Coffee Cherries Escrow Release (Order #AGRI-773412)',
    orderId: 'ord_102',
    paymentMethod: 'Escrow',
    status: 'completed'
  },
  {
    id: 'ft_003',
    farmId: 'farm_001',
    type: 'income',
    category: 'Livestock Sales',
    amountUSD: 3200,
    date: '2026-07-10',
    description: 'Bulk Raw Milk Co-op Delivery & Breeding Goat Stock',
    paymentMethod: 'Mobile Money',
    status: 'completed'
  },
  {
    id: 'ft_004',
    farmId: 'farm_001',
    type: 'expense',
    category: 'Seeds & Fertilizers',
    amountUSD: 4200,
    date: '2026-07-22',
    description: 'Organic Bio-NPK Fertilizer & Certified Certified Seeds',
    paymentMethod: 'Bank Transfer',
    status: 'completed'
  },
  {
    id: 'ft_005',
    farmId: 'farm_001',
    type: 'expense',
    category: 'Equipment & Fuel',
    amountUSD: 1850,
    date: '2026-07-15',
    description: 'Tractor Diesel Fuel & Solar Water Pump Maintenance',
    paymentMethod: 'Mobile Money',
    status: 'completed'
  },
  {
    id: 'ft_006',
    farmId: 'farm_001',
    type: 'expense',
    category: 'Labor & Payroll',
    amountUSD: 2900,
    date: '2026-07-01',
    description: 'Monthly Harvest Field Crew Payroll & Safety Gear',
    paymentMethod: 'Mobile Money',
    status: 'completed'
  }
];

export const INITIAL_FARM_TASKS: FarmTask[] = [
  {
    id: 'task_001',
    farmId: 'farm_001',
    title: 'Inspect Maize Moisture Meter before KEPHIS Quality Audit',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-08-01',
    assignedTo: 'Kwame Owusu',
    category: 'Quality Control'
  },
  {
    id: 'task_002',
    farmId: 'farm_001',
    title: 'Service Solar Borehole Inverter & Drip Lines',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-08-04',
    assignedTo: 'Joseph Kibet',
    category: 'Maintenance'
  },
  {
    id: 'task_003',
    farmId: 'farm_001',
    title: 'Administer FMD Booster Shots to Dairy Cattle',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-08-07',
    assignedTo: 'Dr. Mary Wanjiru (Veterinarian)',
    category: 'Livestock Care'
  },
  {
    id: 'task_004',
    farmId: 'farm_001',
    title: 'Submit GlobalG.A.P Annual Renewal Documentation',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-07-20',
    assignedTo: 'Kwame Owusu',
    category: 'Compliance'
  }
];

export const MONTHLY_SALES_DATA = [
  { month: 'Feb', salesKg: 18000, revenueUSD: 7200, expensesUSD: 3100 },
  { month: 'Mar', salesKg: 22000, revenueUSD: 8800, expensesUSD: 3400 },
  { month: 'Apr', salesKg: 31000, revenueUSD: 12400, expensesUSD: 4200 },
  { month: 'May', salesKg: 28000, revenueUSD: 11200, expensesUSD: 3800 },
  { month: 'Jun', salesKg: 42000, revenueUSD: 16800, expensesUSD: 5100 },
  { month: 'Jul', salesKg: 58000, revenueUSD: 23200, expensesUSD: 6400 }
];

export const PRODUCTS_SOLD_BREAKDOWN = [
  { name: 'Sun-Dried Yellow Maize', quantityKg: 42000, revenueUSD: 16800 },
  { name: 'Arabica Coffee Cherries', quantityKg: 12000, revenueUSD: 14400 },
  { name: 'Red Kidney Beans', quantityKg: 9500, revenueUSD: 6650 },
  { name: 'Sweet Potatoes', quantityKg: 6000, revenueUSD: 3300 }
];

export const INITIAL_FARM_REPORTS: FarmReportSummary = {
  period: 'Q3 2026 (May - Jul)',
  totalRevenueUSD: 51200,
  totalExpensesUSD: 15300,
  netProfitUSD: 35900,
  totalHarvestKg: 83500,
  salesVolumeKg: 69500,
  topCrop: 'Sun-Dried Yellow Maize',
  cropYieldEfficiency: 94.8
};
