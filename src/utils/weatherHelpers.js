// SkyCast — helpers for shaping raw OpenWeatherMap data into UI-ready values.

/**
 * Maps an OpenWeatherMap "main" condition to a simplified SkyCast condition
 * used to pick an icon and a short label (matches the Sunny / Cloudy / Rainy
 * vocabulary used across the SkyCast UI).
 */
export function simplifyCondition(owmMain = '') {
  const key = owmMain.toLowerCase()
  if (key === 'clear') return 'sunny'
  if (key === 'clouds') return 'cloudy'
  if (['rain', 'drizzle'].includes(key)) return 'rainy'
  if (key === 'thunderstorm') return 'stormy'
  if (key === 'snow') return 'snowy'
  if (['mist', 'fog', 'haze', 'smoke', 'dust', 'sand'].includes(key)) return 'hazy'
  return 'cloudy'
}

export function conditionLabel(simplified) {
  const labels = {
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    stormy: 'Stormy',
    snowy: 'Snowy',
    hazy: 'Hazy',
  }
  return labels[simplified] || 'Cloudy'
}

/**
 * OpenWeatherMap returns wind speed in m/s for metric units and mph for
 * imperial units. Convert to km/h for metric so it matches the SkyCast
 * design; imperial is already in the right unit.
 */
export function formatWindSpeed(speedMs, units) {
  if (units === 'imperial') return Math.round(speedMs * 10) / 10
  return Math.round(speedMs * 3.6 * 10) / 10
}

export function roundTemp(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '--'
  return Math.round(value)
}

export function formatHour(unixSeconds, timezoneOffsetSeconds = 0) {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
  let hours = date.getUTCHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours}:00 ${ampm}`
}

export function dayLabel(unixSeconds, timezoneOffsetSeconds = 0, isToday = false) {
  if (isToday) return 'Today'
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getUTCDay()]
}

/**
 * Groups the 3-hour-step /forecast list into calendar days (using the
 * city's own timezone offset), and reduces each day down to:
 *  - min / max temperature
 *  - a representative condition (the entry closest to midday, since that's
 *    the most visually representative slot for a daily icon)
 *  - the max "probability of precipitation" seen that day
 *
 * Returns an array ordered by date, today first.
 */
export function groupForecastByDay(list = [], timezoneOffsetSeconds = 0) {
  const byDate = new Map()

  list.forEach((entry) => {
    const localDate = new Date((entry.dt + timezoneOffsetSeconds) * 1000)
    const dateKey = localDate.toISOString().slice(0, 10)
    if (!byDate.has(dateKey)) byDate.set(dateKey, [])
    byDate.get(dateKey).push(entry)
  })

  const todayKey = new Date((list[0]?.dt + timezoneOffsetSeconds) * 1000)
    .toISOString()
    .slice(0, 10)

  return Array.from(byDate.entries()).map(([dateKey, entries], index) => {
    const temps = entries.map((e) => e.main.temp)
    const min = Math.min(...entries.map((e) => e.main.temp_min))
    const max = Math.max(...entries.map((e) => e.main.temp_max))

    // Pick the entry closest to 12:00 local time as the "representative" slot
    const midday = entries.reduce((closest, entry) => {
      const hour = new Date((entry.dt + timezoneOffsetSeconds) * 1000).getUTCHours()
      const closestHour = new Date((closest.dt + timezoneOffsetSeconds) * 1000).getUTCHours()
      return Math.abs(hour - 12) < Math.abs(closestHour - 12) ? entry : closest
    }, entries[0])

    const pop = Math.max(...entries.map((e) => e.pop ?? 0))

    return {
      dateKey,
      dt: midday.dt,
      isToday: dateKey === todayKey,
      minTemp: min,
      maxTemp: max,
      condition: simplifyCondition(midday.weather?.[0]?.main),
      icon: midday.weather?.[0]?.icon,
      pop,
      hourly: entries,
    }
  })
}

/**
 * Returns the next N raw 3-hour forecast entries starting from "now",
 * used for the "Today's forecast" hourly strip.
 */
export function nextForecastSlots(list = [], count = 5) {
  return list.slice(0, count)
}
