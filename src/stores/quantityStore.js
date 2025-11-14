import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";
import { logEvent } from "./logsStore.js";

const buildInitialQuantity = () => ({ ...INITIAL_STATE.quantity });

const calculateAutoMl = (weightKg, factor, frequencyPerDay) =>
  Math.round((weightKg * factor) / Math.max(1, frequencyPerDay));

export const useQuantityStore = createAppStore("quantity", (set) => ({
...buildInitialQuantity(),
  setQuantity: (updates = {}) => {
    let nextState;
    set((state) => {
      nextState = { ...state, ...updates };
      if (!nextState.isManual) {
        nextState.mlPerFeed = calculateAutoMl(
          nextState.weightKg,
          nextState.factor,
          nextState.frequencyPerDay
        );
      }
      return nextState;
    });
    logEvent("quantity_change", { quantity: nextState });
  },
  setManualQuantity: (ml) => {
    const parsed = Math.max(0, Math.round(ml ?? 0));
    let nextState;
    set((state) => {
      nextState = {
        ...state,
        mlPerFeed: parsed,
        isManual: true,
      };
      return nextState;
    });
    logEvent("quantity_change", { quantity: nextState });
  },
  setFactor: (factor) => {
    const safeFactor = Number.isFinite(factor) ? factor : INITIAL_STATE.quantity.factor;
    let nextState;
    set((state) => {
      nextState = {
        ...state,
        factor: safeFactor,
      };
      if (!nextState.isManual) {
        nextState.mlPerFeed = calculateAutoMl(
          nextState.weightKg,
          nextState.factor,
          nextState.frequencyPerDay
        );
      }
      return nextState;
    });
    logEvent("quantity_change", { quantity: nextState });
  },
  resetQuantity: () => {
    const baseline = buildInitialQuantity();
    set(baseline);
    logEvent("quantity_change", { quantity: baseline });
  },
}));

