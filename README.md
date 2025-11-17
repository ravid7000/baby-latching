# Baby Latching

A Progressive Web App (PWA) for tracking baby feeding timers and cycles. Built with React and Vite, designed to help parents monitor feeding sessions with separate timers for left and right sides, along with overall feeding duration.

## Features

- **Timer Tracking**
  - Separate timers for left and right sides
  - Overall feeding duration timer
  - Start, pause, and reset functionality
  - Automatic synchronization between side and overall timers

- **Quantity Management**
  - Track milk quantity per feed (ml or oz)
  - Automatic calculation based on baby weight and feeding frequency
  - Manual quantity override option
  - Unit conversion (ml ↔ oz)

- **Cycle Tracking**
  - Track feed count per cycle
  - Complete cycle with automatic logging
  - Cycle summary with duration and quantity

- **Activity Logs**
  - Comprehensive activity log with timestamps
  - Filter by all activities or completed cycles only
  - Detailed cycle information including:
    - Left, right, and total duration
    - Quantity fed
    - Feed count with ordinal suffixes (1st, 2nd, 3rd, etc.)
    - Relative time display (e.g., "20 min ago")
  - Auto-refresh on window focus

- **Progressive Web App (PWA)**
  - Installable on mobile and desktop
  - Offline support with service worker
  - App-like experience

- **Settings**
  - Keep screen on while timers are running (Wake Lock API)
  - Persistent state across sessions

- **User Experience**
  - Dark theme optimized for low-light feeding sessions
  - Responsive design for mobile and desktop
  - Clean, intuitive interface

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **PWA** - Service worker and manifest

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ravid7000/baby-latching.git
cd baby-latching
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Start a Feeding Session**
   - Tap/click the left or right timer to start
   - The overall timer starts automatically
   - Only one side timer can run at a time

2. **Track Quantity**
   - View or edit quantity settings in the Quantity tile
   - Choose between automatic calculation or manual entry
   - Switch between ml and oz units

3. **Complete a Cycle**
   - Increment feed count as needed
   - Click "Complete Cycle" to log the session
   - All timers reset automatically

4. **View Activity Logs**
   - Scroll through all activities
   - Filter to see only completed cycles
   - View detailed information for each cycle

5. **Settings**
   - Click the settings icon in the header
   - Enable/disable screen wake lock
   - Access help and feedback links

## Project Structure

```
baby-latching/
├── src/
│   ├── components/       # React components
│   │   ├── HelpModal.jsx
│   │   ├── LogList.jsx
│   │   ├── QuantityTile.jsx
│   │   ├── SummaryTile.jsx
│   │   ├── TimerTile.jsx
│   │   └── Tile.jsx
│   ├── stores/          # Zustand state stores
│   │   ├── basePersist.js
│   │   ├── cycleStore.js
│   │   ├── logsStore.js
│   │   ├── quantityStore.js
│   │   ├── settingsStore.js
│   │   └── timersStore.js
│   ├── utils/           # Utility functions
│   │   ├── formatTime.js
│   │   ├── storageKeys.js
│   │   └── unitConversion.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/              # Static assets
│   ├── favicon/
│   ├── manifest.json
│   └── sw.js
├── index.html
└── package.json
```

## Development

### Linting

```bash
npm run lint
```

### State Management

The app uses Zustand for state management with automatic persistence to localStorage. Each store handles a specific domain:
- `timersStore` - Timer state and ticker logic
- `quantityStore` - Quantity settings and calculations
- `cycleStore` - Feed count and cycle completion
- `logsStore` - Activity logs and filters
- `settingsStore` - App settings

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Android)
- PWA features require HTTPS (or localhost for development)

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub or use the feedback form in the app settings.

## License

This project is open source and available under the [MIT License](LICENSE).
