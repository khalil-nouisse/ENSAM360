function SearchPanel({ searchTerm, setSearchTerm, filteredBuildings, onBuildingSelect }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a building..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-transparent placeholder:text-muted-foreground text-foreground"
        />

        {searchTerm && filteredBuildings.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-primary/20 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredBuildings.map((building) => (
              <button
                key={building.id}
                onClick={() => onBuildingSelect(building)}
                className="w-full px-4 py-3 text-left hover:bg-primary/5 border-b border-primary/10 last:border-b-0 transition-colors"
              >
                <div className="font-medium text-foreground">{building.name}</div>
              </button>
            ))}
          </div>
        )}

        {searchTerm && filteredBuildings.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-primary/20 rounded-lg shadow-lg z-10 p-4">
            <div className="text-muted-foreground text-center">No buildings found matching "{searchTerm}"</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPanel