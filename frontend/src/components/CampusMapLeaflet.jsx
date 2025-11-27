import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Building2, ArrowRight, MapPin } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function CampusMapLeaflet({onBuildingSelect, path, selectedPathNode}) {
  const navigate = useNavigate()
  async function LoadBuildings() {
  try {
    const res = await axios.get(process.env.BACKEND_SERVER + "/api/map/principaleLocations");
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function LoadAllLocations() {
  try {
    const res = await axios.get(process.env.BACKEND_SERVER + "/api/map/allLocations");
    console.log(res.data)
    return res.data;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const pathLayerRef = useRef(null)
  const pathMarkersRef = useRef([])
  const pathMarkerByIdRef = useRef({})
  const prevSelectedNodeRef = useRef(null)
  const [buildings, setBuildings] = useState([])
  const [locations, setLocations] = useState([])
  const buildingsRef = useRef([]) // ADD THIS: Keep a ref to always have current buildings
  const locationsRef = useRef([])
  // this ref is the thing that fixed our problem of buildings array length set to 0
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [isCoordinateMode, setIsCoordinateMode] = useState(false)
  useEffect(() => {
    async function init(){
        const locations = await LoadBuildings();
        console.log(locations)
        setBuildings(locations);

        const allLocations = await LoadAllLocations();
        console.log(allLocations)
        setLocations(allLocations);
      }
      init();
      
    }, [])

  // ADD THIS: Update the ref whenever buildings changes
  useEffect(() => {
    buildingsRef.current = buildings;
  }, [buildings]);

  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);
  
  useEffect(() => {
    if (!mapRef.current) return

    console.log('Initializing map...')
    
    // Initialize the map
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 4,
      zoomControl: true,
      attributionControl: false
    })

    // Set the map bounds to match your SVG dimensions
    const mapBounds = [[0, 0], [1000, 1000]]
    console.log('Setting map bounds:', mapBounds)
    map.fitBounds(mapBounds)

    // Add your SVG as an image overlay with proper error handling
    const imageUrl = '/src/assets/campus_map_2d1.svg'
    console.log('Loading SVG from:', imageUrl)
    
    const imageOverlay = L.imageOverlay(imageUrl, mapBounds, {
      opacity: 1,
      interactive: true
    })
    
    // Add error handling
    imageOverlay.on('error', function() {
      console.error('Failed to load SVG:', imageUrl)
      // Add a colored rectangle as fallback
      const fallbackRect = L.rectangle(mapBounds, {
        color: '#3b82f6',
        fillColor: '#dbeafe',
        fillOpacity: 0.3,
        weight: 2
      })
      fallbackRect.addTo(map)
      console.log('Added fallback rectangle')
    })
    
    imageOverlay.addTo(map)

    // Store map instance
    mapInstanceRef.current = map

    // Add click handler for coordinate detection
    map.on('click', handleMapClick)
    map.on('popupopen', function(e) {
      console.log('popup opened, content:', e.popup.getContent());
      const el = e.popup.getElement();
      const button = el.querySelector('.tour-button');
      if (button) {
          button.addEventListener('click', function() {
          const buildingId = this.getAttribute('data-building-id');
            console.log('popup button clicked, buildingId=', buildingId, 'popup element:', el);
          navigateToTour(buildingId);
        });
      }
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [])

  // Effect to update markers when buildings change
  useEffect(() => {
    if (mapInstanceRef.current) {
      addBuildingMarkers(mapInstanceRef.current)
    }
  }, [buildings])

  // Draw path when `path` is provided or updated
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove previous path layers
    if (pathLayerRef.current) {
      map.removeLayer(pathLayerRef.current)
      pathLayerRef.current = null
    }
    if (pathMarkersRef.current && pathMarkersRef.current.length) {
      pathMarkersRef.current.forEach(m => map.removeLayer(m))
      pathMarkersRef.current = []
      pathMarkerByIdRef.current = {}
      prevSelectedNodeRef.current = null
    }

    if (!path || !path.nodes || path.nodes.length === 0) return

    // Build latlngs from path nodes, preferring node coords but falling back to building data
    const latlngs = path.nodes.map(n => {
      let y = n.y_coords ?? n.map_coords?.[1]
      let x = n.x_coords ?? n.map_coords?.[0]
      if ((y == null || x == null) && buildingsRef.current) {
        const b = buildingsRef.current.find(b => b.id == n.id)
        if (b) { x = b.x_coords; y = b.y_coords }
      }
      return (y != null && x != null) ? [y, x] : null
    }).filter(Boolean)

    if (latlngs.length === 0) return

    // Draw polyline
    const polyline = L.polyline(latlngs, { color: 'yellow', weight: 4, opacity: 0.85 }).addTo(map)
    pathLayerRef.current = polyline

    // Add node markers
    latlngs.forEach((latlng, i) => {
      const isStart = i === 0
      const isEnd = i === (latlngs.length - 1)
      const node = path.nodes[i]
      const origColor = isStart ? '#059669' : isEnd ? '#ef4444' : '#111827'
      const origRadius = isStart || isEnd ? 6 : 4
      const circle = L.circleMarker(latlng, {
        radius: origRadius,
        color: origColor,
        fillColor: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      }).addTo(map).bindPopup(`<h3>${node.name}</h3>
      <br>
      <button class=\"tour-button\" data-building-id=\"${node.id}\" onclick=\"window.navigateToTour('${node.id}')\">navigate to 360</button>`);
      // Click handler: open a popup (allow user to click navigate) rather than auto-navigate.
      circle.on('click', () => {
        circle.openPopup()
      })
      // store original style for later restoration
      circle.__origStyle = { color: origColor, radius: origRadius }
      pathMarkersRef.current.push(circle)
      pathMarkerByIdRef.current[node.id] = circle
    })

    // Fit map to path bounds
    try {
      map.fitBounds(polyline.getBounds(), { padding: [20, 20] })
    } catch (err) {
      console.warn('Could not fit bounds for polyline', err)
    }

    // Cleanup will be handled at next update or unmount
    return () => {
      if (pathLayerRef.current) {
        try { map.removeLayer(pathLayerRef.current) } catch (e) {}
        pathLayerRef.current = null
      }
      if (pathMarkersRef.current && pathMarkersRef.current.length) {
        pathMarkersRef.current.forEach(m => { try { map.removeLayer(m) } catch (e) {} })
        pathMarkersRef.current = []
      }
    }
  }, [path])

  // Highlight selected path node when `selectedPathNode` changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    if (!selectedPathNode) {
      if (prevSelectedNodeRef.current) {
        const prev = pathMarkerByIdRef.current[prevSelectedNodeRef.current]
        if (prev && prev.__origStyle) prev.setStyle(prev.__origStyle)
        prevSelectedNodeRef.current = null
      }
      return
    }
    const targetMarker = pathMarkerByIdRef.current[selectedPathNode]
    if (!targetMarker) return
    if (prevSelectedNodeRef.current && prevSelectedNodeRef.current !== selectedPathNode) {
      const prev = pathMarkerByIdRef.current[prevSelectedNodeRef.current]
      if (prev && prev.__origStyle) prev.setStyle(prev.__origStyle)
    }
    targetMarker.setStyle({color: 'orange', radius: 6})
    prevSelectedNodeRef.current = selectedPathNode
    try { map.setView(targetMarker.getLatLng(), Math.max(map.getZoom(), 18)) } catch(e) { /* ignore */ }
  }, [selectedPathNode])

  const addBuildingMarkers = (map) => {
  if (!buildings || buildings.length === 0) return;

  // define icon ONCE
  const buildingIcon = L.divIcon({
    html: `
      <div class="building-marker">
        <div class="building-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          </svg>
        </div>
        <div class="tour-indicator">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    `,
    className: 'custom-building-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  // remove existing markers
  markersRef.current.forEach(m => map.removeLayer(m));
  markersRef.current = [];

  // now loop
  buildings.forEach(building => {
    const marker = L.marker(
      [building.y_coords, building.x_coords],
      { icon: buildingIcon }
    )
    .addTo(map)
    .bindPopup(`<h3>${building.name}</h3>
      <br>
      <button class="tour-button" data-building-id='${building.id}' onclick="window.navigateToTour('${building.id}')">navigate to 360</button>`);
    
    console.log("x_coords :",building.x_coords)

    markersRef.current.push(marker);
});
};


  const handleMapClick = (e) => {
    console.log('Map clicked! Coordinate mode:', isCoordinateMode)
    console.log('Click coordinates:', e.x)
    
    if (!isCoordinateMode) return

    console.log('Map clicked in coordinate mode!', e.latlng)
    const { lat, lng } = e.latlng
    const buildingName = prompt('Enter building name:')
    
    if (buildingName && buildingName.trim()) {
      const newBuilding = {
        id: Date.now(),
        name: buildingName.trim(),
        lat: lat,
        lng: lng,
        hasTour: true,
        tourType: '360°'
      }
      
      console.log('Adding new building:', newBuilding)
      setBuildings(prev => [...prev, newBuilding])
      
      // Exit coordinate mode after adding
      setIsCoordinateMode(false)
    }
  }
  
  // MODIFIED: Use buildingsRef.current instead of buildings
  const navigateToTour = (buildingId) => {
    console.log('navigateToTour called with buildingId=', buildingId);
    console.log(buildingId.toString())
    console.log(buildingsRef.current) // CHANGED: Use ref instead of state
    if (!buildingsRef.current || buildingsRef.current.length === 0) {
      console.log('No buildings available');
      onBuildingSelect && onBuildingSelect(null);
      console.log('Location not found:', buildingId);
      return;
    }
    const building = buildingsRef.current.find(b => b.id == buildingId); // CHANGED: Use ref and == for loose comparison
    if (building) {
      onBuildingSelect(building);
      console.log(`Navigating to 360° tour for: ${building.name}`);
      navigate('/tour');
      return;
    }
    if (!locationsRef.current || locationsRef.current.length === 0) {
      console.log('No locations available');
      onBuildingSelect && onBuildingSelect(null);
      console.log('Location not found:', buildingId);
      return;
    }
    // fallback: try to find the location from all locations
    const location = locationsRef.current && locationsRef.current.find(l => l.id == buildingId);
    if (location) {
      onBuildingSelect(location);
      console.log(`Navigating to 360° tour for: ${location.name}`);
      navigate('/tour');
      return;
    }
    // nothing found
    onBuildingSelect && onBuildingSelect(null);
    console.log('Location not found:', buildingId);
  }

  // Make navigateToTour available globally for popup buttons
  useEffect(() => {
    window.navigateToTour = navigateToTour
    return () => {
      delete window.navigateToTour
    }
  }, [buildings])

  const toggleCoordinateMode = () => {
    setIsCoordinateMode(!isCoordinateMode)
    setSelectedBuilding(null)
  }

  return (
    <div className="relative border border-darkblue/20 rounded-2xl shadow-lg h-full w-full overflow-hidden" style={{ backgroundColor: '#0B132B' }}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full h-full ${isCoordinateMode ? 'cursor-crosshair' : ''}`}
      />
      
      {/* Coordinate Detection Controls - Positioned to avoid Leaflet zoom controls */}
      {/*
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={toggleCoordinateMode}
          className={`p-3 rounded-lg shadow-lg transition-all duration-200 ${
            isCoordinateMode 
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25' 
              : 'bg-white/95 hover:bg-white text-gray-700 hover:shadow-lg'
          }`}
          title={isCoordinateMode ? "Exit Coordinate Mode" : "Enter Coordinate Mode"}
        >
          <MapPin size={20} />
        </button>
        {isCoordinateMode && (
          <div className="bg-blue-500/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg text-sm max-w-48 text-white">
            <p className="font-semibold mb-1">📍 Add Building</p>
            <p className="text-blue-100 text-xs">Click anywhere on the map to place a building marker</p>
          </div>
        )}
      </div>
      */}
      {/* Building Counter - Simple and clean */}
      {buildings.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-medium text-gray-700">
              {buildings.length} Building{buildings.length !== 1 ? 's' : ''} Available
            </span>
          </div>
        </div>
      )}

      {/* Custom CSS for markers */}
      <style jsx>{`
        /* Leaflet canvas background , map background color */
        .leaflet-container { background:rgb(33, 57, 133); }
        .custom-building-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .building-marker {
          position: relative;
          width: 44px;
          height: 44px;
        }
        
        .building-icon {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 3px solid white;
        }
        
        .building-icon:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }
        
        .tour-indicator {
          position: absolute;
          top: -3px;
          right: -3px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 8px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          border: 2px solid white;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .building-popup {
          min-width: 220px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .building-popup h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .building-popup p {
          margin: 0 0 12px 0;
          font-size: 12px;
          color: #6b7280;
        }
        
        .tour-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        
        .tour-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  )
}



export default CampusMapLeaflet