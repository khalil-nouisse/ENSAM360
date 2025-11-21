import requests
from typing import Dict, Any, Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

class Neo4jBackendClient:
    """
    Client for making requests to Neo4j backend API
    """
    
    def __init__(self):
        self.base_url = os.getenv("BACKEND_API_URL", "http://localhost:3000/api")
        # self.api_key = os.getenv("API_KEY")  # If you have authentication
        
        # Set up headers
        self.headers = {
            "Content-Type": "application/json"
        }
        
        # Add API key if available
        #if self.api_key:
        #    self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    def _make_request(self, method: str, endpoint: str, params: Optional[Dict] = None,
                     data: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Generic method to make HTTP requests with error handling
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            print(f"📡 API Call: {method.upper()} {url}")
            if params:
                print(f"   Parameters: {params}")
            
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                params=params,
                json=data,
                timeout=10  # 10 second timeout
            )
            
            # Raise exception for bad status codes
            response.raise_for_status()
            
            result = response.json()
            print(f"📥 Response Status: {response.status_code}")
            
            return result
            
        except requests.exceptions.Timeout:
            return {"error": "Request timed out. Please try again."}
        except requests.exceptions.ConnectionError:
            return {"error": "Could not connect to the backend. Is it running?"}
        except requests.exceptions.HTTPError as e:
            return {"error": f"HTTP error: {e.response.status_code} - {e.response.text}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    def get_location_by_name(self, name: str) -> Dict[str, Any]:
        """
        Get detailed information about a location by its name
        
        Calls: GET /api/locations/:id
        
        Returns:
        {
            "id": "loc_123",
            "name": "Central Park",
            "description": "Large public park in Manhattan",
            "type": "park",
            "address": "New York, NY",
            "latitude": 40.785091,
            "longitude": -73.968285
        }
        """
        # need to get the id before by calling a function that extracts the id
        return self._make_request("GET", f"/locations/{id}")
    
    def get_nearby_locations(self, name: str, radius: Optional[float] = None, 
                            limit: Optional[int] = None) -> Dict[str, Any]:
        """
        Get locations near a specific location
        need to extract first of all the id of the location by calling a function
        Calls: GET /api/locations/nextLocations/:id
        
        Query params:
        - radius: Search radius in kilometers (optional)
        - limit: Maximum number of results (optional)
        
        Returns:
        {
            "reference_location": "Central Park",
            "nearby": [
                {
                    "name": "Metropolitan Museum",
                    "type": "museum",
                    "distance": 0.5,
                    "direction": "east"
                },
                ...
            ]
        }
        """
        params = {}
        if radius:
            params["radius"] = radius
        if limit:
            params["limit"] = limit
            
        return self._make_request("GET", f"/locations/{name}/nearby", params=params)
    
    def search_locations(self, query: Optional[str] = None, 
                        location_type: Optional[str] = None,
                        limit: Optional[int] = None) -> Dict[str, Any]:
        """
        Search for locations by name or type
        
        Calls: GET /api/locations/search
        
        Query params:
        - q: Search query (partial name match)
        - type: Filter by location type
        - limit: Maximum results
        
        Returns:
        {
            "results": [
                {
                    "id": "loc_456",
                    "name": "Pizza Palace",
                    "type": "restaurant",
                    "description": "Italian restaurant"
                },
                ...
            ],
            "count": 10
        }
        """
        params = {}
        if query:
            params["q"] = query
        if location_type:
            params["type"] = location_type
        if limit:
            params["limit"] = limit
            
        return self._make_request("GET", "/locations/search", params=params)
    
    def get_location_types(self) -> Dict[str, Any]:
        """
        Get all available location types in the database
        
        Calls: GET /api/locations/types
        
        Returns:
        {
            "types": ["restaurant", "park", "museum", "hotel", ...]
        }
        """
        return self._make_request("GET", "/locations/types")
    
    def get_all_locations(self, limit: Optional[int] = None) -> Dict[str, Any]:
        """
        Get all locations (with optional limit)
        
        Calls: GET /api/principaleLocations
        """
        params = {}
        if limit:
            params["limit"] = limit
            
        return self._make_request("GET", "/map/principaleLocations", params=params)


# Create a singleton instance
api_client = Neo4jBackendClient()


# Test function
if __name__ == "__main__":
    """
    Test the API client to make sure your backend is working
    """
    print("Testing Neo4j Backend API Client\n")
    
    # Test 1: Get location types
    # print("1. Getting all location types...")
    # types_result = api_client.get_location_types()
    # print(f"Result: {types_result}\n")
    
    # Test 2: Search locations
    # print("2. Searching for locations...")
    # search_result = api_client.search_locations(query="park", limit=5)
    # print(f"Result: {search_result}\n")
    
    # Test 3: Get specific location (replace with actual name from your DB)
    # print("3. Getting specific location...")
    # location_result = api_client.get_location_by_name("Central Park")
    # print(f"Result: {location_result}\n")
    
    # Test 4: Get nearby locations
    # print("4. Getting nearby locations...")
    # nearby_result = api_client.get_nearby_locations("Central Park", radius=2.0, limit=5)
    # print(f"Result: {nearby_result}\n")

    # Test 5: Get principale locations
    print("5.Getting principale locations")
    principale_locations = api_client.get_all_locations()
    print(f"Result: {principale_locations}\n")