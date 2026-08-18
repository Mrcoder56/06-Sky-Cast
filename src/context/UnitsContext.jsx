import { createContext, useContext, useEffect, useState } from 'react'

const UNITS_KEY = 'skycast:units'
const UnitsContext = createContext(null)

export function UnitsProvider({ children }) {
  const [units, setUnits] = useState(() => localStorage.getItem(UNITS_KEY) || 'metric')

  useEffect(() => {
    localStorage.setItem(UNITS_KEY, units)
  }, [units])

  const windLabel = units === 'imperial' ? 'mph' : 'km/h'

  return (
    <UnitsContext.Provider value={{ units, setUnits, windLabel }}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const ctx = useContext(UnitsContext)
  if (!ctx) throw new Error('useUnits must be used within a UnitsProvider')
  return ctx
}
