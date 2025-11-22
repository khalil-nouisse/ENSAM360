import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function ExploreButton({ selectedBuilding, is3DMode, setIs3DMode }) {
  const navigate = useNavigate()

  if (!selectedBuilding) {
    return null
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={() => navigate('/tour')}
        size="lg"
        className="w-full text-lg font-semibold shadow-md"
      >
        Explore
      </Button>
    </div>
  )
}

export default ExploreButton