import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [simulations, setSimulations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    const { data: p } = await supabase
      .from('twin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(p)

    const { data: s } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSimulations(s || [])
    setLoading(false)
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  const traits = [
    { label: 'Analytical Thinking', score: profile?.decision_style === 'analytical' ? 85 : 45 },
    { label: 'Risk Tolerance', score: profile?.risk_tolerance_score || 50 },
    { label: 'Follow-Through', score: 70 },
    { label: 'Emotional Intelligence', score: profile?.decision_style === 'emotional' ? 90 : 60 },
    { label: 'Social Influence', score: profile?.decision_style === 'social' ? 88 : 40 },
  ]

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
                background: item.path === '/profile' ? 'rgba(108,99,255,0.1)' : 'none',
                border: 'none',
                color: item.path === '/profile' ? '#a78bfa' : '#8892a4',
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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '90px 32px 60px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
            <p style={{ color: '#6b7280' }}>Loading your twin...</p>
          </div>
        ) : !profile ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>You haven't built your twin yet!</p>
            <button onClick={() => navigate('/onboarding')} style={{
              background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
              color: 'white', border: 'none', padding: '14px 28px',
              borderRadius: '12px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'outfit, sans-serif'
            }}>Build My Twin →</button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f1120, #1a1030)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '24px', padding: '32px',
              marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '24px'
            }}>
              <div style={{
                width: '80px', height: '80px',
                background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
                borderRadius: '22px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '36px', flexShrink: 0,
                boxShadow: '0 0 40px rgba(108,99,255,0.3)'
              }}>🧬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#6c63ff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Decision Twin</div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{userName}</h1>
                <div style={{ color: '#a78bfa', fontSize: '16px', fontWeight: '600' }}>{profile.decision_archetype}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#6c63ff', fontFamily: 'serif' }}>{profile.twin_health_score}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Twin Health</div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px', marginBottom: '24px'
            }}>
              {[
                { icon: '🔮', val: simulations.length, label: 'Simulations Run' },
                { icon: '⚖️', val: `${profile.risk_tolerance_score}/100`, label: 'Risk Score' },
                { icon: '🎯', val: profile.decision_style, label: 'Decision Style' }
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#111520',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px', padding: '20px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#a78bfa', marginBottom: '4px' }}>{stat.val}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trait Bars */}
            <div style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Decision DNA Traits</h2>
              {traits.map(trait => (
                <div key={trait.label} style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '14px', marginBottom: '8px'
                  }}>
                    <span style={{ color: '#8892a4' }}>{trait.label}</span>
                    <span style={{ fontWeight: '700', color: '#a78bfa' }}>{trait.score}%</span>
                  </div>
                  <div style={{
                    height: '8px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${trait.score}%`,
                      background: 'linear-gradient(90deg, #6c63ff, #9333ea)',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Behavioral Tags */}
            {profile.behavioral_tags && profile.behavioral_tags.length > 0 && (
              <div style={{
                background: '#111520',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '28px',
                marginBottom: '24px'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Your Behavioral Tags</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {profile.behavioral_tags.map(tag => (
                    <span key={tag} style={{
                      padding: '8px 16px', borderRadius: '100px',
                      background: 'rgba(108,99,255,0.1)',
                      border: '1px solid rgba(108,99,255,0.2)',
                      color: '#a78bfa', fontSize: '13px', fontWeight: '600'
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Goal Alignment */}
            <div style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '28px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Goal Alignment</h2>
              {[
                { label: 'Career Growth', score: 78, color: '#6c63ff' },
                { label: 'Financial Health', score: 54, color: '#10b981' },
                { label: 'Personal Wellbeing', score: 82, color: '#f59e0b' },
                { label: 'Relationships', score: 61, color: '#ec4899' }
              ].map(goal => (
                <div key={goal.label} style={{
                  display: 'flex', alignItems: 'center',
                  gap: '16px', marginBottom: '16px'
                }}>
                  <div style={{ width: '140px', fontSize: '13px', color: '#8892a4' }}>{goal.label}</div>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${goal.score}%`,
                      background: goal.color, borderRadius: '4px'
                    }} />
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: goal.color }}>{goal.score}%</div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}