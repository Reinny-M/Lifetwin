import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const handle = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (!isLogin && !name.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error) throw error
        navigate('/onboarding')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => { setIsLogin(!isLogin); setError('') }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050811',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#e8eaf0',
      display: 'flex',
      overflow: 'hidden',
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .auth-input {
          width: 100%;
          padding: 13px 16px;
          background: #0c1120;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #e8eaf0;
          font-size: 14px;
          font-family: "DM Sans", sans-serif;
          font-weight: 400;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .auth-input::placeholder { color: #334155; }
        .auth-input:focus {
          border-color: rgba(94,234,212,0.4);
          box-shadow: 0 0 0 3px rgba(94,234,212,0.08);
        }

        .tab-btn {
          flex: 1;
          padding: 11px;
          border-radius: 9px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          letter-spacing: 0.01em;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: #e8eaf0;
          color: #050811;
        }
        .tab-btn.inactive {
          background: transparent;
          color: #475569;
        }
        .tab-btn.inactive:hover { color: #94a3b8; }

        .submit-btn {
          width: 100%;
          background: #e8eaf0;
          color: #050811;
          border: none;
          padding: 14px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          letter-spacing: 0.01em;
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(232,234,240,0.15);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .show-pass-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .show-pass-btn:hover { color: #94a3b8; }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s;
        }
        .feature-row:hover { border-color: rgba(255,255,255,0.1); }

        .switch-link {
          color: #5eead4;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .switch-link:hover { opacity: 0.75; }
      `}</style>

      {/* ── LEFT: FORM ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle teal glow top-left */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '360px', height: '360px',
          background: 'radial-gradient(circle, rgba(94,234,212,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.6s ease both' }}>

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '48px' }}
          >
            <div style={{
              width: '28px', height: '28px',
              background: '#e8eaf0',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" fill="#050811" />
                <circle cx="7" cy="7" r="6" stroke="#050811" strokeWidth="1.5" fill="none" />
                <line x1="7" y1="1" x2="7" y2="4" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="10" x2="7" y2="13" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontWeight: '600', fontSize: '15px', letterSpacing: '-0.3px', color: '#e8eaf0' }}>LifeTwin</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: 'clamp(26px, 4vw, 34px)',
              fontWeight: '300',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '10px',
            }}>
              {isLogin ? (
                <>Welcome back.</>
              ) : (
                <>
                  Create your{' '}
                  <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: '#64748b' }}>twin.</span>
                </>
              )}
            </h1>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.65, fontWeight: 300 }}>
              {isLogin
                ? 'Sign in to continue simulating your future.'
                : 'Join thousands building their decision twin.'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div style={{
            display: 'flex',
            background: '#0c1120',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '13px',
            padding: '4px',
            marginBottom: '28px',
            gap: '4px',
          }}>
            {['Sign in', 'Sign up'].map((label, i) => (
              <button
                key={label}
                className={`tab-btn ${(isLogin && i === 0) || (!isLogin && i === 1) ? 'active' : 'inactive'}`}
                onClick={() => { setIsLogin(i === 0); setError('') }}
              >{label}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Full name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                {isLogin && (
                  <span style={{ fontSize: '12px', color: '#334155', cursor: 'pointer' }}>Forgot?</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handle()}
                  style={{ paddingRight: '44px' }}
                />
                <button className="show-pass-btn" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2l12 12M6.5 6.7A2 2 0 0 0 9.3 9.5M4.2 4.3C2.9 5.2 2 6.5 2 8c0 2.2 2.7 5 6 5 1.2 0 2.3-.4 3.2-.9M7 3.1C7.3 3 7.6 3 8 3c3.3 0 6 2.8 6 5 0 .8-.3 1.6-.8 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8c0-2.2 2.7-5 6-5s6 2.8 6 5-2.7 5-6 5-6-2.8-6-5z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '11px 14px',
              fontSize: '13px', color: '#fca5a5',
              marginBottom: '16px', fontWeight: 300,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6.5" stroke="#fca5a5" />
                <line x1="7" y1="4" x2="7" y2="8" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="10.5" r="0.75" fill="#fca5a5" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="submit-btn" onClick={handle} disabled={loading} style={{ marginBottom: '20px' }}>
            {loading ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create my twin →'}
          </button>

          {/* Switch */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#334155', fontWeight: 300 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="switch-link" onClick={switchMode}>
              {isLogin ? 'Sign up free' : 'Sign in'}
            </span>
          </p>

        </div>
      </div>

      {/* ── RIGHT: BRAND PANEL ── */}
      <div style={{
        flex: 1,
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        background: '#080d1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }} />

        {/* Center glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(94,234,212,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Icon */}
        <div style={{
          width: '72px', height: '72px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '28px',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="7" stroke="#5eead4" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="16" r="14" stroke="rgba(94,234,212,0.3)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            <line x1="16" y1="2" x2="16" y2="9" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="23" x2="16" y2="30" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="16" x2="9" y2="16" stroke="rgba(94,234,212,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="23" y1="16" x2="30" y2="16" stroke="rgba(94,234,212,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: '300',
          letterSpacing: '-0.03em',
          textAlign: 'center',
          marginBottom: '12px',
          lineHeight: 1.15,
        }}>
          Your AI{' '}
          <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: '#64748b' }}>decision twin.</span>
        </h2>

        <p style={{
          color: '#334155',
          fontSize: '14px',
          lineHeight: 1.75,
          textAlign: 'center',
          maxWidth: '320px',
          marginBottom: '48px',
          fontWeight: 300,
        }}>
          A living model of how you think and decide — built to simulate your future before you live it.
        </p>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
          {[
            { label: 'Simulate any life decision instantly', color: '#5eead4' },
            { label: 'Predict regret before it happens', color: '#a78bfa' },
            { label: 'See financial projections per path', color: '#34d399' },
            { label: 'Discover hidden behavior patterns', color: '#fbbf24' },
          ].map((item, i) => (
            <div key={i} className="feature-row" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeUp 0.5s ease both' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: 400 }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom status */}
        <div style={{
          position: 'absolute', bottom: '28px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          <span style={{ fontSize: '11px', color: '#1e293b', letterSpacing: '0.04em', fontWeight: 500 }}>
            Secured by Supabase · Powered by Claude AI
          </span>
        </div>
      </div>
    </div>
  )
}
