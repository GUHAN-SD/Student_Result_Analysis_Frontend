import React, { useState, useEffect, useMemo } from 'react'
import { DEPT }           from '../../data/departments.js'
import { getSubjectsAPI } from '../../api/subjectAPI.js'
import { getGrade }       from '../../hooks/useGrades.js'

function calcSubjectStats(subCode, dept, students) {
  const entries = []
  Object.values(students)
    .filter(s => s.dept === dept)
    .forEach(s => {
      const m = s.marks?.[subCode]
      if (m !== undefined && m !== null && m !== '') {
        entries.push({ total: +m })
      }
    })
  if (!entries.length) return null

  const pass     = entries.filter(e => e.total >= 40).length
  const fail     = entries.length - pass
  const avg      = (entries.reduce((a, e) => a + e.total, 0) / entries.length).toFixed(1)
  const highest  = Math.max(...entries.map(e => e.total))
  const lowest   = Math.min(...entries.map(e => e.total))
  const passRate = ((pass / entries.length) * 100).toFixed(1)
  const gradeDist = entries.reduce((acc, e) => {
    const g = getGrade(e.total).g
    acc[g] = (acc[g] || 0) + 1
    return acc
  }, {})
  return { total: entries.length, pass, fail, avg, highest, lowest, passRate, gradeDist }
}

function barColor(pct) {
  const n = parseFloat(pct)
  if (n >= 90) return '#059669'
  if (n >= 75) return '#2563eb'
  if (n >= 60) return '#d97706'
  return '#dc2626'
}

export default function SubjectReport({ students }) {
  const [dept,      setDept]      = useState('CSE')
  const [sem,       setSem]       = useState(1)
  const [subs,      setSubs]      = useState([])
  const [expanded,  setExpanded]  = useState(null)
  const [sortBy,    setSortBy]    = useState('default')
  const [filterMin, setFilterMin] = useState('')

  const dc = DEPT[dept]?.color ?? '#2563eb'
  const deptStudents  = Object.values(students).filter(s => s.dept === dept)
  const totalStudents = deptStudents.length

  useEffect(() => {
    getSubjectsAPI(dept, sem)
      .then(res => setSubs(res.data))
      .catch(() => setSubs([]))
  }, [dept, sem])

  const subjectStats = useMemo(() => {
    return subs.map(sub => ({
      ...sub,
      stats: calcSubjectStats(sub.code, dept, students),
    }))
  }, [subs, dept, students])

  const sorted = useMemo(() => {
    let list = [...subjectStats]
    if (sortBy === 'passRate') list.sort((a,b) => parseFloat(b.stats?.passRate??0) - parseFloat(a.stats?.passRate??0))
    else if (sortBy === 'avg') list.sort((a,b) => parseFloat(b.stats?.avg??0) - parseFloat(a.stats?.avg??0))
    else if (sortBy === 'fail') list.sort((a,b) => (b.stats?.fail??0) - (a.stats?.fail??0))
    if (filterMin) list = list.filter(s => parseFloat(s.stats?.passRate??0) >= parseFloat(filterMin))
    return list
  }, [subjectStats, sortBy, filterMin])

  const summary = useMemo(() => {
    const withData = subjectStats.filter(s => s.stats)
    if (!withData.length) return null
    const totalEntries = withData.reduce((a,s) => a + s.stats.total, 0)
    const totalPass    = withData.reduce((a,s) => a + s.stats.pass, 0)
    const totalFail    = withData.reduce((a,s) => a + s.stats.fail, 0)
    const overallAvg   = (withData.reduce((a,s) => a + parseFloat(s.stats.avg) * s.stats.total, 0) / totalEntries).toFixed(1)
    const overallPass  = ((totalPass / totalEntries) * 100).toFixed(1)
    return { totalEntries, totalPass, totalFail, overallAvg, overallPass, subjects: withData.length }
  }, [subjectStats])

  const GRADE_COLORS = { O:'#d97706','A+':'#059669',A:'#2563eb','B+':'#7c3aed',B:'#7c3aed',C:'#64748b',F:'#dc2626' }

  return (
    <>
      <div className="page-title">Subject Report</div>
      <div className="page-sub">Department × Semester — Pass / Fail / Average analysis</div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:18, alignItems:'flex-end' }}>
        <div>
          <label className="field-label no-mt">Department</label>
          <select className="field-input" style={{ width:220 }}
            value={dept} onChange={e => { setDept(e.target.value); setExpanded(null) }}>
            {Object.entries(DEPT).map(([k,v]) => <option key={k} value={k}>{k} — {v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label no-mt">Semester</label>
          <select className="field-input" style={{ width:140 }}
            value={sem} onChange={e => { setSem(+e.target.value); setExpanded(null) }}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label no-mt">Sort By</label>
          <select className="field-input" style={{ width:160 }}
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Default Order</option>
            <option value="passRate">Pass Rate ↓</option>
            <option value="avg">Average ↓</option>
            <option value="fail">Most Failures ↓</option>
          </select>
        </div>
        <div>
          <label className="field-label no-mt">Min Pass %</label>
          <input type="number" min="0" max="100" className="field-input" style={{ width:110 }}
            placeholder="e.g. 60" value={filterMin}
            onChange={e => setFilterMin(e.target.value)} />
        </div>
        {filterMin && (
          <button className="btn-sm"
            style={{ background:'var(--bdr)', color:'var(--mut)', marginBottom:1 }}
            onClick={() => setFilterMin('')}>✕ Clear</button>
        )}
      </div>

      {summary ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
          {[
            ['🏫', totalStudents,           'Total Students',    dc          ],
            ['📚', summary.subjects,        'Subjects w/ Data', 'var(--acc)' ],
            ['✅', summary.totalPass,       'Total Passed',      '#059669'   ],
            ['❌', summary.totalFail,       'Total Failed',      '#dc2626'   ],
            ['📊', summary.overallAvg,     'Overall Avg',       '#d97706'   ],
            ['🎯', summary.overallPass+'%','Overall Pass Rate', 'var(--acc2)'],
          ].map(([ic,v,l,c]) => (
            <div className="stat-card" key={l}>
              <div className="stat-icon">{ic}</div>
              <div className="stat-val" style={{ color:c, fontSize:22 }}>{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background:'var(--sur)', border:'1px solid var(--bdr)', borderRadius:12,
          padding:'32px', textAlign:'center', marginBottom:20, color:'var(--mut)' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
          <div style={{ fontWeight:600, fontSize:14 }}>No marks entered for {dept} Semester {sem}</div>
        </div>
      )}

      <div className="card">
        <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 70px 55px 55px 60px 60px 120px 28px',
          padding:'10px 16px', background:'var(--sur2)', borderBottom:'1px solid var(--bdr)',
          color:'var(--mut)', fontSize:10, fontWeight:700, letterSpacing:'.5px', gap:8, alignItems:'center' }}>
          <div>Code</div><div>Subject Name</div>
          <div style={{textAlign:'center'}}>Students</div>
          <div style={{textAlign:'center'}}>Pass</div>
          <div style={{textAlign:'center'}}>Fail</div>
          <div style={{textAlign:'center'}}>Avg</div>
          <div style={{textAlign:'center'}}>High</div>
          <div>Pass Rate</div><div></div>
        </div>

        {!sorted.length && <div style={{ padding:'20px 16px', color:'var(--mut)', fontSize:13 }}>No subjects found.</div>}

        {sorted.map((sub) => {
          const st = sub.stats
          const isExp = expanded === sub.code
          const pc = st ? parseFloat(st.passRate) : 0
          const bc = barColor(st?.passRate ?? 0)
          return (
            <div key={sub.code}>
              <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 70px 55px 55px 60px 60px 120px 28px',
                padding:'11px 16px', borderBottom:'1px solid var(--bdr)', alignItems:'center', gap:8,
                background: isExp ? 'var(--sur2)' : 'transparent', cursor: st ? 'pointer' : 'default' }}
                onClick={() => st && setExpanded(isExp ? null : sub.code)}>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--acc)', fontSize:10, fontWeight:700 }}>{sub.code}</div>
                <div style={{ fontSize:12, fontWeight:600 }}>{sub.name}</div>
                {st ? (
                  <>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:700, color:'var(--mut)' }}>{st.total}</div>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:700, color:'#059669' }}>{st.pass}</div>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:700, color: st.fail > 0 ? '#dc2626' : 'var(--mut)' }}>{st.fail}</div>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:700 }}>{st.avg}</div>
                    <div style={{ textAlign:'center', fontSize:13, fontWeight:700, color:'#d97706' }}>{st.highest}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700 }}>
                        <span style={{ color:bc }}>{st.passRate}%</span>
                        <span style={{ color:'var(--mut)' }}>{st.pass}/{st.total}</span>
                      </div>
                      <div style={{ background:'var(--bdr)', borderRadius:4, height:6, overflow:'hidden' }}>
                        <div style={{ width:`${pc}%`, height:'100%', background:bc, borderRadius:4 }} />
                      </div>
                    </div>
                    <div style={{ fontSize:14, color:'var(--mut)', textAlign:'center' }}>{isExp ? '▲' : '▼'}</div>
                  </>
                ) : (
                  <div style={{ gridColumn:'3 / 10', color:'var(--mut)', fontSize:11, fontStyle:'italic' }}>— No marks entered —</div>
                )}
              </div>

              {isExp && st && (
                <div style={{ background:`${dc}08`, borderBottom:'1px solid var(--bdr)',
                  padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                  <div style={{ background:'var(--sur)', borderRadius:10, padding:14, border:'1px solid var(--bdr)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--mut)', marginBottom:10 }}>📊 SCORE SUMMARY</div>
                    {[['Highest',st.highest,'#d97706'],['Lowest',st.lowest,'#dc2626'],['Average',st.avg,'#2563eb'],['Total',st.total,'var(--mut)']].map(([l,v,c]) => (
                      <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--bdr)' }}>
                        <span style={{ color:'var(--mut)', fontSize:12 }}>{l}</span>
                        <span style={{ fontWeight:700, fontSize:13, color:c, fontFamily:'var(--font-mono)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'var(--sur)', borderRadius:10, padding:14, border:'1px solid var(--bdr)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--mut)', marginBottom:10 }}>✅ PASS / FAIL</div>
                    <div style={{ display:'flex', gap:10, marginBottom:14 }}>
                      <div style={{ flex:1, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:10, textAlign:'center' }}>
                        <div style={{ fontSize:24, fontWeight:900, color:'#059669', fontFamily:'var(--font-mono)' }}>{st.pass}</div>
                        <div style={{ fontSize:11, color:'#059669', fontWeight:700 }}>PASSED</div>
                      </div>
                      <div style={{ flex:1, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:10, textAlign:'center' }}>
                        <div style={{ fontSize:24, fontWeight:900, color:'#dc2626', fontFamily:'var(--font-mono)' }}>{st.fail}</div>
                        <div style={{ fontSize:11, color:'#dc2626', fontWeight:700 }}>FAILED</div>
                      </div>
                    </div>
                    <div style={{ background:'var(--bdr)', borderRadius:8, height:18, overflow:'hidden' }}>
                      <div style={{ width:`${pc}%`, height:'100%', background:bc, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {pc > 15 && <span style={{ fontSize:11, fontWeight:800, color:'#fff' }}>{st.passRate}%</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ background:'var(--sur)', borderRadius:10, padding:14, border:'1px solid var(--bdr)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--mut)', marginBottom:10 }}>🏅 GRADE DISTRIBUTION</div>
                    {Object.entries(st.gradeDist).sort((a,b) => ['O','A+','A','B+','B','C','F'].indexOf(a[0]) - ['O','A+','A','B+','B','C','F'].indexOf(b[0])).map(([g, n]) => (
                      <div key={g} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                        <div style={{ fontWeight:900, width:26, color:GRADE_COLORS[g]??'#64748b', fontSize:13 }}>{g}</div>
                        <div style={{ flex:1, background:'var(--bdr)', borderRadius:4, height:7, overflow:'hidden' }}>
                          <div style={{ width:`${(n/st.total)*100}%`, height:'100%', background:GRADE_COLORS[g]??'#64748b', borderRadius:4 }} />
                        </div>
                        <div style={{ fontSize:12, fontWeight:700, width:20, textAlign:'right' }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}