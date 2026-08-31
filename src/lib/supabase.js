import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null

function assertSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.',
    )
  }
}

export async function fetchClasses(schoolId = null) {
  try {
    assertSupabaseClient()

    let query = supabase.from('classes').select('*').order('created_at', { ascending: false })

    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data ?? []
  } catch (error) {
    console.error('Error fetching classes:', error)
    return []
  }
}

export async function createClass(classPayload) {
  try {
    assertSupabaseClient()

    const { data, error } = await supabase
      .from('classes')
      .insert([classPayload])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating class:', error)
    throw new Error(error.message || 'Failed to create class record.')
  }
}

export async function fetchStudents(classId = null) {
  try {
    assertSupabaseClient()

    let query = supabase.from('students').select('*').order('created_at', { ascending: false })

    if (classId) {
      query = query.eq('class_id', classId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data ?? []
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

export async function createStudent(studentPayload) {
  try {
    assertSupabaseClient()

    const { data, error } = await supabase
      .from('students')
      .insert([studentPayload])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating student:', error)
    throw new Error(error.message || 'Failed to create student record.')
  }
}

export async function fetchResults(studentId = null) {
  try {
    assertSupabaseClient()

    let query = supabase.from('results').select('*').order('created_at', { ascending: false })

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data ?? []
  } catch (error) {
    console.error('Error fetching results:', error)
    return []
  }
}

export async function createResult(resultPayload) {
  try {
    assertSupabaseClient()

    const { data, error } = await supabase
      .from('results')
      .insert([resultPayload])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating result:', error)
    throw new Error(error.message || 'Failed to publish result.')
  }
}
