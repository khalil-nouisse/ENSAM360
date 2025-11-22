import { useState, useEffect } from 'react'
import axios from 'axios' // Or use '../api/axios' if you want your configured instance
import Navbar from '../components/Navbar'
import CampusMapLeaflet from '../components/CampusMapLeaflet'
import InteractionPanel from '../components/InteractionPanel'

function MapPage() {
  const [Buildings, setBuildings] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [is3DMode, setIs3DMode] = useState(false)
  const [filteredBuildings, setFilteredBuildings] = useState(null)

  // Fix: Use import.meta.env for Vite
  const API_URL = import.meta.env.VITE_BACKEND_SERVER || 'http://localhost:5000';

  async function LoadBuildings() {
    try {
      const res = await axios.get(API_URL + "/api/map/principaleLocations");
      console.log(res.data)
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building)
    setSearchTerm('')
    setIs3DMode(false)
    
    // SAVE TO LOCAL STORAGE: This ensures the Tour page knows which building 
    // was selected even if we change routes.
    if(building) {
        localStorage.setItem('selectedBuilding', JSON.stringify(building));
    }
  }

  useEffect(() => {
    async function init(){
      const locations = await LoadBuildings();
      setBuildings(locations);
    }
    init();
  }, [])

  useEffect(() => {
    if (!Buildings) return;
    const filtered = Buildings.filter(building =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [Buildings, searchTerm]);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F1E8DD' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 h-[calc(100vh-12rem)]">
          <div className="w-[70%]">
            <CampusMapLeaflet onBuildingSelect={handleBuildingSelect}/>
          </div>
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

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <InteractionPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredBuildings={filteredBuildings}
            onBuildingSelect={handleBuildingSelect}
            selectedBuilding={selectedBuilding}
            is3DMode={is3DMode}
            setIs3DMode={setIs3DMode}
            buildings={Buildings}
          />
          <div className="h-80">
            <CampusMapLeaflet onBuildingSelect={handleBuildingSelect}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MapPage