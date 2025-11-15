import { useEffect } from "react";
import { IoCloseOutline, IoHeart } from "react-icons/io5";
import { useQuantityStore } from "../stores/quantityStore.js";

function HelpModal({ isOpen, onClose }) {
  const unit = useQuantityStore((state) => state.unit);
  const setUnit = useQuantityStore((state) => state.setUnit);

  useEffect(() => {
    if (isOpen) {
      // Disable body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = "";
    }

    // Cleanup: re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
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
            <div className="font-medium">Report an issue or feature request</div>
            <div className="text-sm text-neutral-400 mt-1">
              Open GitHub issues page
            </div>
          </a>

          <a
            href="https://forms.gle/BXgrZwoS7qA5Q7bS7"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left rounded-md border border-neutral-800 px-4 py-3 hover:bg-neutral-800 transition-colors"
          >
            <div className="font-medium">Share feedback via Google Form</div>
            <div className="text-sm text-neutral-400 mt-1">
              Open Google Form
            </div>
          </a>
        </div>

        <div className="rounded-md border border-neutral-800 px-4 py-3">
          <h3 className="font-medium mb-2">How to use</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Tap the left or right breast timer to start tracking feeding time. The overall timer automatically tracks total feeding duration. You can also log milk quantity and view your feeding history in the logs section below.
          </p>
        </div>

        <div className="rounded-md border border-amber-800/50 bg-amber-950/30 px-4 py-3">
          <h3 className="font-medium mb-2 text-amber-200">Caution</h3>
          <p className="text-sm text-amber-200/80 leading-relaxed">
            This app is just for tracking feeding times. Milk quantity measurements are for representation purposes only. Please consult your pediatrician for accurate feeding quantity recommendations.
          </p>
        </div>

        <div className="rounded-md border border-emerald-800/50 bg-emerald-950/30 px-4 py-3">
          <h3 className="font-medium mb-2 text-emerald-200">You're doing great!</h3>
          <p className="text-sm text-emerald-200/80 leading-relaxed">
            Every feeding session is a step forward. You're providing the best care for your little one. Keep up the amazing work, and remember to take care of yourself too.
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-800 text-center text-sm text-neutral-400">
          Made with <IoHeart className="inline-block" /> to help feeding mothers
        </div>
      </div>
    </div>
  );
}

export default HelpModal;

