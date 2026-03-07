import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Simulate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const categories = [
    { id: 'career', icon: '💼', name: 'Career', count: 'Job changes, promotions' },
    { id: 'finance', icon: '💰', name: 'Finance', count: 'Money, investing' },
    { id: 'relationships', icon: '❤️', name: 'Relationships', count: 'Love, family' },
    { id: 'health', icon: '🏃', name: 'Health', count: 'Fitness, wellness' },
  ]

  const runSimulation = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:3002/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, category })
      })

      const data = await response.json()
      const text = data.content[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
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
      setError('Something went wrong. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080f',
      fontFamily: 'outfit, sans-serif',
      color: '#eef0f6'
    }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        background: 'rgba(6,8,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
            borderRadius: '9px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '16px'
          }}>🧬</div>
          <span style={{ fontWeight: '700', fontSize: '18px' }}>LifeTwin</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate', path: '/simulate' },
            { label: 'My Twin', path: '/profile' },
            { label: 'Insights', path: '/insights' }
          ].map(item => (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: item.path === '/simulate' ? 'rgba(108,99,255,0.1)' : 'none',
                border: 'none',
                color: item.path === '/simulate' ? '#a78bfa' : '#8892a4',
                fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: 'outfit, sans-serif'
              }}
            >{item.label}</button>
          ))}
        </div>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          color: '#6b7280', padding: '8px 14px',
          borderRadius: '8px', cursor: 'pointer',
          fontSize: '13px', fontFamily: 'outfit, sans-serif'
        }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '90px 32px 60px' }}>
        <h1 style={{
          fontSize: '36px', fontWeight: '700',
          textAlign: 'center', marginBottom: '8px'
        }}>Run a Life Simulation</h1>
        <p style={{
          textAlign: 'center', color: '#6b7280',
          fontSize: '16px', marginBottom: '36px'
        }}>Ask your twin anything about your future</p>

        <div style={{
          background: '#111520',
          border: '2px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '8px 8px 8px 20px',
          display: 'flex', gap: '12px',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. If I quit my job and go freelance, what happens in 6 months?"
            rows={2}
            style={{
              flex: 1, background: 'none',
              border: 'none', outline: 'none',
              color: '#eef0f6', fontSize: '16px',
              fontFamily: 'outfit, sans-serif',
              resize: 'none', padding: '12px 0',
              lineHeight: '1.6'
            }}
          />
          <button
            onClick={runSimulation}
            disabled={loading || !question.trim()}
            style={{
              background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
              color: 'white', border: 'none',
              width: '52px', height: '52px',
              borderRadius: '12px', cursor: 'pointer',
              fontSize: '22px', flexShrink: 0,
              marginTop: '4px',
              opacity: loading || !question.trim() ? 0.5 : 1,
              boxShadow: '0 4px 16px rgba(108,99,255,0.3)'
            }}
          >{loading ? '⏳' : '→'}</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px', marginBottom: '36px'
        }}>
          {categories.map(cat => (
            <div key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                background: category === cat.id ? 'rgba(108,99,255,0.1)' : '#111520',
                border: `1px solid ${category === cat.id ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '14px', padding: '16px 12px',
                textAlign: 'center', cursor: 'pointer'
              }}>
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>{cat.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{cat.name}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{cat.count}</div>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
            <p style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '600' }}>
              Your twin is analyzing your question...
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
              Building your personalized simulation
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px', padding: '16px',
            color: '#ef4444', textAlign: 'center',
            marginBottom: '20px'
          }}>{error}</div>
        )}

        {result && (
          <div>
            <div style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: '4px solid #6c63ff',
              borderRadius: '14px', padding: '18px 20px',
              marginBottom: '20px',
              fontSize: '16px', fontStyle: 'italic',
              color: '#8892a4', lineHeight: '1.6'
            }}>"{question}"</div>

            <div style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '22px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  background: '#6c63ff', color: 'white',
                  padding: '4px 12px', borderRadius: '100px',
                  fontSize: '11px', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>Your Twin Says</span>
              </div>
              <p style={{ fontSize: '15px', color: '#8892a4', lineHeight: '1.8' }}>
                {result.ai_analysis}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px', marginBottom: '20px'
            }}>
              {[
                { key: 'path_a', color: '#10b981', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)', tag: 'Safe Path' },
                { key: 'path_b', color: '#ef4444', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)', tag: 'Risky Path' },
                { key: 'path_c', color: '#a78bfa', bg: 'rgba(108,99,255,0.07)', border: 'rgba(108,99,255,0.3)', tag: '⚡ Optimal' }
              ].map(p => {
                const path = result[p.key]
                return (
                  <div key={p.key} style={{
                    background: p.bg,
                    border: `2px solid ${p.border}`,
                    borderRadius: '18px', padding: '22px'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '3px 10px', borderRadius: '100px',
                      fontSize: '10px', fontWeight: '700',
                      textTransform: 'uppercase', letterSpacing: '1px',
                      background: `${p.color}20`, color: p.color,
                      marginBottom: '12px'
                    }}>{p.tag}</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{path.name}</div>
                    <div style={{ fontSize: '12px', color: '#8892a4', lineHeight: '1.6', marginBottom: '16px' }}>{path.description}</div>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: p.color, marginBottom: '4px', fontFamily: 'serif' }}>{path.probability}%</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '14px' }}>Success probability</div>
                    {[
                      ['Risk Level', path.risk_level],
                      ['Regret Risk', `${path.regret_risk}%`],
                      ['Timeline', path.timeline],
                      ['Happiness', path.happiness_score]
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: '#6b7280' }}>{label}</span>
                        <span style={{ fontWeight: '700' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0f1120, #1a1030)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '18px', padding: '28px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '24px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>🔮 Regret Predictor</div>
                <div style={{ fontSize: '56px', fontWeight: '700', color: '#f59e0b', fontFamily: 'serif', marginBottom: '6px' }}>{result.regret_score}%</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', maxWidth: '400px' }}>
                  {result.regret_score < 20 ? 'Low regret risk. Following the optimal path is unlikely to lead to regret.'
                    : result.regret_score < 50 ? 'Moderate regret risk. Proceed carefully and follow the recommended path.'
                    : 'High regret risk. Consider the safe path before making this decision.'}
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: result.regret_score < 20 ? '#10b981' : result.regret_score < 50 ? '#f59e0b' : '#ef4444' }}>
                  {result.regret_score < 20 ? '✓' : result.regret_score < 50 ? '⚠' : '✗'}
                </div>
                <div style={{ color: result.regret_score < 20 ? '#10b981' : result.regret_score < 50 ? '#f59e0b' : '#ef4444', fontSize: '14px', fontWeight: '700' }}>
                  {result.regret_score < 20 ? 'Low Risk' : result.regret_score < 50 ? 'Moderate' : 'High Risk'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(108,99,255,0.06)',
              border: '1px solid rgba(108,99,255,0.15)',
              borderRadius: '14px', padding: '20px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#a78bfa', marginBottom: '10px' }}>💡 Key Insight</div>
              <p style={{ fontSize: '15px', color: '#8892a4', lineHeight: '1.7' }}>{result.key_insight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}