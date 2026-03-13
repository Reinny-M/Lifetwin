import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Simulate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('career')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resultsRef = useRef(null)

  const categories = [
    { id:'career', label:'Career', sub:'Job · Growth' },
    { id:'finance', label:'Finance', sub:'Wealth · Investing' },
    { id:'relationships', label:'Love', sub:'Relations · Family' },
    { id:'health', label:'Health', sub:'Fitness · Mind' },
  ]

  const runSimulation = async () => {
    if (!question.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/simulate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ question, category }) })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const parsed = await response.json()
      setResult(parsed)
      await supabase.from('simulations').insert({ user_id:user.id, question_text:question, category, ai_analysis:parsed.ai_analysis, path_a:parsed.path_a, path_b:parsed.path_b, path_c:parsed.path_c, regret_score:parsed.regret_score, recommended_path:parsed.recommended_path })
    } catch (err) {
      setError('Simulation failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result && resultsRef.current) setTimeout(() => resultsRef.current.scrollIntoView({ behavior:'smooth', block:'start' }), 100)
  }, [result])

  const rs = result?.regret_score ?? 0
  const regretColor  = rs < 20 ? 'rgba(200,245,225,0.8)' : rs < 50 ? 'rgba(253,232,200,0.8)' : 'rgba(251,113,133,0.8)'
  const regretBg     = rs < 20 ? 'rgba(200,245,225,0.05)' : rs < 50 ? 'rgba(253,232,200,0.05)' : 'rgba(251,113,133,0.05)'
  const regretBorder = rs < 20 ? 'rgba(200,245,225,0.15)' : rs < 50 ? 'rgba(253,232,200,0.15)' : 'rgba(251,113,133,0.15)'
  const regretLabel  = rs < 20 ? 'Low risk' : rs < 50 ? 'Moderate' : 'High risk'
  const regretDesc   = rs < 20 ? 'Strong alignment with your long-term values. Minimal risk of future regret.' : rs < 50 ? 'Some uncertainty ahead. Proceed with clear intention.' : 'Significant regret risk. Strongly consider the safe path before committing.'

  return (
    <div style={{ minHeight:'100vh', background:'#0a0c0f', fontFamily:'"DM Sans", system-ui, sans-serif', color:'#e8eaf0', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .sim-nav-btn { background:none; border:none; font-family:"DM Sans",sans-serif; font-size:13px; color:rgba(232,234,240,0.35); cursor:pointer; padding:8px 16px; border-radius:3px; transition:all 0.2s; }
        .sim-nav-btn:hover { color:#e8eaf0; background:rgba(255,255,255,0.04); }
        .sim-nav-btn.active { color:#e8eaf0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); }

        .sim-textarea { width:100%; background:none; border:none; outline:none; color:#e8eaf0; font-size:15px; font-family:"DM Sans",sans-serif; font-weight:300; resize:none; padding:22px 80px 22px 24px; line-height:1.7; min-height:84px; }
        .sim-textarea::placeholder { color:rgba(232,234,240,0.18); }

        .sim-cat { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:3px; padding:16px 14px; text-align:center; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden; }
        .sim-cat:hover { border-color:rgba(255,255,255,0.12); transform:translateY(-1px); }
        .sim-cat.active { border-color:rgba(200,245,225,0.25); background:rgba(200,245,225,0.03); }
        .sim-cat.active .sim-cat-name { color:rgba(200,245,225,0.8); }
        .sim-cat-bar { position:absolute; bottom:0; left:0; right:0; height:2px; background:rgba(200,245,225,0.5); transform:scaleX(0); transition:transform 0.2s; }
        .sim-cat:hover .sim-cat-bar { transform:scaleX(0.4); }
        .sim-cat.active .sim-cat-bar { transform:scaleX(1); }

        .sim-path-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:28px 24px; position:relative; overflow:hidden; transition:transform 0.25s, box-shadow 0.25s; }
        .sim-path-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
        .sim-path-card.safe::before   { background:linear-gradient(90deg, transparent, rgba(200,245,225,0.5), transparent); }
        .sim-path-card.risky::before  { background:linear-gradient(90deg, transparent, rgba(251,113,133,0.5), transparent); }
        .sim-path-card.optimal::before{ background:linear-gradient(90deg, transparent, rgba(253,232,200,0.5), transparent); }
        .sim-path-card.optimal { border-color:rgba(253,232,200,0.15); }
        .sim-path-card:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(0,0,0,0.4); }

        .sim-path-badge { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; padding:4px 10px; border-radius:2px; margin-bottom:16px; }
        .sim-path-badge.safe    { background:rgba(200,245,225,0.07);  color:rgba(200,245,225,0.8);  border:1px solid rgba(200,245,225,0.15); }
        .sim-path-badge.risky   { background:rgba(251,113,133,0.07);  color:rgba(251,113,133,0.8);  border:1px solid rgba(251,113,133,0.15); }
        .sim-path-badge.optimal { background:rgba(253,232,200,0.07);  color:rgba(253,232,200,0.8);  border:1px solid rgba(253,232,200,0.15); }

        .sim-bottom-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:28px; transition:border-color 0.2s; }
        .sim-bottom-card:hover { border-color:rgba(255,255,255,0.12); }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0c0f; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'60px', background:'rgba(10,12,15,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="4" fill="#e8eaf0"/><circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/><line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontWeight:700, letterSpacing:'-0.3px' }}>LifeTwin</span>
        </div>
        <div style={{ display:'flex', gap:'2px' }}>
          {[{label:'Dashboard',path:'/dashboard'},{label:'Simulate',path:'/simulate'},{label:'My Twin',path:'/profile'},{label:'Insights',path:'/insights'}].map(item => (
            <button key={item.path} className={`sim-nav-btn ${item.path==='/simulate'?'active':''}`} onClick={() => navigate(item.path)}>{item.label}</button>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(232,234,240,0.3)', fontFamily:'"DM Sans",sans-serif', fontSize:'12px', padding:'7px 14px', borderRadius:'3px', cursor:'pointer', transition:'all 0.2s' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'88px 48px 100px', position:'relative', zIndex:1 }}>

        {/* HERO */}
        <div style={{ marginBottom:'48px', animation:'fadeUp 0.6s ease both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
            <div style={{ width:'28px', height:'1px', background:'rgba(200,245,225,0.4)' }}/>
            <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.55)', letterSpacing:'0.12em', textTransform:'uppercase' }}>AI-Powered simulation</span>
          </div>
          <h1 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(36px, 5.5vw, 60px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.02, marginBottom:'14px' }}>
            Simulate your future,<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>today.</span>
          </h1>
          <p style={{ fontSize:'15px', color:'rgba(232,234,240,0.35)', lineHeight:1.75, maxWidth:'460px', fontWeight:300 }}>
            Ask your digital twin anything. Get three data-driven paths with real probabilities.
          </p>
        </div>

        {/* INPUT */}
        <div style={{ marginBottom:'14px', animation:'fadeUp 0.6s ease 0.08s both' }}>
          <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden', position:'relative', transition:'border-color 0.25s', boxShadow:'none' }}
            onFocus={() => {}} onBlur={() => {}}>
            <textarea className="sim-textarea" value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. What happens if I quit my job and start freelancing in 6 months?" rows={2} onKeyDown={e => { if (e.key === 'Enter' && e.metaKey && !loading) runSimulation() }}/>
            <button onClick={runSimulation} disabled={loading || !question.trim()} aria-label="Run simulation" style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', width:'44px', height:'44px', background: loading || !question.trim() ? 'rgba(255,255,255,0.05)' : '#e8eaf0', color: loading || !question.trim() ? 'rgba(232,234,240,0.2)' : '#0a0c0f', border:'none', borderRadius:'3px', cursor: loading || !question.trim() ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              {loading
                ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation:'spin 1s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18 8"/></svg>
                : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </button>
          </div>
          <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.18)', textAlign:'right', marginTop:'7px', letterSpacing:'0.03em' }}>⌘ + Enter to simulate</div>
        </div>

        {/* CATEGORIES */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'8px', marginBottom:'72px', animation:'fadeUp 0.6s ease 0.14s both' }}>
          {categories.map(cat => (
            <div key={cat.id} className={`sim-cat ${category===cat.id?'active':''}`} onClick={() => setCategory(cat.id)}>
              <div className="sim-cat-bar"/>
              <div className="sim-cat-name" style={{ fontSize:'12px', fontWeight:600, color:'rgba(232,234,240,0.5)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'3px', transition:'color 0.2s' }}>{cat.label}</div>
              <div style={{ fontSize:'10px', color:'rgba(232,234,240,0.2)' }}>{cat.sub}</div>
            </div>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign:'center', padding:'72px 0', animation:'fadeUp 0.4s ease both' }}>
            <div style={{ width:'48px', height:'48px', border:'1px solid rgba(255,255,255,0.08)', borderTop:'1px solid rgba(200,245,225,0.5)', borderRadius:'50%', margin:'0 auto 24px', animation:'spin 1.2s linear infinite' }}/>
            <div style={{ fontFamily:'"Fraunces", serif', fontSize:'18px', fontStyle:'italic', fontWeight:300, color:'rgba(232,234,240,0.6)', marginBottom:'8px' }}>Your twin is thinking…</div>
            <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Building your simulation</div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(251,113,133,0.06)', border:'1px solid rgba(251,113,133,0.15)', borderRadius:'3px', padding:'13px 18px', color:'rgba(251,113,133,0.8)', fontSize:'13px', marginBottom:'28px', fontWeight:300 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink:0 }}><circle cx="6.5" cy="6.5" r="6" stroke="rgba(251,113,133,0.8)"/><line x1="6.5" y1="3.5" x2="6.5" y2="7.5" stroke="rgba(251,113,133,0.8)" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6.5" cy="9.5" r="0.7" fill="rgba(251,113,133,0.8)"/></svg>
            {error}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div ref={resultsRef} style={{ animation:'fadeUp 0.6s ease both' }}>
            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'44px' }}>
              <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}/>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'2px', padding:'5px 14px', fontSize:'11px', color:'rgba(232,234,240,0.3)', letterSpacing:'0.06em' }}>
                <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(200,245,225,0.6)', display:'inline-block' }}/>
                Simulation complete
              </div>
              <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}/>
            </div>

            {/* Question echo */}
            <div style={{ marginBottom:'36px' }}>
              <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ width:'14px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Your question
              </div>
              <div style={{ fontFamily:'"Fraunces", serif', fontSize:'24px', fontStyle:'italic', fontWeight:300, color:'rgba(232,234,240,0.8)', lineHeight:1.4 }}>"{question}"</div>
            </div>

            {/* Analysis */}
            <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'28px 32px', marginBottom:'40px', borderLeft:'2px solid rgba(200,245,225,0.25)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'rgba(200,245,225,0.6)', display:'inline-block' }}/>
                <span style={{ fontSize:'11px', fontWeight:600, color:'rgba(200,245,225,0.6)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Your twin says</span>
              </div>
              <p style={{ fontSize:'15px', color:'rgba(232,234,240,0.55)', lineHeight:1.85, fontWeight:300 }}>{result.ai_analysis}</p>
            </div>

            {/* Paths */}
            <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ width:'14px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Three possible paths
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px', marginBottom:'10px' }}>
              {[{key:'path_a',badge:'Safe path',cls:'safe'},{key:'path_b',badge:'Risky path',cls:'risky'},{key:'path_c',badge:'Optimal path',cls:'optimal'}].map(p => {
                const path = result[p.key]
                if (!path) return null
                return (
                  <div key={p.key} className={`sim-path-card ${p.cls}`}>
                    <div className={`sim-path-badge ${p.cls}`}>{p.badge}</div>
                    <div style={{ fontFamily:'"Fraunces", serif', fontSize:'20px', fontWeight:300, color:'#e8eaf0', marginBottom:'8px', lineHeight:1.2 }}>{path.name}</div>
                    <div style={{ fontSize:'12px', color:'rgba(232,234,240,0.35)', lineHeight:1.8, marginBottom:'20px', fontWeight:300 }}>{path.description}</div>
                    <div style={{ fontFamily:'"Fraunces", serif', fontSize:'52px', fontWeight:700, letterSpacing:'-0.03em', lineHeight:1, color: p.cls==='safe' ? 'rgba(200,245,225,0.8)' : p.cls==='risky' ? 'rgba(251,113,133,0.8)' : 'rgba(253,232,200,0.8)' }}>
                      {path.probability}<span style={{ fontSize:'20px', fontWeight:300, verticalAlign:'super' }}>%</span>
                    </div>
                    <div style={{ fontSize:'10px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'4px', marginBottom:'18px' }}>Success probability</div>
                    <div style={{ height:'1px', background:'rgba(255,255,255,0.05)', marginBottom:'14px' }}/>
                    {[['Risk level',path.risk_level],['Regret risk',`${path.regret_risk}%`],['Timeline',path.timeline],['Happiness',path.happiness_score]].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'9px' }}>
                        <span style={{ fontSize:'10px', color:'rgba(232,234,240,0.2)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{k}</span>
                        <span style={{ fontSize:'12px', fontWeight:500, color:'rgba(232,234,240,0.6)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Bottom row */}
            <div style={{ display:'grid', gridTemplateColumns:'5fr 7fr', gap:'10px' }}>
              <div className="sim-bottom-card">
                <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Regret predictor
                </div>
                <div style={{ fontFamily:'"Fraunces", serif', fontSize:'72px', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, marginBottom:'10px', color:regretColor }}>{rs}%</div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'10px', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', borderRadius:'2px', marginBottom:'14px', color:regretColor, background:regretBg, border:`1px solid ${regretBorder}` }}>
                  <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'currentColor', display:'inline-block' }}/>{regretLabel}
                </div>
                <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.35)', lineHeight:1.8, fontWeight:300 }}>{regretDesc}</p>
              </div>
              <div className="sim-bottom-card">
                <div style={{ fontSize:'11px', fontWeight:500, color:'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:'12px', height:'1px', background:'rgba(232,234,240,0.2)', display:'inline-block' }}/>Key insight
                </div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'10px', fontWeight:600, color:'rgba(253,232,200,0.7)', letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', borderRadius:'2px', marginBottom:'14px', background:'rgba(253,232,200,0.05)', border:'1px solid rgba(253,232,200,0.15)' }}>
                  Recommended: Path {result.recommended_path}
                </div>
                <div style={{ fontFamily:'"Fraunces", serif', fontSize:'17px', fontStyle:'italic', color:'rgba(232,234,240,0.55)', lineHeight:1.85, fontWeight:300 }}>{result.key_insight}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
