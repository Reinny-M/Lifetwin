import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  :root {
    --bg-deep:   #050811;
    --bg-card:   #0c1120;
    --border:    rgba(255,255,255,0.06);
    --border-md: rgba(255,255,255,0.09);
    --border-hi: rgba(255,255,255,0.15);
    --teal:      #5eead4;
    --teal-dim:  rgba(94,234,212,0.08);
    --text:      #e8eaf0;
    --text-mid:  rgba(232,234,240,0.5);
    --text-low:  rgba(232,234,240,0.22);
    --green:     #34d399;
    --amber:     #fbbf24;
    --purple:    #a78bfa;
    --red:       #fb7185;
    --blue:      #60a5fa;
    --radius:    14px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .ins-root {
    min-height: 100vh;
    background: var(--bg-deep);
    font-family: "DM Sans", system-ui, sans-serif;
    color: var(--text);
    overflow-x: hidden;
  }
  .ins-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }

  /* ── NAV ── */
  .ins-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px;
    background: rgba(5,8,17,0.88);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border-md);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 48px;
  }
  .ins-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .ins-logo-icon {
    width: 28px; height: 28px; background: var(--text);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ins-logo-text { font-size: 15px; font-weight: 600; letter-spacing: -0.3px; color: var(--text); }

  .ins-nav-links { display: flex; gap: 2px; }
  .ins-nav-btn {
    background: none; border: none;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 400;
    color: var(--text-mid); cursor: pointer;
    padding: 8px 18px; border-radius: 8px;
    transition: all 0.2s;
  }
  .ins-nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .ins-nav-btn.active {
    color: var(--text);
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border-md);
  }
  .ins-nav-back {
    background: transparent; border: 1px solid var(--border-md);
    color: var(--text-low); font-family: "DM Sans", sans-serif;
    font-size: 12px; font-weight: 500;
    padding: 7px 14px; border-radius: 100px;
    cursor: pointer; transition: all 0.2s;
  }
  .ins-nav-back:hover { color: var(--text-mid); border-color: var(--border-hi); }

  /* ── BODY ── */
  .ins-body {
    max-width: 900px; margin: 0 auto;
    padding: 96px 48px 80px;
    position: relative; z-index: 1;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── PAGE HEADER ── */
  .ins-header {
    margin-bottom: 48px;
    animation: fadeUp 0.6s ease both;
  }
  .ins-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 16px;
  }
  .ins-eyebrow-dot {
    width: 6px; height: 6px;
    background: var(--amber); border-radius: 50%;
  }
  .ins-eyebrow-text {
    font-size: 11px; font-weight: 600;
    color: var(--amber); letter-spacing: 0.12em; text-transform: uppercase;
  }
  .ins-header h1 {
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 300; letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 10px;
  }
  .ins-header h1 em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic; font-weight: 400;
    color: rgba(232,234,240,0.4);
  }
  .ins-header p {
    font-size: 14px; color: var(--text-low); font-weight: 300;
  }

  /* ── STABILITY ROW ── */
  .ins-top-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 12px;
    animation: fadeUp 0.6s ease 0.06s both;
  }

  .ins-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 18px; padding: 28px;
    transition: border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .ins-card:hover { border-color: var(--border-hi); }

  .ins-card-label {
    font-size: 11px; font-weight: 600;
    color: var(--text-low); letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .ins-card-label::before { content: ''; width: 14px; height: 1px; background: var(--text-low); }

  /* Stability card */
  .ins-stability-val {
    font-size: 64px; font-weight: 600;
    letter-spacing: -0.04em; line-height: 1;
    color: var(--amber); margin-bottom: 6px;
  }
  .ins-stability-val sup {
    font-size: 22px; font-weight: 400;
    vertical-align: super; letter-spacing: 0;
  }
  .ins-stability-sub {
    font-size: 13px; color: var(--text-low);
    font-weight: 300; line-height: 1.65; margin-bottom: 20px;
  }
  .ins-stability-bar {
    height: 3px; background: rgba(255,255,255,0.05);
    border-radius: 2px; overflow: hidden;
  }
  .ins-stability-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--amber), rgba(251,191,36,0.4));
    border-radius: 2px;
  }

  /* Insight of week card */
  .ins-week-card { border-left: 2px solid rgba(94,234,212,0.3); }
  .ins-week-quote {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 17px; font-style: italic; font-weight: 400;
    color: rgba(232,234,240,0.75);
    line-height: 1.75; margin-bottom: 20px;
  }
  .ins-impact-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--teal-dim);
    border: 1px solid rgba(94,234,212,0.15);
    color: var(--teal); font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px;
  }

  /* ── PATTERN GRID ── */
  .ins-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    animation: fadeUp 0.6s ease 0.12s both;
  }

  .ins-pattern-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 18px; padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .ins-pattern-card:hover {
    border-color: var(--border-hi);
    transform: translateY(-2px);
  }

  .ins-pattern-dot-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
  }
  .ins-pattern-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .ins-pattern-tag {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .ins-pattern-text {
    font-size: 13px; color: var(--text-mid);
    line-height: 1.75; font-weight: 300;
  }

  /* ── LIVE INSIGHTS ── */
  .ins-live-section {
    margin-top: 12px;
    animation: fadeUp 0.6s ease 0.18s both;
  }
  .ins-live-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 14px;
  }
  .ins-live-title {
    font-size: 11px; font-weight: 600;
    color: var(--text-low); letter-spacing: 0.1em; text-transform: uppercase;
  }
  .ins-live-count {
    font-size: 11px; color: var(--text-low); font-weight: 300;
  }

  .ins-live-row {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 14px; padding: 18px 20px;
    margin-bottom: 8px;
    display: flex; align-items: flex-start; gap: 14px;
    transition: border-color 0.2s;
  }
  .ins-live-row:last-child { margin-bottom: 0; }
  .ins-live-row:hover { border-color: var(--border-hi); }

  .ins-live-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border-radius: 10px; border: 1px solid var(--border-md);
    background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
  }
  .ins-live-body { flex: 1; min-width: 0; }
  .ins-live-q {
    font-size: 13px; font-weight: 400; color: var(--text);
    line-height: 1.4; margin-bottom: 4px;
  }
  .ins-live-meta {
    font-size: 11px; color: var(--text-low); font-weight: 300;
  }

  .ins-empty {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px; padding: 36px;
    text-align: center;
  }
  .ins-empty p {
    font-size: 13px; color: var(--text-low);
    font-weight: 300; line-height: 1.65;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: rgba(94,234,212,0.12); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(94,234,212,0.25); }
`

const defaultPatterns = [
  {
    tag: 'Decision timing',
    text: 'Your best decisions happen when you take at least 24 hours to reflect. Rushed choices carry a 3× higher regret rate in your profile.',
    color: '#5eead4',
  },
  {
    tag: 'Financial pattern',
    text: 'People with your risk profile who invest consistently for 6+ months see 40% better outcomes than those waiting for the perfect moment.',
    color: '#34d399',
  },
  {
    tag: 'Goal alignment',
    text: 'Your decision style means you thrive with accountability. Goals shared with others have a 65% higher completion rate for your archetype.',
    color: '#fbbf24',
  },
  {
    tag: 'Energy window',
    text: 'Your profile suggests you make clearer decisions in the morning. Consider scheduling high-stakes choices before noon.',
    color: '#a78bfa',
  },
]

const patternIcons = {
  'Decision timing': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.5v3.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Financial pattern': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 11l3.5-4 3 3 2.5-5L14 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Goal alignment': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  ),
  'Energy window': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 2L5 9h5l-3 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export default function Insights() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [insights, setInsights] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  // BUG FIX 1: .single() throws on no-row — added error guard so
  // a new user without a profile doesn't crash the component
  // BUG FIX 2: both fetches now have error handling so state never
  // ends up undefined (was relying on implicit undefined from failed destructure)
  const fetchData = async () => {
    const { data: i } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setInsights(i || [])

    const { data: p, error: profileErr } = await supabase
      .from('twin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (!profileErr) setProfile(p)
  }

  const stabilityScore = profile?.twin_health_score ?? 74

  return (
    <div className="ins-root">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="ins-nav">
        <div className="ins-logo" onClick={() => navigate('/')}>
          <div className="ins-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#050811" />
              <circle cx="7" cy="7" r="6" stroke="#050811" strokeWidth="1.5" fill="none" />
              <line x1="7" y1="1" x2="7" y2="4" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="10" x2="7" y2="13" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="ins-logo-text">LifeTwin</span>
        </div>

        <div className="ins-nav-links">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button
              key={item.path}
              className={`ins-nav-btn ${item.path === '/insights' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>

        <button className="ins-nav-back" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div className="ins-body">

        {/* HEADER */}
        <div className="ins-header">
          <div className="ins-eyebrow">
            <div className="ins-eyebrow-dot" />
            <span className="ins-eyebrow-text">Behavioral intelligence</span>
          </div>
          <h1>
            Your weekly <em>insights.</em>
          </h1>
          <p>Patterns your twin discovered about how you think and decide.</p>
        </div>

        {/* TOP ROW — stability + insight of week */}
        <div className="ins-top-row">

          {/* Stability index */}
          <div className="ins-card">
            <div className="ins-card-label">Future stability index</div>
            <div className="ins-stability-val">{stabilityScore}<sup>%</sup></div>
            <div className="ins-stability-sub">
              Your life trajectory is stable. Keep building on your current momentum.
            </div>
            <div className="ins-stability-bar">
              <div className="ins-stability-fill" style={{ width: `${stabilityScore}%` }} />
            </div>
          </div>

          {/* Insight of the week */}
          <div className="ins-card ins-week-card">
            <div className="ins-card-label">Insight of the week</div>
            <div className="ins-week-quote">
              "Your decision-making is strongest when you combine social input with personal reflection. Seek advice, then decide alone."
            </div>
            <div className="ins-impact-badge">Impact score: 9 / 10</div>
          </div>

        </div>

        {/* PATTERN GRID */}
        <div className="ins-grid">
          {defaultPatterns.map((p, i) => (
            <div key={i} className="ins-pattern-card">
              <div className="ins-pattern-dot-row">
                <div className="ins-pattern-dot" style={{ background: p.color }} />
                <div className="ins-pattern-tag" style={{ color: p.color }}>{p.tag}</div>
              </div>
              <p className="ins-pattern-text">{p.text}</p>
            </div>
          ))}
        </div>

        {/* LIVE INSIGHTS FROM DB */}
        <div className="ins-live-section">
          <div className="ins-live-header">
            <div className="ins-live-title">From your simulations</div>
            <div className="ins-live-count">{insights.length} insight{insights.length !== 1 ? 's' : ''}</div>
          </div>

          {insights.length === 0 ? (
            <div className="ins-empty">
              <p>No insights yet. Run your first simulation to start building your behavioral profile.</p>
            </div>
          ) : (
            insights.map((ins, i) => (
              <div key={ins.id ?? i} className="ins-live-row">
                <div className="ins-live-icon" style={{ color: 'var(--teal)' }}>
                  {patternIcons['Goal alignment']}
                </div>
                <div className="ins-live-body">
                  <div className="ins-live-q">{ins.insight_text || ins.text || 'Insight generated'}</div>
                  <div className="ins-live-meta">
                    {new Date(ins.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
