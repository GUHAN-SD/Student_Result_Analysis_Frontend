import { useState, useEffect, useCallback } from 'react'
import { getStudents } from '../api/studentAPI.js'
import { loadLS, saveLS, KEYS } from '../data/storage.js'

export function useStudents() {
  const [students,  setStudentsRaw]  = useState({})
  const [extraSubs, setExtraSubsRaw] = useState(() => loadLS(KEYS.extraSubs,  {}))
  const [rdates,    setRdatesRaw]    = useState(() => loadLS(KEYS.resultDates, {}))
  const [loading,   setLoading]      = useState(true)

  // Backend-லிருந்து students fetch பண்ணு
  const fetchStudents = useCallback(async () => {
    try {
      const res = await getStudents()
      // Array → Object (regNo as key)
      const obj = {}
      res.data.forEach(s => { obj[s.regNo] = s })
      setStudentsRaw(obj)
    } catch (e) {
      console.error('Failed to load students', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // setStudents() with no args = refresh from backend
  const setStudents = (v) => {
    if (v === undefined) { fetchStudents(); return }
    const next = typeof v === 'function' ? v(students) : v
    setStudentsRaw(next)
  }

  const setExtraSubs = (v) => {
    const next = typeof v === 'function' ? v(extraSubs) : v
    setExtraSubsRaw(next)
    saveLS(KEYS.extraSubs, next)
  }

  const setRdates = (v) => {
    const next = typeof v === 'function' ? v(rdates) : v
    setRdatesRaw(next)
    saveLS(KEYS.resultDates, next)
  }

  return { students, setStudents, extraSubs, setExtraSubs, rdates, setRdates, loading }
}