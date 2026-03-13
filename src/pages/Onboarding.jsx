import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ focus: '', risk: 50, style: '', tags: [] })

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const focuses = [
    { id:'career',        label:'Career & Work',    sub:'Jobs · Growth · Purpose' },
    { id:'finance',       label:'Money & Finance',  sub:'Wealth · Investing · Debt' },
    { id:'relationships', label:'Relationships',    sub:'Love · Family · Friendship' },
    { id:'health',        label:'Health & Fitness', sub:'Body · Mind · Energy' },
    { id:'education',     label:'Education',        sub:'Skills · Learning · Growth' },
    { id:'purpose',       label:'Life Purpose',     sub:'Direction · Meaning · Legacy' },
  ]

  const styles = [
    { id:'analytical', label:'Analytical', desc:'I research thoroughly before deciding' },
    { id:'intuitive',  label:'Intuitive',  desc:'I trust my gut feeling above all' },
    { id:'emotional',  label:'Emotional',  desc:'I follow my heart and feelings' },
    { id:'social',     label:'Social',     desc:'I seek advice from others first' },
  ]

  const behaviorTags = [
    'Perfectionist','Risk-taker','Planner','Spontaneous',
    'Ambitious','Cautious','Creative','Logical',
    'Empathetic','Independent','Competitive','Collaborative',
  ]

  const toggleTag = tag => setData(prev => ({
    ...prev,
    tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
  }))

  // BUG FIX 1: finish() now uses try/catch/finally so loading state
  // always resets even if supabase throws
  const finish = async () => {
    setLoading(true)
    const archetype = data.style === 'analytical' ? 'Strategic Thinker'
      : data.style === 'intuitive' ? 'Intuitive Explorer'
      : data.style === 'emotional' ? 'Heart-Led Dreamer'
      : 'Social Navigator'
    try {
      const { error } = await supabase.from('twin_profiles').upsert({
        user_id: user.id,
        decision_archetype: archetype,
        risk_tolerance_score: data.risk,
        decision_style: data.style,
        primary_goals: [data.focus],
        behavioral_tags: data.tags,
        twin_health_score: 65,
        last_updated: new Date().toISOString(),
      })
      if (error) throw error
      setStep(4)
    } catch (e) {
      console.error('Onboarding save failed:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const riskLabel = data.risk < 30 ? 'Very cautious' : data.risk < 50 ? 'Balanced' : data.risk < 70 ? 'Adventurous' : 'Bold risk-taker'
  const riskColor = data.risk < 30 ? 'rgba(200,232,245,0.8)' : data.risk < 50 ? 'rgba(200,245,225,0.8)' : data.risk < 70 ? 'rgba(253,232,200,0.8)' : 'rgba(251,113,133,0.8)'

  return (
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative', overflow:'hidden' }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .ob-focus-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:20px 18px; cursor:pointer; transition:all 0.2s; }
        .ob-focus-card:hover { border-color:rgba(255,255,255,0.14); transform:translateY(-1px); }
        .ob-focus-card.active { border-color:rgba(200,245,225,0.3); background:rgba(200,245,225,0.03); }
        .ob-focus-card.active .ob-focus-name { color:rgba(200,245,225,0.9); }

        .ob-style-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:18px; cursor:pointer; transition:all 0.2s; }
        .ob-style-card:hover { border-color:rgba(255,255,255,0.14); transform:translateY(-1px); }
        .ob-style-card.active { border-color:rgba(200,245,225,0.3); background:rgba(200,245,225,0.03); }
        .ob-style-card.active .ob-style-label { color:rgba(200,245,225,0.9); }

        .ob-tag { padding:6px 14px; border-radius:2px; border:1px solid rgba(255,255,255,0.07); font-size:12px; cursor:pointer; transition:all 0.2s; color:rgba(232,234,240,0.35); background:rgba(255,255,255,0.02); font-family:"DM Sans",sans-serif; font-weight:400; }
        .ob-tag:hover { border-color:rgba(255,255,255,0.14); color:rgba(232,234,240,0.6); }
        .ob-tag.active { border-color:rgba(200,245,225,0.3); background:rgba(200,245,225,0.04); color:rgba(200,245,225,0.8); }

        .ob-btn-primary { background:#e8eaf0; color:#0a0c0f; border:none; padding:14px 28px; border-radius:3px; font-size:14px; font-weight:600; cursor:pointer; font-family:"DM Sans",sans-serif; transition:all 0.2s; letter-spacing:0.01em; }
        .ob-btn-primary:hover:not(:disabled) { background:#fff; transform:translateY(-1px); }
        .ob-btn-primary:disabled { opacity:0.35; cursor:not-allowed; transform:none; }

        .ob-btn-back { background:transparent; border:1px solid rgba(255,255,255,0.07); color:rgba(232,234,240,0.35); padding:14px 24px; border-radius:3px; font-size:14px; cursor:pointer; font-family:"DM Sans",sans-serif; transition:all 0.2s; }
        .ob-btn-back:hover { border-color:rgba(255,255,255,0.14); color:rgba(232,234,240,0.6); }

        input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:3px; background:rgba(255,255,255,0.07); border-radius:2px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:#e8eaf0; cursor:pointer; border:none; transition:transform 0.15s; }
        input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.15); }
        input[type=range]::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#e8eaf0; cursor:pointer; border:none; }
      `}</style>

      {/* Background grid */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ width:'100%', maxWidth:'560px', position:'relative', zIndex:1 }}>

        {/* STEP 1 — Focus area */}
        {step === 1 && (
          <div style={{ animation:'fadeUp 0.6s ease both' }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', justifyContent:'center', marginBottom:'52px' }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="4" fill="#e8eaf0"/><circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/><line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontWeight:700, letterSpacing:'-0.3px' }}>LifeTwin</span>
            </div>

            <div style={{ marginBottom:'36px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                <div style={{ width:'24px', height:'1px', background:'rgba(200,245,225,0.4)' }}/>
                <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Step 1 of 3</span>
              </div>
              <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 5vw, 40px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'10px' }}>
                What matters<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>most to you?</span>
              </h1>
              <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.3)', fontWeight:300, lineHeight:1.65 }}>
                Choose the area of life you want your twin to focus on first.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'8px', marginBottom:'28px' }}>
              {focuses.map(f => (
                <div key={f.id} className={`ob-focus-card ${data.focus === f.id ? 'active' : ''}`} onClick={() => setData(prev => ({ ...prev, focus: f.id }))}>
                  {data.focus === f.id && (
                    <div style={{ float:'right', marginTop:'-2px' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="rgba(200,245,225,0.5)"/><polyline points="3.5,7 6,9.5 10.5,4.5" stroke="rgba(200,245,225,0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                  <div className="ob-focus-name" style={{ fontSize:'14px', fontWeight:500, color:'rgba(232,234,240,0.7)', marginBottom:'3px', transition:'color 0.2s' }}>{f.label}</div>
                  <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)', fontWeight:300 }}>{f.sub}</div>
                </div>
              ))}
            </div>

            <button className="ob-btn-primary" onClick={() => setStep(2)} disabled={!data.focus} style={{ width:'100%' }}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Risk tolerance */}
        {step === 2 && (
          <div style={{ animation:'fadeUp 0.6s ease both' }}>
            <div style={{ marginBottom:'36px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                <div style={{ width:'24px', height:'1px', background:'rgba(200,245,225,0.4)' }}/>
                <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Step 2 of 3</span>
              </div>
              <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 5vw, 40px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'10px' }}>
                How do you feel<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>about risk?</span>
              </h1>
              <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.3)', fontWeight:300, lineHeight:1.65 }}>
                This shapes how your twin weighs uncertainty in every simulation.
              </p>
            </div>

            <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'32px', marginBottom:'28px' }}>
              {/* Big number */}
              <div style={{ display:'flex', alignItems:'baseline', gap:'8px', marginBottom:'6px' }}>
                <span style={{ fontFamily:'"Fraunces", serif', fontSize:'72px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, color:riskColor }}>{data.risk}</span>
                <span style={{ fontSize:'18px', color:'rgba(232,234,240,0.2)', fontWeight:300 }}>/100</span>
              </div>
              <div style={{ fontSize:'13px', color:riskColor, fontWeight:500, marginBottom:'28px', letterSpacing:'0.02em' }}>{riskLabel}</div>

              {/* Slider */}
              <input
                type="range" min="0" max="100"
                value={data.risk}
                onChange={e => setData(prev => ({ ...prev, risk: parseInt(e.target.value) }))}
                style={{ marginBottom:'10px' }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'rgba(232,234,240,0.2)', fontWeight:300 }}>
                <span>Play it safe</span>
                <span>Take big risks</span>
              </div>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button className="ob-btn-back" onClick={() => setStep(1)}>← Back</button>
              <button className="ob-btn-primary" onClick={() => setStep(3)} style={{ flex:1 }}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Style + Tags */}
        {step === 3 && (
          <div style={{ animation:'fadeUp 0.6s ease both' }}>
            <div style={{ marginBottom:'28px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                <div style={{ width:'24px', height:'1px', background:'rgba(200,245,225,0.4)' }}/>
                <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>Step 3 of 3</span>
              </div>
              <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 5vw, 40px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'10px' }}>
                How do you<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>make decisions?</span>
              </h1>
              <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.3)', fontWeight:300, lineHeight:1.65 }}>
                Pick the style that best describes how you naturally decide.
              </p>
            </div>

            {/* Decision style */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'8px', marginBottom:'28px' }}>
              {styles.map(s => (
                <div key={s.id} className={`ob-style-card ${data.style === s.id ? 'active' : ''}`} onClick={() => setData(prev => ({ ...prev, style: s.id }))}>
                  {data.style === s.id && (
                    <div style={{ float:'right', marginTop:'-2px' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="rgba(200,245,225,0.5)"/><polyline points="3.5,7 6,9.5 10.5,4.5" stroke="rgba(200,245,225,0.8)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                  <div className="ob-style-label" style={{ fontSize:'14px', fontWeight:500, color:'rgba(232,234,240,0.7)', marginBottom:'4px', transition:'color 0.2s' }}>{s.label}</div>
                  <div style={{ fontSize:'12px', color:'rgba(232,234,240,0.25)', fontWeight:300, lineHeight:1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.25)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>
                Your traits <span style={{ color:'rgba(232,234,240,0.15)', fontWeight:300 }}>— pick any that fit</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>
                {behaviorTags.map(tag => (
                  <button key={tag} className={`ob-tag ${data.tags.includes(tag) ? 'active' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:'10px' }}>
              <button className="ob-btn-back" onClick={() => setStep(2)}>← Back</button>
              <button className="ob-btn-primary" onClick={finish} disabled={!data.style || loading} style={{ flex:1 }}>
                {loading ? 'Building your twin…' : 'Build my twin →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Twin reveal */}
        {step === 4 && (
          <div style={{ textAlign:'center', animation:'fadeUp 0.7s ease both' }}>
            {/* Icon */}
            <div style={{ width:'72px', height:'72px', border:'1px solid rgba(200,245,225,0.2)', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="7" stroke="rgba(200,245,225,0.7)" strokeWidth="1.3" fill="none"/>
                <circle cx="16" cy="16" r="13" stroke="rgba(200,245,225,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 4"/>
                <line x1="16" y1="2" x2="16" y2="8.5" stroke="rgba(200,245,225,0.5)" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="16" y1="23.5" x2="16" y2="30" stroke="rgba(200,245,225,0.5)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(28px, 5vw, 44px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'12px' }}>
              Your twin<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>is ready.</span>
            </h1>
            <p style={{ color:'rgba(232,234,240,0.3)', fontSize:'15px', marginBottom:'36px', lineHeight:1.7, fontWeight:300, maxWidth:'380px', margin:'0 auto 36px' }}>
              Your Decision DNA has been built. Your twin is now ready to simulate your future and guide your most important choices.
            </p>

            {/* DNA summary */}
            <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'24px', marginBottom:'24px', textAlign:'left' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Your Decision DNA
              </div>
              {[
                ['Focus area',      focuses.find(f => f.id === data.focus)?.label || data.focus],
                ['Risk score',      `${data.risk} / 100`],
                ['Decision style',  styles.find(s => s.id === data.style)?.label || data.style],
                ['Traits',          data.tags.length > 0 ? data.tags.slice(0, 3).join(', ') + (data.tags.length > 3 ? ` +${data.tags.length - 3}` : '') : 'None selected'],
              ].map(([label, val]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'13px' }}>
                  <span style={{ color:'rgba(232,234,240,0.3)', fontWeight:300 }}>{label}</span>
                  <span style={{ fontWeight:500, color:'rgba(200,245,225,0.7)' }}>{val}</span>
                </div>
              ))}
            </div>

            <button className="ob-btn-primary" onClick={() => navigate('/dashboard')} style={{ width:'100%' }}>
              Go to my dashboard →
            </button>
          </div>
        )}

        {/* Progress bar — steps 1–3 only */}
        {step < 4 && (
          <div style={{ display:'flex', justifyContent:'center', gap:'6px', marginTop:'32px' }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ height:'2px', width: s === step ? '28px' : '8px', borderRadius:'1px', background: s === step ? 'rgba(200,245,225,0.6)' : s < step ? 'rgba(200,245,225,0.25)' : 'rgba(255,255,255,0.07)', transition:'all 0.3s' }}/>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
