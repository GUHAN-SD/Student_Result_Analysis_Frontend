// ─────────────────────────────────────
// Analytics.jsx
// ─────────────────────────────────────
import React, { useState, useEffect } from 'react'
import { DEPT }          from '../../data/departments'
import { getAnalytics }  from '../../api/marksAPI'

export default function Analytics() {
  const [data,    setData]    = useState(null)
  const [dept,    setDept]    = useState('')
  const [sem,     setSem]     = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    try {
      const params = {}
      if (dept) params.dept     = dept
      if (sem)  params.semester = sem
      const res = await getAnalytics(params)
      setData(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const total  = data?.length ?? 0
  const passed = data?.reduce((a, s) => a + (s.passed ?? 0), 0) ?? 0
  const failed = data?.reduce((a, s) => a + (s.failed ?? 0), 0) ?? 0
  const avg    = total ? (data.reduce((a, s) => a + parseFloat(s.avg||0), 0) / total).toFixed(1) : 0

  return (
    <>
      <div className="page-title">Analytics</div>
      <div className="page-sub">Performance distribution across all students and departments</div>

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <select className="field-input" style={{ width:200 }}
          value={dept} onChange={e => setDept(e.target.value)}>
          <option value="">All Departments</option>
          {Object.entries(DEPT).map(([k,v]) => <option key={k} value={k}>{k} — {v.name}</option>)}
        </select>
        <select className="field-input" style={{ width:160 }}
          value={sem} onChange={e => setSem(e.target.value)}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
        </select>
        <button className="btn-sm" onClick={fetchData}
          style={{ background:'var(--acc)', color:'#fff', padding:'8px 16px' }}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </div>

      <div className="stat-grid">
        {[
          ['📝', total,   'Total Students', 'var(--acc)' ],
          ['✅', passed,  'Passed',          'var(--ok)'  ],
          ['❌', failed,  'Failed',          'var(--err)' ],
          ['📊', avg,     'Avg Score',       'var(--warn)'],
        ].map(([ic, v, l, c]) => (
          <div className="stat-card" key={l}>
            <div className="stat-icon">{ic}</div>
            <div className="stat-val" style={{ color:c }}>{v}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {data && (
        <div className="card" style={{ marginTop:16 }}>
          <div className="tbl-head" style={{ gridTemplateColumns:'1.5fr 80px 60px 60px 60px 80px' }}>
            <div>NAME</div><div>DEPT</div><div>SEM</div><div>PASS</div><div>FAIL</div><div>AVG</div>
          </div>
          {!data.length && <div style={{ padding:14, color:'var(--mut)', fontSize:13 }}>No data found.</div>}
          {data.map((s, i) => (
            <div key={i} className="tbl-row" style={{ gridTemplateColumns:'1.5fr 80px 60px 60px 60px 80px' }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{s.name}</div>
              <span className="badge" style={{ background:`${DEPT[s.dept]?.color??'#fff'}22`, color:DEPT[s.dept]?.color??'#fff' }}>{s.dept}</span>
              <div style={{ color:'var(--mut)', fontSize:12 }}>S{s.semester}</div>
              <div style={{ color:'var(--ok)', fontWeight:700 }}>{s.passed}</div>
              <div style={{ color:'var(--err)', fontWeight:700 }}>{s.failed}</div>
              <div style={{ color:'var(--acc)', fontWeight:700 }}>{s.avg}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}