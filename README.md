# ✈️ SmartTrip AI (v2.5) — Advanced Planning Orchestrator & Reviewer

> A high-performance, client-side, dual-agent travel planning system built with pure vanilla web technologies.

[![Version](https://img.shields.io/badge/version-2.5.0-blue.svg)](https://github.com/Shivambhatt2305/TRIP-PLANNER)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Pure Vanilla](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange.svg)](#technology-stack)
[![No External APIs](https://img.shields.io/badge/APIs-None%20Required%20(Client--Side)-brightgreen.svg)](#technology-stack)

---

## 🌟 Overview

**SmartTrip AI v2.5** is an agentic, budget-constrained travel planning system. Unlike standard trip generators that hallucinate numbers or create impractical zigzagging itineraries, SmartTrip AI operates with a **Dual-Agent Architecture**:
- **Role A — Planning Orchestrator:** Validates constraints, groups destinations into contiguous neighborhood clusters (anti-backtracking), and schedules morning/afternoon/evening sessions.
- **Role B — Independent Reviewer:** An automated auditing engine that checks for constraint violations, daily time-envelope limits, route feasibility, and deterministic budget math.
- **Deterministic 6-Category Cost Engine:** Itemizes costs programmatically without relying on LLM arithmetic.

---

## 🚀 Key Features (6-Step Architecture)

### 1. 🔍 Step 1 — Extract Constraints
- **Hard Constraints**: Destination, Trip Duration (Days), Number of Travelers, Maximum Budget.
- **Soft Preferences**: Origin / Starting Location, Travel Dates, Accommodation Preference (Hostel, Hotel, Airbnb, Resort), Transportation Preference (Flight, Train, Bus, Self-Drive, Cruise), Food Dietaries (Local, Vegan, Halal, Seafood, Street Food, Fine Dining), and Interests (Culture, Food, Adventure, Nature, Nightlife, Art, Photography).

### 2. 📍 Step 2 — Geographic Clustering & Place Selection
- Prevents wasted transit time and high taxi fares by grouping morning, lunch, afternoon, dinner, and evening spots within contiguous neighborhood zones (e.g., Paris Central/1st Arr., Left Bank/7th Arr., Montmartre/18th Arr.).

### 3. 🗓️ Step 3 — Day-by-Day Session Itinerary
- **🌅 Morning Session**: Destination place, planned activity, and estimated duration.
- **☀️ Afternoon Session**: Mid-day exploration and cultural highlights.
- **🌙 Evening Session**: Sunset views, dining, and nightlife entertainment.
- **Daily Footers**: Specific transit recommendations, curated lunch/dinner restaurants, selected lodging, and daily total cost badges.

### 4. 🗺️ Step 4 — Map & Route Information
- Embedded interactive map centered on the target destination.
- Waypoint route table displaying:
  - Sequence order (1 to 7)
  - Landmark / restaurant name
  - Segment category
  - Realistic segment distance (km)
  - Estimated travel time and transit mode

### 5. 💰 Step 5 — Itemized 6-Category Cost Breakdown
Accurate estimations tailored to selected currency (`USD`, `EUR`, `GBP`, `INR`, `JPY`, `AUD`, `CAD`):
1. ✈️ **Long-Distance Transportation** (Flights, trains, or intercity coaches from origin)
2. 🏨 **Accommodation** (Calculated with room-sharing formulas and lodging style modifiers)
3. 🍽️ **Food & Dining** (Scaled to traveler count, days, and dining habits)
4. 🎡 **Activities & Attractions** (Museums, observation decks, guided tours)
5. 🚌 **Local Transportation** (Metro passes, tram tickets, city buses)
6. 🛡️ **Miscellaneous & Contingency** (Buffer fund for emergency expenses, SIM cards, tips)

### 6. 📋 Step 6 — Budget Health & Smart Alternatives
- **Budget Health Indicator**: Real-time visual comparison showing budget surplus or deficit amount and percentage.
- **Assumptions Panel**: Transparent list of baseline assumptions (room sharing, off-peak pricing, public transit pass usage).
- **Money-Saving Tips**: High-impact, destination-specific advice.
- **Cheaper Alternatives Generator**: If over budget, the engine automatically calculates concrete cost savings by switching accommodation tiers, exploring local street food markets, opting for high-speed rail, or utilizing city passes.

---

## 🎨 Design & Aesthetic Highlights

- **Sleek Dark Mode**: Deep navy/slate palette (`#0a0e1a` / `#0f1629`) with glassmorphism cards and subtle backdrop blur.
- **Floating Ambient Particles**: Dynamic, lightweight CSS canvas animations.
- **6-Step Animated Loader**: Real-time step progress indicator before displaying the itinerary.
- **Print & PDF Support**: Built-in `@media print` styling for saving itineraries as clean, printable travel documents.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile screens.

---

## 📁 Repository Structure

```text
TRIP-PLANNER/
├── index.html       # Semantic HTML5 markup, forms, step cards & modal structures
├── style.css        # Vanilla CSS3 design system, glassmorphism, responsive grid & animations
├── app.js           # Core planner engine, destination knowledge base, currency FX & DOM handlers
└── README.md        # Project documentation and guide
```

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 with accessibility best practices.
- **Styles**: Vanilla CSS3 (Custom properties / CSS variables, Grid, Flexbox, Keyframe animations).
- **Typography**: Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) for headers, [Inter](https://fonts.google.com/specimen/Inter) for body).
- **Scripts**: Modern Vanilla JavaScript (ES6+, async/await, DOM observers).
- **Maps**: Interactive Google Maps / OpenStreetMap embed.

---

## 💻 Getting Started Locally

No complex dependencies, build tools, or npm installations are required.

### Option 1: Direct File Open
Double click `index.html` or open it directly in any modern browser (Chrome, Firefox, Edge, Safari).

### Option 2: Using a Local Server
Run with any lightweight server of your choice:

**Using Node.js:**
```bash
npx serve .
```

**Using Python:**
```bash
python -m http.server 3000
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Shivambhatt2305/TRIP-PLANNER/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
