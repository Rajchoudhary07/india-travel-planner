import os
from flask import Flask, jsonify, request, render_template, send_from_directory

from ai_engine import load_places_database, get_place_by_id, generate_ai_itinerary, get_or_create_custom_place

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
    adsense_id = os.environ.get("ADSENSE_CLIENT_ID", "")
    return render_template(
        'index.html', 
        adsense_id=adsense_id,
        preloaded_itinerary=None,
        preloaded_itinerary_json=None
    )

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
        total_travelers = int(data.get("total_travelers", 1))
        female_travelers = int(data.get("female_travelers", 0))
        
        # Validations
        if not place_id:
            return jsonify({"error": "Destination place_id is required"}), 400
        if not starting_city:
            return jsonify({"error": "Starting city is required to compute transit costs"}), 400
        if not days or not isinstance(days, int) or days < 1:
            return jsonify({"error": "Valid travel duration in days is required"}), 400
        if not budget or not isinstance(budget, (int, float)) or budget <= 0:
            return jsonify({"error": "Valid budget in INR is required"}), 400
            
        # Get place information from database or dynamically create it
        if place_id == "custom":
            custom_name = data.get("custom_name")
            state_name = data.get("state")
            if not custom_name or not state_name:
                return jsonify({"error": "custom_name and state are required when place_id is 'custom'"}), 400
            place_data = get_or_create_custom_place(custom_name, state_name, starting_city, api_key)
        else:
            place_data = get_place_by_id(place_id)
            
        if not place_data:
            return jsonify({"error": f"Destination with ID '{place_id}' not found in database"}), 404
            
        # Verify starting city is valid for this destination
        if starting_city not in place_data.get("starting_cities", []):
            return jsonify({"error": f"Starting city '{starting_city}' is not linked to destination '{place_data['name']}'"}), 400
            
        # Generate the itinerary using our AI engine (with fallback)
        itinerary = generate_ai_itinerary(
            place_data=place_data,
            home_city=home_city,
            starting_city=starting_city,
            days=days,
            budget=int(budget),
            travel_style=travel_style,
            total_travelers=total_travelers,
            female_travelers=female_travelers,
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

@app.route('/ads.txt')
def ads_txt():
    """
    Serves the Google AdSense ads.txt authorization record.
    """
    content = "google.com, pub-5830823262791349, DIRECT, f08c47fec0942fa0"
    return content, 200, {'Content-Type': 'text/plain'}

@app.route('/google957e1c3f57564602.html')
def google_verification():
    """
    Serves the Google Search Console verification HTML file content.
    """
    return "google-site-verification: google957e1c3f57564602.html", 200, {'Content-Type': 'text/html'}

@app.route('/sitemap.xml', methods=['GET'])
def sitemap():
    """
    Generates sitemap.xml dynamically listing all destinations.
    """
    from flask import make_response
    db = load_places_database()
    
    # Base domain
    base_url = "https://offbeatyatra.online"
    
    pages = []
    # Add home page
    pages.append(f"<url><loc>{base_url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>")
    
    # Add all dynamic destination pages
    for place in db:
        place_id = place["id"]
        pages.append(f"<url><loc>{base_url}/itinerary/{place_id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>")
        
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(pages)}
</urlset>
"""
    response = make_response(sitemap_xml)
    response.headers["Content-Type"] = "application/xml"
    return response

import json

@app.route('/itinerary/<place_id>')
def itinerary_page(place_id):
    """
    Serves index.html with preloaded itinerary data for programmatic SEO.
    """
    place_data = get_place_by_id(place_id)
    if not place_data:
        # Load main page if place is not found
        return render_template('index.html', adsense_id=os.environ.get("ADSENSE_CLIENT_ID", ""))
        
    # Generate default preloaded itinerary for search engine crawlers
    default_starting_city = place_data["starting_cities"][0] if place_data["starting_cities"] else "Raipur"
    itinerary = generate_ai_itinerary(
        place_data=place_data,
        home_city=default_starting_city,
        starting_city=default_starting_city,
        days=place_data.get("default_days", 4),
        budget=12000,
        travel_style="mid_range",
        api_key=None  # Force server-side local rules-engine to run fast & avoid key leaks
    )
    
    adsense_id = os.environ.get("ADSENSE_CLIENT_ID", "")
    preloaded_json = json.dumps(itinerary)
    
    return render_template(
        'index.html',
        adsense_id=adsense_id,
        preloaded_itinerary=itinerary,
        preloaded_itinerary_json=preloaded_json
    )

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
