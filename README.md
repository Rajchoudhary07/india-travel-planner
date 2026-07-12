# 🗺️ YātrāAI: India Travel Itinerary Planner

YātrāAI is a premium, dark-themed travel itinerary planning application designed to uncover India's popular hotspots and hidden gems. Built with Flask, Leaflet.js, Chart.js, and powered by Google Gemini AI (with a robust mathematical offline fallback engine), the app helps travelers create realistic, cost-efficient, and safety-audited travel blueprints.

---

## ✨ Features

- **🌐 36 States & UTs Coverage**: Contains verified destination profiles, safety ratings, warnings, pros/cons, and itineraries for all 28 states and 8 Union Territories in India.
- **🌟 Popular vs. Hidden Gems Separation**: Modern side-by-side selection columns dividing mainstream hotspots from offbeat gems.
- **🏠 Home Origin Cost Estimation**: Dynamic calculation of long-distance transit costs from the traveler's home city (Delhi, Mumbai, Kolkata, Chennai, etc.) to the destination's starting hub using coordinate geometry (Haversine formula).
- **🎨 Glassmorphic Dark UI**: Premium user interface featuring micro-animations, glassmorphism, and responsive design.
- **📊 Budget Allocation Charts**: Chart.js doughnut charts illustrating real-time cost shares (Stay, Home Travel, Local Transport, Food, Tickets, and Buffer).
- **🗺️ Interactive Leaflet Map**: Displays a double fly-line connection:
  - *Orange-Dashed Line*: Travel path from the user's home origin to the starting hub.
  - *Yellow-Dashed Line*: Local transit path from the starting hub to local sights.
- **🛡️ Women's Safety Audit**: Dedicated safety classifications (Solo travel comfort, local security) and travel warning summaries.
- **🕒 Adventurous 3-6 Day Timelines**: Structured activities with detailed explorations including hidden valley trails, local villages, and viewpoint hikes.

---

## 🛠️ Tech Stack

- **Backend**: Python, Flask, Google GenAI SDK (`google-genai`)
- **Frontend**: HTML5, Vanilla CSS3 (Custom design system), Vanilla Javascript (ES6+)
- **Map Render**: Leaflet.js (CartoDB Dark Matter tile layer)
- **Data Visuals**: Chart.js (Dynamic cost shares)
- **Icons**: FontAwesome v6

---

## 🚀 Getting Started

### 1. Clone or Copy the Repository
Copy the folder to your preferred workspace:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/india-travel-planner.git
cd india-travel-planner
```

### 2. Install Dependencies
Make sure you have Python 3 installed. Install Flask and required SDKs:
```bash
pip install flask google-genai python-dotenv
```

### 3. Add Your Gemini API Key (Optional)
Create a `.env` file in the root folder to activate AI generations:
```env
GEMINI_API_KEY=your-actual-api-key-here
PORT=5001
```
*Note: If no API key is set, the application will automatically trigger the mathematical fallback engine to calculate costs and generate local travel routes.*

### 4. Run the Server
Launch the Flask development server:
```bash
python3 app.py
```
Open **[http://127.0.0.1:5001](http://127.0.0.1:5001)** in your browser.

---

## 📂 Project Structure

```
├── app.py                # Flask server endpoints & payload validations
├── ai_engine.py          # Haversine costing logic & Gemini API prompts
├── places_db.json        # Database covering all 36 Indian States & UTs
├── templates/
│   └── index.html        # Main planning dashboard interface
└── static/
    ├── css/
    │   └── style.css     # Premium custom dark styling rules
    └── js/
        └── app.js        # Cascading dropdown loops, Leaflet plots, & charts
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
