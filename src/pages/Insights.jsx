import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Insights() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [insights, setInsights] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const fetchData = async () => {
    const { data: i } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setInsights(i || [])

    const { data: p } = await supabase
      .from('twin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(p)
  }

  const defaultInsights = [
    { icon: '🧠', pattern: 'Decision Timing', text: 'Your best decisions happen when you take at least 24 hours to think. Rushed choices have a 3x higher regret rate.', color: '#6c63ff' },
    { icon: '💰', pattern: 'Financial Pattern', text: 'People with your risk profile who invest consistently for 6+ months see 40% better outcomes than those who wait for the "right moment".', color: '#10b981' },
    { icon: '🎯', pattern: 'Goal Alignment', text: 'Your Social decision style means you thrive with accountability partners. Goals shared with others have 65% higher completion rates.', color: '#f59e0b' },
    { icon: '⚡', pattern: 'Energy Pattern', text: 'Your profile suggests you make better decisions in the morning. Consider scheduling important choices before noon.', color: '#ec4899' },
  ]

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
                background: item.path === '/insights' ? 'rgba(108,99,255,0.1)' : 'none',
                border: 'none',
                color: item.path === '/insights' ? '#a78bfa' : '#8892a4',
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

        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Your Weekly Insights 💡
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '32px' }}>
          Patterns your twin discovered about how you think and decide
        </p>

        {/* Stability Index */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1120, #1a1030)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '20px', padding: '28px',
          marginBottom: '24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px'
        }}>
          <div>
            <div style={{
              fontSize: '11px', color: '#6c63ff',
              textTransform: 'uppercase', letterSpacing: '2px',
              fontWeight: '700', marginBottom: '8px'
            }}>🌟 Future Stability Index</div>
            <div style={{
              fontSize: '56px', fontWeight: '700',
              color: '#eef0f6', fontFamily: 'serif',
              marginBottom: '6px'
            }}>74</div>
            <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
              Your life trajectory is stable. Keep building on your current momentum.
            </div>
          </div>
          <div style={{
            width: '100px', height: '100px',
            borderRadius: '50%',
            background: 'conic-gradient(#6c63ff 0% 74%, rgba(255,255,255,0.05) 74% 100%)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
            position: 'relative'
          }}>
            <div style={{
              width: '76px', height: '76px',
              background: '#0f1120', borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px', fontWeight: '700', color: '#6c63ff'
            }}>74%</div>
          </div>
        </div>

        {/* Big Insight of the Week */}
        <div style={{
          background: '#111520',
          border: '2px solid rgba(108,99,255,0.3)',
          borderRadius: '20px', padding: '28px',
          marginBottom: '24px', position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, #6c63ff, #9333ea, #ec4899)'
          }} />
          <div style={{
            fontSize: '11px', color: '#6c63ff',
            textTransform: 'uppercase', letterSpacing: '2px',
            fontWeight: '700', marginBottom: '14px'
          }}>⚡ Insight of the Week</div>
          <p style={{
            fontSize: '20px', fontWeight: '600',
            lineHeight: '1.6', color: '#eef0f6', marginBottom: '16px'
          }}>
            "Your decision-making is strongest when you combine social input with personal reflection. You are a Social Navigator — seek advice, then decide alone."
          </p>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px', borderRadius: '100px',
            background: 'rgba(108,99,255,0.1)',
            color: '#a78bfa', fontSize: '12px', fontWeight: '700'
          }}>Impact Score: 9/10</div>
        </div>

        {/* Insight Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {defaultInsights.map((insight, i) => (
            <div key={i} style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px', padding: '22px'
            }}>
              <div style={{
                width: '44px', height: '44px',
                background: `${insight.color}15`,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '14px'
              }}>{insight.icon}</div>
              <div style={{
                fontSize: '12px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '1px',
                color: insight.color, marginBottom: '8px'
              }}>{insight.pattern}</div>
              <p style={{
                fontSize: '13px', color: '#8892a4',
                lineHeight: '1.7'
              }}>{insight.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}