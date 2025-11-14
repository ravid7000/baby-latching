import { create } from "zustand";
import { persist } from "zustand/middleware";

export function createAppStore(name, initializer, options = {}) {
  const { version = 0, ...rest } = options;
  // Create a new storage instance for each store to avoid any potential state sharing issues
  return create(
    persist(initializer, {
      name,
      // storage,
      version,
      // Add onRehydrateStorage to debug hydration
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(`[Storage] Rehydration error for ${name}:`, error);
        } else {
          console.log(`[Storage] Rehydrated ${name}:`, state ? Object.keys(state) : 'no state');
        }
      },
      ...rest,
    })
  );
}

