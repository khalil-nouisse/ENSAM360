import SearchPanel from './SearchPanel'
import BuildingImage from './BuildingImage'
import ExploreButton from './ExploreButton'

function InteractionPanel({ 
  searchTerm, 
  setSearchTerm, 
  filteredBuildings, 
  onBuildingSelect, 
  selectedBuilding, 
  is3DMode, 
  setIs3DMode,
}) {
  return (
    <div 
      className="rounded-2xl shadow-lg p-6 border border-darkblue/10 flex flex-col h-full"
      style={{ backgroundColor: '#213985' }}
    >
      {/* Search Section */}
      <SearchPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredBuildings={filteredBuildings}
        onBuildingSelect={onBuildingSelect}
      />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto mb-4">
        <BuildingImage selectedBuilding={selectedBuilding} />
      </div>

      {/* Fixed Explore Button at bottom */}
      <div className="mt-auto">
        <ExploreButton
          selectedBuilding={selectedBuilding}
          is3DMode={is3DMode}
          setIs3DMode={setIs3DMode}
        />
      </div>
    </div>
  )
}

export default InteractionPanel