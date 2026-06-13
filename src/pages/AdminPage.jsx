import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminPage.css'
import Sidebar          from '../components/Sidebar.jsx'
import GradeScaleTable  from '../components/GradeScaleTable.jsx'
import Dashboard        from '../components/admin/Dashboard.jsx'
import AllStudents      from '../components/admin/AllStudents.jsx'
import AddStudent       from '../components/admin/AddStudent.jsx'
import EnterMarks       from '../components/admin/EnterMarks.jsx'
import ManageSubjects   from '../components/admin/ManageSubjects.jsx'
import Analytics        from '../components/admin/Analytics.jsx'
import ThemePicker      from '../components/admin/ThemePicker.jsx'
import SubjectReport    from '../components/admin/SubjectReport.jsx'
import EditModal        from '../components/admin/EditModal.jsx'
import ResultModal      from '../components/admin/ResultModal.jsx'
import { useStudents }  from '../hooks/useStudents.js'
import { loadLS, saveLS, KEYS } from '../data/storage.js'

export default function AdminPage() {
  const navigate = useNavigate()
  const session  = loadLS(KEYS.adminSession, null)
  if (!session) { navigate('/'); return null }

  const { students, setStudents, extraSubs, setExtraSubs, rdates, setRdates } = useStudents()
  const [view,  setView]  = useState('dash')
  const [theme, setTheme] = useState(() => loadLS(KEYS.theme, 'default'))
  const [modal, setModal] = useState(null)

  // Apply data-theme on <html>
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'default') html.removeAttribute('data-theme')
    else html.setAttribute('data-theme', theme)
    saveLS(KEYS.theme, theme)
    return () => html.removeAttribute('data-theme')
  }, [theme])

  function logout() {
    document.documentElement.removeAttribute('data-theme')
    localStorage.removeItem(KEYS.adminSession)
    navigate('/')
  }

  function nav(id) { return () => setView(id) }

  const navSections = [
    { label:'Students', items:[
      { id:'dash',      icon:'📊', label:'Dashboard',       active:view==='dash',      onClick:nav('dash')      },
      { id:'students',  icon:'👥', label:'All Students',    active:view==='students',  onClick:nav('students')  },
      { id:'add',       icon:'➕', label:'Add Student',     active:view==='add',       onClick:nav('add')       },
      { id:'marks',     icon:'✏️', label:'Enter Marks',     active:view==='marks',     onClick:nav('marks')     },
    ]},
    { label:'Reports', items:[
      { id:'report',    icon:'📋', label:'Subject Report',  active:view==='report',    onClick:nav('report')    },
      { id:'analytics', icon:'📈', label:'Analytics',       active:view==='analytics', onClick:nav('analytics') },
    ]},
    { label:'Academics', items:[
      { id:'subjects',  icon:'📚', label:'Manage Subjects', active:view==='subjects',  onClick:nav('subjects')  },
      { id:'scale',     icon:'🏅', label:'Grade Scale',     active:view==='scale',     onClick:nav('scale')     },
    ]},
    { label:'Settings', items:[
      { id:'theme',     icon:'🎨', label:'Theme & Colors',  active:view==='theme',     onClick:nav('theme')     },
    ]},
  ]

  const shared = { students, setStudents, extraSubs, setExtraSubs, rdates, setRdates }

  return (
    <div className="admin-layout">
      <Sidebar
        brandSub="Institute Portal"
        navSections={navSections}
        bottomSlot={
          <button className="nav-item logout" onClick={logout}>
            <span className="nav-icon">🚪</span>Logout
          </button>
        }
      />

      <main className="admin-main anim-fade-up" key={view}>
        {view==='dash'      && <Dashboard     {...shared} />}
        {view==='students'  && <AllStudents   {...shared} setModal={setModal} />}
        {view==='add'       && <AddStudent    {...shared} />}
        {view==='marks'     && <EnterMarks    {...shared} />}
        {view==='report'    && <SubjectReport students={students} extraSubs={extraSubs} />}
        {view==='subjects'  && <ManageSubjects extraSubs={extraSubs} setExtraSubs={setExtraSubs} />}
        {view==='analytics' && <Analytics     students={students} extraSubs={extraSubs} />}
        {view==='scale'     && <>
          <div className="page-title">CBCS Grade Scale</div>
          <div className="page-sub">Anna University · Theory 40% U.E | Practicals 40% U.E + 1A</div>
          <GradeScaleTable />
        </>}
        {view==='theme' && <ThemePicker theme={theme} setTheme={setTheme} />}
      </main>

      {modal?.type==='edit'   && <EditModal   students={students} setStudents={setStudents} reg={modal.reg} onClose={()=>setModal(null)} />}
      {modal?.type==='result' && <ResultModal students={students} setStudents={setStudents} extraSubs={extraSubs} rdates={rdates} reg={modal.reg} onClose={()=>setModal(null)} />}
    </div>
  )
}