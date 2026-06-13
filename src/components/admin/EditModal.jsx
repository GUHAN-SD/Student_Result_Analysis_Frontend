import React, { useState } from 'react'
import { DEPT } from '../../data/departments.js'

export default function EditModal({ students, setStudents, reg, onClose }) {
  const s = students[reg]
  const [form, setForm] = useState({ nr: reg, name: s.name, dept: s.dept, dob: s.dob, sem: s.semester })
  const [err, setErr] = useState('')

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  function save() {
    const newReg = form.nr.trim().toUpperCase()
    if (!newReg || !form.name.trim() || !form.dob.trim()) { setErr('All fields are required.'); return }
    if (newReg !== reg && students[newReg]) { setErr('Register number already exists.'); return }
    const data = { ...students[reg], name: form.name.trim().toUpperCase(), dept: form.dept, dob: form.dob.trim(), semester: +form.sem }
    if (newReg !== reg) {
      const u = { ...students }
      delete u[reg]
      setStudents({ ...u, [newReg]: data })
    } else {
      setStudents(p => ({ ...p, [reg]: data }))
    }
    onClose()
  }

  const dc = DEPT[form.dept]?.color ?? 'var(--acc)'

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">✏️ Edit Student</div>
            <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 2 }}>
              {reg} · {DEPT[s.dept]?.name}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* dept accent */}
        <div style={{ height: 3, background: dc, borderRadius: 2, marginBottom: 16 }} />

        <label className="field-label no-mt">
          Register Number
          <span className="field-label-warn"> — changing transfers all marks data</span>
        </label>
        <input className="field-input" value={form.nr}
          style={{ borderColor: '#f59e0b55', background: '#fffbeb' }}
          onChange={e => set('nr', e.target.value)} />

        <label className="field-label">Full Name</label>
        <input className="field-input" value={form.name}
          onChange={e => set('name', e.target.value)} />

        <label className="field-label">Date of Birth (DD-MM-YYYY)</label>
        <input className="field-input" value={form.dob}
          onChange={e => set('dob', e.target.value)} />

        <div className="two-col-form">
          <div>
            <label className="field-label no-mt">Department</label>
            <select className="field-input" value={form.dept}
              onChange={e => set('dept', e.target.value)}>
              {Object.entries(DEPT).map(([k, v]) => <option key={k} value={k}>{k} — {v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label no-mt">Semester</label>
            <select className="field-input" value={form.sem}
              onChange={e => set('sem', +e.target.value)}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
            </select>
          </div>
        </div>

        {err && <div className="msg-err">{err}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save Changes</button>
          <button className="btn-ghost"   style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}