import { useEffect, useState, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import { useUnits } from '../context/UnitsContext'
import WeatherHero from '../components/WeatherHero'
import TodayForecast from '../components/TodayForecast'
import AirConditions from '../components/AirConditions'
import WeeklyForecast from '../components/WeeklyForecast'
import {
  getCurrentWeatherByCity,
  getForecastByCity,
  WeatherApiError,
} from '../services/weatherApi'
import {
  groupForecastByDay,
  nextForecastSlots,
  roundTemp,
  simplifyCondition,
  formatWindSpeed,
} from '../utils/weatherHelpers'
import './Weather.css'

const DEFAULT_CITY = 'Mingora'

export default function Weather() {
  const { units } = useUnits()
  const [city, setCity] = useState("Mingora")
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('')

  const loadWeather = useCallback(async (cityName, unitsPref) => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeatherByCity(cityName, unitsPref),
        getForecastByCity(cityName, unitsPref),
      ])
      setCurrent(currentData)
      setForecast(forecastData)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof WeatherApiError ? err.message : 'Unable to fetch weather data.'
      )
    }
  }, [])

  useEffect(() => {
    loadWeather(city, units)
  }, [city, units, loadWeather])

  return (
    <div className="weather-page">
      <SearchBar placeholder="Search for a city" onSearch={setCity} />

      {status === 'loading' && <p className="state-message">Loading weather...</p>}

      {status === 'error' && (
        <p className="state-message state-message-error">{errorMessage}</p>
      )}

      {status === 'ready' && current && forecast && (
        <WeatherContent city={city} current={current} forecast={forecast} units={units} />
      )}
    </div>
  )
}

function WeatherContent({ city, current, forecast, units }) {
  const timezoneOffset = current.timezone ?? 0
  const condition = simplifyCondition(current.weather?.[0]?.main)
  const days = groupForecastByDay(forecast.list, timezoneOffset)
  const todaySlots = nextForecastSlots(forecast.list, 6).map((slot) => ({
    dt: slot.dt,
    temp: slot.main.temp,
    condition: simplifyCondition(slot.weather?.[0]?.main),
  }))
  const todayPop = Math.round((days[0]?.pop ?? 0) * 100)
  const wind = formatWindSpeed(current.wind?.speed ?? 0, units)

  return (
    <div className="weather-content">
      <section className="weather-main">
        <WeatherHero
          city={current.name || city}
          temp={roundTemp(current.main?.temp)}
          chanceOfRain={todayPop}
          condition={condition}
        />
        <TodayForecast slots={todaySlots} timezoneOffset={timezoneOffset} />
        <AirConditions
          realFeel={roundTemp(current.main?.feels_like)}
          wind={wind}
          windUnit={units === 'imperial' ? 'mph' : 'km/h'}
          chanceOfRain={todayPop}
          uvIndex={typeof current.uvi === 'number' ? Math.round(current.uvi) : 'N/A'}
        />
      </section>

      <aside className="weather-side">
        <WeeklyForecast days={days} timezoneOffset={timezoneOffset} title="5 Day Forecast" />
      </aside>
    </div>
  )
}
