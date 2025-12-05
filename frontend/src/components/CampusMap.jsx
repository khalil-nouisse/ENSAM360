import { useState, useRef, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Minimize2, MapPin, Plus, Building2, ArrowRight } from 'lucide-react'

function CampusMap() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [buildings, setBuildings] = useState([
    // Sample buildings for demonstration (using percentage coordinates)
    {
      id: 'main-building',
      name: 'Main Building',
      x: 30,
      y: 25,
      hasTour: true,
      tourType: '360°'
    },
    {
      id: 'library',
      name: 'Library',
      x: 60,
      y: 40,
      hasTour: true,
      tourType: '360°'
    },
    {
      id: 'lab-building',
      name: 'Laboratory Building',
      x: 20,
      y: 60,
      hasTour: true,
      tourType: '360°'
    }
  ])
  const [isCoordinateMode, setIsCoordinateMode] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error('Error entering fullscreen:', err)
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (err) {
        console.error('Error exiting fullscreen:', err)
      }
    }
  }

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  // Convert screen coordinates to SVG-relative coordinates
  const screenToMapCoords = (screenX, screenY) => {
    if (!mapRef.current) return { x: 0, y: 0 }
    
    const rect = mapRef.current.getBoundingClientRect()
    // Calculate position relative to the map container
    const relativeX = screenX - rect.left
    const relativeY = screenY - rect.top
    
    // Convert to percentage of the container (this will be the base position)
    const xPercent = (relativeX / rect.width) * 100
    const yPercent = (relativeY / rect.height) * 100
    
    return { x: xPercent, y: yPercent }
  }

  // Handle map clicks for coordinate detection
  const handleMapClick = (e) => {
    if (!isCoordinateMode) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const coords = screenToMapCoords(e.clientX, e.clientY)
    const buildingName = prompt('Enter building name:')
    
    if (buildingName) {
      const newBuilding = {
        id: Date.now(),
        name: buildingName,
        x: Math.round(coords.x),
        y: Math.round(coords.y),
        hasTour: true,
        tourType: '360°'
      }
      
      setBuildings(prev => [...prev, newBuilding])
      console.log(`Added building: ${buildingName} at coordinates (${coords.x}, ${coords.y})`)
    }
  }

  // Toggle coordinate detection mode
  const toggleCoordinateMode = () => {
    setIsCoordinateMode(!isCoordinateMode)
    setSelectedBuilding(null)
  }

  // Handle building marker click
  const handleBuildingClick = (building) => {
    setSelectedBuilding(selectedBuilding?.id === building.id ? null : building)
  }

  // Delete building
  const deleteBuilding = (buildingId) => {
    setBuildings(prev => prev.filter(b => b.id !== buildingId))
    setSelectedBuilding(null)
  }

  // Navigate to 360° tour for a building
  const navigateToTour = (building) => {
    console.log(`Navigating to 360° tour for: ${building.name}`)

  }

  return (
    <div 
      ref={containerRef}
      className="relative border border-darkblue/20 rounded-2xl shadow-lg h-full w-full overflow-hidden"
      style={{ backgroundColor: '#213985' }}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleFullscreen}
          className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={20} className="text-gray-700" /> : <Maximize2 size={20} className="text-gray-700" />}
        </button>
      </div>

      {/* Coordinate Detection Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={toggleCoordinateMode}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            isCoordinateMode 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-700'
          }`}
          title={isCoordinateMode ? "Exit Coordinate Mode" : "Enter Coordinate Mode"}
        >
          <MapPin size={20} />
        </button>
        {isCoordinateMode && (
          <div className="bg-white/90 px-3 py-2 rounded-lg shadow-md text-sm">
            <p className="text-gray-700 font-medium">Click to add building</p>
            <p className="text-gray-500 text-xs">Click on the map to mark buildings</p>
          </div>
        )}
      </div>

      {/* Reset and Zoom Level */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2 items-center">
        <div className="bg-white/90 px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-700">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleReset}
          className="bg-white/90 hover:bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-gray-700 transition-colors"
          title="Reset View"
        >
          Reset
        </button>
      </div>

      {/* Buildings List */}
      {buildings.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 bg-white/90 rounded-lg shadow-md p-3 max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-2">Buildings ({buildings.length})</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {buildings.map((building) => (
              <div
                key={building.id}
                className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${
                  selectedBuilding?.id === building.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleBuildingClick(building)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{building.name}</span>
                  {building.hasTour && (
                    <span className="text-xs text-green-600 font-medium">360° Tour Available</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">({building.x}, {building.y})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        className={`w-full h-full ${isCoordinateMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleMapClick}
      >
        <img 
          src="/src/assets/campus_map_2d1.svg" 
          alt="Campus Map" 
          className="absolute inset-0 w-full h-full" 
          style={{ 
            objectFit: 'contain', 
            objectPosition: 'center', 
            transform: `scaleX(1.35) scaleY(0.9) scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          draggable="false"
        />
        
        {/* Building Markers */}
        {buildings.map((building) => (
          <div
            key={building.id}
            className="absolute z-20"
            style={{
              left: `${building.x}%`,
              top: `${building.y}%`,
              transform: `scaleX(1.35) scaleY(0.9) scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px) translate(-50%, -50%)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <div className="relative">
              {/* Main Building Entry Button */}
              <button
                onClick={() => handleBuildingClick(building)}
                className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                  selectedBuilding?.id === building.id
                    ? 'bg-blue-600 text-white scale-110 shadow-xl'
                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 shadow-lg'
                }`}
                title={`Click to enter ${building.name}`}
              >
                <Building2 size={20} />
              </button>
              
              {/* Tour Entry Button (appears on hover/selection) */}
              {(selectedBuilding?.id === building.id || true) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateToTour(building)
                  }}
                  className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  title={`Enter 360° tour of ${building.name}`}
                >
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
            
            {/* Building Info Popup */}
            {selectedBuilding?.id === building.id && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 min-w-56 z-30">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{building.name}</h3>
                      <p className="text-sm text-gray-600">Coordinates: ({building.x}, {building.y})</p>
                    </div>
                    <button
                      onClick={() => deleteBuilding(building.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                  
                  {/* Tour Navigation Button */}
                  <button
                    onClick={() => navigateToTour(building)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} />
                    Enter 360° Tour
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CampusMap