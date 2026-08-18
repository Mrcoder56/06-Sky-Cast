import WeatherIcon from './WeatherIcon'
import './WeatherHero.css'

export default function WeatherHero({ city, temp, chanceOfRain, condition, compact = false }) {
  return (
    <div className={'weather-hero' + (compact ? ' weather-hero-compact' : '')}>
      <div className="weather-hero-info">
        <h1 className="weather-hero-city">{city}</h1>
        <p className="weather-hero-rain">Chances Of rain: {chanceOfRain}%</p>
        {!compact && <p className="weather-hero-temp">{temp}°</p>}
      </div>
      <WeatherIcon condition={condition} size={compact ? 92 : 150} />
      {compact && <p className="weather-hero-temp weather-hero-temp-compact">{temp}°</p>}
    </div>
  )
}
