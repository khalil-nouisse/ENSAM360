import { useState, useEffect } from 'react'
import axios from 'axios'
import { SiteHeader } from "@/components/home/site-header"
import CampusMapLeaflet from '../components/CampusMapLeaflet'
import InteractionPanel from '../components/InteractionPanel'
import { BestPathFinder } from '../components/BestPathFinder'
import BestPathResults from '../components/BestPathResults'

function MapPage() {
  const [Buildings, setBuildings] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [is3DMode, setIs3DMode] = useState(false)
  const [filteredBuildings, setFilteredBuildings] = useState(null)

  // BestPathFinder State
  const [locations, setLocations] = useState(null)
  const [filteredStartingLocations, setFilteredStartingLocations] = useState(null)
  const [filteredDestinationLocations, setFilteredDestinationLocations] = useState(null)
  const [selectedStartLocation, setSelectedStartLocation] = useState(null)
  const [startLocationTerm, setStartLocationTerm] = useState('')
  const [selectedDestinationLocation, setSelectedDestinationLocation] = useState(null)
  const [destinationLocationTerm, setDestinationLocationTerm] = useState('')
  const [bestPath, setBestPath] = useState(null)
  const [selectedPathNode, setSelectedPathNode] = useState(null)

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

  async function LoadLocations() {
    try {
      const res = await axios.get(API_URL + "/api/map/allLocations");
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
    if (building) {
      localStorage.setItem('selectedBuilding', JSON.stringify(building));
    }
  }

  const handleBestPath = (path) => {
    setBestPath(path)
    setSelectedPathNode(null)
  }

  const handlePathNodeClick = (nodeId) => {
    setSelectedPathNode(nodeId)
  }

  const handleCloseBestPath = () => {
    setBestPath(null)
    setSelectedPathNode(null)
  }

  const handleStartLocationSelect = (location) => {
    setSelectedStartLocation(location)
    setFilteredStartingLocations([])
    setStartLocationTerm(location.name)
    setIs3DMode(false)
  }

  const handleDestinationLocationSelect = (location) => {
    setSelectedDestinationLocation(location)
    setFilteredDestinationLocations([])
    setDestinationLocationTerm(location.name)
    setIs3DMode(false)
  }

  useEffect(() => {
    async function init() {
      const buildingsData = await LoadBuildings();
      const locationsData = await LoadLocations();
      setBuildings(buildingsData);
      setLocations(locationsData);
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

  useEffect(() => {
    if (!locations) return;

    const filteredStart = locations.filter(location =>
      location.name.toLowerCase().includes(startLocationTerm.toLowerCase())
    );
    setFilteredStartingLocations(filteredStart);

    const filteredDestination = locations.filter(location =>
      location.name.toLowerCase().includes(destinationLocationTerm.toLowerCase())
    );
    setFilteredDestinationLocations(filteredDestination);
  }, [locations, startLocationTerm, destinationLocationTerm]);

  return (
    <div className="min-h-screen font-sans bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-8 h-[calc(100vh-10rem)] items-start justify-center max-w-7xl mx-auto w-full">
          {/* Left Side: Map (65%) */}
          <div className="w-[65%] h-full rounded-2xl overflow-hidden border border-primary/20 shadow-sm">
            <CampusMapLeaflet
              onBuildingSelect={handleBuildingSelect}
              path={bestPath}
              selectedPathNode={selectedPathNode}
            />
          </div>

          {/* Right Side: Controls (35%) */}
          <div className="w-[35%] h-full flex flex-col gap-4">
            {/* Path Finder */}
            <div className="flex-1 min-h-0">
              <BestPathFinder
                selectedStartLocation={selectedStartLocation}
                selectedDestinationLocation={selectedDestinationLocation}
                filteredStartingLocations={filteredStartingLocations}
                filteredDestinationLocations={filteredDestinationLocations}
                onStartLocationSelect={handleStartLocationSelect}
                onDestinationLocationSelect={handleDestinationLocationSelect}
                startLocationTerm={startLocationTerm}
                setStartLocationTerm={setStartLocationTerm}
                destinationLocationTerm={destinationLocationTerm}
                setDestinationLocationTerm={setDestinationLocationTerm}
                onBestPath={handleBestPath}
              />
            </div>

            {/* Results */}
            {bestPath && (
              <div className="shrink-0">
                <BestPathResults bestPath={bestPath} onNodeClick={handlePathNodeClick} onClose={handleCloseBestPath} />
              </div>
            )}

            {/* Building Search */}
            <div className="flex-1 min-h-0">
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
          <div className="space-y-4">
            <BestPathFinder
              filteredStartingLocations={filteredStartingLocations}
              filteredDestinationLocations={filteredDestinationLocations}
              selectedStartLocation={selectedStartLocation}
              selectedDestinationLocation={selectedDestinationLocation}
              onStartLocationSelect={handleStartLocationSelect}
              onDestinationLocationSelect={handleDestinationLocationSelect}
              startLocationTerm={startLocationTerm}
              setStartLocationTerm={setStartLocationTerm}
              destinationLocationTerm={destinationLocationTerm}
              setDestinationLocationTerm={setDestinationLocationTerm}
              onBestPath={handleBestPath}
            />
            {bestPath && <BestPathResults bestPath={bestPath} onNodeClick={handlePathNodeClick} onClose={handleCloseBestPath} />}
          </div>
          <div className="h-80 rounded-2xl overflow-hidden border border-primary/20">
            <CampusMapLeaflet
              onBuildingSelect={handleBuildingSelect}
              path={bestPath}
              selectedPathNode={selectedPathNode}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default MapPage