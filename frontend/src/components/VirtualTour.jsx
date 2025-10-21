import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Map, Home } from 'lucide-react'

function VirtualTour() {
  // Define your tour locations with their 360 image paths
  const locations = {
    entrance: {
      name: "Campus Entrance",
      image: "/src/assets/entrance_360.jpg", // Path to your 360° image
      directions: {
        forward: 'lobby',
        right: 'parking',
        left: null,
        back: null
      }
    },
    lobby: {
      name: "Main Lobby",
      image: "/src/assets/lobby_360.jpg",
      directions: {
        forward: 'corridor',
        right: 'office',
        left: 'library',
        back: 'entrance'
      }
    },
    parking: {
      name: "Parking Area",
      image: "/src/assets/parking_360.jpg",
      directions: {
        forward: null,
        right: null,
        left: 'entrance',
        back: null
      }
    },
    corridor: {
      name: "Main Corridor",
      image: "/src/assets/example.jpg",
      directions: {
        forward: 'classroom',
        right: 'lab',
        left: null,
        back: 'lobby'
      }
    },
    office: {
      name: "Administration Office",
      image: "/src/assets/office_360.jpg",
      directions: {
        forward: null,
        right: null,
        left: 'lobby',
        back: null
      }
    },
    library: {
      name: "Library",
      image: "/src/assets/library_360.jpg",
      directions: {
        forward: null,
        right: 'lobby',
        left: null,
        back: null
      }
    },
    classroom: {
      name: "Classroom 101",
      image: "/src/assets/classroom_360.jpg",
      directions: {
        forward: null,
        right: null,
        left: null,
        back: 'corridor'
      }
    },
    lab: {
      name: "Science Laboratory",
      image: "/src/assets/lab_360.jpg",
      directions: {
        forward: null,
        right: null,
        left: 'corridor',
        back: null
      }
    }
  }

  const [currentLocation, setCurrentLocation] = useState('entrance')
  const [showMap, setShowMap] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)
  const viewerRef = useRef(null)
  const pannellumViewerRef = useRef(null)

  const current = locations[currentLocation]

  // Initialize Pannellum viewer
  useEffect(() => {
    // Load Pannellum script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
    script.async = true
    document.body.appendChild(script)

    // Load Pannellum CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
    document.head.appendChild(link)

    script.onload = () => {
      setViewerReady(true)
    }

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
      if (pannellumViewerRef.current) {
        pannellumViewerRef.current.destroy()
      }
    }
  }, [])

  // Update panorama when location changes
  useEffect(() => {
    if (!viewerReady || !window.pannellum) return

    // Destroy existing viewer if it exists
    if (pannellumViewerRef.current) {
      pannellumViewerRef.current.destroy()
    }

    // Create new viewer
    pannellumViewerRef.current = window.pannellum.viewer(viewerRef.current, {
      type: 'equirectangular',
      panorama: current.image,
      autoLoad: true,
      showControls: true,
      showFullscreenCtrl: true,
      showZoomCtrl: true,
      mouseZoom: true,
      draggable: true,
      compass: true,
      hfov: 100,
      pitch: 0,
      yaw: 0
    })
  }, [currentLocation, viewerReady, current.image])

  const navigateTo = (direction) => {
    const nextLocation = current.directions[direction]
    if (nextLocation) {
      setCurrentLocation(nextLocation)
    }
  }

  const goToLocation = (locationKey) => {
    setCurrentLocation(locationKey)
    setShowMap(false)
  }

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">Virtual Campus Tour</h1>
          <p className="text-sm text-gray-300 mt-1">{current.name}</p>
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
        <div className="absolute inset-0 pointer-events-none">
          {/* Forward Arrow */}
          {current.directions.forward && (
            <button
              onClick={() => navigateTo('forward')}
              className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-32 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
              title={`Go to ${locations[current.directions.forward].name}`}
            >
              <ArrowUp size={32} className="text-gray-800" />
            </button>
          )}

          {/* Back Arrow */}
          {current.directions.back && (
            <button
              onClick={() => navigateTo('back')}
              className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
              title={`Go to ${locations[current.directions.back].name}`}
            >
              <ArrowDown size={32} className="text-gray-800" />
            </button>
          )}

          {/* Left Arrow */}
          {current.directions.left && (
            <button
              onClick={() => navigateTo('left')}
              className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -ml-32 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
              title={`Go to ${locations[current.directions.left].name}`}
            >
              <ArrowLeft size={32} className="text-gray-800" />
            </button>
          )}

          {/* Right Arrow */}
          {current.directions.right && (
            <button
              onClick={() => navigateTo('right')}
              className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-32 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
              title={`Go to ${locations[current.directions.right].name}`}
            >
              <ArrowRight size={32} className="text-gray-800" />
            </button>
          )}
        </div>

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
            <div className="space-y-2">
              {Object.entries(locations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => goToLocation(key)}
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
            </div>
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