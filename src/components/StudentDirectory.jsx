import { useEffect, useMemo, useState } from 'react'
import { createStudent, fetchClasses, fetchStudents } from '../lib/supabase'
import GlassCard from './ui/GlassCard'

const emptyForm = {
  class_id: '',
  full_name: '',
  admission_number: '',
  gender: 'Male',
  status: 'Active',
}

function StudentDirectory() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadClasses = async () => {
    try {
      const data = await fetchClasses()
      setClasses(data)
    } catch (classLoadError) {
      console.error('Error loading classes in student directory:', classLoadError)
      setError('Unable to load class data.')
    }
  }

  const loadStudents = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchStudents()
      setStudents(data)
    } catch (studentLoadError) {
      console.error('Error loading students:', studentLoadError)
      setError('Unable to load student records. Please try again.')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
    loadStudents()
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        !search ||
        `${student.full_name} ${student.admission_number}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesClass = selectedClass === 'all' || student.class_id === selectedClass
      const matchesGender = selectedGender === 'all' || student.gender === selectedGender

      return matchesSearch && matchesClass && matchesGender
    })
  }, [students, selectedClass, selectedGender, search])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.class_id || !formData.full_name.trim() || !formData.admission_number.trim()) {
      setError('Please fill in the class, full name, and admission number.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await createStudent({
        class_id: formData.class_id,
        full_name: formData.full_name.trim(),
        admission_number: formData.admission_number.trim(),
        gender: formData.gender,
        status: formData.status,
      })

      setFormData(emptyForm)
      setIsFormOpen(false)
      await loadStudents()
    } catch (submitError) {
      console.error('Error creating student:', submitError)
      setError(submitError.message || 'Failed to create the student.')
    } finally {
      setSubmitting(false)
    }
  }

  const getClassName = (classId) => {
    const match = classes.find((item) => item.id === classId)
    return match ? match.class_name : 'Unassigned'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-brand/80">
            Student Records
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Student Directory</h2>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-full border border-cyan-brand/40 bg-cyan-brand/10 px-4 py-2 text-sm font-medium text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand/20"
        >
          Add Student
        </button>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or admission number"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
            >
              <option value="all">All Classes</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(event) => setSelectedGender(event.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <GlassCard className="p-6 text-slate-300">Loading students...</GlassCard>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/60 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Admission</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Gender</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t border-white/10">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{student.full_name}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{student.admission_number}</td>
                      <td className="px-4 py-3 text-slate-300">{getClassName(student.class_id)}</td>
                      <td className="px-4 py-3 text-slate-300">{student.gender}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            student.status === 'Active'
                              ? 'border-emerald-brand/30 bg-emerald-brand/10 text-emerald-brand'
                              : student.status === 'Suspended'
                                ? 'border-gold-brand/30 bg-gold-brand/10 text-gold-brand'
                                : 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                      No student records match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.8)]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Student</h3>
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
                <label className="mb-2 block text-sm text-slate-300">Class</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ada Johnson"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Admission Number</label>
                <input
                  type="text"
                  name="admission_number"
                  value={formData.admission_number}
                  onChange={handleInputChange}
                  placeholder="e.g. MOI-2026-001"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
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
                  {submitting ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDirectory
