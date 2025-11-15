import { INITIAL_STATE } from "../utils/storageKeys.js";
import { createAppStore } from "./basePersist.js";

const buildInitialSettings = () => ({ ...INITIAL_STATE.settings });

export const useSettingsStore = createAppStore("settings", (set) => ({
  ...buildInitialSettings(),
  setKeepScreenOn: (enabled) => {
    set((state) => ({ ...state, keepScreenOn: enabled }));
  },
}));

