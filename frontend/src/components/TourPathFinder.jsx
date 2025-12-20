import { useEffect, useState, useMemo } from "react";
import axios from '@/api/axios'
import { MapPin, Navigation, X, ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
// We reuse the button style or just use a standard button
import { Button } from "@/components/ui/button"

export function TourPathFinder({
    currentLocationId,
    locations, // Object of all locations
    onBestPath,
    onClose
}) {

    // Convert locations object to array for filtering
    const allLocations = useMemo(() => locations ? Object.values(locations) : [], [locations]);

    const [destinationTerm, setDestinationTerm] = useState('');
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!destinationTerm) {
            setFilteredDestinations([]);
            return;
        }
        const filtered = allLocations.filter(loc =>
            loc.name.toLowerCase().includes(destinationTerm.toLowerCase()) &&
            loc.id !== currentLocationId // Don't allow navigating to self
        );
        setFilteredDestinations(filtered);
    }, [destinationTerm, allLocations, currentLocationId]);

    const handleSelectDestination = (location) => {
        setSelectedDestination(location);
        setDestinationTerm(location.name);
        setShowSuggestions(false);
        setError(null);
    }

    const handleSearch = async () => {
        if (!selectedDestination) {
            setError("Please select a destination.");
            return;
        }
        if (!currentLocationId) {
            setError("Current location unknown.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log("Searching path:", { start: currentLocationId, end: selectedDestination.id });
            const res = await axios.post("/api/map/shortestPath", {
                startID: currentLocationId,
                endID: selectedDestination.id
            });

            // The result format is { nodes: [...], edges: [...], totalDistance: ... }
            const result = res.data;

            if (!result || !result.nodes || result.nodes.length === 0) {
                setError("No path found.");
                onBestPath(null);
            } else {
                onBestPath(result);
            }

        } catch (err) {
            console.error(err);
            setError("Failed to calculate path.");
            onBestPath(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-primary">
                    <Navigation size={20} />
                    <h2 className="font-bold text-gray-800 dark:text-white">Navigate Tour</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            <div className="relative group">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1 mb-1 block">
                    Where to?
                </label>
                <div className="absolute left-3 top-8 text-gray-400">
                    <MapPin size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Search destination..."
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm text-gray-800 dark:text-white placeholder:text-gray-400"
                    value={destinationTerm}
                    onChange={(e) => {
                        setDestinationTerm(e.target.value);
                        setSelectedDestination(null); // Reset selection on type
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
                {destinationTerm && (
                    <button
                        onClick={() => {
                            setDestinationTerm('');
                            setSelectedDestination(null);
                        }}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}

                {/* Suggestions */}
                {showSuggestions && filteredDestinations.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {filteredDestinations.map(loc => (
                            <button
                                key={loc.id}
                                onClick={() => handleSelectDestination(loc)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 hover:text-primary transition-colors flex items-center justify-between group"
                            >
                                <span>{loc.name}</span>
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-2 rounded-lg border border-red-200 dark:border-red-500/20">
                    {error}
                </div>
            )}

            <Button
                onClick={handleSearch}
                disabled={isLoading || !selectedDestination}
                className="w-full gap-2 shadow-lg shadow-primary/20"
            >
                {isLoading ? "Calculating..." : "Start Navigation"}
                {!isLoading && <Navigation size={16} />}
            </Button>
        </div>
    )
}
