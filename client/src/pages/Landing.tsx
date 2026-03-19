import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero-mesh" style={{ padding: '9rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Floating orbs */}
      <div className="animate-orb" style={{
        position: 'absolute', top: '8%', right: '6%',
        width: 360, height: 360, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)',
      }} />
      <div className="animate-orb" style={{
        position: 'absolute', bottom: '4%', left: '4%',
        width: 260, height: 260, borderRadius: '50%', pointerEvents: 'none', animationDelay: '-5s',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--danger) 10%, transparent), transparent 70%)',
      }} />
      <div className="animate-orb" style={{
        position: 'absolute', top: '50%', left: '35%',
        width: 180, height: 180, borderRadius: '50%', pointerEvents: 'none', animationDelay: '-9s',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--success) 8%, transparent), transparent 70%)',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 999, marginBottom: 30,
          background: 'var(--accent-light)',
          border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
          fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-dark)',
        }}>
          <span>✦</span>
          <span>AI-Powered · Compliance-Grade · Real-Time</span>
          <span>✦</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100" style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.6rem, 6.5vw, 4.2rem)',
          lineHeight: 1.06, letterSpacing: '-0.045em',
          color: 'var(--text-primary)', marginBottom: 22, opacity: 0,
        }}>
          Detect Financial Risk<br />
          <span style={{ position: 'relative', color: 'var(--accent)', display: 'inline-block' }}>
            Before It Escalates
            <svg viewBox="0 0 320 10" style={{
              position: 'absolute', bottom: -4, left: 0, width: '100%', height: 10, overflow: 'visible',
            }}>
              <path d="M 5 6 Q 160 1 315 6" fill="none" stroke="var(--accent)"
                strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up delay-200" style={{
          fontSize: '1.08rem', color: 'var(--text-secondary)',
          maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.72, opacity: 0,
        }}>
          Enterprise-grade transaction risk scoring powered by machine learning and
          deterministic rule engines — built for financial analysts and compliance teams.
        </p>

        {/* CTA row */}
        <div className="animate-fade-up delay-300" style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: 64, opacity: 0,
        }}>
          <Link to="/dashboard" style={{
            textDecoration: 'none', padding: '13px 30px',
            borderRadius: '0.875rem', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '0.95rem',
            background: 'var(--accent)', color: '#0f1117',
            boxShadow: 'var(--shadow-accent)',
            transition: 'all 0.25s', display: 'inline-block',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 14px 48px rgba(234,179,8,0.45)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'none'
              el.style.boxShadow = 'var(--shadow-accent)'
            }}
          >
            Open Dashboard →
          </Link>
          <Link to="/dashboard" style={{
            textDecoration: 'none', padding: '13px 30px',
            borderRadius: '0.875rem', fontFamily: 'var(--font-display)',
            fontWeight: 600, fontSize: '0.95rem',
            background: 'var(--bg-surface)', color: 'var(--text-primary)',
            border: '1.5px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', display: 'inline-block',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--accent)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.transform = 'none'
            }}
          >
            ⚡ Try Sample Transaction
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-400" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, opacity: 0,
        }}>
          {[
            { value: '97.4%', label: 'Detection Accuracy', icon: '🎯' },
            { value: '15', label: 'Risk Parameters', icon: '📊' },
            { value: '<1s', label: 'Analysis Speed', icon: '⚡' },
            { value: 'SOC 2', label: 'Compliance Ready', icon: '✅' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <span className="score-digit" style={{
                fontSize: '1.55rem', fontWeight: 700,
                color: 'var(--text-primary)', lineHeight: 1.2, display: 'block',
              }}>
                {s.value}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: '🧠', title: 'ML Detection Engine',
      desc: 'Gradient boosting model trained on millions of historical tax evasion patterns with 97.4% accuracy.',
      tag: 'AI Model',
    },
    {
      icon: '🛡️', title: 'Rule-Based Engine',
      desc: 'Deterministic compliance rules covering known fraud signatures, duplicate flags, cash patterns, and more.',
      tag: 'Compliance',
    },
    {
      icon: '📈', title: 'Composite Risk Score',
      desc: 'Weighted 0–100 risk score combining both engines, with LOW / MEDIUM / HIGH classification.',
      tag: 'Analytics',
    },
    {
      icon: '⚡', title: 'Real-Time Analysis',
      desc: 'Instant risk assessment on transaction submission with animated dashboards and audit-ready outputs.',
      tag: 'Speed',
    },
    {
      icon: '📋', title: 'Full Audit Trail',
      desc: 'Timestamped prediction history with detailed breakdowns, filterable by risk level and amount.',
      tag: 'Audit',
    },
    {
      icon: '🔌', title: 'API Integration',
      desc: 'Plug into your existing backend or run in Demo Mode with intelligent mock fallback.',
      tag: 'Integration',
    },
  ]

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-dark)', marginBottom: 12 }}>
          Platform Capabilities
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.035em',
          color: 'var(--text-primary)',
        }}>
          Everything compliance teams need
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
          A complete risk intelligence platform with no configuration required.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {features.map(f => (
          <div key={f.title} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: 999, background: 'var(--accent-light)',
                color: 'var(--accent-dark)', letterSpacing: '0.06em',
              }}>
                {f.tag}
              </span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.95rem', color: 'var(--text-primary)',
            }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Enter Transaction', desc: 'Input 15 risk parameters across transaction basics, behavioral signals and financial health groups.' },
    { n: '02', title: 'Dual-Engine Analysis', desc: 'ML model + rule engine process your data in parallel, each producing an independent risk score.' },
    { n: '03', title: 'Get Risk Report', desc: 'A composite 0–100 final score, risk classification, suspicion flag, and top risk indicators.' },
    { n: '04', title: 'Audit & Export', desc: 'All predictions are logged with timestamps in the history table for full compliance audit trails.' },
  ]

  return (
    <section style={{ background: 'var(--bg-elevated)', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-dark)', marginBottom: 12 }}>
            Process
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
          }}>
            How it works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ position: 'relative' }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 22, left: 'calc(100% - 8px)', width: 30,
                  height: 2, background: 'var(--border)', zIndex: 0,
                }} />
              )}
              <div style={{
                background: 'var(--bg-surface)', borderRadius: '1.25rem',
                border: '1px solid var(--border)', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: 'var(--shadow-sm)', position: 'relative', zIndex: 1,
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '1rem', color: 'var(--accent)',
                }}>
                  {s.n}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '0.9rem', color: 'var(--text-primary)',
                }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA BANNER ────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ padding: '5rem 1.5rem' }}>
      <div style={{
        maxWidth: 900, margin: '0 auto', textAlign: 'center',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '1.5rem', padding: '3.5rem 2rem',
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Yellow glow blob */}
        <div style={{
          position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 200, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.035em',
            color: 'var(--text-primary)', marginBottom: 14,
          }}>
            Ready to analyze your first transaction?
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Get started in seconds. No setup required — just open the dashboard and run an analysis.
          </p>
          <Link to="/dashboard" style={{
            textDecoration: 'none', display: 'inline-block',
            padding: '13px 32px', borderRadius: '0.875rem',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
            background: 'var(--accent)', color: '#0f1117',
            boxShadow: 'var(--shadow-accent)', transition: 'all 0.25s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'translateY(-3px) scale(1.02)'
              el.style.boxShadow = '0 16px 52px rgba(234,179,8,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = 'none'
              el.style.boxShadow = 'var(--shadow-accent)'
            }}
          >
            Open Dashboard →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  )
}
