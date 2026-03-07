import { useState } from 'react'
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

  const handle = async () => {
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
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080f',
      fontFamily: 'outfit, sans-serif',
      color: '#eef0f6',
      display: 'flex',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px #6c63ff; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #6c63ff; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-input:focus {
          outline: none !important;
          border-color: #6c63ff !important;
          box-shadow: 0 0 0 3px rgba(108,99,255,0.15) !important;
        }
        .auth-input::placeholder {
          color: #374151;
        }
        .submit-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 16px 40px rgba(108,99,255,0.5) !important;
        }
        .submit-btn:active {
          transform: translateY(0) !important;
        }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Floating orbs */}
        {[
          { size: 80, top: '15%', left: '8%', delay: '0s', color: 'rgba(108,99,255,0.12)' },
          { size: 50, top: '70%', left: '12%', delay: '1s', color: 'rgba(147,51,234,0.1)' },
          { size: 60, top: '25%', right: '8%', delay: '0.5s', color: 'rgba(236,72,153,0.08)' },
          { size: 40, bottom: '20%', right: '15%', delay: '1.5s', color: 'rgba(108,99,255,0.1)' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            border: '1px solid rgba(108,99,255,0.1)',
            top: orb.top, left: orb.left,
            right: orb.right, bottom: orb.bottom,
            animation: `float ${4 + i * 0.8}s ease-in-out infinite`,
            animationDelay: orb.delay
          }} />
        ))}

        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.7s ease forwards' }}>

          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <div onClick={() => navigate('/')} style={{
              display: 'inline-flex', alignItems: 'center',
              gap: '10px', cursor: 'pointer'
            }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 0 24px rgba(108,99,255,0.4)',
                animation: 'float 3s ease-in-out infinite'
              }}>🧬</div>
              <span style={{ fontWeight: '800', fontSize: '22px', letterSpacing: '-0.5px' }}>LifeTwin</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{
              fontSize: '34px', fontWeight: '800',
              letterSpacing: '-1px', marginBottom: '10px', lineHeight: 1.1
            }}>
              {isLogin ? 'Welcome back 👋' : 'Create your twin 🧬'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6 }}>
              {isLogin
                ? 'Sign in to continue simulating your future'
                : 'Join thousands building their decision twin'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{
            display: 'flex',
            background: '#111520',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '4px',
            marginBottom: '28px'
          }}>
            {['Sign In', 'Sign Up'].map((label, i) => (
              <button key={label}
                onClick={() => { setIsLogin(i === 0); setError('') }}
                style={{
                  flex: 1, padding: '12px',
                  borderRadius: '10px', border: 'none',
                  background: (isLogin && i === 0) || (!isLogin && i === 1)
                    ? 'linear-gradient(135deg, #6c63ff, #7c3aed)'
                    : 'transparent',
                  color: (isLogin && i === 0) || (!isLogin && i === 1) ? 'white' : '#6b7280',
                  fontSize: '14px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'outfit, sans-serif',
                  transition: 'all 0.3s',
                  boxShadow: (isLogin && i === 0) || (!isLogin && i === 1)
                    ? '0 4px 12px rgba(108,99,255,0.3)' : 'none'
                }}
              >{label}</button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Reinhard Maroa Babere"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: '#111520',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', color: '#eef0f6',
                    fontSize: '15px', fontFamily: 'outfit, sans-serif',
                    boxSizing: 'border-box', transition: 'all 0.2s'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: '#111520',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', color: '#eef0f6',
                  fontSize: '15px', fontFamily: 'outfit, sans-serif',
                  boxSizing: 'border-box', transition: 'all 0.2s'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handle()}
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    background: '#111520',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', color: '#eef0f6',
                    fontSize: '15px', fontFamily: 'outfit, sans-serif',
                    boxSizing: 'border-box', transition: 'all 0.2s'
                  }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: '#6b7280', cursor: 'pointer', fontSize: '16px'
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '12px 16px',
              fontSize: '13px', color: '#f87171',
              marginBottom: '20px'
            }}>⚠️ {error}</div>
          )}

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handle}
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? '#1a1640'
                : 'linear-gradient(135deg, #6c63ff, #7c3aed)',
              color: 'white', border: 'none',
              padding: '16px', borderRadius: '14px',
              fontSize: '16px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'outfit, sans-serif',
              boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
              transition: 'all 0.3s', marginBottom: '20px'
            }}
          >
            {loading ? '⏳ Please wait...' : isLogin ? 'Sign In →' : 'Create My Twin →'}
          </button>

          {/* Switch mode */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              style={{ color: '#a78bfa', fontWeight: '700', cursor: 'pointer' }}
            >{isLogin ? 'Sign Up Free' : 'Sign In'}</span>
          </p>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0d0f1e 0%, #130d24 50%, #0d0f1e 100%)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }} />

        {/* Big floating DNA */}
        <div style={{
          fontSize: '100px', marginBottom: '32px',
          animation: 'float 4s ease-in-out infinite',
          filter: 'drop-shadow(0 0 40px rgba(108,99,255,0.4))'
        }}>🧬</div>

        <h2 style={{
          fontSize: '32px', fontWeight: '800',
          letterSpacing: '-1px', marginBottom: '16px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #eef0f6, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Your AI Decision Twin</h2>

        <p style={{
          color: '#6b7280', fontSize: '15px',
          lineHeight: '1.7', textAlign: 'center',
          maxWidth: '340px', marginBottom: '48px'
        }}>
          A living model of how you think, decide, and react — built to simulate your future before you live it.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '340px' }}>
          {[
            { icon: '🔮', text: 'Simulate any life decision instantly' },
            { icon: '💀', text: 'Predict regret before it happens' },
            { icon: '📈', text: 'See financial projections per path' },
            { icon: '💡', text: 'Discover hidden behavior patterns' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '14px 18px',
              animation: `fadeInUp 0.6s ease ${0.2 + i * 0.1}s both`
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', color: '#8892a4', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div style={{
          position: 'absolute', bottom: '32px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#374151'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#10b981', display: 'inline-block',
            animation: 'pulse 2s infinite'
          }} />
          Secured by Supabase · Powered by Claude AI
        </div>
      </div>
    </div>
  )
}