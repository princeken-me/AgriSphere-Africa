import { 
  saveConversationToFirebase, 
  saveMessageToFirebase, 
  fetchConversationsFromFirebase 
} from '../lib/firebase';

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

export interface QuickTopicConfig {
  id: TopicCategory;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const QUICK_TOPICS: QuickTopicConfig[] = [
  {
    id: 'Planting',
    name: 'Planting',
    icon: '🌱',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Seed spacing, depth, soil preparation & onset of rains timing'
  },
  {
    id: 'Diseases',
    name: 'Diseases',
    icon: '🦠',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Fungal leaf spots, blights, bacterial wilt & KEPHIS diagnostics'
  },
  {
    id: 'Fertilizer',
    name: 'Fertilizer',
    icon: '🧪',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'DAP, CAN, NPK 17-17-17, agricultural lime & foliar feeding'
  },
  {
    id: 'Weather',
    name: 'Weather',
    icon: '☀️',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    description: 'Rainfall outlook, frost risk, humidity & spray condition index'
  },
  {
    id: 'Pests',
    name: 'Pests',
    icon: '🐛',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Fall armyworm, stem borers, aphids, neem oil & IPM sprays'
  },
  {
    id: 'Harvest',
    name: 'Harvest',
    icon: '🌾',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Moisture testing (12.5% target), post-harvest drying & PICS bags'
  },
  {
    id: 'Market Prices',
    name: 'Market Prices',
    icon: '📊',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Regional grain exchange rates, buyer demand & escrow valuation'
  }
];

export const SUGGESTED_QUESTIONS_BY_TOPIC: Record<TopicCategory, string[]> = {
  Planting: [
    'What is the ideal plant spacing for SC719 hybrid maize in clay loam soil?',
    'When should I sow white maize before the long rains in Rift Valley?',
    'How deep should cassava cuttings be buried for optimal root formation?',
    'What soil pH is best for high-grade Arabica coffee seedlings?'
  ],
  Diseases: [
    'How do I treat yellowing maize leaves with grey leaf spot lesions?',
    'What are organic remedies for cassava brown streak disease?',
    'How can I control coffee leaf rust during high-humidity weeks?',
    'What fungicides are certified safe by KEPHIS for tomatoes?'
  ],
  Fertilizer: [
    'Should I apply DAP or CAN at planting time for maize crops?',
    'How many kilograms of NPK 17-17-17 per hectare are needed for beans?',
    'How does agricultural lime correct acidic volcanic soils in highland farms?',
    'What is the best timing for foliar spray nitrogen application?'
  ],
  Weather: [
    'What is the 7-day rainfall forecast for Rift Valley & Western Kenya?',
    'Is it safe to spray pesticides today given humidity and wind speed?',
    'How does El Niño affect post-harvest drying schedules for cocoa and maize?',
    'What measures protect avocado saplings against sudden frost advisory?'
  ],
  Pests: [
    'How do I control Fall Armyworm larvae without damaging beneficial bees?',
    'What organic neem oil mixture works against aphids on cabbage?',
    'How to prevent stem borer damage in young sorghum stalks?',
    'What integrated pest management (IPM) practices work best for bean flies?'
  ],
  Harvest: [
    'How to test grain moisture content without a digital moisture meter?',
    'What is the maximum safe storage moisture percentage for white maize in PICS bags?',
    'How do solar bubble dryers prevent aflatoxin contamination in stored groundnuts?',
    'What are best practices for cocoa bean fermentation and drying racks?'
  ],
  'Market Prices': [
    'What is the current wholesale price per 90kg bag of maize in Nairobi & Nakuru?',
    'Are coffee commodity prices expected to rise over the next quarter?',
    'How does AgriSphere Smart Escrow protect farmers against price volatility?',
    'Where can I find bulk buyers for organic Hass avocado exports?'
  ],
  General: [
    'How can I improve soil organic carbon levels on a 10-hectare estate?',
    'What are the most profitable cash crops to plant in East & West Africa this season?',
    'How do drip irrigation systems compare with overhead sprinklers for water efficiency?'
  ]
};

export interface AIFarmingResponsePayload {
  responseText: string;
  topicCategory: TopicCategory;
  keyTakeaways: string[];
  suggestedFollowUps: string[];
}

/**
 * Placeholder AI agronomy response generator.
 * Designed to easily bridge to external LLM endpoints (e.g., Gemini API)
 * while providing accurate, immediate agronomic guidance for African farming.
 */
export async function generateAIFarmingResponse(
  userQuery: string,
  topic: TopicCategory = 'General'
): Promise<AIFarmingResponsePayload> {
  // Simulate natural AI thinking delay for smooth typing animation experience
  await new Promise((resolve) => setTimeout(resolve, 800));

  const queryLower = userQuery.toLowerCase();
  
  // Auto-detect topic if general
  let detectedTopic: TopicCategory = topic;
  if (topic === 'General') {
    if (queryLower.includes('plant') || queryLower.includes('sow') || queryLower.includes('seed') || queryLower.includes('spacing')) {
      detectedTopic = 'Planting';
    } else if (queryLower.includes('disease') || queryLower.includes('fungus') || queryLower.includes('yellow') || queryLower.includes('spot') || queryLower.includes('rot')) {
      detectedTopic = 'Diseases';
    } else if (queryLower.includes('fertilizer') || queryLower.includes('dap') || queryLower.includes('can') || queryLower.includes('npk') || queryLower.includes('soil')) {
      detectedTopic = 'Fertilizer';
    } else if (queryLower.includes('rain') || queryLower.includes('weather') || queryLower.includes('climate') || queryLower.includes('temp')) {
      detectedTopic = 'Weather';
    } else if (queryLower.includes('pest') || queryLower.includes('armyworm') || queryLower.includes('bug') || queryLower.includes('insect') || queryLower.includes('worm')) {
      detectedTopic = 'Pests';
    } else if (queryLower.includes('harvest') || queryLower.includes('moisture') || queryLower.includes('dry') || queryLower.includes('store') || queryLower.includes('bag')) {
      detectedTopic = 'Harvest';
    } else if (queryLower.includes('price') || queryLower.includes('market') || queryLower.includes('sell') || queryLower.includes('buyer') || queryLower.includes('cost')) {
      detectedTopic = 'Market Prices';
    }
  }

  // Response Builder Matrix
  if (detectedTopic === 'Planting' || queryLower.includes('plant') || queryLower.includes('spacing')) {
    return {
      topicCategory: 'Planting',
      responseText: `🌱 **Agronomy Recommendation for Planting & Crop Establishment:**

1. **Optimal Seed Spacing & Planting Depth:**
   - **Maize (Hybrid SC719 / H614):** Plant at a row spacing of 75 cm by 25 cm between plants (1 seed per hole), aiming for ~53,000 plant population per hectare. Depth should be 5 cm in moist loam soils, or 7 cm if dry planting before rains.
   - **Legumes (Beans / Cowpeas):** Space rows 45 cm apart with 15 cm within rows to encourage canopy cover and weed suppression.

2. **Soil Bed & Moisture Preparation:**
   - Ensure seedbeds are tilled to a fine tilth to improve root penetration.
   - Test soil pH before planting. Sub-Saharan highland soils often require **Agricultural Lime (2-3 tonnes/ha)** if pH drops below 5.5 to release tied-up phosphorus.

3. **Rainfall Onset Timing:**
   - Planting should occur within 2-3 days following the first consistent 20mm rainfall event. Dry sowing is recommended only if certified seed dressing is used to prevent soil insect destruction.`,
      keyTakeaways: [
        'Target plant density: ~53,000 plants/ha for commercial hybrid maize',
        'Maintain 75cm x 25cm spacing for optimal solar interception',
        'Ensure soil pH is above 5.5 using Agricultural Lime before sowing'
      ],
      suggestedFollowUps: [
        'Which hybrid seed varieties offer high drought tolerance in my region?',
        'How much DAP basal fertilizer should I apply at planting time?',
        'What weed control measures are safest during early germination?'
      ]
    };
  }

  if (detectedTopic === 'Diseases' || queryLower.includes('disease') || queryLower.includes('fungus') || queryLower.includes('rot')) {
    return {
      topicCategory: 'Diseases',
      responseText: `🦠 **Crop Pathology & Disease Management Diagnostic:**

1. **Symptom Identification & Pathology:**
   - Yellowing leaf margins with rectangular dark spots are indicative of **Grey Leaf Spot (Cercospora zeae-maydis)** or **Northern Corn Leaf Blight**.
   - If foliage displays mosaic streaking and stunted cobs, test for **Maize Lethal Necrosis (MLN)** transmitted by thrips and aphids.

2. **Immediate Remedial Treatment Plan:**
   - Apply a registered broad-spectrum systemic fungicide containing **Azoxystrobin + Difenoconazole** early in the morning before heat index peaks.
   - For organic acreage, spray copper oxychloride or bio-fungicide formulations at 7-day intervals.

3. **Cultural & Preventive Hygiene:**
   - Clear and incinerate infected crop residue post-harvest to disrupt fungal spore survival cycles.
   - Practice strict 3-year crop rotation with non-host legumes (pigeon peas, soy, cowpeas).`,
      keyTakeaways: [
        'Apply systemic fungicide (Azoxystrobin + Difenoconazole) early morning',
        'Rotate maize with legumes every 2-3 seasons to break disease persistence',
        'Remove crop residue to prevent soil-borne fungal spore build-up'
      ],
      suggestedFollowUps: [
        'What organic sprays can control bacterial wilt in solanaceous crops?',
        'Where can I submit crop samples for certified KEPHIS laboratory testing?',
        'How does drip irrigation reduce fungal leaf dampening compared to sprinklers?'
      ]
    };
  }

  if (detectedTopic === 'Fertilizer' || queryLower.includes('fertilizer') || queryLower.includes('dap') || queryLower.includes('can') || queryLower.includes('npk')) {
    return {
      topicCategory: 'Fertilizer',
      responseText: `🧪 **Soil Fertility & Nutrient Management Plan:**

1. **Basal Application (At Planting):**
   - Apply **DAP (Di-Ammonium Phosphate) or NPK 23:23:0** at a rate of 125 kg to 150 kg per hectare (approx 5g per planting hole). Mix thoroughly with soil before dropping seed to prevent root burn.
   - On acidic volcanic soils, substitute DAP with **SSP (Single Superphosphate)** or **NPK 17-17-17** to avoid further soil acidification.

2. **Top-Dressing (At Knee-High Stage / 4-6 Weeks):**
   - Top-dress with **CAN (Calcium Ammonium Nitrate)** at 150 kg/ha when maize reaches knee height (V6 stage). Split application into two doses if rainfall is heavy to avoid leaching losses.

3. **Foliar Micronutrient Boost:**
   - Spray zinc and boron foliar liquid fertilizer during flowering stage to enhance grain filling and kernel weight.`,
      keyTakeaways: [
        'Basal stage: 125–150 kg/ha DAP or NPK 23:23:0 mixed into soil',
        'Top-dressing stage: 150 kg/ha CAN at knee-high growth stage (V6)',
        'Foliar zinc & boron spray enhances tassel formation & grain weight'
      ],
      suggestedFollowUps: [
        'How do I make organic compost manure to supplement synthetic fertilizers?',
        'What are the signs of nitrogen deficiency versus potassium deficiency in leaves?',
        'How to apply agricultural lime to neutralize soil acidity?'
      ]
    };
  }

  if (detectedTopic === 'Weather' || queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('frost')) {
    return {
      topicCategory: 'Weather',
      responseText: `☀️ **AgriSphere Micro-Climate & Weather Spray Advisory:**

1. **7-Day Weather & Rainfall Outlook:**
   - Regional outlook indicates **moderate precipitation (15-35mm)** expected across highland zones over the next 72 hours, followed by dry sunny intervals.
   - High daytime temperatures (27°C) with night drops to 14°C create high dew points — conditions favorable for fungal spore germination.

2. **Spray Conditions & Field Accessibility:**
   - **Wind Speed:** Currently light (6 km/h) — favorable for spraying until 10:30 AM before thermal updrafts develop.
   - Avoid spraying if rain is expected within 3 hours unless using a sticker/spreader adjuvant.

3. **Soil Moisture & Irrigation Adjustment:**
   - Delay scheduled overhead sprinkler irrigation by 48 hours to leverage natural precipitation and save water pumping energy.`,
      keyTakeaways: [
        'Optimal spray window: Early morning (6:30 AM - 10:00 AM) at low wind speeds',
        'Rainfall expected: 15-35mm over next 72 hours; adjust irrigation schedules',
        'High dew point increases fungal leaf spot risk — monitor vulnerable plots'
      ],
      suggestedFollowUps: [
        'How can I set up rain-fed water harvesting ponds for dry season irrigation?',
        'What crops withstand extended dry spells during mid-season drought?',
        'How do weather insurance triggers work on AgriSphere Escrow orders?'
      ]
    };
  }

  if (detectedTopic === 'Pests' || queryLower.includes('pest') || queryLower.includes('armyworm') || queryLower.includes('bug')) {
    return {
      topicCategory: 'Pests',
      responseText: `🐛 **Integrated Pest Management (IPM) & Fall Armyworm Control:**

1. **Pest Scouting & Threshold:**
   - Inspect 20 consecutive plants in 5 field locations. If >10% of young plants show pinhole leaf feeding damage, initiate immediate intervention.

2. **Targeted Chemical & Bio-Pesticide Control:**
   - Spray **Emamectin Benzoate 5% SG** or **Spinetoram** directly into the crop whorls early morning or late evening when larvae actively feed.
   - For organic IPM, apply **Bacillus thuringiensis (Bt)** or cold-pressed Neem oil (Azadirachtin) solution every 5 days.

3. **Field Hygiene & Intercropping:**
   - Plant **Desmodium** between maize rows and **Napier grass** around field margins (Push-Pull technology). Desmodium repels stem borers/armyworms while Napier grass attracts them away from main crops.`,
      keyTakeaways: [
        'Direct spray (Emamectin Benzoate or Spinetoram) into plant whorls at dusk/dawn',
        'Scout weekly: Initiate spray if >10% of plants display whorl damage',
        'Implement Push-Pull technology with Desmodium and Napier grass borders'
      ],
      suggestedFollowUps: [
        'How does Push-Pull technology control Striga weed and stem borers simultaneously?',
        'What personal protective equipment (PPE) is mandatory when spraying insecticides?',
        'Are there natural predators that consume fall armyworm egg masses?'
      ]
    };
  }

  if (detectedTopic === 'Harvest' || queryLower.includes('harvest') || queryLower.includes('moisture') || queryLower.includes('dry')) {
    return {
      topicCategory: 'Harvest',
      responseText: `🌾 **Post-Harvest Handling & Grain Quality Preservation:**

1. **Moisture Content Standard:**
   - Target storage moisture for white maize, coffee, and beans is **12.5% to 13.5%**.
   - *Field Test without meter:* Place a handful of dry grains in a clean dry glass jar with 1 teaspoon of dry salt. Shake for 1 minute. If salt clings to jar walls, moisture is above 14% and requires further sun drying.

2. **Drying & Aflatoxin Prevention:**
   - Dry grains on raised tarpaulins or solar dryers off the bare ground to prevent moisture re-absorption and soil fungus contact.
   - Ensure cobs/grains are dried within 5 days of harvest to keep Aflatoxin levels below regulatory limits (<10 ppb).

3. **Hermetic Storage Bags:**
   - Store cleaned grains in triple-layer **PICS (Purdue Improved Crop Storage) bags** or hermetic silos without synthetic chemical dusts. Seal tightly to suffocate adult grain weevils.`,
      keyTakeaways: [
        'Maintain grain moisture strictly at 12.5% - 13.5% for long-term storage',
        'Dry on raised tarps to prevent soil contact and Aflatoxin contamination',
        'Use PICS hermetic triple-layer bags to eliminate weevils without chemicals'
      ],
      suggestedFollowUps: [
        'How do I test my grain sample for Aflatoxin before shipping to buyers?',
        'What are the pricing premiums for Grade A certified dry maize on AgriSphere?',
        'How long can dry maize remain fresh in sealed PICS bags?'
      ]
    };
  }

  if (detectedTopic === 'Market Prices' || queryLower.includes('price') || queryLower.includes('market') || queryLower.includes('buyer')) {
    return {
      topicCategory: 'Market Prices',
      responseText: `📊 **AgriSphere Regional Wholesale Market Price Index:**

1. **Current Benchmark Wholesale Rates (Ex-Farm & Wholesale Hubs):**
   - **White Maize (Grade A):** $0.42 - $0.48 / kg (~$38 - $43 per 90kg bag in Nairobi/Kampala)
   - **Red Kidney Beans:** $0.95 - $1.15 / kg ($85.50 - $103.50 per 90kg bag)
   - **AA Arabica Coffee Parchment:** $4.80 - $5.40 / kg
   - **Hass Avocados (Export Grade):** $1.20 - $1.45 / kg

2. **Market Demand & Price Trends:**
   - Grain demand is projected to rise **+6.5% over the next 4 weeks** as institutional buyers stock regional distribution centers.
   - Certified organic produce commands a **15% - 22% premium** on the AgriSphere B2B Marketplace.

3. **Escrow Guarantee:**
   - Selling via AgriSphere Smart Escrow locks in agreed prices upon contract signing, protecting your farm revenue against unexpected localized spot-price drops.`,
      keyTakeaways: [
        'White Maize Grade A trading at $0.42–$0.48/kg across major hubs',
        'Market demand trending +6.5% upwards over coming 30 days',
        'Smart Escrow locks in purchase price and guarantees instant delivery payout'
      ],
      suggestedFollowUps: [
        'How do I list my harvest for pre-order buyers on the Marketplace?',
        'What documentation is needed for international agricultural export deals?',
        'How do logistics fees affect net farm-gate prices?'
      ]
    };
  }

  // Fallback / General Response
  return {
    topicCategory: 'General',
    responseText: `💡 **AgriSphere Smart Agronomy Guidance:**

Thank you for your question regarding: "${userQuery}".

Here is a recommended approach tailored to African farming conditions:
- **Soil & Nutrient Health:** Always base crop input investments on a reliable soil pH test. Most highland soils benefit from balancing macro-nutrients (NPK) with organic matter.
- **Pest & Disease Scouting:** Monitor fields early in the morning twice a week to catch infestations before economic injury thresholds are breached.
- **Market & Post-Harvest Value:** Store your harvest in hermetic bags until market prices peak, leveraging AgriSphere Smart Escrow to connect directly with verified buyers.`,
    keyTakeaways: [
      'Conduct regular soil testing to optimize fertilizer efficiency',
      'Scout fields twice weekly to detect pests before severe crop loss',
      'Use AgriSphere Smart Escrow to access verified wholesale buyers'
    ],
    suggestedFollowUps: [
      'What is the best way to prepare my farm soil for the upcoming season?',
      'How can I connect with wholesale buyers on AgriSphere Africa?',
      'Which crop varieties give the highest yields in dry regions?'
    ]
  };
}

// Firebase Firestore persistence methods
export async function saveConversationToFirebaseDb(
  userId: string,
  title: string,
  topic: TopicCategory
): Promise<string> {
  return saveConversationToFirebase(userId, title, topic);
}

export async function saveMessageToFirebaseDb(
  conversationId: string,
  message: AIMessage
): Promise<void> {
  return saveMessageToFirebase(conversationId, message);
}

export async function fetchConversationsFromFirebaseDb(userId: string): Promise<AIConversation[]> {
  return fetchConversationsFromFirebase(userId);
}

// Aliases for compatibility
export const saveConversationToSupabase = saveConversationToFirebaseDb;
export const saveMessageToSupabase = saveMessageToFirebaseDb;
export const fetchConversationsFromSupabase = fetchConversationsFromFirebaseDb;

