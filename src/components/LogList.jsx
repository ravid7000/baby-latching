import { useLogsStore } from "../stores/logsStore.js";
import { formatMsToHMS } from "../utils/formatTime.js";

function formatTs(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function renderMessage(entry) {
  const { type, data } = entry;
  switch (type) {
    case 'timer_start':
      return `Started ${data.which} timer`;
    case 'timer_stop':
      return `Stopped ${data.which} timer`;
    case 'timer_reset':
      return `Reset ${data.which} timer`;
    case 'quantity_change':
      return `Updated quantity settings (ml/feed: ${data.quantity.mlPerFeed})`;
    case 'cycle_complete': {
      const durationMs = data.durationMs ?? data.data?.durationMs;
      const formattedDuration = durationMs ? formatMsToHMS(durationMs) : '';
      return `Completed cycle: ${data.feedCount ?? data.data?.feedCount ?? ''} feeds, ${formattedDuration}, ${data.mlPerFeed ?? data.data?.mlPerFeed ?? ''} ml/feed`;
    }
    default:
      return type;
  }
}

export default function LogList() {
  const entries = useLogsStore((state) => state.entries);
  const clearLogs = useLogsStore((state) => state.clear);

  return (
    <div className="rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/70 rounded-t-xl">
        <h2 className="text-sm font-medium text-neutral-300">Activity Log</h2>
        <button
          type="button"
          onClick={clearLogs}
          className="text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800"
        >
          Clear
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800">
        {entries.length === 0 ? (
          <div className="px-4 py-6 text-sm text-neutral-500">No activity yet.</div>
        ) : entries.map((entry) => (
          <div key={entry.id} className="px-4 py-3 text-sm flex items-start justify-between gap-4">
            <div className="text-neutral-200">{renderMessage(entry)}</div>
            <div className="text-neutral-500 shrink-0">{formatTs(entry.ts)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

