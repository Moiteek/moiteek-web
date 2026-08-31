import { useState } from 'react'
import ClassList from './components/ClassList'
import ResultPortal from './components/ResultPortal'
import Sidebar from './components/Sidebar'
import StudentDirectory from './components/StudentDirectory'
import GlassCard from './components/ui/GlassCard'

const stats = [
  { label: 'Total Students', value: '2,480', change: '+8.4%', tone: 'cyan' },
  { label: 'Total Classes', value: '96', change: '+12', tone: 'emerald' },
  { label: 'Fee Status', value: '94%', change: 'On track', tone: 'gold' },
  { label: 'Active Session', value: '2026/27', change: 'Term 1', tone: 'cyan' },
]

const tabContent = {
  dashboard: {
    title: 'MOITEEK ACADEMY',
    eyebrow: 'School Management Platform',
    description:
      'A streamlined command center for school operations, student insights, and academic performance monitoring.',
  },
  'class-management': {
    title: 'Class Management',
    eyebrow: 'Academic Operations',
    description:
      'Track classroom assignments, teacher coverage, and timetable coordination across all school sections.',
  },
  'student-directory': {
    title: 'Student Directory',
    eyebrow: 'Student Records',
    description:
      'Access enrollment records, demographic profiles, and quick student status monitoring from one place.',
  },
  'result-portal': {
    title: 'Result Portal',
    eyebrow: 'Academic Review',
    description:
      'Publish term results, performance summaries, and grade analysis with secure, real-time visibility.',
  },
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const currentView = tabContent[activeTab]

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[280px] shrink-0">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <section className="flex-1 rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-xl sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <>
              <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.32em] text-cyan-brand/80">
                    {currentView.eyebrow}
                  </p>
                  <h1 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-5xl">
                    {currentView.title}
                  </h1>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-brand/40 bg-cyan-brand/10 px-4 py-2 text-sm font-medium text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand/20"
                >
                  Access dashboard
                </button>
              </header>

              <p className="mb-8 max-w-2xl text-base text-slate-300">{currentView.description}</p>

              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, change, tone }) => (
                  <GlassCard key={label} className="min-h-[170px]">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{label}</span>
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
                            tone === 'cyan'
                              ? 'border-cyan-brand/40 bg-cyan-brand/10 text-cyan-brand'
                              : tone === 'emerald'
                                ? 'border-emerald-brand/40 bg-emerald-brand/10 text-emerald-brand'
                                : 'border-gold-brand/40 bg-gold-brand/10 text-gold-brand'
                          }`}
                        >
                          {tone === 'cyan' ? '↗' : tone === 'emerald' ? '✓' : '★'}
                        </span>
                      </div>

                      <div>
                        <div className="mb-3 text-3xl font-black tracking-[-0.05em] text-white">
                          {value}
                        </div>
                        <div
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            tone === 'cyan'
                              ? 'border-cyan-brand/30 bg-cyan-brand/10 text-cyan-brand'
                              : tone === 'emerald'
                                ? 'border-emerald-brand/30 bg-emerald-brand/10 text-emerald-brand'
                                : 'border-gold-brand/30 bg-gold-brand/10 text-gold-brand'
                          }`}
                        >
                          {change}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </section>
            </>
          )}

          {activeTab === 'class-management' && <ClassList />}
          {activeTab === 'student-directory' && <StudentDirectory />}
          {activeTab === 'result-portal' && <ResultPortal />}
        </section>
      </div>
    </main>
  )
}

export default App
