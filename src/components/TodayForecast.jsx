import WeatherIcon from './WeatherIcon'
import { formatHour, roundTemp } from '../utils/weatherHelpers'
import './TodayForecast.css'

export default function TodayForecast({ slots = [], timezoneOffset = 0 }) {
  return (
    <div className="today-forecast card">
      <h3 className="card-title">Today's Forecast</h3>
      <div className="today-forecast-row">
        {slots.map((slot) => (
          <div className="today-forecast-slot" key={slot.dt}>
            <span className="today-forecast-time">
              {formatHour(slot.dt, timezoneOffset)}
            </span>
            <WeatherIcon condition={slot.condition} size={34} />
            <span className="today-forecast-temp">{roundTemp(slot.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
