import { useState } from 'react'
import Navbar from './components/Navbar'
import CampusMap from './components/CampusMap'
import InteractionPanel from './components/InteractionPanel'

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
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Layout: Split Screen */}
        <div className="hidden lg:flex gap-6 h-[calc(100vh-12rem)]">
          {/* Left Side: Campus Map (70% width) */}
          <div className="w-[70%]">
            <CampusMap />
          </div>
          
          {/* Right Side: Interaction Panel (30% width) */}
          <div className="w-[30%]">
            <InteractionPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredBuildings={filteredBuildings}
              onBuildingSelect={handleBuildingSelect}
              selectedBuilding={selectedBuilding}
              is3DMode={is3DMode}
              setIs3DMode={setIs3DMode}
            />
          </div>
        </div>

        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden space-y-6">
          <InteractionPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBuildings={filteredBuildings}
            onBuildingSelect={handleBuildingSelect}
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