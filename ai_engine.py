import os
import json
import logging
import math
from google import genai
from google.genai import types
from google.genai.errors import APIError

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to the local places database
DB_PATH = os.path.join(os.path.dirname(__file__), 'places_db.json')

# Coordinates for major Origin / Home Cities
HOME_COORDINATES = {
    "Delhi": (28.61, 77.20),
    "Mumbai": (19.07, 72.87),
    "Kolkata": (22.57, 88.36),
    "Chennai": (13.08, 80.27),
    "Bangalore": (12.97, 77.59),
    "Hyderabad": (17.38, 78.48),
    "Raipur": (21.25, 81.63),
    "Ahmedabad": (23.02, 72.57),
    "Jaipur": (26.91, 75.78),
    "Guwahati": (26.14, 91.74),
    "Lucknow": (26.85, 80.94),
    "Patna": (25.59, 85.13),
    "Kochi": (9.93, 76.26),
    "Bhopal": (23.25, 77.41),
    "Bhubaneswar": (20.29, 85.82),
    "Ranchi": (23.34, 85.30)
}

# Coordinates for all potential Starting Cities
STARTING_CITY_COORDINATES = {
    "Raipur": (21.25, 81.63),
    "Jagdalpur": (19.07, 82.03),
    "Bilaspur": (22.08, 82.14),
    "Srinagar": (34.08, 74.80),
    "Guwahati": (26.14, 91.74),
    "Bangalore": (12.97, 77.59),
    "Shillong": (25.57, 91.88),
    "Rishikesh": (30.08, 78.27),
    "Chandigarh": (30.73, 76.78),
    "Aurangabad": (19.87, 75.34),
    "Siliguri": (26.72, 88.42),
    "Madurai": (9.92, 78.11),
    "Kochi": (9.93, 76.26),
    "Ahmedabad": (23.02, 72.57),
    "Ranchi": (23.34, 85.30),
    "Sambalpur": (21.46, 83.97),
    "Ambikapur": (23.12, 83.19),
    "Aut": (31.75, 77.20),
    "Itanagar": (27.08, 93.60),
    "Kadapa": (14.47, 78.82),
    "Bandipora": (34.42, 74.65),
    "Warangal": (18.00, 79.58),
    "Himmatnagar": (23.60, 72.96),
    "Kottayam": (9.59, 76.52),
    "Panaji": (15.49, 73.82),
    "Margao": (15.27, 73.95),
    "Darjeeling": (27.04, 88.26),
    "Patna": (25.59, 85.13),
    "Gorakhpur": (26.76, 83.37),
    "Agra": (27.17, 78.00),
    "Gwalior": (26.21, 78.17),
    "Dimapur": (25.90, 93.72),
    "Kohima": (25.67, 94.11),
    "Imphal": (24.81, 93.93),
    "Silchar": (24.83, 92.77),
    "Agartala": (23.83, 91.28),
    "Dharmanagar": (24.36, 92.16),
    "Aizawl": (23.73, 92.71),
    "Panchkula": (30.69, 76.86),
    "Ludhiana": (30.90, 75.85),
    "Visakhapatnam": (17.68, 83.21),
    "Vijayawada": (16.50, 80.64),
    "Tezpur": (26.63, 92.79),
    "Gaya": (24.79, 85.00),
    "Goa (Dabolim)": (15.38, 73.83),
    "Kalka": (30.83, 76.93),
    "Coimbatore": (11.01, 76.95),
    "Rameswaram": (9.28, 79.31),
    "Jhanshi": (25.44, 78.56),
    "Jabalpur": (23.16, 79.93),
    "Pune": (18.52, 73.85),
    "Mumbai": (19.07, 72.87),
    "Puri": (19.81, 85.83),
    "Rajkot": (22.30, 70.80),
    "Junagadh": (21.52, 70.45),
    "Jamshedpur": (22.80, 86.20),
    "Mysore Junction": (12.31, 76.64),
    "Khajuraho": (24.85, 79.93),
    "Jalna": (19.84, 75.88),
    "Jaipur Airport": (26.82, 75.80),
    "Kota Junction": (25.21, 75.86),
    "Kullu": (31.95, 77.10),
    "Bandipora": (34.42, 74.65)
}

def load_places_database():
    """
    Loads the complete 36-state database from places_db.json.
    """
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading database: {e}")
        return []

def get_place_by_id(place_id):
    """
    Helper to fetch a specific place's data from the database.
    """
    db = load_places_database()
    for place in db:
        if place['id'] == place_id:
            return place
    return None

def calculate_haversine_distance(coords1, coords2):
    """
    Calculates the geodesic distance between two lat/lon coordinates in kilometers.
    Uses the Haversine formula.
    """
    lat1, lon1 = coords1
    lat2, lon2 = coords2
    
    R = 6371.0 # Radius of earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def generate_local_itinerary_fallback(place_data, home_city, starting_city, days, budget, travel_style, total_travelers=1, female_travelers=0):
    """
    Generates a high-quality, customized itinerary using local rules.
    This acts as a fallback when Gemini API key is missing or invalid.
    Calculates dynamic long-distance transit costs using geodesic distances from Home to Starting City,
    and local transit costs from Starting City to the destination.
    """
    logger.info(f"Local fallback generating for {place_data['name']} starting from {starting_city} for user from {home_city}. Group size: {total_travelers}, female travelers: {female_travelers}.")
    
    # 1. Select the base day-by-day itinerary
    days_str = str(days)
    if days_str not in place_data['itineraries']:
        available_days = sorted([int(k) for k in place_data['itineraries'].keys()])
        closest_days = min(available_days, key=lambda x: abs(x - days))
        days_str = str(closest_days)
    
    base_itinerary = place_data['itineraries'][days_str]
    
    # 2. Get distance from starting city to destination
    local_distance = place_data['starting_city_distances'].get(starting_city, 50)
    
    # 3. Calculate distance from home city to starting city
    home_coords = HOME_COORDINATES.get(home_city, (22.57, 88.36)) # default to Kolkata
    start_coords = STARTING_CITY_COORDINATES.get(starting_city, (21.25, 81.63)) # default to Raipur
    home_distance = calculate_haversine_distance(home_coords, start_coords)
    
    # 4. Formulate cost tiers based on budget constraints and travel style
    # lodging choices
    if travel_style == 'luxury' and budget > (place_data['accommodation']['luxury'] * days + 6000):
        stay_type = 'luxury'
        stay_cost_per_night = place_data['accommodation']['luxury']
    elif travel_style == 'budget' or budget < (place_data['accommodation']['mid_range'] * days + 3000):
        stay_type = 'budget'
        stay_cost_per_night = place_data['accommodation']['budget']
    else:
        stay_type = 'mid_range'
        stay_cost_per_night = place_data['accommodation']['mid_range']
        
    # transportation choices & dynamic mileage rates
    if travel_style == 'luxury':
        transport_mode = 'Private Cab'
        km_rate = 14
        local_daily = 600
        home_transit_rate = 7.5 # flight / premium cab
    elif travel_style == 'budget':
        transport_mode = 'Public Bus'
        km_rate = 2.5
        local_daily = 100
        home_transit_rate = 1.2 # sleeper train
    else:
        transport_mode = 'Local Auto'
        km_rate = 9.5
        local_daily = 350
        home_transit_rate = 2.8 # AC Train / Express bus
        
    # Calculate travel transport cost: Round trip transit from starting city + daily local travel
    local_transit_cost = int((local_distance * 2 * km_rate) + (local_daily * days))
    if travel_style == 'budget':
        local_transit_cost = local_transit_cost * total_travelers
    elif travel_style == 'mid_range':
        auto_count = math.ceil(total_travelers / 3)
        local_transit_cost = local_transit_cost * auto_count
    
    # Calculate Home to Starting City travel cost
    home_transit_cost = 0
    if home_city != starting_city:
        home_transit_cost = int(home_distance * home_transit_rate * 2) * total_travelers # Round trip home transit
        
    room_count = math.ceil(total_travelers / 2)
    total_lodging = stay_cost_per_night * days * room_count
    total_food = place_data['food_cost_per_day'] * days * total_travelers
    
    # 5. Calculate entry ticket costs
    total_tickets = 0
    days_plan = []
    
    # Render day-by-day schedule from template
    for day_info in base_itinerary:
        day_tickets = 0
        for sight in day_info.get('sights', []):
            clean_sight_key = sight.lower().replace(' ', '_').replace('&', 'and')
            ticket_price = place_data['entry_tickets'].get(clean_sight_key, 0)
            day_tickets += ticket_price
            
        total_tickets += day_tickets * total_travelers
        
        # Modify activities if women safety is concern
        activities = list(day_info["activities"])
        if female_travelers > 0:
            activities = [act.replace("Evening:", "Early Evening (wrap up by 7:30 PM):").replace("Night:", "Evening (secure private transit to hotel):") for act in activities]
            
        days_plan.append({
            "day": day_info["day"],
            "title": day_info["title"],
            "activities": activities,
            "sights": day_info["sights"],
            "estimated_tickets_cost": day_tickets * total_travelers
        })
        
    # Dynamic adventure additions for 4, 5, or 6 days to make it extremely detailed & explorable:
    extra_adventures_db = {
        "mainpat": [
            {
                "title": "Jaljali Swamp & Deurpur Tribal Hike",
                "activities": [
                    "Morning: Trek through the tall pine forest trails near Jaljali Valley to explore old caves.",
                    "Afternoon: Spend time in Deurpur village, sharing a local meal and learning about herbal forest medicine.",
                    "Evening: Relax by a clear spring stream, watching local bird life and collecting wild forest honey."
                ],
                "sights": ["Jaljali Pine Forests", "Deurpur Village Trails"]
            },
            {
                "title": "Bhanwar Khol Waterfall & Hidden Cave Walk",
                "activities": [
                    "Morning: Drive to Bhanwar Khol gorge and hike down the steep rocky pathway to see the waterfall.",
                    "Afternoon: Walk through the hidden caverns tucked directly behind the water curtain (wear good boots).",
                    "Evening: Set up a quiet riverside picnic and return to camp for a traditional Tibetan campfire chat."
                ],
                "sights": ["Bhanwar Khol Gorge", "Hidden Water Caverns"]
            },
            {
                "title": "Kardana Village Mountain Bike Trail",
                "activities": [
                    "Morning: Rent a mountain bike to explore the raw dirt roads leading to the border village of Kardana.",
                    "Afternoon: Visit local potato plantations and learn about organic mountain farming.",
                    "Evening: Climb to an unnamed forest hilltop to watch the panoramic sunset over the valley."
                ],
                "sights": ["Kardana Dirt Trails", "Forest Sunset Peak"]
            }
        ],
        "chitrakote_falls": [
            {
                "title": "Kanger River Canopy Walk & Birdwatching",
                "activities": [
                    "Morning: Walk across the steel suspension canopy bridges high above the Kanger River forest.",
                    "Afternoon: Look for rare Hill Mynas and giant flying squirrels in the dense sal canopy.",
                    "Evening: Walk to a weekly tribal village market (Haat) to shop for direct handmade clay items."
                ],
                "sights": ["Kanger Canopy Bridge", "Village Weekly Haat"]
            },
            {
                "title": "Dandak Cave Spelunking & Exploration",
                "activities": [
                    "Morning: Hike the steep forest trails to Dandak Cave, entering the deep limestone chambers.",
                    "Afternoon: Study the unique cave stalactite pillars and listen to the echo acoustics.",
                    "Evening: Return via a scenic rural drive through the teak plantations."
                ],
                "sights": ["Dandak Caves", "Teak Forest Trails"]
            },
            {
                "title": "Kondagaon Dhokra Craft Village Excursion",
                "activities": [
                    "Morning: Visit the nearby craft hub of Kondagaon to meet local Bell-Metal casting artisans.",
                    "Afternoon: Participate in a quick wax-molding demo to build a souvenir bell.",
                    "Evening: Walk along a quiet rural lake to watch sunset."
                ],
                "sights": ["Kondagaon Craft Workshops", "Rural Lake View"]
            }
        ]
    }

    generic_adventures = [
        {
            "title": "Offbeat Wilderness Trail & Local Village Discovery",
            "activities": [
                "Morning: Set out with an experienced local guide on an unmarked trail to explore deep forest streams.",
                "Afternoon: Stroll into a small rural settlement to drink tea with village elders and listen to folklore.",
                "Evening: Rest at a quiet valley viewpoint observing the local farming lifestyle."
            ],
            "sights": ["Unmarked Forest Trails", "Rural Settlement Sights"]
        },
        {
            "title": "Secret Cliff Trek & Scenic Sunset Picnic",
            "activities": [
                "Morning: Climb up a rocky hill track to find a hidden clearing looking over the entire river basin.",
                "Afternoon: Enjoy a quiet picnic lunch prepared with fresh, organic local grains and fruits.",
                "Evening: Capture photographs of the valley lights as they flicker on at dusk."
            ],
            "sights": ["Hidden Valley Viewpoint", "Nature Trails"]
        },
        {
            "title": "Local Craft Cooperatives & Historic Alleys Walk",
            "activities": [
                "Morning: Walk through nearby pottery or handloom workshops to see the traditional artisans at work.",
                "Afternoon: Join a quick handcraft demo, trying your hand at shaping clay tiles or weaving thread.",
                "Evening: Explore the oldest market streets, tasting traditional home-styled street foods."
            ],
            "sights": ["Artisan Handloom Cooperatives", "Historic Market Streets"]
        }
    ]

    current_days_count = len(days_plan)
    if days > current_days_count:
        place_custom_list = extra_adventures_db.get(place_data["id"], [])
        for idx, extra_day in enumerate(range(current_days_count + 1, days + 1)):
            if idx < len(place_custom_list):
                adv_info = place_custom_list[idx]
            else:
                generic_idx = (idx - len(place_custom_list)) % len(generic_adventures)
                adv_info = generic_adventures[generic_idx]
                
            days_plan.append({
                "day": extra_day,
                "title": adv_info["title"],
                "activities": adv_info["activities"],
                "sights": adv_info["sights"],
                "estimated_tickets_cost": 0
            })
            total_food += place_data['food_cost_per_day']
            total_lodging += stay_cost_per_night
            local_transit_cost += local_daily
            
    # Force the last day to always be Departure
    days_plan[-1] = {
        "day": days,
        "title": "Local Souvenir Shopping & Departure Gateway",
        "activities": [
            "Morning: Check out of your lodging and visit the nearest tribal / rural handcraft cooperatives to buy local souvenirs.",
            "Afternoon: Pack up luggage and sit down for a traditional local regional lunch at a family-run dhaba/eatery.",
            f"Evening: Board your return transit vehicle back to the gateway city of {starting_city} to depart back home."
        ],
        "sights": ["Artisan Souvenir Cooperatives", f"{starting_city} Transit Gateway"],
        "estimated_tickets_cost": 0
    }

    # Include home transit cost inside overall transport cost, but keep the separate key for detail breakdown
    total_estimated_cost = total_lodging + local_transit_cost + total_food + total_tickets + home_transit_cost
    
    tips = place_data["extra_tips"] + [
        f"Transit from {home_city}: Taking the '{'Flight/Cab' if travel_style=='luxury' else 'AC Train' if travel_style=='mid_range' else 'Sleeper Train'}' to {starting_city} saves budget at ₹{home_transit_cost}.",
        f"Local Transit: Using {transport_mode} inside {place_data['name']} keeps local travel at ₹{local_transit_cost}."
    ]
    
    result = {
        "destination": place_data["name"],
        "state": place_data["state"],
        "is_popular": place_data.get("is_popular", False),
        "starting_city": starting_city,
        "home_city": home_city,
        "description": place_data["description"],
        "lat": place_data["lat"],
        "lon": place_data["lon"],
        "best_season": place_data["best_season"],
        "duration_days": days,
        "travel_style": travel_style,
        "is_ai_generated": False,
        "cost_summary": {
            "lodging_cost": total_lodging,
            "transport_cost": local_transit_cost,
            "home_transit_cost": home_transit_cost,
            "tickets_cost": total_tickets,
            "food_cost": total_food,
            "misc_cost": int(total_estimated_cost * 0.05),
            "total_estimated": int(total_estimated_cost * 1.05)
        },
        "details": {
            "accommodation_level": stay_type.title(),
            "transportation_mode": transport_mode,
            "home_distance_km": int(home_distance)
        },
        "itinerary": days_plan,
        "women_safety": place_data["women_safety"],
        "pros": place_data["pros"],
        "cons": place_data["cons"],
        "warnings": place_data["warnings"],
        "cost_saving_tips": tips,
        "fun_facts": [
            f"The travel distance from your home town ({home_city}) to the destination starting hub ({starting_city}) is about {int(home_distance)} km.",
            f"{place_data['name']} represents a curated {'popular hotspot' if place_data.get('is_popular') else 'hidden gem'} in {place_data['state']} ideal for first-time travelers."
        ]
    }
    
    return result

def generate_ai_itinerary(place_data, home_city, starting_city, days, budget, travel_style, total_travelers=1, female_travelers=0, api_key=None):
    """
    Generates a highly personalized, AI-driven travel plan using Google Gemini API.
    Computes geodesic distance from Home City to Starting City and injects it into context.
    Falls back to local rule-based itinerary if API calls fail or credentials are empty.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        logger.info("No Gemini API Key found. Falling back to local generator.")
        return generate_local_itinerary_fallback(place_data, home_city, starting_city, days, budget, travel_style, total_travelers, female_travelers)
        
    try:
        client = genai.Client(api_key=key)
        
        # Calculate coordinates and distance
        home_coords = HOME_COORDINATES.get(home_city, (22.57, 88.36))
        start_coords = STARTING_CITY_COORDINATES.get(starting_city, (21.25, 81.63))
        home_distance = calculate_haversine_distance(home_coords, start_coords)
        local_distance = place_data["starting_city_distances"].get(starting_city, 50)
        
        db_context = {
            "name": place_data["name"],
            "state": place_data["state"],
            "is_popular": place_data.get("is_popular", False),
            "home_city": home_city,
            "starting_city": starting_city,
            "home_to_starting_city_km": int(home_distance),
            "starting_city_to_dest_km": local_distance,
            "description": place_data["description"],
            "best_season": place_data["best_season"],
            "entry_tickets": place_data["entry_tickets"],
            "transportation_costs": place_data["transportation"],
            "accommodation_options": place_data["accommodation"],
            "base_food_cost_per_day": place_data["food_cost_per_day"],
            "women_safety": place_data["women_safety"],
            "pros": place_data["pros"],
            "cons": place_data["cons"],
            "warnings": place_data["warnings"],
            "extra_tips": place_data["extra_tips"],
            "base_itinerary": place_data["itineraries"].get(str(days), place_data["itineraries"].get("3"))
        }
        
        prompt = f"""
        You are a expert local travel planner in India specializing in popular hotspots and hidden gems.
        Your goal is to customize a detailed day-by-day travel itinerary for:
        - Destination: {place_data['name']} ({place_data['state']})
        - User Home Town: {home_city}
        - Destination Gateway/Starting City: {starting_city} (Distance from home is {int(home_distance)} km; distance to destination is {local_distance} km)
        - Duration: {days} Days
        - Total Budget: {budget} INR
        - Travel Style: {travel_style} (Options: budget, mid_range, luxury)
        - Total Number of Travelers: {total_travelers}
        - Number of Female Travelers in group: {female_travelers}

        Use this verified ground-truth data about the place to calculate realistic costs, safety profiles, warnings, and schedule realistic sights:
        {json.dumps(db_context, indent=2)}

        CONSTRAINTS:
        1. All calculations must be in INR. The total estimated cost in 'cost_summary' must fit the budget ({budget} INR).
        2. All lodging, food, and local activity ticket prices must be multiplied dynamically for {total_travelers} travelers (i.e. 'lodging_cost' = stay_cost_per_night * days * room_count, etc.). Adjust lodging based on total travelers assuming 2-3 people per room.
        3. Calculate the 'home_transit_cost' for round-trip travel from {home_city} to {starting_city} for ALL {total_travelers} travelers (approx rates per km per traveler: luxury=7.5, mid_range=2.8, budget=1.2). If {home_city} equals {starting_city}, set 'home_transit_cost' to 0.
        4. Day 1 should describe leaving from {home_city} (flight/train) and arriving at {place_data['name']} via {starting_city}. Day {days} (the final day) must describe local morning sightseeing/shopping, checking out of the lodging, and returning back home via {starting_city} (Departure).
        5. Integrate a comprehensive 'women_safety' review based on the ground-truth data.
        6. SAFETY PROTOCOLS: If female_travelers > 0 (or if it's a female solo traveler):
           - In the 'day_by_day' activities, schedule earlier evening wrap-up times (e.g. returning to hotel by 8:00 PM).
           - Suggest pre-arranged private cabs or trusted state transit instead of local hitchhiking or late-night remote sharing autos.
           - Recommend centrally-located, high-security stays with active security desks.
           - Provide custom warning tips in the 'warnings' or 'extra_tips' fields explicitly addressing female safety (e.g. safe zones, emergency contacts, local dress guidelines).
        5. List pros, cons, and warnings clearly.
        6. The day-by-day itinerary MUST be highly detailed, adventurous, and rich with exploration. Mention MULTIPLE hidden spots, local viewpoint tracks, lesser-known wilderness trails, village homestays, and regional activities (instead of just 1 or 2 tourist sights) so that travelers can explore anywhere.
        7. For 4, 5, or 6 days, distribute the activities evenly and include full-day excursions to surrounding offbeat valley areas or wilderness reserves.
        8. Return strictly a JSON object matching the schema below. No extra text or markdown wrappers besides the valid JSON.

        JSON SCHEMA:
        {{
            "destination": "{place_data['name']}",
            "state": "{place_data['state']}",
            "is_popular": {str(place_data.get('is_popular', False)).lower()},
            "starting_city": "{starting_city}",
            "home_city": "{home_city}",
            "description": "Enriched description highlighting the elements of the destination",
            "lat": {place_data['lat']},
            "lon": {place_data['lon']},
            "best_season": "{place_data['best_season']}",
            "duration_days": {days},
            "travel_style": "{travel_style}",
            "is_ai_generated": true,
            "cost_summary": {{
                "lodging_cost": <integer_total_hotel_cost>,
                "transport_cost": <integer_local_transport_cost_within_destination>,
                "home_transit_cost": <integer_long_distance_travel_cost_from_home_to_starting_city>,
                "tickets_cost": <integer_total_entry_fees>,
                "food_cost": <integer_total_food_cost>,
                "misc_cost": <integer_buffer_contingency>,
                "total_estimated": <integer_sum_of_above>
            }},
            "details": {{
                "accommodation_level": "<Budget/Mid-Range/Luxury depending on style and budget>",
                "transportation_mode": "<Public Bus/Auto-Rickshaw/Private Cab/Rental Bike depending on style>",
                "home_distance_km": {int(home_distance)}
            }},
            "itinerary": [
                {{
                    "day": 1,
                    "title": "Day Title",
                    "activities": [
                        "Morning: travel from {home_city} to {starting_city}",
                        "Afternoon: check in at {place_data['name']}",
                        "Evening: initial sightseeing"
                    ],
                    "sights": ["Sight Name 1", "Sight Name 2"],
                    "estimated_tickets_cost": <integer_tickets_for_this_day>
                }}
            ],
            "women_safety": "Detailed safety evaluation and travel advice for women",
            "pros": ["Pro 1", "Pro 2"],
            "cons": ["Con 1", "Con 2"],
            "warnings": ["Warning 1", "Warning 2"],
            "cost_saving_tips": [
                "Specific local tip 1",
                "Specific local tip 2"
            ],
            "fun_facts": [
                "Interesting historical or geological fact 1",
                "Interesting culture or nature fact 2"
            ]
        }}
        """
        
        logger.info(f"Calling Gemini API to generate itinerary starting from home {home_city} to {place_data['name']}...")
        
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        itinerary_data = json.loads(response.text.strip())
        itinerary_data["is_ai_generated"] = True
        return itinerary_data
        
    except APIError as e:
        logger.error(f"Gemini API Error: {e}. Falling back to local generator.")
        return generate_local_itinerary_fallback(place_data, home_city, starting_city, days, budget, travel_style)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error from Gemini response: {e}. Falling back to local generator.")
        return generate_local_itinerary_fallback(place_data, home_city, starting_city, days, budget, travel_style)
    except Exception as e:
        logger.error(f"Unexpected error in AI generator: {e}. Falling back to local generator.")
        return generate_local_itinerary_fallback(place_data, home_city, starting_city, days, budget, travel_style)

def get_janhawk_chat_reply(place_data, user_message, api_key=None):
    """
    Generate a travel-planning chat response for the Janhawk chatbot.
    Highly intelligent conversational AI that handles any user query, while referencing
    ground-truth details for contextual queries.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY")
    place_name = place_data['name']
    place_state = place_data['state']
    
    # 1. Local Fallback Generator (regex matching) if no API key is set
    if not key:
        msg_lower = user_message.lower()
        if any(w in msg_lower for w in ["hotel", "stay", "accommodation", "room", "resort", "lodge"]):
            return f"Regarding hotels in {place_name}: Average rates are Budget: ₹{place_data['accommodation']['budget']}/night, Mid-range: ₹{place_data['accommodation']['mid_range']}/night, and Luxury: ₹{place_data['accommodation']['luxury']}/night. Verified options: {place_data.get('hotels', 'Homestays and regional guest lodges')}."
        if any(w in msg_lower for w in ["safety", "safe", "woman", "solo", "girl", "security"]):
            return f"Women Safety Profile for {place_name}: {place_data['women_safety']}"
        if any(w in msg_lower for w in ["warning", "caution", "danger", "fog", "monsoon", "careful"]):
            warnings_text = " ".join(place_data['warnings'])
            return f"Travel Cautions and Warnings for {place_name}: {warnings_text}"
        if any(w in msg_lower for w in ["food", "eat", "dish", "cuisine", "restaurant", "lunch", "dinner"]):
            tips = [t for t in place_data['extra_tips'] if any(x in t.lower() for x in ['food', 'momo', 'eat', 'taste', 'dine'])]
            tips_text = " ".join(tips) if tips else "Try traditional local family-run eateries for delicious regional dishes!"
            return f"Food suggestions in {place_name}: {tips_text} Recommended eateries: {place_data.get('restaurants', 'Local family-run dhabas')}."
        if any(w in msg_lower for w in ["sight", "visit", "place", "explore", "attraction", "landmark"]):
            sights = []
            for k, days_list in place_data.get('itineraries', {}).items():
                for d in days_list:
                    sights.extend(d.get('sights', []))
            sights_str = ", ".join(list(set(sights)))
            return f"Sights you should check out in {place_name}: {sights_str}. Click on the timeline sight cards to see pictures of them!"
            
        return f"Namaste! I am Janhawk. As a conversational assistant, I'd love to help! Tell me, are you interested in hotels, food, safety warning guidelines, or sights for {place_name}? I can answer anything about your trip!"

    # 2. Advanced Gemini chatbot generation (highly intelligent, answers anything like ChatGPT)
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(api_key=key)
        
        prompt = f"""
        You are Janhawk, a highly capable and unlimited general-purpose conversational AI assistant (similar to ChatGPT) built by 'Yatra AI'.
        
        ACTIVE CONTEXT:
        The user is currently planning a trip to '{place_name}' (located in {place_state}).
        Here is verified local database information about '{place_name}':
        - State: {place_state}
        - Description: {place_data['description']}
        - Women Safety Profile: {place_data['women_safety']}
        - Average Daily Lodging Rates: Budget: ₹{place_data['accommodation']['budget']}, Mid-range: ₹{place_data['accommodation']['mid_range']}, Luxury: ₹{place_data['accommodation']['luxury']}
        - Cautions & Warnings: {place_data['warnings']}
        - Sights & Itinerary: {place_data['itineraries']}
        - Local Travel Hacks: {place_data['extra_tips']}
        - Best Hotels in {place_name}: {place_data.get('hotels', 'Homestays and regional guest lodges')}
        - Top Eating Joints in {place_name}: {place_data.get('restaurants', 'Local family-run dhabas')}
        
        ROLE INSTRUCTIONS:
        1. Act as a general-purpose, highly intelligent conversational assistant (like ChatGPT). You must answer ANY question the user asks on any topic (including coding help, general knowledge, writing essays, math equations, history, jokes, or travel advice for other cities/countries) without refusing or restricting their query.
        2. If the user asks about local travel plans, lodging, restaurants, safety, or warnings for the active destination ({place_name}), prioritize using the verified local database details provided above to give highly accurate facts.
        3. Maintain a helpful, smart, and friendly tone. Keep responses clear, engaging, and relatively concise (under 130 words).
        
        User Message: {user_message}
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3
            )
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini chatbot error: {e}")
        return f"Namaste! As Janhawk, I can help you with travel-related queries for {place_name} (such as hotels, food, safety, warnings, and sights). Please keep your questions relevant to {place_name}."
