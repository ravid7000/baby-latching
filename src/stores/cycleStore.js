import { nowTs } from "../utils/formatTime.js";
import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";
import { logEvent } from "./logsStore.js";
import { useTimersStore } from "./timersStore.js";
import { useQuantityStore } from "./quantityStore.js";

export const useCycleStore = createAppStore("cycle", (set, get) => ({
  feedCount: INITIAL_STATE.cycle.feedCount,
  incrementFeedCount: () =>
    set((state) => ({ feedCount: state.feedCount + 1 })),
  resetFeedCount: () => set({ feedCount: 0 }),
  completeCycle: () => {
    const quantity = useQuantityStore.getState();
    const timersState = useTimersStore.getState();
    const overall = timersState.timers.overall;
    const durationMs =
      overall.isRunning && overall.startedAt
        ? nowTs() - overall.startedAt
        : overall.elapsedMs;

    const snapshot = {
      mlPerFeed: quantity.mlPerFeed,
      weightKg: quantity.weightKg,
      frequencyPerDay: quantity.frequencyPerDay,
      feedCount: get().feedCount,
      durationMs,
    };

    logEvent("cycle_complete", snapshot);
    useTimersStore.getState().resetAllTimers();
    set({ feedCount: 0 });
  },
}));

