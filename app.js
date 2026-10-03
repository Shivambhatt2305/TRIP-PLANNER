/* ====================================================
   BudgetWise Travel V2 — Smart AI Trip Planner Engine
   Implements Steps 1 through 6:
   Step 1: Extract Constraints (Hard & Soft)
   Step 2: Select Places (Geographic Proximity Clustering)
   Step 3: Day-by-Day Itinerary (Morning, Afternoon, Evening)
   Step 4: Map & Route Information (Distances, Times, Sequence)
   Step 5: Itemized Cost Estimation (6 Categories)
   Step 6: Final Response & Budget Analysis with Alternatives
   ==================================================== */

'use strict';

// ============================================================
// 1. COMPREHENSIVE DESTINATION DATABASE WITH GEOGRAPHIC ZONES
// ============================================================

const DESTINATIONS = {
  paris: {
    name: 'Paris, France',
    emoji: '🗼',
    region: 'Europe',
    center: { lat: 48.8566, lon: 2.3522 },
    intercityCost: { flight: 280, train: 95, bus: 45, 'self-drive': 80, cruise: 450, any: 180 },
    costs: {
      budget:    { hotel: 48,  food: 26, transport: 12, activity: 16, localTransit: 9,  misc: 10 },
      'mid-range': { hotel: 135, food: 62, transport: 20, activity: 38, localTransit: 16, misc: 22 },
      luxury:    { hotel: 390, food: 160, transport: 45, activity: 85, localTransit: 35, misc: 50 },
    },
    hotels: {
      hostel:  ['Generator Paris (Canal Saint-Martin)', 'St Christopher\'s Inn Gare du Nord', 'MIJE Marais Hostel'],
      hotel:   ['Hôtel du Jeu de Paume (Île Saint-Louis)', 'Hôtel Atmosphères (Latin Quarter)', 'Citadines Bastille'],
      airbnb:  ['Le Marais Historic Loft Apartment', 'Montmartre Artists Studio', 'Saint-Germain Cozy Flat'],
      resort:  ['Le Bristol Paris (Champs-Élysées)', 'Hôtel de Crillon (Place de la Concorde)', 'Four Seasons George V'],
    },
    zones: [
      {
        name: 'Zone 1: Historic Heart & Île de la Cité',
        neighborhood: '1st & 4th Arrondissements',
        morning: {
          place: 'Louvre Museum & Tuileries Gardens',
          activity: 'Tour the classical galleries, Mona Lisa & stroll the royal Tuileries palace grounds',
          time: '09:00 AM – 12:30 PM',
          duration: '3.5 hrs',
          distFromHotelKm: 1.8,
          transitTime: '15 mins via Metro Line 1',
        },
        lunch: {
          place: 'Bistrot Vivienne (Galerie Vivienne)',
          cuisine: 'Traditional French Bistro & Duck Confit',
          costHint: '€20–35',
          distFromMorningKm: 0.6,
          transitTime: '8 mins walk',
        },
        afternoon: {
          place: 'Sainte-Chapelle & Notre-Dame Cathedral Plaza',
          activity: 'Marvel at 13th-century radiant stained glass and explore Île de la Cité historical quays',
          time: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 1.2,
          transitTime: '14 mins walk across Pont Neuf',
        },
        dinner: {
          place: 'Le Comptoir du Relais (Saint-Germain)',
          cuisine: 'Artisanal Charcuterie & Boeuf Bourguignon',
          costHint: '€28–45',
          distFromAfternoonKm: 0.9,
          transitTime: '10 mins walk across Seine',
        },
        evening: {
          place: 'Seine River Cruise by Night (Bateaux Parisiens)',
          activity: 'Illuminated evening panorama of Eiffel Tower, Pont Alexandre III and Paris bridges',
          time: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 1.5,
          transitTime: '15 mins transit',
        },
      },
      {
        name: 'Zone 2: Left Bank, Eiffel & Orsay',
        neighborhood: '7th & 8th Arrondissements',
        morning: {
          place: 'Musée d\'Orsay & Seine Riverbank',
          activity: 'View Impressionist masterpieces by Monet, Van Gogh and Degas in the grand Belle Époque station',
          time: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 2.2,
          transitTime: '18 mins via RER C',
        },
        lunch: {
          place: 'Café de Flore / Les Deux Magots',
          cuisine: 'Croque Monsieur, Tartines & Parisian Café Culture',
          costHint: '€18–32',
          distFromMorningKm: 0.8,
          transitTime: '10 mins stroll',
        },
        afternoon: {
          place: 'Eiffel Tower & Champ de Mars Grounds',
          activity: 'Ascend to the second floor panorama or picnic on the manicured Champ de Mars lawns',
          time: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 2.0,
          transitTime: '16 mins via Metro Line 8',
        },
        dinner: {
          place: 'Brasserie Lipp (Boulevard Saint-Germain)',
          cuisine: 'Classic Alsatian Choucroute & French Oysters',
          costHint: '€30–55',
          distFromAfternoonKm: 2.1,
          transitTime: '18 mins transit',
        },
        evening: {
          place: 'Trocadéro Esplanade Light Show',
          activity: 'Watch the Eiffel Tower hourly sparkle light show with night cityscape views',
          time: '08:00 PM – 09:30 PM',
          duration: '1.5 hrs',
          distFromDinnerKm: 2.4,
          transitTime: '15 mins transit',
        },
      },
      {
        name: 'Zone 3: Montmartre & Romantic Heights',
        neighborhood: '18th & 9th Arrondissements',
        morning: {
          place: 'Sacré-Cœur Basilica & Montmartre Village',
          activity: 'Climb the domes for panoramic sunrise city views and wander Place du Tertre painters square',
          time: '09:00 AM – 12:30 PM',
          duration: '3.5 hrs',
          distFromHotelKm: 3.1,
          transitTime: '20 mins via Metro Line 12',
        },
        lunch: {
          place: 'La Maison Rose / Le Refuge des Fondus',
          cuisine: 'Cozy rustic fondue and French hillside crêpes',
          costHint: '€18–30',
          distFromMorningKm: 0.4,
          transitTime: '5 mins scenic walk',
        },
        afternoon: {
          place: 'Palais Garnier Opera House & Galerie Vivienne',
          activity: 'Tour the gilded grand foyer, Chagall ceiling and 19th-century glass-roof shopping arcades',
          time: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 2.0,
          transitTime: '15 mins transit',
        },
        dinner: {
          place: 'Bouillon Chartier (Grands Boulevards)',
          cuisine: 'Historic 1896 Belle Époque dining hall with authentic €12–18 classics',
          costHint: '€15–25',
          distFromAfternoonKm: 0.9,
          transitTime: '11 mins walk',
        },
        evening: {
          place: 'Moulin Rouge & Pigalle Cabaret District',
          activity: 'Experience the electric neon streets, jazz clubs and evening Montmartre nightlife',
          time: '08:00 PM – 10:30 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 1.6,
          transitTime: '14 mins walk/bus',
        },
      },
      {
        name: 'Zone 4: Latin Quarter, Panthéon & Marais',
        neighborhood: '5th & 3rd Arrondissements',
        morning: {
          place: 'Panthéon & Luxembourg Gardens',
          activity: 'Pay tribute to Voltaire & Curie, followed by peaceful strolling around the Medici Fountain',
          time: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 1.5,
          transitTime: '12 mins transit',
        },
        lunch: {
          place: 'L\'As du Fallafel (Rue des Rosiers, Le Marais)',
          cuisine: 'World-famous authentic falafel pitas & Middle Eastern mezze',
          costHint: '€10–18',
          distFromMorningKm: 1.7,
          transitTime: '18 mins walk/metro',
        },
        afternoon: {
          place: 'Centre Pompidou & Place des Vosges',
          activity: 'Contemporary art exhibits, futuristic architecture and Paris\'s oldest planned royal square',
          time: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 0.7,
          transitTime: '8 mins stroll',
        },
        dinner: {
          place: 'Chez Janou (Rue des Tournelles)',
          cuisine: 'Provençal cuisine, pastis bar and unlimited chocolate mousse bowl',
          costHint: '€25–40',
          distFromAfternoonKm: 0.5,
          transitTime: '6 mins walk',
        },
        evening: {
          place: 'Saint-Germain Jazz Clubs (Le Caveau de la Huchette)',
          activity: 'Live swing and jazz underground cellar dancing in medieval vaults',
          time: '08:30 PM – 11:00 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 1.8,
          transitTime: '16 mins metro',
        },
      },
    ],
    tips: [
      '🎫 Get the Paris Museum Pass to skip ticket lines at Louvre, Orsay & Versailles',
      '🚇 Buy a weekly Navigo Découverte pass or T+ 10-packs instead of single tickets',
      '🥐 Eat "Formule Midi" (lunch set menu) at bistros — 35–45% cheaper than dinner',
      '🚶 Many premier monuments like Notre-Dame exterior and Sacré-Cœur are 100% free',
      '🥖 Supermarket picnics with fresh baguette, brie and wine along the Seine save hundreds',
    ],
    assumptions: [
      'Accommodation is calculated on double-occupancy shared rooms (2 people per room).',
      'Metro and public transit day passes used for all within-city transit segments.',
      'Museum entries assume advance online reservation to prevent surge queue fees.',
      'Lunch at local bistros/boulangeries and dinner at authentic neighborhood brasseries.',
    ],
  },

  rome: {
    name: 'Rome, Italy',
    emoji: '🏛️',
    region: 'Europe',
    center: { lat: 41.9028, lon: 12.4964 },
    intercityCost: { flight: 260, train: 85, bus: 40, 'self-drive': 75, cruise: 420, any: 170 },
    costs: {
      budget:    { hotel: 40,  food: 22, transport: 9,  activity: 15, localTransit: 7,  misc: 9 },
      'mid-range': { hotel: 115, food: 52, transport: 16, activity: 32, localTransit: 13, misc: 18 },
      luxury:    { hotel: 330, food: 135, transport: 40, activity: 75, localTransit: 30, misc: 45 },
    },
    hotels: {
      hostel:  ['The YellowSquare Rome (Termini)', 'Alessandro Palace Hostel', 'Generator Rome'],
      hotel:   ['Hotel Campo de\' Fiori', 'Navona Colors Hotel', 'Hotel Santa Maria (Trastevere)'],
      airbnb:  ['Monti Bohemian Apartment with Terrace', 'Trastevere Ivy-Covered Flat', 'Piazza Navona Suite'],
      resort:  ['Hotel Eden (Dorchester Collection)', 'Hassler Roma (Spanish Steps)', 'J.K. Place Roma'],
    },
    zones: [
      {
        name: 'Zone 1: Ancient Empire & Forum',
        neighborhood: 'Colosseo & Monti District',
        morning: {
          place: 'Colosseum & Arch of Constantine',
          activity: 'Walk the gladiator arena floor and discover 2,000 years of Roman imperial history',
          time: '09:00 AM – 12:00 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 1.5,
          transitTime: '12 mins via Metro Line B',
        },
        lunch: {
          place: 'Trattoria Luzzi (Via di San Giovanni)',
          cuisine: 'Authentic Roman wood-fired pizza & Cacio e Pepe',
          costHint: '€12–20',
          distFromMorningKm: 0.4,
          transitTime: '5 mins walk',
        },
        afternoon: {
          place: 'Roman Forum & Palatine Hill',
          activity: 'Walk the ancient Via Sacra, temple ruins and panoramic gardens where emperors ruled',
          time: '01:30 PM – 05:00 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 0.6,
          transitTime: '7 mins walk',
        },
        dinner: {
          place: 'La Carbonara (Rione Monti)',
          cuisine: 'Signature Roman Carbonara & Saltimbocca alla Romana',
          costHint: '€22–35',
          distFromAfternoonKm: 0.9,
          transitTime: '11 mins walk',
        },
        evening: {
          place: 'Piazza Venezia & Capitoline Hill Night View',
          activity: 'Gaze out over the illuminated Roman Forum ruins from the quiet Michelangelo piazza',
          time: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 0.8,
          transitTime: '10 mins stroll',
        },
      },
      {
        name: 'Zone 2: Vatican & Borgo Renaissance',
        neighborhood: 'Vatican City & Prati',
        morning: {
          place: 'Vatican Museums & Sistine Chapel',
          activity: 'Tour Raphael Rooms and stand beneath Michelangelo\'s miraculous Sistine Chapel fresco',
          time: '08:30 AM – 12:30 PM',
          duration: '4.0 hrs',
          distFromHotelKm: 3.2,
          transitTime: '20 mins via Metro Line A',
        },
        lunch: {
          place: 'Pizzarium Bonci / Osteria delle Commari',
          cuisine: 'Legendary Roman gourmet pizza al taglio by Gabriele Bonci',
          costHint: '€10–18',
          distFromMorningKm: 0.5,
          transitTime: '6 mins walk',
        },
        afternoon: {
          place: 'St. Peter\'s Basilica & Castel Sant\'Angelo',
          activity: 'Climb St. Peter\'s dome for a 360° panorama and explore Emperor Hadrian\'s fortress fortress',
          time: '02:00 PM – 05:30 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 1.1,
          transitTime: '13 mins walk',
        },
        dinner: {
          place: 'Ristorante Il Sorpasso (Prati)',
          cuisine: 'Artisanal cheese boards, fresh tagliolini and Italian wines',
          costHint: '€25–40',
          distFromAfternoonKm: 0.7,
          transitTime: '8 mins walk',
        },
        evening: {
          place: 'Ponte Sant\'Angelo River Walk',
          activity: 'Stroll past Bernini\'s marble angels glowing over the Tiber River with night basilica reflections',
          time: '08:00 PM – 10:00 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 0.9,
          transitTime: '10 mins stroll',
        },
      },
      {
        name: 'Zone 3: Baroque Fountains & Historic Piazza',
        neighborhood: 'Centro Storico',
        morning: {
          place: 'Pantheon & Piazza Navona',
          activity: 'Enter the world\'s largest unreinforced concrete dome and Bernini\'s Fountain of the Four Rivers',
          time: '09:00 AM – 12:00 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 1.2,
          transitTime: '12 mins walk',
        },
        lunch: {
          place: 'Armando al Pantheon / Cantina e Cucina',
          cuisine: 'Classic Gricia, Amatriciana and house tiramisu',
          costHint: '€18–30',
          distFromMorningKm: 0.3,
          transitTime: '4 mins walk',
        },
        afternoon: {
          place: 'Trevi Fountain & Spanish Steps (Piazza di Spagna)',
          activity: 'Toss a coin into the Trevi Fountain and climb the historic 135 marble Spanish Steps',
          time: '01:30 PM – 04:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.8,
          transitTime: '10 mins walk',
        },
        dinner: {
          place: 'Osteria da Fortunata (Piazza della Cancelleria)',
          cuisine: 'Hand-rolled fresh strozzapreti prepared live by Roman nonnas',
          costHint: '€20–32',
          distFromAfternoonKm: 1.2,
          transitTime: '14 mins walk',
        },
        evening: {
          place: 'Campo de\' Fiori & Night Wine Bars',
          activity: 'Enjoy local aperitivo culture in lively open-air piazzas with live musicians',
          time: '07:30 PM – 10:00 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 0.2,
          transitTime: '3 mins walk',
        },
      },
      {
        name: 'Zone 4: Trastevere & Bohemian Alleyways',
        neighborhood: 'Trastevere & Gianicolo',
        morning: {
          place: 'Janiculum Hill (Gianicolo) & Botanical Garden',
          activity: 'Listen to the noon cannon salute with sweeping panoramic views of the entire Roman skyline',
          time: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 2.4,
          transitTime: '18 mins bus/tram',
        },
        lunch: {
          place: 'Da Enzo al 29 (Trastevere)',
          cuisine: 'Fried artichokes (Carciofi alla Giudia), burrata & coda alla vaccinara',
          costHint: '€20–35',
          distFromMorningKm: 1.0,
          transitTime: '12 mins downhill walk',
        },
        afternoon: {
          place: 'Santa Maria in Trastevere & Villa Farnesina',
          activity: 'Admire golden 12th-century mosaics and Raphael\'s Cupid & Psyche renaissance frescoes',
          time: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.5,
          transitTime: '6 mins walk',
        },
        dinner: {
          place: 'Tonnarello (Via della Paglia)',
          cuisine: 'Iconic copper pans overflowing with hot tonnarelli pasta',
          costHint: '€18–28',
          distFromAfternoonKm: 0.3,
          transitTime: '4 mins walk',
        },
        evening: {
          place: 'Piazza Trilussa & Tiber Island Stroll',
          activity: 'Mingle with street performers and stroll the ancient Roman bridges over Tiber Island',
          time: '07:30 PM – 10:00 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 0.6,
          transitTime: '7 mins walk',
        },
      },
    ],
    tips: [
      '⛲ Pantheon, Trevi Fountain & historic piazzas are completely free to enjoy',
      '🎫 Pre-book Colosseum & Vatican tickets online at least 3 weeks ahead to skip 3-hour lines',
      '🍕 Order "pizza al taglio" by the slice for €3–5 for fast, delicious budget lunches',
      '🚰 Drink from the "Nasoni" public fountains scattered across the city — pure, icy cold water',
      '🚌 Take bus 64 or 70 across the historic center instead of expensive taxis',
    ],
    assumptions: [
      'Standard room double occupancy for travelers.',
      'Public transport passes (ATAC 48h/72h passes) used for citywide mobility.',
      'Entry tickets purchased directly at official museum rates without reseller markups.',
      'Dining balanced between traditional trattorias and quick authentic bakeries.',
    ],
  },

  tokyo: {
    name: 'Tokyo, Japan',
    emoji: '🗾',
    region: 'Asia',
    center: { lat: 35.6762, lon: 139.6503 },
    intercityCost: { flight: 650, train: 160, bus: 70, 'self-drive': 140, cruise: 800, any: 400 },
    costs: {
      budget:    { hotel: 42,  food: 18, transport: 11, activity: 14, localTransit: 8,  misc: 9 },
      'mid-range': { hotel: 125, food: 46, transport: 22, activity: 32, localTransit: 14, misc: 20 },
      luxury:    { hotel: 410, food: 130, transport: 55, activity: 85, localTransit: 38, misc: 50 },
    },
    hotels: {
      hostel:  ['Khaosan Tokyo Origami (Asakusa)', 'Bunka Hostel Tokyo', 'Nui. Hostel & Bar Lounge'],
      hotel:   ['Richmond Hotel Premier Asakusa', 'Dormy Inn Premium Shibuya', 'Hotel Gracery Shinjuku'],
      airbnb:  ['Traditional Tatami Townhouse (Yanaka)', 'Modern Shibuya Sky Apartment', 'Roppongi Designer Loft'],
      resort:  ['Aman Tokyo (Otemachi)', 'Park Hyatt Tokyo (Shinjuku)', 'The Peninsula Tokyo (Ginza)'],
    },
    zones: [
      {
        name: 'Zone 1: Historic Asakusa & Electric Akihabara',
        neighborhood: 'Taito & Chiyoda Wards',
        morning: {
          place: 'Senso-ji Temple & Nakamise-dori',
          activity: 'Walk beneath the giant red Kaminarimon lantern and sample freshly grilled melonpan snacks',
          time: '08:30 AM – 11:30 AM',
          duration: '3.0 hrs',
          distFromHotelKm: 1.4,
          transitTime: '12 mins subway',
        },
        lunch: {
          place: 'Asakusa Imahan / Daikokuya Tempura',
          cuisine: 'Crispy giant prawn tempura tendon and sweet mirin sauce',
          costHint: '¥1,400–2,500',
          distFromMorningKm: 0.3,
          transitTime: '4 mins walk',
        },
        afternoon: {
          place: 'Akihabara Electric Town & Ueno Park',
          activity: 'Explore multi-floor retro gaming stores, anime arcades, followed by peaceful Ueno lotus pond',
          time: '01:00 PM – 05:00 PM',
          duration: '4.0 hrs',
          distFromLunchKm: 2.1,
          transitTime: '10 mins via Tsukuba Express',
        },
        dinner: {
          place: 'Kyushu Jangara Ramen (Akihabara)',
          cuisine: 'Rich tonkotsu ramen with marinated soft-boiled egg and chashu pork',
          costHint: '¥950–1,600',
          distFromAfternoonKm: 0.5,
          transitTime: '6 mins walk',
        },
        evening: {
          place: 'Tokyo Skytree Skydeck & Solamachi',
          activity: 'Gaze over the boundless neon Tokyo grid from 350 meters above ground',
          time: '07:00 PM – 09:30 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 3.0,
          transitTime: '16 mins train',
        },
      },
      {
        name: 'Zone 2: Neon Shibuya, Harajuku & Meiji Shrine',
        neighborhood: 'Shibuya Ward',
        morning: {
          place: 'Meiji Jingu Shrine & Yoyogi Forest',
          activity: 'Pass through colossal cedar Torii gates into serene sacred forested grounds',
          time: '09:00 AM – 11:30 AM',
          duration: '2.5 hrs',
          distFromHotelKm: 2.5,
          transitTime: '15 mins via JR Yamanote Line',
        },
        lunch: {
          place: 'Harajuku Gyoza Lou / Afuri Ramen',
          cuisine: 'Pan-fried crispy gyoza and refreshing Yuzu Shio ramen broth',
          costHint: '¥800–1,500',
          distFromMorningKm: 0.6,
          transitTime: '7 mins walk',
        },
        afternoon: {
          place: 'Takeshita Street, Omotesando & Cat Street',
          activity: 'Experience youth pop culture, Japanese street fashion, crepes and hip backstreet cafes',
          time: '01:00 PM – 04:30 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 0.4,
          transitTime: '5 mins walk',
        },
        dinner: {
          place: 'Shibuya Morimoto Yakitori / Uobei Conveyor Sushi',
          cuisine: 'High-speed touch-screen kaitenzushi sushi and charcoal-grilled skewers',
          costHint: '¥1,500–2,800',
          distFromAfternoonKm: 1.2,
          transitTime: '12 mins walk',
        },
        evening: {
          place: 'Shibuya Crossing & Shibuya Sky Rooftop',
          activity: 'Stand at the world\'s busiest pedestrian scramble and take in open-air rooftop views',
          time: '07:00 PM – 09:30 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 0.3,
          transitTime: '4 mins walk',
        },
      },
      {
        name: 'Zone 3: Futuristic Odaiba, Ginza & Fish Market',
        neighborhood: 'Chuo & Minato Wards',
        morning: {
          place: 'Tsukiji Outer Market & Hamarikyu Gardens',
          activity: 'Taste fresh tuna sashimi bowls, tamagoyaki omelettes and walk imperial tidal duck ponds',
          time: '08:30 AM – 11:30 AM',
          duration: '3.0 hrs',
          distFromHotelKm: 2.0,
          transitTime: '14 mins subway',
        },
        lunch: {
          place: 'Sushi Dai / Ginza Kagari Ramen',
          cuisine: 'Rich creamy chicken paitan broth ramen with seasonal vegetables',
          costHint: '¥1,200–2,200',
          distFromMorningKm: 0.9,
          transitTime: '10 mins walk',
        },
        afternoon: {
          place: 'teamLab Planets (Toyosu) & Ginza District',
          activity: 'Wade barefoot through immersive digital projection water gardens and explore Ginza architecture',
          time: '01:30 PM – 05:00 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 2.8,
          transitTime: '18 mins Yurikamome Line',
        },
        dinner: {
          place: 'Ginza Bairin Tonkatsu / Yurakucho Izakaya Gado-shita',
          cuisine: 'Golden Kurobuta pork cutlet under brick railway arches',
          costHint: '¥1,800–3,500',
          distFromAfternoonKm: 2.5,
          transitTime: '16 mins train',
        },
        evening: {
          place: 'Rainbow Bridge & Odaiba Seaside Promenade',
          activity: 'Gaze across Tokyo Bay at the illuminated skyline, Statue of Liberty replica and giant Gundam',
          time: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 3.5,
          transitTime: '20 mins transit',
        },
      },
      {
        name: 'Zone 4: Shinjuku Skyscrapers & Golden Gai',
        neighborhood: 'Shinjuku Ward',
        morning: {
          place: 'Shinjuku Gyoen National Garden',
          activity: 'Wander across traditional Japanese landscape gardens, English lawns and greenhouse pavilions',
          time: '09:30 AM – 12:30 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 2.2,
          transitTime: '15 mins subway',
        },
        lunch: {
          place: 'Fuunji Tsukemen (Shinjuku)',
          cuisine: 'Famous thick dipping ramen noodles in ultra-concentrated seafood-pork broth',
          costHint: '¥1,000–1,400',
          distFromMorningKm: 0.8,
          transitTime: '9 mins walk',
        },
        afternoon: {
          place: 'Tokyo Metropolitan Government Building Observation Deck',
          activity: 'Enjoy panoramic city views (free admission) with clear-day views of Mount Fuji',
          time: '02:00 PM – 04:30 PM',
          duration: '2.5 hrs',
          distFromLunchKm: 1.0,
          transitTime: '12 mins walk',
        },
        dinner: {
          place: 'Omoide Yokocho (Memory Lane)',
          cuisine: 'Smoky vintage alleyway stalls serving yakitori, gyoza and draft beer',
          costHint: '¥1,800–3,000',
          distFromAfternoonKm: 1.1,
          transitTime: '13 mins walk',
        },
        evening: {
          place: 'Golden Gai & Kabukicho Neon Walk',
          activity: 'Explore hundreds of tiny 6-seat historic bars and vibrant Kabukicho entertainment alleyways',
          time: '07:30 PM – 10:30 PM',
          duration: '3.0 hrs',
          distFromDinnerKm: 0.4,
          transitTime: '5 mins stroll',
        },
      },
    ],
    tips: [
      '💳 Load a digital Suica or Pasmo IC card on your phone for seamless subway and convenience store payments',
      '🍱 Japanese "konbini" (7-Eleven, Lawson, FamilyMart) have incredible fresh meals for just $3–5',
      '🗼 Tokyo Metropolitan Government Building offers views as stunning as Tokyo Tower for 100% free',
      '🎟️ Pre-book teamLab Planets tickets online 2–4 weeks in advance to avoid sold-out slots',
      '🪙 Japan still values cash for small street vendors and noodle vending machine ordering',
    ],
    assumptions: [
      'Calculated based on double-occupancy hotel rooms or capsule/hostels for solo travelers.',
      'Tokyo Metro 24/48/72-hour tourist subway passes used to minimize transit expenditure.',
      'Intercity transport assumes JR pass or highway bus depending on travel preferences.',
      'Dining accounts for famous counter ramen shops, market street food, and izakayas.',
    ],
  },

  bali: {
    name: 'Bali, Indonesia',
    emoji: '🌺',
    region: 'Asia',
    center: { lat: -8.4095, lon: 115.1889 },
    intercityCost: { flight: 480, train: 0, bus: 0, 'self-drive': 60, cruise: 650, any: 350 },
    costs: {
      budget:    { hotel: 20, food: 9,  transport: 8,  activity: 11, localTransit: 6,  misc: 6 },
      'mid-range': { hotel: 65, food: 24, transport: 18, activity: 28, localTransit: 12, misc: 14 },
      luxury:    { hotel: 260, food: 85, transport: 50, activity: 65, localTransit: 30, misc: 35 },
    },
    hotels: {
      hostel:  ['Puri Garden Hotel & Hostel (Ubud)', 'Bamboo Bali Bungalows', 'Mojo Resort Hostel (Canggu)'],
      hotel:   ['Bisma Eight (Ubud)', 'Katamama Suites (Seminyak)', 'COMO Uma Canggu'],
      airbnb:  ['Private Pool Jungle Villa (Ubud)', 'Eco Bamboo House Mount Agung', 'Beachfront Surf Villa'],
      resort:  ['Four Seasons Resort Jimbaran Bay', 'COMO Shambhala Estate', 'The Mulia Nusa Dua'],
    },
    zones: [
      {
        name: 'Zone 1: Ubud Cultural Highlands',
        neighborhood: 'Central Bali / Gianyar',
        morning: {
          place: 'Tegallalang Rice Terraces & Jungle Swing',
          activity: 'Trek the steep emerald UNESCO terraces in morning mist and soar over palm ravines',
          time: '08:00 AM – 11:30 AM',
          duration: '3.5 hrs',
          distFromHotelKm: 4.5,
          transitTime: '20 mins via scooter/taxi',
        },
        lunch: {
          place: 'Warung Babi Guling Ibu Oka',
          cuisine: 'Balinese roast suckling pig with spiced lawar vegetables and crispy crackling',
          costHint: 'IDR 50k–90k ($3–6)',
          distFromMorningKm: 4.0,
          transitTime: '15 mins drive',
        },
        afternoon: {
          place: 'Sacred Monkey Forest Sanctuary & Ubud Royal Palace',
          activity: 'Walk beneath banyan canopy with hundreds of long-tailed macaques and see ancient stone temples',
          time: '01:30 PM – 04:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 1.2,
          transitTime: '8 mins walk/drive',
        },
        dinner: {
          place: 'Locavore Herbivore / Bebek Bengil (Dirty Duck Diner)',
          cuisine: 'Crispy fried Balinese duck with sambal matah and organic jasmine rice',
          costHint: 'IDR 120k–220k ($8–15)',
          distFromAfternoonKm: 1.5,
          transitTime: '10 mins drive',
        },
        evening: {
          place: 'Campuhan Ridge Walk at Sunset',
          activity: 'Peaceful hilltop walk over lush valleys with golden sunset views, followed by acoustic live cafe',
          time: '06:00 PM – 08:30 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 1.8,
          transitTime: '12 mins drive',
        },
      },
      {
        name: 'Zone 2: Coastal Cliffs & Uluwatu Temples',
        neighborhood: 'South Bukit Peninsula',
        morning: {
          place: 'Padang Padang Beach & Suluban Cave',
          activity: 'Swim in crystal turquoise waters between limestone cliffs and watch world-class surfers',
          time: '09:00 AM – 12:00 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 6.0,
          transitTime: '25 mins drive',
        },
        lunch: {
          place: 'Single Fin Bali / Kelly’s Warung',
          cuisine: 'Fresh smoothie bowls, fish tacos and coconut water overlooking the surf break',
          costHint: 'IDR 80k–150k ($5–10)',
          distFromMorningKm: 1.5,
          transitTime: '8 mins drive',
        },
        afternoon: {
          place: 'Uluwatu Temple Cliff Walk',
          activity: 'Stroll the dramatic 70-meter sea cliff paths overlooking crashing Indian Ocean waves',
          time: '02:30 PM – 05:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 3.2,
          transitTime: '12 mins drive',
        },
        dinner: {
          place: 'Jimbaran Bay Seafood Warungs',
          cuisine: 'Candlelit beach dining with grilled red snapper, calamari and garlic butter prawns',
          costHint: 'IDR 150k–300k ($10–20)',
          distFromAfternoonKm: 8.5,
          transitTime: '25 mins drive',
        },
        evening: {
          place: 'Kecak Fire Dance Performance',
          activity: 'Enthralling 100-man rhythmic vocal chant and fire dance during sunset on the cliff amphitheater',
          time: '06:00 PM – 07:30 PM',
          duration: '1.5 hrs',
          distFromDinnerKm: 8.5,
          transitTime: 'Integrated at Uluwatu',
        },
      },
      {
        name: 'Zone 3: Water Temples & Mountain Lakes',
        neighborhood: 'Bedugul & North Tabanan',
        morning: {
          place: 'Pura Ulun Danu Bratan Floating Temple',
          activity: 'Visit the picturesque 17th-century pagoda temple appearing to float on mountain lake Bratan',
          time: '08:30 AM – 11:30 AM',
          duration: '3.0 hrs',
          distFromHotelKm: 12.0,
          transitTime: '40 mins scenic drive',
        },
        lunch: {
          place: 'Warung Rekreasi Bedugul',
          cuisine: 'Traditional Indonesian Ayam Betutu (slow-steamed spiced chicken) & fried tempeh',
          costHint: 'IDR 40k–80k ($3–5)',
          distFromMorningKm: 1.0,
          transitTime: '5 mins drive',
        },
        afternoon: {
          place: 'Banyumala Twin Waterfalls & Coffee Plantation',
          activity: 'Hike into hidden jungle canyon, swim in crystal freshwater pools and taste Luwak coffee',
          time: '01:00 PM – 04:30 PM',
          duration: '3.5 hrs',
          distFromLunchKm: 6.5,
          transitTime: '20 mins drive',
        },
        dinner: {
          place: 'Warung Enak Tabanan',
          cuisine: 'Nasi Campur Bali with chicken sate lilit and peanut sauce',
          costHint: 'IDR 40k–70k ($3–5)',
          distFromAfternoonKm: 8.0,
          transitTime: '25 mins drive',
        },
        evening: {
          place: 'Traditional Balinese Spa & Massage',
          activity: 'Full-body Balinese herbal flower bath and deep-tissue relaxation massage',
          time: '07:00 PM – 09:00 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 3.0,
          transitTime: '10 mins drive',
        },
      },
    ],
    tips: [
      '🛵 Renting a scooter costs just $5–7/day and saves hours sitting in traffic jams',
      '🍛 Eat at local family-run "Warungs" — delicious authentic feasts for under $2–4 a plate',
      '💆 60-minute authentic Balinese massages cost only $7–12 at certified clean neighborhood spas',
      '🥻 Rent sarongs at temple entrances for 50 cents rather than buying expensive tourist souvenir wraps',
      '💧 Always drink bottled or filtered water and avoid tap water to stay healthy',
    ],
    assumptions: [
      'Lodging based on private villas with shared pools or boutique guesthouses.',
      'Daily transport based on private driver hire ($35–45/day divided across group) or scooters.',
      'Temple entrance fees and cultural performances included in daily activity budget.',
      'Food estimates cover local warungs with occasional beachfront dining.',
    ],
  },

  'new york': {
    name: 'New York City, USA',
    emoji: '🗽',
    region: 'Americas',
    center: { lat: 40.7128, lon: -74.0060 },
    intercityCost: { flight: 290, train: 120, bus: 55, 'self-drive': 90, cruise: 600, any: 200 },
    costs: {
      budget:    { hotel: 75,  food: 36, transport: 16, activity: 26, localTransit: 10, misc: 16 },
      'mid-range': { hotel: 210, food: 85, transport: 32, activity: 58, localTransit: 18, misc: 32 },
      luxury:    { hotel: 580, food: 220, transport: 85, activity: 130, localTransit: 45, misc: 75 },
    },
    hotels: {
      hostel:  ['HI NYC Hostel (Upper West Side)', 'The Local NYC (Long Island City)', 'Q4 Hotel NYC'],
      hotel:   ['citizenM New York Bowery', 'Arlo SoHo Hotel', 'The Boro Hotel LIC'],
      airbnb:  ['Williamsburg Loft with Skyline View', 'Greenwich Village Brownstone Studio', 'Chelsea Artist Studio'],
      resort:  ['The Plaza Hotel (Fifth Ave)', 'The Carlyle, A Rosewood Hotel', '1 Hotel Brooklyn Bridge'],
    },
    zones: [
      {
        name: 'Zone 1: Lower Manhattan, Harbor & Bridges',
        neighborhood: 'Financial District & Brooklyn Bridge',
        morning: {
          place: 'Statue of Liberty & Battery Park Promenade',
          activity: 'Take the ferry to Liberty Island, view Ellis Island and stroll Castle Clinton',
          time: '08:30 AM – 12:00 PM',
          duration: '3.5 hrs',
          distFromHotelKm: 2.5,
          transitTime: '15 mins via Subway 4/5',
        },
        lunch: {
          place: 'Fraunces Tavern / Stone Street Pubs',
          cuisine: 'Historic Revolutionary War tavern, lobster rolls and shepherd\'s pie',
          costHint: '$22–38',
          distFromMorningKm: 0.6,
          transitTime: '8 mins walk',
        },
        afternoon: {
          place: '9/11 Memorial Pools & Oculus Center',
          activity: 'Reflect at the twin memorial reflecting pools and marvel at Calatrava’s winged Oculus architecture',
          time: '01:30 PM – 04:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.8,
          transitTime: '10 mins walk',
        },
        dinner: {
          place: 'Katz’s Delicatessen (Lower East Side)',
          cuisine: 'Legendary hand-carved pastrami on rye with sour pickles and cream soda',
          costHint: '$25–35',
          distFromAfternoonKm: 1.8,
          transitTime: '15 mins subway/walk',
        },
        evening: {
          place: 'Brooklyn Bridge Sunset Walk & DUMBO',
          activity: 'Walk the historic timber boardwalk over the East River with glowing Manhattan skyline vistas',
          time: '07:30 PM – 09:30 PM',
          duration: '2.0 hrs',
          distFromDinnerKm: 1.5,
          transitTime: '14 mins subway',
        },
      },
      {
        name: 'Zone 2: Midtown Icons & Broadway',
        neighborhood: 'Midtown Manhattan',
        morning: {
          place: 'Grand Central Terminal & Summit One Vanderbilt',
          activity: 'Stand beneath the celestial constellation concourse ceiling and experience mirrored sky rooms',
          time: '09:00 AM – 12:00 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 1.8,
          transitTime: '12 mins subway',
        },
        lunch: {
          place: 'Los Tacos No. 1 / Grand Central Oyster Bar',
          cuisine: 'Fresh handmade corn tortilla carne asada tacos or clam chowder',
          costHint: '$14–26',
          distFromMorningKm: 0.4,
          transitTime: '5 mins walk',
        },
        afternoon: {
          place: 'Rockefeller Center & Fifth Avenue',
          activity: 'St. Patrick\'s Cathedral, Top of the Rock observation plaza and historic art deco murals',
          time: '01:30 PM – 04:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.7,
          transitTime: '9 mins walk',
        },
        dinner: {
          place: 'Carmine\'s / Joe\'s Pizza Times Square',
          cuisine: 'Famous NYC thin-crust pizza slices or family-style Italian feast',
          costHint: '$10–30',
          distFromAfternoonKm: 0.9,
          transitTime: '11 mins walk',
        },
        evening: {
          place: 'Times Square Neon & Broadway Theater Show',
          activity: 'Immerse in the electric billboards of Duffy Square followed by evening West End/Broadway performance',
          time: '07:00 PM – 10:30 PM',
          duration: '3.5 hrs',
          distFromDinnerKm: 0.2,
          transitTime: '3 mins walk',
        },
      },
      {
        name: 'Zone 3: Central Park & Museum Mile',
        neighborhood: 'Upper East & Upper West Sides',
        morning: {
          place: 'The Metropolitan Museum of Art (The Met)',
          activity: 'Explore Egyptian Temple of Dendur, European masters and panoramic roof garden',
          time: '10:00 AM – 01:00 PM',
          duration: '3.0 hrs',
          distFromHotelKm: 3.2,
          transitTime: '20 mins subway',
        },
        lunch: {
          place: 'Pastrami Queen / Shake Shack Upper West Side',
          cuisine: 'Classic kosher-style corned beef or Angus beef burgers with crinkle fries',
          costHint: '$14–24',
          distFromMorningKm: 0.9,
          transitTime: '12 mins walk through park',
        },
        afternoon: {
          place: 'Central Park Highlights (Bethesda Terrace & Bow Bridge)',
          activity: 'Stroll Bethesda Fountain arcade, rent a rowboat on the Lake and visit Strawberry Fields',
          time: '02:00 PM – 05:00 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.6,
          transitTime: '8 mins stroll',
        },
        dinner: {
          place: 'Chumley\'s / The Smith Greenwich Village',
          cuisine: 'Modern American brasserie, pot pies and craft cocktails',
          costHint: '$28–48',
          distFromAfternoonKm: 3.5,
          transitTime: '18 mins subway',
        },
        evening: {
          place: 'Washington Square Park & Village Jazz Clubs (Blue Note)',
          activity: 'Live jazz under dim lights in the historic bohemian epicenter of New York music',
          time: '08:00 PM – 10:30 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 0.5,
          transitTime: '6 mins walk',
        },
      },
      {
        name: 'Zone 4: High Line, Chelsea & Meatpacking',
        neighborhood: 'Chelsea & West Village',
        morning: {
          place: 'The High Line Elevated Park & Hudson Yards Vessel',
          activity: 'Walk 1.45 miles of wildflower gardens built on a historic freight rail above Chelsea streets',
          time: '09:00 AM – 11:30 AM',
          duration: '2.5 hrs',
          distFromHotelKm: 2.0,
          transitTime: '14 mins subway',
        },
        lunch: {
          place: 'Chelsea Market (Lobster Place & Takumi)',
          cuisine: 'Steamed Maine lobsters, artisan bakery bread and gourmet food stalls',
          costHint: '$18–35',
          distFromMorningKm: 0.8,
          transitTime: '10 mins walk along High Line',
        },
        afternoon: {
          place: 'Whitney Museum of American Art & Little Island',
          activity: 'Contemporary American art exhibits and floating park hills on the Hudson River',
          time: '01:30 PM – 04:30 PM',
          duration: '3.0 hrs',
          distFromLunchKm: 0.5,
          transitTime: '6 mins walk',
        },
        dinner: {
          place: 'Corner Bistro / Buvette Gastrothèque',
          cuisine: 'Famous vintage bistro burgers or French country small plates',
          costHint: '$18–35',
          distFromAfternoonKm: 0.9,
          transitTime: '11 mins walk',
        },
        evening: {
          place: 'West Village Cobblestones & Rooftop Lounges',
          activity: 'Stroll picturesque tree-lined brownstone streets and enjoy cocktails with river breeze',
          time: '07:30 PM – 10:00 PM',
          duration: '2.5 hrs',
          distFromDinnerKm: 0.6,
          transitTime: '8 mins walk',
        },
      },
    ],
    tips: [
      '🚇 Get an OMNY contactless tap card or 7-Day Unlimited MetroCard ($34) for 24/7 unlimited rides',
      '🗽 The Staten Island Ferry is 100% free and gives world-class views of the Statue of Liberty & skyline',
      '🍕 Grab $1.50–$3 classic NYC street pizza slices for fast, authentic budget fuel',
      '🌳 Central Park, High Line, Brooklyn Bridge and Chelsea galleries charge zero admission fee',
      '🎭 Look for same-day Broadway discounts at the TKTS booth in Times Square or digital lottery apps',
    ],
    assumptions: [
      'Twin or double occupancy hotel accommodations in outer Midtown or Long Island City / Downtown.',
      'Subway used exclusively for intra-city transit without expensive yellow cabs or Uber surges.',
      'Attraction passes (NY CityPASS or free days) utilized for primary observation decks.',
      'Dining accounts for famous neighborhood delis, slice shops, and casual sit-down dinners.',
    ],
  },
};

// Add fallback destination logic
DESTINATIONS['default'] = {
  name: 'Destination City',
  emoji: '🌍',
  region: 'International',
  center: { lat: 48.8566, lon: 2.3522 },
  intercityCost: { flight: 300, train: 100, bus: 50, 'self-drive': 80, cruise: 500, any: 200 },
  costs: {
    budget:    { hotel: 45,  food: 22, transport: 10, activity: 15, localTransit: 8,  misc: 10 },
    'mid-range': { hotel: 120, food: 55, transport: 20, activity: 35, localTransit: 15, misc: 20 },
    luxury:    { hotel: 350, food: 140, transport: 50, activity: 80, localTransit: 35, misc: 50 },
  },
  hotels: {
    hostel:  ['Central International Youth Hostel', 'Backpackers City Inn', 'City Social Hub'],
    hotel:   ['City Center Boutique Hotel', 'Courtyard by Marriott', 'Grand Heritage Hotel'],
    airbnb:  ['Historic Old Town Apartment', 'Modern Skyline Flat with Balcony', 'Cozy Garden Studio'],
    resort:  ['Luxury Palace & Spa', 'Grand Waterfront Resort', 'Four Seasons Collection'],
  },
  zones: [
    {
      name: 'Zone 1: Historic Old Town & Heritage Center',
      neighborhood: 'Central Historic District',
      morning: {
        place: 'Old Town Square & Historic Cathedral',
        activity: 'Explore preserved medieval architecture, clock tower and cobblestone alleyways',
        time: '09:00 AM – 12:00 PM',
        duration: '3.0 hrs',
        distFromHotelKm: 1.5,
        transitTime: '12 mins transit',
      },
      lunch: {
        place: 'Traditional Heritage Tavern',
        cuisine: 'Local regional specialties and fresh seasonal bread',
        costHint: '$15–28',
        distFromMorningKm: 0.4,
        transitTime: '5 mins walk',
      },
      afternoon: {
        place: 'National Museum & Royal Gardens',
        activity: 'Discover cultural artifacts, art collections and scenic landscaped botanical gardens',
        time: '01:30 PM – 04:30 PM',
        duration: '3.0 hrs',
        distFromLunchKm: 0.9,
        transitTime: '11 mins walk',
      },
      dinner: {
        place: 'Old Town Bistro',
        cuisine: 'Farm-to-table cuisine and regional wine pairings',
        costHint: '$22–38',
        distFromAfternoonKm: 0.8,
        transitTime: '10 mins walk',
      },
      evening: {
        place: 'Riverfront Promenade & Night Viewpoint',
        activity: 'Evening stroll past illuminated monuments and riverside cafes with street musicians',
        time: '07:30 PM – 09:30 PM',
        duration: '2.0 hrs',
        distFromDinnerKm: 1.2,
        transitTime: '14 mins stroll',
      },
    },
    {
      name: 'Zone 2: Arts, Culture & City Panorama',
      neighborhood: 'Cultural Quarter',
      morning: {
        place: 'Fine Arts Gallery & Sculpture Plaza',
        activity: 'View international exhibitions and contemporary sculpture gardens',
        time: '09:30 AM – 12:30 PM',
        duration: '3.0 hrs',
        distFromHotelKm: 2.1,
        transitTime: '15 mins transit',
      },
      lunch: {
        place: 'Market Hall Food Stalls',
        cuisine: 'Fresh artisanal street food and international delicacies',
        costHint: '$10–18',
        distFromMorningKm: 0.5,
        transitTime: '6 mins walk',
      },
      afternoon: {
        place: 'Panoramic Hilltop Observation Point',
        activity: 'Funicular or walk to highest hill overlooking full panoramic city skyline',
        time: '02:00 PM – 05:00 PM',
        duration: '3.0 hrs',
        distFromLunchKm: 1.4,
        transitTime: '15 mins walk/tram',
      },
      dinner: {
        place: 'Hilltop Terrace Restaurant',
        cuisine: 'Fresh grilled cuisine with sunset city vistas',
        costHint: '$25–45',
        distFromAfternoonKm: 0.2,
        transitTime: '3 mins walk',
      },
      evening: {
        place: 'Downtown Entertainment District',
        activity: 'Experience local live music venues and cozy evening bars',
        time: '07:30 PM – 10:00 PM',
        duration: '2.5 hrs',
        distFromDinnerKm: 1.8,
        transitTime: '15 mins transit',
      },
    },
  ],
  tips: [
    '🎫 Look into all-inclusive city tourism cards which bundle public transit + museum entry',
    '🗺️ Download offline Google Maps or Maps.me before heading out to conserve mobile data',
    '🚰 Always verify local tap water safety and carry a refillable insulated bottle',
    '💳 Keep local currency for smaller street markets and tipping',
    '👟 Wear sturdy, comfortable walking shoes — best exploration happens on foot',
  ],
  assumptions: [
    'Calculated using standard 2-person double occupancy rooms.',
    'Daily local public transport used rather than private airport taxis.',
    'Intercity transit accounts for standard economy tickets.',
    'Lunch in casual local cafes and dinner at traditional neighborhood eateries.',
  ],
};

// ============================================================
// 2. CURRENCY & FORMATTING UTILITIES
// ============================================================

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

const FX_TO_USD = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  INR: 0.012,
  JPY: 0.0066,
  AUD: 0.65,
  CAD: 0.73,
};

function fmt(amount, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  const val = Math.round(amount || 0);
  if (currency === 'INR') return `${sym}${val.toLocaleString('en-IN')}`;
  if (currency === 'JPY') return `${sym}${val.toLocaleString()}`;
  return `${sym}${val.toLocaleString()}`;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function resolveDestination(input) {
  const q = (input || '').toLowerCase().trim();
  for (const key of Object.keys(DESTINATIONS)) {
    if (key === 'default') continue;
    if (q.includes(key)) return { key, data: DESTINATIONS[key] };
  }
  const aliases = {
    'nyc': 'new york', 'manhattan': 'new york', 'brooklyn': 'new york',
    'france': 'paris', 'roma': 'rome', 'italy': 'rome',
    'japan': 'tokyo', 'indonesia': 'bali', 'ubud': 'bali',
  };
  for (const [alias, mappedKey] of Object.entries(aliases)) {
    if (q.includes(alias)) return { key: mappedKey, data: DESTINATIONS[mappedKey] };
  }
  const fallback = JSON.parse(JSON.stringify(DESTINATIONS['default']));
  fallback.name = input.trim() ? capitalize(input.trim()) : 'Your Selected Destination';
  return { key: 'default', data: fallback };
}

// ============================================================
// 3. STEP 1 & STEP 2 & STEP 3 & STEP 5 ENGINE
// ============================================================

function generateSmartTripPlan(formData) {
  const {
    origin,
    destination,
    startDate,
    days,
    travelers,
    budget,
    currency,
    transportPref,
    accomPref,
    travelStyle,
    foodPrefs,
    interests,
    notes,
  } = formData;

  const { data: dest } = resolveDestination(destination);
  const fxRate = FX_TO_USD[currency] || 1.0;
  const sym = CURRENCY_SYMBOLS[currency] || '$';

  // Base costs in target currency
  const baseCosts = dest.costs[travelStyle] || dest.costs['mid-range'];
  const dailyHotelUSD = baseCosts.hotel;
  const dailyFoodUSD  = baseCosts.food;
  const dailyActUSD   = baseCosts.activity;
  const dailyTransitUSD = baseCosts.localTransit;
  const dailyMiscUSD  = baseCosts.misc;

  // Accommodation type modifier
  let accomMultiplier = 1.0;
  if (accomPref === 'hostel') accomMultiplier = 0.55;
  if (accomPref === 'airbnb') accomMultiplier = 0.95;
  if (accomPref === 'resort') accomMultiplier = 1.85;

  // Food preference modifier
  let foodMultiplier = 1.0;
  if (foodPrefs.includes('fine-dining')) foodMultiplier *= 1.45;
  if (foodPrefs.includes('street-food')) foodMultiplier *= 0.75;

  // Rooms calculation (sharing pairs)
  const roomsNeeded = accomPref === 'hostel' ? travelers : Math.ceil(travelers / 2);

  // Daily costs in user currency
  const dailyAccomCur    = ((dailyHotelUSD * accomMultiplier * roomsNeeded) / fxRate);
  const dailyFoodCur     = ((dailyFoodUSD * foodMultiplier * travelers) / fxRate);
  const dailyActCur      = ((dailyActUSD * travelers) / fxRate);
  const dailyLocalTrCur  = ((dailyTransitUSD * travelers) / fxRate);
  const dailyMiscCur     = ((dailyMiscUSD * travelers) / fxRate);

  // Intercity / Long-distance transportation cost
  const defaultMode = transportPref || 'any';
  const baseIntercityUSD = dest.intercityCost[defaultMode] !== undefined
    ? dest.intercityCost[defaultMode]
    : dest.intercityCost['any'];
  
  // If origin is specified and different, calculate reasonable transit; if empty, allocate minimal intercity
  const intercityUnitCost = origin.trim() ? baseIntercityUSD : (baseIntercityUSD * 0.6);
  const totalIntercityCur = Math.round((intercityUnitCost * travelers) / fxRate);

  // Totals for all 6 categories (Step 5)
  const totalAccomCur    = Math.round(dailyAccomCur * days);
  const totalFoodCur     = Math.round(dailyFoodCur * days);
  const totalActCur      = Math.round(dailyActCur * days);
  const totalLocalTrCur  = Math.round(dailyLocalTrCur * days);
  const totalMiscCur     = Math.round(dailyMiscCur * days);

  const totalEstimatedCost = totalIntercityCur + totalAccomCur + totalFoodCur + totalActCur + totalLocalTrCur + totalMiscCur;
  const remainingBudget = Math.round(budget - totalEstimatedCost);
  const isOverBudget = remainingBudget < 0;
  const percentUsed = Math.round((totalEstimatedCost / budget) * 100);

  // Build Day-by-Day Itinerary (Step 2 & Step 3)
  const availableZones = dest.zones && dest.zones.length > 0 ? dest.zones : DESTINATIONS['default'].zones;
  const itinerary = [];

  let startParsed = null;
  if (startDate) {
    startParsed = new Date(startDate);
  }

  for (let d = 1; d <= days; d++) {
    // Select geographic zone cyclically so all spots on day d are close
    const zoneIndex = (d - 1) % availableZones.length;
    const zone = availableZones[zoneIndex];

    // Pick hotel based on preference
    const hotelList = dest.hotels[accomPref] || dest.hotels['hotel'] || dest.hotels['hostel'];
    const chosenHotel = hotelList[(d - 1) % hotelList.length];

    // Calculate real date string if startDate provided
    let dayDateStr = '';
    if (startParsed && !isNaN(startParsed.getTime())) {
      const curDate = new Date(startParsed);
      curDate.setDate(curDate.getDate() + (d - 1));
      dayDateStr = curDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    // Daily cost sum
    const dayCost = Math.round(
      (totalAccomCur / days) +
      (totalFoodCur / days) +
      (totalActCur / days) +
      (totalLocalTrCur / days) +
      (totalMiscCur / days)
    );

    itinerary.push({
      day: d,
      dateStr: dayDateStr,
      zoneName: zone.name,
      neighborhood: zone.neighborhood,
      morning: zone.morning,
      lunch: zone.lunch,
      afternoon: zone.afternoon,
      dinner: zone.dinner,
      evening: zone.evening,
      accommodation: chosenHotel,
      transportSummary: `${capitalize(transportPref || 'Public Transit')} & Metro Pass`,
      dayCost: dayCost,
    });
  }

  // Cost breakdown structure (6 categories)
  const breakdown6 = {
    transportation: {
      name: 'Long-Distance Transport',
      icon: '✈️',
      amount: totalIntercityCur,
      pct: Math.round((totalIntercityCur / totalEstimatedCost) * 100),
      desc: `${travelers} traveler${travelers > 1 ? 's' : ''} via ${transportPref ? transportPref.toUpperCase() : 'intercity route'} from ${origin.trim() || 'home origin'}`,
    },
    accommodation: {
      name: 'Accommodation',
      icon: '🏨',
      amount: totalAccomCur,
      pct: Math.round((totalAccomCur / totalEstimatedCost) * 100),
      desc: `${days} night${days > 1 ? 's' : ''}, ${roomsNeeded} room${roomsNeeded > 1 ? 's' : ''} (${capitalize(accomPref)})`,
    },
    food: {
      name: 'Food & Dining',
      icon: '🍽️',
      amount: totalFoodCur,
      pct: Math.round((totalFoodCur / totalEstimatedCost) * 100),
      desc: `Breakfast, lunch & dinners for ${travelers} people across ${days} days`,
    },
    activities: {
      name: 'Activities & Attractions',
      icon: '🎡',
      amount: totalActCur,
      pct: Math.round((totalActCur / totalEstimatedCost) * 100),
      desc: `Entry tickets, museum passes, historical monuments & tours`,
    },
    localTransport: {
      name: 'Local Transportation',
      icon: '🚌',
      amount: totalLocalTrCur,
      pct: Math.round((totalLocalTrCur / totalEstimatedCost) * 100),
      desc: `Metro passes, trams, local buses & neighborhood transit`,
    },
    miscellaneous: {
      name: 'Contingency & Misc',
      icon: '🛡️',
      amount: totalMiscCur,
      pct: Math.round((totalMiscCur / totalEstimatedCost) * 100),
      desc: `Emergency fund, local SIM cards, tips, and incidentals buffer`,
    },
  };

  // Generate Cheaper Alternatives if over budget (Step 6)
  const alternatives = [];
  if (isOverBudget) {
    if (accomPref !== 'hostel') {
      const hostelSavings = Math.round(totalAccomCur * 0.45);
      alternatives.push({
        icon: '🏕️',
        title: 'Switch to Boutique Hostels or Guesthouses',
        desc: `Switching from ${capitalize(accomPref)} to top-rated private hostel rooms or economy guesthouses retains comfort while saving ~45% on lodging.`,
        saving: fmt(hostelSavings, currency),
      });
    }

    if (!foodPrefs.includes('street-food')) {
      const foodSavings = Math.round(totalFoodCur * 0.35);
      alternatives.push({
        icon: '🌮',
        title: 'Enjoy Authentic Local Street Food & Markets',
        desc: 'Swap sit-down tourist bistros for authentic neighborhood market food halls and local bakeries for lunch.',
        saving: fmt(foodSavings, currency),
      });
    }

    if (transportPref === 'flight' || transportPref === 'self-drive') {
      const transitSavings = Math.round(totalIntercityCur * 0.4);
      alternatives.push({
        icon: '🚆',
        title: 'Opt for High-Speed Rail or Regional Coaches',
        desc: 'Train and long-distance express coaches eliminate airport luggage fees and arrive straight into city centers.',
        saving: fmt(transitSavings, currency),
      });
    }

    const freePassSavings = Math.round(totalActCur * 0.3);
    alternatives.push({
      icon: '🎫',
      title: 'Leverage City Tourism Pass & Free Museum Days',
      desc: 'Most major capitals feature dedicated free museum evenings, free historic parks, and bundled tourist pass discounts.',
      saving: fmt(freePassSavings, currency),
    });

    if (days > 4) {
      const daySavings = Math.round((totalEstimatedCost / days) * 1);
      alternatives.push({
        icon: '🗓️',
        title: 'Streamline Itinerary by 1 Day',
        desc: `Shortening the trip by a single day concentrates activities while instantly recovering substantial accommodation and food cost.`,
        saving: fmt(daySavings, currency),
      });
    }
  }

  return {
    origin: origin.trim() || 'Not specified',
    destination: dest.name,
    destEmoji: dest.emoji,
    startDate: startDate || 'Flexible dates',
    days,
    travelers,
    budget,
    currency,
    transportPref: transportPref || 'Any Mode',
    accomPref,
    travelStyle,
    foodPrefs: foodPrefs.length > 0 ? foodPrefs : ['Local cuisine'],
    interests: interests.length > 0 ? interests : ['Culture & Sightseeing'],
    notes: notes.trim(),
    totalCost: totalEstimatedCost,
    remainingBudget,
    isOverBudget,
    percentUsed,
    perPersonCost: Math.round(totalEstimatedCost / travelers),
    perDayPerPerson: Math.round(totalEstimatedCost / (travelers * days)),
    itinerary,
    breakdown6,
    tips: dest.tips || DESTINATIONS['default'].tips,
    assumptions: dest.assumptions || DESTINATIONS['default'].assumptions,
    alternatives,
  };
}

// ============================================================
// 4. STEP 4: MAP & ROUTE BUILDER
// ============================================================

function renderMapAndRoutes(plan) {
  const mapContainer = document.getElementById('mapContent');
  if (!mapContainer) return;

  const destQuery = encodeURIComponent(plan.destination);
  const embedUrl = `https://maps.google.com/maps?q=${destQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  // Build Route Table for Day 1 as primary demonstration
  const d1 = plan.itinerary[0];
  const hotel = d1.accommodation;

  const stops = [
    { seq: 1, loc: hotel, type: '🏨 Accommodation (Start)', dist: '0.0 km', time: 'Start of Day' },
    { seq: 2, loc: d1.morning.place, type: '📍 Morning Attraction', dist: `${d1.morning.distFromHotelKm || 1.8} km`, time: d1.morning.transitTime || '15 mins transit' },
    { seq: 3, loc: d1.lunch.place, type: '🍽️ Lunch Dining', dist: `${d1.lunch.distFromMorningKm || 0.6} km`, time: d1.lunch.transitTime || '8 mins walk' },
    { seq: 4, loc: d1.afternoon.place, type: '🏛️ Afternoon Highlight', dist: `${d1.afternoon.distFromLunchKm || 1.2} km`, time: d1.afternoon.transitTime || '12 mins walk' },
    { seq: 5, loc: d1.dinner.place, type: '🍷 Evening Dinner', dist: `${d1.dinner.distFromAfternoonKm || 0.9} km`, time: d1.dinner.transitTime || '10 mins transit' },
    { seq: 6, loc: d1.evening.place, type: '✨ Night Experience', dist: `${d1.evening.distFromDinnerKm || 1.5} km`, time: d1.evening.transitTime || '15 mins transit' },
    { seq: 7, loc: hotel, type: '🏨 Return to Lodging', dist: '2.1 km', time: '16 mins transit' },
  ];

  const totalDistKm = stops.reduce((acc, s) => acc + (parseFloat(s.dist) || 0), 0).toFixed(1);

  mapContainer.innerHTML = `
    <div class="map-route-container">
      <div class="map-embed-wrapper">
        <iframe
          title="Map of ${plan.destination}"
          src="${embedUrl}"
          loading="lazy"
          allowfullscreen>
        </iframe>
      </div>
      <div class="map-note">
        🗺️ Interactive Map centered on <strong>${plan.destination}</strong> · Showing accommodation, daily attraction clusters &amp; dining stops
      </div>

      <div style="margin-top: 10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div>
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-primary);">${d1.zoneName}</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">Geographically clustered itinerary to minimize daily transit time and expenses</span>
          </div>
          <div style="font-size:0.85rem; font-weight:600; color:var(--accent-secondary); background:rgba(124,58,237,0.12); padding:6px 14px; border-radius:100px; border:1px solid rgba(124,58,237,0.3);">
            Total Route: ~${totalDistKm} km · ~1 hr 25 mins transit
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="route-table">
            <thead>
              <tr>
                <th style="width: 60px;">Seq</th>
                <th>Location / Waypoint</th>
                <th>Category</th>
                <th>Segment Distance</th>
                <th>Estimated Travel Time</th>
              </tr>
            </thead>
            <tbody>
              ${stops.map(s => `
                <tr>
                  <td><span class="route-seq">${s.seq}</span></td>
                  <td><strong style="color:var(--text-primary);">${s.loc}</strong></td>
                  <td>${s.type}</td>
                  <td>${s.dist}</td>
                  <td>${s.time}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 5. STEP 1 & STEP 3 & STEP 5 & STEP 6 DOM RENDERING
// ============================================================

function renderResults(plan) {
  const { currency } = plan;

  // Header
  document.getElementById('tripTitle').textContent = `${plan.destEmoji} ${plan.days}-Day ${plan.destination} Plan`;
  
  const badgesEl = document.getElementById('tripBadges');
  badgesEl.innerHTML = [
    `${plan.days} Days`,
    `${plan.travelers} Traveler${plan.travelers > 1 ? 's' : ''}`,
    capitalize(plan.travelStyle),
    capitalize(plan.accomPref),
    plan.startDate !== 'Flexible dates' ? `📅 ${plan.startDate}` : 'Flexible Timing',
  ].map(b => `<span class="trip-badge">${b}</span>`).join('');

  // ----------------------------------------------------------
  // STEP 1: RENDER EXTRACTED CONSTRAINTS PANEL
  // ----------------------------------------------------------
  const constraintsGrid = document.getElementById('constraintsGrid');
  if (constraintsGrid) {
    constraintsGrid.innerHTML = `
      <div class="constraints-col">
        <div class="constraints-col-title hard">🔒 Hard Constraints (Must Be Met)</div>
        <div class="constraint-item">
          <span class="constraint-key">Destination</span>
          <span class="constraint-val">${plan.destEmoji} ${plan.destination}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Duration</span>
          <span class="constraint-val">${plan.days} Days (${plan.days - 1} Nights)</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Travelers</span>
          <span class="constraint-val">${plan.travelers} Person${plan.travelers > 1 ? 's' : ''}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Max Budget</span>
          <span class="constraint-val" style="color:var(--accent-gold);">${fmt(plan.budget, currency)}</span>
        </div>
      </div>

      <div class="constraints-col">
        <div class="constraints-col-title soft">🎯 Soft Preferences (Optimized)</div>
        <div class="constraint-item">
          <span class="constraint-key">Starting Origin</span>
          <span class="constraint-val">${plan.origin}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Accommodation</span>
          <span class="constraint-val">${capitalize(plan.accomPref)}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Transit Mode</span>
          <span class="constraint-val">${capitalize(plan.transportPref)}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Food &amp; Dining</span>
          <span class="constraint-val">${plan.foodPrefs.map(f => capitalize(f)).join(', ')}</span>
        </div>
        <div class="constraint-item">
          <span class="constraint-key">Key Interests</span>
          <span class="constraint-val">${plan.interests.map(i => capitalize(i)).join(', ')}</span>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BUDGET OVERVIEW METRICS
  // ----------------------------------------------------------
  document.getElementById('totalCostDisplay').textContent = fmt(plan.totalCost, currency);
  document.getElementById('yourBudgetDisplay').textContent  = fmt(plan.budget, currency);
  document.getElementById('remainingDisplay').textContent   = fmt(Math.abs(plan.remainingBudget), currency);
  document.getElementById('perDayDisplay').textContent      = fmt(plan.perDayPerPerson, currency);

  const bcRemaining = document.getElementById('bc-remaining');
  const remainingIcon = document.getElementById('remainingIcon');
  const remainingLabel = document.getElementById('remainingLabel');
  const budgetStatusMsg = document.getElementById('budgetStatusMsg');

  bcRemaining.classList.remove('over-budget', 'within-budget');
  budgetStatusMsg.classList.remove('within', 'over');

  if (plan.isOverBudget) {
    bcRemaining.classList.add('over-budget');
    remainingIcon.textContent = '⚠️';
    remainingLabel.textContent = 'Over Budget By';
    budgetStatusMsg.classList.add('over');
    budgetStatusMsg.innerHTML = `⚠️ <strong>Over Budget by ${fmt(Math.abs(plan.remainingBudget), currency)} (${plan.percentUsed}% of budget).</strong> Review the suggested cheaper alternatives below to align costs with your budget target.`;
  } else {
    bcRemaining.classList.add('within-budget');
    remainingIcon.textContent = '✅';
    remainingLabel.textContent = 'Surplus / Remaining';
    budgetStatusMsg.classList.add('within');
    budgetStatusMsg.innerHTML = `✅ <strong>100% Within Budget!</strong> You have an estimated buffer of <strong>${fmt(plan.remainingBudget, currency)}</strong> (${100 - plan.percentUsed}% remaining) for unexpected splurges or shopping.`;
  }

  // Budget Progress Bar
  const budgetBarFill = document.getElementById('budgetBarFill');
  document.getElementById('budgetPercent').textContent = `${plan.percentUsed}%`;
  budgetBarFill.classList.toggle('over', plan.isOverBudget);
  setTimeout(() => {
    budgetBarFill.style.width = `${Math.min(plan.percentUsed, 100)}%`;
  }, 200);

  // ----------------------------------------------------------
  // STEP 3: DAY-BY-DAY ITINERARY WITH MORNING/AFTERNOON/EVENING
  // ----------------------------------------------------------
  const dayNav = document.getElementById('dayNav');
  dayNav.innerHTML = plan.itinerary.map(d => `
    <button type="button" class="day-nav-btn ${d.day === 1 ? 'active' : ''}" data-day="${d.day}" onclick="scrollToDay(${d.day})">
      Day ${d.day}
    </button>
  `).join('');

  const itineraryContainer = document.getElementById('itineraryContainer');
  itineraryContainer.innerHTML = plan.itinerary.map((d, idx) => `
    <div class="day-card" id="day-card-${d.day}" style="animation-delay: ${idx * 0.08}s">
      <div class="day-card-header" onclick="toggleDay(${d.day})">
        <div class="day-header-left">
          <div class="day-number-badge">Day ${d.day}</div>
          <div>
            <div class="day-title">${d.zoneName}</div>
            <div class="day-theme">${d.dateStr ? d.dateStr + ' · ' : ''}${d.neighborhood}</div>
          </div>
        </div>
        <div class="day-header-right">
          <div class="day-cost-badge">💰 ~${fmt(d.dayCost, currency)} / day</div>
          <span class="day-chevron">▾</span>
        </div>
      </div>

      <div class="day-card-body">
        <div class="day-sessions">

          <!-- MORNING -->
          <div class="session">
            <div class="session-header">
              <span class="session-time-badge morning">🌅 Morning</span>
              <span class="session-subtitle">${d.morning.time} · Est. ${d.morning.duration}</span>
            </div>
            <div class="session-grid">
              <div class="session-item">
                <div class="session-item-label">📍 Destination Place</div>
                <div class="session-item-value"><strong>${d.morning.place}</strong></div>
              </div>
              <div class="session-item" style="grid-column: span 2;">
                <div class="session-item-label">🗓️ Planned Activity</div>
                <div class="session-item-value">${d.morning.activity}</div>
              </div>
            </div>
          </div>

          <!-- AFTERNOON -->
          <div class="session">
            <div class="session-header">
              <span class="session-time-badge afternoon">☀️ Afternoon</span>
              <span class="session-subtitle">${d.afternoon.time} · Est. ${d.afternoon.duration}</span>
            </div>
            <div class="session-grid">
              <div class="session-item">
                <div class="session-item-label">📍 Destination Place</div>
                <div class="session-item-value"><strong>${d.afternoon.place}</strong></div>
              </div>
              <div class="session-item" style="grid-column: span 2;">
                <div class="session-item-label">🗓️ Planned Activity</div>
                <div class="session-item-value">${d.afternoon.activity}</div>
              </div>
            </div>
          </div>

          <!-- EVENING -->
          <div class="session">
            <div class="session-header">
              <span class="session-time-badge evening">🌙 Evening</span>
              <span class="session-subtitle">${d.evening.time} · Est. ${d.evening.duration}</span>
            </div>
            <div class="session-grid">
              <div class="session-item">
                <div class="session-item-label">📍 Destination Place</div>
                <div class="session-item-value"><strong>${d.evening.place}</strong></div>
              </div>
              <div class="session-item" style="grid-column: span 2;">
                <div class="session-item-label">🗓️ Planned Activity</div>
                <div class="session-item-value">${d.evening.activity}</div>
              </div>
            </div>
          </div>

        </div>

        <!-- DAY FOOTER WITH TRANSPORT, FOOD, ACCOMMODATION -->
        <div class="day-footer">
          <div class="day-footer-item">
            <div class="day-footer-label">🚌 Transportation</div>
            <div class="day-footer-value">${d.transportSummary}</div>
          </div>
          <div class="day-footer-item">
            <div class="day-footer-label">🍽️ Dining Highlights</div>
            <div class="day-footer-value">Lunch: ${d.lunch.place} · Dinner: ${d.dinner.place}</div>
          </div>
          <div class="day-footer-item">
            <div class="day-footer-label">🏨 Accommodation</div>
            <div class="day-footer-value">${d.accommodation}</div>
          </div>
          <div class="day-footer-total">
            <div class="day-total-label">Day Total</div>
            <div class="day-total-val">${fmt(d.dayCost, currency)}</div>
          </div>
        </div>

      </div>
    </div>
  `).join('');

  // ----------------------------------------------------------
  // STEP 4: MAP & ROUTE INFORMATION
  // ----------------------------------------------------------
  renderMapAndRoutes(plan);

  // ----------------------------------------------------------
  // STEP 5: ITEMIZED COST BREAKDOWN (6 CATEGORIES)
  // ----------------------------------------------------------
  const costGrid = document.getElementById('costBreakdownGrid');
  const b = plan.breakdown6;

  costGrid.innerHTML = Object.entries(b).map(([key, cat]) => `
    <div class="cost-item">
      <div class="cost-item-header">
        <span class="cost-item-icon">${cat.icon}</span>
        <div>
          <div class="cost-item-name">${cat.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${cat.pct}% of total</div>
        </div>
      </div>
      <div class="cost-item-amount" style="color:var(--text-primary);">${fmt(cat.amount, currency)}</div>
      <div class="cost-bar">
        <div class="cost-bar-fill" style="width: ${cat.pct}%; background: ${
          key === 'transportation' ? '#3b82f6' :
          key === 'accommodation'  ? '#7c3aed' :
          key === 'food'           ? '#f59e0b' :
          key === 'activities'     ? '#10b981' :
          key === 'localTransport' ? '#06b6d4' : '#ec4899'
        };"></div>
      </div>
      <div class="cost-item-detail">${cat.desc}</div>
    </div>
  `).join('');

  const costTotalRow = document.getElementById('costTotalRow');
  costTotalRow.innerHTML = `
    <div>
      <span class="cost-total-label">Calculated Total Trip Cost:</span>
      <span style="font-size:0.85rem; color:var(--text-muted); margin-left:8px;">(${plan.travelers} traveler${plan.travelers > 1 ? 's' : ''}, ${plan.days} days)</span>
    </div>
    <div style="display:flex; align-items:baseline; gap:16px;">
      <span style="font-size:0.95rem; color:${plan.isOverBudget ? 'var(--accent-rose)' : 'var(--accent-green)'}; font-weight:600;">
        ${plan.isOverBudget ? `Exceeds budget by ${fmt(Math.abs(plan.remainingBudget), currency)}` : `Leaves ${fmt(plan.remainingBudget, currency)} surplus`}
      </span>
      <span class="cost-total-val">${fmt(plan.totalCost, currency)}</span>
    </div>
  `;

  // ----------------------------------------------------------
  // STEP 6: ASSUMPTIONS & MONEY SAVING TIPS
  // ----------------------------------------------------------
  const assumptionsList = document.getElementById('assumptionsList');
  assumptionsList.innerHTML = plan.assumptions.map(a => `
    <li><span>📋</span><span>${a}</span></li>
  `).join('');

  const tipsList = document.getElementById('tipsList');
  tipsList.innerHTML = plan.tips.map(t => `
    <li><span>💡</span><span>${t}</span></li>
  `).join('');

  // ----------------------------------------------------------
  // STEP 6: SUGGESTED CHEAPER ALTERNATIVES (IF OVER BUDGET)
  // ----------------------------------------------------------
  const altCard = document.getElementById('alternativesCard');
  const altContent = document.getElementById('altContent');

  if (plan.isOverBudget && plan.alternatives.length > 0) {
    altCard.classList.remove('hidden');
    altContent.innerHTML = plan.alternatives.map(alt => `
      <div class="alt-item">
        <span class="alt-item-icon">${alt.icon}</span>
        <div class="alt-item-content">
          <div class="alt-item-title">${alt.title}</div>
          <div class="alt-item-desc">${alt.desc}</div>
        </div>
        <span class="alt-item-saving">Save ~${alt.saving}</span>
      </div>
    `).join('');
  } else {
    altCard.classList.add('hidden');
  }

  // Reveal results smoothly
  const resultsSection = document.getElementById('resultsSection');
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// 6. INTERACTION HELPERS
// ============================================================

function toggleDay(dayNum) {
  const card = document.getElementById(`day-card-${dayNum}`);
  if (card) card.classList.toggle('collapsed');
}

function scrollToDay(dayNum) {
  const card = document.getElementById(`day-card-${dayNum}`);
  if (card) {
    if (card.classList.contains('collapsed')) card.classList.remove('collapsed');
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('.day-nav-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.day) === dayNum);
  });
}

// 6-step animated loading sequence (Steps 1–6)
async function runLoadingAnimation() {
  const steps = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];
  const delays = [400, 500, 500, 450, 450, 350];

  for (let i = 0; i < steps.length; i++) {
    const el = document.getElementById(steps[i]);
    if (el) {
      el.classList.add('active');
    }
    await new Promise(r => setTimeout(r, delays[i]));
    if (el) {
      el.classList.remove('active');
      el.classList.add('done');
      const chk = el.querySelector('.step-check');
      if (chk) chk.classList.remove('hidden');
    }
  }
  await new Promise(r => setTimeout(r, 200));
}

// Form validation
function validateForm(data) {
  const errors = {};
  if (!data.destination.trim()) errors.destination = 'Please enter a target destination.';
  if (!data.days || data.days < 1 || data.days > 60) errors.days = 'Enter trip length between 1 and 60 days.';
  if (!data.travelers || data.travelers < 1 || data.travelers > 30) errors.travelers = 'Enter travelers between 1 and 30.';
  if (!data.budget || data.budget <= 0) errors.budget = 'Please enter a valid budget amount.';
  return errors;
}

function showErrors(errors) {
  ['destination', 'days', 'travelers', 'budget'].forEach(field => {
    const errEl = document.getElementById(`${field}-error`);
    const inp = document.getElementById(field);
    if (errors[field]) {
      if (errEl) errEl.textContent = errors[field];
      if (inp) inp.style.borderColor = 'var(--accent-rose)';
    } else {
      if (errEl) errEl.textContent = '';
      if (inp) inp.style.borderColor = '';
    }
  });
}

// ============================================================
// 7. PARTICLES BACKGROUND
// ============================================================

function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 24;
  const colors = ['#7c3aed', '#a78bfa', '#06b6d4', '#f59e0b', '#10b981'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 7 + 3;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(p);
  }
}

// ============================================================
// 8. MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  // Multi-select chip toggling for food and interests
  ['foodChips', 'interestChips'].forEach(id => {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
      });
    });
  });

  // Single-select chips for transportation preference
  const trWrap = document.getElementById('transportChips');
  if (trWrap) {
    trWrap.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        trWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  // Smooth scroll for hero CTA
  const startBtn = document.getElementById('start-planning-btn');
  if (startBtn) {
    startBtn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Form Submission
  const form = document.getElementById('plannerForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const selectedTransport = document.querySelector('#transportChips .chip.active')?.dataset.value || 'any';
      const selectedFood = [...document.querySelectorAll('#foodChips .chip.active')].map(c => c.dataset.value);
      const selectedInterests = [...document.querySelectorAll('#interestChips .chip.active')].map(c => c.dataset.value);
      const chosenAccom = document.querySelector('input[name="accomPref"]:checked')?.value || 'hotel';
      const chosenStyle = document.querySelector('input[name="travelStyle"]:checked')?.value || 'mid-range';

      const formData = {
        origin:        document.getElementById('origin')?.value || '',
        destination:   document.getElementById('destination')?.value || '',
        startDate:     document.getElementById('startDate')?.value || '',
        days:          parseInt(document.getElementById('days')?.value || '0', 10),
        travelers:     parseInt(document.getElementById('travelers')?.value || '0', 10),
        budget:        parseFloat(document.getElementById('budget')?.value || '0'),
        currency:      document.getElementById('currency')?.value || 'USD',
        transportPref: selectedTransport,
        accomPref:     chosenAccom,
        travelStyle:   chosenStyle,
        foodPrefs:     selectedFood,
        interests:     selectedInterests,
        notes:         document.getElementById('notes')?.value || '',
      };

      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
      }
      showErrors({});

      // Reset loading overlay & steps 1–6
      const overlay = document.getElementById('loadingOverlay');
      overlay.classList.remove('hidden');

      ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('done', 'active');
          const chk = el.querySelector('.step-check');
          if (chk) chk.classList.add('hidden');
        }
      });

      const btn = document.getElementById('generateBtn');
      btn.querySelector('.btn-text').classList.add('hidden');
      btn.querySelector('.btn-loader').classList.remove('hidden');
      btn.disabled = true;

      // Animate steps
      await runLoadingAnimation();

      // Compute plan
      const plan = generateSmartTripPlan(formData);

      overlay.classList.add('hidden');
      btn.querySelector('.btn-text').classList.remove('hidden');
      btn.querySelector('.btn-loader').classList.add('hidden');
      btn.disabled = false;

      // Render plan to DOM
      renderResults(plan);
    });
  }

  // Replan actions
  function replan() {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('destination').focus();
  }
  document.getElementById('replanBtn')?.addEventListener('click', replan);
  document.getElementById('replanBtn2')?.addEventListener('click', replan);

  // Print actions
  function printPlan() { window.print(); }
  document.getElementById('printBtn')?.addEventListener('click', printPlan);
  document.getElementById('printBtn2')?.addEventListener('click', printPlan);

  // Input glow & blur error clearance
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      const glow = input.closest('.input-wrapper')?.querySelector('.input-glow');
      if (glow) glow.style.opacity = '1';
    });
    input.addEventListener('blur', () => {
      const glow = input.closest('.input-wrapper')?.querySelector('.input-glow');
      if (glow) glow.style.opacity = '0';
      if (input.value && document.getElementById(`${input.id}-error`)) {
        document.getElementById(`${input.id}-error`).textContent = '';
        input.style.borderColor = '';
      }
    });
  });
});
