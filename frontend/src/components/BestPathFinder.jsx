import { useEffect ,useState} from "react";
import axios from 'axios'
import SearchBestPathBtn from './SearchBestPathBtn'

export function BestPathFinder({ selectedStartLocation, selectedDestinationLocation, filteredStartingLocations, filteredDestinationLocations, onStartLocationSelect, onDestinationLocationSelect, startLocationTerm, setStartLocationTerm, destinationLocationTerm, setDestinationLocationTerm, onBestPath }) {
  async function GenerateShortestPath() {
  try {
    const res = await axios.post(process.env.BACKEND_SERVER + "/api/map/shortestPath", {
      startID: selectedStartLocationState.id,
      endID: selectedDestinationLocationState.id
    });
    console.log(res.data)
    return res.data;
    
  } catch (err) {
    console.error(err);
    return null;
  }  
}

const handleSearchBtnClick = async () => {
  if(!selectedStartLocationState || !selectedDestinationLocationState) {
    console.error("Please select both start and destination locations.");
    if (typeof onBestPath === 'function') onBestPath(null);
    return;
  }
  try{
    const {nodes,edges,totalDistance}=  await GenerateShortestPath();
    const result = {nodes,edges,totalDistance};
    setBestPath(result);
    // notify parent of a successful path search (so it can display results outside this component)
    if (typeof onBestPath === 'function') {
      onBestPath(result);
    }
    console.log(result);
  }catch(err){
    console.error("Error generating shortest path:", err);
    if (typeof onBestPath === 'function') onBestPath(null);
  }
};
  const[bestPath,setBestPath]= useState (null)
  const [selectedStartLocationState, setSelectedStartLocationState] = useState(selectedStartLocation);
  const [selectedDestinationLocationState, setSelectedDestinationLocationState] = useState(selectedDestinationLocation);
  const [filteredStartingLocationsState, setFilteredStartingLocationsState] = useState(filteredStartingLocations);
  const [filteredDestinationLocationsState, setFilteredDestinationLocationsState] = useState(filteredDestinationLocations);
  // control visibility of the suggestions dropdowns; when a user selects a location, we'll hide them
  const [showStartSuggestions, setShowStartSuggestions] = useState(true);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(true);
    useEffect(() => {
        setFilteredStartingLocationsState(filteredStartingLocations);
        setFilteredDestinationLocationsState(filteredDestinationLocations);
    }, [filteredStartingLocations, filteredDestinationLocations]);

    useEffect(() => {
        setSelectedStartLocationState(selectedStartLocation);
        setSelectedDestinationLocationState(selectedDestinationLocation);
    }, [selectedStartLocation,selectedDestinationLocation]);

    return (
         <div className="rounded-2xl shadow-lg p-6 border border-darkblue/10 flex flex-col h-1/2" style={{ backgroundColor: '#213985' }}>
            <div className="flex flex-col space-y-16 items-center justify-center h-full">
                <div className="relative">
                    <input type="text" placeholder="Enter starting location" className="text-center px-10 py-3 border border-beige rounded-lg focus:ring-2 focus:ring-darkblue focus:border-darkblue outline-none transition-all"
                    onChange={(e) => { setStartLocationTerm(e.target.value); setShowStartSuggestions(true) }} value={startLocationTerm}
                    onFocus={() => setShowStartSuggestions(true)}
            style={{ backgroundColor: 'white' }} />
                    {/* when start location exists, show 'Change' button that reopens suggestions */}
                    {startLocationTerm && !showStartSuggestions && (
                      <button onClick={() => setShowStartSuggestions(true)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-beige px-2 py-1 rounded text-xs">Change</button>
                    )}


            {startLocationTerm && filteredStartingLocationsState.length > 0 && showStartSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredStartingLocationsState.map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  onStartLocationSelect(location)
                  console.log(location)
                  // hide suggestions after selection to remove the dropdown
                  setShowStartSuggestions(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-beige border-b border-beige last:border-b-0 transition-colors"
              >
                <div className="font-medium text-dark">{location.name}</div>
              </button>
            ))}
          </div>
        )}
        
        {startLocationTerm && filteredStartingLocationsState.length === 0 && showStartSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 p-4">
            <div className="text-dark/60 text-center">No locations found matching "{startLocationTerm}"</div>
          </div>
        )}
                </div>
                <div className="relative">
                    <input type="text" placeholder="Enter destination location" className="text-center px-10 py-3 border border-beige rounded-lg focus:ring-2 focus:ring-darkblue focus:border-darkblue outline-none transition-all"
                    onChange={(e) => { setDestinationLocationTerm(e.target.value); setShowDestinationSuggestions(true) }} value={destinationLocationTerm}
                    onFocus={() => setShowDestinationSuggestions(true)}
            style={{ backgroundColor: 'white' }} />
                    {destinationLocationTerm && !showDestinationSuggestions && (
                      <button onClick={() => setShowDestinationSuggestions(true)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-beige px-2 py-1 rounded text-xs">Change</button>
                    )}

                    {destinationLocationTerm && filteredDestinationLocationsState.length > 0 && showDestinationSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredDestinationLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  onDestinationLocationSelect(location)
                  // hide destination suggestions after selection
                  setShowDestinationSuggestions(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-beige border-b border-beige last:border-b-0 transition-colors"
              >
                <div className="font-medium text-dark">{location.name}</div>
              </button>
            ))}
          </div>
        )}
        
        {destinationLocationTerm && filteredDestinationLocationsState.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-lg shadow-lg z-10 p-4">
            <div className="text-dark/60 text-center">No locations found matching "{destinationLocationTerm}"</div>
          </div>
        )}
                </div>


            <SearchBestPathBtn
              onClick={handleSearchBtnClick}
              className="bg-darkblue hover:bg-darkblue/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-darkblue/30"
            >
              Search
            </SearchBestPathBtn>
            {/* BestPathResults moved to parent component (App) to render after BestPathFinder; keep this component focused on input/controls only */}
            </div> 
         </div>
    );
}