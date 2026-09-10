import math

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance in kilometers between two points
    on the earth (specified in decimal degrees) using Haversine formula.
    """
    try:
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])

        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return round(c * r, 1)
    except Exception:
        return None

CITY_COORDINATES = {
    'delhi': (28.6139, 77.2090),
    'new delhi': (28.6139, 77.2090),
    'mumbai': (19.0760, 72.8777),
    'bengaluru': (12.9716, 77.5946),
    'bangalore': (12.9716, 77.5946),
    'hyderabad': (17.3850, 78.4867),
    'chennai': (13.0827, 80.2707),
    'kolkata': (22.5726, 88.3639),
    'pune': (18.5204, 73.8567),
    'gurugram': (28.4595, 77.0266),
    'noida': (28.5355, 77.3910),
    'ahmedabad': (23.0225, 72.5714),
    'jaipur': (26.9124, 75.7873),
    'lucknow': (26.8467, 80.9462),
    'chandigarh': (30.7333, 76.7794)
}

def get_city_coords(city_name):
    if not city_name:
        return None
    cleaned = city_name.strip().lower()
    for key, coords in CITY_COORDINATES.items():
        if key in cleaned:
            return coords
    return None
