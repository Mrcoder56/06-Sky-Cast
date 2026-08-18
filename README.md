# 🌤️ SkyCast

A weather dashboard built with React + Vite, recreated from the SkyCast UI screenshots and powered by live OpenWeatherMap data.

## Stack

- React 18 + React Router
- Vite
- Plain CSS (design tokens in `src/index.css`, per-component stylesheets)
- OpenWeatherMap `current weather` + `5 day / 3 hour forecast` REST endpoints

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

## API key

Copy `.env.example` to `.env` and add your OpenWeatherMap key:

```bash
cp .env.example .env
```

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

A working key is already placed in `.env` for local testing — swap it out before deploying or committing this anywhere public. `.env` is git-ignored.

## Pages

| Route        | Page      | What it shows |
|--------------|-----------|----------------|
| `/`          | Weather   | Search bar, current conditions hero, today's hourly forecast, air conditions, 5-day forecast |
| `/cities`    | Cities    | Saved city list (search to add, click a card to preview, × to remove) + a compact detail panel for the selected city |
| `/map`       | Map       | OpenWeatherMap tile overlay (temp / clouds / precipitation / wind), centered on the Swat region |
| `/settings`  | Settings  | °C/°F + wind unit toggle — applies app-wide immediately |

Saved cities and the units preference persist in `localStorage`.

## Notes on API limitations vs. the original mockups

- The screenshots show a "7 Day Forecast." OpenWeatherMap's **free** tier only exposes a 5‑day / 3‑hour forecast — the true daily 7‑day forecast lives behind their paid One Call 3.0 subscription. Rather than invent two extra days of fake data, SkyCast groups the real 3‑hour data into calendar days and labels the panel "5 Day Forecast."
- Likewise, **UV Index** isn't available on the free current-weather endpoint anymore. SkyCast displays `N/A` for it instead of a fabricated number. If you upgrade to a plan that includes One Call 3.0, wire `current.uvi` in `src/pages/Weather.jsx` up to that endpoint and it'll display automatically.
- Wind speed: OpenWeatherMap returns m/s for metric units, which SkyCast converts to km/h to match the design; imperial mode returns mph directly.

## Project structure

```text
src/
├── assets/
├── components/       # Sidebar, SearchBar, WeatherHero, TodayForecast,
│                      # AirConditions, WeeklyForecast, CityCard, WeatherIcon
├── context/
│   └── UnitsContext.jsx   # global metric/imperial preference
├── pages/
│   ├── Weather.jsx
│   ├── Cities.jsx
│   ├── Map.jsx
│   └── Settings.jsx
├── services/
│   └── weatherApi.js      # all OpenWeatherMap fetch calls
├── utils/
│   └── weatherHelpers.js  # day-grouping, formatting, condition mapping
├── App.jsx
├── main.jsx
└── index.css               # design tokens (colors, type, radius)
```

## Build

```bash
npm run build
npm run preview
```
