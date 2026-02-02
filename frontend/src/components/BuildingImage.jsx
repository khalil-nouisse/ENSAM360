function BuildingImage({ selectedBuilding }) {
  if (!selectedBuilding) {
    return null
  }
  console.log(selectedBuilding.pano_image)
  const correctImagepath = selectedBuilding.pano_image.startsWith('http')
    ? selectedBuilding.pano_image
    : selectedBuilding.pano_image.replace("src/assets/image", "/images")
  console.log(correctImagepath)
  return (
    <div>
      <div className="mb-4" style={{ backgroundColor: 'white' }}>
        <img
          src={correctImagepath}
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