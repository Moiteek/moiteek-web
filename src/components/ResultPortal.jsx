import { useEffect, useMemo, useState } from 'react'
import { createResult, fetchClasses, fetchStudents, supabase } from '../lib/supabase'
import GlassCard from './ui/GlassCard'

const termOptions = ['Term 1', 'Term 2', 'Term 3']

function getGrade(totalScore) {
  if (totalScore >= 70) return 'A'
  if (totalScore >= 60) return 'B'
  if (totalScore >= 50) return 'C'
  if (totalScore >= 40) return 'D'
  return 'F'
}

function ResultPortal() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [term, setTerm] = useState('Term 1')
  const [subject, setSubject] = useState('Mathematics')
  const [caScore, setCaScore] = useState('')
  const [examScore, setExamScore] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const classStudents = useMemo(() => {
    if (!selectedClass) return []
    return students.filter((student) => student.class_id === selectedClass)
  }, [selectedClass, students])

  useEffect(() => {
    const loadClasses = async () => {
      const data = await fetchClasses()
      setClasses(data)

      if (data.length && !selectedClass) {
        setSelectedClass(data[0].id)
      }
    }

    const loadStudents = async () => {
      const data = await fetchStudents()
      setStudents(data)
    }

    loadClasses()
    loadStudents()
  }, [selectedClass])

  useEffect(() => {
    if (!classStudents.length) {
      setSelectedStudent('')
      return
    }

    if (!selectedStudent || !classStudents.some((student) => student.id === selectedStudent)) {
      setSelectedStudent(classStudents[0].id)
    }
  }, [classStudents, selectedStudent])

  const numericCa = Math.min(40, Math.max(0, Number(caScore) || 0))
  const numericExam = Math.min(60, Math.max(0, Number(examScore) || 0))
  const totalScore = Math.min(100, Math.max(0, numericCa + numericExam))
  const grade = getGrade(totalScore)

  const selectedStudentData = students.find((student) => student.id === selectedStudent)
  const selectedClassData = classes.find((classItem) => classItem.id === selectedClass)

  const handlePublish = async () => {
    if (!selectedStudent || !subject.trim()) {
      setMessage('Please select a student and subject before publishing.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await createResult({
        student_id: selectedStudent,
        subject: subject.trim(),
        term,
        ca_score: Number(caScore || 0),
        exam_score: Number(examScore || 0),
        total_score: totalScore,
        grade,
      })

      setMessage('Result published successfully.')
    } catch (error) {
      setMessage(error.message || 'Unable to publish result.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-brand/80">
          Academic Review
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Result Portal</h2>
      </div>

      <GlassCard className="p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Class</label>
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Student</label>
            <select
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
              disabled={!selectedClass}
            >
              <option value="">Select a student</option>
              {classStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Term</label>
            <select
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
            >
              {termOptions.map((termOption) => (
                <option key={termOption} value={termOption}>
                  {termOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Biology"
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-brand/60"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Continuous Assessment /40</label>
            <input
              type="number"
              min="0"
              max="40"
              value={caScore}
              onChange={(event) => setCaScore(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Exam /60</label>
            <input
              type="number"
              min="0"
              max="60"
              value={examScore}
              onChange={(event) => setExamScore(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-cyan-brand/60"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-cyan-brand/20 bg-cyan-brand/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Computed Result</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl font-black tracking-[-0.05em] text-white">{totalScore}</span>
              <span className="rounded-full border border-cyan-brand/30 bg-cyan-brand/10 px-2.5 py-1 text-xs font-medium text-cyan-brand">
                Grade {grade}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || !selectedStudent || !subject.trim()}
            className="rounded-full border border-cyan-brand/40 bg-cyan-brand/10 px-5 py-2.5 text-sm font-medium text-cyan-brand transition hover:border-cyan-brand hover:bg-cyan-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Publishing...' : 'Publish Result'}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-slate-300">{message}</p>
        )}
      </GlassCard>

      <GlassCard className="print-report bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">
                MOITEEK ACADEMY
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-800">
                Student Report Card
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-100 text-lg font-black text-cyan-700">
              M
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Student</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {selectedStudentData?.full_name || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admission</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {selectedStudentData?.admission_number || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Class</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {selectedClassData?.class_name || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Term</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{term}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">CA</th>
                <th className="px-4 py-3 font-semibold">Exam</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200">
                <td className="px-4 py-4 font-medium text-slate-800">{subject || '—'}</td>
                <td className="px-4 py-4">{numericCa}</td>
                <td className="px-4 py-4">{numericExam}</td>
                <td className="px-4 py-4 font-bold text-slate-900">{totalScore}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">
                    {grade}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Performance</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">{grade} Grade</p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="no-print rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
          >
            Print Report
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

export default ResultPortal
