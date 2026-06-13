import React from 'react'
import { DEPT } from '../../data/departments.js'
import { getGrade, fmtDate } from '../../hooks/useGrades.js'

export default function Dashboard({ students, rdates }) {
  const all       = Object.entries(students)
  const dc        = Object.keys(DEPT).reduce((a, k) => ({ ...a, [k]: all.filter(([, s]) => s.dept === k).length }), {})
  const mx        = Math.max(...Object.values(dc), 1)
  const datesSet  = Object.values(rdates).filter(Boolean).length
  const withMarks = all.filter(([, s]) => Object.keys(s.marks ?? {}).length > 0).length

  const topRows = Object.keys(DEPT).flatMap(dk => {
    let best = null, bs = 0
    all.filter(([, s]) => s.dept === dk).forEach(([r, s]) => {
      const vals = Object.values(s.marks ?? {})
      if (!vals.length) return
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length
      if (avg > bs) { bs = avg; best = { r, name: s.name, tot: Math.round(avg) } }
    })
    if (!best) return []
    return [{ dk, best, gr: getGrade(best.tot) }]
  })

  return (
    <>
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Overview of all students and performance metrics</div>

      {/* Stat cards */}
      <div className="stat-grid">
        {[
          { ic: '👥', v: all.length,               l: 'Total Students',  c: 'var(--acc)'  },
          { ic: '🏛️', v: Object.keys(DEPT).length, l: 'Departments',     c: 'var(--ok)'   },
          { ic: '📅', v: datesSet,                 l: 'Dates Published', c: 'var(--warn)' },
          { ic: '📝', v: withMarks,                l: 'With Marks',      c: 'var(--acc2)' },
        ].map(({ ic, v, l, c }) => (
          <div className="stat-card" key={l}>
            <div className="stat-icon" style={{ fontSize: 22 }}>{ic}</div>
            <div className="stat-val" style={{ color: c }}>{v}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Dept bar chart */}
        <div className="card card-pad">
          <div style={{ color: 'var(--mut)', fontSize: 10, fontWeight: 700, letterSpacing: '.5px', marginBottom: 16, textTransform: 'uppercase' }}>
            📊 Students Per Department
          </div>
          {Object.entries(DEPT).map(([dk, dv]) => (
            <div key={dk} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ color: dv.color, fontWeight: 700, width: 56, fontSize: 11, flexShrink: 0 }}>{dk}</div>
              <div className="bar-bg" style={{ flex: 1 }}>
                <div className="bar-fill" style={{ width: `${((dc[dk] ?? 0) / mx) * 100}%`, background: dv.color }} />
              </div>
              <div style={{ color: 'var(--mut)', fontSize: 12, width: 22, textAlign: 'right', flexShrink: 0, fontWeight: 700 }}>
                {dc[dk] ?? 0}
              </div>
            </div>
          ))}
        </div>

        {/* Top marks per dept */}
        <div className="card">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bdr)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mut)', letterSpacing: '.5px', textTransform: 'uppercase' }}>
              🏆 Top Mark Per Department
            </div>
          </div>
          <div className="tbl-head" style={{ gridTemplateColumns: '58px 1fr 1fr 50px 46px' }}>
            <div>DEPT</div><div>REG</div><div>NAME</div><div>AVG</div><div>GR</div>
          </div>
          {!topRows.length && (
            <div style={{ padding: '20px 16px', color: 'var(--mut)', fontSize: 12, textAlign: 'center' }}>
              No marks entered yet.
            </div>
          )}
          {topRows.map(({ dk, best, gr }) => (
            <div key={dk} className="tbl-row" style={{ gridTemplateColumns: '58px 1fr 1fr 50px 46px' }}>
              <span className="badge" style={{ background: `${DEPT[dk].color}22`, color: DEPT[dk].color, border: `1px solid ${DEPT[dk].color}33` }}>
                {dk}
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--acc)' }}>{best.r}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{best.name}</div>
              <div style={{ fontWeight: 800, color: gr.c, fontFamily: 'var(--font-mono)' }}>{best.tot}</div>
              <div style={{ fontWeight: 900, color: gr.c, fontSize: 15 }}>{gr.g}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}