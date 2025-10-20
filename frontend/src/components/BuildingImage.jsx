function BuildingImage({ selectedBuilding }) {
  if (!selectedBuilding) {
    return null
  }

  return (
    <div>
      <div className="mb-4" style={{ backgroundColor: 'white' }}>
        <img
          src={selectedBuilding.image_url}
          alt={selectedBuilding.name}
          className="w-full h-48 object-cover rounded-lg shadow-sm border border-beige"
        />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{selectedBuilding.name}</h3>
      <p className="text-white/80 leading-relaxed mb-6">{selectedBuilding.description}</p>
    </div>
  )
}

export default BuildingImage