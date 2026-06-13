import React, { useState, useEffect } from 'react'
import { DEPT }           from '../../data/departments.js'
import { getSubjectsAPI } from '../../api/subjectAPI.js'
import { saveMarks }      from '../../api/marksAPI.js'
import { calcGPA, mkKey, fmtDateTime } from '../../hooks/useGrades.js'
import MarksTable from '../MarksTable.jsx'

export default function ResultModal({ students, setStudents, extraSubs, rdates, reg, onClose }) {
  const s = students[reg]
  const [sem,      setSem]      = useState(s.semester)
  const [subs,     setSubs]     = useState([])
  const [marks,    setMarks]    = useState({ ...s.marks })
  const [saved,    setSaved]    = useState(false)
  const [dirty,    setDirty]    = useState(false)
  const [switchTo, setSwitchTo] = useState(null)
  const [loading,  setLoading]  = useState(false)

  const dept = s.dept
  const dc   = DEPT[dept]?.color ?? 'var(--acc)'
  const rd   = rdates[`${dept}_${sem}`]

  const gpa = calcGPA(subs.map(sub => {
    const m = marks[mkKey(dept, sem, sub.code)] ?? {}
    return { int: m.int??'', ext: m.ext??'' }
  }))

  useEffect(() => {
    getSubjectsAPI(dept, sem)
      .then(res => setSubs(res.data))
      .catch(() => setSubs([]))
  }, [dept, sem])

  function setMark(key, field, val, max) {
    const n = val === '' ? '' : String(Math.min(max, Math.max(0, parseInt(val)||0)))
    setMarks(p => ({ ...p, [key]: { ...(p[key]??{int:'',ext:''}), [field]: n } }))
    setDirty(true)
  }

  function handleSemClick(n) {
    if (n === sem) return
    if (dirty) { setSwitchTo(n); return }
    setSem(n)
  }

  function confirmSwitch() {
    setSem(switchTo)
    setSwitchTo(null)
    setDirty(false)
  }

  async function save() {
    setLoading(true)
    try {
      await saveMarks({ regNo: reg, marks })
      setStudents()
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      alert(e.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:760 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{s.name}</div>
            <div style={{ color:'var(--mut)', fontSize:12, marginTop:2 }}>
              {reg} · {DEPT[dept]?.name}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {rd && (
          <div style={{ color:'var(--mut)', fontSize:11, marginBottom:8 }}>
            📅 Published: <strong style={{ color:'var(--warn)' }}>{fmtDateTime(rd)}</strong>
          </div>
        )}

        {/* ← Sem 1, Sem 2 ... மாத்தினேன் */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
          {[1,2,3,4,5,6,7,8].map(n => (
            <button key={n} className="btn-sm" onClick={() => handleSemClick(n)}
              style={{
                background: n===sem ? dc : 'var(--sur2)',
                border: n===sem ? 'none' : '1px solid var(--bdr)',
                color: n===sem ? '#fff' : 'var(--mut)',
              }}>
              Sem {n}
            </button>
          ))}
        </div>

        <MarksTable
          subs={subs} dept={dept} sem={sem}
          marks={marks} onChange={setMark}
          deptColor={dc} gpa={gpa}
        />

        <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end' }}>
          <button className="btn-primary" style={{ padding:'9px 24px' }}
            onClick={save} disabled={loading}>
            {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save Marks'}
          </button>
        </div>
      </div>

      {switchTo && (
        <div className="overlay" onClick={() => setSwitchTo(null)}>
          <div className="modal" style={{ maxWidth:360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">⚠️ Unsaved Changes</span>
              <button className="modal-close" onClick={() => setSwitchTo(null)}>✕</button>
            </div>
            <div style={{ color:'var(--mut)', fontSize:13, marginBottom:18 }}>
              Current semester marks save ஆகல. Switch பண்ணா changes போயிடும்!
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-primary"
                style={{ flex:1, background:'linear-gradient(135deg,#dc2626,#b91c1c)' }}
                onClick={confirmSwitch}>Switch Anyway</button>
              <button className="btn-ghost" style={{ flex:1 }}
                onClick={() => setSwitchTo(null)}>Stay & Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}