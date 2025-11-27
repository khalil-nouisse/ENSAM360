import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VirtualTour from './components/VirtualTour'
import Auth from './pages/Auth'
import { useState ,useEffect} from 'react'
import Navbar from './components/Navbar'
import CampusMapLeaflet from './components/CampusMapLeaflet'
import InteractionPanel from './components/InteractionPanel'
import axios from 'axios'
import { BestPathFinder } from './components/BestPathFinder'
import BestPathResults from './components/BestPathResults'
// approach without database
// Mock buildings data
/* const MOCK_BUILDINGS = [
  {
    id: 1,
    name: 'administration',
    description: "A state-of-the-art facility housing computer science, electrical engineering, and mechanical engineering departments. Features advanced laboratories and research centers.",
    image_url: "src/assets/image/administration.jpg"
  },
  {
    id: 2,
    name: "Administration_etud",
    description: "The main library offering extensive collections, study spaces, digital resources, and quiet zones for academic research and learning.",
    image_url: "src/assets/image/adminetud.jpg"
  },
  {
    id: 3,
    name: "Bibliotheque_et_centre_de_langue",
    description: "The heart of campus life with dining facilities, event spaces, student organizations, and recreational amenities for the campus community.",
    image_url: "src/assets/image/bib.jpg"
  },
  {
    id: 4,
    name: "AEEE",
    description: "Modern laboratories and classrooms for physics, chemistry, biology, and environmental science programs with cutting-edge equipment.",
    image_url: "src/assets/image/a3e.jpg"
  },
  {
    id: 5,
    name: "mathinfo",
    description: "Creative spaces for fine arts, music, theater, and design programs including studios, galleries, and performance venues.",
    image_url: "src/assets/image/cc_outside.jpg"
  },
  {
    id: 6,
    name: "amphie_et_salle_de_conference",
    description: "Creative spaces for fine arts, music, theater, and design programs including studios, galleries, and performance venues.",
    image_url: "src/assets/image/image7.jpg"
  },
  {
    id: 7,
    name: "Amphi3",
    description: "Creative spaces for fine arts, music, theater, and design programs including studios, galleries, and performance venues.",
    image_url: "src/assets/image/image11.jpg"
  },
  
]*/


function App() {

  async function LoadBuildings() {
  try {
    const res = await axios.get(process.env.BACKEND_SERVER + "/api/map/principaleLocations");
    console.log(res.data)
    return res.data;
    
  } catch (err) {
    console.error(err);
    return null;
  }

  
}

async function LoadLocations() {
  try {
    const res = await axios.get(process.env.BACKEND_SERVER + "/api/map/allLocations");
    console.log(res.data)
    return res.data;
    
  } catch (err) {
    console.error(err);
    return null;
  }

  
}
  const [Buildings,setBuildings] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [is3DMode, setIs3DMode] = useState(false)
  const [filteredBuildings,setFilteredBuildings] = useState(null)
  // for BestPathFinder Component
  const [locations,setLocations] = useState(null)
  const [filteredStartingLocations,setFilteredStartingLocations]= useState (null)
  const [filteredDestinationLocations,setFilteredDestinationLocations]= useState (null)
  const [selectedStartLocation,setSelectedStartLocation]= useState (null)
  const [startLocationTerm, setStartLocationTerm] = useState('')
  const [selectedDestinationLocation,setSelectedDestinationLocation]= useState (null)
  const [destinationLocationTerm, setDestinationLocationTerm] = useState('')
  const [bestPath, setBestPath] = useState(null)
  const [selectedPathNode, setSelectedPathNode] = useState(null)

  const handleBestPath = (path) => {
    setBestPath(path)
    setSelectedPathNode(null)
  }
  const handlePathNodeClick = (nodeId) => {
    setSelectedPathNode(nodeId)
  }
  // Filter buildings based on search term
  
  

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building)
    setSearchTerm('')
    setIs3DMode(false)
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
      async function init(){
        const buildings = await LoadBuildings();
        const locations = await LoadLocations();
        console.log(locations)
        setLocations(locations);
        console.log(buildings)
        setBuildings(buildings);
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
}, [locations , startLocationTerm, destinationLocationTerm]);
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={
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
            <CampusMapLeaflet onBuildingSelect={handleBuildingSelect} path={bestPath} selectedPathNode={selectedPathNode} />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <BestPathFinder selectedStartLocation={selectedStartLocation} selectedDestinationLocation={selectedDestinationLocation} filteredStartingLocations={filteredStartingLocations} filteredDestinationLocations={filteredDestinationLocations}  onStartLocationSelect={handleStartLocationSelect} onDestinationLocationSelect={handleDestinationLocationSelect} startLocationTerm={startLocationTerm} setStartLocationTerm={setStartLocationTerm} destinationLocationTerm={destinationLocationTerm} setDestinationLocationTerm={setDestinationLocationTerm} onBestPath={handleBestPath} />
            {bestPath && <BestPathResults bestPath={bestPath} onNodeClick={handlePathNodeClick} />}
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
            buildings={Buildings}
          />
            <div className="space-y-4">
            <BestPathFinder filteredStartingLocations={filteredStartingLocations} filteredDestinationLocations={filteredDestinationLocations} selectedStartLocation={selectedStartLocation} selectedDestinationLocation={selectedDestinationLocation} onStartLocationSelect={handleStartLocationSelect} onDestinationLocationSelect={handleDestinationLocationSelect} startLocationTerm={startLocationTerm} setStartLocationTerm={setStartLocationTerm} destinationLocationTerm={destinationLocationTerm} setDestinationLocationTerm={setDestinationLocationTerm} onBestPath={handleBestPath} />
            {bestPath && <BestPathResults bestPath={bestPath} onNodeClick={handlePathNodeClick} />}
          </div>
          <div className="h-80">
            <CampusMapLeaflet onBuildingSelect={handleBuildingSelect} path={bestPath} selectedPathNode={selectedPathNode} />
          </div>
        </div>
      </main>
    </div>
    }/>
    <Route path="/auth" element={<Auth />} />
    <Route path="/tour" element={<VirtualTour location={selectedBuilding? selectedBuilding:null}/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App