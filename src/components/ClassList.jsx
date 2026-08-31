import { useEffect, useState } from 'react'
import { createClass, fetchClasses, supabase } from '../lib/supabase'
import GlassCard from './ui/GlassCard'

const emptyForm = {
  school_id: '',
  class_name: '',
  teacher_in_charge: '',
}

function ClassList() {
  const [classes, setClasses] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadSchools = async () => {
    if (!supabase) {
      setSchools([])
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    try {
      const { data, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false })

      if (schoolsError) {
        throw schoolsError
      }

      setSchools(data ?? [])
    } catch (schoolsLoadError) {
      console.error('Error loading schools:', schoolsLoadError)
      setError('Unable to load schools right now.')
    }
  }

  const loadClasses = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchClasses()
      setClasses(data)
    } catch (loadError) {
      console.error('Error loading classes:', loadError)
      setError('Unable to load classes. Please try again.')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchools()
    loadClasses()
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.school_id || !formData.class_name.trim()) {
      setError('Please select a school and provide a class name.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await createClass({
        school_id: formData.school_id,
        class_name: formData.class_name.trim(),
        teacher_in_charge: formData.teacher_in_charge.trim() || null,
      })

      setFormData(emptyForm)
      setIsFormOpen(false)
      await loadClasses()
    } catch (submitError) {
      console.error('Error creating class:', submitError)
      setError(submitError.message || 'Failed to create the class.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-brand/80">
            Classroom Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Class Management</h2>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-full border border-cyan-brand/40 bg-cyan-brand/10 px-4 py-2 text-sm font-medium text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand/20"
        >
          Add Class
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <GlassCard className="p-6 text-slate-300">Loading classes...</GlassCard>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {classes.length ? (
            classes.map((item) => (
              <GlassCard key={item.id} className="min-h-[180px]">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-cyan-brand/30 bg-cyan-brand/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-brand">
                      Class
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-white">
                      {item.class_name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Teacher: {item.teacher_in_charge || 'Unassigned'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm text-slate-400">
                    <span>School ID</span>
                    <span className="font-medium text-slate-200">
                      {item.school_id ? item.school_id.slice(0, 8) : 'N/A'}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="md:col-span-2 xl:col-span-3 p-6 text-slate-300">
              No classes available yet. Add the first class to get started.
            </GlassCard>
          )}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.8)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Create New Class</h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 transition hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">School</label>
                <select
                  name="school_id"
                  value={formData.school_id}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
                  required
                >
                  <option value="">Select a school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Class Name</label>
                <input
                  type="text"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                  placeholder="e.g. JSS 1A"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Teacher in Charge</label>
                <input
                  type="text"
                  name="teacher_in_charge"
                  value={formData.teacher_in_charge}
                  onChange={handleInputChange}
                  placeholder="e.g. Mrs. Adeola"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full border border-cyan-brand/40 bg-cyan-brand/10 px-4 py-2 text-sm font-medium text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassList
