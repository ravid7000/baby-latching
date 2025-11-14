export default function Tile({ children, onClick, active = false, className = '', ariaPressed, title }) {
  return (
    <div
      type="button"
      role="button"
      tabIndex={0}
      aria-pressed={ariaPressed ?? active}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className={`w-full rounded-xl border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 transition-colors p-4 text-left ${active ? 'ring-1 ring-emerald-500/50 shadow-[0_0_0_2px_rgba(16,185,129,0.25)_inset]' : ''} ${className}`}
      title={title}
    >
      {children}
    </div>
  );
}

