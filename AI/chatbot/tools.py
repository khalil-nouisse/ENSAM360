from langchain.tools import tool
from api_client import api_client
from typing import Optional

@tool
def get_location_details(location_name: str) -> str:
    """
    Get detailed information about a specific location from the Neo4j database.
    
    Use this tool when the user asks:
    - "What is [location name]?"
    - "Tell me about [location]"
    - "Give me information on [location]"
    - "Describe [location]"
    
    Args:
        location_name: The name of the location to look up. Can be partial name.
    
    Returns:
        Detailed information about the location including description, type, and address.
    """
    result = api_client.get_location_by_name(location_name)
    
    # Handle errors
    if "error" in result:
        return f"I couldn't find information about '{location_name}'. Error: {result['error']}. Could you try a different name or check the spelling?"
    
    # Handle not found (if your API returns empty or null)
    if not result or result.get("name") is None:
        return f"I couldn't find a location named '{location_name}'. Could you check the spelling or try searching for it?"
    
    # Format the response nicely
    response_parts = [
        f"**{result['name']}**",
        f"Type: {result.get('type', 'Unknown')}",
    ]
    
    if result.get('description'):
        response_parts.append(f"Description: {result['description']}")
    
    if result.get('address'):
        response_parts.append(f"Address: {result['address']}")
    
    if result.get('latitude') and result.get('longitude'):
        response_parts.append(f"Coordinates: {result['latitude']}, {result['longitude']}")
    
    return "\n".join(response_parts)


@tool
def find_nearby_locations(location_name: str, radius_km: Optional[float] = None) -> str:
    """
    Find locations that are near a specific location in the Neo4j database.
    
    Use this tool when the user asks:
    - "What's near [location]?"
    - "What locations are next to [location]?"
    - "Show me places around [location]"
    - "What's close to [location]?"
    
    Args:
        location_name: The reference location name
        radius_km: Optional search radius in kilometers. If not specified, uses default from backend.
    
    Returns:
        List of nearby locations with distances and types.
    """
    result = api_client.get_nearby_locations(location_name, radius=radius_km, limit=10)
    
    # Handle errors
    if "error" in result:
        return f"I couldn't find nearby locations for '{location_name}'. Error: {result['error']}"
    
    # Handle no nearby locations found
    if not result.get("nearby") or len(result["nearby"]) == 0:
        return f"I couldn't find any locations near '{location_name}'. It might be isolated or the location doesn't exist."
    
    # Format the response
    reference = result.get("reference_location", location_name)
    nearby_locations = result["nearby"]
    
    response_parts = [f"Locations near **{reference}**:\n"]
    
    for i, loc in enumerate(nearby_locations, 1):
        name = loc.get("name", "Unknown")
        loc_type = loc.get("type", "")
        distance = loc.get("distance", "")
        direction = loc.get("direction", "")
        
        loc_info = f"{i}. **{name}**"
        if loc_type:
            loc_info += f" ({loc_type})"
        if distance:
            loc_info += f" - {distance} km"
        if direction:
            loc_info += f" {direction}"
        
        response_parts.append(loc_info)
    
    return "\n".join(response_parts)


@tool
def search_locations_by_criteria(query: Optional[str] = None, 
                                 location_type: Optional[str] = None) -> str:
    """
    Search for locations in the Neo4j database by name or type.
    
    Use this tool when the user asks:
    - "Find restaurants"
    - "Search for parks"
    - "Show me museums"
    - "Are there any [type] locations?"
    - "Find locations with [keyword] in the name"
    
    Args:
        query: Search term to match location names (optional)
        location_type: Filter by location type like "restaurant", "park", "museum" (optional)
    
    Returns:
        List of locations matching the search criteria.
    """
    result = api_client.search_locations(query=query, location_type=location_type, limit=15)
    
    # Handle errors
    if "error" in result:
        return f"Search failed. Error: {result['error']}"
    
    # Handle no results
    if not result.get("results") or len(result["results"]) == 0:
        search_desc = []
        if query:
            search_desc.append(f"matching '{query}'")
        if location_type:
            search_desc.append(f"of type '{location_type}'")
        return f"I couldn't find any locations {' '.join(search_desc)}. Try broadening your search."
    
    # Format the response
    locations = result["results"]
    count = result.get("count", len(locations))
    
    search_desc = []
    if query:
        search_desc.append(f"matching '{query}'")
    if location_type:
        search_desc.append(f"of type '{location_type}'")
    
    response_parts = [f"Found {count} locations {' '.join(search_desc)}:\n"]
    
    for i, loc in enumerate(locations[:10], 1):  # Show max 10
        name = loc.get("name", "Unknown")
        loc_type = loc.get("type", "")
        description = loc.get("description", "")
        
        loc_info = f"{i}. **{name}**"
        if loc_type:
            loc_info += f" ({loc_type})"
        if description:
            # Truncate long descriptions
            short_desc = description[:80] + "..." if len(description) > 80 else description
            loc_info += f" - {short_desc}"
        
        response_parts.append(loc_info)
    
    if count > 10:
        response_parts.append(f"\n... and {count - 10} more results")
    
    return "\n".join(response_parts)


@tool
def get_available_location_types() -> str:
    """
    Get all available location types in the database.
    
    Use this tool when the user asks:
    - "What types of locations are there?"
    - "What categories do you have?"
    - "Show me all location types"
    
    Returns:
        List of all location types available in the database.
    """
    result = api_client.get_location_types()
    
    # Handle errors
    if "error" in result:
        return f"Couldn't retrieve location types. Error: {result['error']}"
    
    # Handle no types found
    if not result.get("types") or len(result["types"]) == 0:
        return "No location types are currently available in the database."
    
    types = result["types"]
    return f"Available location types ({len(types)}):\n" + ", ".join(types)

@tool
def get_principale_locations() -> str:
    """
    Get principale locations in the database.
    
    Use this tool when the user asks:
    - "Give me all the principale Locations"
    
    Returns:
        List of principale Locations in the database.
    """
    result = api_client.get_all_locations()
    
    # Handle errors
    if "error" in result:
        return f"Couldn't retrieve principale locations Error: {result['error']}"
    
    return f"principale locations are {result}"

# Export all tools
tools_list = [
    get_location_details,
    find_nearby_locations,
    search_locations_by_criteria,
    get_available_location_types,
    get_principale_locations
]