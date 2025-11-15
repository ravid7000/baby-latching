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
    const timers = useTimersStore.getState().timers;
    const leftDurationMs = timers.left.elapsedMs ?? 0;
    const rightDurationMs = timers.right.elapsedMs ?? 0;
    const overallDurationMs = timers.overall.elapsedMs ?? 0;

    const snapshot = {
      mlPerFeed: quantity.mlPerFeed,
      weightKg: quantity.weightKg,
      frequencyPerDay: quantity.frequencyPerDay,
      feedCount: get().feedCount,
      durationMs: overallDurationMs,
      leftDurationMs,
      rightDurationMs,
    };

    logEvent("cycle_complete", snapshot);
    useTimersStore.getState().resetAllTimers();
  },
}));

