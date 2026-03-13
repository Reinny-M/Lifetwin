import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const features = [
    {
      tag: 'BEHAVIORAL CORE',
      title: 'Decision DNA',
      body: 'A living behavioral model that evolves with every answer you give. It learns how you process risk, emotion, and commitment — then reflects it back as foresight.',
      stat: '97%', statLabel: 'pattern accuracy',
      accent: '#5eead4',
    },
    {
      tag: 'SCENARIO ENGINE',
      title: 'Life Simulation',
      body: 'Run any decision through 3 parallel futures. Each path comes scored, timed, and annotated with what you\'ll gain — and what it will cost you.',
      stat: '3×', statLabel: 'paths per decision',
      accent: '#a78bfa',
    },
    {
      tag: 'EMOTIONAL AUDIT',
      title: 'Regret Predictor',
      body: 'Your future self has opinions about the choices you\'re about to make. LifeTwin surfaces them — clearly, honestly, before it\'s too late to change course.',
      stat: '89%', statLabel: 'regret reduction',
      accent: '#f472b6',
    },
    {
      tag: 'PATTERN DISCOVERY',
      title: 'Weekly Insights',
      body: 'Every seven days, a private briefing on behavioral trends only an outside observer would notice. The patterns you\'ve been too close to see.',
      stat: '52×', statLabel: 'insights per year',
      accent: '#fbbf24',
    },
    {
      tag: 'WEALTH MODELING',
      title: 'Financial Projections',
      body: 'Decisions aren\'t made in a vacuum. Your twin models the downstream financial reality of every simulated path — in your currency, at your scale.',
      stat: '10Y', statLabel: 'projection horizon',
      accent: '#34d399',
    },
    {
      tag: 'ALIGNMENT SCORE',
      title: 'Goal Alignment',
      body: 'A daily score measuring how far today\'s choices are from the life you said you wanted. Small drifts caught early, before they become regrets.',
      stat: '100%', statLabel: 'goal coverage',
      accent: '#60a5fa',
    },
  ]

  const steps = [
    { n: '1', title: 'Profile your mind', body: 'A 15-minute behavioral interview that captures how you actually decide — not how you think you do.' },
    { n: '2', title: 'Ask your twin', body: 'Describe the decision you\'re facing. Your twin draws on everything it knows about you to model the outcomes.' },
    { n: '3', title: 'Choose with clarity', body: 'Review three scored, annotated futures. Pick the path that aligns with the life you\'re building.' },
  ]

  const testimonials = [
    { quote: 'LifeTwin showed me I was about to make a decision I would have regretted for years. It saved my business and six figures of capital.', name: 'Amara K.', role: 'Founder, Lagos', initials: 'AK' },
    { quote: 'I used to spend weeks in analysis paralysis. Now I simulate in twenty minutes and move. The confidence shift is hard to overstate.', name: 'James M.', role: 'Engineer, Berlin', initials: 'JM' },
    { quote: 'The weekly insights alone are worth the subscription. I found a self-sabotage pattern I\'d been running for six years.', name: 'Sofia R.', role: 'Med Student, Toronto', initials: 'SR' },
  ]

  return (
    <div style={{ background: '#050811', color: '#e8eaf0', fontFamily: '"DM Sans", system-ui, sans-serif', overflowX: 'hidden', minHeight: '100vh' }}>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-link {
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: inherit;
          padding: 6px 12px;
        }
        .nav-link:hover { color: #e8eaf0; }

        .btn-primary {
          background: #e8eaf0;
          color: #050811;
          border: none;
          padding: 13px 32px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.01em;
          transition: all 0.2s;
          display: inline-block;
        }
        .btn-primary:hover {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(232,234,240,0.2);
        }
        .btn-ghost {
          background: transparent;
          color: #64748b;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 13px 32px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.25);
          color: #e8eaf0;
        }

        .feature-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .feature-tab:hover { background: rgba(255,255,255,0.04); }
        .feature-tab.active {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.08);
        }

        .testimonial-card {
          background: #0c1120;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.2s;
        }
        .testimonial-card:hover {
          border-color: rgba(255,255,255,0.14);
        }

        .plan-card {
          background: #0c1120;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 36px 32px;
          transition: all 0.25s;
        }
        .plan-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-3px);
        }
        .plan-card.featured {
          background: #0f1628;
          border-color: rgba(255,255,255,0.15);
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 22px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .diagonal-line {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent);
          top: 0; bottom: 0;
          pointer-events: none;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        background: scrolled ? 'rgba(5,8,17,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        transition: 'all 0.35s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button className="nav-link" onClick={() => navigate('/login')}>Features</button>
          <button className="nav-link" onClick={() => navigate('/login')}>Pricing</button>
          <button className="nav-link" onClick={() => navigate('/login')}>Sign in</button>
          <div style={{ width: '16px' }} />
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '9px 22px', fontSize: '13px' }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Mouse-tracking glow */}
        <div style={{
          position: 'absolute', pointerEvents: 'none',
          width: '700px', height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, rgba(94,234,212,0.07) 0%, transparent 65%)`,
          left: `calc(${mousePos.x}% - 350px)`,
          top: `calc(${mousePos.y}% - 350px)`,
          transition: 'left 0.8s ease, top 0.8s ease',
        }} />

        {/* Grid lines */}
        {[-300, -100, 100, 300].map(x => (
          <div key={x} className="diagonal-line" style={{ left: `calc(50% + ${x}px)` }} />
        ))}

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          marginBottom: '36px',
          animation: 'fadeUp 0.7s ease both',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5eead4', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#5eead4', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Behavioral AI · Decision Intelligence
          </span>
        </div>

        {/* Headline — mixed typeface trick */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 100px)',
          lineHeight: 1.01,
          letterSpacing: '-0.04em',
          marginBottom: '30px',
          maxWidth: '940px',
          animation: 'fadeUp 0.7s ease 0.1s both',
        }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, color: '#e8eaf0' }}>Know your future</span>
          <br />
          <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: '#94a3b8' }}>before you live it.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          color: '#475569',
          lineHeight: 1.75,
          maxWidth: '520px',
          marginBottom: '52px',
          animation: 'fadeUp 0.7s ease 0.2s both',
          fontWeight: 300,
        }}>
          LifeTwin builds a living model of how you think — then runs every major life decision through it before you commit.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px', animation: 'fadeUp 0.7s ease 0.3s both' }}>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Build my twin — it's free
          </button>
          <button className="btn-ghost" onClick={() => navigate('/login')}>
            See a demo &nbsp;→
          </button>
        </div>

        {/* Stats row — horizontal rule style */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          overflow: 'hidden',
          animation: 'fadeUp 0.7s ease 0.4s both',
        }}>
          {[
            { val: '50K+', label: 'Decisions simulated' },
            { val: '94%', label: 'Accuracy rate' },
            { val: '180+', label: 'Countries' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '20px 44px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '26px', fontWeight: '600', letterSpacing: '-0.03em', color: '#e8eaf0', marginBottom: '4px' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: '400', letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(90deg, #050811, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(270deg, #050811, transparent)', zIndex: 2 }} />
        <div style={{ display: 'inline-flex', gap: '12px', animation: 'ticker 40s linear infinite', width: 'max-content' }}>
          {['Decision DNA', 'Life Simulation', 'Regret Predictor', 'Weekly Insights', 'Financial Projections', 'Goal Alignment', 'Behavioral Analysis', 'Zero Guesswork', 'AI-Powered', 'Used Worldwide',
            'Decision DNA', 'Life Simulation', 'Regret Predictor', 'Weekly Insights', 'Financial Projections', 'Goal Alignment', 'Behavioral Analysis', 'Zero Guesswork', 'AI-Powered', 'Used Worldwide'].map((item, i) => (
            <span key={i} className="ticker-item">
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES — Interactive tabs + panel */}
      <div style={{ padding: '120px 40px', maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>What your twin can do</p>
          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 56px)', fontWeight: '300', letterSpacing: '-0.03em', lineHeight: 1.1, maxWidth: '600px' }}>
            Six capabilities.{' '}
            <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontWeight: 400, color: '#64748b' }}>One intelligence.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '32px', alignItems: 'start' }}>
          {/* Tab list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {features.map((f, i) => (
              <div key={i} className={`feature-tab ${activeFeature === i ? 'active' : ''}`} onClick={() => setActiveFeature(i)}>
                <div style={{
                  width: '3px', height: '28px', borderRadius: '2px',
                  background: activeFeature === i ? f.accent : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: activeFeature === i ? f.accent : '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px', transition: 'color 0.2s' }}>{f.tag}</div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: activeFeature === i ? '#e8eaf0' : '#64748b', transition: 'color 0.2s' }}>{f.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Active panel */}
          <div style={{
            background: '#0c1120',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '44px',
            position: 'sticky',
            top: '88px',
          }}>
            <div style={{
              display: 'inline-block',
              fontSize: '10px', fontWeight: '600',
              color: features[activeFeature].accent,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              border: `1px solid ${features[activeFeature].accent}30`,
              borderRadius: '100px', padding: '5px 14px',
              marginBottom: '24px',
              background: `${features[activeFeature].accent}10`,
            }}>
              {features[activeFeature].tag}
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.2 }}>
              {features[activeFeature].title}
            </h3>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.8, marginBottom: '36px', fontWeight: 300 }}>
              {features[activeFeature].body}
            </p>
            <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px' }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '600', letterSpacing: '-0.03em', color: features[activeFeature].accent }}>{features[activeFeature].stat}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', letterSpacing: '0.02em' }}>{features[activeFeature].statLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '120px 40px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: '88px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>Process</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '300', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                From question<br />
                <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontWeight: 400, color: '#64748b' }}>to clarity.</span>
              </h2>
              <p style={{ marginTop: '20px', fontSize: '14px', color: '#475569', lineHeight: 1.75, fontWeight: 300 }}>
                Three steps. Fifteen minutes. A decision you'll stand behind for years.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {steps.map((s, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: '24px',
                  paddingBottom: i < steps.length - 1 ? '48px' : '0',
                  position: 'relative',
                }}>
                  {/* Line connector */}
                  {i < steps.length - 1 && (
                    <div style={{ position: 'absolute', left: '23px', top: '48px', bottom: '0', width: '1px', background: 'rgba(255,255,255,0.07)' }} />
                  )}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '600', color: '#475569',
                    flexShrink: 0, background: '#0c1120',
                    letterSpacing: '0.02em',
                  }}>{s.n}</div>
                  <div style={{ paddingTop: '12px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '10px', letterSpacing: '-0.01em' }}>{s.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, fontWeight: 300 }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '120px 40px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>People</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '300', letterSpacing: '-0.03em' }}>
              They simulated.{' '}
              <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: '#64748b' }}>Then decided.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                {/* Stars — non-generic inline SVG instead of emojis */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <polygon points="6.5,1 7.9,5 12,5 8.7,7.8 9.9,12 6.5,9.5 3.1,12 4.3,7.8 1,5 5.1,5" fill="#fbbf24" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8, marginBottom: '28px', fontWeight: 300 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#cbd5e1' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '1px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '120px 40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#475569', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '300', letterSpacing: '-0.03em', marginBottom: '14px' }}>
              Start free.{' '}
              <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: '#64748b' }}>Scale when ready.</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', fontWeight: 300 }}>No card required. Cancel anytime.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              {
                name: 'Starter', price: 'Free', billing: '',
                desc: 'For exploring what your twin can do.',
                features: ['5 simulations / month', '2 life categories', '1 weekly insight', 'Basic twin profile'],
                cta: 'Start for free', featured: false,
              },
              {
                name: 'Pro', price: '$12', billing: '/ month',
                desc: 'For people who decide with intention.',
                features: ['Unlimited simulations', 'All 6 categories', 'Regret predictor', 'Financial projections', 'Daily insights'],
                cta: 'Start Pro', featured: true,
              },
              {
                name: 'Teams', price: '$29', billing: '/ seat / mo',
                desc: 'For organizations that move as one.',
                features: ['Everything in Pro', 'Team dashboards', 'Manager insights', 'HR integration', 'Priority support'],
                cta: 'Talk to us', featured: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`plan-card ${plan.featured ? 'featured' : ''}`} style={{ position: 'relative' }}>
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: '-1px', left: '24px', right: '24px', height: '2px',
                    background: 'linear-gradient(90deg, transparent, #5eead4, transparent)',
                  }} />
                )}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '16px', letterSpacing: '0.01em' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.03em', color: '#e8eaf0' }}>{plan.price}</span>
                    <span style={{ fontSize: '13px', color: '#475569' }}>{plan.billing}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, fontWeight: 300 }}>{plan.desc}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', marginBottom: '28px' }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '11px' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.1)" />
                        <polyline points="4,7 6.5,9.5 10,5" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 300 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/login')} style={{
                  width: '100%',
                  background: plan.featured ? '#e8eaf0' : 'transparent',
                  color: plan.featured ? '#050811' : '#94a3b8',
                  border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '13px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.01em',
                  transition: 'all 0.2s',
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '80px 40px 120px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          padding: '80px 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: '#0c1120',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent 10%, rgba(94,234,212,0.3) 50%, transparent 90%)',
          }} />

          <p style={{ fontSize: '11px', fontWeight: '600', color: '#5eead4', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>Ready?</p>

          <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 56px)', fontWeight: '300', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '20px' }}>
            Meet your twin.
            <br />
            <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', color: '#64748b' }}>Start deciding differently.</span>
          </h2>

          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, marginBottom: '44px', maxWidth: '440px', margin: '0 auto 44px', fontWeight: 300 }}>
            Join thousands who simulate before they commit. Free forever to start.
          </p>

          <button className="btn-primary" onClick={() => navigate('/login')}>
            Build my twin — free
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', background: '#e8eaf0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#050811" />
              <circle cx="7" cy="7" r="6" stroke="#050811" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>LifeTwin AI</span>
        </div>
        <span style={{ fontSize: '12px', color: '#334155' }}>© 2026 LifeTwin AI · Made by Reinhard Maroa Babere 🇰🇪</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '12px', color: '#334155', cursor: 'pointer', transition: 'color 0.2s' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
