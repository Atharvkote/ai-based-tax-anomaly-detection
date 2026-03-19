import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2.5rem 1.5rem',
      background: 'var(--bg-surface)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🛡</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1rem', color: 'var(--text-primary)',
          }}>
            Tax<span style={{ color: 'var(--accent)' }}>Sentinel</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/dashboard', label: 'Dashboard' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none', fontSize: '0.8rem',
              color: 'var(--text-muted)', fontWeight: 500,
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          AI-Powered Tax Evasion Detection · Built for compliance teams
        </p>
      </div>
    </footer>
  )
}
