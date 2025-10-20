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
  setIs3DMode 
}) {
  return (
    <div 
      className="rounded-lg shadow-lg p-6 border border-darkblue/10 flex flex-col h-full"
      style={{ backgroundColor: '#213985' }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Building Details</h2>
      
      {/* Search Section */}
      <SearchPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredBuildings={filteredBuildings}
        onBuildingSelect={onBuildingSelect}
      />

      {/* Building Image and Details Section */}
      <BuildingImage selectedBuilding={selectedBuilding} />

      {/* Explore Button Section - Only shows when building is selected */}
      <ExploreButton
        selectedBuilding={selectedBuilding}
        is3DMode={is3DMode}
        setIs3DMode={setIs3DMode}
      />
    </div>
  )
}

export default InteractionPanel