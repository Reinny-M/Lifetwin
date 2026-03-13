import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [simulations, setSimulations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  // BUG FIX 1: .single() throws on no-row — added error guard
  // BUG FIX 2: setLoading(false) moved to finally so it always runs
  const fetchData = async () => {
    try {
      const { data: p, error: profileErr } = await supabase
        .from('twin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (!profileErr) setProfile(p)

      const { data: s } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setSimulations(s || [])
    } catch (e) {
      console.error('Profile fetch error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const userName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there'
  const initials = userName.slice(0, 2).toUpperCase()

  const traits = [
    { label: 'Analytical thinking', score: profile?.decision_style === 'analytical' ? 85 : 45 },
    { label: 'Risk tolerance',      score: profile?.risk_tolerance_score ?? 50 },
    { label: 'Follow-through',      score: 70 },
    { label: 'Emotional intelligence', score: profile?.decision_style === 'emotional' ? 90 : 60 },
    { label: 'Social influence',    score: profile?.decision_style === 'social' ? 88 : 40 },
  ]

  const goalAlignments = [
    { label: 'Career growth',      score: 78, color: 'rgba(200,245,225,0.8)' },
    { label: 'Financial health',   score: 54, color: 'rgba(200,232,245,0.8)' },
    { label: 'Personal wellbeing', score: 82, color: 'rgba(253,232,200,0.8)' },
    { label: 'Relationships',      score: 61, color: 'rgba(232,200,245,0.8)' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', overflowX:'hidden' }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes barGrow { from{width:0} to{width:var(--w)} }

        .pf-nav-btn { background:none; border:none; font-family:"DM Sans",sans-serif; font-size:13px; color:rgba(232,234,240,0.35); cursor:pointer; padding:8px 16px; border-radius:3px; transition:all 0.2s; }
        .pf-nav-btn:hover { color:#e8eaf0; background:rgba(255,255,255,0.04); }
        .pf-nav-btn.active { color:#e8eaf0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); }

        .pf-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:28px; transition:border-color 0.2s; }
        .pf-card:hover { border-color:rgba(255,255,255,0.12); }

        .pf-stat-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:20px 22px; transition:border-color 0.2s; }
        .pf-stat-card:hover { border-color:rgba(255,255,255,0.12); }

        .pf-tag { padding:5px 14px; border-radius:2px; border:1px solid rgba(200,245,225,0.15); background:rgba(200,245,225,0.04); font-size:12px; color:rgba(200,245,225,0.7); font-weight:400; letter-spacing:0.02em; }

        .pf-cta-btn { background:#e8eaf0; color:#0a0c0f; border:none; border-radius:3px; padding:12px 24px; font-family:"DM Sans",sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .pf-cta-btn:hover { background:#fff; }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0c0f; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.07); border-radius:2px; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'60px', background:'rgba(10,12,15,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="4" fill="#e8eaf0"/><circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/><line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontWeight:700, letterSpacing:'-0.3px' }}>LifeTwin</span>
        </div>
        <div style={{ display:'flex', gap:'2px' }}>
          {[{label:'Dashboard',path:'/dashboard'},{label:'Simulate',path:'/simulate'},{label:'My Twin',path:'/profile'},{label:'Insights',path:'/insights'}].map(item => (
            <button key={item.path} className={`pf-nav-btn ${item.path==='/profile'?'active':''}`} onClick={() => navigate(item.path)}>{item.label}</button>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(232,234,240,0.3)', fontFamily:'"DM Sans",sans-serif', fontSize:'12px', padding:'7px 14px', borderRadius:'3px', cursor:'pointer', transition:'all 0.2s' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'88px 48px 80px', position:'relative', zIndex:1 }}>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ width:'40px', height:'40px', border:'1px solid rgba(255,255,255,0.08)', borderTop:'1px solid rgba(200,245,225,0.5)', borderRadius:'50%', margin:'0 auto 20px', animation:'spin 1.2s linear infinite' }}/>
            <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.25)', fontWeight:300 }}>Loading your twin…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* NO PROFILE */}
        {!loading && !profile && (
          <div style={{ textAlign:'center', padding:'80px 0', animation:'fadeUp 0.6s ease both' }}>
            <div style={{ width:'64px', height:'64px', border:'1px solid rgba(200,245,225,0.15)', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="6" stroke="rgba(200,245,225,0.4)" strokeWidth="1.2" fill="none"/>
                <circle cx="14" cy="14" r="12" stroke="rgba(200,245,225,0.15)" strokeWidth="1" fill="none" strokeDasharray="3 4"/>
                <line x1="14" y1="2" x2="14" y2="7.5" stroke="rgba(200,245,225,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="20.5" x2="14" y2="26" stroke="rgba(200,245,225,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'28px', fontWeight:300, letterSpacing:'-0.02em', marginBottom:'10px' }}>
              Your twin isn't built <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>yet.</span>
            </h2>
            <p style={{ color:'rgba(232,234,240,0.3)', fontSize:'14px', marginBottom:'28px', fontWeight:300, lineHeight:1.65 }}>
              Complete onboarding to build your Decision DNA.
            </p>
            <button className="pf-cta-btn" onClick={() => navigate('/onboarding')}>Build my twin →</button>
          </div>
        )}

        {/* PROFILE */}
        {!loading && profile && (
          <div style={{ animation:'fadeUp 0.6s ease both' }}>

            {/* Header — asymmetric */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'32px', alignItems:'start', marginBottom:'20px' }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                  <div style={{ width:'24px', height:'1px', background:'rgba(200,245,225,0.4)' }}/>
                  <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Decision Twin</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'12px' }}>
                  <div style={{ width:'52px', height:'52px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:600, color:'rgba(232,234,240,0.4)', flexShrink:0, background:'rgba(255,255,255,0.03)' }}>{initials}</div>
                  <div>
                    <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(24px, 4vw, 36px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05 }}>{userName}</h1>
                    <div style={{ fontFamily:'"Fraunces", serif', fontSize:'15px', fontStyle:'italic', color:'rgba(232,234,240,0.4)', marginTop:'2px' }}>{profile.decision_archetype}</div>
                  </div>
                </div>
              </div>

              {/* Health score */}
              <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'20px 24px', textAlign:'center', minWidth:'100px' }}>
                <div style={{ fontFamily:'"Fraunces", serif', fontSize:'48px', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1, color:'rgba(200,245,225,0.85)', marginBottom:'4px' }}>{profile.twin_health_score}</div>
                <div style={{ fontSize:'10px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Twin health</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginBottom:'10px' }}>
              {[
                { label:'Simulations run',  val: simulations.length,                   color:'rgba(200,245,225,0.8)' },
                { label:'Risk score',       val:`${profile.risk_tolerance_score}/100`,  color:'rgba(253,232,200,0.8)' },
                { label:'Decision style',   val: profile.decision_style,                color:'rgba(232,200,245,0.8)' },
              ].map(s => (
                <div key={s.label} className="pf-stat-card">
                  <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>{s.label}</div>
                  <div style={{ fontFamily:'"Fraunces", serif', fontSize:'28px', fontWeight:700, letterSpacing:'-0.02em', color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Trait bars + Goal alignment — 2 col */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>

              {/* Trait bars */}
              <div className="pf-card">
                <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'22px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Decision DNA traits
                </div>
                {traits.map((trait, i) => (
                  <div key={trait.label} style={{ marginBottom: i < traits.length - 1 ? '18px' : '0' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'7px' }}>
                      <span style={{ color:'rgba(232,234,240,0.4)', fontWeight:300 }}>{trait.label}</span>
                      <span style={{ fontWeight:500, color:'rgba(232,234,240,0.6)', fontFamily:'"Fraunces", serif', fontSize:'13px' }}>{trait.score}%</span>
                    </div>
                    <div style={{ height:'2px', background:'rgba(255,255,255,0.05)', borderRadius:'1px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${trait.score}%`, background:'linear-gradient(90deg, rgba(200,245,225,0.6), rgba(200,245,225,0.25))', borderRadius:'1px', transition:'width 0.8s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Goal alignment */}
              <div className="pf-card">
                <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'22px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Goal alignment
                </div>
                {goalAlignments.map((goal, i) => (
                  <div key={goal.label} style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom: i < goalAlignments.length - 1 ? '16px' : '0' }}>
                    <div style={{ width:'110px', fontSize:'12px', color:'rgba(232,234,240,0.35)', fontWeight:300, flexShrink:0 }}>{goal.label}</div>
                    <div style={{ flex:1, height:'2px', background:'rgba(255,255,255,0.05)', borderRadius:'1px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${goal.score}%`, background:`linear-gradient(90deg, ${goal.color}, ${goal.color.replace('0.8','0.3')})`, borderRadius:'1px', transition:'width 0.8s ease' }}/>
                    </div>
                    <div style={{ width:'36px', textAlign:'right', fontFamily:'"Fraunces", serif', fontSize:'13px', fontWeight:700, color:goal.color, flexShrink:0 }}>{goal.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral tags */}
            {profile.behavioral_tags && profile.behavioral_tags.length > 0 && (
              <div className="pf-card">
                <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Behavioral traits
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>
                  {profile.behavioral_tags.map(tag => (
                    <span key={tag} className="pf-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
