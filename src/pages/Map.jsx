import { useState } from 'react'
import './Pages.css'

const OWM_TILE_LAYERS = {
  temp: 'temp_new',
  clouds: 'clouds_new',
  precipitation: 'precipitation_new',
  wind: 'wind_new',
}

// A single representative tile centered roughly over Swat, Pakistan at zoom 6.
const TILE = { z: 6, x: 47, y: 29 }

export default function MapPage() {
  const [layer, setLayer] = useState('temp')
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const tileUrl = `https://tile.openweathermap.org/map/${OWM_TILE_LAYERS[layer]}/${TILE.z}/${TILE.x}/${TILE.y}.png?appid=${apiKey}`

  return (
    <div className="static-page">
      <h2 className="static-page-title">Weather Map</h2>
      <p className="static-page-subtitle">
        Live OpenWeatherMap tile overlays for the Swat region. Switch layers to see
        temperature, clouds, precipitation, or wind.
      </p>

      <div className="map-layer-tabs">
        {Object.keys(OWM_TILE_LAYERS).map((key) => (
          <button
            key={key}
            className={'map-layer-tab' + (layer === key ? ' map-layer-tab-active' : '')}
            onClick={() => setLayer(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="card map-frame">
        <img className="map-tile" src={tileUrl} alt={`${layer} map overlay`} />
        <p className="map-frame-note">
          This is a single OpenWeatherMap tile ({layer} layer). Drop this tile URL
          pattern into a library like Leaflet or Mapbox GL for a full pan/zoom map.
        </p>
      </div>
    </div>
  )
}
