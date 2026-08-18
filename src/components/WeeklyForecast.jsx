import WeatherIcon from './WeatherIcon'
import { conditionLabel, dayLabel, roundTemp } from '../utils/weatherHelpers'
import './WeeklyForecast.css'

export default function WeeklyForecast({ days = [], timezoneOffset = 0, title = '5 Day Forecast' }) {
  return (
    <div className="weekly-forecast card">
      <h3 className="card-title">{title}</h3>
      <div className="weekly-forecast-list">
        {days.map((day) => (
          <div className="weekly-forecast-row" key={day.dateKey}>
            <span className="weekly-forecast-day">
              {dayLabel(day.dt, timezoneOffset, day.isToday)}
            </span>
            <span className="weekly-forecast-condition">
              <WeatherIcon condition={day.condition} size={26} />
              {conditionLabel(day.condition)}
            </span>
            <span className="weekly-forecast-temp">
              {roundTemp(day.maxTemp)}/{roundTemp(day.minTemp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
