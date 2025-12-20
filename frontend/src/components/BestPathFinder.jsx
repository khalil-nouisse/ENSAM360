import { useEffect, useState } from "react";
import axios from '@/api/axios'
import SearchBestPathBtn from './SearchBestPathBtn'
import { MapPin, Navigation, X } from 'lucide-react'
import { cn } from "@/lib/utils"

export function BestPathFinder({ selectedStartLocation, selectedDestinationLocation, filteredStartingLocations, filteredDestinationLocations, onStartLocationSelect, onDestinationLocationSelect, startLocationTerm, setStartLocationTerm, destinationLocationTerm, setDestinationLocationTerm, onBestPath }) {
  async function GenerateShortestPath() {
    try {
      const res = await axios.post("/api/map/shortestPath", {
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
    if (!selectedStartLocationState || !selectedDestinationLocationState) {
      console.error("Please select both start and destination locations.");
      if (typeof onBestPath === 'function') onBestPath(null);
      return;
    }
    try {
      const { nodes, edges, totalDistance } = await GenerateShortestPath();
      const result = { nodes, edges, totalDistance };
      setBestPath(result);
      // notify parent of a successful path search (so it can display results outside this component)
      if (typeof onBestPath === 'function') {
        onBestPath(result);
      }
      console.log(result);
    } catch (err) {
      console.error("Error generating shortest path:", err);
      if (typeof onBestPath === 'function') onBestPath(null);
    }
  };
  const [bestPath, setBestPath] = useState(null)
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
  }, [selectedStartLocation, selectedDestinationLocation]);

  return (
    <div className="bg-transparent border border-primary/20 rounded-2xl p-4 flex flex-col gap-4 h-full transition-colors duration-300 overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary">
          <Navigation size={20} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Find Path</h2>
      </div>

      <div className="flex flex-col space-y-3">
        {/* Start Location Input */}
        <div className="relative group">
          <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            placeholder="Start Location"
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground text-foreground"
            onChange={(e) => { setStartLocationTerm(e.target.value); setShowStartSuggestions(true) }}
            value={startLocationTerm}
            onFocus={() => setShowStartSuggestions(true)}
          />
          {startLocationTerm && !showStartSuggestions && (
            <button
              onClick={() => { setStartLocationTerm(''); setShowStartSuggestions(true) }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}

          {/* Start Suggestions */}
          {startLocationTerm && filteredStartingLocationsState && filteredStartingLocationsState.length > 0 && showStartSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/20">
              {filteredStartingLocationsState.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    onStartLocationSelect(location)
                    setShowStartSuggestions(false)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-primary/5 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <MapPin size={14} className="opacity-50" />
                  {location.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative group">
          <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            placeholder="Destination"
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground text-foreground"
            onChange={(e) => { setDestinationLocationTerm(e.target.value); setShowDestinationSuggestions(true) }}
            value={destinationLocationTerm}
            onFocus={() => setShowDestinationSuggestions(true)}
          />
          {destinationLocationTerm && !showDestinationSuggestions && (
            <button
              onClick={() => { setDestinationLocationTerm(''); setShowDestinationSuggestions(true) }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}

          {/* Destination Suggestions */}
          {destinationLocationTerm && filteredDestinationLocationsState && filteredDestinationLocationsState.length > 0 && showDestinationSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/20">
              {filteredDestinationLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    onDestinationLocationSelect(location)
                    setShowDestinationSuggestions(false)
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-primary/5 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <MapPin size={14} className="opacity-50" />
                  {location.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <SearchBestPathBtn
          onClick={handleSearchBtnClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
        >
          <Navigation size={18} />
          Find Shortest Path
        </SearchBestPathBtn>
      </div>
    </div>
  );
}