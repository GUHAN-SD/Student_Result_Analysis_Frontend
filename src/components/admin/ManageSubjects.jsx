import React, { useState, useEffect } from 'react'
import { DEPT }           from '../../data/departments.js'
import { getSubjectsAPI } from '../../api/subjectAPI.js'
import { addSubject as addSubjectAPI } from '../../api/subjectAPI.js'

export default function ManageSubjects({ extraSubs, setExtraSubs }) {
  const [dept,  setDept]  = useState('CSE')
  const [sem,   setSem]   = useState(1)
  const [code,  setCode]  = useState('')
  const [name,  setName]  = useState('')
  const [msg,   setMsg]   = useState('')
  const [def,   setDef]   = useState([])

  const dc    = DEPT[dept]?.color ?? 'var(--acc)'
  const extra = extraSubs[dept]?.[sem] ?? []

  // Load default subjects from backend
  useEffect(() => {
    getSubjectsAPI(dept, sem)
      .then(res => setDef(res.data))
      .catch(() => setDef([]))
  }, [dept, sem])

  async function addSubject() {
    const c = code.trim().toUpperCase(), n = name.trim()
    if (!c || !n) { setMsg('Both fields are required.'); return }
    if ([...def, ...extra].some(s => s.code.toUpperCase() === c)) {
      setMsg('Subject code already exists.'); return
    }
    try {
      await addSubjectAPI({ department: dept, semester: sem, code: c, name: n })
      setExtraSubs(p => ({
        ...p,
        [dept]: { ...(p[dept]??{}), [sem]: [...((p[dept]?.[sem])??[]), { code:c, name:n }] },
      }))
      setCode(''); setName('')
      setMsg('✓ Subject added!')
      setTimeout(() => setMsg(''), 2000)
    } catch (e) {
      setMsg(e.response?.data?.message || 'Error adding subject')
    }
  }

  function removeSubject(c) {
    setExtraSubs(p => ({
      ...p,
      [dept]: { ...(p[dept]??{}), [sem]: ((p[dept]?.[sem])??[]).filter(s => s.code !== c) },
    }))
  }

  return (
    <>
      <div className="page-title">Manage Subjects</div>
      <div className="page-sub">Add extra subjects beyond the defaults for any department & semester</div>

      <div className="two-col-form">
        <div>
          <label className="field-label no-mt">Department</label>
          <select className="field-input" value={dept} onChange={e => { setDept(e.target.value); setMsg('') }}>
            {Object.entries(DEPT).map(([k, v]) => <option key={k} value={k}>{k} — {v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label no-mt">Semester</label>
          <select className="field-input" value={sem} onChange={e => { setSem(+e.target.value); setMsg('') }}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
          </select>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom:14, borderColor:`${dc}33` }}>
        <div style={{ color:dc, fontWeight:700, fontSize:13, marginBottom:12 }}>
          ➕ Add Subject — {dept} Sem {sem}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'140px 1fr auto', gap:8, alignItems:'end' }}>
          <div>
            <label className="field-label no-mt">Subject Code</label>
            <input className="field-input" value={code} placeholder="CS3999"
              onChange={e => setCode(e.target.value)} />
          </div>
          <div>
            <label className="field-label no-mt">Subject Name</label>
            <input className="field-input" value={name} placeholder="Subject Name"
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key==='Enter' && addSubject()} />
          </div>
          <button className="btn-sm"
            style={{ background:dc, color:'#fff', padding:'10px 18px', borderRadius:8, marginBottom:1 }}
            onClick={addSubject}>Add</button>
        </div>
        {msg && <div className={msg.startsWith('✓') ? 'msg-ok' : 'msg-err'} style={{ marginTop:8 }}>{msg}</div>}
      </div>

      <div className="card" style={{ marginBottom:10 }}>
        <div className="tbl-head" style={{ gridTemplateColumns:'100px 1fr 80px' }}>
          <div>CODE</div><div>DEFAULT SUBJECTS ({def.length})</div><div></div>
        </div>
        {!def.length && <div style={{ padding:14, color:'var(--mut)', fontSize:12 }}>Loading...</div>}
        {def.map((s, i) => (
          <div key={i} className="tbl-row" style={{ gridTemplateColumns:'100px 1fr 80px' }}>
            <div style={{ fontFamily:'var(--font-mono)', color:'var(--acc)', fontSize:10 }}>{s.code}</div>
            <div style={{ fontSize:11 }}>{s.name}</div>
            <span className="badge" style={{ background:'rgba(59,130,246,.1)', color:'#3b82f6' }}>Default</span>
          </div>
        ))}
      </div>

      {extra.length > 0 && (
        <div className="card">
          <div className="tbl-head" style={{ gridTemplateColumns:'100px 1fr 80px' }}>
            <div>CODE</div><div>ADDED SUBJECTS ({extra.length})</div><div></div>
          </div>
          {extra.map((s, i) => (
            <div key={i} className="tbl-row" style={{ gridTemplateColumns:'100px 1fr 80px' }}>
              <div style={{ fontFamily:'var(--font-mono)', color:dc, fontSize:10 }}>{s.code}</div>
              <div style={{ fontSize:11 }}>{s.name}</div>
              <button className="btn-xs" style={{ background:'rgba(239,68,68,.12)', color:'var(--err)' }}
                onClick={() => removeSubject(s.code)}>🗑 Remove</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}