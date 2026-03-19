import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../theme'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark/light mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        border: '1.5px solid var(--border)',
        background: 'var(--bg-elevated)',
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 17,
        transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--accent)'
        el.style.background = 'var(--accent-light)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.background = 'var(--bg-elevated)'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

interface NavbarProps {
  apiStatus?: 'live' | 'demo'
}

export function Navbar({ apiStatus }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className="nav-blur"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 1.5rem', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: 'var(--shadow-sm)', flexShrink: 0,
          }}>
            🛡
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.025em',
          }}>
            Tax<span style={{ color: 'var(--accent)' }}>Sentinel</span>
            <span style={{
              display: 'inline-block', width: 6, height: 6,
              borderRadius: '50%', background: 'var(--accent)',
              marginLeft: 2, verticalAlign: 'super',
            }} />
          </span>
        </Link>

        {/* Center nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/dashboard', label: 'Dashboard' },
          ].map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none', padding: '6px 14px',
                borderRadius: 10, fontSize: '0.875rem', fontWeight: active ? 700 : 500,
                color: active ? 'var(--accent-dark)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-light)' : 'transparent',
                border: `1px solid ${active ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'transparent'}`,
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'var(--text-primary)'
                    el.style.background = 'var(--bg-elevated)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = 'var(--text-secondary)'
                    el.style.background = 'transparent'
                  }
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* API status — only on dashboard */}
          {apiStatus && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999, fontSize: '0.73rem', fontWeight: 700,
              background: apiStatus === 'live' ? 'var(--success-bg)' : 'var(--accent-light)',
              color: apiStatus === 'live' ? 'var(--success)' : 'var(--accent-dark)',
            }}>
              <span className="animate-dot-pulse" style={{
                width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
                background: apiStatus === 'live' ? 'var(--success)' : 'var(--accent)',
              }} />
              {apiStatus === 'live' ? 'API: Live' : 'Demo Mode'}
            </span>
          )}

          {/* Dashboard CTA — only on landing page */}
          {isLanding && (
            <Link to="/dashboard" style={{
              textDecoration: 'none', padding: '7px 16px',
              borderRadius: 10, fontSize: '0.8rem', fontWeight: 700,
              background: 'var(--accent)', color: '#0f1117',
              border: 'none', cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
              transition: 'all 0.2s', fontFamily: 'var(--font-display)',
            }}>
              Open Dashboard →
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
