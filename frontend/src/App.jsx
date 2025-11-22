import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import MapPage from './pages/MapPage'
import VirtualTour from './components/VirtualTour'


// Helper component to load the building from storage for the Tour
const VirtualTourWrapper = () => {
  const savedBuilding = localStorage.getItem('selectedBuilding');
  const location = savedBuilding ? JSON.parse(savedBuilding) : null;
  return <VirtualTour location={location} />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container" style={{ height: '100vh', width: '100vw' }}>
        <Routes>
          {/* 1. Home Page (Landing) */}
          <Route path="/home" element={<Home />} />

          {/* 2. Default Redirect to Home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* 3. Map Application */}
          <Route path="/map" element={<MapPage />} />

          {/* 4. Authentication */}
          <Route path="/auth" element={<Auth />} />

          {/* 5. Virtual Tour */}
          <Route path="/tour" element={<VirtualTourWrapper />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App