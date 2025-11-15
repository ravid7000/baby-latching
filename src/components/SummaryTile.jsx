import Tile from "./Tile.jsx";
import { formatMsToHMS } from "../utils/formatTime.js";
import { useTimersStore } from "../stores/timersStore.js";
import { useQuantityStore } from "../stores/quantityStore.js";
import { useCycleStore } from "../stores/cycleStore.js";

export default function SummaryTile({ className = "" }) {
  const overallTimer = useTimersStore((state) => state.timers.overall);

  const mlPerFeed = useQuantityStore((state) => state.mlPerFeed);
  const weightKg = useQuantityStore((state) => state.weightKg);
  const feedCount = useCycleStore((state) => state.feedCount);
  const incrementFeedCount = useCycleStore((state) => state.incrementFeedCount);
  const completeCycle = useCycleStore((state) => state.completeCycle);
  const resetFeedCount = useCycleStore((state) => state.resetFeedCount);

  return (
    <Tile className={className}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-400">Cycle Summary</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm">
            <div className="text-neutral-400">Quantity</div>
            <div className="tabular-nums">{mlPerFeed} ml</div>
            <div className="text-neutral-400">Duration</div>
            <div className="tabular-nums">{formatMsToHMS(overallTimer.elapsedMs)}</div>
            <div className="text-neutral-400">Baby weight</div>
            <div className="tabular-nums">{weightKg} kg</div>
            <div className="text-neutral-400">Feed count</div>
            <div className="tabular-nums">{feedCount}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={incrementFeedCount}
            className="rounded-md border border-neutral-800 hover:bg-neutral-800 text-white px-2 py-2 text-sm"
          >
            +1 Feed
          </button>
          <button
            type="button"
            onClick={completeCycle}
            className="rounded-md bg-emerald-600 hover:bg-emerald-600 text-neutral-100 px-2 py-2 text-sm"
          >
            &#10003; Complete Cycle
          </button>
          <button
            type="button"
            onClick={resetFeedCount}
            className="rounded-md border border-neutral-800 hover:bg-neutral-800 text-neutral-100 px-2 py-2 text-sm"
          >
            Reset Feed
          </button>
        </div>
      </div>
    </Tile>
  );
}

