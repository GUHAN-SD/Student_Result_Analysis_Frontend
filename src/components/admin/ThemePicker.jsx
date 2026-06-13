import React from 'react'

const PORTAL_THEMES = [
  {
    key: 'default',
    name: 'Light Blue Student Portal',
    desc: 'Clean professional blue theme',
    emoji: '🔵',
    preview: {
      bg: '#eef4fb',
      sur: '#ffffff',
      nav: '#1e40af',
      acc: '#2563eb',
      acc2: '#1d4ed8',
    },
  },
  {
    key: 'cream',
    name: 'Cream University',
    desc: 'Warm academic cream & amber',
    emoji: '🟤',
    preview: {
      bg: '#f5f0e8',
      sur: '#fffdf7',
      nav: '#2c1a0e',
      acc: '#b45309',
      acc2: '#92400e',
    },
  },
  {
    key: 'apple',
    name: 'Apple Minimal',
    desc: 'Clean SF-style minimal design',
    emoji: '⚪',
    preview: {
      bg: '#f5f5f7',
      sur: '#ffffff',
      nav: '#f5f5f7',
      acc: '#0071e3',
      acc2: '#0077ed',
    },
  },
]

const COLOR_PREVIEWS = [
  { label: 'Background', val: 'var(--bg)' },
  { label: 'Surface',    val: 'var(--sur)' },
  { label: 'Accent',     val: 'var(--acc)' },
  { label: 'Accent 2',   val: 'var(--acc2)' },
  { label: 'Sidebar',    val: 'var(--nav)' },
  { label: 'Success',    val: 'var(--ok)' },
  { label: 'Warning',    val: 'var(--warn)' },
  { label: 'Error',      val: 'var(--err)' },
]

export default function ThemePicker({ theme, setTheme }) {
  return (
    <>
      <div className="page-title">Theme &amp; Colors</div>
      <div className="page-sub">
        Choose a portal design theme — changes apply instantly across the entire portal
      </div>

      {/* ── Theme selector section ── */}
      <div className="theme-section">
        <div className="theme-section-title">🎨 Select Portal Theme</div>
        <div className="theme-section-sub">3 professionally designed light themes</div>

        <div className="theme-grid">
          {PORTAL_THEMES.map(t => (
            <div
              key={t.key}
              className={`theme-card${theme === t.key ? ' active' : ''}`}
              onClick={() => setTheme(t.key)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setTheme(t.key)}
              aria-pressed={theme === t.key}
            >
              {/* Mini dashboard preview */}
              <div style={{
                display: 'flex',
                borderRadius: 10,
                overflow: 'hidden',
                marginBottom: 12,
                height: 62,
                border: `1px solid rgba(0,0,0,.1)`,
                flexShrink: 0,
              }}>
                {/* Sidebar strip */}
                <div style={{
                  width: 32,
                  background: t.preview.nav,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  padding: '8px 5px',
                  flexShrink: 0,
                }}>
                  {/* Brand icon */}
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: t.preview.acc,
                    marginBottom: 4,
                  }} />
                  {[1, 0.4, 0.4, 0.4].map((op, i) => (
                    <div key={i} style={{
                      height: 3, borderRadius: 2,
                      background: i === 0
                        ? t.preview.acc
                        : `rgba(255,255,255,${op})`,
                      width: i === 0 ? '90%' : '70%',
                    }} />
                  ))}
                </div>

                {/* Content area */}
                <div style={{
                  flex: 1,
                  background: t.preview.bg,
                  padding: '7px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}>
                  {/* Welcome bar */}
                  <div style={{
                    height: 5, borderRadius: 3,
                    background: t.preview.acc,
                    width: '55%',
                  }} />
                  {/* Stat cards row */}
                  <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{
                        flex: 1,
                        background: t.preview.sur,
                        borderRadius: 4,
                        border: `1px solid rgba(0,0,0,.07)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        padding: 3,
                      }}>
                        <div style={{ height: 7, width: '60%', borderRadius: 2, background: t.preview.acc, opacity: .8 }} />
                        <div style={{ height: 3, width: '80%', borderRadius: 2, background: 'rgba(0,0,0,.1)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Swatches */}
              <div className="theme-swatches">
                {[t.preview.bg, t.preview.sur, t.preview.nav, t.preview.acc].map((c, i) => (
                  <div key={i} className="swatch" style={{ background: c }} />
                ))}
              </div>

              {/* Name + desc */}
              <div className="theme-name">
                {t.emoji} {t.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 3, lineHeight: 1.4 }}>
                {t.desc}
              </div>

              {/* Accent bar */}
              <div
                className="theme-bar"
                style={{ background: `linear-gradient(135deg, ${t.preview.acc}, ${t.preview.acc2})` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Current theme colors ── */}
      <div className="theme-section">
        <div className="theme-section-title">🔍 Current Theme Colors</div>
        <div className="theme-section-sub">Live CSS variable preview for the active theme</div>
        <div className="color-preview-grid">
          {COLOR_PREVIEWS.map(({ label, val }) => (
            <div key={label} className="color-preview-item">
              <div
                className="color-dot"
                style={{ background: val }}
              />
              <div className="color-name">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Active theme badge ── */}
      <div style={{
        padding: '14px 18px',
        background: 'var(--sur2)',
        border: '1px solid var(--bdr)',
        borderRadius: 10,
        fontSize: 12,
        color: 'var(--mut)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          background: 'var(--acc)',
          color: '#fff',
          borderRadius: 6,
          padding: '3px 10px',
          fontWeight: 700,
          fontSize: 11,
        }}>
          ACTIVE
        </span>
        <span>
          {PORTAL_THEMES.find(t => t.key === (theme || 'default'))?.name}
          {' '}— theme is applied across all portal pages instantly.
        </span>
      </div>
    </>
  )
}