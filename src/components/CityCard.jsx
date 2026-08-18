import WeatherIcon from './WeatherIcon'
import { roundTemp } from '../utils/weatherHelpers'
import './CityCard.css'

export default function CityCard({ city, temp, time, condition, onClick, onRemove }) {
  return (
    <div className="city-card" onClick={onClick} role="button" tabIndex={0}>
      <WeatherIcon condition={condition} size={56} />
      <div className="city-card-info">
        <span className="city-card-name">{city}</span>
        <span className="city-card-time">{time}</span>
      </div>
      <span className="city-card-temp">{roundTemp(temp)}°</span>
      {onRemove && (
        <button
          className="city-card-remove"
          aria-label={`Remove ${city}`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
