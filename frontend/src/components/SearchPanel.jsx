function SearchPanel({ searchTerm, setSearchTerm, filteredBuildings, onBuildingSelect }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-beige rounded-lg focus:ring-2 focus:ring-darkblue focus:border-darkblue outline-none transition-all"
          style={{ backgroundColor: 'white' }}
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

export default SearchPanel