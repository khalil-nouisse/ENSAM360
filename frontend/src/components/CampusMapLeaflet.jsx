import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Building2, ArrowRight, MapPin } from 'lucide-react'
import axios from 'axios'

// Fix for default markers in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function CampusMapLeaflet() {
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
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [buildings, setBuildings] = useState([])
  
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [isCoordinateMode, setIsCoordinateMode] = useState(false)
  useEffect(() => {
      async function init(){
        const locations = await LoadBuildings();
        console.log(locations)
        setBuildings(locations);
      }
      init();
      
    }, [])
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
    const button = e.popup.getElement().querySelector('.tour-button');
    if (button) {
        button.addEventListener('click', function() {
            const buildingId = this.getAttribute('data-building-id');
            console.log(buildingId);
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
      <button class="tour-button" data-building-id='${building.id}'>navigate to 360</button>`);
    
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
 
  const navigateToTour = (buildingId) => {
    console.log(buildingId);
    const building = buildings.find(b => b.id === buildingId)
    if (building) {
      console.log(`Navigating to 360° tour for: ${building.name}`)
      alert(`Entering 360° tour for ${building.name}!\n\nThis will navigate to the virtual tour inside the building.`)
    }else{
      console.log("is not here")
    }
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
