import { IoCloseOutline } from "react-icons/io5";

function HelpModal({ isOpen, onClose }) {
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
          <h2 className="text-xl font-semibold">Help</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
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
          Made with love to help feeding mothers
        </div>
      </div>
    </div>
  );
}

export default HelpModal;

