import { useUnits } from '../context/UnitsContext'
import './Pages.css'

export default function Settings() {
  const { units, setUnits } = useUnits()

  return (
    <div className="static-page">
      <h2 className="static-page-title">Settings</h2>
      <p className="static-page-subtitle">Preferences for how SkyCast displays data.</p>

      <div className="card settings-card">
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Units</p>
            <p className="settings-row-subtitle">Temperature and wind speed units</p>
          </div>
          <div className="settings-toggle">
            <button
              className={units === 'metric' ? 'settings-toggle-active' : ''}
              onClick={() => setUnits('metric')}
            >
              °C
            </button>
            <button
              className={units === 'imperial' ? 'settings-toggle-active' : ''}
              onClick={() => setUnits('imperial')}
            >
              °F
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <p className="settings-row-title">API Key</p>
            <p className="settings-row-subtitle">
              Configured via <code>VITE_WEATHER_API_KEY</code> in your <code>.env</code> file.
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <p className="settings-row-title">About</p>
            <p className="settings-row-subtitle">SkyCast v1.0 — powered by OpenWeatherMap</p>
          </div>
        </div>
      </div>
    </div>
  )
}
