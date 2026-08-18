// SkyCast — OpenWeatherMap API service
// Docs: https://openweathermap.org/current | https://openweathermap.org/forecast5

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

class WeatherApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'WeatherApiError'
    this.status = status
  }
}

async function request(url) {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) {
      throw new WeatherApiError('City not found.', 404)
    }
    throw new WeatherApiError('Unable to fetch weather data.', res.status)
  }
  return res.json()
}

/**
 * Current weather for a city name.
 * GET /weather?q={city}&appid={key}&units=metric
 */
export function getCurrentWeatherByCity(city, units = 'metric') {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
  return request(url)
}

/**
 * Current weather for coordinates.
 * GET /weather?lat={lat}&lon={lon}&appid={key}&units=metric
 */
export function getCurrentWeatherByCoords(lat, lon, units = 'metric') {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  return request(url)
}

/**
 * 5 day / 3 hour forecast for a city name.
 * GET /forecast?q={city}&appid={key}&units=metric
 * This is the widest-coverage free forecast endpoint; the One Call API's
 * true 7-day daily forecast requires a paid subscription tier, so SkyCast
 * derives its multi-day forecast from this 3-hour-step data instead of
 * guessing values for days the API doesn't provide.
 */
export function getForecastByCity(city, units = 'metric') {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
  return request(url)
}

export function getForecastByCoords(lat, lon, units = 'metric') {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  return request(url)
}

export { WeatherApiError }
