import { useMemo, useState } from "react";
import Tile from "./Tile.jsx";
import { useQuantityStore } from "../stores/quantityStore.js";
import { mlToOz, ozToMl } from "../utils/unitConversion.js";

export default function QuantityTile({ className = "" }) {
  const weightKg = useQuantityStore((state) => state.weightKg);
  const frequencyPerDay = useQuantityStore((state) => state.frequencyPerDay);
  const factor = useQuantityStore((state) => state.factor);
  const isManual = useQuantityStore((state) => state.isManual);
  const mlPerFeed = useQuantityStore((state) => state.mlPerFeed);
  const unit = useQuantityStore((state) => state.unit);

  const setQuantity = useQuantityStore((state) => state.setQuantity);
  const setManualQuantity = useQuantityStore((state) => state.setManualQuantity);
  const [editing, setEditing] = useState(false);

  const derivedMl = useMemo(
    () => Math.round((weightKg * factor) / Math.max(1, frequencyPerDay)),
    [weightKg, frequencyPerDay, factor]
  );

  // Convert values for display based on selected unit
  const displayQuantity = useMemo(() => {
    return unit === 'oz' ? mlToOz(mlPerFeed) : mlPerFeed;
  }, [mlPerFeed, unit]);

  const displayDerived = useMemo(() => {
    return unit === 'oz' ? mlToOz(derivedMl) : derivedMl;
  }, [derivedMl, unit]);

  const onSaveCalc = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const weightKg = parseFloat(form.get("weightKg") || "0");
    const frequencyPerDay = parseInt(form.get("frequencyPerDay") || "1", 10);
    const factor = parseFloat(form.get("factor") || `${factor}`);
    setQuantity({ weightKg, frequencyPerDay, factor, isManual: false });
    setEditing(false);
  };

  const onManualChange = (e) => {
    const v = parseFloat(e.target.value || "0");
    if (!Number.isNaN(v)) {
      // Convert to ML before storing (values are always stored in ML internally)
      const mlValue = unit === 'oz' ? ozToMl(v) : Math.round(v);
      setManualQuantity(mlValue);
    }
  };

  return (
    <Tile className={className}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-neutral-400">Milk Quantity</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">
            {displayQuantity} {unit}/feed
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {isManual
              ? "Manual"
              : <>Auto from {weightKg}kg &times; {factor} &divide; {frequencyPerDay}/day = {displayDerived}{unit}</>}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            This is the quantity of milk that should be given to the baby per feed. It is an estimation based on the baby's weight and the frequency of feeds.{' '}
            <a className="text-emerald-600 hover:text-emerald-500" href="https://www.parents.com/baby/feeding/baby-feeding-chart-how-much-and-when-to-feed-infants-the-first-year/" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Read more</a>
          </div>
          
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={onSaveCalc}
          className="mt-3 flex flex-col gap-3"
        >
          <label className="text-xs text-neutral-400">
            Weight (kg)
            <input
              name="weightKg"
              type="number"
              step="0.1"
              min="0"
              defaultValue={weightKg}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <label className="text-xs text-neutral-400">
            Frequency (per day)
            <input
              name="frequencyPerDay"
              type="number"
              min="1"
              defaultValue={frequencyPerDay}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <label className="text-xs text-neutral-400">
            Factor (ml/kg/day)
            <input
              name="factor"
              type="number"
              min="1"
              step="1"
              defaultValue={factor}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 text-sm"
            >
              Save Calc
            </button>
          </div>
          <label className="text-xs text-neutral-400">
            Manual quantity ({unit})
            <input
              type="number"
              min=""
              step={unit === 'oz' ? '0.1' : '1'}
              value={displayQuantity}
              onChange={onManualChange}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <div className="text-xs text-neutral-400">
            Manual quantity is saved on change.
          </div>
          <div className="col-span-1 flex items-end gap-4">
            <button
              type="button"
              onClick={() => setQuantity({ isManual: false })}
              className="w-full rounded-md border border-neutral-800 hover:bg-neutral-800 text-neutral-100 px-3 py-2 text-sm"
            >
              Use Auto
            </button>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="w-full rounded-md border border-neutral-800 hover:bg-neutral-800 text-neutral-100 px-3 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </form>
      )}
    </Tile>
  );
}

