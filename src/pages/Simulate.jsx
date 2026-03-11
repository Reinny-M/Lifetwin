import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');

  :root {
    --bg: #080A0F;
    --bg2: #0D1018;
    --bg3: #111520;
    --border: rgba(255,255,255,0.06);
    --border-bright: rgba(255,255,255,0.12);
    --gold: #C9A84C;
    --gold-dim: rgba(201,168,76,0.15);
    --gold-glow: rgba(201,168,76,0.08);
    --text: #F0EDE8;
    --text-dim: rgba(240,237,232,0.45);
    --text-faint: rgba(240,237,232,0.2);
    --green: #4ADE80;
    --red: #F87171;
    --amber: #FBBF24;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .s-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Syne', sans-serif;
    color: var(--text);
    overflow-x: hidden;
  }

  /* Ambient background glow */
  .s-root::before {
    content: '';
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 500px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* NAV */
  .s-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 64px;
    background: rgba(8,10,15,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 48px;
  }

  .s-logo {
    display: flex; align-items: center; gap: 12px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300;
    letter-spacing: 2px; color: var(--text);
    text-transform: uppercase;
  }

  .s-logo-mark {
    width: 28px; height: 28px;
    border: 1px solid var(--gold);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .s-logo-mark::after {
    content: '';
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--gold);
  }

  .s-nav-links { display: flex; gap: 4px; }

  .s-nav-btn {
    background: none; border: none;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 500;
    color: var(--text-dim); cursor: pointer;
    padding: 8px 18px; border-radius: 2px;
    letter-spacing: 1.5px; text-transform: uppercase;
    transition: color 0.2s, background 0.2s;
  }
  .s-nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .s-nav-btn.active { color: var(--gold); }

  .s-nav-back {
    background: none;
    border: 1px solid var(--border-bright);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--text-dim);
    padding: 7px 14px; border-radius: 2px;
    cursor: pointer; letter-spacing: 1px;
    transition: all 0.2s;
  }
  .s-nav-back:hover { border-color: var(--gold); color: var(--gold); }

  /* BODY */
  .s-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 120px 48px 100px;
    position: relative; z-index: 1;
  }

  /* HEADER */
  .s-header { margin-bottom: 72px; }

  .s-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 3px;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .s-eyebrow::before {
    content: '';
    width: 32px; height: 1px;
    background: var(--gold);
    opacity: 0.6;
  }

  .s-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px; line-height: 0.95;
    font-weight: 300; letter-spacing: -1px;
    color: var(--text);
    margin-bottom: 20px;
  }
  .s-title em {
    font-style: italic;
    background: linear-gradient(135deg, #C9A84C, #E8D5A0, #C9A84C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .s-subtitle {
    font-size: 14px; color: var(--text-dim);
    font-weight: 400; letter-spacing: 0.5px;
    line-height: 1.6;
  }

  /* INPUT */
  .s-input-wrap {
    background: var(--bg2);
    border: 1px solid var(--border-bright);
    border-radius: 4px;
    display: flex;
    margin-bottom: 12px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .s-input-wrap:focus-within {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 0 0 1px rgba(201,168,76,0.1), 0 8px 32px rgba(0,0,0,0.4);
  }

  .s-textarea {
    flex: 1; background: none;
    border: none; outline: none;
    color: var(--text); font-size: 15px;
    font-family: 'Syne', sans-serif;
    font-weight: 400;
    resize: none; padding: 22px 28px;
    line-height: 1.7; letter-spacing: 0.2px;
  }
  .s-textarea::placeholder { color: var(--text-faint); }

  .s-send-btn {
    background: linear-gradient(135deg, #C9A84C, #A8873A);
    color: #080A0F;
    border: none; width: 60px;
    cursor: pointer; font-size: 20px; font-weight: 700;
    flex-shrink: 0; border-radius: 0 3px 3px 0;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .s-send-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #DDB95A, #C9A84C);
    box-shadow: 0 0 24px rgba(201,168,76,0.3);
  }
  .s-send-btn:disabled { background: rgba(255,255,255,0.07); color: var(--text-faint); cursor: not-allowed; }

  /* CATEGORIES */
  .s-cats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px; margin-bottom: 64px;
  }

  .s-cat {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 4px; padding: 18px 14px;
    text-align: center; cursor: pointer;
    transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .s-cat::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--gold);
    transform: scaleX(0); transition: transform 0.2s;
  }
  .s-cat:hover { border-color: var(--border-bright); background: var(--bg3); }
  .s-cat:hover::after { transform: scaleX(1); }
  .s-cat.active { border-color: rgba(201,168,76,0.3); background: var(--gold-glow); }
  .s-cat.active::after { transform: scaleX(1); }
  .s-cat.active .s-cat-name { color: var(--gold); }

  .s-cat-icon { font-size: 22px; margin-bottom: 8px; }
  .s-cat-name { font-size: 11px; font-weight: 700; color: var(--text); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .s-cat-sub { font-size: 9px; color: var(--text-faint); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; }

  /* LOADING */
  .s-loading {
    text-align: center; padding: 80px 0;
    border-top: 1px solid var(--border);
  }
  .s-loading-ring {
    width: 48px; height: 48px;
    border: 1px solid var(--border-bright);
    border-top-color: var(--gold);
    border-radius: 50%;
    margin: 0 auto 24px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .s-loading-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--text-dim);
    letter-spacing: 3px; text-transform: uppercase;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* ERROR */
  .s-error {
    background: rgba(248,113,113,0.06);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 4px; padding: 14px 20px;
    color: var(--red); font-size: 11px;
    margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
  }

  /* RESULTS */
  .s-results {
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .s-divider {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 48px;
  }
  .s-divider-line { flex: 1; height: 1px; background: var(--border-bright); }
  .s-divider-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; color: var(--gold);
    letter-spacing: 3px; text-transform: uppercase;
  }

  .s-question-block { margin-bottom: 48px; }
  .s-question-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-faint); text-transform: uppercase;
    margin-bottom: 12px;
  }
  .s-question-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; line-height: 1.3;
    font-weight: 300; font-style: italic;
    color: var(--text); letter-spacing: -0.3px;
  }

  /* ANALYSIS */
  .s-analysis {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-left: 2px solid var(--gold);
    border-radius: 0 4px 4px 0;
    padding: 32px 36px;
    margin-bottom: 56px;
    display: flex; gap: 36px;
  }
  .s-analysis-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: var(--gold); text-transform: uppercase;
    white-space: nowrap; padding-top: 3px; min-width: 90px;
  }
  .s-analysis-text {
    font-size: 15px; color: rgba(240,237,232,0.7);
    line-height: 1.9; font-weight: 400;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; letter-spacing: 0.1px;
  }

  /* PATHS */
  .s-paths-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 16px;
  }
  .s-paths-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-faint); text-transform: uppercase;
  }

  .s-paths {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }

  .s-path-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 28px 24px;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .s-path-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
    border-color: var(--border-bright);
  }
  .s-path-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: transparent;
    transition: background 0.2s;
  }
  .s-path-card.safe::before { background: linear-gradient(90deg, transparent, #4ADE80, transparent); }
  .s-path-card.risky::before { background: linear-gradient(90deg, transparent, #F87171, transparent); }
  .s-path-card.optimal {
    background: linear-gradient(145deg, #0F1320, #141828);
    border-color: rgba(201,168,76,0.25);
    box-shadow: 0 0 40px rgba(201,168,76,0.06), inset 0 1px 0 rgba(201,168,76,0.1);
  }
  .s-path-card.optimal::before { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .s-path-card.optimal:hover {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.1);
  }

  /* Optimal shimmer */
  .s-path-card.optimal::after {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.03), transparent);
    animation: shimmer 3s ease-in-out infinite;
  }
  @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }

  .s-path-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 20px;
    padding: 4px 10px; border-radius: 2px;
  }
  .s-path-badge.safe { background: rgba(74,222,128,0.08); color: #4ADE80; border: 1px solid rgba(74,222,128,0.15); }
  .s-path-badge.risky { background: rgba(248,113,113,0.08); color: #F87171; border: 1px solid rgba(248,113,113,0.15); }
  .s-path-badge.optimal { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,168,76,0.25); }

  .s-path-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 400; letter-spacing: -0.3px;
    color: var(--text); margin-bottom: 10px; line-height: 1.2;
  }
  .s-path-card.optimal .s-path-name { color: #F0EDE8; }

  .s-path-desc {
    font-size: 12px; color: var(--text-dim);
    line-height: 1.75; margin-bottom: 28px; font-weight: 400;
    letter-spacing: 0.2px;
  }

  .s-path-prob-wrap { margin-bottom: 24px; }
  .s-path-prob {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px; font-weight: 300;
    color: var(--text); line-height: 1;
    letter-spacing: -2px;
  }
  .s-path-card.optimal .s-path-prob { color: var(--gold); }
  .s-path-prob-pct {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 400;
    vertical-align: super;
    margin-left: 2px;
  }
  .s-path-prob-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: var(--text-faint); text-transform: uppercase;
    margin-top: 4px;
  }

  .s-path-divider { height: 1px; background: var(--border); margin-bottom: 16px; }
  .s-path-card.optimal .s-path-divider { background: rgba(201,168,76,0.12); }

  .s-path-stat {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 10px;
  }
  .s-path-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px; color: var(--text-faint);
    letter-spacing: 1.5px; text-transform: uppercase;
  }
  .s-path-stat-val { font-size: 12px; font-weight: 600; color: var(--text); letter-spacing: 0.3px; }
  .s-path-card.optimal .s-path-stat-val { color: rgba(240,237,232,0.9); }

  /* BOTTOM */
  .s-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .s-regret-block, .s-insight-block {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 36px;
    transition: border-color 0.2s;
  }
  .s-regret-block:hover, .s-insight-block:hover { border-color: var(--border-bright); }

  .s-block-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-faint); text-transform: uppercase; margin-bottom: 20px;
  }

  .s-regret-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px; font-weight: 300;
    letter-spacing: -3px; line-height: 1;
    margin-bottom: 12px;
  }

  .s-regret-badge {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase; padding: 4px 12px;
    border-radius: 2px; margin-bottom: 16px;
  }

  .s-regret-desc {
    font-size: 13px; color: var(--text-dim);
    line-height: 1.8; font-weight: 400; letter-spacing: 0.2px;
  }

  .s-rec-badge {
    display: inline-block;
    background: var(--gold-dim);
    border: 1px solid rgba(201,168,76,0.2);
    color: var(--gold);
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 12px; border-radius: 2px; margin-bottom: 16px;
  }

  .s-insight-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; color: rgba(240,237,232,0.75);
    line-height: 1.8; font-weight: 300; letter-spacing: 0.1px;
  }
`

export default function Simulate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const categories = [
    { id: 'career',        icon: '💼', name: 'Career',    sub: 'Job · Promotions' },
    { id: 'finance',       icon: '◈',  name: 'Finance',   sub: 'Money · Investing' },
    { id: 'relationships', icon: '○',  name: 'Relations', sub: 'Love · Family' },
    { id: 'health',        icon: '◇',  name: 'Health',    sub: 'Fitness · Wellness' },
  ]

  const runSimulation = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, category })
      })
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
        recommended_path: parsed.recommended_path
      })
    } catch (err) {
      setError('Simulation failed. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const rs = result?.regret_score ?? 0
  const regretColor = rs < 20 ? 'var(--green)' : rs < 50 ? 'var(--amber)' : 'var(--red)'
  const regretBg = rs < 20 ? 'rgba(74,222,128,0.08)' : rs < 50 ? 'rgba(251,191,36,0.08)' : 'rgba(248,113,113,0.08)'
  const regretBorder = rs < 20 ? 'rgba(74,222,128,0.2)' : rs < 50 ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'
  const regretLabel = rs < 20 ? 'Low Risk' : rs < 50 ? 'Moderate' : 'High Risk'
  const regretDesc = rs < 20
    ? 'Strong alignment with your long-term values. The optimal path carries minimal risk of future regret.'
    : rs < 50
    ? 'Some uncertainty ahead. Proceed with intention and revisit the recommended path regularly.'
    : 'Significant regret risk detected. Consider the safe path and consult trusted advisors before deciding.'

  return (
    <div className="s-root">
      <style>{styles}</style>

      <nav className="s-nav">
        <div className="s-logo">
          <div className="s-logo-mark" />
          LifeTwin
        </div>
        <div className="s-nav-links">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button key={item.path}
              className={`s-nav-btn ${item.path === '/simulate' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>
        <button className="s-nav-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </nav>

      <div className="s-body">
        <div className="s-header">
          <div className="s-eyebrow">Life Simulation Engine</div>
          <h1 className="s-title">
            What's your<br /><em>next move?</em>
          </h1>
          <p className="s-subtitle">Ask your digital twin anything — career, finance, relationships, health.</p>
        </div>

        <div className="s-input-wrap">
          <textarea
            className="s-textarea"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. What happens if I quit my job and go freelance in 6 months?"
            rows={2}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) runSimulation() }}
          />
          <button className="s-send-btn" onClick={runSimulation} disabled={loading || !question.trim()}>
            {loading ? '◌' : '→'}
          </button>
        </div>

        <div className="s-cats">
          {categories.map(cat => (
            <div key={cat.id}
              className={`s-cat ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <div className="s-cat-icon">{cat.icon}</div>
              <div className="s-cat-name">{cat.name}</div>
              <div className="s-cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="s-loading">
            <div className="s-loading-ring" />
            <div className="s-loading-label">Simulating your future</div>
          </div>
        )}

        {error && <div className="s-error">⚠ {error}</div>}

        {result && (
          <div className="s-results">
            <div className="s-divider">
              <div className="s-divider-line" />
              <div className="s-divider-label">Simulation Results</div>
              <div className="s-divider-line" />
            </div>

            <div className="s-question-block">
              <div className="s-question-label">Your Question</div>
              <div className="s-question-text">"{question}"</div>
            </div>

            <div className="s-analysis">
              <div className="s-analysis-tag">Twin Analysis</div>
              <div className="s-analysis-text">{result.ai_analysis}</div>
            </div>

            <div className="s-paths-header">
              <div className="s-paths-label">Three Possible Paths</div>
            </div>

            <div className="s-paths">
              {[
                { key: 'path_a', badge: 'Safe Path',    cls: 'safe'    },
                { key: 'path_b', badge: 'Risky Path',   cls: 'risky'   },
                { key: 'path_c', badge: '★ Optimal',    cls: 'optimal' },
              ].map(p => {
                const path = result[p.key]
                return (
                  <div key={p.key} className={`s-path-card ${p.cls}`}>
                    <div className={`s-path-badge ${p.cls}`}>{p.badge}</div>
                    <div className="s-path-name">{path.name}</div>
                    <div className="s-path-desc">{path.description}</div>
                    <div className="s-path-prob-wrap">
                      <div className="s-path-prob">
                        {path.probability}<span className="s-path-prob-pct">%</span>
                      </div>
                      <div className="s-path-prob-label">Success Probability</div>
                    </div>
                    <div className="s-path-divider" />
                    {[
                      ['Risk Level',  path.risk_level],
                      ['Regret Risk', `${path.regret_risk}%`],
                      ['Timeline',    path.timeline],
                      ['Happiness',   path.happiness_score],
                    ].map(([label, val]) => (
                      <div key={label} className="s-path-stat">
                        <span className="s-path-stat-label">{label}</span>
                        <span className="s-path-stat-val">{val}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div className="s-bottom">
              <div className="s-regret-block">
                <div className="s-block-label">Regret Predictor</div>
                <div className="s-regret-num" style={{ color: regretColor }}>{rs}%</div>
                <div className="s-regret-badge" style={{ color: regretColor, background: regretBg, border: `1px solid ${regretBorder}` }}>
                  {regretLabel}
                </div>
                <div className="s-regret-desc">{regretDesc}</div>
              </div>

              <div className="s-insight-block">
                <div className="s-block-label">Key Insight</div>
                <div className="s-rec-badge">Recommended · Path {result.recommended_path}</div>
                <div className="s-insight-text">{result.key_insight}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
