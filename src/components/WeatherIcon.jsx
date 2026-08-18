import './WeatherIcon.css'

const EMOJI = {
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '🌨️',
  hazy: '🌫️',
}

/**
 * Renders the SkyCast weather glyph for a simplified condition
 * ('sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'hazy').
 * Sunny is drawn as the signature gradient orb from the design; everything
 * else uses a matching weather emoji, sized to the same box.
 */
export default function WeatherIcon({ condition = 'sunny', size = 48 }) {
  if (condition === 'sunny') {
    return (
      <div
        className="weather-icon-sun"
        style={{ width: size, height: size }}
        role="img"
        aria-label="Sunny"
      />
    )
  }

  return (
    <span
      className="weather-icon-emoji"
      style={{ fontSize: size * 0.82, width: size, height: size }}
      role="img"
      aria-label={condition}
    >
      {EMOJI[condition] || EMOJI.cloudy}
    </span>
  )
}
