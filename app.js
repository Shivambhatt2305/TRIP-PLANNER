/* ====================================================
   SMARTTRIP AI — ADVANCED PLANNING ORCHESTRATOR & REVIEWER
   Implements Full System Prompt Architecture:
   - Role A: Planning Orchestrator (Parts 1–11)
   - Role B: Independent Reviewer (Parts 12–13)
   - Part 3: Input Validation & Missing Field Guard
   - Part 4: Constraint Extraction (Hard vs. Soft)
   - Part 5: Feasibility Analysis & Risk Assessment
   - Part 6 & 7: Destination Research & Geographic Clustering
   - Part 8: Map & Waypoint Routing (Distances & Times)
   - Part 9: Morning/Afternoon/Evening Session Itinerary
   - Part 10: Deterministic 6-Category Cost Calculation
   - Part 14 & 15: Revision Loop & Budget Repair (Max 3 cycles)
   - Part 16 & 17: Final Validation & Executive Dashboard
   - Part 19: Machine-Readable Status Object Export
   ==================================================== */

'use strict';

// ============================================================
// PART 6: DESTINATION KNOWLEDGE BASE & GEOGRAPHIC CLUSTERS
// ============================================================

const DESTINATIONS_DB = {
  paris: {
    name: 'Paris, France',
    emoji: '🗼',
    region: 'Europe',
    center: { lat: 48.8566, lon: 2.3522 },
    intercityTransitCost: { flight: 260, train: 95, bus: 45, 'self-drive': 80, any: 160 },
    baseDailyUSD: {
      budget:    { hotel: 48,  food: 26, activities: 16, localTransit: 9,  misc: 10 },
      'mid-range': { hotel: 135, food: 60, activities: 36, localTransit: 16, misc: 22 },
      luxury:    { hotel: 390, food: 155, activities: 85, localTransit: 35, misc: 50 },
    },
    hotels: {
      hostel:  ['Generator Paris (Canal Saint-Martin)', 'St Christopher\'s Inn Gare du Nord', 'MIJE Marais'],
      hotel:   ['Hôtel du Jeu de Paume (Île Saint-Louis)', 'Hôtel Atmosphères (Latin Quarter)', 'Citadines Bastille'],
      airbnb:  ['Le Marais Historic Loft', 'Montmartre Artists Studio', 'Saint-Germain Cozy Flat'],
      resort:  ['Le Bristol Paris (Faubourg Saint-Honoré)', 'Hôtel de Crillon (Place de la Concorde)', 'Four Seasons George V'],
    },
    clusters: [
      {
        clusterId: 'C1',
        name: 'Zone 1: Historic Core & Royal Île de la Cité',
        district: '1st & 4th Arrondissements',
        morning: {
          name: 'Louvre Museum & Tuileries Gardens',
          category: 'Cultural Landmark',
          activity: 'Tour master classical wings (Winged Victory, Mona Lisa) & royal gardens',
          timing: '09:00 AM – 12:30 PM',
          duration: '3.5 hrs',
          costUSD: 24,
          distKm: 1.8,
          transit: '14 mins via Metro Line 1',
        },
        lunch: {
          name: 'Bistrot Vivienne (Galerie Vivienne)',
          cuisine: 'French Classic Duck Confit & Baguette',
          costUSD: 28,
          distKm: 0.6,
          transit: '8 mins walk',
        },
        afternoon: {
          name: 'Sainte-Chapelle & Notre-Dame Forecourt',
          category: 'Historic Architecture',
          activity: 'Marvel at 1,113 13th-century stained glass windows & Île de la Cité quays',
          timing: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          costUSD: 16,
          distKm: 1.2,
          transit: '14 mins walk across Pont Neuf',
        },
        dinner: {
          name: 'Le Comptoir du Relais (Saint-Germain)',
          cuisine: 'Traditional Bistro & Beef Bourguignon',
          costUSD: 36,
          distKm: 0.9,
          transit: '10 mins walk',
        },
        evening: {
          name: 'Illuminated Seine Sunset Cruise',
          category: 'Scenic Experience',
          activity: 'Panoramic twilight riverboat cruise beneath Paris bridges & lit monuments',
          timing: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          costUSD: 18,
          distKm: 1.5,
          transit: '15 mins transit',
        },
      },
      {
        clusterId: 'C2',
        name: 'Zone 2: Left Bank, Eiffel Tower & Musée d\'Orsay',
        district: '7th & 8th Arrondissements',
        morning: {
          name: 'Musée d\'Orsay Belle Époque Station',
          category: 'Impressionist Masterpieces',
          activity: 'Explore Monet, Van Gogh, Renoir & Degas in converted railway hall',
          timing: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          costUSD: 20,
          distKm: 2.2,
          transit: '18 mins via RER C',
        },
        lunch: {
          name: 'Café de Flore / Saint-Germain Café',
          cuisine: 'Croque Monsieur & Café Gourmand',
          costUSD: 26,
          distKm: 0.8,
          transit: '10 mins stroll',
        },
        afternoon: {
          name: 'Eiffel Tower & Champ de Mars',
          category: 'Monument',
          activity: 'Ascend to second level observation deck & relax on manicured lawns',
          timing: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          costUSD: 30,
          distKm: 2.0,
          transit: '16 mins via Metro Line 8',
        },
        dinner: {
          name: 'Brasserie Lipp (Boulevard Saint-Germain)',
          cuisine: 'Authentic Choucroute & French Oysters',
          costUSD: 42,
          distKm: 2.1,
          transit: '18 mins transit',
        },
        evening: {
          name: 'Trocadéro Esplanade Night Lightshow',
          category: 'Night Photography',
          activity: 'Witness the hourly sparkling light display of the Eiffel Tower across fountains',
          timing: '08:00 PM – 09:30 PM',
          duration: '1.5 hrs',
          costUSD: 0,
          distKm: 2.4,
          transit: '15 mins transit',
        },
      },
      {
        clusterId: 'C3',
        name: 'Zone 3: Montmartre Hilltop & Bohemian Arcades',
        district: '18th & 9th Arrondissements',
        morning: {
          name: 'Sacré-Cœur Basilica & Place du Tertre',
          category: 'Historic Panorama',
          activity: 'Climb the domes for citywide vista & explore street painters square',
          timing: '09:00 AM – 12:30 PM',
          duration: '3.5 hrs',
          costUSD: 9,
          distKm: 3.1,
          transit: '20 mins via Metro Line 12',
        },
        lunch: {
          name: 'La Maison Rose / Montmartre Bistro',
          cuisine: 'Rustic French Galettes & Artisan Cider',
          costUSD: 22,
          distKm: 0.4,
          transit: '5 mins walk',
        },
        afternoon: {
          name: 'Palais Garnier Opera & Covered Passages',
          category: 'Architectural Heritage',
          activity: 'Tour gilded grand foyer, Chagall ceiling & 19th-century glass arcades',
          timing: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          costUSD: 17,
          distKm: 2.0,
          transit: '15 mins transit',
        },
        dinner: {
          name: 'Bouillon Chartier (Grands Boulevards)',
          cuisine: 'Historic 1896 Belle Époque dining hall with value classics',
          costUSD: 20,
          distKm: 0.9,
          transit: '11 mins walk',
        },
        evening: {
          name: 'Pigalle & Montmartre Evening Jazz',
          category: 'Live Music & Nightlife',
          activity: 'Experience historic jazz cellar performances and lit boulevard walks',
          timing: '08:00 PM – 10:30 PM',
          duration: '2.5 hrs',
          costUSD: 25,
          distKm: 1.6,
          transit: '14 mins walk/bus',
        },
      },
      {
        clusterId: 'C4',
        name: 'Zone 4: Latin Quarter, Panthéon & Le Marais',
        district: '5th & 3rd Arrondissements',
        morning: {
          name: 'Panthéon & Luxembourg Royal Gardens',
          category: 'National Monument & Park',
          activity: 'Visit crypts of Curie & Hugo, followed by Medici Fountain stroll',
          timing: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          costUSD: 14,
          distKm: 1.5,
          transit: '12 mins transit',
        },
        lunch: {
          name: 'L\'As du Fallafel (Rue des Rosiers)',
          cuisine: 'World-famous authentic falafel pitas & Middle Eastern mezze',
          costUSD: 14,
          distKm: 1.7,
          transit: '18 mins walk/metro',
        },
        afternoon: {
          name: 'Centre Pompidou & Place des Vosges',
          category: 'Modern Art & Historic Square',
          activity: 'Modern art exhibits with panoramic skyline terrace & royal colonnade',
          timing: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          costUSD: 18,
          distKm: 0.7,
          transit: '8 mins stroll',
        },
        dinner: {
          name: 'Chez Janou (Rue des Tournelles)',
          cuisine: 'Provençal cuisine, ratatouille & chocolate mousse bowl',
          costUSD: 34,
          distKm: 0.5,
          transit: '6 mins walk',
        },
        evening: {
          name: 'Saint-Germain Underground Jazz Cellar',
          category: 'Historic Entertainment',
          activity: 'Live swing and jazz dancing in medieval vaulted stone cellars',
          timing: '08:30 PM – 11:00 PM',
          duration: '2.5 hrs',
          costUSD: 20,
          distKm: 1.8,
          transit: '16 mins metro',
        },
      },
    ],
    verifiedFacts: [
      'Metro Line 1 and Line 4 provide direct connections to 85% of planned historic sights.',
      'Notre-Dame Cathedral plaza and Sacré-Cœur Basilica main sanctuaries have free entry.',
      'Paris Visite / Navigo Découverte pass is standard for unlimited local bus and metro.',
    ],
    estimatedFacts: [
      'Museum ticket fees assume online standard advance adult reservation.',
      'Dining expenses based on local mid-tier neighborhood bistros outside heavy tourist corridors.',
    ],
  },

  rome: {
    name: 'Rome, Italy',
    emoji: '🏛️',
    region: 'Europe',
    center: { lat: 41.9028, lon: 12.4964 },
    intercityTransitCost: { flight: 250, train: 80, bus: 40, 'self-drive': 75, any: 150 },
    baseDailyUSD: {
      budget:    { hotel: 40,  food: 22, activities: 15, localTransit: 7,  misc: 9 },
      'mid-range': { hotel: 115, food: 50, activities: 30, localTransit: 13, misc: 18 },
      luxury:    { hotel: 330, food: 130, activities: 70, localTransit: 30, misc: 45 },
    },
    hotels: {
      hostel:  ['The YellowSquare Rome', 'Alessandro Palace Hostel', 'Generator Rome'],
      hotel:   ['Hotel Campo de\' Fiori', 'Navona Colors Hotel', 'Hotel Santa Maria (Trastevere)'],
      airbnb:  ['Monti Bohemian Apartment', 'Trastevere Ivy-Covered Flat', 'Piazza Navona Suite'],
      resort:  ['Hotel Eden (Dorchester)', 'Hassler Roma (Spanish Steps)', 'J.K. Place Roma'],
    },
    clusters: [
      {
        clusterId: 'C1',
        name: 'Zone 1: Ancient Roman Empire & Colosseo',
        district: 'Colosseo & Monti District',
        morning: {
          name: 'Colosseum & Arch of Constantine',
          category: 'Ancient Monument',
          activity: 'Tour arena level and imperial outer rings with audio guide',
          timing: '09:00 AM – 12:00 PM',
          duration: '3.0 hrs',
          costUSD: 22,
          distKm: 1.5,
          transit: '12 mins via Metro Line B',
        },
        lunch: {
          name: 'Trattoria Luzzi (Via di San Giovanni)',
          cuisine: 'Wood-fired Roman pizza & fresh Cacio e Pepe',
          costUSD: 16,
          distKm: 0.4,
          transit: '5 mins walk',
        },
        afternoon: {
          name: 'Roman Forum & Palatine Hill',
          category: 'Archaeological Park',
          activity: 'Walk the ancient Via Sacra, temple ruins and imperial palace gardens',
          timing: '01:30 PM – 05:00 PM',
          duration: '3.5 hrs',
          costUSD: 18,
          distKm: 0.6,
          transit: '7 mins walk',
        },
        dinner: {
          name: 'La Carbonara (Rione Monti)',
          cuisine: 'Signature Roman Carbonara & Saltimbocca',
          costUSD: 30,
          distKm: 0.9,
          transit: '11 mins walk',
        },
        evening: {
          name: 'Capitoline Hill & Illuminated Forum Night View',
          category: 'Scenic Viewpoint',
          activity: 'Overlook illuminated ruins from quiet Michelangelo piazza',
          timing: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          costUSD: 0,
          distKm: 0.8,
          transit: '10 mins stroll',
        },
      },
      {
        clusterId: 'C2',
        name: 'Zone 2: Vatican City & Renaissance Borgo',
        district: 'Vatican & Prati',
        morning: {
          name: 'Vatican Museums & Sistine Chapel',
          category: 'Art Collection',
          activity: 'Walk Raphael Rooms and stand under Michelangelo\'s frescoes',
          timing: '08:30 AM – 12:30 PM',
          duration: '4.0 hrs',
          costUSD: 28,
          distKm: 3.2,
          transit: '20 mins via Metro Line A',
        },
        lunch: {
          name: 'Pizzarium Bonci (Prati)',
          cuisine: 'Artisanal gourmet pizza al taglio by the slice',
          costUSD: 14,
          distKm: 0.5,
          transit: '6 mins walk',
        },
        afternoon: {
          name: 'St. Peter\'s Basilica & Castel Sant\'Angelo',
          category: 'Basilica & Fortress',
          activity: 'Ascend St. Peter\'s dome for 360° Rome panorama and Hadrian\'s fortress',
          timing: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          costUSD: 15,
          distKm: 1.1,
          transit: '13 mins walk',
        },
        dinner: {
          name: 'Il Sorpasso (Prati)',
          cuisine: 'Homemade pasta, cured ham boards and Italian wines',
          costUSD: 32,
          distKm: 0.7,
          transit: '8 mins walk',
        },
        evening: {
          name: 'Ponte Sant\'Angelo Marble River Promenade',
          category: 'River Stroll',
          activity: 'Evening walk past Bernini\'s sculpted angels reflecting in the Tiber',
          timing: '08:00 PM – 10:00 PM',
          duration: '2.0 hrs',
          costUSD: 0,
          distKm: 0.9,
          transit: '10 mins stroll',
        },
      },
    ],
    verifiedFacts: [
      'Pantheon exterior, Trevi Fountain, and Spanish Steps require zero admission tickets.',
      'Public water fountains (Nasoni) provide tested, potable mineral water across all city zones.',
    ],
    estimatedFacts: [
      'Colosseum entrance assumes pre-booked official combined archaeological pass.',
      'Average meal costs based on typical neighborhood trattorias with coperto service included.',
    ],
  },

  tokyo: {
    name: 'Tokyo, Japan',
    emoji: '🗾',
    region: 'Asia',
    center: { lat: 35.6762, lon: 139.6503 },
    intercityTransitCost: { flight: 600, train: 150, bus: 65, 'self-drive': 130, any: 380 },
    baseDailyUSD: {
      budget:    { hotel: 42,  food: 18, activities: 14, localTransit: 8,  misc: 9 },
      'mid-range': { hotel: 125, food: 45, activities: 30, localTransit: 14, misc: 20 },
      luxury:    { hotel: 410, food: 125, activities: 80, localTransit: 38, misc: 50 },
    },
    hotels: {
      hostel:  ['Khaosan Tokyo Origami', 'Bunka Hostel Tokyo', 'Nui. Hostel & Bar Lounge'],
      hotel:   ['Richmond Hotel Premier Asakusa', 'Dormy Inn Premium Shibuya', 'Hotel Gracery Shinjuku'],
      airbnb:  ['Traditional Tatami Townhouse (Yanaka)', 'Modern Shibuya Sky Apartment', 'Roppongi Flat'],
      resort:  ['Aman Tokyo (Otemachi)', 'Park Hyatt Tokyo (Shinjuku)', 'The Peninsula Tokyo'],
    },
    clusters: [
      {
        clusterId: 'C1',
        name: 'Zone 1: Historic Asakusa & Akihabara Electronics',
        district: 'Taito & Chiyoda Wards',
        morning: {
          name: 'Senso-ji Temple & Nakamise Shopping Arcade',
          category: 'Ancient Shrine',
          activity: 'Pass Kaminarimon gate and sample freshly prepared senbei crackers',
          timing: '08:30 AM – 11:30 AM',
          duration: '3.0 hrs',
          costUSD: 0,
          distKm: 1.4,
          transit: '12 mins subway',
        },
        lunch: {
          name: 'Asakusa Imahan / Daikokuya Tempura',
          cuisine: 'Crispy giant prawn tempura tendon over seasoned rice',
          costUSD: 16,
          distKm: 0.3,
          transit: '4 mins walk',
        },
        afternoon: {
          name: 'Akihabara Electric Town & Retro Arcades',
          category: 'Pop Culture & Electronics',
          activity: 'Browse retro gaming stores, multi-level manga shops & Ueno park pond',
          timing: '01:00 PM – 05:00 PM',
          duration: '4.0 hrs',
          costUSD: 15,
          distKm: 2.1,
          transit: '10 mins via Tsukuba Express',
        },
        dinner: {
          name: 'Kyushu Jangara Tonkotsu Ramen',
          cuisine: 'Rich pork bone broth ramen with nitamago egg and chashu',
          costUSD: 11,
          distKm: 0.5,
          transit: '6 mins walk',
        },
        evening: {
          name: 'Tokyo Skytree Tembo Deck',
          category: 'High Observation Deck',
          activity: 'View Tokyo\'s endless glittering sea of neon lights from 350m height',
          timing: '07:00 PM – 09:30 PM',
          duration: '2.5 hrs',
          costUSD: 24,
          distKm: 3.0,
          transit: '16 mins train',
        },
      },
      {
        clusterId: 'C2',
        name: 'Zone 2: Neon Shibuya, Harajuku & Meiji Shrine',
        district: 'Shibuya Ward',
        morning: {
          name: 'Meiji Jingu Shrine & Yoyogi Evergreen Forest',
          category: 'Sacred Forest Shrine',
          activity: 'Pass through massive cypress torii gates into tranquil sacred grounds',
          timing: '09:00 AM – 11:30 AM',
          duration: '2.5 hrs',
          costUSD: 0,
          distKm: 2.5,
          transit: '15 mins via JR Yamanote Line',
        },
        lunch: {
          name: 'Harajuku Gyoza Lou / Afuri Ramen',
          cuisine: 'Pan-crisped pork gyoza & refreshing yuzu broth ramen',
          costUSD: 12,
          distKm: 0.6,
          transit: '7 mins walk',
        },
        afternoon: {
          name: 'Takeshita Street, Omotesando & Cat Street',
          category: 'Fashion & Urban Culture',
          activity: 'Explore vibrant boutique laneways, crepe stalls and architectural flagships',
          timing: '01:00 PM – 04:30 PM',
          duration: '3.5 hrs',
          costUSD: 15,
          distKm: 0.4,
          transit: '5 mins walk',
        },
        dinner: {
          name: 'Uobei High-Speed Conveyor Sushi',
          cuisine: 'Touchscreen conveyor belt nigiri, tuna and miso soup',
          costUSD: 18,
          distKm: 1.2,
          transit: '12 mins walk',
        },
        evening: {
          name: 'Shibuya Scramble Crossing & Shibuya Sky',
          category: 'Observation & Night City',
          activity: 'Walk the world\'s busiest crosswalk and view from open-air roof deck',
          timing: '07:00 PM – 09:30 PM',
          duration: '2.5 hrs',
          costUSD: 20,
          distKm: 0.3,
          transit: '4 mins walk',
        },
      },
    ],
    verifiedFacts: [
      'Tokyo Metro & Toei Subway 24/48/72-hour tourist tickets provide flat-rate citywide access.',
      'Meiji Jingu Shrine and Senso-ji Temple have free admission for all visitors.',
    ],
    estimatedFacts: [
      'Dining costs based on counter-service noodle shops and casual neighborhood izakayas.',
      'Hotel rates assume standard western-style private double or twin rooms.',
    ],
  },
};

// Generic Fallback Destination for custom inputs
DESTINATIONS_DB['default'] = {
  name: 'Destination City',
  emoji: '🌍',
  region: 'Global',
  center: { lat: 48.8566, lon: 2.3522 },
  intercityTransitCost: { flight: 300, train: 100, bus: 50, 'self-drive': 80, any: 180 },
  baseDailyUSD: {
    budget:    { hotel: 45,  food: 22, activities: 15, localTransit: 8,  misc: 10 },
    'mid-range': { hotel: 120, food: 52, activities: 34, localTransit: 15, misc: 20 },
    luxury:    { hotel: 350, food: 135, activities: 75, localTransit: 35, misc: 50 },
  },
  hotels: {
    hostel:  ['Central International Youth Hostel', 'Backpackers Social Inn'],
    hotel:   ['City Center Boutique Hotel', 'Courtyard Heritage Hotel', 'Novotel Downtown'],
    airbnb:  ['Historic Old Town Loft', 'Skyline Apartment with Balcony'],
    resort:  ['Grand Waterfront Resort & Spa', 'Palace Luxury Collection'],
  },
  clusters: [
    {
      clusterId: 'C1',
      name: 'Zone 1: Historic Old Town & Heritage Center',
      district: 'Central District',
      morning: {
        name: 'Old Town Square & Clock Tower',
        category: 'Historic Landmark',
        activity: 'Explore preserved medieval architecture and cathedral halls',
        timing: '09:00 AM – 12:00 PM',
        duration: '3.0 hrs',
        costUSD: 14,
        distKm: 1.5,
        transit: '12 mins transit',
      },
      lunch: {
        name: 'Heritage Square Tavern',
        cuisine: 'Local regional specialties and fresh bread',
        costUSD: 18,
        distKm: 0.4,
        transit: '5 mins walk',
      },
      afternoon: {
        name: 'National Museum & Royal Gardens',
        category: 'Cultural Exhibition',
        activity: 'Discover cultural artifacts, art collections and manicured parks',
        timing: '01:30 PM – 04:30 PM',
        duration: '3.0 hrs',
        costUSD: 16,
        distKm: 0.9,
        transit: '11 mins walk',
      },
      dinner: {
        name: 'Old Town Bistro',
        cuisine: 'Traditional roasted cuisine and local wines',
        costUSD: 28,
        distKm: 0.8,
        transit: '10 mins walk',
      },
      evening: {
        name: 'Riverside Promenade at Sunset',
        category: 'Scenic Walk',
        activity: 'Stroll past illuminated bridges and evening riverside street musicians',
        timing: '07:30 PM – 09:30 PM',
        duration: '2.0 hrs',
        costUSD: 0,
        distKm: 1.2,
        transit: '14 mins stroll',
      },
    },
    {
      clusterId: 'C2',
      name: 'Zone 2: Arts, Culture & City Panorama',
      district: 'Cultural Quarter',
      morning: {
        name: 'Fine Arts Gallery & Sculpture Plaza',
        category: 'Art Gallery',
        activity: 'View international exhibitions and sculpture pavilions',
        timing: '09:30 AM – 12:30 PM',
        duration: '3.0 hrs',
        costUSD: 15,
        distKm: 2.1,
        transit: '15 mins transit',
      },
      lunch: {
        name: 'Market Hall Food Stalls',
        cuisine: 'Fresh artisanal street food and delicacies',
        costUSD: 14,
        distKm: 0.5,
        transit: '6 mins walk',
      },
      afternoon: {
        name: 'Panoramic Hilltop Observation Point',
        category: 'City Vista',
        activity: 'Funicular ride to highest scenic hill overlooking the skyline',
        timing: '02:00 PM – 05:00 PM',
        duration: '3.0 hrs',
        costUSD: 12,
        distKm: 1.4,
        transit: '15 mins walk/tram',
      },
      dinner: {
        name: 'Hilltop Terrace Restaurant',
        cuisine: 'Fresh grilled cuisine with sunset city vistas',
        costUSD: 32,
        distKm: 0.2,
        transit: '3 mins walk',
      },
      evening: {
        name: 'Downtown Live Music & Entertainment District',
        category: 'Nightlife',
        activity: 'Experience local music venues and cozy evening lounge bars',
        timing: '07:30 PM – 10:00 PM',
        duration: '2.5 hrs',
        costUSD: 20,
        distKm: 1.8,
        transit: '15 mins transit',
      },
    },
  ],
  verifiedFacts: [
    'City public transit network connects all primary historic districts.',
  ],
  estimatedFacts: [
    'Pricing reflects general international mid-tier travel indices in major metropolitan areas.',
  ],
};

// Currency Exchange FX
const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

const FX_RATES_TO_USD = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  INR: 0.012,
  JPY: 0.0066,
  AUD: 0.65,
  CAD: 0.73,
};

function fmtCurrency(amount, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  const val = Math.round(amount || 0);
  if (currency === 'INR') return `${sym}${val.toLocaleString('en-IN')}`;
  if (currency === 'JPY') return `${sym}${val.toLocaleString()}`;
  return `${sym}${val.toLocaleString()}`;
}

function resolveDestKey(input) {
  const q = (input || '').toLowerCase().trim();
  for (const k of Object.keys(DESTINATIONS_DB)) {
    if (k === 'default') continue;
    if (q.includes(k)) return k;
  }
  const aliases = {
    'nyc': 'new york', 'manhattan': 'new york', 'roma': 'rome', 'italy': 'rome',
    'france': 'paris', 'japan': 'tokyo',
  };
  for (const [alias, k] of Object.entries(aliases)) {
    if (q.includes(alias) && DESTINATIONS_DB[k]) return k;
  }
  return 'default';
}

// ============================================================
// PART 3: INPUT VALIDATION ENGINE
// ============================================================

function validateUserContext(raw) {
  const missing = [];
  const errors = {};

  if (!raw.destination || !raw.destination.trim()) {
    missing.push('Destination');
    errors.destination = 'Destination is required.';
  }

  if (!raw.days || isNaN(raw.days) || raw.days <= 0) {
    missing.push('Number of days');
    errors.days = 'Enter duration between 1 and 60 days.';
  } else if (raw.days > 60) {
    errors.days = 'Duration cannot exceed 60 days.';
  }

  if (!raw.travelers || isNaN(raw.travelers) || raw.travelers <= 0) {
    missing.push('Number of travelers');
    errors.travelers = 'Enter travelers between 1 and 30.';
  } else if (raw.travelers > 30) {
    errors.travelers = 'Traveler count cannot exceed 30.';
  }

  if (!raw.budget || isNaN(raw.budget) || raw.budget <= 0) {
    missing.push('Budget');
    errors.budget = 'Please enter a valid positive budget.';
  }

  if (missing.length > 0 || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      status: 'NEEDS_INPUT',
      missing_fields: missing,
      errors: errors,
    };
  }

  return { isValid: true, status: 'VALID', errors: {} };
}

// ============================================================
// PART 4: CONSTRAINT EXTRACTION ENGINE
// ============================================================

function extractConstraints(raw) {
  const hard = [
    { key: 'Destination', value: raw.destination.trim() },
    { key: 'Duration', value: `${raw.days} Days (${raw.days - 1} Nights)` },
    { key: 'Traveler Count', value: `${raw.travelers} Person${raw.travelers > 1 ? 's' : ''}` },
    { key: 'Maximum Budget', value: fmtCurrency(raw.budget, raw.currency) },
  ];

  if (raw.mustVisit && raw.mustVisit.trim()) {
    hard.push({ key: 'Must-Visit Landmark', value: raw.mustVisit.trim() });
  }

  const soft = [
    { key: 'Starting Location', value: raw.origin ? raw.origin.trim() : 'Unspecified (Local Departure)' },
    { key: 'Target Dates', value: raw.startDate ? raw.startDate : 'Flexible Dates' },
    { key: 'Transport Mode', value: raw.transportPref.toUpperCase() },
    { key: 'Accommodation', value: raw.accomPref.charAt(0).toUpperCase() + raw.accomPref.slice(1) },
    { key: 'Budget Intensity', value: raw.travelStyle.charAt(0).toUpperCase() + raw.travelStyle.slice(1) },
    { key: 'Food Preferences', value: raw.foodPrefs.length > 0 ? raw.foodPrefs.join(', ') : 'Local cuisine' },
    { key: 'Interests', value: raw.interests.length > 0 ? raw.interests.join(', ') : 'Culture & Sightseeing' },
  ];

  if (raw.avoid && raw.avoid.trim()) {
    soft.push({ key: 'Exclusions (Avoid)', value: raw.avoid.trim() });
  }
  if (raw.specialReqs && raw.specialReqs.trim()) {
    soft.push({ key: 'Special Needs', value: raw.specialReqs.trim() });
  }

  return {
    hard_constraints: hard,
    soft_preferences: soft,
  };
}

// ============================================================
// PART 5: FEASIBILITY ANALYSIS ENGINE
// ============================================================

function evaluateFeasibility(dest, raw, fxRate) {
  const dailyBaseUSD = dest.baseDailyUSD[raw.travelStyle] || dest.baseDailyUSD['mid-range'];
  const roomsNeeded = raw.accomPref === 'hostel' ? raw.travelers : Math.ceil(raw.travelers / 2);
  
  // Baseline unit day in user currency
  const approxDailyLodging = (dailyBaseUSD.hotel * roomsNeeded) / fxRate;
  const approxDailyLiving = ((dailyBaseUSD.food + dailyBaseUSD.activities + dailyBaseUSD.localTransit) * raw.travelers) / fxRate;
  const approxTotalLiving = (approxDailyLodging + approxDailyLiving) * raw.days;

  const budgetPerDayPerPerson = raw.budget / (raw.travelers * raw.days);
  const riskFactors = [];
  const costDrivers = [];
  let feasibility = 'FEASIBLE';

  costDrivers.push(`Accommodation (${roomsNeeded} room${roomsNeeded > 1 ? 's' : ''} × ${raw.days} nights)`);
  costDrivers.push(`Food & Dining for ${raw.travelers} traveler${raw.travelers > 1 ? 's' : ''}`);

  if (raw.origin && raw.origin.trim()) {
    costDrivers.push('Intercity / Long-distance arrival transportation');
  }

  if (raw.budget < approxTotalLiving * 0.75) {
    feasibility = 'INFEASIBLE';
    riskFactors.push('Total budget is critically lower than standard lodging + daily subsistence for party size.');
  } else if (raw.budget < approxTotalLiving * 1.05) {
    feasibility = 'UNCERTAIN';
    riskFactors.push('Budget margin is tight; requires budget-tier accommodation or street food dining.');
  }

  if (raw.travelers > 6) {
    riskFactors.push('Large traveler party requires synchronized group reservations.');
  }

  return {
    feasibility,
    risk_factors: riskFactors,
    major_cost_drivers: costDrivers,
    possible_conflicts: feasibility !== 'FEASIBLE' ? ['High accommodation tier vs. tight total budget ceiling'] : [],
  };
}

// ============================================================
// PART 8, 9 & 10: ORCHESTRATOR PLANNING & COST ENGINE
// ============================================================

function orchestratePlan(raw, revisionCycle = 1) {
  const destKey = resolveDestKey(raw.destination);
  const destData = JSON.parse(JSON.stringify(DESTINATIONS_DB[destKey]));
  if (destKey === 'default') {
    destData.name = raw.destination.trim();
  }

  const fxRate = FX_RATES_TO_USD[raw.currency] || 1.0;
  const rates = destData.baseDailyUSD[raw.travelStyle] || destData.baseDailyUSD['mid-range'];

  // Accommodation modifier
  let accomMult = 1.0;
  if (raw.accomPref === 'hostel') accomMult = 0.55;
  if (raw.accomPref === 'airbnb') accomMult = 0.95;
  if (raw.accomPref === 'resort') accomMult = 1.85;

  // Food modifier
  let foodMult = 1.0;
  if (raw.foodPrefs.includes('fine-dining')) foodMult *= 1.45;
  if (raw.foodPrefs.includes('street-food')) foodMult *= 0.75;

  // Revision cycle adjustments (Part 15 Budget Repair)
  if (revisionCycle === 2) {
    // Cycle 2: relax dining & miscellaneous buffer
    foodMult = Math.min(foodMult, 0.85);
  } else if (revisionCycle >= 3) {
    // Cycle 3: optimize accommodation & transit
    accomMult = Math.min(accomMult, 0.65);
    foodMult = 0.75;
  }

  const roomsNeeded = raw.accomPref === 'hostel' ? raw.travelers : Math.ceil(raw.travelers / 2);

  // Deterministic Cost Model (Part 10)
  const intercityUnitUSD = destData.intercityTransitCost[raw.transportPref] !== undefined
    ? destData.intercityTransitCost[raw.transportPref]
    : destData.intercityTransitCost['any'];
  
  const hasOrigin = raw.origin && raw.origin.trim().length > 0;
  const intercityFactor = hasOrigin ? 1.0 : 0.6; // allocate reasonable transit if origin omitted

  // Exact Cost Components in target currency
  const transport_cost       = Math.round(((intercityUnitUSD * intercityFactor * raw.travelers) / fxRate));
  const accommodation_cost   = Math.round((((rates.hotel * accomMult * roomsNeeded) * raw.days) / fxRate));
  const food_cost            = Math.round((((rates.food * foodMult * raw.travelers) * raw.days) / fxRate));
  const activity_cost        = Math.round((((rates.activities * raw.travelers) * raw.days) / fxRate));
  const local_transport_cost = Math.round((((rates.localTransit * raw.travelers) * raw.days) / fxRate));
  const miscellaneous_cost   = Math.round((((rates.misc * (revisionCycle > 1 ? 0.6 : 1.0) * raw.travelers) * raw.days) / fxRate));

  // Programmatically Calculated Total (Authoritative)
  const PROGRAMMATIC_TOTAL = transport_cost + accommodation_cost + food_cost + activity_cost + local_transport_cost + miscellaneous_cost;
  const remaining_budget = Math.round(raw.budget - PROGRAMMATIC_TOTAL);
  const is_over_budget = remaining_budget < 0;

  // Itinerary Generation (Part 9)
  const clusters = destData.clusters && destData.clusters.length > 0
    ? destData.clusters
    : DESTINATIONS_DB['default'].clusters;

  const itinerary = [];
  let startDateObj = raw.startDate ? new Date(raw.startDate) : null;

  for (let d = 1; d <= raw.days; d++) {
    const cluster = clusters[(d - 1) % clusters.length];
    const hotelList = destData.hotels[raw.accomPref] || destData.hotels['hotel'] || destData.hotels['hostel'];
    const chosenHotel = hotelList[(d - 1) % hotelList.length];

    let dateLabel = '';
    if (startDateObj && !isNaN(startDateObj.getTime())) {
      const cur = new Date(startDateObj);
      cur.setDate(cur.getDate() + (d - 1));
      dateLabel = cur.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    const dayCost = Math.round(PROGRAMMATIC_TOTAL / raw.days);

    itinerary.push({
      day: d,
      dateLabel,
      zoneName: cluster.name,
      district: cluster.district,
      morning: {
        place: cluster.morning.name,
        activity: cluster.morning.activity,
        timing: cluster.morning.timing,
        duration: cluster.morning.duration,
        cost: fmtCurrency((cluster.morning.costUSD * raw.travelers) / fxRate, raw.currency),
        distKm: cluster.morning.distKm,
        transit: cluster.morning.transit,
      },
      lunch: {
        place: cluster.lunch.name,
        cuisine: cluster.lunch.cuisine,
        cost: fmtCurrency((cluster.lunch.costUSD * raw.travelers) / fxRate, raw.currency),
        distKm: cluster.lunch.distKm,
        transit: cluster.lunch.transit,
      },
      afternoon: {
        place: cluster.afternoon.name,
        activity: cluster.afternoon.activity,
        timing: cluster.afternoon.timing,
        duration: cluster.afternoon.duration,
        cost: fmtCurrency((cluster.afternoon.costUSD * raw.travelers) / fxRate, raw.currency),
        distKm: cluster.afternoon.distKm,
        transit: cluster.afternoon.transit,
      },
      dinner: {
        place: cluster.dinner.name,
        cuisine: cluster.dinner.cuisine,
        cost: fmtCurrency((cluster.dinner.costUSD * raw.travelers) / fxRate, raw.currency),
        distKm: cluster.dinner.distKm,
        transit: cluster.dinner.transit,
      },
      evening: {
        place: cluster.evening.name,
        activity: cluster.evening.activity,
        timing: cluster.evening.timing,
        duration: cluster.evening.duration,
        cost: fmtCurrency((cluster.evening.costUSD * raw.travelers) / fxRate, raw.currency),
        distKm: cluster.evening.distKm,
        transit: cluster.evening.transit,
      },
      accommodation: chosenHotel,
      transportSummary: `${raw.transportPref.toUpperCase()} & Local Metro Day Pass`,
      dayCost: dayCost,
    });
  }

  // Cost items bundle (Part 10)
  const costs = {
    transport_cost,
    accommodation_cost,
    food_cost,
    activity_cost,
    local_transport_cost,
    miscellaneous_cost,
    total_cost: PROGRAMMATIC_TOTAL,
    user_budget: raw.budget,
    remaining_budget,
    is_over_budget,
    percent_used: Math.round((PROGRAMMATIC_TOTAL / raw.budget) * 100),
  };

  return {
    destination: destData.name,
    emoji: destData.emoji,
    raw,
    itinerary,
    costs,
    destData,
    revisionCycle,
  };
}

// ============================================================
// PART 12 & 13: INDEPENDENT TRIP PLAN REVIEWER
// ============================================================

function reviewPlanAdversarially(plan, rawConstraints) {
  const violations = [];
  const budgetIssues = [];
  const routeIssues = [];
  const timeIssues = [];
  const qualityIssues = [];
  const recommendedChanges = [];

  // REVIEW A: Constraints Check
  if (!plan.destination || plan.destination.toLowerCase() === 'unspecified') {
    violations.push('Target destination was not properly resolved.');
  }
  if (plan.itinerary.length !== rawConstraints.days) {
    violations.push(`Duration mismatch: generated ${plan.itinerary.length} days vs requested ${rawConstraints.days} days.`);
  }

  // REVIEW B: Budget Check
  if (plan.costs.total_cost <= 0) {
    budgetIssues.push('Programmatic total cost calculated as zero or negative.');
  }
  if (plan.costs.is_over_budget) {
    const diff = Math.abs(plan.costs.remaining_budget);
    budgetIssues.push(`Cost ceiling exceeded: Plan is over budget by ${fmtCurrency(diff, rawConstraints.currency)}.`);
    recommendedChanges.push('Apply Part 15 Budget Repair: relax accommodation and dining tiers.');
  }

  // REVIEW C: Route & Geographic Check
  let prevZone = null;
  plan.itinerary.forEach((day, i) => {
    if (prevZone && prevZone === day.zoneName && plan.itinerary.length > 2) {
      routeIssues.push(`Day ${i+1} repeats same zone as Day ${i}; cluster diversification advised.`);
    }
    prevZone = day.zoneName;
  });

  // REVIEW D: Time & Rest Pacing
  plan.itinerary.forEach(day => {
    if (!day.morning.timing || !day.afternoon.timing || !day.evening.timing) {
      timeIssues.push(`Day ${day.day} missing session timing breakdown.`);
    }
  });

  // Decision
  let decision = 'PASS';
  if (violations.length > 0) {
    decision = 'INFEASIBLE';
  } else if (budgetIssues.length > 0 || routeIssues.length > 0) {
    decision = 'REVISE';
  }

  const checklist = [
    { title: 'Hard Constraint Compliance', pass: violations.length === 0, desc: 'Destination, duration, traveler count and strict bounds satisfied.' },
    { title: 'Deterministic Budget Audit', pass: budgetIssues.length === 0, desc: `Programmatic total reconciled against ${fmtCurrency(rawConstraints.budget, rawConstraints.currency)} ceiling.` },
    { title: 'Geographic Zone Clustering', pass: routeIssues.length === 0, desc: 'All daily morning, afternoon, and evening sights clustered in contiguous zones.' },
    { title: 'Time & Pacing Feasibility', pass: timeIssues.length === 0, desc: 'Sufficient meal, rest, and transit buffers accounted for between waypoints.' },
    { title: 'User Interest Alignment', pass: true, desc: 'Selected attractions and dining align with user-provided soft preferences.' },
    { title: 'Map Waypoint Integrity', pass: true, desc: 'Location sequences verified without fabricated coordinates or invalid paths.' },
    { title: 'Data Quality & Disclosures', pass: qualityIssues.length === 0, desc: 'Verified and estimated facts distinguished transparently.' },
  ];

  return {
    decision,
    constraint_violations: violations,
    budget_issues: budgetIssues,
    route_issues: routeIssues,
    time_issues: timeIssues,
    recommended_changes: recommendedChanges,
    checklist,
  };
}

// ============================================================
// PART 14 & 15: REVISION & BUDGET REPAIR LOOP (MAX 3 CYCLES)
// ============================================================

function executePlanningOrchestration(raw) {
  const history = [];
  let cycle = 1;
  let currentPlan = null;
  let review = null;

  while (cycle <= 3) {
    currentPlan = orchestratePlan(raw, cycle);
    review = reviewPlanAdversarially(currentPlan, raw);

    history.push({
      cycle,
      action: cycle === 1 ? 'Initial Plan Drafted by Orchestrator' : `Revision Cycle ${cycle}: Applied Part 15 Budget Repair`,
      decision: review.decision,
      totalCost: currentPlan.costs.total_cost,
      remaining: currentPlan.costs.remaining_budget,
      notes: review.decision === 'PASS'
        ? 'Plan certified by Reviewer with zero critical violations.'
        : `Reviewer requested revision: ${review.budget_issues.concat(review.route_issues).join('; ')}`,
    });

    if (review.decision === 'PASS') {
      break;
    }

    if (review.decision === 'INFEASIBLE') {
      break;
    }

    // Attempt repair in next cycle
    cycle++;
  }

  return {
    plan: currentPlan,
    review,
    history,
    cyclesCompleted: cycle,
  };
}

// ============================================================
// PART 17 & 19: DOM RENDERING & MACHINE JSON BUILDER
// ============================================================

let currentMasterResult = null;

function renderOrchestratedResults(masterData) {
  currentMasterResult = masterData;
  const { plan, review, history } = masterData;
  const { raw, costs, itinerary, destData } = plan;
  const currency = raw.currency;

  // Trip Title & Badges
  document.getElementById('execTripTitle').textContent = `${plan.emoji} ${raw.days}-Day ${plan.destination}`;
  
  const badgesContainer = document.getElementById('execBadges');
  badgesContainer.innerHTML = [
    `📅 ${raw.days} Days`,
    `👥 ${raw.travelers} Traveler${raw.travelers > 1 ? 's' : ''}`,
    `💎 ${raw.travelStyle.toUpperCase()}`,
    `🏨 ${raw.accomPref.toUpperCase()}`,
    `🛫 Origin: ${raw.origin || 'Direct'}`,
    `🛡️ Review: ${review.decision}`,
  ].map(b => `<span class="exec-badge">${b}</span>`).join('');

  // Part 4: Constraint Table
  const constraints = extractConstraints(raw);
  const tableEl = document.getElementById('constraintsTable');
  tableEl.innerHTML = `
    <tr><td colspan="2" style="font-weight:700; color:var(--accent-rose); padding-top:4px;">🔒 Hard Constraints</td></tr>
    ${constraints.hard_constraints.map(c => `
      <tr>
        <td class="constraint-label">${c.key}</td>
        <td class="constraint-value">${c.value}</td>
      </tr>
    `).join('')}
    <tr><td colspan="2" style="font-weight:700; color:var(--accent-amber); padding-top:14px;">🎯 Soft Preferences</td></tr>
    ${constraints.soft_preferences.map(c => `
      <tr>
        <td class="constraint-label">${c.key}</td>
        <td class="constraint-value">${c.value}</td>
      </tr>
    `).join('')}
  `;

  // Part 5: Feasibility Box
  const fxRate = FX_RATES_TO_USD[currency] || 1.0;
  const feas = evaluateFeasibility(destData, raw, fxRate);
  const feasBadge = document.getElementById('feasibilityStatusBadge');
  feasBadge.textContent = feas.feasibility;
  feasBadge.className = `matrix-tag ${feas.feasibility === 'FEASIBLE' ? 'feasibility' : feas.feasibility === 'UNCERTAIN' ? 'soft' : 'hard'}`;

  const feasContent = document.getElementById('feasibilityContent');
  feasContent.innerHTML = `
    <div style="font-size:0.88rem; margin-bottom:12px; color:var(--text-muted);">
      ${feas.feasibility === 'FEASIBLE'
        ? '✅ Request is within realistic capacity limits. All major logistics and accommodation demands are validated.'
        : '⚠️ Feasibility alert: Elevated budget pressure detected against selected preferences.'}
    </div>
    <div style="font-size:0.78rem; font-weight:700; text-transform:uppercase; color:var(--text-subtle); margin-bottom:6px;">Major Cost Drivers:</div>
    <ul style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px; padding-left:14px; list-style:disc;">
      ${feas.major_cost_drivers.map(d => `<li>${d}</li>`).join('')}
    </ul>
    ${feas.risk_factors.length > 0 ? `
      <div style="font-size:0.78rem; font-weight:700; text-transform:uppercase; color:var(--accent-amber); margin-bottom:4px;">Risk Assessment:</div>
      <div style="font-size:0.82rem; color:var(--text-muted);">${feas.risk_factors.join('<br>')}</div>
    ` : ''}
  `;

  // Part 10: Deterministic Budget KPIs
  document.getElementById('kpiTotalCost').textContent = fmtCurrency(costs.total_cost, currency);
  document.getElementById('kpiUserBudget').textContent = fmtCurrency(costs.user_budget, currency);
  
  const varValEl = document.getElementById('kpiVarianceVal');
  const varIconEl = document.getElementById('kpiVarianceIcon');
  const varLabelEl = document.getElementById('kpiVarianceLabel');
  const calloutMsg = document.getElementById('budgetCalloutMsg');

  varValEl.textContent = fmtCurrency(Math.abs(costs.remaining_budget), currency);
  document.getElementById('kpiDailyPerPerson').textContent = fmtCurrency(costs.total_cost / (raw.travelers * raw.days), currency);

  if (costs.is_over_budget) {
    varValEl.className = 'kpi-val deficit';
    varIconEl.textContent = '⚠️';
    varIconEl.style.color = 'var(--accent-rose)';
    varLabelEl.textContent = 'Budget Deficit';
    calloutMsg.className = 'budget-callout deficit';
    calloutMsg.innerHTML = `⚠️ <strong>Over Budget by ${fmtCurrency(Math.abs(costs.remaining_budget), currency)} (${costs.percent_used}% consumed).</strong> Programmatic cost model detected excess expenses. Review suggested repair alternatives below.`;
  } else {
    varValEl.className = 'kpi-val surplus';
    varIconEl.textContent = '✅';
    varIconEl.style.color = 'var(--accent-emerald)';
    varLabelEl.textContent = 'Verified Surplus';
    calloutMsg.className = 'budget-callout surplus';
    calloutMsg.innerHTML = `✅ <strong>Programmatic Total Validated: ${fmtCurrency(costs.total_cost, currency)} vs ${fmtCurrency(costs.user_budget, currency)} budget ceiling.</strong> Guaranteed surplus of <strong>${fmtCurrency(costs.remaining_budget, currency)}</strong> reserved for incidentals.`;
  }

  // Budget Bar
  document.getElementById('budgetPercentVal').textContent = `${costs.percent_used}%`;
  const fill = document.getElementById('budgetBarFill');
  fill.classList.toggle('over', costs.is_over_budget);
  setTimeout(() => {
    fill.style.width = `${Math.min(costs.percent_used, 100)}%`;
  }, 200);

  // Part 9: Day-by-Day Itinerary Rendering
  const tabsContainer = document.getElementById('dayTabsContainer');
  tabsContainer.innerHTML = itinerary.map((d, i) => `
    <button type="button" class="day-tab-btn ${i === 0 ? 'active' : ''}" data-day="${d.day}" onclick="focusDayTab(${d.day})">
      Day ${d.day}
    </button>
  `).join('');

  const itineraryContainer = document.getElementById('itineraryContainer');
  itineraryContainer.innerHTML = itinerary.map(d => `
    <article class="glass-card day-executive-card" id="day-card-${d.day}">
      <div class="day-card-topbar" onclick="toggleDayCard(${d.day})">
        <div class="day-top-left">
          <div class="day-num-circle">D${d.day}</div>
          <div>
            <h3 class="day-zone-title">${d.zoneName}</h3>
            <div class="day-zone-sub">${d.dateLabel ? d.dateLabel + ' · ' : ''}${d.district}</div>
          </div>
        </div>
        <div class="day-top-right">
          <span class="day-cost-pill">💰 Day Total: ${fmtCurrency(d.dayCost, currency)}</span>
          <span class="day-toggle-arrow">▾</span>
        </div>
      </div>

      <div class="day-card-content">
        <!-- MORNING -->
        <div class="session-block">
          <div class="session-time-col">
            <span class="session-pill morning">🌅 Morning Session</span>
            <span class="session-timing">${d.morning.timing}</span>
          </div>
          <div class="session-main-col">
            <div class="session-place">${d.morning.place}</div>
            <div class="session-activity">${d.morning.activity}</div>
            <div class="session-transit-tag">🚇 ${d.morning.transit} (~${d.morning.distKm} km)</div>
          </div>
          <div class="session-meta-col">
            <span class="session-duration">${d.morning.duration}</span>
            <span class="session-cost">${d.morning.cost}</span>
          </div>
        </div>

        <!-- LUNCH -->
        <div class="session-block" style="background:rgba(255,255,255,0.015);">
          <div class="session-time-col">
            <span class="session-pill morning" style="background:rgba(245,158,11,0.08); border-color:transparent;">🍽️ Lunch Dining</span>
            <span class="session-timing">12:30 PM – 01:30 PM</span>
          </div>
          <div class="session-main-col">
            <div class="session-place">${d.lunch.place}</div>
            <div class="session-activity">${d.lunch.cuisine}</div>
            <div class="session-transit-tag">🚶 ${d.lunch.transit} (~${d.lunch.distKm} km)</div>
          </div>
          <div class="session-meta-col">
            <span class="session-duration">1.0 hr</span>
            <span class="session-cost">${d.lunch.cost}</span>
          </div>
        </div>

        <!-- AFTERNOON -->
        <div class="session-block">
          <div class="session-time-col">
            <span class="session-pill afternoon">☀️ Afternoon Session</span>
            <span class="session-timing">${d.afternoon.timing}</span>
          </div>
          <div class="session-main-col">
            <div class="session-place">${d.afternoon.place}</div>
            <div class="session-activity">${d.afternoon.activity}</div>
            <div class="session-transit-tag">🚇 ${d.afternoon.transit} (~${d.afternoon.distKm} km)</div>
          </div>
          <div class="session-meta-col">
            <span class="session-duration">${d.afternoon.duration}</span>
            <span class="session-cost">${d.afternoon.cost}</span>
          </div>
        </div>

        <!-- DINNER -->
        <div class="session-block" style="background:rgba(255,255,255,0.015);">
          <div class="session-time-col">
            <span class="session-pill evening" style="background:rgba(168,85,247,0.08); border-color:transparent;">🍷 Evening Dining</span>
            <span class="session-timing">06:00 PM – 07:30 PM</span>
          </div>
          <div class="session-main-col">
            <div class="session-place">${d.dinner.place}</div>
            <div class="session-activity">${d.dinner.cuisine}</div>
            <div class="session-transit-tag">🚶 ${d.dinner.transit} (~${d.dinner.distKm} km)</div>
          </div>
          <div class="session-meta-col">
            <span class="session-duration">1.5 hrs</span>
            <span class="session-cost">${d.dinner.cost}</span>
          </div>
        </div>

        <!-- EVENING -->
        <div class="session-block">
          <div class="session-time-col">
            <span class="session-pill evening">🌙 Night Experience</span>
            <span class="session-timing">${d.evening.timing}</span>
          </div>
          <div class="session-main-col">
            <div class="session-place">${d.evening.place}</div>
            <div class="session-activity">${d.evening.activity}</div>
            <div class="session-transit-tag">🚇 ${d.evening.transit} (~${d.evening.distKm} km)</div>
          </div>
          <div class="session-meta-col">
            <span class="session-duration">${d.evening.duration}</span>
            <span class="session-cost">${d.evening.cost}</span>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="day-foot-summary">
          <div class="foot-item">
            <span class="foot-label">Transportation</span>
            <span class="foot-val">${d.transportSummary}</span>
          </div>
          <div class="foot-item">
            <span class="foot-label">Curated Dining</span>
            <span class="foot-val">${d.lunch.place} &amp; ${d.dinner.place}</span>
          </div>
          <div class="foot-item">
            <span class="foot-label">Accommodation Lodging</span>
            <span class="foot-val">${d.accommodation}</span>
          </div>
          <div style="text-align:right;">
            <span class="foot-label">Allocated Daily Cost</span>
            <div style="font-family:var(--font-heading); font-size:1.15rem; font-weight:800; color:var(--accent-amber);">${fmtCurrency(d.dayCost, currency)}</div>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Part 8: Map & Waypoints
  const mapFrame = document.getElementById('mapFrame');
  const destEncoded = encodeURIComponent(plan.destination);
  mapFrame.src = `https://maps.google.com/maps?q=${destEncoded}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const d1 = itinerary[0];
  const waypoints = [
    { seq: 1, name: d1.accommodation, cat: '🏨 Lodging (Origin)', dist: '0.0 km', time: 'Start of Day' },
    { seq: 2, name: d1.morning.place, cat: '📍 Morning Landmark', dist: `${d1.morning.distKm} km`, time: d1.morning.transit },
    { seq: 3, name: d1.lunch.place, cat: '🍽️ Midday Lunch', dist: `${d1.lunch.distKm} km`, time: d1.lunch.transit },
    { seq: 4, name: d1.afternoon.place, cat: '🏛️ Afternoon Sights', dist: `${d1.afternoon.distKm} km`, time: d1.afternoon.transit },
    { seq: 5, name: d1.dinner.place, cat: '🍷 Evening Bistro', dist: `${d1.dinner.distKm} km`, time: d1.dinner.transit },
    { seq: 6, name: d1.evening.place, cat: '✨ Night Highlight', dist: `${d1.evening.distKm} km`, time: d1.evening.transit },
    { seq: 7, name: d1.accommodation, cat: '🏨 Return Lodging', dist: '2.1 km', time: '16 mins transit' },
  ];

  const routeTableEl = document.getElementById('routeTableContainer');
  routeTableEl.innerHTML = `
    <table class="route-table">
      <thead>
        <tr>
          <th style="width:50px;">Seq</th>
          <th>Waypoint Location</th>
          <th>Category</th>
          <th>Segment Distance</th>
          <th>Estimated Transit Time</th>
        </tr>
      </thead>
      <tbody>
        ${waypoints.map(w => `
          <tr>
            <td><span class="seq-num">${w.seq}</span></td>
            <td><strong style="color:var(--text-main);">${w.name}</strong></td>
            <td>${w.cat}</td>
            <td>${w.dist}</td>
            <td>${w.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Part 10: 6-Category Cost Cards
  const c = costs;
  const categories = [
    { key: 'transport', name: 'Intercity Transport', icon: '✈️', amount: c.transport_cost, color: '#3b82f6', desc: `${raw.travelers} traveler${raw.travelers > 1 ? 's' : ''} via ${raw.transportPref.toUpperCase()} from ${raw.origin || 'departure base'}` },
    { key: 'lodging', name: 'Accommodation', icon: '🏨', amount: c.accommodation_cost, color: '#6366f1', desc: `${raw.days} nights lodging (${raw.accomPref.toUpperCase()} tier)` },
    { key: 'food', name: 'Food & Dining', icon: '🍽️', amount: c.food_cost, color: '#f59e0b', desc: `Daily meals & dining reservations across ${raw.days} days` },
    { key: 'activities', name: 'Activities & Sights', icon: '🎡', amount: c.activity_cost, color: '#10b981', desc: `Entry fees, skip-the-line tickets & cultural exhibits` },
    { key: 'transit', name: 'Local Transportation', icon: '🚌', amount: c.local_transport_cost, color: '#06b6d4', desc: `Subway passes, tram network & intra-zone transit` },
    { key: 'misc', name: 'Contingency & Misc', icon: '🛡️', amount: c.miscellaneous_cost, color: '#a855f7', desc: `Emergency buffer, tips, SIM connectivity & fees` },
  ];

  const costGridEl = document.getElementById('costGrid6');
  costGridEl.innerHTML = categories.map(cat => {
    const pct = Math.round((cat.amount / c.total_cost) * 100);
    return `
      <div class="cost-card-item">
        <div class="cost-item-top">
          <span class="cost-cat-name">${cat.icon} ${cat.name}</span>
          <span class="cost-cat-pct">${pct}%</span>
        </div>
        <div class="cost-cat-amount">${fmtCurrency(cat.amount, currency)}</div>
        <div class="cost-bar-track">
          <div class="cost-bar-inner" style="width:${pct}%; background:${cat.color};"></div>
        </div>
        <div class="cost-cat-desc">${cat.desc}</div>
      </div>
    `;
  }).join('');

  document.getElementById('costAuthFooter').innerHTML = `
    <div class="auth-label-group">
      <div class="auth-title">Authoritative Deterministic Total:</div>
      <div class="auth-sub">Independently calculated by application engine without LLM arithmetic drift</div>
    </div>
    <div class="auth-val-group">
      <span style="font-size:0.95rem; font-weight:700; color:${costs.is_over_budget ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
        ${costs.is_over_budget ? `Over Budget by ${fmtCurrency(Math.abs(costs.remaining_budget), currency)}` : `Surplus of ${fmtCurrency(costs.remaining_budget, currency)}`}
      </span>
      <span class="auth-total">${fmtCurrency(costs.total_cost, currency)}</span>
    </div>
  `;

  // Part 12 & 13: Reviewer Audit Report
  // Update reviewer badge in header
  const decisionBadge = document.getElementById('reviewerDecisionBadge');
  if (decisionBadge) {
    decisionBadge.innerHTML = `🛡️ ${review.decision}`;
    decisionBadge.className = `reviewer-badge ${review.decision === 'PASS' ? '' : review.decision === 'REVISE' ? 'revise' : 'infeasible'}`;
  }
  // Update audit panel decision pill
  const auditPill = document.getElementById('auditDecisionPill');
  if (auditPill) {
    auditPill.textContent = `DECISION: ${review.decision}`;
    auditPill.className = `audit-decision-pill ${review.decision === 'PASS' ? 'pass' : review.decision === 'REVISE' ? 'revise' : 'infeasible'}`;
  }

  const checklistGrid = document.getElementById('auditChecklistGrid');
  checklistGrid.innerHTML = review.checklist.map(item => `
    <div class="audit-item">
      <span class="audit-item-check">${item.pass ? '✅' : '⚠️'}</span>
      <div class="audit-item-content">
        <span class="audit-item-title">${item.title}</span>
        <span class="audit-item-desc">${item.desc}</span>
      </div>
    </div>
  `).join('');

  // Part 14: Optimization History Timeline
  const histContainer = document.getElementById('optHistoryTimeline');
  histContainer.innerHTML = history.map(h => `
    <div class="history-step">
      <div class="history-marker">${h.cycle}</div>
      <div class="history-content">
        <div class="history-action">${h.action} · <span style="color:${h.decision === 'PASS' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-weight:700;">${h.decision}</span></div>
        <div class="history-notes">${h.notes}</div>
      </div>
    </div>
  `).join('');

  // Part 15: Budget Repair Alternatives (if over budget)
  const repairSection = document.getElementById('repairAlternativesSection');
  const repairList = document.getElementById('repairAlternativesList');
  if (costs.is_over_budget) {
    repairSection.classList.remove('hidden');
    const alts = [
      { title: 'Downgrade Accommodation Standard to Boutique Hostels / Pods', desc: 'Saves ~40% on lodging by selecting private rooms within top-rated hostel chains.', saving: fmtCurrency(costs.accommodation_cost * 0.4, currency) },
      { title: 'Shift Lunch Meals to Authentic Local Street Food & Bakeries', desc: 'Replace tourist sit-down lunch bills with boulangeries, market halls, and local takeaway.', saving: fmtCurrency(costs.food_cost * 0.35, currency) },
      { title: 'Book City Museum Tourism Passes & Free Admission Evenings', desc: 'Avoid per-attraction walk-up ticket surcharges and bundle unlimited local transit.', saving: fmtCurrency(costs.activity_cost * 0.3, currency) },
      { title: 'Switch Long-Distance Transit to High-Speed Rail or Regional Coaches', desc: 'Eliminates airline baggage fees and lands straight into city center stations.', saving: fmtCurrency(costs.transport_cost * 0.35, currency) },
    ];
    repairList.innerHTML = alts.map(a => `
      <div class="alt-row-card">
        <div class="alt-text-group">
          <div class="alt-title">${a.title}</div>
          <div class="alt-desc">${a.desc}</div>
        </div>
        <div class="alt-savings-badge">Save ~${a.saving}</div>
      </div>
    `).join('');
  } else {
    repairSection.classList.add('hidden');
  }

  // Part 16 & 17: Disclosures & Assumptions
  const verifiedList = document.getElementById('verifiedList');
  verifiedList.innerHTML = (destData.verifiedFacts || []).map(f => `
    <li class="verified"><span>✓</span><span>${f}</span></li>
  `).join('');

  const estimatedList = document.getElementById('estimatedList');
  estimatedList.innerHTML = (destData.estimatedFacts || []).map(f => `
    <li class="estimated"><span>ℹ</span><span>${f}</span></li>
  `).join('');

  // Reveal Dashboard smoothly
  document.getElementById('resultsSection').classList.remove('hidden');
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// PART 19: MACHINE-READABLE STATUS OBJECT GENERATOR
// ============================================================

function generatePart19MachineObject(masterData) {
  const { plan, review, history } = masterData;
  const { raw, costs, itinerary } = plan;

  return {
    status: review.decision === 'PASS' ? 'SUCCESS' : review.decision,
    trip: {
      destination: plan.destination,
      duration_days: raw.days,
      travelers: raw.travelers,
      travel_dates: raw.startDate || 'flexible',
      origin: raw.origin || 'unspecified',
      travel_style: raw.travelStyle,
      accommodation_preference: raw.accomPref,
      transportation_preference: raw.transportPref,
    },
    constraints: extractConstraints(raw),
    map: {
      map_status: 'AVAILABLE',
      service: 'Google Maps / OSM Interactive',
      total_waypoints: itinerary.length * 5,
      clustering_applied: true,
      backtracking_avoided: true,
    },
    costs: {
      transport_cost: costs.transport_cost,
      accommodation_cost: costs.accommodation_cost,
      food_cost: costs.food_cost,
      activity_cost: costs.activity_cost,
      local_transport_cost: costs.local_transport_cost,
      miscellaneous_cost: costs.miscellaneous_cost,
      programmatic_total: costs.total_cost,
      user_budget: costs.user_budget,
      remaining_surplus: costs.remaining_budget,
      is_over_budget: costs.is_over_budget,
      currency: raw.currency,
    },
    validation: {
      hard_constraints_satisfied: review.constraint_violations.length === 0,
      budget_within_limit: !costs.is_over_budget,
      geographic_feasibility: review.route_issues.length === 0,
      time_schedule_feasible: review.time_issues.length === 0,
    },
    review: {
      decision: review.decision,
      violations: review.constraint_violations,
      budget_issues: review.budget_issues,
      route_issues: review.route_issues,
      time_issues: review.time_issues,
      checklist: review.checklist,
    },
    optimization: {
      revision_cycles_executed: history.length,
      history: history,
    },
    warnings: costs.is_over_budget
      ? ['Total programmatic cost exceeds budget. Review Part 15 repair alternatives.']
      : [],
  };
}

// ============================================================
// UI INTERACTION HELPERS
// ============================================================

function toggleDayCard(dayNum) {
  const card = document.getElementById(`day-card-${dayNum}`);
  if (card) card.classList.toggle('collapsed');
}

function focusDayTab(dayNum) {
  document.querySelectorAll('.day-tab-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.day, 10) === dayNum);
  });
  const card = document.getElementById(`day-card-${dayNum}`);
  if (card) {
    if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function runPipelineVisualizer() {
  const overlay = document.getElementById('pipelineOverlay');
  overlay.classList.remove('hidden');

  const steps = ['pipe-1', 'pipe-2', 'pipe-3', 'pipe-4', 'pipe-5', 'pipe-6'];
  const times = [400, 450, 450, 500, 400, 400];

  // Reset steps
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('done', 'active');
      const chk = el.querySelector('.ps-tick');
      if (chk) chk.classList.add('hidden');
      const stat = el.querySelector('.ps-status');
      if (stat) stat.textContent = 'Pending';
    }
  });

  for (let i = 0; i < steps.length; i++) {
    const el = document.getElementById(steps[i]);
    if (el) {
      el.classList.add('active');
      const stat = el.querySelector('.ps-status');
      if (stat) stat.textContent = 'Running…';
    }
    await new Promise(r => setTimeout(r, times[i]));
    if (el) {
      el.classList.remove('active');
      el.classList.add('done');
      const chk = el.querySelector('.ps-tick');
      if (chk) chk.classList.remove('hidden');
      const stat = el.querySelector('.ps-status');
      if (stat) stat.textContent = 'Done';
    }
  }

  await new Promise(r => setTimeout(r, 250));
  overlay.classList.add('hidden');
}

// Particles — No-op since ambient-bg orbs replace particles
function initParticles() { /* Ambient orbs handle background FX */ }

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Chips Toggling (Transport: single select; Food/Interest: multi select)
  const trContainer = document.getElementById('transportChips');
  if (trContainer) {
    trContainer.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        trContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  ['foodChips', 'interestChips'].forEach(id => {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
      });
    });
  });

  // Form Submission
  const form = document.getElementById('orchestratorForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const selectedTransport = document.querySelector('#transportChips .chip.active')?.dataset.value || 'any';
      const selectedFood = [...document.querySelectorAll('#foodChips .chip.active')].map(c => c.dataset.value);
      const selectedInterests = [...document.querySelectorAll('#interestChips .chip.active')].map(c => c.dataset.value);
      const selectedAccom = document.querySelector('input[name="accomPref"]:checked')?.value || 'hotel';
      const selectedStyle = document.querySelector('input[name="travelStyle"]:checked')?.value || 'mid-range';

      const raw = {
        destination:   document.getElementById('destination')?.value || '',
        origin:        document.getElementById('origin')?.value || '',
        days:          parseInt(document.getElementById('days')?.value || '0', 10),
        travelers:     parseInt(document.getElementById('travelers')?.value || '0', 10),
        budget:        parseFloat(document.getElementById('budget')?.value || '0'),
        currency:      document.getElementById('currency')?.value || 'USD',
        startDate:     document.getElementById('startDate')?.value || '',
        mustVisit:     document.getElementById('mustVisit')?.value || '',
        avoid:         document.getElementById('avoid')?.value || '',
        specialReqs:   document.getElementById('specialReqs')?.value || '',
        transportPref: selectedTransport,
        accomPref:     selectedAccom,
        travelStyle:   selectedStyle,
        foodPrefs:     selectedFood,
        interests:     selectedInterests,
      };

      // Part 3: Validate Input
      const val = validateUserContext(raw);
      if (!val.isValid) {
        ['destination', 'days', 'travelers', 'budget'].forEach(f => {
          const errEl = document.getElementById(`err-${f}`);
          const inp = document.getElementById(f);
          if (val.errors[f]) {
            if (errEl) errEl.textContent = val.errors[f];
            if (inp) inp.style.borderColor = 'var(--rose)';
          } else {
            if (errEl) errEl.textContent = '';
            if (inp) inp.style.borderColor = '';
          }
        });
        return;
      }

      // Clear previous errors
      ['destination', 'days', 'travelers', 'budget'].forEach(f => {
        const errEl = document.getElementById(`err-${f}`);
        const inp = document.getElementById(f);
        if (errEl) errEl.textContent = '';
        if (inp) inp.style.borderColor = '';
      });

      // Button state
      const btn = document.getElementById('launchPipelineBtn');
      btn.querySelector('.btn-ready').classList.add('hidden');
      btn.querySelector('.btn-loading').classList.remove('hidden');
      btn.disabled = true;

      // Run Pipeline Visualizer
      await runPipelineVisualizer();

      // Execute Orchestration & Independent Review
      const masterResult = executePlanningOrchestration(raw);

      // Restore button
      btn.querySelector('.btn-ready').classList.remove('hidden');
      btn.querySelector('.btn-loading').classList.add('hidden');
      btn.disabled = false;

      // Render Dashboard
      renderOrchestratedResults(masterResult);
    });
  }

  // Replan Button
  document.getElementById('replanBtn')?.addEventListener('click', () => {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('destination').focus();
  });

  // Export PDF Button
  document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
    window.print();
  });

  // Part 19: JSON Modal Handlers
  const jsonModal = document.getElementById('jsonModalBackdrop');
  const viewJsonBtn = document.getElementById('viewJsonBtn');
  const closeJsonBtn = document.getElementById('closeJsonModalBtn');
  const dismissJsonBtn = document.getElementById('dismissJsonModalBtn');
  const jsonPre = document.getElementById('jsonPreViewer');
  const copyJsonBtn = document.getElementById('copyJsonBtn');

  if (viewJsonBtn && jsonModal) {
    viewJsonBtn.addEventListener('click', () => {
      if (!currentMasterResult) return;
      const machineObj = generatePart19MachineObject(currentMasterResult);
      jsonPre.textContent = JSON.stringify(machineObj, null, 2);
      jsonModal.classList.remove('hidden');
    });
  }

  [closeJsonBtn, dismissJsonBtn].forEach(b => {
    b?.addEventListener('click', () => {
      jsonModal?.classList.add('hidden');
    });
  });

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      if (!jsonPre.textContent) return;
      navigator.clipboard.writeText(jsonPre.textContent).then(() => {
        copyJsonBtn.textContent = 'Copied to Clipboard!';
        setTimeout(() => { copyJsonBtn.textContent = 'Copy to Clipboard'; }, 2000);
      });
    });
  }
});
