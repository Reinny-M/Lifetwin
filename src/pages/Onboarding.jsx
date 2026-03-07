import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    focus: '',
    risk: 50,
    style: '',
    tags: []
  })

  const focuses = [
    { id: 'career', icon: '💼', label: 'Career & Work' },
    { id: 'finance', icon: '💰', label: 'Money & Finance' },
    { id: 'relationships', icon: '❤️', label: 'Relationships' },
    { id: 'health', icon: '🏃', label: 'Health & Fitness' },
    { id: 'education', icon: '📚', label: 'Education' },
    { id: 'purpose', icon: '🌟', label: 'Life Purpose' },
  ]

  const styles = [
    { id: 'analytical', icon: '🧠', label: 'Analytical', desc: 'I research before deciding' },
    { id: 'intuitive', icon: '⚡', label: 'Intuitive', desc: 'I trust my gut feeling' },
    { id: 'emotional', icon: '❤️', label: 'Emotional', desc: 'I follow my heart' },
    { id: 'social', icon: '👥', label: 'Social', desc: 'I ask others for advice' },
  ]

  const behaviorTags = [
    'Perfectionist', 'Risk-taker', 'Planner', 'Spontaneous',
    'Ambitious', 'Cautious', 'Creative', 'Logical',
    'Empathetic', 'Independent', 'Competitive', 'Collaborative'
  ]

  const toggleTag = (tag) => {
    setData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const finish = async () => {
    setLoading(true)
    const archetype = data.style === 'analytical' ? 'Strategic Thinker'
      : data.style === 'intuitive' ? 'Intuitive Explorer'
      : data.style === 'emotional' ? 'Heart-Led Dreamer'
      : 'Social Navigator'

    await supabase.from('twin_profiles').upsert({
      user_id: user.id,
      decision_archetype: archetype,
      risk_tolerance_score: data.risk,
      decision_style: data.style,
      primary_goals: [data.focus],
      behavioral_tags: data.tags,
      twin_health_score: 65,
      last_updated: new Date().toISOString()
    })
    setLoading(false)
    setStep(4)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080f',
      fontFamily: 'outfit, sans-serif',
      color: '#eef0f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>

        {/* Step 1 — Focus */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Let's build your Decision Twin
              </h1>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                What area of life do you want to focus on first?
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px', marginBottom: '28px'
            }}>
              {focuses.map(f => (
                <div key={f.id}
                  onClick={() => setData(prev => ({ ...prev, focus: f.id }))}
                  style={{
                    background: data.focus === f.id ? 'rgba(108,99,255,0.15)' : '#111520',
                    border: `2px solid ${data.focus === f.id ? '#6c63ff' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '16px', padding: '20px',
                    cursor: 'pointer', textAlign: 'center'
                  }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{f.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!data.focus}
              style={{
                width: '100%', background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none', padding: '16px',
                borderRadius: '14px', fontSize: '16px', fontWeight: '700',
                cursor: data.focus ? 'pointer' : 'not-allowed',
                opacity: data.focus ? 1 : 0.5,
                fontFamily: 'outfit, sans-serif'
              }}
            >Continue →</button>
          </div>
        )}

        {/* Step 2 — Risk */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                What's your risk tolerance?
              </h1>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                How comfortable are you with uncertainty?
              </p>
            </div>

            <div style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '32px',
              marginBottom: '28px', textAlign: 'center'
            }}>
              <div style={{
                fontSize: '64px', fontWeight: '700',
                color: '#6c63ff', fontFamily: 'serif',
                marginBottom: '8px'
              }}>{data.risk}</div>
              <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                {data.risk < 30 ? '🛡️ Very Cautious' : data.risk < 50 ? '🎯 Balanced' : data.risk < 70 ? '🚀 Adventurous' : '⚡ Bold Risk-Taker'}
              </div>
              <input
                type="range" min="0" max="100"
                value={data.risk}
                onChange={e => setData(prev => ({ ...prev, risk: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#6c63ff' }}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '12px', color: '#6b7280', marginTop: '8px'
              }}>
                <span>Play it safe</span>
                <span>Take big risks</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, background: '#111520',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#6b7280', padding: '16px',
                borderRadius: '14px', fontSize: '15px',
                cursor: 'pointer', fontFamily: 'outfit, sans-serif'
              }}>← Back</button>
              <button onClick={() => setStep(3)} style={{
                flex: 2, background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none', padding: '16px',
                borderRadius: '14px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'outfit, sans-serif'
              }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Style + Tags */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                How do you make decisions?
              </h1>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px', marginBottom: '24px'
            }}>
              {styles.map(s => (
                <div key={s.id}
                  onClick={() => setData(prev => ({ ...prev, style: s.id }))}
                  style={{
                    background: data.style === s.id ? 'rgba(108,99,255,0.15)' : '#111520',
                    border: `2px solid ${data.style === s.id ? '#6c63ff' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '14px', padding: '16px',
                    cursor: 'pointer'
                  }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              Select traits that describe you:
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: '8px', marginBottom: '24px'
            }}>
              {behaviorTags.map(tag => (
                <span key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '7px 14px', borderRadius: '100px',
                    fontSize: '13px', cursor: 'pointer',
                    background: data.tags.includes(tag) ? 'rgba(108,99,255,0.2)' : '#111520',
                    border: `1px solid ${data.tags.includes(tag) ? '#6c63ff' : 'rgba(255,255,255,0.07)'}`,
                    color: data.tags.includes(tag) ? '#a78bfa' : '#6b7280'
                  }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} style={{
                flex: 1, background: '#111520',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#6b7280', padding: '16px',
                borderRadius: '14px', fontSize: '15px',
                cursor: 'pointer', fontFamily: 'outfit, sans-serif'
              }}>← Back</button>
              <button
                onClick={finish}
                disabled={!data.style || loading}
                style={{
                  flex: 2, background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                  color: 'white', border: 'none', padding: '16px',
                  borderRadius: '14px', fontSize: '16px', fontWeight: '700',
                  cursor: data.style ? 'pointer' : 'not-allowed',
                  opacity: data.style ? 1 : 0.5,
                  fontFamily: 'outfit, sans-serif'
                }}
              >{loading ? 'Building...' : 'Build My Twin →'}</button>
            </div>
          </div>
        )}

        {/* Step 4 — Twin Reveal */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px', height: '100px',
              background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
              borderRadius: '28px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', margin: '0 auto 24px',
              boxShadow: '0 0 60px rgba(108,99,255,0.4)'
            }}>🧬</div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
              Your Twin is Ready!
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
              Your Decision DNA has been built. Your twin is now ready to simulate your future and guide your most important decisions.
            </p>
            <div style={{
              background: '#111520',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '20px', padding: '24px',
              marginBottom: '28px', textAlign: 'left'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Decision DNA</div>
              {[
                ['Focus Area', focuses.find(f => f.id === data.focus)?.label || data.focus],
                ['Risk Score', `${data.risk}/100`],
                ['Decision Style', styles.find(s => s.id === data.style)?.label || data.style],
                ['Traits', data.tags.slice(0, 3).join(', ') || 'None selected']
              ].map(([label, val]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: '600', color: '#a78bfa' }}>{val}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none', padding: '18px',
                borderRadius: '14px', fontSize: '17px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'outfit, sans-serif',
                boxShadow: '0 8px 24px rgba(108,99,255,0.3)'
              }}
            >Go to My Dashboard →</button>
          </div>
        )}

        {/* Progress dots */}
        {step < 4 && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '8px', marginTop: '28px'
          }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: s === step ? '24px' : '8px',
                height: '8px', borderRadius: '4px',
                background: s === step ? '#6c63ff' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}