import { useMemo, useState } from "react";
import Tile from "./Tile.jsx";
import { useQuantityStore } from "../stores/quantityStore.js";

export default function QuantityTile() {
  const weightKg = useQuantityStore((state) => state.weightKg);
  const frequencyPerDay = useQuantityStore((state) => state.frequencyPerDay);
  const factor = useQuantityStore((state) => state.factor);
  const isManual = useQuantityStore((state) => state.isManual);
  const mlPerFeed = useQuantityStore((state) => state.mlPerFeed);

  const setQuantity = useQuantityStore((state) => state.setQuantity);
  const setManualQuantity = useQuantityStore((state) => state.setManualQuantity);
  const [editing, setEditing] = useState(false);

  const derivedMl = useMemo(
    () => Math.round((weightKg * factor) / Math.max(1, frequencyPerDay)),
    [weightKg, frequencyPerDay, factor]
  );

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
    const v = parseInt(e.target.value || "0", 10);
    if (!Number.isNaN(v)) {
      setManualQuantity(v);
    }
  };

  return (
    <Tile>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm text-neutral-400">Milk Quantity (ml/feed)</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">
            {mlPerFeed} ml
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {isManual
              ? "Manual"
              : `Auto from ${weightKg}kg × ${factor} ÷ ${frequencyPerDay}/day = ${derivedMl}ml`}
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
          className="mt-3 grid grid-cols-4 gap-2"
        >
          <label className="text-xs text-neutral-400 col-span-1">
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
          <label className="text-xs text-neutral-400 col-span-1">
            Frequency (per day)
            <input
              name="frequencyPerDay"
              type="number"
              min="1"
              defaultValue={frequencyPerDay}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <label className="text-xs text-neutral-400 col-span-1">
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
          <div className="col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 text-sm"
            >
              Save Calc
            </button>
          </div>
          <label className="text-xs text-neutral-400 col-span-2">
            Manual quantity (ml)
            <input
              type="number"
              min="0"
              value={mlPerFeed}
              onChange={onManualChange}
              className="mt-1 w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1 text-neutral-100"
            />
          </label>
          <div className="col-span-1 flex items-end">
            <button
              type="button"
              onClick={() => setQuantity({ isManual: false })}
              className="w-full rounded-md border border-neutral-800 hover:bg-neutral-800 text-neutral-100 px-3 py-2 text-sm"
            >
              Use Auto
            </button>
          </div>
        </form>
      )}
    </Tile>
  );
}

