function ExploreButton({ selectedBuilding, is3DMode, setIs3DMode }) {
  if (!selectedBuilding) {
    return null
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          console.log(`3D Scene mode activated for ${selectedBuilding.name}`)
        }}
        className="bg-darkblue hover:bg-darkblue/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-darkblue/30"
        style={{ backgroundColor: '#213985' }}
      >
        Explore 3D Scene
      </button>
    </div>
  )
}
export default ExploreButton