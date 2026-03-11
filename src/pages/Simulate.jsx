import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sim-root {
    min-height: 100vh;
    background: #F7F6F3;
    font-family: 'DM Sans', sans-serif;
    color: #111;
  }

  .sim-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 60px;
    background: #F7F6F3;
    border-bottom: 1px solid #E2E0DA;
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }

  .sim-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Serif Display', serif;
    font-size: 18px; color: #111;
    letter-spacing: -0.3px;
  }

  .sim-logo-dot {
    width: 8px; height: 8px;
    background: #111; border-radius: 50%;
  }

  .sim-nav-links { display: flex; gap: 0; }

  .sim-nav-btn {
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    color: #999; cursor: pointer;
    padding: 8px 16px;
    letter-spacing: 0.3px;
    transition: color 0.15s;
  }
  .sim-nav-btn:hover { color: #111; }
  .sim-nav-btn.active { color: #111; font-weight: 600; }

  .sim-back-btn {
    background: none;
    border: 1px solid #E2E0DA;
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #999;
    padding: 6px 12px; border-radius: 4px;
    cursor: pointer; letter-spacing: 0.5px;
    transition: all 0.15s;
  }
  .sim-back-btn:hover { color: #111; border-color: #111; }

  .sim-body {
    max-width: 900px;
    margin: 0 auto;
    padding: 100px 40px 80px;
  }

  .sim-header { margin-bottom: 56px; }

  .sim-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: #999; text-transform: uppercase;
    margin-bottom: 16px;
  }

  .sim-title {
    font-family: 'DM Serif Display', serif;
    font-size: 52px; line-height: 1.05;
    letter-spacing: -1.5px; color: #111;
    margin-bottom: 12px;
  }

  .sim-subtitle {
    font-size: 15px; color: #888;
    font-weight: 300;
  }

  .sim-input-wrap {
    background: #fff;
    border: 1px solid #E2E0DA;
    border-radius: 4px;
    display: flex;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .sim-input-wrap:focus-within { border-color: #111; }

  .sim-textarea {
    flex: 1; background: none;
    border: none; outline: none;
    color: #111; font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    resize: none; padding: 20px 24px;
    line-height: 1.6;
  }
  .sim-textarea::placeholder { color: #bbb; }

  .sim-send-btn {
    background: #111; color: #F7F6F3;
    border: none; width: 56px;
    cursor: pointer; font-size: 18px;
    flex-shrink: 0; border-radius: 0 3px 3px 0;
    transition: background 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .sim-send-btn:hover:not(:disabled) { background: #333; }
  .sim-send-btn:disabled { background: #ccc; cursor: not-allowed; }

  .sim-cats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px; margin-bottom: 48px;
  }

  .sim-cat {
    background: #fff;
    border: 1px solid #E2E0DA;
    border-radius: 4px; padding: 14px 12px;
    text-align: center; cursor: pointer;
    transition: all 0.15s;
  }
  .sim-cat:hover { border-color: #111; }
  .sim-cat.active { background: #111; border-color: #111; }
  .sim-cat.active .sim-cat-name { color: #F7F6F3; }
  .sim-cat.active .sim-cat-sub { color: #777; }

  .sim-cat-icon { font-size: 20px; margin-bottom: 6px; }
  .sim-cat-name { font-size: 12px; font-weight: 600; color: #111; margin-bottom: 2px; }
  .sim-cat-sub { font-size: 10px; color: #bbb; font-family: 'DM Mono', monospace; }

  .sim-loading {
    text-align: center; padding: 72px 0;
    border-top: 1px solid #E2E0DA;
  }
  .sim-loading-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #999;
    letter-spacing: 2px; text-transform: uppercase;
    animation: blink 1.5s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .sim-error {
    background: #fff5f5;
    border: 1px solid #ffd5d5;
    border-radius: 4px; padding: 14px 18px;
    color: #c00; font-size: 12px;
    margin-bottom: 24px;
    font-family: 'DM Mono', monospace;
  }

  .sim-results { border-top: 2px solid #111; padding-top: 48px; }

  .sim-question-block { margin-bottom: 48px; }

  .sim-question-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: #bbb; text-transform: uppercase;
    margin-bottom: 10px;
  }

  .sim-question-text {
    font-family: 'DM Serif Display', serif;
    font-size: 28px; line-height: 1.3;
    letter-spacing: -0.5px; color: #111;
    font-style: italic;
  }

  .sim-analysis-block {
    background: #fff;
    border: 1px solid #E2E0DA;
    border-radius: 4px;
    padding: 28px 32px;
    margin-bottom: 48px;
    display: flex; gap: 32px; align-items: flex-start;
  }

  .sim-analysis-tag {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: #bbb; text-transform: uppercase;
    white-space: nowrap; padding-top: 4px;
    min-width: 80px;
  }

  .sim-analysis-text {
    font-size: 15px; color: #444;
    line-height: 1.8; font-weight: 300;
  }

  .sim-paths-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: #bbb; text-transform: uppercase;
    margin-bottom: 16px;
  }

  .sim-paths {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #E2E0DA;
    border: 1px solid #E2E0DA;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1px;
  }

  .sim-path-card {
    background: #fff;
    padding: 28px 24px;
    transition: background 0.2s;
  }
  .sim-path-card:hover { background: #FAFAF8; }
  .sim-path-card.optimal { background: #111; }
  .sim-path-card.optimal:hover { background: #1a1a1a; }
  .sim-path-card.optimal .sim-path-name { color: #F7F6F3; }
  .sim-path-card.optimal .sim-path-desc { color: #777; }
  .sim-path-card.optimal .sim-path-prob { color: #F7F6F3; }
  .sim-path-card.optimal .sim-path-prob-label { color: #555; }
  .sim-path-card.optimal .sim-path-stat-label { color: #555; }
  .sim-path-card.optimal .sim-path-stat-val { color: #F7F6F3; }
  .sim-path-card.optimal .sim-path-divider { background: #2a2a2a; }
  .sim-path-card.optimal .sim-path-badge { background: #F7F6F3; color: #111; border-color: #F7F6F3; }

  .sim-path-badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase;
    background: #F7F6F3; color: #999;
    border: 1px solid #E2E0DA;
    padding: 3px 8px; border-radius: 2px;
    margin-bottom: 20px;
  }

  .sim-path-name {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; letter-spacing: -0.3px;
    color: #111; margin-bottom: 10px; line-height: 1.2;
  }

  .sim-path-desc {
    font-size: 12px; color: #888;
    line-height: 1.7; margin-bottom: 24px; font-weight: 300;
  }

  .sim-path-prob {
    font-family: 'DM Serif Display', serif;
    font-size: 56px; letter-spacing: -2px;
    color: #111; line-height: 1; margin-bottom: 2px;
  }

  .sim-path-prob-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    color: #bbb; text-transform: uppercase; margin-bottom: 20px;
  }

  .sim-path-divider { height: 1px; background: #F0EEE9; margin-bottom: 16px; }

  .sim-path-stat {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 8px;
  }

  .sim-path-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; color: #bbb;
    letter-spacing: 1px; text-transform: uppercase;
  }

  .sim-path-stat-val { font-size: 12px; font-weight: 600; color: #111; }

  .sim-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #E2E0DA;
    border: 1px solid #E2E0DA;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
  }

  .sim-regret-block, .sim-insight-block {
    background: #fff; padding: 32px;
  }

  .sim-block-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: #bbb; text-transform: uppercase; margin-bottom: 16px;
  }

  .sim-regret-score {
    font-family: 'DM Serif Display', serif;
    font-size: 72px; letter-spacing: -3px; line-height: 1; margin-bottom: 8px;
  }

  .sim-regret-status {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase;
    padding-bottom: 1px;
  }

  .sim-regret-desc {
    font-size: 12px; color: #888;
    line-height: 1.7; font-weight: 300; margin-top: 12px;
  }

  .sim-rec-pill {
    display: inline-block;
    background: #111; color: #F7F6F3;
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 10px; border-radius: 2px; margin-bottom: 14px;
  }

  .sim-insight-text {
    font-size: 14px; color: #444;
    line-height: 1.8; font-weight: 300;
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
      setError('Connection failed. Is the server running?')
      console.error(err)
    }
    setLoading(false)
  }

  const regretColor = !result ? '#111'
    : result.regret_score < 20 ? '#16a34a'
    : result.regret_score < 50 ? '#d97706'
    : '#dc2626'

  return (
    <div className="sim-root">
      <style>{styles}</style>

      <nav className="sim-nav">
        <div className="sim-logo">
          <div className="sim-logo-dot" />
          LifeTwin
        </div>
        <div className="sim-nav-links">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button key={item.path}
              className={`sim-nav-btn ${item.path === '/simulate' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>
        <button className="sim-back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </nav>

      <div className="sim-body">
        <div className="sim-header">
          <div className="sim-eyebrow">Life Simulation Engine</div>
          <h1 className="sim-title">What's your<br /><em>next move?</em></h1>
          <p className="sim-subtitle">Ask your twin anything about your future</p>
        </div>

        <div className="sim-input-wrap">
          <textarea
            className="sim-textarea"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. What happens if I quit my job and go freelance in 6 months?"
            rows={2}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) runSimulation() }}
          />
          <button className="sim-send-btn" onClick={runSimulation} disabled={loading || !question.trim()}>
            {loading ? '…' : '→'}
          </button>
        </div>

        <div className="sim-cats">
          {categories.map(cat => (
            <div key={cat.id} className={`sim-cat ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>
              <div className="sim-cat-icon">{cat.icon}</div>
              <div className="sim-cat-name">{cat.name}</div>
              <div className="sim-cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="sim-loading">
            <div className="sim-loading-label">Simulating your future</div>
          </div>
        )}

        {error && <div className="sim-error">⚠ {error}</div>}

        {result && (
          <div className="sim-results">
            <div className="sim-question-block">
              <div className="sim-question-label">Your Question</div>
              <div className="sim-question-text">"{question}"</div>
            </div>

            <div className="sim-analysis-block">
              <div className="sim-analysis-tag">Twin Analysis</div>
              <div className="sim-analysis-text">{result.ai_analysis}</div>
            </div>

            <div className="sim-paths-label">Three Possible Paths</div>
            <div className="sim-paths">
              {[
                { key: 'path_a', badge: 'Safe',     optimal: false },
                { key: 'path_b', badge: 'Risky',    optimal: false },
                { key: 'path_c', badge: '★ Optimal', optimal: true  },
              ].map(p => {
                const path = result[p.key]
                return (
                  <div key={p.key} className={`sim-path-card ${p.optimal ? 'optimal' : ''}`}>
                    <div className="sim-path-badge">{p.badge}</div>
                    <div className="sim-path-name">{path.name}</div>
                    <div className="sim-path-desc">{path.description}</div>
                    <div className="sim-path-prob">{path.probability}%</div>
                    <div className="sim-path-prob-label">Success probability</div>
                    <div className="sim-path-divider" />
                    {[
                      ['Risk',      path.risk_level],
                      ['Regret',    `${path.regret_risk}%`],
                      ['Timeline',  path.timeline],
                      ['Happiness', path.happiness_score],
                    ].map(([label, val]) => (
                      <div key={label} className="sim-path-stat">
                        <span className="sim-path-stat-label">{label}</span>
                        <span className="sim-path-stat-val">{val}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div className="sim-bottom">
              <div className="sim-regret-block">
                <div className="sim-block-label">Regret Predictor</div>
                <div className="sim-regret-score" style={{ color: regretColor }}>
                  {result.regret_score}<span style={{ fontSize: '32px' }}>%</span>
                </div>
                <div className="sim-regret-status" style={{ color: regretColor, borderBottom: `1px solid ${regretColor}` }}>
                  {result.regret_score < 20 ? 'Low Risk' : result.regret_score < 50 ? 'Moderate Risk' : 'High Risk'}
                </div>
                <div className="sim-regret-desc">
                  {result.regret_score < 20
                    ? 'Low probability of regret. The optimal path aligns well with long-term satisfaction.'
                    : result.regret_score < 50
                    ? 'Moderate regret risk. Proceed thoughtfully and follow the recommended path.'
                    : 'High regret risk. Strongly consider the safe path before deciding.'}
                </div>
              </div>
              <div className="sim-insight-block">
                <div className="sim-block-label">Key Insight</div>
                <div className="sim-rec-pill">Recommended Path {result.recommended_path}</div>
                <div className="sim-insight-text">{result.key_insight}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
