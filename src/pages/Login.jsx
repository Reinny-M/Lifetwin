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
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap'
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
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
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
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', display:'flex', overflow:'hidden' }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .lg-input { width:100%; padding:13px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:3px; color:#e8eaf0; font-size:14px; font-family:"DM Sans",sans-serif; font-weight:300; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .lg-input::placeholder { color:rgba(232,234,240,0.2); }
        .lg-input:focus { border-color:rgba(200,245,225,0.35); box-shadow:0 0 0 3px rgba(200,245,225,0.06); }

        .lg-tab { flex:1; padding:10px; border:none; font-size:13px; font-weight:500; cursor:pointer; font-family:"DM Sans",sans-serif; transition:all 0.2s; border-radius:2px; }
        .lg-tab.active { background:#e8eaf0; color:#0a0c0f; }
        .lg-tab.inactive { background:transparent; color:rgba(232,234,240,0.3); }
        .lg-tab.inactive:hover { color:rgba(232,234,240,0.6); }

        .lg-submit { width:100%; background:#e8eaf0; color:#0a0c0f; border:none; padding:14px; border-radius:3px; font-size:14px; font-weight:600; cursor:pointer; font-family:"DM Sans",sans-serif; transition:all 0.2s; letter-spacing:0.01em; }
        .lg-submit:hover:not(:disabled) { background:#fff; transform:translateY(-1px); }
        .lg-submit:disabled { opacity:0.35; cursor:not-allowed; }

        .lg-show-pass { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(232,234,240,0.3); cursor:pointer; display:flex; align-items:center; transition:color 0.2s; }
        .lg-show-pass:hover { color:rgba(232,234,240,0.6); }

        .lg-switch { color:rgba(200,245,225,0.7); font-weight:500; cursor:pointer; transition:opacity 0.2s; }
        .lg-switch:hover { opacity:0.7; }

        .lg-feature-row { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .lg-feature-row:last-child { border-bottom:none; }
      `}</style>

      {/* LEFT — FORM */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(200,245,225,0.04) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ width:'100%', maxWidth:'380px', animation:'fadeUp 0.6s ease both' }}>
          {/* Logo */}
          <div onClick={() => navigate('/')} style={{ display:'inline-flex', alignItems:'center', gap:'10px', cursor:'pointer', marginBottom:'52px' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="4" fill="#e8eaf0"/>
              <circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/>
              <line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily:'"Fraunces", serif', fontSize:'18px', fontWeight:700, color:'#e8eaf0', letterSpacing:'-0.3px' }}>LifeTwin</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom:'36px' }}>
            <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 4vw, 38px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'10px' }}>
              {isLogin ? <>Welcome<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>back.</span></> : <>Create your<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>twin.</span></>}
            </h1>
            <p style={{ color:'rgba(232,234,240,0.3)', fontSize:'14px', lineHeight:1.65, fontWeight:300 }}>
              {isLogin ? 'Sign in to continue simulating your future.' : 'Join thousands building their decision twin.'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display:'flex', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'3px', marginBottom:'28px', gap:'3px' }}>
            {['Sign in','Sign up'].map((label, i) => (
              <button key={label} className={`lg-tab ${(isLogin && i===0)||(!isLogin && i===1) ? 'active' : 'inactive'}`} onClick={() => { setIsLogin(i===0); setError('') }}>{label}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'20px' }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:'8px' }}>Full name</label>
                <input className="lg-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}/>
              </div>
            )}
            <div>
              <label style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:'8px' }}>Email</label>
              <input className="lg-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <label style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.3)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Password</label>
                {isLogin && <span style={{ fontSize:'12px', color:'rgba(232,234,240,0.2)', cursor:'pointer' }}>Forgot?</span>}
              </div>
              <div style={{ position:'relative' }}>
                <input className="lg-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} style={{ paddingRight:'44px' }}/>
                <button className="lg-show-pass" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.7A2 2 0 0 0 9.3 9.5M4.2 4.3C2.9 5.2 2 6.5 2 8c0 2.2 2.7 5 6 5 1.2 0 2.3-.4 3.2-.9M7 3.1C7.3 3 7.6 3 8 3c3.3 0 6 2.8 6 5 0 .8-.3 1.6-.8 2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8c0-2.2 2.7-5 6-5s6 2.8 6 5-2.7 5-6 5-6-2.8-6-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(251,113,133,0.07)', border:'1px solid rgba(251,113,133,0.18)', borderRadius:'3px', padding:'11px 14px', fontSize:'13px', color:'#fca5a5', marginBottom:'16px', fontWeight:300 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink:0 }}>
                <circle cx="6.5" cy="6.5" r="6" stroke="#fca5a5"/>
                <line x1="6.5" y1="3.5" x2="6.5" y2="7.5" stroke="#fca5a5" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="6.5" cy="9.5" r="0.7" fill="#fca5a5"/>
              </svg>
              {error}
            </div>
          )}

          <button className="lg-submit" onClick={handle} disabled={loading} style={{ marginBottom:'20px' }}>
            {loading ? 'Please wait…' : isLogin ? 'Sign in →' : 'Create my twin →'}
          </button>

          <p style={{ textAlign:'center', fontSize:'13px', color:'rgba(232,234,240,0.25)', fontWeight:300 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="lg-switch" onClick={switchMode}>{isLogin ? 'Sign up free' : 'Sign in'}</span>
          </p>
        </div>
      </div>

      {/* RIGHT — BRAND PANEL */}
      <div style={{ flex:1, borderLeft:'1px solid rgba(255,255,255,0.05)', background:'#0d1016', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', position:'relative', overflow:'hidden' }}>
        {/* Subtle grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none' }}/>
        {/* Glow */}
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(200,245,225,0.05) 0%, transparent 65%)', pointerEvents:'none' }}/>

        {/* Icon */}
        <div style={{ width:'64px', height:'64px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'28px', position:'relative', zIndex:1 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="6" stroke="rgba(200,245,225,0.6)" strokeWidth="1.2" fill="none"/>
            <circle cx="14" cy="14" r="12" stroke="rgba(200,245,225,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 4"/>
            <line x1="14" y1="2" x2="14" y2="7.5" stroke="rgba(200,245,225,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="14" y1="20.5" x2="14" y2="26" stroke="rgba(200,245,225,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(22px, 3vw, 30px)', fontWeight:300, letterSpacing:'-0.03em', textAlign:'center', marginBottom:'12px', lineHeight:1.15, position:'relative', zIndex:1 }}>
          Your AI <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>decision twin.</span>
        </h2>
        <p style={{ color:'rgba(232,234,240,0.25)', fontSize:'14px', lineHeight:1.75, textAlign:'center', maxWidth:'300px', marginBottom:'48px', fontWeight:300, position:'relative', zIndex:1 }}>
          A living model of how you think — built to simulate your future before you live it.
        </p>

        {/* Features */}
        <div style={{ width:'100%', maxWidth:'320px', position:'relative', zIndex:1 }}>
          {[
            { label:'Simulate any life decision instantly', color:'rgba(200,245,225,0.7)' },
            { label:'Predict regret before it happens', color:'rgba(232,200,245,0.7)' },
            { label:'See financial projections per path', color:'rgba(200,232,245,0.7)' },
            { label:'Discover hidden behavior patterns', color:'rgba(253,232,200,0.7)' },
          ].map((item, i) => (
            <div key={i} className="lg-feature-row">
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:item.color, flexShrink:0, marginTop:'5px' }}/>
              <span style={{ fontSize:'13px', color:'rgba(232,234,240,0.35)', fontWeight:300, lineHeight:1.5 }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ position:'absolute', bottom:'24px', display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#34d399', display:'inline-block' }}/>
          <span style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.04em' }}>Secured by Supabase · Powered by Claude AI</span>
        </div>
      </div>
    </div>
  )
}
