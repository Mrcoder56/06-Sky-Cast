import { useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ placeholder = 'Search for a city', onSearch }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
    setValue('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </form>
  )
}
