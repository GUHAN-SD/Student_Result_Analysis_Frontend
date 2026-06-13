import React from 'react'
import { getGrade, mkKey } from '../hooks/useGrades.js'

export default function MarksTable({ subs, dept, sem, marks, onChange, deptColor, gpa }) {
  const readOnly = !onChange

  return (
    <div className="card">
      <div className="tbl-head" style={{ gridTemplateColumns: '88px 1fr 68px 68px 52px 52px 36px' }}>
        <div>CODE</div><div>SUBJECT</div>
        <div>INT(40)</div><div>EXT(60)</div>
        <div>TOTAL</div><div>GRADE</div><div>PT</div>
      </div>

      {subs.map((sub, i) => {
        const key = mkKey(dept, sem, sub.code)
        const m   = marks[key] ?? { int: '', ext: '' }
        const has = m.int !== '' || m.ext !== ''
        const tot = has ? +m.int + +m.ext : null
        const gr  = tot !== null ? getGrade(tot) : null

        return (
          <div key={i} className="tbl-row"
            style={{ gridTemplateColumns: '88px 1fr 68px 68px 52px 52px 36px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--acc)', fontSize: 10 }}>{sub.code}</div>
            <div style={{ fontSize: 11 }}>{sub.name}</div>

            {readOnly ? (
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {m.int !== '' && m.int !== undefined ? m.int : '—'}
              </div>
            ) : (
              <input type="number" min="0" max="40" className="mark-input"
                value={m.int} placeholder="—"
                onChange={e => onChange(key, 'int', e.target.value, 40)} />
            )}

            {readOnly ? (
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {m.ext !== '' && m.ext !== undefined ? m.ext : '—'}
              </div>
            ) : (
              <input type="number" min="0" max="60" className="mark-input"
                value={m.ext} placeholder="—"
                onChange={e => onChange(key, 'ext', e.target.value, 60)} />
            )}

            <div style={{ fontWeight: 700, fontSize: 13, textAlign: 'center', color: gr ? (gr.g === 'F' ? 'var(--err)' : 'var(--acc)') : 'var(--bdr2)' }}>
              {tot !== null ? tot : '—'}
            </div>
            <div style={{ fontWeight: 900, fontSize: 14, textAlign: 'center', color: gr ? gr.c : 'var(--bdr2)' }}>
              {gr?.g ?? '—'}
            </div>
            <div style={{ color: 'var(--mut)', fontSize: 12, textAlign: 'center' }}>
              {gr?.p ?? ''}
            </div>
          </div>
        )
      })}

      {gpa && (
        <div style={{ padding: '9px 14px', background: 'var(--sur2)', display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 12 }}>
          <span style={{ color: 'var(--mut)' }}>Semester GPA:</span>
          <span style={{ color: deptColor, fontWeight: 900, fontFamily: 'var(--font-mono)' }}>{gpa}</span>
        </div>
      )}
    </div>
  )
}