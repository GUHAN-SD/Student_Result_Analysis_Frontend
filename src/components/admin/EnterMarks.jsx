// ─────────────────────────────────────
// EnterMarks.jsx
// ─────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { DEPT }            from '../../data/departments'
import { getSubjectsAPI }  from '../../api/subjectAPI'
import { saveMarks }       from '../../api/marksAPI'
import { calcGPA, mkKey, fmtDateTime } from '../../hooks/useGrades'
import MarksTable          from '../MarksTable'

export default function EnterMarks({ students, setStudents, extraSubs, rdates, setRdates }) {
  const [selReg,     setSelReg]     = useState('')
  const [selSem,     setSelSem]     = useState(1)
  const [subs,       setSubs]       = useState([])
  const [localMarks, setLocalMarks] = useState({})
  const [localDate,  setLocalDate]  = useState('')
  const [saved,      setSaved]      = useState(false)
  const [loading,    setLoading]    = useState(false)

  const s    = students[selReg]
  const dept = s?.dept ?? 'CSE'
  const dc   = DEPT[dept]?.color ?? 'var(--acc)'
  const dk   = `${dept}_${selSem}`

  // Load subjects from backend
  useEffect(() => {
    if (!selReg) return
    getSubjectsAPI(dept, selSem)
      .then(res => setSubs(res.data))
      .catch(() => setSubs([]))
  }, [selReg, selSem, dept])

  const gpa = calcGPA(subs.map(sub => {
    const m = localMarks[mkKey(dept, selSem, sub.code)] ?? {}
    return { int: m.int??'', ext: m.ext??'' }
  }))

  function selectStudent(reg) {
    setSelReg(reg)
    if (students[reg]) {
      setSelSem(students[reg].semester)
      setLocalMarks({ ...students[reg].marks })
      setLocalDate(rdates[`${students[reg].dept}_${students[reg].semester}`] ?? '')
    }
    setSaved(false)
  }

  function changeSem(sem) {
    setSelSem(sem); setSaved(false)
    if (s) setLocalDate(rdates[`${dept}_${sem}`] ?? '')
  }

  function setMark(key, field, val, max) {
    const n = val === '' ? '' : String(Math.min(max, Math.max(0, parseInt(val)||0)))
    setLocalMarks(p => ({ ...p, [key]: { ...(p[key]??{int:'',ext:''}), [field]: n } }))
  }

  async function handleSave() {
    setLoading(true)
    try {
      await saveMarks({ regNo: selReg, marks: localMarks })
      if (localDate) setRdates(p => ({ ...p, [dk]: localDate }))
      setSaved(true)
      setStudents()
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      alert(e.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-title">Enter Marks</div>
      <div className="page-sub">Select a student and semester to enter or update marks</div>

      <div className="two-col-form">
        <div>
          <label className="field-label no-mt">Select Student</label>
          <select className="field-input" value={selReg} onChange={e => selectStudent(e.target.value)}>
            <option value="">— Choose Student —</option>
            {Object.entries(students).map(([r, st]) =>
              <option key={r} value={r}>{r} — {st.name} ({st.dept})</option>
            )}
          </select>
        </div>
        <div>
          <label className="field-label no-mt">Semester</label>
          <select className="field-input" value={selSem} onChange={e => changeSem(+e.target.value)}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
          </select>
        </div>
      </div>

      {selReg && (
        <>
          <div style={{ background:`${dc}10`, border:`1px solid ${dc}22`, borderRadius:10, padding:'10px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ color:'var(--mut)', fontSize:12 }}>📅 Result Date — {dept} Sem {selSem}:</span>
            {rdates[dk] && <span style={{ color:'var(--warn)', fontSize:12, fontWeight:600 }}>{fmtDateTime(rdates[dk])}</span>}
            <input type="datetime-local" className="field-input"
              style={{ flex:1, maxWidth:230, padding:'7px 10px', fontSize:12 }}
              value={localDate} onChange={e => setLocalDate(e.target.value)} />
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ color:'var(--mut)', fontSize:12 }}>{s?.name} · {dept} · Semester {selSem}</div>
            <button className="btn-sm" onClick={handleSave} disabled={loading}
              style={{ background: saved ? '#10b981' : 'linear-gradient(135deg,#6366f1,#3b82f6)', color:'#fff', minWidth:100, padding:'8px 16px' }}>
              {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save Marks'}
            </button>
          </div>

          <MarksTable
            subs={subs} dept={dept} sem={selSem}
            marks={localMarks} onChange={setMark}
            deptColor={dc} gpa={gpa}
          />
        </>
      )}
    </>
  )
}