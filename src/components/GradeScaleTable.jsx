import React from 'react'

const ROWS = [
  ['≥ 90',   'Outstanding',   'O',     10, '#d97706', '#fef9c3', '🏆'],
  ['75 – 89','Excellent',     'A+',     9, '#059669', '#dcfce7', '⭐'],
  ['60 – 74','Very Good',     'A',      8, '#2563eb', '#dbeafe', '✨'],
  ['50 – 59','Good',          'B+',     7, '#7c3aed', '#ede9fe', '👍'],
  ['45 – 49','Above Average', 'B',      6, '#7c3aed', '#ede9fe', '📈'],
  ['40 – 44','Average',       'C',      5, '#64748b', '#f1f5f9', '📊'],
  ['< 40',   'Fail (RA)',     'F',      0, '#dc2626', '#fee2e2', '❌'],
  ['Absent', 'Not Appeared',  'Ab(NA)', 0, '#dc2626', '#fee2e2', '🚫'],
  ['—',      'Not Eligible',  'IC',     0, '#f97316', '#fff7ed', '⚠️'],
]

export default function GradeScaleTable() {
  return (
    <>
      <div className="page-title">Grade Scale</div>
      <div className="page-sub">
        University grading system — marks to grade point conversion
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { label: 'Max Points', val: '10', color: '#d97706', bg: '#fef9c3' },
          { label: 'Pass Mark',  val: '40%', color: '#059669', bg: '#dcfce7' },
          { label: 'Grades',     val: '7',   color: '#2563eb', bg: '#dbeafe' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} style={{
            background: bg,
            border: `1px solid ${color}30`,
            borderRadius: 10,
            padding: '10px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: 'var(--font-mono)' }}>
              {val}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '.5px', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Grade table card */}
      <div className="card" style={{ borderRadius: 13, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{
          padding: '13px 18px',
          background: 'linear-gradient(135deg, var(--nav), var(--acc2))',
          color: '#fff',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '.3px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          📋 Grading Scale — {new Date().getFullYear()} Regulation
        </div>

        <table className="scale-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 110 }}>Range (%)</th>
              <th>Inference</th>
              <th style={{ width: 90, textAlign: 'center' }}>Grade</th>
              <th style={{ width: 80, textAlign: 'center' }}>Points</th>
              <th style={{ width: 90, textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([range, inference, grade, points, color, bg, icon]) => {
              const isPassing = points > 0
              return (
                <tr key={grade} style={{ transition: '.1s' }}>
                  {/* Range */}
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--txt)',
                      background: 'var(--sur2)',
                      padding: '3px 10px',
                      borderRadius: 6,
                      display: 'inline-block',
                    }}>
                      {range}
                    </span>
                  </td>

                  {/* Inference */}
                  <td style={{ fontSize: 13, color: 'var(--txt)' }}>
                    <span style={{ fontSize: 15, marginRight: 6 }}>{icon}</span>
                    {inference}
                  </td>

                  {/* Grade badge */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      background: bg,
                      color,
                      border: `1.5px solid ${color}40`,
                      borderRadius: 8,
                      padding: '4px 14px',
                      fontWeight: 900,
                      fontSize: 14,
                      fontFamily: 'var(--font-mono)',
                      minWidth: 52,
                      textAlign: 'center',
                    }}>
                      {grade}
                    </span>
                  </td>

                  {/* Points */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: points > 0 ? 18 : 14,
                      color: points > 0 ? color : 'var(--mut)',
                    }}>
                      {points > 0 ? points : '—'}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.3px',
                      background: isPassing ? '#dcfce7' : '#fee2e2',
                      color: isPassing ? '#065f46' : '#991b1b',
                      border: isPassing ? '1px solid #86efac' : '1px solid #fca5a5',
                    }}>
                      {isPassing ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* GPA note */}
      <div style={{
        padding: '14px 18px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 10,
        fontSize: 12,
        color: '#78350f',
        lineHeight: 1.7,
      }}>
        <strong>📌 Note:</strong> CGPA is calculated as the weighted average of grade points earned
        across all subjects. <strong>Ab (NA)</strong> = Absent / Not Appeared.{' '}
        <strong>IC</strong> = Incomplete — student did not meet eligibility criteria (attendance &lt; 75%).
      </div>
    </>
  )
}