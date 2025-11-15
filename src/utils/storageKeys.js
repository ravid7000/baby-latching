export const INITIAL_STATE = {
  timers: {
    left: { isRunning: false, elapsedMs: 0, startedAt: null },
    right: { isRunning: false, elapsedMs: 0, startedAt: null },
    overall: { isRunning: false, elapsedMs: 0, startedAt: null },
  },
  quantity: {
    weightKg: 3.5,
    frequencyPerDay: 8,
    mlPerFeed: 65,
    isManual: false,
    factor: 150,
    unit: 'ml',
  },
  cycle: { feedCount: 0 },
  logs: [],
  settings: {
    keepScreenOn: true,
  },
};

