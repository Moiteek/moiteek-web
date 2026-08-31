const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'class-management', label: 'Class Management' },
  { id: 'student-directory', label: 'Student Directory' },
  { id: 'result-portal', label: 'Result Portal' },
]

function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="flex h-full w-full flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.65)] backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-brand/40 bg-cyan-brand/10 text-lg font-black text-cyan-brand shadow-[0_0_22px_rgba(0,242,254,0.25)]">
          M
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
            MOITEEK
          </div>
          <div className="text-sm font-bold tracking-wide text-cyan-brand">
            ACADEMY
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ id, label }) => {
          const isActive = activeTab === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-cyan-brand/50 bg-cyan-brand/10 text-cyan-brand shadow-[0_0_20px_rgba(0,242,254,0.15)]'
                  : 'border-transparent bg-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? 'bg-cyan-brand shadow-[0_0_12px_rgba(0,242,254,0.8)]' : 'bg-slate-500'
                }`}
              />
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
