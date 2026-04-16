import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './theme'

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Full-page loading skeleton shown while a lazy page is loading
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-background">
      {/* Spinner */}
      <div className="w-[52px] h-[52px] rounded-full border-4 border-secondary border-t-accent animate-spin-ring" />
      {/* Brand mark */}
      <div className="text-center">
        <p className=" font-extrabold text-[1.15rem] text-primary tracking-tight">
          Tax<span className="text-accent">Sentinel</span>
        </p>
        <p className="text-[0.78rem] text-text-muted mt-1 font-medium italic">Initializing Analyzers…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="bg-background text-primary transition-colors duration-300 min-h-screen selection:bg-accent/30 selection:text-accent-dark">
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Catch-all → home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}
