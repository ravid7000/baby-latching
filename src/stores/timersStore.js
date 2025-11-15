import { nowTs } from "../utils/formatTime.js";
import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";
import { logEvent } from "./logsStore.js";
import { useSettingsStore } from "./settingsStore.js";

const cloneTimerState = (source) => ({
  isRunning: source.isRunning,
  elapsedMs: source.elapsedMs,
});

const cloneTimers = (timers) => ({
  left: cloneTimerState(timers.left),
  right: cloneTimerState(timers.right),
  overall: cloneTimerState(timers.overall),
});

const buildInitialTimers = () => cloneTimers(INITIAL_STATE.timers);

// Ticker interval ID (not persisted, managed in memory)
let tickIntervalId = null;
let lastTickTime = null;

// Wake lock instance (not persisted, managed in memory)
let wakeLock = null;
let getTimersState = null; // Will be set after store is created

const requestWakeLock = async () => {
  // Check if wake lock is enabled in settings
  const settings = useSettingsStore.getState();
  if (!settings.keepScreenOn) {
    return;
  }

  // Check if API is available
  if (!navigator.wakeLock) {
    return;
  }

  // If already have a wake lock, don't request again
  if (wakeLock) {
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    
    // Set up listener to re-request if wake lock is released while timers are running
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
      // Re-request if timers are still running
      if (getTimersState) {
        const timersState = getTimersState();
        const hasRunning = timersState.timers.left.isRunning || 
                          timersState.timers.right.isRunning || 
                          timersState.timers.overall.isRunning;
        if (hasRunning) {
          requestWakeLock();
        }
      }
    });
  } catch (err) {
    // Handle errors gracefully (e.g., permission denied, not supported)
    console.warn('Failed to request wake lock:', err);
    wakeLock = null;
  }
};

const releaseWakeLock = async () => {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
    } catch (err) {
      console.warn('Failed to release wake lock:', err);
      wakeLock = null;
    }
  }
};

const startTicker = (set) => {
  if (tickIntervalId !== null) return;
  
  lastTickTime = nowTs();
  requestWakeLock();
  
  tickIntervalId = setInterval(() => {
    const now = nowTs();
    const delta = now - lastTickTime;
    lastTickTime = now;

    set((state) => {
      const nextTimers = cloneTimers(state.timers);
      let hasRunning = false;

      // Update elapsed time for all running timers
      if (nextTimers.left.isRunning) {
        nextTimers.left.elapsedMs = (nextTimers.left.elapsedMs || 0) + delta;
        hasRunning = true;
      }
      if (nextTimers.right.isRunning) {
        nextTimers.right.elapsedMs = (nextTimers.right.elapsedMs || 0) + delta;
        hasRunning = true;
      }
      if (nextTimers.overall.isRunning) {
        nextTimers.overall.elapsedMs = (nextTimers.overall.elapsedMs || 0) + delta;
        hasRunning = true;
      }

      // Stop ticker if no timers are running
      if (!hasRunning) {
        stopTicker();
      }

      return { timers: nextTimers };
    });
  }, 1000); // Update every 500ms for smooth display
};

const stopTicker = () => {
  if (tickIntervalId !== null) {
    clearInterval(tickIntervalId);
    tickIntervalId = null;
    lastTickTime = null;
  }
  releaseWakeLock();
};

const ensureTickerRunning = (set, timers) => {
  const hasRunning = timers.left.isRunning || timers.right.isRunning || timers.overall.isRunning;
  if (hasRunning) {
    startTicker(set);
  } else {
    stopTicker();
  }
};

export const useTimersStore = createAppStore("timers", (set, get) => {
  // Set up reference to get state for wake lock re-request
  getTimersState = get;
  
  return {
    timers: buildInitialTimers(),
    // Initialize ticker if any timers are running (e.g., after hydration from persistence)
    initTicker: () => {
      const state = get();
      ensureTickerRunning(set, state.timers);
      // Restore wake lock if timers were running
      const hasRunning = state.timers.left.isRunning || 
                        state.timers.right.isRunning || 
                        state.timers.overall.isRunning;
      if (hasRunning) {
        requestWakeLock();
      }
    },
  toggleTimer: (which) => {
    const wasRunning = get().timers[which].isRunning;

    set((state) => {
      const nextTimers = cloneTimers(state.timers);
      const timer = nextTimers[which];
      const isRunning = !timer.isRunning;
      
      // Toggle the timer state
      timer.isRunning = isRunning;
      // Ensure elapsedMs is initialized
      if (timer.elapsedMs === undefined || timer.elapsedMs === null) {
        timer.elapsedMs = 0;
      }

      // Handle left/right mutual exclusivity and overall sync
      if (which === "left" && isRunning) {
        // Stop right timer
        nextTimers.right.isRunning = false;
        nextTimers.right.elapsedMs = nextTimers.right.elapsedMs || 0;
        // Start overall if not running
        if (!nextTimers.overall.isRunning) {
          nextTimers.overall.isRunning = true;
          nextTimers.overall.elapsedMs = nextTimers.overall.elapsedMs || 0;
        }
      }
      if (which === "right" && isRunning) {
        // Stop left timer
        nextTimers.left.isRunning = false;
        nextTimers.left.elapsedMs = nextTimers.left.elapsedMs || 0;
        // Start overall if not running
        if (!nextTimers.overall.isRunning) {
          nextTimers.overall.isRunning = true;
          nextTimers.overall.elapsedMs = nextTimers.overall.elapsedMs || 0;
        }
      }
      if (which === "overall" && !isRunning) {
        // Stop left and right timers (pause, don't reset)
        nextTimers.left.isRunning = false;
        nextTimers.left.elapsedMs = nextTimers.left.elapsedMs || 0;
        nextTimers.right.isRunning = false;
        nextTimers.right.elapsedMs = nextTimers.right.elapsedMs || 0;
      }

      // Stop overall timer if both left and right timers are stopped
      if ((which === "left" || which === "right") && !nextTimers.left.isRunning && !nextTimers.right.isRunning) {
        nextTimers.overall.isRunning = false;
        nextTimers.overall.elapsedMs = nextTimers.overall.elapsedMs || 0;
      }

      // Ensure ticker is running if any timer is active
      ensureTickerRunning(set, nextTimers);

      return { timers: nextTimers };
    });

    logEvent(!wasRunning ? "timer_start" : "timer_stop", { which });
  },
  resetTimer: (which) => {
    set((state) => {
      const nextTimers = cloneTimers(state.timers);
      nextTimers[which] = cloneTimerState(INITIAL_STATE.timers[which]);
      if (which === "overall") {
        nextTimers.left.isRunning = false;
        nextTimers.left.elapsedMs = nextTimers.left.elapsedMs || 0;
        nextTimers.right.isRunning = false;
        nextTimers.right.elapsedMs = nextTimers.right.elapsedMs || 0;
      }

      // Stop overall timer if both left and right timers are stopped
      if ((which === "left" || which === "right") && !nextTimers.left.isRunning && !nextTimers.right.isRunning) {
        nextTimers.overall.isRunning = false;
        nextTimers.overall.elapsedMs = nextTimers.overall.elapsedMs || 0;
      }
      
      // Ensure ticker state matches timer states
      ensureTickerRunning(set, nextTimers);
      
      return { timers: nextTimers };
    });
    logEvent("timer_reset", { which });
  },
  resetAllTimers: () => {
    set({ timers: buildInitialTimers() });
    stopTicker();
  },
  };
});

