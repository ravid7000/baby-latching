import { nowTs } from "../utils/formatTime.js";
import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";
import { logEvent } from "./logsStore.js";

const cloneTimerState = (source) => ({
  isRunning: source.isRunning,
  elapsedMs: source.elapsedMs,
  startedAt: source.startedAt,
});

const cloneTimers = (timers) => ({
  left: cloneTimerState(timers.left),
  right: cloneTimerState(timers.right),
  overall: cloneTimerState(timers.overall),
});

const buildInitialTimers = () => cloneTimers(INITIAL_STATE.timers);

export const useTimersStore = createAppStore("timers", (set, get) => ({
  timers: buildInitialTimers(),
  toggleTimer: (which) => {
    const now = nowTs();
    const wasRunning = get().timers[which].isRunning;

    set((state) => {
      const nextTimers = cloneTimers(state.timers);
      console.log({nextTimers})
      const timer = nextTimers[which];
      const isRunning = !timer.isRunning;
      if (isRunning) {
        timer.isRunning = true;
        timer.startedAt = timer.startedAt ?? now;
      } else {
        if (timer.startedAt) {
          timer.elapsedMs = now - timer.startedAt;
        }
        timer.isRunning = false;
      }

      if (which === "left" && isRunning) {
        nextTimers.right.isRunning = false;
        if (!nextTimers.overall.isRunning) {
          nextTimers.overall.isRunning = true;
          nextTimers.overall.startedAt = nextTimers.overall.startedAt ?? now;
        }
      }
      if (which === "right" && isRunning) {
        nextTimers.left.isRunning = false;
        if (!nextTimers.overall.isRunning) {
          nextTimers.overall.isRunning = true;
          nextTimers.overall.startedAt = nextTimers.overall.startedAt ?? now;
        }
      }
      if (which === "overall" && !isRunning) {
        nextTimers.left.isRunning = false;
        nextTimers.right.isRunning = false;
      }

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
        nextTimers.right.isRunning = false;
      }
      return { timers: nextTimers };
    });
    logEvent("timer_reset", { which });
  },
  resetAllTimers: () => {
    set({ timers: buildInitialTimers() });
  },
}));

