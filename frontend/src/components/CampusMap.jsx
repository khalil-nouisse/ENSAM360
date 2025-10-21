import { useState, useRef } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'

function CampusMap() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

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

      {/* Map Container */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img 
          src="/src/assets/campus_map_2d.svg" 
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
      </div>
    </div>
  )
}

export default CampusMap