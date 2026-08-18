import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', label: 'Weather', icon: '☁️' },
  { to: '/cities', label: 'Cities', icon: '🏙️' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" aria-label="SkyCast">
        ☂️
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
