import React from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 px-6 bg-card">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-6">
        {/* Logo row */}
        <Link to="/" className="flex items-center gap-2 no-underline group hover:opacity-90 transition-opacity">
          <Shield size={24} className="text-primary group-hover:text-accent transition-colors" />
          <span className=" font-extrabold text-[1rem] text-primary">
            Tax<span className="text-accent">Sentinel</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-6">
          {[
            { to: '/', label: 'Home' },
            { to: '/dashboard', label: 'Dashboard' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="no-underline text-[0.8rem] text-text-secondary font-medium hover:text-accent transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[0.75rem] text-text-muted text-center max-w-md leading-relaxed">
            AI-Powered Tax Anomaly Detection System. Built for next-generation financial compliance and real-time risk intelligence.
          </p>
          <p className="text-[0.65rem] text-text-muted/60">
            © {currentYear} TaxSentinel Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
