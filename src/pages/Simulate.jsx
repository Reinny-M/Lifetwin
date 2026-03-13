import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  :root {
    --bg-deep:    #050811;
    --bg-card:    #0c1120;
    --bg-raised:  #0f1628;
    --border:     rgba(255,255,255,0.06);
    --border-md:  rgba(255,255,255,0.09);
    --border-hi:  rgba(255,255,255,0.14);
    --teal:       #5eead4;
    --teal-dim:   rgba(94,234,212,0.08);
    --teal-glow:  rgba(94,234,212,0.15);
    --text:       #e8eaf0;
    --text-mid:   rgba(232,234,240,0.5);
    --text-low:   rgba(232,234,240,0.22);
    --green:      #34d399;
    --red:        #fb7185;
    --amber:      #fbbf24;
    --purple:     #a78bfa;
    --radius:     14px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .lt-root {
    min-height: 100vh;
    background: var(--bg-deep);
    font-family: "DM Sans", system-ui, sans-serif;
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* Grid texture */
  .lt-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }

  /* ── NAV ── */
  .lt-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px;
    background: rgba(5,8,17,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border-md);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 48px;
  }

  .lt-logo {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; text-decoration: none;
  }
  .lt-logo-icon {
    width: 28px; height: 28px;
    background: var(--text);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .lt-logo-text {
    font-size: 15px; font-weight: 600;
    letter-spacing: -0.3px; color: var(--text);
  }

  .lt-nav-center { display: flex; gap: 2px; }
  .lt-nav-btn {
    background: none; border: none;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 400;
    color: var(--text-mid); cursor: pointer;
    padding: 8px 18px; border-radius: 8px;
    letter-spacing: 0.01em;
    transition: all 0.2s;
  }
  .lt-nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .lt-nav-btn.active {
    color: var(--text);
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border-md);
  }

  .lt-nav-back {
    display: flex; align-items: center; gap: 6px;
    background: transparent;
    border: 1px solid var(--border-md);
    font-family: "DM Sans", sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-mid);
    padding: 7px 16px; border-radius: 100px;
    cursor: pointer; letter-spacing: 0.01em;
    transition: all 0.2s;
  }
  .lt-nav-back:hover { color: var(--text); border-color: var(--border-hi); }

  /* ── BODY ── */
  .lt-body {
    max-width: 1000px;
    margin: 0 auto;
    padding: 104px 48px 100px;
    position: relative; z-index: 1;
  }

  /* ── HERO ── */
  .lt-hero { margin-bottom: 52px; animation: fadeUp 0.7s ease both; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lt-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 20px;
  }
  .lt-hero-eyebrow-dot {
    width: 6px; height: 6px;
    background: var(--teal);
    border-radius: 50%;
  }
  .lt-hero-eyebrow-text {
    font-size: 11px; font-weight: 600;
    color: var(--teal); letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .lt-hero-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 300; letter-spacing: -0.03em;
    line-height: 1.05; color: var(--text);
    margin-bottom: 16px;
  }
  .lt-hero-title em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic; font-weight: 400;
    color: rgba(232,234,240,0.45);
  }

  .lt-hero-sub {
    font-size: 15px; color: var(--text-mid);
    font-weight: 300; line-height: 1.75;
    max-width: 500px;
  }

  /* ── INPUT ── */
  .lt-input-section {
    margin-bottom: 16px;
    animation: fadeUp 0.7s ease 0.08s both;
  }

  .lt-input-outer {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .lt-input-outer:focus-within {
    border-color: rgba(94,234,212,0.35);
    box-shadow: 0 0 0 3px rgba(94,234,212,0.06);
  }

  .lt-textarea {
    width: 100%; background: none;
    border: none; outline: none;
    color: var(--text); font-size: 15px;
    font-family: "DM Sans", sans-serif; font-weight: 300;
    resize: none; padding: 22px 80px 22px 24px;
    line-height: 1.7; min-height: 84px;
  }
  .lt-textarea::placeholder { color: var(--text-low); }

  .lt-submit-btn {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    width: 48px; height: 48px;
    background: var(--text);
    color: var(--bg-deep);
    border: none; border-radius: 100px;
    cursor: pointer; font-size: 16px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .lt-submit-btn:hover:not(:disabled) {
    background: #fff;
    transform: translateY(-50%) scale(1.05);
  }
  .lt-submit-btn:disabled {
    background: rgba(255,255,255,0.08);
    color: var(--text-low);
    cursor: not-allowed;
  }

  .lt-input-hint {
    font-size: 11px; color: var(--text-low);
    letter-spacing: 0.04em; text-align: right;
    margin-top: 8px; padding-right: 2px;
  }

  /* ── CATEGORIES ── */
  .lt-cats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px; margin-bottom: 72px;
    animation: fadeUp 0.7s ease 0.14s both;
  }

  .lt-cat {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 14px;
    text-align: center; cursor: pointer;
    transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .lt-cat:hover { border-color: var(--border-hi); transform: translateY(-2px); }
  .lt-cat.active {
    border-color: rgba(94,234,212,0.3);
    background: rgba(94,234,212,0.04);
  }
  .lt-cat.active .lt-cat-name { color: var(--teal); }
  .lt-cat-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--teal);
    transform: scaleX(0); transition: transform 0.2s;
    border-radius: 0 0 var(--radius) var(--radius);
  }
  .lt-cat:hover .lt-cat-bar { transform: scaleX(0.5); }
  .lt-cat.active .lt-cat-bar { transform: scaleX(1); }

  .lt-cat-icon { font-size: 22px; margin-bottom: 10px; display: block; }
  .lt-cat-name {
    font-size: 12px; font-weight: 600;
    color: var(--text); letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 3px;
    transition: color 0.2s;
  }
  .lt-cat-sub {
    font-size: 10px; color: var(--text-low);
    letter-spacing: 0.03em;
  }

  /* ── LOADING ── */
  .lt-loading {
    text-align: center; padding: 80px 0;
    animation: fadeUp 0.4s ease both;
  }
  .lt-loading-ring {
    width: 56px; height: 56px;
    border: 1px solid var(--border-md);
    border-top-color: var(--teal);
    border-radius: 50%;
    margin: 0 auto 28px;
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .lt-loading-title {
    font-size: 18px; font-weight: 300;
    font-family: "Instrument Serif", serif;
    font-style: italic;
    color: var(--text); margin-bottom: 8px;
  }
  .lt-loading-sub {
    font-size: 11px; color: var(--text-low);
    letter-spacing: 0.1em; text-transform: uppercase;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── ERROR ── */
  .lt-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(251,113,133,0.07);
    border: 1px solid rgba(251,113,133,0.18);
    border-radius: var(--radius);
    padding: 14px 20px;
    color: var(--red); font-size: 13px;
    margin-bottom: 28px; font-weight: 300;
  }

  /* ── RESULTS ── */
  .lt-results { animation: fadeUp 0.6s ease both; }

  .lt-divider {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 48px;
  }
  .lt-divider-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
  }
  .lt-divider-chip {
    display: flex; align-items: center; gap: 6px;
    border: 1px solid var(--border-md);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11px; font-weight: 500;
    color: var(--text-mid); letter-spacing: 0.06em;
  }
  .lt-divider-dot {
    width: 5px; height: 5px;
    border-radius: 50%; background: var(--teal);
  }

  /* Question echo */
  .lt-q-block { margin-bottom: 40px; }
  .lt-q-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-low); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .lt-q-label::before { content: ''; width: 16px; height: 1px; background: var(--text-low); }
  .lt-q-text {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 26px; line-height: 1.4;
    font-weight: 400; font-style: italic;
    color: var(--text);
  }

  /* Analysis */
  .lt-analysis {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px; padding: 32px 36px;
    margin-bottom: 48px;
    border-left: 2px solid rgba(94,234,212,0.3);
  }
  .lt-analysis-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .lt-analysis-dot {
    width: 6px; height: 6px;
    border-radius: 50%; background: var(--teal);
    flex-shrink: 0;
  }
  .lt-analysis-label {
    font-size: 11px; font-weight: 600;
    color: var(--teal); letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .lt-analysis-text {
    font-size: 15px; color: rgba(232,234,240,0.7);
    line-height: 1.85; font-weight: 300;
  }

  /* ── PATH CARDS ── */
  .lt-paths-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-low); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .lt-paths-label::before { content: ''; width: 16px; height: 1px; background: var(--text-low); }

  .lt-paths {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 12px;
  }

  .lt-path-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px; padding: 28px 24px;
    position: relative; overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
    cursor: default;
  }
  .lt-path-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .lt-path-card.safe::before   { background: linear-gradient(90deg, transparent, var(--green), transparent); }
  .lt-path-card.risky::before  { background: linear-gradient(90deg, transparent, var(--red), transparent); }
  .lt-path-card.optimal::before{ background: linear-gradient(90deg, transparent, var(--teal), transparent); }

  .lt-path-card.safe:hover   { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
  .lt-path-card.risky:hover  { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
  .lt-path-card.optimal {
    border-color: rgba(94,234,212,0.2);
    background: linear-gradient(145deg, #0c1120, #0d1520);
  }
  .lt-path-card.optimal:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 40px rgba(94,234,212,0.06); }

  .lt-path-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 100px; margin-bottom: 18px;
  }
  .lt-path-badge.safe    { background: rgba(52,211,153,0.08);  color: var(--green);  border: 1px solid rgba(52,211,153,0.18); }
  .lt-path-badge.risky   { background: rgba(251,113,133,0.08); color: var(--red);    border: 1px solid rgba(251,113,133,0.18); }
  .lt-path-badge.optimal { background: var(--teal-dim);        color: var(--teal);   border: 1px solid rgba(94,234,212,0.2); }

  .lt-path-name {
    font-family: "Instrument Serif", serif;
    font-size: 20px; font-weight: 400;
    color: var(--text); margin-bottom: 8px; line-height: 1.2;
  }
  .lt-path-desc {
    font-size: 12px; color: var(--text-mid);
    line-height: 1.8; margin-bottom: 24px;
    font-weight: 300;
  }

  .lt-path-prob {
    font-size: 52px; font-weight: 600;
    letter-spacing: -0.03em; line-height: 1;
  }
  .lt-path-card.safe    .lt-path-prob { color: var(--green); }
  .lt-path-card.risky   .lt-path-prob { color: var(--red); }
  .lt-path-card.optimal .lt-path-prob { color: var(--teal); }
  .lt-path-prob sup {
    font-size: 20px; font-weight: 400;
    vertical-align: super; letter-spacing: 0;
  }
  .lt-path-prob-label {
    font-size: 10px; color: var(--text-low);
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-top: 4px; margin-bottom: 20px;
  }

  .lt-path-rule { height: 1px; background: var(--border); margin-bottom: 16px; }

  .lt-path-stat {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 10px;
  }
  .lt-path-stat-k {
    font-size: 10px; color: var(--text-low);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .lt-path-stat-v {
    font-size: 12px; font-weight: 500; color: var(--text);
  }

  /* ── BOTTOM ROW ── */
  .lt-bottom {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 12px;
  }

  .lt-regret-card, .lt-insight-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px; padding: 32px;
    transition: border-color 0.2s;
  }
  .lt-regret-card:hover, .lt-insight-card:hover { border-color: var(--border-hi); }

  .lt-card-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-low); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .lt-card-label::before { content: ''; width: 14px; height: 1px; background: var(--text-low); }

  .lt-regret-big {
    font-size: 76px; font-weight: 600;
    letter-spacing: -0.04em; line-height: 1;
    margin-bottom: 12px;
  }
  .lt-regret-pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px;
    margin-bottom: 16px;
  }
  .lt-regret-pill::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%; background: currentColor;
  }
  .lt-regret-desc {
    font-size: 13px; color: var(--text-mid);
    line-height: 1.8; font-weight: 300;
  }

  .lt-rec-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--teal-dim);
    border: 1px solid rgba(94,234,212,0.18);
    color: var(--teal);
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px; margin-bottom: 16px;
  }
  .lt-insight-text {
    font-family: "Instrument Serif", serif;
    font-size: 17px; color: rgba(232,234,240,0.65);
    line-height: 1.9; font-weight: 400;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: rgba(94,234,212,0.15); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(94,234,212,0.3); }
`

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
    { id: 'career',        icon: '🧭', name: 'Career',    sub: 'Job · Growth' },
    { id: 'finance',       icon: '💎', name: 'Finance',   sub: 'Wealth · Investing' },
    { id: 'relationships', icon: '🌹', name: 'Love',      sub: 'Relations · Family' },
    { id: 'health',        icon: '⚡', name: 'Health',    sub: 'Fitness · Mind' },
  ]

  // BUG FIX 1: setLoading(false) moved to finally so it ALWAYS runs,
  // even if supabase.insert throws after setResult succeeds.
  // BUG FIX 2: response.ok checked before parsing JSON, so 4xx/5xx
  // errors don't silently get treated as valid result data.
  const runSimulation = async () => {
    if (!question.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, category }),
      })
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      const parsed = await response.json()
      setResult(parsed)
      await supabase.from('simulations').insert({
        user_id: user.id,
        question_text: question,
        category,
        ai_analysis: parsed.ai_analysis,
        path_a: parsed.path_a,
        path_b: parsed.path_b,
        path_c: parsed.path_c,
        regret_score: parsed.regret_score,
        recommended_path: parsed.recommended_path,
      })
    } catch (err) {
      setError('Simulation failed. Please check your connection and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [result])

  // BUG FIX 3: derive regret values only when result exists,
  // avoiding stale/wrong values on first render when result is null.
  const rs = result?.regret_score ?? 0
  const regretColor  = rs < 20 ? 'var(--green)' : rs < 50 ? 'var(--amber)' : 'var(--red)'
  const regretBg     = rs < 20 ? 'rgba(52,211,153,0.08)'  : rs < 50 ? 'rgba(251,191,36,0.08)'  : 'rgba(251,113,133,0.08)'
  const regretBorder = rs < 20 ? 'rgba(52,211,153,0.2)'   : rs < 50 ? 'rgba(251,191,36,0.2)'   : 'rgba(251,113,133,0.2)'
  const regretLabel  = rs < 20 ? 'Low Risk' : rs < 50 ? 'Moderate' : 'High Risk'
  const regretDesc   = rs < 20
    ? 'Strong alignment with your long-term values. This path carries minimal risk of future regret.'
    : rs < 50
    ? 'Some uncertainty ahead. Proceed with clear intention and revisit your decision quarterly.'
    : 'Significant regret risk detected. Strongly consider the safe path before committing.'

  return (
    <div className="lt-root">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="lt-nav">
        <div className="lt-logo" onClick={() => navigate('/')}>
          <div className="lt-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#050811" />
              <circle cx="7" cy="7" r="6" stroke="#050811" strokeWidth="1.5" fill="none" />
              <line x1="7" y1="1" x2="7" y2="4" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="10" x2="7" y2="13" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="lt-logo-text">LifeTwin</span>
        </div>

        <div className="lt-nav-center">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button
              key={item.path}
              className={`lt-nav-btn ${item.path === '/simulate' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>

        <button className="lt-nav-back" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div className="lt-body">

        {/* HERO */}
        <div className="lt-hero">
          <div className="lt-hero-eyebrow">
            <div className="lt-hero-eyebrow-dot" />
            <span className="lt-hero-eyebrow-text">AI-Powered Simulation</span>
          </div>
          <h1 className="lt-hero-title">
            Simulate your future,{' '}
            <em>today.</em>
          </h1>
          <p className="lt-hero-sub">
            Ask your digital twin anything — career pivots, financial moves, relationships, health. Get three data-driven paths with real probabilities.
          </p>
        </div>

        {/* INPUT */}
        <div className="lt-input-section">
          <div className="lt-input-outer">
            <textarea
              className="lt-textarea"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. What happens if I quit my job and start freelancing in 6 months?"
              rows={2}
              // BUG FIX 4: guard against firing while already loading
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey && !loading) runSimulation() }}
            />
            <button
              className="lt-submit-btn"
              onClick={runSimulation}
              disabled={loading || !question.trim()}
              aria-label="Run simulation"
            >
              {loading
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22 10" /></svg>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              }
            </button>
          </div>
          <div className="lt-input-hint">⌘ + Enter to simulate</div>
        </div>

        {/* CATEGORIES */}
        <div className="lt-cats">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`lt-cat ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <div className="lt-cat-bar" />
              <span className="lt-cat-icon">{cat.icon}</span>
              <div className="lt-cat-name">{cat.name}</div>
              <div className="lt-cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="lt-loading">
            <div className="lt-loading-ring" />
            <div className="lt-loading-title">Your twin is thinking…</div>
            <div className="lt-loading-sub">Building your simulation</div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="lt-error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="6.5" stroke="#fb7185" />
              <line x1="7" y1="4" x2="7" y2="8" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="10.5" r="0.75" fill="#fb7185" />
            </svg>
            {error}
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="lt-results" ref={resultsRef}>

            <div className="lt-divider">
              <div className="lt-divider-line" />
              <div className="lt-divider-chip">
                <div className="lt-divider-dot" />
                Simulation complete
              </div>
              <div className="lt-divider-line" />
            </div>

            {/* Question echo */}
            <div className="lt-q-block">
              <div className="lt-q-label">Your question</div>
              <div className="lt-q-text">"{question}"</div>
            </div>

            {/* Analysis */}
            <div className="lt-analysis">
              <div className="lt-analysis-header">
                <div className="lt-analysis-dot" />
                <div className="lt-analysis-label">Your twin says</div>
              </div>
              <div className="lt-analysis-text">{result.ai_analysis}</div>
            </div>

            {/* Paths */}
            <div className="lt-paths-label">Three possible paths</div>
            <div className="lt-paths">
              {[
                { key: 'path_a', badge: 'Safe path',    cls: 'safe'    },
                { key: 'path_b', badge: 'Risky path',   cls: 'risky'   },
                { key: 'path_c', badge: 'Optimal path', cls: 'optimal' },
              ].map(p => {
                const path = result[p.key]
                if (!path) return null
                return (
                  <div key={p.key} className={`lt-path-card ${p.cls}`}>
                    <div className={`lt-path-badge ${p.cls}`}>{p.badge}</div>
                    <div className="lt-path-name">{path.name}</div>
                    <div className="lt-path-desc">{path.description}</div>
                    <div className="lt-path-prob">
                      {path.probability}<sup>%</sup>
                    </div>
                    <div className="lt-path-prob-label">Success probability</div>
                    <div className="lt-path-rule" />
                    {[
                      ['Risk level',  path.risk_level],
                      ['Regret risk', `${path.regret_risk}%`],
                      ['Timeline',    path.timeline],
                      ['Happiness',   path.happiness_score],
                    ].map(([k, v]) => (
                      <div key={k} className="lt-path-stat">
                        <span className="lt-path-stat-k">{k}</span>
                        <span className="lt-path-stat-v">{v}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Bottom row */}
            <div className="lt-bottom">
              <div className="lt-regret-card">
                <div className="lt-card-label">Regret predictor</div>
                <div className="lt-regret-big" style={{ color: regretColor }}>{rs}%</div>
                <div className="lt-regret-pill" style={{ color: regretColor, background: regretBg, border: `1px solid ${regretBorder}` }}>
                  {regretLabel}
                </div>
                <div className="lt-regret-desc">{regretDesc}</div>
              </div>

              <div className="lt-insight-card">
                <div className="lt-card-label">Key insight</div>
                <div className="lt-rec-tag">Recommended: Path {result.recommended_path}</div>
                <div className="lt-insight-text">{result.key_insight}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
