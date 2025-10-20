import { useState } from 'react'

// Mock buildings data
const MOCK_BUILDINGS = [
  {
    id: 1,
    name: "Engineering Building",
    description: "A state-of-the-art facility housing computer science, electrical engineering, and mechanical engineering departments. Features advanced laboratories and research centers.",
    image_url: "https://placehold.co/400x300/213985/F1E8DD?text=Engineering+Building"
  },
  {
    id: 2,
    name: "Library Complex",
    description: "The main library offering extensive collections, study spaces, digital resources, and quiet zones for academic research and learning.",
    image_url: "https://placehold.co/400x300/213985/F1E8DD?text=Library+Complex"
  },
  {
    id: 3,
    name: "Student Center",
    description: "The heart of campus life with dining facilities, event spaces, student organizations, and recreational amenities for the campus community.",
    image_url: "https://placehold.co/400x300/213985/F1E8DD?text=Student+Center"
  },
  {
    id: 4,
    name: "Science Hall",
    description: "Modern laboratories and classrooms for physics, chemistry, biology, and environmental science programs with cutting-edge equipment.",
    image_url: "https://placehold.co/400x300/213985/F1E8DD?text=Science+Hall"
  },
  {
    id: 5,
    name: "Arts Building",
    description: "Creative spaces for fine arts, music, theater, and design programs including studios, galleries, and performance venues.",
    image_url: "https://placehold.co/400x300/213985/F1E8DD?text=Arts+Building"
  }
]

function CampusMap() {
  return (
    <div 
      className="border border-darkblue/20 rounded-lg shadow-lg h-full flex items-center justify-center"
      style={{ backgroundColor: '#213985' }}
    >
      <div className="text-center text-white">
        <div className="text-2xl font-semibold mb-2">2D Campus Map SVG Placeholder</div>
        <div className="text-sm opacity-75">Interactive campus map will be rendered here</div>
      </div>
    </div>
  )
}

function SearchPanel({ searchTerm, setSearchTerm, filteredBuildings, onBuildingSelect }) {
  return (
    <div 
      className="rounded-lg shadow-lg p-6 mb-6 border border-darkblue/10"
      style={{ backgroundColor: '#F1E8DD' }}
    >
      <h2 className="text-xl font-semibold text-dark mb-4">Search Buildings</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-beige rounded-lg focus:ring-2 focus:ring-darkblue focus:border-darkblue outline-none transition-all bg-beige/30 focus:bg-white"
        />
        
        {searchTerm && filteredBuildings.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredBuildings.map((building) => (
              <button
                key={building.id}
                onClick={() => onBuildingSelect(building)}
                className="w-full px-4 py-3 text-left hover:bg-beige border-b border-beige last:border-b-0 transition-colors"
              >
                <div className="font-medium text-dark">{building.name}</div>
              </button>
            ))}
          </div>
        )}
        
        {searchTerm && filteredBuildings.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 p-4">
            <div className="text-dark/60 text-center">No buildings found matching "{searchTerm}"</div>
          </div>
        )}
      </div>
    </div>
  )
}

function BuildingDetailsCard({ selectedBuilding, is3DMode, setIs3DMode }) {
  return (
    <div 
      className="rounded-lg shadow-lg p-6 border border-darkblue/10"
      style={{ backgroundColor: '#F1E8DD' }}
    >
      <h2 className="text-xl font-semibold text-dark mb-4">Building Details</h2>
      
      {selectedBuilding ? (
        <div>
          <div className="mb-4">
            <img
              src={selectedBuilding.image_url}
              alt={selectedBuilding.name}
              className="w-full h-48 object-cover rounded-lg shadow-sm border border-beige"
            />
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">{selectedBuilding.name}</h3>
          <p className="text-dark/70 leading-relaxed mb-6">{selectedBuilding.description}</p>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                setIs3DMode(true)
                console.log(`3D Scene mode activated for ${selectedBuilding.name}`)
              }}
              className="bg-darkblue hover:bg-darkblue/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-darkblue/30"
            >
              Explore 3D Scene
            </button>
          </div>
          
          {is3DMode && (
            <div className="mt-4 p-4 bg-beige border border-darkblue/20 rounded-lg">
              <div className="text-darkblue font-medium">3D Mode Active</div>
              <div className="text-dark/70 text-sm mt-1">Exploring 3D scene for {selectedBuilding.name}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-dark/60 text-lg mb-2">No building selected</div>
          <div className="text-dark/40">Search for a building to view details</div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [is3DMode, setIs3DMode] = useState(false)

  // Filter buildings based on search term
  const filteredBuildings = MOCK_BUILDINGS.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building)
    setSearchTerm('')
    setIs3DMode(false)
  }

  return (
    <div 
      className="min-h-screen font-sans"
      style={{ backgroundColor: '#F1E8DD' }}
    >
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-darkblue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-dark">Campus Explorer</h1>
          <p className="text-dark/70 mt-1">Discover and explore campus buildings</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Layout: Split Screen */}
        <div className="hidden lg:flex gap-6 h-[calc(100vh-12rem)]">
          {/* Left Side: Campus Map (70% width) */}
          <div className="w-[70%]">
            <CampusMap />
          </div>
          
          {/* Right Side: Interaction Panel (30% width) */}
          <div className="w-[30%] flex flex-col">
            <SearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredBuildings={filteredBuildings}
              onBuildingSelect={handleBuildingSelect}
            />
            <BuildingDetailsCard
              selectedBuilding={selectedBuilding}
              is3DMode={is3DMode}
              setIs3DMode={setIs3DMode}
            />
          </div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden space-y-6">
          <SearchPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBuildings={filteredBuildings}
            onBuildingSelect={handleBuildingSelect}
          />
          <BuildingDetailsCard
            selectedBuilding={selectedBuilding}
            is3DMode={is3DMode}
            setIs3DMode={setIs3DMode}
          />
          <div className="h-80">
            <CampusMap />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App