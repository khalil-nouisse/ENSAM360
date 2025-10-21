import { useNavigate } from 'react-router-dom'

function ExploreButton({ selectedBuilding, is3DMode, setIs3DMode }) {
  const navigate = useNavigate()

  if (!selectedBuilding) {
    return null
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate('/tour')}
        className="bg-darkblue hover:bg-darkblue/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-darkblue/30"
        style={{ backgroundColor: 'white', color: '#151A28' }}
      >
        Explore
      </button>
    </div>
  )
}

export default ExploreButton