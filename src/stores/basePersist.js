import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../utils/storageKeys.js";

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

function readAppBlob() {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.APP);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAppBlob(blob) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(blob));
  } catch {
    // ignore storage failures
  }
}

function createBrowserStorage() {
  return {
    getItem(name) {
      const blob = readAppBlob();
      if (!blob) return null;
      const entry = blob[name];
      if (entry && typeof entry === "object" && "state" in entry) {
        return JSON.stringify(entry);
      }
      return entry !== undefined
        ? JSON.stringify({ state: entry, version: 0 })
        : null;
    },
    setItem(name, value) {
      const blob = readAppBlob() ?? {};
      try {
        blob[name] = JSON.parse(value);
        writeAppBlob(blob);
      } catch {
        // ignore JSON issues
      }
    },
    removeItem(name) {
      const blob = readAppBlob();
      if (!blob) return;
      delete blob[name];
      writeAppBlob(blob);
    },
  };
}

function createMemoryStorage() {
  const memory = new Map();
  return {
    getItem(name) {
      return memory.get(name) ?? null;
    },
    setItem(name, value) {
      memory.set(name, value);
    },
    removeItem(name) {
      memory.delete(name);
    },
  };
}

const appStorage = isBrowser ? createBrowserStorage() : createMemoryStorage();

export function createAppStore(name, initializer, options = {}) {
  const { version = 0, ...rest } = options;
  return create(
    persist(initializer, {
      name,
      storage: appStorage,
      version,
      ...rest,
    })
  );
}

