import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../theme'
import { Sun, Moon, ChevronRight } from 'lucide-react'
import { ImShield } from "react-icons/im";

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark/light mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-[38px] h-[38px] rounded-full border-[1.5px] border-border bg-secondary hover:border-accent hover:bg-accent/10 cursor-pointer flex items-center justify-center text-[17px] transition-all duration-200 shadow-sm text-primary"
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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
      className={`nav-blur fixed top-0 left-0 right-0 z-[100] transition-shadow duration-300 ${scrolled ? 'shadow-md shadow-black/5' : 'shadow-none'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[62px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-[10px] group transition-transform duration-200 active:scale-95">
          <ImShield className='text-accent' size={25} />
          <span className=" font-extrabold text-[1.1rem] text-primary tracking-tight">
            TAX<span className="text-accent group-hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">Sentinel</span>
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-accent ml-[2px] align-super" />
          </span>
        </Link>

        {/* Center nav links */}
        <div className="flex items-center gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/dashboard', label: 'Dashboard' },
          ].map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`no-underline px-[14px] py-[6px] rounded-[10px] text-[0.875rem] transition-all duration-200 ${active
                  ? 'font-bold text-accent bg-accent/10 border-[1px] border-accent/30'
                  : 'font-medium text-text-secondary hover:text-primary hover:bg-secondary'
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-[10px]">
          {/* API status — only on dashboard */}
          {apiStatus && (
            <span className={`flex items-center gap-[6px] px-3 py-[4px] rounded-full text-[0.73rem] font-bold ${apiStatus === 'live'
              ? 'bg-success/10 text-success'
              : 'bg-accent/10 text-accent'
              }`}>
              <span className={`w-[6px] h-[6px] rounded-full inline-block animate-dot-pulse ${apiStatus === 'live' ? 'bg-success' : 'bg-accent'
                }`} />
              {apiStatus === 'live' ? 'API: Live' : 'Demo Mode'}
            </span>
          )}

          {/* Dashboard CTA — only on landing page */}
          {isLanding && (
            <Link
              to="/dashboard"
              className="no-underline px-4 py-[7px] rounded-[10px] text-[0.8rem] font-bold bg-accent text-[#0f1117] hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 active:scale-95  flex items-center gap-1 shadow-accent"
            >
              Open Dashboard <ChevronRight size={16} />
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
