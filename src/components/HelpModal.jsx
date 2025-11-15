import { IoCloseOutline, IoHeart } from "react-icons/io5";
import { useQuantityStore } from "../stores/quantityStore.js";

function HelpModal({ isOpen, onClose }) {
  const unit = useQuantityStore((state) => state.unit);
  const setUnit = useQuantityStore((state) => state.setUnit);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Options</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="rounded-md border border-neutral-800 px-4 py-3">
            <div className="font-medium mb-2">Quantity Unit</div>
            <div className="text-sm text-neutral-400 mb-3">
              Choose your preferred unit for milk quantity measurement
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('ml')}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
                  unit === 'ml'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-neutral-800 hover:bg-neutral-800 text-neutral-100'
                }`}
              >
                Milliliters (ml)
              </button>
              <button
                onClick={() => setUnit('oz')}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
                  unit === 'oz'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-neutral-800 hover:bg-neutral-800 text-neutral-100'
                }`}
              >
                Ounces (oz)
              </button>
            </div>
          </div>

          <a
            href="https://github.com/ravid7000/baby-latching/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left rounded-md border border-neutral-800 px-4 py-3 hover:bg-neutral-800 transition-colors"
          >
            <div className="font-medium">Request a feature or share feedback</div>
            <div className="text-sm text-neutral-400 mt-1">
              Open GitHub issues page
            </div>
          </a>
        </div>

        <div className="pt-4 border-t border-neutral-800 text-center text-sm text-neutral-400">
          Made with <IoHeart className="inline-block" /> to help feeding mothers
        </div>
      </div>
    </div>
  );
}

export default HelpModal;

