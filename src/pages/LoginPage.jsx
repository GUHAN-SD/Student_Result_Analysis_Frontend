import React, { useState } from 'react'
import { studentLogin, adminLogin } from '../api/authAPI'

export default function LoginPage({ onLogin }) {
  const [tab,      setTab]      = useState('student')
  const [regNo,    setRegNo]    = useState('')
  const [dob,      setDob]      = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err,      setErr]      = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleStudentLogin(e) {
    e.preventDefault()
    if (!regNo.trim() || !dob.trim()) { setErr('Both fields required'); return }
    setLoading(true); setErr('')
    try {
      const res = await studentLogin({ regNo: regNo.trim(), dob: dob.trim() })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user',  JSON.stringify(res.data))
      onLogin(res.data)
    } catch {
      setErr('Invalid register number or date of birth')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) { setErr('Both fields required'); return }
    setLoading(true); setErr('')
    try {
      const res = await adminLogin({ username: username.trim(), password: password.trim() })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user',  JSON.stringify(res.data))
      onLogin(res.data)
    } catch {
      setErr('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:380, padding:32, borderRadius:16, border:'1px solid var(--bdr)', background:'var(--sur)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:28, marginBottom:6 }}>🎓</div>
          <div style={{ fontWeight:800, fontSize:20 }}>Result Portal</div>
          <div style={{ color:'var(--mut)', fontSize:12, marginTop:4 }}>Anna University Results System</div>
        </div>

        {/* Tab */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--sur2)', padding:4, borderRadius:10 }}>
          {['student','admin'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr('') }}
              style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:13,
                background: tab===t ? 'var(--acc)' : 'transparent',
                color: tab===t ? '#fff' : 'var(--mut)' }}>
              {t === 'student' ? '👤 Student' : '🔐 Institute'}
            </button>
          ))}
        </div>

        {/* Student Login */}
        {tab === 'student' && (
          <form onSubmit={handleStudentLogin}>
            <label className="field-label">Register Number</label>
            <input className="field-input" placeholder="e.g. 22CSE15"
              value={regNo} onChange={e => setRegNo(e.target.value)} />

            <label className="field-label">Date of Birth (DD-MM-YYYY)</label>
            <input className="field-input" placeholder="e.g. 16-12-2004"
              value={dob} onChange={e => setDob(e.target.value)} />

            {err && <div className="msg-err">{err}</div>}
            <button type="submit" className="btn-primary"
              style={{ width:'100%', marginTop:16, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>
        )}

        {/* Admin Login */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin}>
            <label className="field-label">Username</label>
            <input className="field-input" placeholder="admin"
              value={username} onChange={e => setUsername(e.target.value)} />

            <label className="field-label">Password</label>
            <input type="password" className="field-input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />

            {err && <div className="msg-err">{err}</div>}
            <button type="submit" className="btn-primary"
              style={{ width:'100%', marginTop:16, opacity: loading ? 0.7 : 1 }}
              disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>
        )}

        <div style={{ marginTop:16, color:'var(--mut)', fontSize:11, textAlign:'center' }}>
          Student: Register No + Date of Birth (DD-MM-YYYY)
        </div>
      </div>
    </div>
  )
}