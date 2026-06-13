import React, { useState, useEffect } from 'react'
import { getMyMarks }     from '../api/marksAPI'
import { getSubjectsAPI } from '../api/subjectAPI'
import { DEPT }           from '../data/departments'
import { getGrade, mkKey, calcGPA } from '../hooks/useGrades'
import GradeScaleTable from '../components/GradeScaleTable'
import '../styles/StudentPage.css'

export default function StudentPage({ user, onLogout }) {
  const [marks,   setMarks]   = useState({})
  const [subs,    setSubs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [sem,     setSem]     = useState(user.semester ?? 1)
  const [view,    setView]    = useState('result')

  const dept     = user.dept ?? 'CSE'
  const deptName = DEPT[dept]?.name ?? dept
  const dc       = DEPT[dept]?.color ?? '#1e40af'
  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0,2) ?? 'ST'

  useEffect(() => {
    getMyMarks()
      .then(res => setMarks(res.data.marks ?? {}))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getSubjectsAPI(dept, sem)
      .then(res => setSubs(res.data))
      .catch(() => setSubs([]))
  }, [dept, sem])

  const total  = subs.length
  const passed = subs.filter(s => {
    const m = marks[mkKey(dept, sem, s.code)]
    return m && +m.int + +m.ext >= 40
  }).length
  const failed = total - passed
  const gpa = calcGPA(subs.map(s => {
    const m = marks[mkKey(dept, sem, s.code)] ?? {}
    return { int: m.int ?? '', ext: m.ext ?? '' }
  }))

  const navItems = [
    { id:'result',  icon:'📋', label:'My Result'   },
    { id:'profile', icon:'👤', label:'Profile'     },
    { id:'scale',   icon:'🏅', label:'Grade Scale' },
  ]

  return (
    <div className="student-layout">

      {/* ══ SIDEBAR ══ */}
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">🎓</div>
          <div>
            <div className="student-brand-name">EduResult</div>
            <div className="student-brand-sub">Student Portal</div>
          </div>
        </div>

        <div className="student-profile-card">
          <div className="student-avatar" style={{ background:`linear-gradient(135deg,${dc},#0f766e)` }}>
            {initials}
          </div>
          <div className="student-profile-name">{user.name}</div>
          <div className="student-profile-reg">{user.regNo}</div>
          <div className="student-profile-tag">{dept} · Sem {user.semester}</div>
        </div>

        <nav className="student-nav">
          <div className="student-nav-section">Menu</div>
          {navItems.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setView(id)}
              className={`student-nav-item${view===id?' active':''}`}>
              <span className="student-nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="student-sidebar-footer">
          <button onClick={onLogout} className="student-logout-btn">
            <span className="student-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="student-main">

        {/* ── RESULT VIEW ── */}
        {view === 'result' && (
          <>
            <div className="result-header-card">
              <div className="result-title-bar">
                RESULT FOR NOV. / DEC. EXAMINATION — 2024
              </div>
              <div className="result-student-info">
                {[['Register Number', user.regNo],['Name', user.name],['Branch', `B.E. ${deptName}`]].map(([l,v]) => (
                  <div key={l}>
                    <div className="result-info-label">{l}</div>
                    <div className="result-info-value">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sem-tabs">
              {[1,2,3,4,5,6,7,8].map(n => (
                <button key={n} onClick={() => setSem(n)}
                  className={`sem-tab-btn${sem===n?' active':''}`}>
                  Sem {n}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="result-loading">Loading result...</div>
            ) : (
              <>
                <div className="result-summary">
                  {[
                    ['Subjects', total,      '#0f2557'],
                    ['Passed',   passed,     '#065f46'],
                    ['Failed',   failed,     '#991b1b'],
                    ['GPA',      gpa ?? '—', '#92400e'],
                  ].map(([l, v, tc]) => (
                    <div key={l} className="result-summary-card" style={{ borderTopColor:tc }}>
                      <div className="result-summary-val" style={{ color:tc }}>{v}</div>
                      <div className="result-summary-lbl">{l}</div>
                    </div>
                  ))}
                </div>

                <div className="result-table-wrap">
                  <table className="result-table">
                    <thead>
                      <tr>
                        {['Sem','Code','Subject Name','Int(40)','Ext(60)','Total','Grade','Result'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {!subs.length && (
                        <tr><td colSpan={8} className="result-empty">No subjects for Semester {sem}</td></tr>
                      )}
                      {subs.map((sub, i) => {
                        const key  = mkKey(dept, sem, sub.code)
                        const m    = marks[key]
                        const tot  = m ? +m.int + +m.ext : null
                        const gr   = tot !== null ? getGrade(tot) : null
                        const pass = tot !== null && tot >= 40
                        return (
                          <tr key={i} className={i%2===0?'':'alt-row'}>
                            <td className="center">{String(sem).padStart(2,'0')}</td>
                            <td className="code-cell">{sub.code}</td>
                            <td>{sub.name}</td>
                            <td className="center mono">{m ? m.int : '—'}</td>
                            <td className="center mono">{m ? m.ext : '—'}</td>
                            <td className="center mono bold" style={{ color:gr?gr.c:'#94a3b8' }}>{tot ?? '—'}</td>
                            <td className="center bold" style={{ color:gr?gr.c:'#94a3b8' }}>{gr?.g ?? '—'}</td>
                            <td className="center">
                              {gr ? (
                                <span className={`result-badge ${pass?'pass':'fail'}`}>
                                  {pass ? 'PASS' : 'FAIL'}
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        )
                      })}
                      {gpa && (
                        <tr className="gpa-row">
                          <td colSpan={5}>SEMESTER GRADE POINT AVERAGE</td>
                          <td colSpan={3} className="center gpa-val">{gpa}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="result-disclaimer">
                  <strong>Disclaimer:</strong> The result published here is provisional only.
                  The Final Mark Sheets issued by the University should be treated as authentic & final.
                  These Provisional Results will be considered further only based on DOTE approval.
                </div>
              </>
            )}
          </>
        )}

        {/* ── PROFILE VIEW ── */}
        {view === 'profile' && (
          <>
            <div className="page-title">My Profile</div>
            <div className="page-sub">Student information & details</div>
            <div className="profile-card">
              <div className="profile-head" style={{ background:'linear-gradient(135deg,#0f2557,#1e3a8a)' }}>
                <div className="profile-avatar" style={{ background:`linear-gradient(135deg,${dc},#0f766e)` }}>
                  {initials}
                </div>
                <div className="profile-head-name">{user.name}</div>
                <div className="profile-head-reg">{user.regNo}</div>
                <span className="profile-head-tag">{dept}</span>
              </div>
              <div className="profile-body">
                {[
                  ['Register Number', user.regNo, true],
                  ['Full Name',       user.name,  false],
                  ['Department',      deptName,   false],
                  ['Current Semester',`Semester ${user.semester}`, false],
                  ['Role',            'Student',  false],
                ].map(([l, v, mono]) => (
                  <div key={l} className="profile-row">
                    <div className="profile-key">{l}</div>
                    <div className={`profile-val${mono?' mono':''}`}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── GRADE SCALE VIEW ── */}
        {view === 'scale' && (
          <>
            <div className="page-title">Grade Scale</div>
            <div className="page-sub">CBCS Grading System · Anna University</div>
            <GradeScaleTable />
          </>
        )}
      </main>
    </div>
  )
}