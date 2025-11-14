import { nowTs } from "../utils/formatTime.js";
import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";

const MAX_LOGS = 500;

const cloneInitialLogs = () => [...INITIAL_STATE.logs];

export const useLogsStore = createAppStore("logs", (set) => ({
  entries: cloneInitialLogs(),
  addEntry: (type, data) =>
    set((state) => {
      const entry = {
        id: crypto.randomUUID(),
        ts: nowTs(),
        type,
        data,
      };
      return {
        entries: [entry, ...state.entries].slice(0, MAX_LOGS),
      };
    }),
  clear: () => set({ entries: [] }),
}));

export function logEvent(type, data) {
  useLogsStore.getState().addEntry(type, data);
}

