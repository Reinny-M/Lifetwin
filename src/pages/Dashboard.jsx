import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('twin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(data)
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080f',
      fontFamily: 'outfit, sans-serif',
      color: '#eef0f6'
    }}>

      {/* Nav */}
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
                background: 'none', border: 'none',
                color: '#8892a4', fontSize: '14px',
                fontWeight: '500', cursor: 'pointer',
                padding: '8px 16px', borderRadius: '8px',
                fontFamily: 'outfit, sans-serif',
                transition: 'all 0.2s'
              }}
            >{item.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#111520',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '6px 14px 6px 8px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
              borderRadius: '7px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{userName}</span>
          </div>
          <button onClick={handleSignOut} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.07)',
            color: '#6b7280', padding: '8px 14px',
            borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'outfit, sans-serif'
          }}>Sign Out</button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '64px', maxWidth: '1100px', margin: '0 auto', padding: '80px 32px 40px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '32px', fontWeight: '700',
            marginBottom: '6px'
          }}>Good day, {userName} 👋</h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Your twin is ready to simulate your future
          </p>
        </div>

        {/* Quick Simulate Box */}
        <div style={{
          background: '#111520',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '24px',
          marginBottom: '24px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, #6c63ff, transparent)'
          }} />
          <p style={{
            fontSize: '11px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '2px',
            color: '#6c63ff', marginBottom: '14px'
          }}>⚡ Ask Your Twin</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What if I quit my job and started freelancing?"
              onKeyDown={e => e.key === 'Enter' && question && navigate('/simulate')}
              style={{
                flex: 1, background: '#0c0f1a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '13px 18px',
                color: '#eef0f6', fontSize: '15px',
                outline: 'none', fontFamily: 'outfit, sans-serif'
              }}
            />
            <button
              onClick={() => navigate('/simulate')}
              style={{
                background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none',
                padding: '13px 24px', borderRadius: '12px',
                fontFamily: 'outfit, sans-serif',
                fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(108,99,255,0.3)'
              }}
            >Simulate →</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[
              '💼 Should I take this job?',
              '💰 Where will I be financially?',
              '❤️ Am I ready for a relationship?',
              '🏃 What if I trained daily?'
            ].map(chip => (
              <span key={chip}
                onClick={() => navigate('/simulate')}
                style={{
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.15)',
                  padding: '5px 12px', borderRadius: '100px',
                  fontSize: '12px', color: '#8892a4',
                  cursor: 'pointer'
                }}>{chip}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px', marginBottom: '28px'
        }}>
          {[
            { icon: '🔮', val: simulations.length, label: 'Simulations Run', color: '#6c63ff' },
            { icon: '🎯', val: profile ? `${profile.twin_health_score}%` : '0%', label: 'Twin Health', color: '#10b981' },
            { icon: '💡', val: insights.length, label: 'Insights Generated', color: '#f59e0b' }
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '20px'
            }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '16px',
                marginBottom: '12px'
              }}>{stat.icon}</div>
              <div style={{
                fontSize: '28px', fontWeight: '700',
                fontFamily: 'serif', marginBottom: '4px',
                color: stat.color
              }}>{stat.val}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Simulations */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '14px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Simulations</h2>
            <button onClick={() => navigate('/simulate')} style={{
              background: 'none', border: 'none',
              color: '#6c63ff', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer',
              fontFamily: 'outfit, sans-serif'
            }}>Run new →</button>
          </div>

          {simulations.length === 0 ? (
            <div style={{
              background: '#111520',
              border: '1px dashed rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔮</div>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                No simulations yet. Ask your twin anything!
              </p>
              <button onClick={() => navigate('/simulate')} style={{
                background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none',
                padding: '12px 24px', borderRadius: '10px',
                fontFamily: 'outfit, sans-serif',
                fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', marginTop: '16px'
              }}>Run First Simulation →</button>
            </div>
          ) : (
            simulations.map(sim => (
              <div key={sim.id} style={{
                background: '#111520',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px', padding: '16px 18px',
                marginBottom: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'rgba(108,99,255,0.1)',
                  borderRadius: '12px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>🔮</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '3px' }}>
                    {sim.question_text}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {sim.category} · {new Date(sim.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: 'rgba(108,99,255,0.1)',
                  color: '#a78bfa', fontSize: '11px', fontWeight: '700'
                }}>Path {sim.recommended_path}</div>
              </div>
            ))
          )}
        </div>

        {/* Twin Profile Card */}
        <div style={{
          background: '#111520',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
            Your Twin Status
          </h2>
          {profile ? (
            <div>
              <div style={{ fontSize: '15px', color: '#a78bfa', fontWeight: '600', marginBottom: '4px' }}>
                {profile.decision_archetype}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                Decision Style: {profile.decision_style}
              </div>
              <div style={{
                height: '6px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '3px', overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${profile.twin_health_score}%`,
                  background: 'linear-gradient(90deg, #6c63ff, #9333ea)',
                  borderRadius: '3px'
                }} />
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                Twin Health: {profile.twin_health_score}%
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Complete onboarding to build your Decision DNA
              </p>
              <button onClick={() => navigate('/onboarding')} style={{
                background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
                color: 'white', border: 'none',
                padding: '12px 24px', borderRadius: '10px',
                fontFamily: 'outfit, sans-serif',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>Build My Twin →</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}