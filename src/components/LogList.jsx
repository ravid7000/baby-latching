import { IoCheckmarkSharp, IoPlaySharp, IoPause, IoReloadSharp, IoPencilSharp } from "react-icons/io5";

import { useLogsStore } from "../stores/logsStore.js";
import { useQuantityStore } from "../stores/quantityStore.js";
import { mlToOz } from "../utils/unitConversion.js";

function formatTime(ts) {
  const d = new Date(ts);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDate(ts) {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getRelativeTime(ts) {
  const now = Date.now();
  const diffMs = now - ts;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
}

function formatMsToHM(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

function renderMessage(entry, unit) {
  const { type, data, ts } = entry;

  const completedTime = formatTime(ts);
  const relativeTime = getRelativeTime(ts);
  const date = formatDate(entry.ts);

  switch (type) {
    case "timer_start":
      return (
        <div className="flex gap-2">
          <IoPlaySharp className="text-neutral-500 w-4 h-4 mt-[2px]" />
          <div className="flex flex-col gap-1.5 w-full">
            <p className="flex gap-1 items-start">
              Started {data.which} timer on {completedTime}, {relativeTime}
            </p>
            <p className="text-xs text-neutral-400">on {date}</p>
          </div>
        </div>
      );
    case "timer_stop":
      return (
        <div className="flex gap-2">
          <IoPause className="text-neutral-500 w-4 h-4 mt-[2px]" />
          <div className="flex flex-col gap-1.5 w-full">
            <p className="flex gap-1 items-start">
              Stopped {data.which} timer on {completedTime}, {relativeTime}
            </p>
            <p className="text-xs text-neutral-400">on {date}</p>
          </div>
        </div>
      );
    case "timer_reset":
      return (
        <div className="flex gap-2">
          <IoReloadSharp className="text-neutral-500 w-4 h-4 mt-[2px]" />
          <div className="flex flex-col gap-1.5 w-full">
            <p className="flex gap-1 items-start">
              Reset {data.which} timer on {completedTime}, {relativeTime}
            </p>
            <p className="text-xs text-neutral-400">on {date}</p>
          </div>
        </div>
      );
    case "quantity_change": {
      const mlValue = data.quantity.mlPerFeed;
      const displayValue = unit === "oz" ? mlToOz(mlValue) : mlValue;
      return (
        <div className="flex gap-2">
          <IoPencilSharp className="text-neutral-500 w-4 h-4 mt-[2px]" />
          <div className="flex flex-col gap-1.5 w-full">
            <p className="flex gap-1 items-start">
              Updated quantity settings ({unit}/feed: {displayValue}) on{" "}
              {completedTime}, {relativeTime}
            </p>
            <p className="text-xs text-neutral-400">on {date}</p>
          </div>
        </div>
      );
    }
    case "cycle_complete": {
      const durationMs = data.durationMs ?? data.data?.durationMs ?? 0;
      const leftDurationMs =
        data.leftDurationMs ?? data.data?.leftDurationMs ?? 0;
      const rightDurationMs =
        data.rightDurationMs ?? data.data?.rightDurationMs ?? 0;
      const formattedLeftDuration = formatMsToHM(leftDurationMs);
      const formattedRightDuration = formatMsToHM(rightDurationMs);
      const formattedTotalDuration = formatMsToHM(durationMs);
      const mlValue = data.mlPerFeed ?? data.data?.mlPerFeed ?? 0;
      const displayValue = unit === "oz" ? mlToOz(mlValue) : mlValue;
      const feedCount = data.feedCount ?? data.data?.feedCount ?? 0;

      return (
        <div className="flex gap-2">
          <IoCheckmarkSharp className="text-emerald-400 w-4 h-4 mt-[2px]" />
          <div className="flex flex-col gap-1.5 w-full">
            <p className="font-medium text-emerald-400">
              Completed cycle on {completedTime}, {relativeTime}
            </p>
            <div className="flex flex-col gap-0.5 text-xs text-neutral-400">
              <p>
                Left side ({formattedLeftDuration}), Right side ({formattedRightDuration}), Total ({formattedTotalDuration})
              </p>
              <p>Fed {displayValue}{unit} {feedCount}{getOrdinalSuffix(feedCount)} time{feedCount !== 1 ? "s" : ""} on {date}</p>
            </div>
          </div>
        </div>
      );
    }
    default:
      return type;
  }
}

export default function LogList() {
  const entries = useLogsStore((state) => state.entries);
  const filter = useLogsStore((state) => state.filter ?? "all");
  const unit = useQuantityStore((state) => state.unit);

  const setFilter = (filterValue) => {
    useLogsStore.getState().setFilter(filterValue);
  };
  const clearLogs = () => {
    useLogsStore.getState().clear();
  };

  const filteredEntries =
    filter === "completed"
      ? entries.filter((entry) => entry.type === "cycle_complete")
      : entries;

  return (
    <div className="rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/70 rounded-t-xl">
        <h2 className="text-sm font-medium text-neutral-300">Activity Log</h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800 ${
                filter === "all" ? "bg-neutral-800" : ""
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800 ${
                filter === "completed" ? "bg-neutral-800" : ""
              }`}
            >
              Completed
            </button>
          </div>
          <button
            type="button"
            onClick={clearLogs}
            className="text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800">
        {filteredEntries.length === 0 ? (
          <div className="px-4 py-6 text-sm text-neutral-500">
            {filter === "completed"
              ? "No completed cycles yet."
              : "No activity yet."}
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="px-4 py-3 text-sm">
              <div className="text-neutral-200">
                {renderMessage(entry, unit)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
