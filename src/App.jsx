import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Weather from './pages/Weather'
import Cities from './pages/Cities'
import Map from './pages/Map'
import Settings from './pages/Settings'
import { UnitsProvider } from './context/UnitsContext'
import './App.css'

export default function App() {
  return (
    <UnitsProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Weather />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/map" element={<Map />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Weather />} />
          </Routes>
        </main>
      </div>
    </UnitsProvider>
  )
}
