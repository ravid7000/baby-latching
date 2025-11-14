import TimerTile from "./components/TimerTile.jsx";
import QuantityTile from "./components/QuantityTile.jsx";
import SummaryTile from "./components/SummaryTile.jsx";
import LogList from "./components/LogList.jsx";
import "./index.css";

function App() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Baby Latching
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Track feeding timers, quantity, and logs
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <TimerTile which="left" />
            <TimerTile which="right" />
            <TimerTile which="overall" />
            <QuantityTile />
            <SummaryTile className="sm:col-span-2" />
          </div>

          <section className="mt-6 md:mt-8">
            <LogList />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
