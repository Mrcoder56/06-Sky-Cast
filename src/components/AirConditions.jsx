import './AirConditions.css'

export default function AirConditions({ realFeel, wind, windUnit = 'km/h', chanceOfRain, uvIndex }) {
  const items = [
    { icon: '🌡️', label: 'Real Feel', value: `${realFeel}°` },
    { icon: '💨', label: 'Wind', value: `${wind} ${windUnit}` },
    { icon: '💧', label: 'Chances Of Rain', value: `${chanceOfRain}%` },
    { icon: '☀️', label: 'UV Index', value: uvIndex },
  ]

  return (
    <div className="air-conditions card">
      <h3 className="card-title">Air Conditions</h3>
      <div className="air-conditions-grid">
        {items.map((item) => (
          <div className="air-conditions-item" key={item.label}>
            <span className="air-conditions-label">
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </span>
            <span className="air-conditions-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
