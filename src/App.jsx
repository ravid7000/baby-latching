import { useEffect, useState } from "react";
import { IoHelpOutline } from "react-icons/io5";

import TimerTile from "./components/TimerTile.jsx";
import QuantityTile from "./components/QuantityTile.jsx";
import SummaryTile from "./components/SummaryTile.jsx";
import LogList from "./components/LogList.jsx";
import HelpModal from "./components/HelpModal.jsx";
import { useTimersStore } from "./stores/timersStore.js";
import "./index.css";

function App() {
  const initTicker = useTimersStore((state) => state.initTicker);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Initialize ticker on mount (handles case where timers were running before page reload)
  useEffect(() => {
    initTicker();
  }, [initTicker]);

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <header className="mb-6 md:mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Baby Latching
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Track feeding timers
            </p>
          </div>

          <button 
            onClick={() => setIsHelpModalOpen(true)}
            className="text-xs rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800"
          >
            <IoHelpOutline />
          </button>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <TimerTile which="left" />
              <TimerTile which="right" />
            </div>
            <TimerTile which="overall" />
            <QuantityTile className="sm:col-span-2" />
            <SummaryTile className="sm:col-span-2" />
          </div>

          <section className="mt-6 md:mt-8">
            <LogList />
          </section>
        </main>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
}

export default App;
