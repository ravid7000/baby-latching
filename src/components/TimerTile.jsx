import { useEffect, useMemo, useState } from "react";
import { useTimersStore } from "../stores/timersStore.js";
import { formatMsToHMS } from "../utils/formatTime.js";
import Tile from "./Tile.jsx";

const LABELS = {
  left: "Left Breast",
  right: "Right Breast",
  overall: "Overall Timer",
};

export default function TimerTile({ which = "left" }) {
  const t = useTimersStore((state) => state.timers[which]);
  const toggleTimer = useTimersStore((state) => state.toggleTimer);
  const resetTimer = useTimersStore((state) => state.resetTimer);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    if (!t.isRunning) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [t.isRunning, t.startedAt]);

  const displayMs = useMemo(() => {
    if (t.isRunning && t.startedAt) {
      const diff = nowTick - t.startedAt;
      if (diff >= 0) {
        return diff;
      }
      return t.elapsedMs ?? 0;
    }
    return t.elapsedMs;
  }, [t.isRunning, t.startedAt, t.elapsedMs, nowTick]);

  const label = LABELS[which];
  const startStop = () => toggleTimer(which);
  const reset = (e) => {
    e.stopPropagation();
    resetTimer(which);
  };

  return (
    <Tile
      onClick={startStop}
      active={t.isRunning}
      ariaPressed={t.isRunning}
      title={`${label} - ${t.isRunning ? "Stop" : "Start"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-neutral-400">{label}</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">
            {formatMsToHMS(displayMs)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              t.isRunning
                ? "bg-emerald-400 animate-pulse shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"
                : "bg-neutral-700"
            }`}
          />
          <button
            type="button"
            onClick={reset}
            className="text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800"
          >
            Reset
          </button>
        </div>
      </div>
      {which === "overall" && (
        <div className="mt-2 text-xs text-neutral-500">
          Tap to start/stop overall without affecting side timers. Stopping
          overall pauses both sides.
        </div>
      )}
    </Tile>
  );
}
