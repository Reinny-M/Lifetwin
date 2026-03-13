import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const defaultPatterns = [
  { tag:'Decision timing', text:'Your best decisions happen when you take at least 24 hours to reflect. Rushed choices carry a 3× higher regret rate in your profile.', color:'rgba(200,245,225,0.7)' },
  { tag:'Financial pattern', text:'People with your risk profile who invest consistently for 6+ months see 40% better outcomes than those waiting for the perfect moment.', color:'rgba(200,232,245,0.7)' },
  { tag:'Goal alignment', text:'Your decision style means you thrive with accountability. Goals shared with others have a 65% higher completion rate for your archetype.', color:'rgba(253,232,200,0.7)' },
  { tag:'Energy window', text:'Your profile suggests you make clearer decisions in the morning. Consider scheduling high-stakes choices before noon.', color:'rgba(232,200,245,0.7)' },
]

export default function Insights() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [insights, setInsights] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => { if (user) fetchData() }, [user])

  const fetchData = async () => {
    const { data: i } = await supabase.from('weekly_insights').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setInsights(i || [])
    const { data: p, error: profileErr } = await supabase.from('twin_profiles').select('*').eq('user_id', user.id).single()
    if (!profileErr) setProfile(p)
  }

  const stabilityScore = profile?.twin_health_score ?? 74

  return (
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .ins-nav-btn { background:none; border:none; font-family:"DM Sans",sans-serif; font-size:13px; color:rgba(232,234,240,0.35); cursor:pointer; padding:8px 16px; border-radius:3px; transition:all 0.2s; }
        .ins-nav-btn:hover { color:#e8eaf0; background:rgba(255,255,255,0.04); }
        .ins-nav-btn.active { color:#e8eaf0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); }

        .ins-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:28px 32px; transition:border-color 0.2s; }
        .ins-card:hover { border-color:rgba(255,255,255,0.12); }

        .ins-pattern-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:24px; transition:all 0.2s; }
        .ins-pattern-card:hover { border-color:rgba(255,255,255,0.12); transform:translateY(-2px); }

        .ins-live-row { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05); transition:opacity 0.15s; }
        .ins-live-row:last-child { border-bottom:none; }
        .ins-live-row:hover { opacity:0.7; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'60px', background:'rgba(10,12,15,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="4" fill="#e8eaf0"/><circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/><line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontWeight:700, letterSpacing:'-0.3px' }}>LifeTwin</span>
        </div>
        <div style={{ display:'flex', gap:'2px' }}>
          {[{label:'Dashboard',path:'/dashboard'},{label:'Simulate',path:'/simulate'},{label:'My Twin',path:'/profile'},{label:'Insights',path:'/insights'}].map(item => (
            <button key={item.path} className={`ins-nav-btn ${item.path==='/insights'?'active':''}`} onClick={() => navigate(item.path)}>{item.label}</button>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(232,234,240,0.3)', fontFamily:'"DM Sans",sans-serif', fontSize:'12px', padding:'7px 14px', borderRadius:'3px', cursor:'pointer', transition:'all 0.2s' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'88px 48px 80px', position:'relative', zIndex:1 }}>

        {/* HEADER */}
        <div style={{ marginBottom:'52px', animation:'fadeUp 0.6s ease both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
            <div style={{ width:'28px', height:'1px', background:'rgba(253,232,200,0.4)' }}/>
            <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(253,232,200,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Behavioral intelligence</span>
          </div>
          <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(32px, 5vw, 56px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.02, marginBottom:'12px' }}>
            Your weekly <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>insights.</span>
          </h1>
          <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.25)', fontWeight:300 }}>Patterns your twin discovered about how you think and decide.</p>
        </div>

        {/* TOP ROW */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px', animation:'fadeUp 0.6s ease 0.06s both' }}>

          {/* Stability */}
          <div className="ins-card">
            <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Future stability index
            </div>
            <div style={{ fontFamily:'"Fraunces", serif', fontSize:'72px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, color:'rgba(253,232,200,0.85)', marginBottom:'8px' }}>
              {stabilityScore}<span style={{ fontSize:'24px', fontWeight:300, verticalAlign:'super' }}>%</span>
            </div>
            <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.3)', lineHeight:1.65, marginBottom:'20px', fontWeight:300 }}>
              Your life trajectory is stable. Keep building on your current momentum.
            </p>
            <div style={{ height:'3px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${stabilityScore}%`, background:'linear-gradient(90deg, rgba(253,232,200,0.7), rgba(253,232,200,0.3))', borderRadius:'2px' }}/>
            </div>
          </div>

          {/* Insight of week */}
          <div className="ins-card" style={{ borderLeft:'2px solid rgba(200,245,225,0.2)' }}>
            <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Insight of the week
            </div>
            <div style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontStyle:'italic', fontWeight:300, color:'rgba(232,234,240,0.6)', lineHeight:1.75, marginBottom:'20px' }}>
              "Your decision-making is strongest when you combine social input with personal reflection. Seek advice, then decide alone."
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'10px', fontWeight:600, color:'rgba(200,245,225,0.6)', letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', borderRadius:'2px', background:'rgba(200,245,225,0.05)', border:'1px solid rgba(200,245,225,0.15)' }}>
              Impact score: 9 / 10
            </div>
          </div>
        </div>

        {/* PATTERN GRID */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px', marginBottom:'10px', animation:'fadeUp 0.6s ease 0.12s both' }}>
          {defaultPatterns.map((p, i) => (
            <div key={i} className="ins-pattern-card">
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:p.color, flexShrink:0 }}/>
                <div style={{ fontSize:'10px', fontWeight:600, color:p.color, letterSpacing:'0.1em', textTransform:'uppercase' }}>{p.tag}</div>
              </div>
              <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.4)', lineHeight:1.75, fontWeight:300 }}>{p.text}</p>
            </div>
          ))}
        </div>

        {/* LIVE INSIGHTS */}
        <div style={{ animation:'fadeUp 0.6s ease 0.18s both' }}>
          <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'24px 28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase' }}>From your simulations</div>
              <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)', fontWeight:300 }}>{insights.length} insight{insights.length !== 1 ? 's' : ''}</div>
            </div>

            {insights.length === 0 ? (
              <div style={{ textAlign:'center', padding:'28px 0' }}>
                <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.2)', fontWeight:300, lineHeight:1.65 }}>
                  No insights yet. Run your first simulation to start building your behavioral profile.
                </p>
              </div>
            ) : insights.map((ins, i) => (
              <div key={ins.id ?? i} className="ins-live-row">
                <div style={{ width:'32px', height:'32px', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(200,245,225,0.4)', flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.1"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', color:'rgba(232,234,240,0.6)', lineHeight:1.5, marginBottom:'4px', fontWeight:300 }}>{ins.insight_text || ins.text || 'Insight generated'}</div>
                  <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)' }}>
                    {new Date(ins.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
