import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  :root {
    --bg-deep:   #050811;
    --bg-card:   #0c1120;
    --bg-raised: #0f1628;
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
    --radius:    14px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  .db-root {
    min-height: 100vh;
    background: var(--bg-deep);
    font-family: "DM Sans", system-ui, sans-serif;
    color: var(--text);
    overflow-x: hidden;
  }

  /* Grid texture */
  .db-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none; z-index: 0;
  }

  /* ── NAV ── */
  .db-nav {
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

  .db-logo {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
  }
  .db-logo-icon {
    width: 28px; height: 28px;
    background: var(--text);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .db-logo-text {
    font-size: 15px; font-weight: 600;
    letter-spacing: -0.3px; color: var(--text);
  }

  .db-nav-links { display: flex; gap: 2px; }
  .db-nav-btn {
    background: none; border: none;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 400;
    color: var(--text-mid); cursor: pointer;
    padding: 8px 18px; border-radius: 8px;
    transition: all 0.2s;
  }
  .db-nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .db-nav-btn.active {
    color: var(--text);
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border-md);
  }

  .db-nav-right {
    display: flex; align-items: center; gap: 10px;
  }
  .db-avatar-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 100px; padding: 5px 14px 5px 6px;
  }
  .db-avatar {
    width: 26px; height: 26px;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--border-md);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: var(--text-mid);
    flex-shrink: 0;
  }
  .db-avatar-name {
    font-size: 12px; font-weight: 500; color: var(--text-mid);
  }
  .db-signout-btn {
    background: transparent;
    border: 1px solid var(--border-md);
    color: var(--text-low);
    font-family: "DM Sans", sans-serif;
    font-size: 12px; font-weight: 500;
    padding: 7px 14px; border-radius: 100px;
    cursor: pointer; transition: all 0.2s;
  }
  .db-signout-btn:hover { color: var(--text-mid); border-color: var(--border-hi); }

  /* ── BODY ── */
  .db-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 96px 48px 80px;
    position: relative; z-index: 1;
  }

  /* ── WELCOME ── */
  .db-welcome {
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-welcome h1 {
    font-size: clamp(26px, 3.5vw, 36px);
    font-weight: 300; letter-spacing: -0.03em;
    line-height: 1.1; margin-bottom: 8px;
  }
  .db-welcome h1 em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic; font-weight: 400;
    color: rgba(232,234,240,0.45);
  }
  .db-welcome p {
    font-size: 14px; color: var(--text-low);
    font-weight: 300;
  }

  /* ── QUICK SIMULATE ── */
  .db-simulate-box {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 18px; padding: 24px;
    margin-bottom: 20px;
    position: relative; overflow: hidden;
    animation: fadeUp 0.6s ease 0.06s both;
  }
  .db-simulate-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 15%, rgba(94,234,212,0.25) 50%, transparent 85%);
  }
  .db-simulate-label {
    font-size: 11px; font-weight: 600;
    color: var(--teal); letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .db-simulate-label::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%; background: var(--teal);
    display: inline-block;
  }
  .db-simulate-row {
    display: flex; gap: 10px; margin-bottom: 12px;
  }
  .db-simulate-input {
    flex: 1;
    background: var(--bg-deep);
    border: 1px solid var(--border-md);
    border-radius: 100px; padding: 12px 20px;
    color: var(--text); font-size: 14px;
    outline: none; font-family: "DM Sans", sans-serif;
    font-weight: 300;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .db-simulate-input::placeholder { color: var(--text-low); }
  .db-simulate-input:focus {
    border-color: rgba(94,234,212,0.3);
    box-shadow: 0 0 0 3px rgba(94,234,212,0.06);
  }
  .db-simulate-go {
    background: var(--text);
    color: var(--bg-deep);
    border: none; border-radius: 100px;
    padding: 12px 24px;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: all 0.2s; letter-spacing: 0.01em;
  }
  .db-simulate-go:hover { background: #fff; transform: translateY(-1px); }

  .db-chips {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .db-chip {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    padding: 5px 14px; border-radius: 100px;
    font-size: 12px; color: var(--text-low);
    cursor: pointer; transition: all 0.2s;
    font-weight: 400;
  }
  .db-chip:hover { border-color: var(--border-hi); color: var(--text-mid); }

  /* ── STATS ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 20px;
    animation: fadeUp 0.6s ease 0.1s both;
  }
  .db-stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: var(--radius); padding: 20px 22px;
    transition: border-color 0.2s;
  }
  .db-stat-card:hover { border-color: var(--border-hi); }
  .db-stat-eyebrow {
    font-size: 11px; font-weight: 500;
    color: var(--text-low); letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .db-stat-val {
    font-size: 38px; font-weight: 600;
    letter-spacing: -0.03em; line-height: 1;
    margin-bottom: 4px;
  }
  .db-stat-label {
    font-size: 12px; color: var(--text-low); font-weight: 300;
  }

  /* ── GRID 2-COL ── */
  .db-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 12px;
    animation: fadeUp 0.6s ease 0.14s both;
  }

  /* ── SECTION HEADER ── */
  .db-section-head {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 14px;
  }
  .db-section-title {
    font-size: 13px; font-weight: 600;
    color: var(--text-mid); letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .db-section-action {
    background: none; border: none;
    color: var(--teal); font-size: 12px;
    font-weight: 500; cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: opacity 0.2s;
  }
  .db-section-action:hover { opacity: 0.7; }

  /* ── SIMULATIONS LIST ── */
  .db-sims-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 18px; padding: 24px;
  }

  .db-sim-row {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer; transition: opacity 0.15s;
  }
  .db-sim-row:last-child { border-bottom: none; padding-bottom: 0; }
  .db-sim-row:first-child { padding-top: 0; }
  .db-sim-row:hover { opacity: 0.75; }

  .db-sim-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-md);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .db-sim-q {
    font-size: 13px; font-weight: 400;
    color: var(--text); line-height: 1.4;
    margin-bottom: 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 340px;
  }
  .db-sim-meta {
    font-size: 11px; color: var(--text-low); font-weight: 300;
  }
  .db-sim-badge {
    margin-left: auto;
    padding: 3px 10px; border-radius: 100px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    white-space: nowrap; flex-shrink: 0;
    background: var(--teal-dim);
    border: 1px solid rgba(94,234,212,0.15);
    color: var(--teal);
  }

  .db-empty {
    text-align: center; padding: 36px 20px;
  }
  .db-empty-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-md);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .db-empty p {
    font-size: 13px; color: var(--text-low);
    font-weight: 300; margin-bottom: 16px; line-height: 1.6;
  }
  .db-empty-btn {
    background: var(--text);
    color: var(--bg-deep);
    border: none; border-radius: 100px;
    padding: 10px 22px;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .db-empty-btn:hover { background: #fff; }

  /* ── TWIN STATUS ── */
  .db-twin-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 18px; padding: 24px;
    display: flex; flex-direction: column;
  }

  .db-twin-archetype {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 20px; font-style: italic;
    font-weight: 400; color: var(--text);
    margin-bottom: 4px; line-height: 1.2;
  }
  .db-twin-style {
    font-size: 12px; color: var(--text-low);
    font-weight: 300; margin-bottom: 20px;
  }

  .db-health-bar-wrap {
    margin-bottom: 8px;
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px; overflow: hidden;
  }
  .db-health-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--teal), rgba(94,234,212,0.5));
    border-radius: 2px;
    transition: width 0.6s ease;
  }
  .db-health-label {
    display: flex; justify-content: space-between;
    font-size: 11px; color: var(--text-low); font-weight: 300;
  }

  .db-twin-divider {
    height: 1px; background: var(--border);
    margin: 20px 0;
  }

  .db-twin-cta p {
    font-size: 13px; color: var(--text-low);
    font-weight: 300; line-height: 1.65; margin-bottom: 16px;
  }
  .db-twin-cta-btn {
    width: 100%;
    background: var(--text);
    color: var(--bg-deep);
    border: none; border-radius: 100px;
    padding: 12px;
    font-family: "DM Sans", sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
  }
  .db-twin-cta-btn:hover { background: #fff; }

  .db-twin-icon-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  }
  .db-twin-icon {
    width: 40px; height: 40px;
    background: var(--teal-dim);
    border: 1px solid rgba(94,234,212,0.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
`

const categoryIcons = {
  career: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="5" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5V4a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  finance: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 3.5v7M5 5.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5-1 1-2 1.5-2 .7-2 1.5.9 1.5 2 1.5 2-.7 2-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  relationships: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11.5S1.5 8 1.5 4.8a2.8 2.8 0 0 1 5.5-.8 2.8 2.8 0 0 1 5.5.8C12.5 8 7 11.5 7 11.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  health: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h2.5L5 4l2 7 2-5 1.5 3H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [simulations, setSimulations] = useState([])
  const [insights, setInsights] = useState([])
  const [question, setQuestion] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchSimulations()
      fetchInsights()
    }
  }, [user])

  // BUG FIX: All fetch functions now handle errors gracefully
  // so a failed query doesn't silently leave state undefined
  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('twin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (!error) setProfile(data)
  }

  const fetchSimulations = async () => {
    const { data } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    setSimulations(data || [])
  }

  const fetchInsights = async () => {
    const { data } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)
    setInsights(data || [])
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // BUG FIX: safe fallback chain avoids crash if user object is incomplete
  const userName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there'

  const initials = userName.slice(0, 2).toUpperCase()

  const handleSimulate = () => navigate('/simulate')

  return (
    <div className="db-root">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="db-nav">
        <div className="db-logo" onClick={() => navigate('/')}>
          <div className="db-logo-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#050811" />
              <circle cx="7" cy="7" r="6" stroke="#050811" strokeWidth="1.5" fill="none" />
              <line x1="7" y1="1" x2="7" y2="4" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="10" x2="7" y2="13" stroke="#050811" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="db-logo-text">LifeTwin</span>
        </div>

        <div className="db-nav-links">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button
              key={item.path}
              className={`db-nav-btn ${item.path === '/dashboard' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>

        <div className="db-nav-right">
          <div className="db-avatar-pill">
            <div className="db-avatar">{initials}</div>
            <span className="db-avatar-name">{userName}</span>
          </div>
          <button className="db-signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <div className="db-body">

        {/* WELCOME */}
        <div className="db-welcome">
          <h1>Good day, <em>{userName}.</em></h1>
          <p>Your twin is ready to simulate your future.</p>
        </div>

        {/* QUICK SIMULATE */}
        <div className="db-simulate-box">
          <div className="db-simulate-label">Ask your twin</div>
          <div className="db-simulate-row">
            <input
              className="db-simulate-input"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What if I quit my job and started freelancing?"
              onKeyDown={e => e.key === 'Enter' && question.trim() && handleSimulate()}
            />
            <button className="db-simulate-go" onClick={handleSimulate}>
              Simulate →
            </button>
          </div>
          <div className="db-chips">
            {[
              'Should I take this job?',
              'Where will I be financially?',
              'Am I ready for a relationship?',
              'What if I trained daily?',
            ].map(chip => (
              <span key={chip} className="db-chip" onClick={handleSimulate}>{chip}</span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="db-stats">
          {[
            { label: 'Simulations run',   val: simulations.length,                          color: 'var(--teal)'   },
            { label: 'Twin health',        val: profile ? `${profile.twin_health_score}%` : '—', color: 'var(--green)'  },
            { label: 'Insights generated', val: insights.length,                             color: 'var(--amber)'  },
          ].map(s => (
            <div className="db-stat-card" key={s.label}>
              <div className="db-stat-eyebrow">{s.label}</div>
              <div className="db-stat-val" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* 2-COL GRID */}
        <div className="db-grid">

          {/* RECENT SIMULATIONS */}
          <div className="db-sims-panel">
            <div className="db-section-head">
              <div className="db-section-title">Recent simulations</div>
              <button className="db-section-action" onClick={handleSimulate}>New →</button>
            </div>

            {simulations.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="rgba(232,234,240,0.2)" strokeWidth="1.2" />
                    <path d="M6 10c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" stroke="rgba(232,234,240,0.2)" strokeWidth="1.2" />
                    <circle cx="10" cy="10" r="1.5" fill="rgba(232,234,240,0.2)" />
                  </svg>
                </div>
                <p>No simulations yet.<br />Ask your twin anything to get started.</p>
                <button className="db-empty-btn" onClick={handleSimulate}>Run first simulation →</button>
              </div>
            ) : (
              simulations.map(sim => (
                <div key={sim.id} className="db-sim-row" onClick={handleSimulate}>
                  <div className="db-sim-icon" style={{ color: 'var(--text-mid)' }}>
                    {categoryIcons[sim.category] || categoryIcons.career}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="db-sim-q">{sim.question_text}</div>
                    <div className="db-sim-meta">
                      {sim.category} · {new Date(sim.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="db-sim-badge">Path {sim.recommended_path}</div>
                </div>
              ))
            )}
          </div>

          {/* TWIN STATUS */}
          <div className="db-twin-panel">
            <div className="db-section-head">
              <div className="db-section-title">Twin status</div>
            </div>

            {profile ? (
              <>
                <div className="db-twin-icon-row">
                  <div className="db-twin-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="4" stroke="#5eead4" strokeWidth="1.2" fill="none" />
                      <circle cx="10" cy="10" r="8.5" stroke="rgba(94,234,212,0.25)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      <line x1="10" y1="1" x2="10" y2="5.5" stroke="#5eead4" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="10" y1="14.5" x2="10" y2="19" stroke="#5eead4" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="db-twin-archetype">{profile.decision_archetype}</div>
                    <div className="db-twin-style">{profile.decision_style}</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-low)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Twin health
                </div>
                <div className="db-health-bar-wrap">
                  <div className="db-health-bar-fill" style={{ width: `${profile.twin_health_score}%` }} />
                </div>
                <div className="db-health-label">
                  <span>0%</span>
                  <span style={{ color: 'var(--teal)' }}>{profile.twin_health_score}%</span>
                  <span>100%</span>
                </div>

                <div className="db-twin-divider" />
                <button className="db-twin-cta-btn" onClick={() => navigate('/profile')}>
                  View full profile →
                </button>
              </>
            ) : (
              <div className="db-twin-cta">
                <div className="db-twin-icon-row" style={{ marginBottom: '14px' }}>
                  <div className="db-twin-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="8.5" stroke="rgba(94,234,212,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      <path d="M10 6v4l2.5 2.5" stroke="rgba(94,234,212,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-mid)', fontWeight: 300 }}>
                    Not yet built
                  </div>
                </div>
                <p>Complete onboarding to build your Decision DNA and unlock your full twin profile.</p>
                <button className="db-twin-cta-btn" onClick={() => navigate('/onboarding')}>
                  Build my twin →
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
