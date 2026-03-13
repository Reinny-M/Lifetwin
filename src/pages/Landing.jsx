import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,700&family=DM+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { tag: 'Behavioral Core', title: 'Decision DNA', body: 'A living model that learns how you process risk, emotion, and commitment — then reflects it back as foresight.', stat: '97%', statLabel: 'pattern accuracy', accent: '#c8f5e1' },
    { tag: 'Scenario Engine', title: 'Life Simulation', body: 'Run any decision through 3 parallel futures. Each path scored, timed, annotated with gain and cost.', stat: '3×', statLabel: 'paths per decision', accent: '#fde8c8' },
    { tag: 'Emotional Audit', title: 'Regret Predictor', body: 'Your future self has opinions. LifeTwin surfaces them — before it\'s too late to change course.', stat: '89%', statLabel: 'regret reduction', accent: '#e8d5f5' },
    { tag: 'Pattern Discovery', title: 'Weekly Insights', body: 'Every seven days: a private briefing on behavioral trends only an outside observer would notice.', stat: '52×', statLabel: 'insights per year', accent: '#fdf5c8' },
    { tag: 'Wealth Modeling', title: 'Financial Projections', body: 'Your twin models the downstream financial reality of every simulated path, in your currency.', stat: '10Y', statLabel: 'projection horizon', accent: '#c8f5e1' },
    { tag: 'Alignment Score', title: 'Goal Alignment', body: 'A daily score measuring how far today\'s choices are from the life you said you wanted.', stat: '100%', statLabel: 'goal coverage', accent: '#fde8c8' },
  ]

  const testimonials = [
    { quote: 'It saved my business and six figures of capital. I was about to make a decision I\'d have regretted for years.', name: 'Amara K.', role: 'Founder, Lagos', initials: 'AK' },
    { quote: 'I used to spend weeks in analysis paralysis. Now I simulate in twenty minutes and move with confidence.', name: 'James M.', role: 'Engineer, Berlin', initials: 'JM' },
    { quote: 'The weekly insights alone are worth it. I found a self-sabotage pattern I\'d been running for six years.', name: 'Sofia R.', role: 'Med Student, Toronto', initials: 'SR' },
  ]

  return (
    <div style={{ background: '#0a0c0f', color: '#e8eaf0', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes drift { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-14px) rotate(1deg); } }

        .lt-nav-link { color:rgba(232,234,240,0.4); font-size:13px; cursor:pointer; background:none; border:none; font-family:inherit; padding:6px 14px; transition:color 0.2s; }
        .lt-nav-link:hover { color:#e8eaf0; }
        .lt-cta-primary { background:#e8eaf0; color:#0a0c0f; border:none; padding:13px 32px; border-radius:3px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; letter-spacing:0.01em; transition:all 0.2s; }
        .lt-cta-primary:hover { background:#fff; transform:translateY(-1px); }
        .lt-cta-ghost { background:transparent; color:rgba(232,234,240,0.5); border:1px solid rgba(255,255,255,0.1); padding:13px 32px; border-radius:3px; font-size:14px; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .lt-cta-ghost:hover { border-color:rgba(255,255,255,0.25); color:#e8eaf0; }
        .lt-feat-tab { padding:16px 20px; cursor:pointer; border-left:2px solid transparent; transition:all 0.2s; }
        .lt-feat-tab:hover { border-left-color:rgba(255,255,255,0.1); }
        .lt-feat-tab.active { border-left-color:#e8eaf0; }
        .lt-ticker-item { display:inline-flex; align-items:center; gap:10px; padding:9px 24px; border:1px solid rgba(255,255,255,0.07); border-radius:2px; font-size:12px; color:rgba(232,234,240,0.35); white-space:nowrap; letter-spacing:0.04em; }
        .lt-plan-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:36px 32px; transition:all 0.25s; }
        .lt-plan-card:hover { border-color:rgba(255,255,255,0.14); transform:translateY(-2px); }
        .lt-plan-card.featured { background:#111620; border-color:rgba(255,255,255,0.14); }
        .lt-testi-card { background:#0f1218; border:1px solid rgba(255,255,255,0.07); border-radius:4px; padding:32px; transition:border-color 0.2s; }
        .lt-testi-card:hover { border-color:rgba(255,255,255,0.13); }
        .footer-link { font-size:12px; color:rgba(232,234,240,0.25); cursor:pointer; transition:color 0.2s; }
        .footer-link:hover { color:rgba(232,234,240,0.6); }
      `}</style>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:'60px', background: scrolled ? 'rgba(10,12,15,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', transition:'all 0.3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => navigate('/')}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="4" fill="#e8eaf0"/>
            <circle cx="11" cy="11" r="4" stroke="#0a0c0f" strokeWidth="1.5" fill="none"/>
            <line x1="11" y1="2" x2="11" y2="6.5" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="11" y1="15.5" x2="11" y2="20" stroke="#0a0c0f" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily:'"Fraunces", Georgia, serif', fontSize:'18px', fontWeight:700, letterSpacing:'-0.3px', color:'#e8eaf0' }}>LifeTwin</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button className="lt-nav-link" onClick={() => navigate('/login')}>Features</button>
          <button className="lt-nav-link" onClick={() => navigate('/login')}>Pricing</button>
          <button className="lt-nav-link" onClick={() => navigate('/login')}>Sign in</button>
          <div style={{ width:'12px' }}/>
          <button className="lt-cta-primary" onClick={() => navigate('/login')} style={{ padding:'9px 20px', fontSize:'13px' }}>Get started</button>
        </div>
      </nav>

      {/* HERO — asymmetric, oversized type */}
      <div ref={heroRef} style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        {/* Off-center glow */}
        <div style={{ position:'absolute', top:'10%', left:'-5%', width:'600px', height:'600px', background:'radial-gradient(circle, rgba(200,245,225,0.04) 0%, transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'15%', right:'-5%', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(253,232,200,0.04) 0%, transparent 65%)', pointerEvents:'none' }}/>

        {/* Eyebrow — left-aligned, small */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', marginBottom:'32px', animation:'fadeUp 0.7s ease both' }}>
          <div style={{ width:'32px', height:'1px', background:'rgba(200,245,225,0.5)' }}/>
          <span style={{ fontSize:'11px', fontWeight:500, color:'rgba(200,245,225,0.7)', letterSpacing:'0.14em', textTransform:'uppercase' }}>Decision Intelligence · AI-Powered</span>
        </div>

        {/* Giant headline — Fraunces for personality */}
        <h1 style={{ fontFamily:'"Fraunces", Georgia, serif', fontSize:'clamp(52px, 9vw, 116px)', fontWeight:300, lineHeight:0.95, letterSpacing:'-0.03em', marginBottom:'0', maxWidth:'900px', animation:'fadeUp 0.7s ease 0.1s both' }}>
          Know your<br/>
          <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>future</span>
          <span style={{ color:'#e8eaf0' }}> before</span><br/>
          <span style={{ color:'#e8eaf0' }}>you </span>
          <span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.35)' }}>live it.</span>
        </h1>

        {/* Subtext — pushed right, offset */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'40px', marginBottom:'52px', animation:'fadeUp 0.7s ease 0.2s both' }}>
          <p style={{ fontSize:'16px', color:'rgba(232,234,240,0.4)', lineHeight:1.75, maxWidth:'380px', fontWeight:300, textAlign:'right' }}>
            LifeTwin builds a living AI model of how you think — then simulates every major life decision before you commit.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'80px', animation:'fadeUp 0.7s ease 0.3s both' }}>
          <button className="lt-cta-primary" onClick={() => navigate('/login')}>Build my twin — free</button>
          <button className="lt-cta-ghost" onClick={() => navigate('/login')}>See a demo →</button>
        </div>

        {/* Stats — horizontal rule style, no card */}
        <div style={{ display:'flex', gap:'0', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'32px', animation:'fadeUp 0.7s ease 0.4s both' }}>
          {[{ val:'50K+', label:'Decisions simulated' }, { val:'94%', label:'Accuracy rate' }, { val:'180+', label:'Countries' }].map((s, i) => (
            <div key={i} style={{ paddingRight:'48px', marginRight:'48px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontFamily:'"Fraunces", serif', fontSize:'38px', fontWeight:700, color:'#e8eaf0', letterSpacing:'-0.03em', marginBottom:'4px' }}>{s.val}</div>
              <div style={{ fontSize:'12px', color:'rgba(232,234,240,0.3)', letterSpacing:'0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'16px 0', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'80px', background:'linear-gradient(90deg, #0a0c0f, transparent)', zIndex:2 }}/>
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'80px', background:'linear-gradient(270deg, #0a0c0f, transparent)', zIndex:2 }}/>
        <div style={{ display:'inline-flex', gap:'10px', animation:'ticker 45s linear infinite', width:'max-content' }}>
          {['Decision DNA','Life Simulation','Regret Predictor','Weekly Insights','Financial Projections','Goal Alignment','Zero Guesswork','AI-Powered','180+ Countries','50K Decisions',
            'Decision DNA','Life Simulation','Regret Predictor','Weekly Insights','Financial Projections','Goal Alignment','Zero Guesswork','AI-Powered','180+ Countries','50K Decisions'].map((item, i) => (
            <span key={i} className="lt-ticker-item">
              <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'inline-block', flexShrink:0 }}/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES — editorial asymmetric layout */}
      <div style={{ padding:'140px 48px', maxWidth:'1140px', margin:'0 auto' }}>
        {/* Section header — large, off-center */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'end', marginBottom:'72px' }}>
          <div>
            <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.3)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>What your twin can do</div>
            <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(36px, 5vw, 64px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.0, color:'#e8eaf0' }}>
              Six capabilities.<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>One intelligence.</span>
            </h2>
          </div>
          <p style={{ fontSize:'15px', color:'rgba(232,234,240,0.35)', lineHeight:1.8, fontWeight:300, alignSelf:'end', paddingBottom:'6px' }}>
            Built not to replace your judgment — but to give it the context it never had.
          </p>
        </div>

        {/* Tab + panel layout */}
        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'48px', alignItems:'start' }}>
          <div>
            {features.map((f, i) => (
              <div key={i} className={`lt-feat-tab ${activeFeature === i ? 'active' : ''}`} onClick={() => setActiveFeature(i)}>
                <div style={{ fontSize:'10px', fontWeight:600, color: activeFeature === i ? 'rgba(232,234,240,0.5)' : 'rgba(232,234,240,0.2)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'3px', transition:'color 0.2s' }}>{f.tag}</div>
                <div style={{ fontSize:'15px', fontWeight: activeFeature === i ? 500 : 400, color: activeFeature === i ? '#e8eaf0' : 'rgba(232,234,240,0.35)', transition:'all 0.2s' }}>{f.title}</div>
              </div>
            ))}
          </div>

          <div style={{ background:'#0f1218', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'48px', position:'sticky', top:'80px' }}>
            <div style={{ display:'inline-block', fontSize:'10px', fontWeight:600, color: features[activeFeature].accent, letterSpacing:'0.1em', textTransform:'uppercase', borderBottom:`1px solid ${features[activeFeature].accent}40`, paddingBottom:'6px', marginBottom:'24px' }}>
              {features[activeFeature].tag}
            </div>
            <h3 style={{ fontFamily:'"Fraunces", serif', fontSize:'40px', fontWeight:300, letterSpacing:'-0.02em', marginBottom:'18px', lineHeight:1.1, color:'#e8eaf0' }}>
              {features[activeFeature].title}
            </h3>
            <p style={{ fontSize:'15px', color:'rgba(232,234,240,0.45)', lineHeight:1.85, marginBottom:'40px', fontWeight:300 }}>
              {features[activeFeature].body}
            </p>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'28px', display:'flex', gap:'40px' }}>
              <div>
                <div style={{ fontFamily:'"Fraunces", serif', fontSize:'48px', fontWeight:700, color: features[activeFeature].accent, letterSpacing:'-0.02em', lineHeight:1 }}>{features[activeFeature].stat}</div>
                <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.3)', marginTop:'6px', letterSpacing:'0.04em' }}>{features[activeFeature].statLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS — numbered, vertical flow */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'140px 48px' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:'120px', alignItems:'start' }}>
            <div style={{ position:'sticky', top:'80px' }}>
              <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.3)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>Process</div>
              <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(32px, 4vw, 52px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, color:'#e8eaf0' }}>
                From question<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>to clarity.</span>
              </h2>
              <p style={{ marginTop:'20px', fontSize:'14px', color:'rgba(232,234,240,0.3)', lineHeight:1.75, fontWeight:300 }}>Three steps. Fifteen minutes.</p>
            </div>
            <div>
              {[
                { n:'01', title:'Profile your mind', body:'A 15-minute behavioral interview that captures how you actually decide — not how you think you do.' },
                { n:'02', title:'Ask your twin', body:'Describe the decision you\'re facing. Your twin draws on everything it knows about you to model the outcomes.' },
                { n:'03', title:'Choose with clarity', body:'Review three scored, annotated futures. Pick the path that aligns with the life you\'re building.' },
              ].map((s, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr', gap:'24px', paddingBottom: i < 2 ? '56px' : '0', position:'relative' }}>
                  {i < 2 && <div style={{ position:'absolute', left:'29px', top:'52px', bottom:'0', width:'1px', background:'rgba(255,255,255,0.05)' }}/>}
                  <div style={{ fontFamily:'"Fraunces", serif', fontSize:'13px', fontWeight:700, color:'rgba(232,234,240,0.2)', paddingTop:'4px', letterSpacing:'0.02em' }}>{s.n}</div>
                  <div>
                    <h3 style={{ fontSize:'22px', fontWeight:400, marginBottom:'12px', letterSpacing:'-0.01em', color:'#e8eaf0' }}>{s.title}</h3>
                    <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.35)', lineHeight:1.8, fontWeight:300 }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'140px 48px' }}>
        <div style={{ maxWidth:'1140px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'56px' }}>
            <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(32px, 4vw, 52px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05 }}>
              They simulated.<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>Then decided.</span>
            </h2>
            <div style={{ fontSize:'12px', color:'rgba(232,234,240,0.25)', fontWeight:300, textAlign:'right', maxWidth:'200px', lineHeight:1.6 }}>
              Real people. Real decisions.
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="lt-testi-card">
                <div style={{ display:'flex', gap:'3px', marginBottom:'20px' }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <polygon points="5.5,1 6.7,4.2 10.2,4.2 7.5,6.5 8.5,9.8 5.5,8 2.5,9.8 3.5,6.5 0.8,4.2 4.3,4.2" fill="#fbbf24"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize:'14px', color:'rgba(232,234,240,0.5)', lineHeight:1.8, marginBottom:'24px', fontWeight:300 }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'34px', height:'34px', borderRadius:'3px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, color:'rgba(232,234,240,0.4)', flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:500, color:'rgba(232,234,240,0.7)' }}>{t.name}</div>
                    <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.25)', marginTop:'2px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'140px 48px' }}>
        <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
          <div style={{ marginBottom:'64px' }}>
            <div style={{ fontSize:'11px', color:'rgba(232,234,240,0.3)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'20px' }}>Pricing</div>
            <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(32px, 4vw, 52px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05 }}>
              Start free.<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>Scale when ready.</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px' }}>
            {[
              { name:'Starter', price:'Free', billing:'', desc:'For exploring what your twin can do.', features:['5 simulations / month','2 life categories','1 weekly insight','Basic twin profile'], cta:'Start for free', featured:false },
              { name:'Pro', price:'$12', billing:'/mo', desc:'For people who decide with intention.', features:['Unlimited simulations','All 6 categories','Regret predictor','Financial projections','Daily insights'], cta:'Start Pro', featured:true },
              { name:'Teams', price:'$29', billing:'/seat/mo', desc:'For organizations that move as one.', features:['Everything in Pro','Team dashboards','Manager insights','HR integration','Priority support'], cta:'Talk to us', featured:false },
            ].map((plan, i) => (
              <div key={i} className={`lt-plan-card ${plan.featured ? 'featured' : ''}`} style={{ position:'relative' }}>
                {plan.featured && <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,245,225,0.4), transparent)' }}/>}
                <div style={{ fontSize:'12px', fontWeight:500, color:'rgba(232,234,240,0.4)', marginBottom:'16px', letterSpacing:'0.02em' }}>{plan.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'8px' }}>
                  <span style={{ fontFamily:'"Fraunces", serif', fontSize:'48px', fontWeight:700, letterSpacing:'-0.03em', color:'#e8eaf0' }}>{plan.price}</span>
                  <span style={{ fontSize:'13px', color:'rgba(232,234,240,0.3)' }}>{plan.billing}</span>
                </div>
                <p style={{ fontSize:'13px', color:'rgba(232,234,240,0.3)', marginBottom:'24px', fontWeight:300, lineHeight:1.55 }}>{plan.desc}</p>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'20px', marginBottom:'28px' }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'11px' }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="6" stroke="rgba(255,255,255,0.1)"/>
                        <polyline points="3.5,6.5 5.5,8.5 9.5,4.5" stroke={plan.featured ? '#c8f5e1' : 'rgba(232,234,240,0.3)'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      <span style={{ fontSize:'13px', color:'rgba(232,234,240,0.4)', fontWeight:300 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/login')} style={{ width:'100%', background: plan.featured ? '#e8eaf0' : 'transparent', color: plan.featured ? '#0a0c0f' : 'rgba(232,234,240,0.4)', border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.1)', padding:'13px', borderRadius:'3px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.01em', transition:'all 0.2s' }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding:'80px 48px 140px' }}>
        <div style={{ maxWidth:'860px', margin:'0 auto', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'80px 64px', textAlign:'center', position:'relative', overflow:'hidden', background:'#0f1218' }}>
          <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'1px', background:'linear-gradient(90deg, transparent, rgba(200,245,225,0.3), transparent)' }}/>
          <div style={{ fontSize:'11px', color:'rgba(200,245,225,0.6)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'24px' }}>Ready?</div>
          <h2 style={{ fontFamily:'"Fraunces", serif', fontSize:'clamp(36px, 5vw, 64px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'20px' }}>
            Meet your twin.<br/><span style={{ fontStyle:'italic', color:'rgba(232,234,240,0.3)' }}>Start deciding differently.</span>
          </h2>
          <p style={{ fontSize:'15px', color:'rgba(232,234,240,0.3)', lineHeight:1.75, marginBottom:'44px', maxWidth:'400px', margin:'0 auto 44px', fontWeight:300 }}>
            Join thousands who simulate before they commit.
          </p>
          <button className="lt-cta-primary" onClick={() => navigate('/login')}>Build my twin — free</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'28px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="4" fill="rgba(232,234,240,0.1)"/>
            <circle cx="11" cy="11" r="4" stroke="rgba(232,234,240,0.4)" strokeWidth="1.5" fill="none"/>
          </svg>
          <span style={{ fontFamily:'"Fraunces", serif', fontSize:'14px', fontWeight:700, color:'rgba(232,234,240,0.3)' }}>LifeTwin</span>
        </div>
        <span style={{ fontSize:'11px', color:'rgba(232,234,240,0.2)' }}>© 2026 LifeTwin AI · Built by Reinhard Maroa Babere 🇰🇪</span>
        <div style={{ display:'flex', gap:'20px' }}>
          {['Privacy','Terms','Contact'].map(l => <span key={l} className="footer-link">{l}</span>)}
        </div>
      </div>
    </div>
  )
}
