import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Building2, ArrowRight, MapPin } from 'lucide-react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useTheme } from "@/components/theme-provider" // ADDED: Import useTheme

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function CampusMapLeaflet({ onBuildingSelect, path, selectedPathNode }) {
  const navigate = useNavigate()
  const { theme } = useTheme(); // ADDED: Access current theme
  // ADDED: Determine if dark mode is active (either explicitly 'dark' or system dark)
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  async function LoadBuildings() {
    try {
      const res = await axios.get("/api/map/principaleLocations");
      console.log(res.data)
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function LoadAllLocations() {
    try {
      const res = await axios.get("/api/map/allLocations");
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
    async function init() {
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
      interactive: true,
      className: isDark ? 'map-tiles-dark' : '' // Apply dark mode filter to the SVG overlay
    })

    // Add error handling
    imageOverlay.on('error', function () {
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
    map.on('popupopen', function (e) {
      console.log('popup opened, content:', e.popup.getContent());
      const el = e.popup.getElement();
      const button = el.querySelector('.tour-button');
      if (button) {
        button.addEventListener('click', function () {
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
      }).addTo(map).bindPopup(`
        <div class="building-popup ${isDark ? 'dark' : ''}">
          <div class="popup-header">${node.name}</div>
          <button class="tour-button" data-building-id="${node.id}" onclick="window.navigateToTour('${node.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>View 360°</span>
          </button>
        </div>
      `);
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
        try { map.removeLayer(pathLayerRef.current) } catch (e) { }
        pathLayerRef.current = null
      }
      if (pathMarkersRef.current && pathMarkersRef.current.length) {
        pathMarkersRef.current.forEach(m => { try { map.removeLayer(m) } catch (e) { } })
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
    targetMarker.setStyle({ color: 'orange', radius: 6 })
    prevSelectedNodeRef.current = selectedPathNode
    try { map.setView(targetMarker.getLatLng(), Math.max(map.getZoom(), 18)) } catch (e) { /* ignore */ }
  }, [selectedPathNode])

  const addBuildingMarkers = (map) => {
    if (!buildings || buildings.length === 0) return;

    // define icon ONCE with theme-aware styling
    const buildingIcon = L.divIcon({
      html: `
      <div class="building-marker ${isDark ? 'dark' : ''}">
        <div class="building-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
          </svg>
        </div>
        <div class="tour-indicator">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      </div>
    `,
      className: 'custom-building-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
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
        .bindPopup(`
          <div class="building-popup ${isDark ? 'dark' : ''}">
            <div class="popup-header">${building.name}</div>
            <button class="tour-button" data-building-id='${building.id}' onclick="window.navigateToTour('${building.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>View 360°</span>
            </button>
          </div>
        `);

      console.log("x_coords :", building.x_coords)

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
      console.log('No buildings available in ref (yet)');
      // Don't return immediately, try locationsRef as fallback
    }

    // 1. Try to find in buildings (principal locations)
    const building = buildingsRef.current && buildingsRef.current.find(b => b.id == buildingId);
    if (building) {
      onBuildingSelect(building);
      console.log(`Navigating to 360° tour for building: ${building.name}`);
      navigate('/tour');
      return;
    }

    // 2. Fallback: Try to find in all locations (nodes)
    if (!locationsRef.current || locationsRef.current.length === 0) {
      console.log('No locations available in ref');
      // onBuildingSelect && onBuildingSelect(null); // Optional: clear selection
      console.log('Location not found:', buildingId);
      return;
    }

    const location = locationsRef.current.find(l => l.id == buildingId);
    if (location) {
      onBuildingSelect(location);
      console.log(`Navigating to 360° tour for location: ${location.name}`);
      navigate('/tour');
      return;
    }

    // 3. Nothing found
    console.log('Location not found in buildings or all locations:', buildingId);
    // onBuildingSelect && onBuildingSelect(null);
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
        .leaflet-container { background:rgba(21, 26, 23, 1); }
        
        .map-tiles-dark {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }

        .custom-building-marker {
          background: transparent !important;
          border: none !important;
        }

        .building-marker {
          position: relative;
          width: 36px;
          height: 36px;
        }

        /* Light Mode Building Icon */
        .building-icon {
          background: linear-gradient(135deg, hsl(221 83% 53%), hsl(221 83% 45%));
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 3px 12px hsla(221, 83%, 53%, 0.35), 0 0 0 2px hsl(210 40% 98%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        /* Dark Mode Building Icon */
        .building-marker.dark .building-icon {
          background: linear-gradient(135deg, hsl(221 83% 60%), hsl(221 83% 53%));
          box-shadow: 0 3px 16px hsla(221, 83%, 53%, 0.45), 0 0 0 2px hsl(217 32% 17%);
        }
        
        .building-icon:hover {
          background: linear-gradient(135deg, hsl(221 83% 45%), hsl(221 83% 38%));
          transform: scale(1.1);
          box-shadow: 0 4px 16px hsla(221, 83%, 53%, 0.5), 0 0 0 2px hsl(210 40% 98%);
        }

        .building-marker.dark .building-icon:hover {
          background: linear-gradient(135deg, hsl(221 83% 65%), hsl(221 83% 58%));
          box-shadow: 0 4px 20px hsla(221, 83%, 53%, 0.6), 0 0 0 2px hsl(217 32% 17%);
        }
        
        /* Tour Indicator Badge */
        .tour-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 8px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
          border: 2px solid hsl(210 40% 98%);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .building-marker.dark .tour-indicator {
          border-color: hsl(217 32% 17%);
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.6);
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.15);
            opacity: 0.9;
          }
        }
        
        /* Popup Styling - Light Mode */
        .building-popup {
          min-width: 180px;
          max-width: 200px;
          padding: 2px;
          font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .popup-header {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: hsl(222 47% 11%);
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        /* Dark Mode Popup */
        .building-popup.dark .popup-header {
          color: hsl(210 40% 98%);
        }
        
        /* Tour Button - Light Mode */
        .tour-button {
          background: linear-gradient(135deg, hsl(221 83% 53%), hsl(221 83% 45%));
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          box-shadow: 0 2px 8px hsla(221, 83%, 53%, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* Dark Mode Tour Button */
        .building-popup.dark .tour-button {
          background: linear-gradient(135deg, hsl(221 83% 60%), hsl(221 83% 53%));
          box-shadow: 0 2px 10px hsla(221, 83%, 53%, 0.35);
        }
        
        .tour-button:hover {
          background: linear-gradient(135deg, hsl(221 83% 45%), hsl(221 83% 38%));
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsla(221, 83%, 53%, 0.4);
        }

        .building-popup.dark .tour-button:hover {
          background: linear-gradient(135deg, hsl(221 83% 65%), hsl(221 83% 58%));
          box-shadow: 0 4px 16px hsla(221, 83%, 53%, 0.5);
        }

        .tour-button:active {
          transform: translateY(0);
        }

        .tour-button svg {
          flex-shrink: 0;
        }

        .tour-button span {
          white-space: nowrap;
        }

        /* Leaflet Popup Customization */
        .leaflet-popup-content-wrapper {
          background: hsl(210 40% 98%) !important;
          border-radius: 10px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          border: 1px solid hsl(210 40% 96.1%) !important;
          padding: 10px !important;
        }

        .building-popup.dark ~ .leaflet-popup-content-wrapper,
        .leaflet-popup-content-wrapper:has(.building-popup.dark) {
          background: hsl(217 32% 17%) !important;
          border-color: hsl(217 32% 22%) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
        }

        .leaflet-popup-tip {
          background: hsl(210 40% 98%) !important;
          border: 1px solid hsl(210 40% 96.1%) !important;
        }

        .leaflet-popup-content-wrapper:has(.building-popup.dark) + .leaflet-popup-tip {
          background: hsl(217 32% 17%) !important;
          border-color: hsl(217 32% 22%) !important;
        }


        .leaflet-popup-close-button {
          color: hsl(222 47% 11%) !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          padding: 4px 8px !important;
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 0.5;
          transition: all 0.2s ease;
          right: 6px !important;
          top: 6px !important;
          border-radius: 4px;
        }

        .leaflet-popup-close-button:hover {
          opacity: 1;
          color: hsl(222 47% 5%) !important;
        }

        .leaflet-popup-content-wrapper:has(.building-popup.dark) .leaflet-popup-close-button {
          color: hsl(210 40% 98%) !important;
        }

        .leaflet-popup-content-wrapper:has(.building-popup.dark) .leaflet-popup-close-button:hover {
          opacity: 1;
          color: hsl(0 0% 100%) !important;
        }
      `}</style>
    </div>
  )
}



export default CampusMapLeaflet