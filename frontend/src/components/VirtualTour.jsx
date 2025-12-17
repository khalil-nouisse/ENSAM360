import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Map, Home, Loader2, Compass, ArrowUpCircle, Navigation, CheckCircle2 } from 'lucide-react'
import axios from '@/api/axios'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TourPathFinder } from './TourPathFinder'

function VirtualTour(props) {
  async function getLocationDetails(id) {
    try {
      const res = await axios.get(`/api/tour/location/?id=${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async function LoadLocations() {
    try {
      const res = await axios.get("/api/map/principaleLocations");
      console.log(res.data)
      return res.data;

    } catch (err) {
      console.error(err);
      return null;
    }
  }
  const [locations, setLocations] = useState(null)
  const [showMap, setShowMap] = useState(false)

  // Navigation State
  const [showNavigation, setShowNavigation] = useState(false)
  const [currentPath, setCurrentPath] = useState(null); // { nodes: [], edges: [] }
  const [nextStepId, setNextStepId] = useState(null);
  const [isArrived, setIsArrived] = useState(false);

  const [viewerReady, setViewerReady] = useState(false)
  const viewerRef = useRef(null)
  const pannellumViewerRef = useRef(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [currentLocationDetails, setCurrentLocationDetails] = useState(null)
  const [neighborIds, setNeighborIds] = useState([])
  const [neighborsDetails, setNeighborsDetails] = useState([])


  useEffect(() => {
    if (locations) return;
    async function loadLocations() {
      const loadedLocations = await LoadLocations();
      setLocations(loadedLocations);
    }
    loadLocations();
  }, [])
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

    // PATH UPDATE LOGIC
    // When location changes, update the "Next Step" based on the current path
    if (currentPath && currentPath.nodes) {
      // Find index of current location in path - Robust Comparison
      const currentIndex = currentPath.nodes.findIndex(n => String(n.id) === String(currentLocation));

      if (currentIndex !== -1 && currentIndex < currentPath.nodes.length - 1) {
        // We are on path, next step is the next node
        const nextId = currentPath.nodes[currentIndex + 1].id;
        console.log(`Path Update: Current ${currentLocation}, Next Step: ${nextId}`);
        setNextStepId(nextId);
      } else if (currentIndex === currentPath.nodes.length - 1) {
        // Reached destination
        console.log("Path Update: Reached Destination");
        setIsArrived(true);
        setNextStepId(null);
        setCurrentPath(null); // Clear path
        setTimeout(() => setIsArrived(false), 5000); // Hide after 5 seconds
      } else {
        // Went off path
        console.log(`Path Update: Off path or ID mismatch. Current: ${currentLocation}`);
        setNextStepId(null);
        setCurrentPath(null);
      }
    }


    async function load() {
      const details = await getLocationDetails(currentLocation);
      console.log(details)
      setCurrentLocationDetails(details[0]);

      // After loading the current location, retrieve the neighbors ids using the existing route
      try {
        const res = await axios.get(`/api/tour/nextLocations/${currentLocation}`)
        // existing backend route returns objects like [{ id: 'xxx' }, ...] OR array of string ids
        const data = res.data || []

        // Deduplicate by ID and preserve objects (to keep 'yaw')
        const uniqueNeighbors = []
        const seenIds = new Set()

        data.forEach(item => {
          const id = typeof item === 'string' ? item : item?.id
          if (id && !seenIds.has(id)) {
            seenIds.add(id)
            uniqueNeighbors.push(typeof item === 'string' ? { id } : item)
          }
        })

        setNeighborIds(uniqueNeighbors)
      } catch (err) {
        console.error('Failed to fetch neighbor ids', err)
        setNeighborIds([])
      }
    }

    load();
  }, [currentLocation, currentPath]);

  // Sync current location to localStorage whenever it changes
  useEffect(() => {
    if (currentLocationDetails) {
      localStorage.setItem('selectedBuilding', JSON.stringify(currentLocationDetails));
    }
  }, [currentLocationDetails]);

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
      compass: false,
      haov: 360,
      vaov: 180,
      hfov: 120,
      yaw: 0,
      pitch: 0,
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
          return getLocationDetails(id).then(data => {
            const locationDetail = data && data[0] ? data[0] : { id }
            // Merge relationship properties (like yaw) into the location detail
            if (typeof it === 'object') {
              return { ...locationDetail, ...it }
            }
            return locationDetail
          })
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

  // Add hotspots when neighbors are loaded
  useEffect(() => {
    if (!viewerReady || !pannellumViewerRef.current || !neighborsDetails || neighborsDetails.length === 0) return;

    // Iterate and add hotspots
    neighborsDetails.forEach((n, idx) => {
      // Calculate yaw if missing (fallback)
      const yaw = (typeof n.yaw === 'number' && !isNaN(n.yaw)) ? n.yaw : (idx * (360 / neighborsDetails.length));
      // Calculate pitch: use relationship pitch if available, otherwise default to -10 (slightly down)
      const pitch = (typeof n.pitch === 'number' && !isNaN(n.pitch)) ? n.pitch : -10;

      // Check if this neighbor is the next step in the path
      const isNextStep = nextStepId && (String(n.id) === String(nextStepId));

      if (isNextStep) {
        console.log(`Highlighting Hotspot: ${n.name} (${n.id}) as Next Step`);
      }

      pannellumViewerRef.current.addHotSpot({
        pitch: pitch,
        yaw: yaw,
        type: "info",
        text: n.name,
        createTooltipFunc: (hotSpotDiv, args) => {
          hotSpotDiv.classList.add('custom-hotspot');
          hotSpotDiv.style.width = 'auto';
          hotSpotDiv.style.height = 'auto';
          hotSpotDiv.style.background = 'transparent';
          hotSpotDiv.style.border = 'none';

          const root = createRoot(hotSpotDiv);
          // Highlight style if it is the next step
          const buttonClass = isNextStep
            ? "group relative flex items-center justify-center bg-emerald-500/80 backdrop-blur-md hover:bg-emerald-600/90 p-4 rounded-full border-4 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-125 animate-pulse"
            : "group relative flex items-center justify-center bg-white/60 dark:bg-white/20 backdrop-blur-md hover:bg-primary/90 p-3 rounded-full border-2 border-white/40 hover:border-white shadow-lg transition-all duration-300 hover:scale-125";

          const iconClass = isNextStep
            ? "text-white drop-shadow-lg"
            : "text-gray-800 dark:text-white group-hover:text-white drop-shadow-lg transition-colors";

          root.render(
            <button
              onClick={() => goToLocation(n.id)}
              className={buttonClass}
              title={`${n.name ? n.name + ' - ' : ''}${n.description ? n.description : ''}`}
            >
              <ArrowUpCircle size={isNextStep ? 32 : 28} className={iconClass} />
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/70 backdrop-blur-md text-gray-800 dark:text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity max-w-xs shadow-lg border border-white/40 pointer-events-none z-50">
                {isNextStep && <div className="text-emerald-600 font-bold mb-0.5">FOLLOW PATH</div>}
                <div className="font-semibold">{n.name}</div>
                <div className="text-xs opacity-80">{n.description}</div>
              </div>
            </button>
          );
        },
        clickHandlerFunc: (evt, args) => {
          goToLocation(n.id);
        }
      });
    });

  }, [viewerReady, neighborsDetails, nextStepId]);

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
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-4 rounded-2xl shadow-2xl max-w-md animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Compass size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                {currentLocationDetails?.name || 'Loading Location...'}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-white/60 text-sm pl-[52px]">
              {currentPath ? "Follow the green arrows to your destination." : "Explore the campus in 360° view. Drag to look around."}
            </p>
          </div>

          <div className="flex gap-2">
            {/* Navigation Toggle */}
            <Button
              onClick={() => {
                setShowNavigation(!showNavigation);
                setShowMap(false);
              }}
              className={cn(
                "gap-2 shadow-xl border border-white/40 dark:border-white/10 transition-all duration-300",
                showNavigation
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white/60 dark:bg-black/40 backdrop-blur-xl text-gray-800 dark:text-white hover:bg-white/80 dark:hover:bg-white/10"
              )}
              size="lg"
            >
              <Navigation size={18} />
              <span className="hidden md:inline">Navigate</span>
            </Button>

            {/* Map Toggle */}
            <Button
              onClick={() => {
                setShowMap(!showMap);
                setShowNavigation(false);
              }}
              className={cn(
                "gap-2 shadow-xl border border-white/40 dark:border-white/10 transition-all duration-300",
                showMap
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white/60 dark:bg-black/40 backdrop-blur-xl text-gray-800 dark:text-white hover:bg-white/80 dark:hover:bg-white/10"
              )}
              size="lg"
            >
              <Map size={18} />
              <span className="hidden md:inline">{showMap ? 'Hide Map' : 'Campus Map'}</span>
            </Button>
          </div>
        </div>

        {/* Arrival Notification */}
        {isArrived && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-50 duration-500">
            <div className="bg-emerald-500/90 backdrop-blur-xl border-4 border-emerald-300 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.5)] flex flex-col items-center gap-4 text-white">
              <div className="p-4 bg-white/20 rounded-full animate-bounce">
                <CheckCircle2 size={64} className="text-white drop-shadow-md" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-1">You have arrived!</h2>
                <p className="text-emerald-100 font-medium text-lg">{currentLocationDetails?.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows (Centered) */}
        {currentLocationDetails && !showNavigation && !showMap && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Forward Arrow */}
            {currentLocationDetails.directions?.forward && (
              <button
                onClick={() => navigateTo('forward')}
                className="group pointer-events-auto absolute top-[15%] bg-white/30 dark:bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/40 dark:border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
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
                className="group pointer-events-auto absolute bottom-[15%] bg-white/30 dark:bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/40 dark:border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:translate-y-1"
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
                className="group pointer-events-auto absolute left-[10%] bg-white/30 dark:bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/40 dark:border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-x-1"
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
                className="group pointer-events-auto absolute right-[10%] bg-white/30 dark:bg-black/30 backdrop-blur-md hover:bg-primary/80 p-4 rounded-full border border-white/40 dark:border-white/20 hover:border-primary/50 shadow-2xl transition-all duration-300 hover:scale-110 hover:translate-x-1"
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
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 px-6 py-2 rounded-full text-gray-800 dark:text-white/80 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <span className="hidden md:inline">Click and drag to look around • </span>
            <span>Use arrows to navigate</span>
          </div>
        </div>

      </div>

      {/* Navigation Drawer */}
      <div
        className={cn(
          "absolute top-24 right-6 w-96 z-40 transition-all duration-500 origin-top-right",
          showNavigation ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        <TourPathFinder
          currentLocationId={currentLocation}
          locations={locations}
          onClose={() => setShowNavigation(false)}
          onBestPath={(path) => {
            setCurrentPath(path);
            if (path) {
              // Logic to set immediate next step initiated in the useEffect
              setShowNavigation(false);
            }
          }}
        />
      </div>

      {/* Mini Map Drawer */}
      <div
        className={cn(
          "absolute top-20 right-6 w-80 bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 z-40 origin-top-right",
          showMap ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-4 border-b border-white/20 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-white/5">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Map size={16} className="text-primary" />
            Quick Navigation
          </h3>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
          {locations ? (
            Object.entries(locations).map(([key, location]) => (
              <button
                key={key}
                onClick={() => goToLocation(location.id)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group",
                  currentLocation === key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-gray-600 dark:text-white/70 hover:bg-white/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  currentLocation === key ? "bg-white/20" : "bg-gray-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"
                )}>
                  <Home size={16} />
                </div>
                <span className="font-medium text-sm">{location.name}</span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 dark:text-white/40 flex flex-col items-center gap-2">
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