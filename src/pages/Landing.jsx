import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: '🧬', title: 'Decision DNA', desc: 'Build a living behavioral model that learns how you think, decide, and react to life.' },
    { icon: '🔮', title: 'Life Simulation', desc: 'Run simulations on any life decision. Get 3 paths with probability scores before you commit.' },
    { icon: '💀', title: 'Regret Predictor', desc: 'Know the emotional cost of every choice before you make it. Avoid future regret today.' },
    { icon: '💡', title: 'Weekly Insights', desc: 'Discover hidden patterns in your behavior that even you haven\'t noticed.' },
    { icon: '📈', title: 'Financial Projections', desc: 'See where your financial habits lead across every simulated path.' },
    { icon: '🎯', title: 'Goal Alignment', desc: 'Measure how aligned your daily decisions are with your long-term life goals.' },
  ]

  const testimonials = [
    { name: 'Amara K.', role: 'Entrepreneur', text: 'LifeTwin showed me I was about to make a decision I would have regretted for years. It saved my business.', avatar: 'A' },
    { name: 'James M.', role: 'Software Engineer', text: 'I used to spend weeks overthinking decisions. Now I simulate in minutes and move forward with confidence.', avatar: 'J' },
    { name: 'Sofia R.', role: 'Medical Student', text: 'The weekly insights alone are worth it. I discovered patterns about myself I never knew existed.', avatar: 'S' },
  ]

  const marqueeItems = ['🧬 Decision DNA', '🔮 Life Simulation', '💀 Regret Predictor', '💡 Weekly Insights', '📈 Financial Projections', '🎯 Goal Alignment', '⚡ Behavioral Analysis', '🌍 Used Worldwide', '🧠 AI-Powered', '🚀 Zero Guesswork']

  return (
    <div style={{
      background: '#06080f',
      fontFamily: 'outfit, sans-serif',
      color: '#eef0f6',
      width: '100%',
      overflowX: 'hidden'
    }}>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feature-card:hover {
          border-color: rgba(108,99,255,0.4) !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 24px 48px rgba(108,99,255,0.12) !important;
        }
        .cta-btn:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 16px 40px rgba(108,99,255,0.5) !important;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '68px',
        background: scrolled ? 'rgba(6,8,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 0 20px rgba(108,99,255,0.4)',
            animation: 'float 3s ease-in-out infinite'
          }}>🧬</div>
          <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>LifeTwin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: 'none',
            color: '#8892a4', fontSize: '15px',
            cursor: 'pointer', fontFamily: 'outfit, sans-serif',
            padding: '8px 16px'
          }}>Sign In</button>
          <button className="cta-btn" onClick={() => navigate('/login')} style={{
            background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
            color: 'white', border: 'none',
            padding: '10px 24px', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'outfit, sans-serif',
            boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
            transition: 'all 0.3s'
          }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 40px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '900px', height: '900px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.13) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '4px', height: '4px',
            borderRadius: '50%',
            background: '#6c63ff',
            opacity: 0.4,
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`
          }} />
        ))}

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: '100px', padding: '8px 20px',
          fontSize: '13px', color: '#a78bfa', fontWeight: '600',
          marginBottom: '32px',
          animation: 'fadeInUp 0.8s ease forwards'
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#6c63ff',
            boxShadow: '0 0 10px #6c63ff',
            display: 'inline-block',
            animation: 'pulse 2s infinite'
          }} />
          The World's First Personal Decision Twin
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(44px, 7.5vw, 92px)',
          fontWeight: '800', lineHeight: '1.04',
          letterSpacing: '-3px', marginBottom: '28px',
          maxWidth: '960px',
          animation: 'fadeInUp 0.8s ease 0.2s both'
        }}>
          Know Your Future
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Before You Live It</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#6b7280', lineHeight: '1.8',
          maxWidth: '600px', marginBottom: '48px',
          animation: 'fadeInUp 0.8s ease 0.4s both'
        }}>
          LifeTwin builds a living AI model of how you think and decide — then simulates your future across every major life choice before you commit.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '72px',
          animation: 'fadeInUp 0.8s ease 0.6s both'
        }}>
          <button className="cta-btn" onClick={() => navigate('/login')} style={{
            background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
            color: 'white', border: 'none',
            padding: '18px 40px', borderRadius: '14px',
            fontSize: '17px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'outfit, sans-serif',
            boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            transition: 'all 0.3s'
          }}>Build My Twin Free →</button>
          <button style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#eef0f6', border: '1px solid rgba(255,255,255,0.12)',
            padding: '18px 40px', borderRadius: '14px',
            fontSize: '17px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'outfit, sans-serif'
          }}>Watch Demo ▶</button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '64px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '40px',
          animation: 'fadeInUp 0.8s ease 0.8s both'
        }}>
          {[
            { val: '50K+', label: 'Decisions Simulated' },
            { val: '94%', label: 'Accuracy Rate' },
            { val: '180+', label: 'Countries' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px', fontWeight: '800', letterSpacing: '-1px',
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stat.val}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MARQUEE 1 */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(90deg, #06080f, transparent)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(270deg, #06080f, transparent)' }} />
        <div style={{ display: 'flex', gap: '16px', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.15)',
              borderRadius: '100px', padding: '10px 24px',
              fontSize: '14px', fontWeight: '600',
              color: '#a78bfa', whiteSpace: 'nowrap'
            }}>{item}</div>
          ))}
        </div>
      </div>

      {/* MARQUEE 2 - reverse */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '20px 0 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(90deg, #06080f, transparent)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(270deg, #06080f, transparent)' }} />
        <div style={{ display: 'flex', gap: '16px', animation: 'marquee2 30s linear infinite', width: 'max-content' }}>
          {[...marqueeItems.reverse(), ...marqueeItems].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(236,72,153,0.06)',
              border: '1px solid rgba(236,72,153,0.12)',
              borderRadius: '100px', padding: '10px 24px',
              fontSize: '14px', fontWeight: '600',
              color: '#f472b6', whiteSpace: 'nowrap'
            }}>{item}</div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '100px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '100px', padding: '6px 16px',
            fontSize: '12px', color: '#a78bfa', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px'
          }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '16px' }}>Everything your twin can do</h2>
          <p style={{ color: '#6b7280', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
            Six powerful capabilities working together to give you decision intelligence no human can match alone.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '22px', padding: '32px',
              transition: 'all 0.3s', cursor: 'default'
            }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'rgba(108,99,255,0.1)',
                borderRadius: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', marginBottom: '20px'
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        padding: '100px 48px',
        background: 'rgba(108,99,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)', borderRadius: '100px',
            padding: '6px 16px', fontSize: '12px', color: '#a78bfa',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px'
          }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '64px' }}>
            From question to clarity in minutes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { step: '01', icon: '🧬', title: 'Build Your Twin', desc: 'Complete a 4-step onboarding that captures your decision style, risk tolerance, and behavioral patterns.' },
              { step: '02', icon: '🔮', title: 'Ask Anything', desc: 'Type any life question. Your twin analyzes it against your personal behavioral model instantly.' },
              { step: '03', icon: '🚀', title: 'Live Your Best Path', desc: 'Choose from 3 simulated paths with full probability scores, timelines, and regret predictions.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#6c63ff', letterSpacing: '3px', marginBottom: '16px' }}>{item.step}</div>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(147,51,234,0.15))',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: '22px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px', margin: '0 auto 20px',
                  animation: `float ${3 + i * 0.7}s ease-in-out infinite`
                }}>{item.icon}</div>
                <h3 style={{ fontSize: '21px', fontWeight: '700', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: '100px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)', borderRadius: '100px',
            padding: '6px 16px', fontSize: '12px', color: '#a78bfa',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px'
          }}>Testimonials</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', letterSpacing: '-1.5px' }}>
            People who simulated before deciding
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: '#111520',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '22px', padding: '32px'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: '#f59e0b', fontSize: '16px' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '15px', color: '#8892a4', lineHeight: '1.8', marginBottom: '24px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
                  borderRadius: '12px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: '700'
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{
        padding: '100px 48px',
        background: 'rgba(108,99,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.2)', borderRadius: '100px',
            padding: '6px 16px', fontSize: '12px', color: '#a78bfa',
            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px'
          }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Start free. Upgrade when ready.
          </h2>
          <p style={{ color: '#6b7280', fontSize: '17px', marginBottom: '64px' }}>No credit card required to start.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { name: 'Starter', price: 'Free', desc: 'Perfect to get started', features: ['5 simulations/month', '2 life categories', '1 weekly insight', 'Basic twin profile'], cta: 'Get Started Free', highlight: false },
              { name: 'Pro', price: '$12', desc: 'For serious decision makers', features: ['Unlimited simulations', 'All 6 categories', 'Regret predictor', 'Financial projections', 'Daily insights'], cta: 'Start Pro', highlight: true },
              { name: 'Teams', price: '$29', desc: 'Per seat per month', features: ['Everything in Pro', 'Team dashboards', 'Manager insights', 'HR integration', 'Priority support'], cta: 'Contact Us', highlight: false },
            ].map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? 'linear-gradient(135deg, #1a1640, #1e1235)' : '#111520',
                border: `2px solid ${plan.highlight ? '#6c63ff' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '24px', padding: '36px',
                position: 'relative', overflow: 'hidden'
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, #6c63ff, #ec4899)'
                  }} />
                )}
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
                    color: 'white', fontSize: '10px', fontWeight: '700',
                    padding: '4px 12px', borderRadius: '100px',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{
                  fontSize: '46px', fontWeight: '800', letterSpacing: '-2px',
                  marginBottom: '4px', color: plan.highlight ? '#a78bfa' : '#eef0f6'
                }}>{plan.price}<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>{plan.price !== 'Free' ? '/mo' : ''}</span></div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px' }}>{plan.desc}</div>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#8892a4', marginBottom: '12px' }}>
                    <span style={{ color: '#6c63ff', fontSize: '16px', fontWeight: '700' }}>✓</span>{f}
                  </div>
                ))}
                <button onClick={() => navigate('/login')} style={{
                  width: '100%', marginTop: '28px',
                  background: plan.highlight ? 'linear-gradient(135deg, #6c63ff, #7c3aed)' : 'rgba(255,255,255,0.04)',
                  color: 'white', border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '15px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'outfit, sans-serif',
                  boxShadow: plan.highlight ? '0 8px 24px rgba(108,99,255,0.3)' : 'none'
                }}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{ padding: '100px 48px' }}>
        <div style={{
          maxWidth: '860px', margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, #0f1120, #1a1030)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '36px', padding: '80px 48px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #6c63ff, #ec4899, transparent)'
          }} />
          <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>🧬</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Ready to meet your twin?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Join thousands of people who simulate before they decide. Your twin is waiting.
          </p>
          <button className="cta-btn" onClick={() => navigate('/login')} style={{
            background: 'linear-gradient(135deg, #6c63ff, #7c3aed)',
            color: 'white', border: 'none',
            padding: '20px 56px', borderRadius: '16px',
            fontSize: '19px', fontWeight: '700',
            cursor: 'pointer', fontFamily: 'outfit, sans-serif',
            boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
            transition: 'all 0.3s'
          }}>Build My Twin Free →</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '40px 48px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #6c63ff, #9333ea)',
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '14px'
          }}>🧬</div>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>LifeTwin AI</span>
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          © 2026 LifeTwin AI · Built by Reinhard Maroa Babere 🇰🇪
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Contact'].map(link => (
            <span key={link} style={{ fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>{link}</span>
          ))}
        </div>
      </div>

    </div>
  )
}