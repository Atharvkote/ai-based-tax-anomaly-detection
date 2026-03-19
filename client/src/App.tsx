import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './theme'

// Lazy-loaded pages
const Landing   = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Full-page loading skeleton shown while a lazy page is loading
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      background: 'var(--bg-base)',
    }}>
      {/* Spinner */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: '4px solid var(--bg-elevated)',
        borderTopColor: 'var(--accent)',
        animation: 'spinRing 0.9s linear infinite',
      }} />
      {/* Brand mark */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          Tax<span style={{ color: 'var(--accent)' }}>Sentinel</span>
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Loading…</p>
      </div>
    </div>
  )
}

// Global style applied once at root
function GlobalStyle() {
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spinRing {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <div style={{
        background: 'var(--bg-base)', color: 'var(--text-primary)',
        transition: 'background 0.3s ease, color 0.3s ease',
        minHeight: '100vh',
      }}>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"           element={<Landing />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              {/* Catch-all → home */}
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}
