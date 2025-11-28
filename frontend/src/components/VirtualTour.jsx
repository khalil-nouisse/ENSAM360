import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Map, Home, Loader2, Compass } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function VirtualTour(props) {
  async function getLocationDetails(id) {
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
  const [locations, setLocations] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)
  const viewerRef = useRef(null)
  const pannellumViewerRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [currentLocationDetails, setCurrentLocationDetails] = useState(null)


  useEffect(() => {
    if (locations) return;
    async function loadLocations() {
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
      showControls: false, // We use our own controls
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

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden font-sans">
      {/* 360 Panorama Viewer */}
      <div
        ref={viewerRef}
        className="w-full h-full absolute inset-0 z-0"
      />

      {/* Loading Overlay */}
      {!viewerReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium tracking-wide">Loading Virtual Experience...</p>
        </div>
      )}

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">

        {/* Top Bar */}
        <div className="flex items-start justify-between pointer-events-auto">
          {/* Location Info Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl max-w-md animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Compass size={20} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {currentLocationDetails?.name || 'Loading Location...'}
              </h1>
            </div>
            <p className="text-white/60 text-sm pl-[52px]">
              Explore the campus in 360° view. Drag to look around.
            </p>
          </div>

          {/* Map Toggle */}
          <Button
            onClick={() => setShowMap(!showMap)}
            className={cn(
              "gap-2 shadow-xl border border-white/10 transition-all duration-300",
              showMap
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-black/40 backdrop-blur-xl text-white hover:bg-white/10"
            )}
            size="lg"
          >
            <Map size={18} />
            {showMap ? 'Hide Map' : 'Campus Map'}
          </Button>
        </div>

        {/* Navigation Arrows (Centered) */}
        {currentLocationDetails && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Forward Arrow */}
            {currentLocationDetails.directions?.forward && (
              <button
                onClick={() => navigateTo('forward')}
                className="group pointer-events-auto absolute top-[15%] bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <ArrowUp size={32} className="text-white drop-shadow-md" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Move Forward
                </span>
              </button>
            )}
            {/* Back Arrow */}
            {currentLocationDetails.directions?.back && (
              <button
                onClick={() => navigateTo('back')}
                className="group pointer-events-auto absolute bottom-[15%] bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:translate-y-1"
              >
                <ArrowDown size={32} className="text-white drop-shadow-md" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Move Back
                </span>
              </button>
            )}
            {/* Left Arrow */}
            {currentLocationDetails.directions?.left && (
              <button
                onClick={() => navigateTo('left')}
                className="group pointer-events-auto absolute left-[10%] bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-x-1"
              >
                <ArrowLeft size={32} className="text-white drop-shadow-md" />
                <span className="absolute top-1/2 left-full ml-3 -translate-y-1/2 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Turn Left
                </span>
              </button>
            )}
            {/* Right Arrow */}
            {currentLocationDetails.directions?.right && (
              <button
                onClick={() => navigateTo('right')}
                className="group pointer-events-auto absolute right-[10%] bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:translate-x-1"
              >
                <ArrowRight size={32} className="text-white drop-shadow-md" />
                <span className="absolute top-1/2 right-full mr-3 -translate-y-1/2 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Turn Right
                </span>
              </button>
            )}
          </div>
        )}

        {/* Bottom Bar / Instructions */}
        <div className="flex justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-white/80 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <span className="hidden md:inline">Click and drag to look around • </span>
            <span>Use arrows to navigate</span>
          </div>
        </div>

      </div>

      {/* Mini Map Drawer */}
      <div
        className={cn(
          "absolute top-20 right-6 w-80 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 z-40 origin-top-right",
          showMap ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Map size={16} className="text-primary" />
            Quick Navigation
          </h3>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {locations ? (
            Object.entries(locations).map(([key, location]) => (
              <button
                key={key}
                onClick={() => goToLocation(location.id)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group",
                  currentLocation === key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  currentLocation === key ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <Home size={16} />
                </div>
                <span className="font-medium text-sm">{location.name}</span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-white/40 flex flex-col items-center gap-2">
              <Loader2 className="animate-spin" />
              <span className="text-xs">Loading locations...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VirtualTour