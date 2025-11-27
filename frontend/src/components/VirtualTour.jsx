import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Map, Home, ArrowUpCircle } from 'lucide-react'
import axios from 'axios'

function VirtualTour(props) {
  async function getLocationDetails(id){
    try {
      const res = await axios.get(process.env.BACKEND_SERVER + `/api/tour/location/?id=${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async function LoadLocations() {
  try {
    const res = await axios.get(process.env.BACKEND_SERVER + "/api/map/principaleLocations");
    console.log(res.data)
    return res.data;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}
  const [locations,setLocations] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)
  const viewerRef = useRef(null)
  const pannellumViewerRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [currentLocationDetails,setCurrentLocationDetails] = useState(null)
  const [neighborIds, setNeighborIds] = useState([])
  const [neighborsDetails, setNeighborsDetails] = useState([])
  

  useEffect(()=>{
    if(locations) return;
    async function loadLocations(){
          const loadedLocations = await LoadLocations();
          setLocations(loadedLocations);
    }
    loadLocations();
  })
  useEffect(() => {
    if (props.location) {
        setCurrentLocation(props.location.id)
    } else {
        setCurrentLocation('ensam_entry')
    }
}, [props.location])
  
  // Initialize Pannellum viewer
  // Load pannellum script only once on mount
useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';

    document.body.appendChild(script);
    document.head.appendChild(link);

    script.onload = () => setViewerReady(true);

    return () => {
        document.body.removeChild(script);
        document.head.removeChild(link);
    };
}, []);


  useEffect(() => {
    if (!currentLocation) return;

    async function load() {
        const details = await getLocationDetails(currentLocation);
        console.log(details)
        setCurrentLocationDetails(details[0]);
        // After loading the current location, retrieve the neighbors ids using the existing route
        try {
          const res = await axios.get(process.env.BACKEND_SERVER + `/api/tour/nextLocations/${currentLocation}`)
          // existing backend route returns objects like [{ id: 'xxx' }, ...] OR array of string ids
          const data = res.data || []
          // normalize to string ids and dedupe so we won't show duplicates when relationships are bidirectional
          const ids = data.map(it => (typeof it === 'string' ? it : it?.id)).filter(Boolean)
          const uniqIds = [...new Set(ids)]
          setNeighborIds(uniqIds)
        } catch (err) {
          console.error('Failed to fetch neighbor ids', err)
          setNeighborIds([])
        }
    }

    load();
}, [currentLocation]);
  
  // Update panorama when location changes
  useEffect(() => {
    console.log("EFFECT RUN --- viewerReady:", viewerReady);
    console.log("window.pannellum:", window.pannellum);
    console.log("currentLocationDetails:", currentLocationDetails);

    if (!viewerReady) {
        console.log("STOP → viewerReady is false");
        return;
    }

    if (!window.pannellum) {
        console.log("STOP → pannellum is not loaded yet");
        return;
    }

    if (!currentLocationDetails) {
        console.log("STOP → no currentLocationDetails yet");
        return;
    }

    if (!currentLocationDetails.pano_image) {
        console.log("STOP → pano_image missing");
        return;
    }

    console.log("pano_image:", currentLocationDetails.pano_image);

    if (pannellumViewerRef.current) {
        pannellumViewerRef.current.destroy();
    }

    const imgPath = currentLocationDetails.pano_image.replace(
        "src/assets/image",
        "/images"
    );

    console.log("imgPath:", imgPath);

    pannellumViewerRef.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: imgPath,
        autoLoad: true,
        showControls: true,
        compass: true,
        haov: 360,
        vaov: 180,
        hfov: 120,
    });
}, [viewerReady, currentLocationDetails]);
  
  const navigateTo = (direction) => {
    if (!currentLocationDetails || !currentLocationDetails.directions) return
    const nextLocation = currentLocationDetails.directions[direction]
    if (nextLocation) {
      setCurrentLocation(nextLocation)
    }
  }
  
  const goToLocation = (locationId) => {
    setCurrentLocation(locationId)
    setShowMap(false)
  }

  // when we get the neighbor ids, fetch their details (name/description) — do not replace existing behaviour
  useEffect(() => {
    if (!neighborIds || neighborIds.length === 0) {
      setNeighborsDetails([])
      return
    }
    let cancelled = false
    async function loadNeighbors() {
      try {
        const promises = neighborIds.map(it => {
          const id = (typeof it === 'string') ? it : it?.id
          return getLocationDetails(id).then(data => data && data[0] ? data[0] : { id })
        })
        const detailsRaw = await Promise.all(promises)
        const details = detailsRaw.map(d => {
          if (!d) return d
          // Populate description fallback from principal locations map if missing
          if ((!d.description || d.description === '') && locations) {
            const match = Object.values(locations).find(l => l.id === d.id)
            if (match && match.description) {
              return { ...d, description: match.description }
            }
          }
          return d
        })
        if (!cancelled) {
          setNeighborsDetails(details)
        }
      } catch (err) {
        console.error('Failed to fetch neighbor details', err)
        if (!cancelled) setNeighborsDetails([])
      }
    }
    loadNeighbors()
    return () => { cancelled = true }
  }, [neighborIds])
  
  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">Virtual Campus Tour</h1>
          <p className="text-sm text-gray-300 mt-1">{currentLocationDetails?.name || 'Loading...'}</p>
        </div>
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Map size={20} />
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* 360 Panorama Viewer */}
        <div 
          ref={viewerRef}
          className="w-full h-full"
          style={{ background: '#000' }}
        />
        {/* Loading State */}
        {!viewerReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-xl">Loading 360° Viewer...</div>
          </div>
        )}
        {/* Navigation Controls Overlay */}
        {currentLocationDetails && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Forward Arrow */}
            {currentLocationDetails.directions?.forward && (
              <button
                onClick={() => navigateTo('forward')}
                className="group pointer-events-auto absolute top-[20%] left-1/2 -translate-x-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-blue-500/80 hover:to-blue-600/80 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125"
                title="Go forward"
              >
                <ArrowUp size={28} className="text-white drop-shadow-lg" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Forward
                </div>
              </button>
            )}
            {/* Back Arrow */}
            {currentLocationDetails.directions?.back && (
              <button
                onClick={() => navigateTo('back')}
                className="group pointer-events-auto absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-purple-500/80 hover:to-purple-600/80 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125"
                title="Go back"
              >
                <ArrowDown size={28} className="text-white drop-shadow-lg" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Back
                </div>
              </button>
            )}
            {/* Left Arrow */}
            {currentLocationDetails.directions?.left && (
              <button
                onClick={() => navigateTo('left')}
                className="group pointer-events-auto absolute top-1/2 left-[15%] -translate-y-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-green-500/80 hover:to-green-600/80 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125"
                title="Go left"
              >
                <ArrowLeft size={28} className="text-white drop-shadow-lg" />
                <div className="absolute top-1/2 -right-2 translate-x-full -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Left
                </div>
              </button>
            )}
            {/* Right Arrow */}
            {currentLocationDetails.directions?.right && (
              <button
                onClick={() => navigateTo('right')}
                className="group pointer-events-auto absolute top-1/2 right-[15%] -translate-y-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-orange-500/80 hover:to-orange-600/80 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125"
                title="Go right"
              >
                <ArrowRight size={28} className="text-white drop-shadow-lg" />
                <div className="absolute top-1/2 -left-2 -translate-x-full -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Right
                </div>
              </button>
            )}
          </div>
        )}
        {/* Neighbor Arrow Overlay */}
        {neighborsDetails && neighborsDetails.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {neighborsDetails.map((n, idx) => {
              // If yaw is present use it; otherwise spread them evenly around the circle
              const angleDeg = (typeof n.yaw === 'number' && !isNaN(n.yaw)) ? n.yaw : (idx * (360 / neighborsDetails.length))
              const angleRad = (angleDeg - 90) * (Math.PI / 180) // align 0deg to top
              const radius = 160
              const x = Math.cos(angleRad) * radius
              const y = Math.sin(angleRad) * radius
              const left = `calc(50% + ${x}px)`
              const top = `calc(50% + ${y}px)`
              return (
                <button
                  key={n.id}
                  onClick={() => goToLocation(n.id)}
                  className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm hover:from-blue-500/80 hover:to-blue-600/80 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125"
                  style={{ left, top }}
                  title={`${n.name ? n.name + ' - ' : ''}${n.description ? n.description : ''}`}
                >
                  <ArrowUpCircle size={28} className="text-white drop-shadow-lg" style={{ transform: `rotate(${angleDeg}deg)` }} />
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity max-w-xs">
                    <div className="font-semibold">{n.name}</div>
                    <div className="text-xs opacity-80">{n.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Mini Map Overlay */}
        {showMap && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Tour Map</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {locations
            &&
            (<div className="space-y-2">
              
              {Object.entries(locations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => goToLocation(location.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentLocation === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {currentLocation === key && <Home size={16} />}
                    <span className="font-medium">{location.name}</span>
                  </div>
                </button>
              ))}
            </div>)}
           
            {!locations &&(<div>Loading</div>)}
             
          </div>
        )}
      </div>
      {/* Footer with Instructions */}
      <div className="bg-gray-800 text-white px-6 py-3 text-center text-sm">
        <p>Click and drag to look around • Use arrow buttons to navigate between locations • Scroll to zoom</p>
      </div>
    </div>
  )
}

export default VirtualTour