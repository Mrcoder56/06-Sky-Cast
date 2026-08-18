import { useEffect, useState, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import { useUnits } from '../context/UnitsContext'
import CityCard from '../components/CityCard'
import WeatherHero from '../components/WeatherHero'
import TodayForecast from '../components/TodayForecast'
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
  formatHour,
} from '../utils/weatherHelpers'
import './Cities.css'

const STORAGE_KEY = 'skycast:cities'
const DEFAULT_CITIES = ['Madrid', 'London', 'Tokyo', 'New York']

function loadSavedCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_CITIES
  } catch {
    return DEFAULT_CITIES
  }
}

export default function Cities() {
  const { units } = useUnits()
  const [cityNames, setCityNames] = useState(loadSavedCities)
  const [cityData, setCityData] = useState({}) // name -> { current, status }
  const [selected, setSelected] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [detailStatus, setDetailStatus] = useState('idle')
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cityNames))
  }, [cityNames])

  useEffect(() => {
    let cancelled = false
    cityNames.forEach((name) => {
      setCityData((prev) => ({
        ...prev,
        [name]: prev[name] ?? { status: 'loading' },
      }))
      getCurrentWeatherByCity(name, units)
        .then((data) => {
          if (cancelled) return
          setCityData((prev) => ({ ...prev, [name]: { status: 'ready', current: data } }))
        })
        .catch(() => {
          if (cancelled) return
          setCityData((prev) => ({ ...prev, [name]: { status: 'error' } }))
        })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityNames, units])

  const openDetail = useCallback(async (name) => {
    setSelected(name)
    setDetailStatus('loading')
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeatherByCity(name, units),
        getForecastByCity(name, units),
      ])
      setSelectedDetail({ current, forecast })
      setDetailStatus('ready')
    } catch (err) {
      setDetailStatus('error')
    }
  }, [units])

  useEffect(() => {
    if (cityNames.length && !selected) {
      openDetail(cityNames[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityNames])

  // Re-fetch the open detail panel whenever the units preference changes.
  useEffect(() => {
    if (selected) openDetail(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units])

  async function handleSearch(name) {
    setSearchError('')
    try {
      await getCurrentWeatherByCity(name, units)
      setCityNames((prev) => {
        const exists = prev.some((c) => c.toLowerCase() === name.toLowerCase())
        return exists ? prev : [...prev, name]
      })
    } catch (err) {
      setSearchError(err instanceof WeatherApiError ? err.message : 'City not found.')
    }
  }

  function handleRemove(name) {
    setCityNames((prev) => prev.filter((c) => c !== name))
    if (selected === name) {
      setSelected(null)
      setSelectedDetail(null)
    }
  }

  return (
    <div className="cities-page">
      <div className="cities-list-column">
        <SearchBar placeholder="Search for a city" onSearch={handleSearch} />
        {searchError && <p className="state-message state-message-error">{searchError}</p>}

        <div className="cities-list">
          {cityNames.map((name) => {
            const entry = cityData[name]
            if (!entry || entry.status === 'loading') {
              return (
                <div className="city-card city-card-loading" key={name}>
                  Loading {name}...
                </div>
              )
            }
            if (entry.status === 'error') {
              return (
                <div className="city-card city-card-loading" key={name}>
                  Couldn't load {name}
                </div>
              )
            }
            const { current } = entry
            const condition = simplifyCondition(current.weather?.[0]?.main)
            const time = formatHour(
              Math.floor(Date.now() / 1000),
              current.timezone ?? 0
            )
            return (
              <CityCard
                key={name}
                city={current.name || name}
                temp={current.main?.temp}
                time={time}
                condition={condition}
                onClick={() => openDetail(name)}
                onRemove={() => handleRemove(name)}
              />
            )
          })}
        </div>
      </div>

      <aside className="cities-detail-column">
        {detailStatus === 'loading' && <p className="state-message">Loading weather...</p>}
        {detailStatus === 'error' && (
          <p className="state-message state-message-error">Unable to fetch weather data.</p>
        )}
        {detailStatus === 'ready' && selectedDetail && (
          <CityDetail name={selected} data={selectedDetail} />
        )}
      </aside>
    </div>
  )
}

function CityDetail({ name, data }) {
  const { current, forecast } = data
  const timezoneOffset = current.timezone ?? 0
  const condition = simplifyCondition(current.weather?.[0]?.main)
  const days = groupForecastByDay(forecast.list, timezoneOffset)
  const todaySlots = nextForecastSlots(forecast.list, 3).map((slot) => ({
    dt: slot.dt,
    temp: slot.main.temp,
    condition: simplifyCondition(slot.weather?.[0]?.main),
  }))
  const todayPop = Math.round((days[0]?.pop ?? 0) * 100)

  return (
    <div className="cities-detail">
      <WeatherHero
        city={current.name || name}
        temp={roundTemp(current.main?.temp)}
        chanceOfRain={todayPop}
        condition={condition}
        compact
      />
      <TodayForecast slots={todaySlots} timezoneOffset={timezoneOffset} />
      <WeeklyForecast days={days.slice(0, 5)} timezoneOffset={timezoneOffset} title="5 Day Forecast" />
    </div>
  )
}
