import React, { useState, useEffect } from 'react'
import LoginPage        from './pages/LoginPage'
import Sidebar          from './components/Sidebar'
import Dashboard        from './components/admin/Dashboard'
import AllStudents      from './components/admin/AllStudents'
import AddStudent       from './components/admin/AddStudent'
import EnterMarks       from './components/admin/EnterMarks'
import Analytics        from './components/admin/Analytics'
import ManageSubjects   from './components/admin/ManageSubjects'
import SubjectReport    from './components/admin/SubjectReport'
import StudentPage      from './pages/StudentPage'
import EditModal        from './components/admin/EditModal'
import ResultModal      from './components/admin/ResultModal'
import GradeScaleTable  from './components/GradeScaleTable'
import ThemePicker      from './components/admin/ThemePicker'
import { getStudents }  from './api/studentAPI'

export default function App() {
  const [user,      setUser]      = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [page,      setPage]      = useState('dashboard')
  const [students,  setStudents]  = useState([])
  const [loading,   setLoading]   = useState(false)
  const [modal,     setModal]     = useState(null)
  const [extraSubs, setExtraSubs] = useState({})
  const [rdates,    setRdates]    = useState({})
  const [theme,     setTheme]     = useState(() => localStorage.getItem('theme') || 'default')

  // Apply theme
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'default') html.removeAttribute('data-theme')
    else html.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (user?.role === 'admin') {
      setLoading(true)
      getStudents()
        .then(res => setStudents(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [user])

  const studentsObj = students.reduce((acc, s) => {
    acc[s.regNo] = s
    return acc
  }, {})

  function handleLogin(data) { setUser(data) }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.documentElement.removeAttribute('data-theme')
    setUser(null)
    setStudents([])
  }

  function refreshStudents() {
    getStudents()
      .then(res => setStudents(res.data))
      .catch(console.error)
  }

  if (!user) return <LoginPage onLogin={handleLogin} />

  if (user.role === 'student') {
    return <StudentPage user={user} onLogout={handleLogout} />
  }

  const navSections = [
    { label: 'Students', items: [
      { id:'dashboard', icon:'📊', label:'Dashboard',      active: page==='dashboard', onClick: () => setPage('dashboard') },
      { id:'students',  icon:'👥', label:'All Students',   active: page==='students',  onClick: () => setPage('students')  },
      { id:'add',       icon:'➕', label:'Add Student',    active: page==='add',       onClick: () => setPage('add')       },
      { id:'marks',     icon:'✏️', label:'Enter Marks',    active: page==='marks',     onClick: () => setPage('marks')     },
    ]},
    { label: 'Reports', items: [
      { id:'report',    icon:'📋', label:'Subject Report', active: page==='report',    onClick: () => setPage('report')    },
      { id:'analytics', icon:'📈', label:'Analytics',      active: page==='analytics', onClick: () => setPage('analytics') },
    ]},
    { label: 'Academics', items: [
      { id:'subjects',  icon:'📚', label:'Manage Subjects',active: page==='subjects',  onClick: () => setPage('subjects')  },
      { id:'scale',     icon:'🏅', label:'Grade Scale',    active: page==='scale',     onClick: () => setPage('scale')     },
    ]},
    { label: 'Settings', items: [
      { id:'theme',     icon:'🎨', label:'Theme & Colors', active: page==='theme',     onClick: () => setPage('theme')     },
    ]},
  ]

  const pageProps = {
    students: studentsObj,
    setStudents: () => refreshStudents(),
    extraSubs, setExtraSubs,
    rdates, setRdates,
    setModal,
  }

  return (
    <div className="admin-layout">
      <Sidebar
        brandSub="Institute Portal"
        navSections={navSections}
        bottomSlot={
          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>Logout
          </button>
        }
      />

      <main className="admin-main anim-fade-up" key={page}>
        {loading && (
          <div style={{ color:'var(--mut)', fontSize:13, marginBottom:16 }}>
            Loading students...
          </div>
        )}

        {page === 'dashboard'  && <Dashboard       {...pageProps} />}
        {page === 'students'   && <AllStudents      {...pageProps} />}
        {page === 'add'        && <AddStudent       {...pageProps} onAdded={refreshStudents} />}
        {page === 'marks'      && <EnterMarks       {...pageProps} />}
        {page === 'analytics'  && <Analytics        students={studentsObj} extraSubs={extraSubs} />}
        {page === 'subjects'   && <ManageSubjects   extraSubs={extraSubs} setExtraSubs={setExtraSubs} />}
        {page === 'report'     && <SubjectReport    students={studentsObj} extraSubs={extraSubs} />}
        {page === 'scale'      && (
          <>
            <div className="page-title">CBCS Grade Scale</div>
            <div className="page-sub">Anna University · Theory 40% Internal | 60% External</div>
            <GradeScaleTable />
          </>
        )}
        {page === 'theme'      && <ThemePicker theme={theme} setTheme={setTheme} />}
      </main>

      {modal?.type === 'edit' && (
        <EditModal
          students={studentsObj} setStudents={refreshStudents}
          reg={modal.reg} onClose={() => { setModal(null); refreshStudents() }}
        />
      )}
      {modal?.type === 'result' && (
        <ResultModal
          students={studentsObj} setStudents={refreshStudents}
          extraSubs={extraSubs} rdates={rdates}
          reg={modal.reg} onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}