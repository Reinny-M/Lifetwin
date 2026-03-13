import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [simulations, setSimulations] = useState([])
  const [insights, setInsights] = useState([])
  const [question, setQuestion] = useState('')

  useEffect(() => { if (user) { fetchProfile(); fetchSimulations(); fetchInsights() } }, [user])

  const fetchProfile = async () => {
    const { data, error } = await supabase.from('twin_profiles').select('*').eq('user_id', user.id).single()
    if (!error) setProfile(data)
  }
  const fetchSimulations = async () => {
    const { data } = await supabase.from('simulations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    setSimulations(data || [])
  }
  const fetchInsights = async () => {
    const { data } = await supabase.from('weekly_insights').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
    setInsights(data || [])
  }

  const handleSignOut = async () => { await signOut(); navigate('/') }
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .db-nav-btn { background:none; border:none; font-family:"DM Sans",sans-serif; font-size:13px; color:rgba(232,234,240,0.35); cursor:pointer; padding:8px 16px; border-radius:3px; transition:all 0.2s; }
        .db-nav-btn:hover { color:#e8eaf0; background:rgba(255,255,255,0.04); }
        .db-nav-btn.active { color:#e8eaf0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); }

        .db-sim-input { flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:3px; padding:12px 18px; color:#e8eaf0; font-size:14px; outline:none; font-family:"DM Sans",sans-serif; font-weight:300; transition:border-color 0.2s; }
        .db-sim-input::placeholder { color:rgba(232,234,240,0.2); }
        .db-sim-input:focus { border-color:rgba(200,245,225,0.3); }

        .db-go-btn { background:#e8eaf0; color:#0a0c0f; border:none; border-radius:3px; padding:12px 22px; font-family:"DM Sans",sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
        .db-go-btn:hover { background:#fff; }

        .db-chip { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:5px 14px; border-radius:2px; font-size:12px; color:rgba(232,234,240,0.25); cursor:pointer; transition:all 0.2s; }
        .db-chip:hover { border-color:rgba(255,255,255,0.12); color:rgba(232,234,240,0.5); }

        .db-stat-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:22px 24px; transition:border-color 0.2s; }
        .db-stat-card:hover { border-color:rgba(255,255,255,0.12); }

        .db-sim-row { display:flex; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:opacity 0.15s; }
        .db-sim-row:last-child { border-bottom:none; }
        .db-sim-row:hover { opacity:0.7; }

        .db-cta-btn { background:#e8eaf0; color:#0a0c0f; border:none; border-radius:3px; padding:11px 22px; font-family:"DM Sans",sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .db-cta-btn:hover { background:#fff; }

        .db-signout { background:transparent; border:1px solid rgba(255,255,255,0.07); color:rgba(232,234,240,0.25); font-family:"DM Sans",sans-serif; font-size:12px; padding:7px 14px; border-radius:3px; cursor:pointer; transition:all 0.2s; }
        .db-signout:hover { color:rgba(232,234,240,0.5); border-color:rgba(255,255,255,0.12); }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'60px', background:'rgba(10,12,15,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="4" fill="#e8eaf0"/><circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/><line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontWeight:700, letterSpacing:'-0.3px' }}>LifeTwin</span>
        </div>
        <div style={{ display:'flex', gap:'2px' }}>
          {[{label:'Dashboard',path:'/dashboard'},{label:'Simulate',path:'/simulate'},{label:'My Twin',path:'/profile'},{label:'Insights',path:'/insights'}].map(item => (
            <button key={item.path} className={`db-nav-btn ${item.path==='/dashboard'?'active':''}`} onClick={() => navigate(item.path)}>{item.label}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'3px', padding:'5px 12px 5px 6px' }}>
            <div style={{ width:'24px', height:'24px', borderRadius:'2px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:600, color:'rgba(232,234,240,0.4)' }}>{initials}</div>
            <span style={{ fontSize:'12px', color:'rgba(232,234,240,0.4)' }}>{userName}</span>
          </div>
          <button className="db-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'88px 48px 80px', position:'relative', zIndex:1 }}>

        {/* WELCOME — large Fraunces */}
        <div style={{ marginBottom:'40px', animation:'fadeUp 0.6s ease both' }}>
          <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 4vw, 44px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'8px' }}>
            Good day, <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>{userName}.</span>
          </h1>
          <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.25)', fontWeight:300 }}>Your twin is ready to simulate your future.</p>
        </div>

        {/* QUICK SIMULATE */}
        <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'24px', marginBottom:'16px', position:'relative', overflow:'hidden', animation:'fadeUp 0.6s ease 0.06s both' }}>
          <div style={{ position:'absolute', top:0, left:'25%', right:'25%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,245,225,0.25), transparent)' }}/>
          <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(200,245,225,0.55)', display:'inline-block' }}/>
            Ask your twin
          </div>
          <div style={{ display:'flex', gap:'10px', marginBottom:'12px' }}>
            <input className="db-sim-input" value={question} onChange={e => setQuestion(e.target.value)} placeholder="What if I quit my job and started freelancing?" onKeyDown={e => e.key === 'Enter' && question.trim() && navigate('/simulate')}/>
            <button className="db-go-btn" onClick={() => navigate('/simulate')}>Simulate →</button>
          </div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {['Should I take this job?','Where will I be financially?','Am I ready for a relationship?','What if I trained daily?'].map(chip => (
              <span key={chip} className="db-chip" onClick={() => navigate('/simulate')}>{chip}</span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginBottom:'16px', animation:'fadeUp 0.6s ease 0.1s both' }}>
          {[
            { label:'Simulations run', val:simulations.length, color:'rgba(200,245,225,0.8)' },
            { label:'Twin health', val: profile ? `${profile.twin_health_score}%` : '—', color:'rgba(200,232,245,0.8)' },
            { label:'Insights generated', val:insights.length, color:'rgba(253,232,200,0.8)' },
          ].map(s => (
            <div key={s.label} className="db-stat-card">
              <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.25)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>{s.label}</div>
              <div style={{ fontFamily:'"Fraunces", serif', fontSize:'40px', fontWeight:700, letterSpacing:'-0.03em', color:s.color, lineHeight:1 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* 2-COL */}
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'10px', animation:'fadeUp 0.6s ease 0.14s both' }}>

          {/* SIMULATIONS */}
          <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.25)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Recent simulations</div>
              <button onClick={() => navigate('/simulate')} style={{ background:'none', border:'none', color:'rgba(200,245,225,0.5)', fontSize:'12px', cursor:'pointer', fontFamily:'inherit' }}>New →</button>
            </div>
            {simulations.length === 0 ? (
              <div style={{ textAlign:'center', padding:'32px 0' }}>
                <div style={{ width:'40px', height:'40px', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="rgba(232,234,240,0.15)" strokeWidth="1.2"/><circle cx="9" cy="9" r="3" stroke="rgba(232,234,240,0.15)" strokeWidth="1.2"/></svg>
                </div>
                <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.25)', fontWeight:300, marginBottom:'16px', lineHeight:1.6 }}>No simulations yet.<br/>Ask your twin anything to start.</p>
                <button className="db-cta-btn" onClick={() => navigate('/simulate')}>Run first simulation →</button>
              </div>
            ) : simulations.map(sim => (
              <div key={sim.id} className="db-sim-row" onClick={() => navigate('/simulate')}>
                <div style={{ width:'34px', height:'34px', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(232,234,240,0.25)', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', color:'rgba(232,234,240,0.7)', lineHeight:1.4, marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{sim.question_text}</div>
                  <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.25)' }}>{sim.category} · {new Date(sim.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</div>
                </div>
                <div style={{ fontSize:'10px', fontWeight:600, color:'rgba(200,245,225,0.5)', letterSpacing:'0.08em', textTransform:'uppercase', flexShrink:0, border:'1px solid rgba(200,245,225,0.15)', borderRadius:'2px', padding:'3px 9px' }}>Path {sim.recommended_path}</div>
              </div>
            ))}
          </div>

          {/* TWIN STATUS */}
          <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'24px', display:'flex', flexDirection:'column' }}>
            <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.25)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'20px' }}>Twin status</div>
            {profile ? (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
                  <div style={{ width:'40px', height:'40px', border:'1px solid rgba(200,245,225,0.15)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="4" stroke="rgba(200,245,225,0.6)" strokeWidth="1.2" fill="none"/>
                      <circle cx="10" cy="10" r="8" stroke="rgba(200,245,225,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
                      <line x1="10" y1="1.5" x2="10" y2="5.5" stroke="rgba(200,245,225,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="10" y1="14.5" x2="10" y2="18.5" stroke="rgba(200,245,225,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontStyle:'italic', fontWeight:300, color:'rgba(232,234,240,0.7)', marginBottom:'2px' }}>{profile.decision_archetype}</div>
                    <div style={{ fontSize:'12px', color:'rgba(232,234,240,0.25)', fontWeight:300 }}>{profile.decision_style}</div>
                  </div>
                </div>
                <div style={{ fontSize:'10px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>Twin health</div>
                <div style={{ height:'3px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', overflow:'hidden', marginBottom:'8px' }}>
                  <div style={{ height:'100%', width:`${profile.twin_health_score}%`, background:'linear-gradient(90deg, rgba(200,245,225,0.7), rgba(200,245,225,0.3))', borderRadius:'2px', transition:'width 0.6s ease' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(232,234,240,0.2)', marginBottom:'auto' }}>
                  <span>0%</span><span style={{ color:'rgba(200,245,225,0.5)' }}>{profile.twin_health_score}%</span><span>100%</span>
                </div>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'20px', marginTop:'24px' }}>
                  <button className="db-cta-btn" style={{ width:'100%' }} onClick={() => navigate('/profile')}>View full profile →</button>
                </div>
              </>
            ) : (
              <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.25)', fontWeight:300, lineHeight:1.65, marginBottom:'20px' }}>Complete onboarding to build your Decision DNA and unlock your full twin profile.</p>
                <button className="db-cta-btn" onClick={() => navigate('/onboarding')}>Build my twin →</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
