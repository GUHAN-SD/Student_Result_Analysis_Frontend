import React from 'react'
import '../styles/Sidebar.css'

export default function Sidebar({ brandSub, topSlot, navSections = [], bottomSlot }) {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🎓</div>
          <div>
            <div className="sidebar-brand-name">EduResult</div>
            <div className="sidebar-brand-sub">{brandSub ?? 'Portal'}</div>
          </div>
        </div>
        {topSlot}
      </div>

      {/* College info strip */}
      <div className="sidebar-college">
        Government College of Engineering<br />
        Erode · Affiliated to Anna University
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navSections.map(({ label, items }) => (
          <div key={label}>
            <div className="nav-section">{label}</div>
            {items.map(({ id, icon, label: lbl, active, onClick }) => (
              <button
                key={id}
                className={`nav-item${active ? ' active' : ''}`}
                onClick={onClick}
              >
                <span className="nav-icon">{icon}</span>
                {lbl}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">{bottomSlot}</div>
    </aside>
  )
}