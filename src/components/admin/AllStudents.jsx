import React, { useState } from 'react'
import { DEPT }          from '../../data/departments'
import { deleteStudent } from '../../api/studentAPI'
import { fmtDate }       from '../../hooks/useGrades'

export default function AllStudents({ students, setStudents, setModal }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const all      = Object.entries(students)
  const filtered = all.filter(([r, s]) =>
    (filter === 'ALL' || s.dept === filter) &&
    (!search || r.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()))
  )

  async function handleDelete(reg) {
    if (!confirm(`Delete ${reg}? This cannot be undone.`)) return
    try {
      await deleteStudent(reg)
      setStudents()
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <>
      <div className="page-title">All Students</div>
      <div className="page-sub">Manage enrolled students across all departments</div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', val: all.length, color: 'var(--acc)', bg: 'var(--sur2)' },
          { label: 'Filtered', val: filtered.length, color: 'var(--ok)', bg: '#f0fdf4' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} style={{ background: bg, border: '1px solid var(--bdr)', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: 'var(--font-mono)' }}>{val}</span>
            <span style={{ fontSize: 11, color: 'var(--mut)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <input className="field-input"
          style={{ maxWidth: 230, padding: '8px 12px', fontSize: 12 }}
          placeholder="🔍 Search name / reg no…"
          value={search} onChange={e => setSearch(e.target.value)} />

        <button className={`filter-tag${filter === 'ALL' ? ' active' : ''}`}
          onClick={() => setFilter('ALL')}>
          All ({all.length})
        </button>

        {Object.entries(DEPT).map(([dk, dv]) => {
          const count = all.filter(([, s]) => s.dept === dk).length
          if (!count) return null
          return (
            <button key={dk}
              className={`filter-tag${filter === dk ? ' active' : ''}`}
              style={filter === dk ? { background: dv.color, borderColor: 'transparent' } : {}}
              onClick={() => setFilter(dk)}>
              {dk} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="card">
        <div className="tbl-head" style={{ gridTemplateColumns: '1.2fr 1.6fr 80px 46px 90px 1fr' }}>
          <div>REG NO</div><div>NAME</div><div>DEPT</div><div>SEM</div><div>JOINED</div><div>ACTIONS</div>
        </div>

        {!filtered.length && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            No students found.
          </div>
        )}

        {filtered.map(([r, s]) => (
          <div key={r} className="tbl-row" style={{ gridTemplateColumns: '1.2fr 1.6fr 80px 46px 90px 1fr' }}>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--acc)', fontSize: 12, fontWeight: 700 }}>{r}</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
            <span className="badge" style={{ background: `${DEPT[s.dept]?.color ?? '#888'}22`, color: DEPT[s.dept]?.color ?? '#888', border: `1px solid ${DEPT[s.dept]?.color ?? '#888'}33` }}>
              {s.dept}
            </span>
            <div style={{ color: 'var(--mut)', fontSize: 12 }}>S{s.semester}</div>
            <div style={{ color: 'var(--mut)', fontSize: 11 }}>{fmtDate(s.createdAt)}</div>
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="btn-xs"
                style={{ background: 'rgba(37,99,235,.12)', color: '#2563eb', borderRadius: 6, padding: '5px 10px' }}
                onClick={() => setModal({ type: 'result', reg: r })}>
                📋 Result
              </button>
              <button className="btn-xs"
                style={{ background: 'rgba(217,119,6,.12)', color: '#d97706', borderRadius: 6, padding: '5px 10px' }}
                onClick={() => setModal({ type: 'edit', reg: r })}>
                ✏️ Edit
              </button>
              <button className="btn-xs"
                style={{ background: 'rgba(220,38,38,.10)', color: 'var(--err)', borderRadius: 6, padding: '5px 10px' }}
                onClick={() => handleDelete(r)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, color: 'var(--mut)', fontSize: 11 }}>
        Showing {filtered.length} of {all.length} students
      </div>
    </>
  )
}