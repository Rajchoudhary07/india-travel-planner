import os
from flask import Flask, jsonify, request, render_template, send_from_directory

from ai_engine import load_places_database, get_place_by_id, generate_ai_itinerary

# Initialize Flask app
app = Flask(
    __name__, 
    static_folder='static', 
    template_folder='templates'
)

# Load configuration from environment variables if present (.env)
from dotenv import load_dotenv
load_dotenv()

@app.route('/')
def index():
    """
    Renders the main single page application interface.
    """
    return render_template('index.html')

@app.route('/api/places', methods=['GET'])
def get_places():
    """
    API endpoint that returns the list of all available places in the database
    including state, starting cities, and base coordinates. This helps the frontend
    generate the hierarchical dropdown selectors.
    """
    db = load_places_database()
    places_list = []
    for place in db:
        places_list.append({
            "id": place["id"],
            "name": place["name"],
            "state": place["state"],
            "is_popular": place.get("is_popular", False),
            "description": place["description"],
            "best_season": place["best_season"],
            "lat": place["lat"],
            "lon": place["lon"],
            "starting_cities": place["starting_cities"]
        })
    return jsonify(places_list)

@app.route('/api/generate-itinerary', methods=['POST'])
def handle_generate_itinerary():
    """
    API endpoint to generate a personalized itinerary.
    Accepts JSON payload:
    {
        "place_id": "mainpat",
        "starting_city": "Raipur",
        "days": 4,
        "budget": 15000,
        "travel_style": "mid_range",
        "api_key": "optional-custom-gemini-key"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request payload"}), 400
            
        place_id = data.get("place_id")
        starting_city = data.get("starting_city")
        home_city = data.get("home_city", starting_city)
        days = data.get("days")
        budget = data.get("budget")
        travel_style = data.get("travel_style", "mid_range")
        api_key = data.get("api_key") # User-provided API key from frontend
        
        # Validations
        if not place_id:
            return jsonify({"error": "Destination place_id is required"}), 400
        if not starting_city:
            return jsonify({"error": "Starting city is required to compute transit costs"}), 400
        if not days or not isinstance(days, int) or days < 1:
            return jsonify({"error": "Valid travel duration in days is required"}), 400
        if not budget or not isinstance(budget, (int, float)) or budget <= 0:
            return jsonify({"error": "Valid budget in INR is required"}), 400
            
        # Get place information from database
        place_data = get_place_by_id(place_id)
        if not place_data:
            return jsonify({"error": f"Destination with ID '{place_id}' not found in database"}), 404
            
        # Verify starting city is valid for this destination
        if starting_city not in place_data["starting_cities"]:
            return jsonify({"error": f"Starting city '{starting_city}' is not linked to destination '{place_data['name']}'"}), 400
            
        # Generate the itinerary using our AI engine (with fallback)
        itinerary = generate_ai_itinerary(
            place_data=place_data,
            home_city=home_city,
            starting_city=starting_city,
            days=days,
            budget=int(budget),
            travel_style=travel_style,
            api_key=api_key
        )
        
        return jsonify(itinerary)
        
    except Exception as e:
        app.logger.error(f"Error generating itinerary: {e}")
        return jsonify({"error": "Internal server error occurred while generating itinerary"}), 500

# Error handlers for clean API responses
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
