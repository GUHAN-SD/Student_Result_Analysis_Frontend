// ─────────────────────────────────────
//  useGrades.js  —  grade utilities
// ─────────────────────────────────────

export function getGrade(total) {
  const n = Number(total)
  if (n >= 90) return { g: 'O',  p: 10, c: '#d97706' }
  if (n >= 75) return { g: 'A+', p: 9,  c: '#059669' }
  if (n >= 60) return { g: 'A',  p: 8,  c: '#2563eb' }
  if (n >= 50) return { g: 'B+', p: 7,  c: '#7c3aed' }
  if (n >= 45) return { g: 'B',  p: 6,  c: '#7c3aed' }
  if (n >= 40) return { g: 'C',  p: 5,  c: '#64748b' }
  return               { g: 'F',  p: 0,  c: '#dc2626' }
}

export function calcGPA(subjects) {
  const valid = subjects.filter(s => s.int !== '' && s.ext !== '')
  if (!valid.length) return null
  const sum = valid.reduce((a, s) => a + getGrade(+s.int + +s.ext).p, 0)
  return (sum / valid.length).toFixed(2)
}

export function mkKey(dept, sem, code) {
  return `${dept}_${sem}_${code}`   // __ போக்கி _ use பண்ணு
}

export function fmtDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  )
}

export function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function genCaptcha() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}