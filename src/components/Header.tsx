export default function Header() {
  return (
    <div className="bg-background-contrast border-b border-border-contrast flex items-center justify-between px-6 h-[72px]">
      <div className="flex items-end gap-[3.5px]">
        <div className="text-white text-[28px] font-bold leading-none">fever</div>
        <div className="text-background-subtle-medium text-[8.55px] font-normal leading-none mb-[5px] uppercase tracking-wide">zone</div>
      </div>
      <div className="flex items-center gap-8">
        <button className="border-2 border-neutral-100 rounded-full px-3 h-8 text-white text-sm font-semibold">
          Create event
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white text-base">SO Test</span>
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

