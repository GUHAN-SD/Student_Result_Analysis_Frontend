import React, { useState } from 'react'
import { DEPT } from '../../data/departments'
import { addStudent } from '../../api/studentAPI'

export default function AddStudent({ onAdded }) {
  const [form, setForm] = useState({ reg: '', name: '', dept: 'CSE', dob: '', sem: 1 })
  const [err,  setErr]  = useState('')
  const [ok,   setOk]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function submit() {
    const reg = form.reg.trim().toUpperCase()
    if (!reg || !form.name.trim() || !form.dob.trim()) { setErr('All fields are required.'); return }
    setLoading(true); setErr('')
    try {
      await addStudent({ regNo: reg, name: form.name.trim().toUpperCase(), dept: form.dept, dob: form.dob.trim(), semester: +form.sem })
      setOk(`✓ ${reg} added! Login: ${reg} + ${form.dob.trim()}`)
      setForm({ reg: '', name: '', dept: 'CSE', dob: '', sem: 1 })
      if (onAdded) onAdded()
      setTimeout(() => setOk(''), 4000)
    } catch (e) {
      setErr(e.response?.data?.message || 'Error adding student')
    } finally {
      setLoading(false)
    }
  }

  const dc = DEPT[form.dept]?.color ?? 'var(--acc)'

  return (
    <>
      <div className="page-title">Add New Student</div>
      <div className="page-sub">Student can login using Register Number + Date of Birth</div>

      {/* info banner */}
      <div style={{
        background: 'var(--sur2)', border: '1px solid var(--bdr)', borderRadius: 10,
        padding: '12px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--mut)',
      }}>
        <span style={{ fontSize: 20 }}>ℹ️</span>
        <span>Login credentials: <strong style={{ color: 'var(--txt)' }}>Register Number</strong> as username &amp; <strong style={{ color: 'var(--txt)' }}>DOB (DD-MM-YYYY)</strong> as password.</span>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="card card-pad">

          {/* Dept color accent bar */}
          <div style={{ height: 4, borderRadius: 4, background: dc, marginBottom: 20, marginLeft: -20, marginRight: -20, marginTop: -20 }} />

          <label className="field-label no-mt">Register Number</label>
          <input className="field-input" value={form.reg} placeholder="e.g. 22CSE019"
            onChange={e => set('reg', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} />

          <label className="field-label">Full Name</label>
          <input className="field-input" value={form.name} placeholder="Student full name"
            onChange={e => set('name', e.target.value)} />

          <label className="field-label">
            Date of Birth
            <span className="field-label-warn"> — used as password (DD-MM-YYYY)</span>
          </label>
          <input className="field-input" value={form.dob} placeholder="16-12-2004"
            onChange={e => set('dob', e.target.value)} />

          <div className="two-col-form" style={{ marginBottom: 0 }}>
            <div>
              <label className="field-label">Department</label>
              <select className="field-input" value={form.dept} onChange={e => set('dept', e.target.value)}>
                {Object.entries(DEPT).map(([k, v]) =>
                  <option key={k} value={k}>{k} — {v.name}</option>
                )}
              </select>
            </div>
            <div>
              <label className="field-label">Semester</label>
              <select className="field-input" value={form.sem} onChange={e => set('sem', +e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
              </select>
            </div>
          </div>

          {err && <div className="msg-err" style={{ marginTop: 14 }}>{err}</div>}
          {ok  && <div className="msg-ok"  style={{ marginTop: 14 }}>{ok}</div>}

          <button className="btn-primary" style={{ width: '100%', marginTop: 18 }}
            onClick={submit} disabled={loading}>
            {loading ? 'Adding…' : '➕ Add Student'}
          </button>
        </div>
      </div>
    </>
  )
}