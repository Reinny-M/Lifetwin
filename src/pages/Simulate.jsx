import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@200;300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --bg-deep:    #04060C;
    --bg-card:    #080C16;
    --bg-raised:  #0C1020;
    --border:     rgba(255,255,255,0.05);
    --border-md:  rgba(255,255,255,0.09);
    --border-hi:  rgba(255,255,255,0.14);
    --gold:       #D4A843;
    --gold-light: #F0C76A;
    --gold-dim:   rgba(212,168,67,0.12);
    --gold-glow:  rgba(212,168,67,0.25);
    --silver:     rgba(220,225,235,0.9);
    --text:       #E8EBF2;
    --text-mid:   rgba(232,235,242,0.55);
    --text-low:   rgba(232,235,242,0.25);
    --green:      #34D399;
    --red:        #FB7185;
    --amber:      #FCD34D;
    --blue:       #60A5FA;
    --radius:     12px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  .lt-root {
    min-height: 100vh;
    background: var(--bg-deep);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* ── BACKGROUND EFFECTS ── */
  .lt-bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .lt-bg-orb-1 {
    width: 600px; height: 600px;
    top: -200px; left: -100px;
    background: radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 70%);
    animation-delay: 0s;
  }
  .lt-bg-orb-2 {
    width: 500px; height: 500px;
    top: 300px; right: -150px;
    background: radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%);
    animation-delay: -3s;
  }
  .lt-bg-orb-3 {
    width: 400px; height: 400px;
    bottom: 0; left: 30%;
    background: radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%);
    animation-delay: -6s;
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-30px) scale(1.05); }
  }

  /* Grid texture */
  .lt-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  /* ── NAVBAR ── */
  .lt-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 68px;
    background: rgba(4,6,12,0.7);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border-bottom: 1px solid var(--border-md);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 52px;
  }

  .lt-logo {
    display: flex; align-items: center; gap: 14px;
    text-decoration: none;
  }
  .lt-logo-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #D4A843, #9B6F1E);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 20px rgba(212,168,67,0.3), 0 4px 12px rgba(0,0,0,0.4);
    position: relative;
  }
  .lt-logo-icon::after {
    content: '';
    position: absolute; inset: -1px;
    border-radius: 11px;
    background: linear-gradient(135deg, rgba(212,168,67,0.4), transparent);
    pointer-events: none;
  }
  .lt-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 500;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #E8EBF2, #D4A843);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lt-nav-center { display: flex; gap: 2px; }

  .lt-nav-btn {
    background: none; border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 400;
    color: var(--text-mid); cursor: pointer;
    padding: 9px 20px; border-radius: 8px;
    letter-spacing: 0.3px;
    transition: all 0.2s;
    position: relative;
  }
  .lt-nav-btn:hover { color: var(--text); background: rgba(255,255,255,0.05); }
  .lt-nav-btn.active {
    color: var(--text);
    background: rgba(212,168,67,0.08);
  }
  .lt-nav-btn.active::after {
    content: '';
    position: absolute; bottom: 4px; left: 50%;
    transform: translateX(-50%);
    width: 20px; height: 2px;
    background: var(--gold);
    border-radius: 1px;
  }

  .lt-nav-back {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-md);
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-mid);
    padding: 8px 16px; border-radius: 8px;
    cursor: pointer; letter-spacing: 0.3px;
    transition: all 0.2s;
  }
  .lt-nav-back:hover { color: var(--text); border-color: var(--border-hi); background: rgba(255,255,255,0.07); }

  /* ── MAIN BODY ── */
  .lt-body {
    max-width: 1000px;
    margin: 0 auto;
    padding: 110px 48px 100px;
    position: relative; z-index: 1;
  }

  /* ── HERO HEADER ── */
  .lt-hero {
    margin-bottom: 64px;
    animation: heroIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lt-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold-dim);
    border: 1px solid rgba(212,168,67,0.2);
    border-radius: 100px;
    padding: 6px 16px 6px 8px;
    margin-bottom: 28px;
  }
  .lt-hero-badge-dot {
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--gold-glow);
    animation: dotPulse 2s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%, 100% { box-shadow: 0 0 8px var(--gold-glow); }
    50%       { box-shadow: 0 0 16px var(--gold), 0 0 32px rgba(212,168,67,0.3); }
  }
  .lt-hero-badge-text {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: var(--gold); text-transform: uppercase;
  }

  .lt-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 68px; line-height: 1.0;
    font-weight: 700; letter-spacing: -1px;
    color: var(--text);
    margin-bottom: 20px;
  }
  .lt-hero-title .line2 {
    display: block;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 40%, #9B6F1E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
  }

  .lt-hero-sub {
    font-size: 16px; color: var(--text-mid);
    font-weight: 300; line-height: 1.7;
    max-width: 520px; letter-spacing: 0.2px;
  }

  /* ── INPUT AREA ── */
  .lt-input-section {
    margin-bottom: 20px;
    animation: heroIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .lt-input-outer {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }
  .lt-input-outer:focus-within {
    border-color: rgba(212,168,67,0.35);
    box-shadow: 0 0 0 4px rgba(212,168,67,0.06), 0 8px 40px rgba(0,0,0,0.4);
  }

  .lt-textarea {
    width: 100%; background: none;
    border: none; outline: none;
    color: var(--text); font-size: 16px;
    font-family: 'Outfit', sans-serif; font-weight: 300;
    resize: none; padding: 24px 100px 24px 28px;
    line-height: 1.7; letter-spacing: 0.2px;
    min-height: 88px;
  }
  .lt-textarea::placeholder { color: var(--text-low); }

  .lt-submit-btn {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    width: 52px; height: 52px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    color: #04060C;
    border: none; border-radius: 12px;
    cursor: pointer; font-size: 20px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s;
    box-shadow: 0 4px 16px rgba(212,168,67,0.3);
  }
  .lt-submit-btn:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 28px rgba(212,168,67,0.45);
  }
  .lt-submit-btn:disabled {
    background: rgba(255,255,255,0.06);
    color: var(--text-low);
    box-shadow: none;
    cursor: not-allowed;
  }

  .lt-input-hint {
    font-family: 'Space Mono', monospace;
    font-size: 10px; color: var(--text-low);
    letter-spacing: 1px; text-align: right;
    margin-top: 8px; padding-right: 4px;
  }

  /* ── CATEGORY PILLS ── */
  .lt-cats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px; margin-bottom: 72px;
    animation: heroIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }

  .lt-cat {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 14px;
    text-align: center; cursor: pointer;
    transition: all 0.25s;
    position: relative; overflow: hidden;
  }
  .lt-cat::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--gold-dim), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .lt-cat:hover { border-color: var(--border-hi); transform: translateY(-2px); }
  .lt-cat:hover::before { opacity: 0.5; }
  .lt-cat.active {
    border-color: rgba(212,168,67,0.3);
    background: linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03));
    box-shadow: 0 0 24px rgba(212,168,67,0.08), 0 4px 16px rgba(0,0,0,0.3);
  }
  .lt-cat.active::before { opacity: 1; }
  .lt-cat.active .lt-cat-name { color: var(--gold); }
  .lt-cat.active .lt-cat-bottom { background: var(--gold); transform: scaleX(1); }

  .lt-cat-bottom {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.25s;
    border-radius: 0 0 var(--radius) var(--radius);
  }
  .lt-cat:hover .lt-cat-bottom { transform: scaleX(0.5); }

  .lt-cat-icon { font-size: 24px; margin-bottom: 10px; display: block; }
  .lt-cat-name {
    font-size: 12px; font-weight: 600;
    color: var(--text); letter-spacing: 0.8px;
    text-transform: uppercase; margin-bottom: 4px;
    transition: color 0.25s;
  }
  .lt-cat-sub {
    font-family: 'Space Mono', monospace;
    font-size: 9px; color: var(--text-low);
    letter-spacing: 0.5px;
  }

  /* ── LOADING STATE ── */
  .lt-loading {
    text-align: center; padding: 100px 0;
    animation: heroIn 0.4s ease both;
  }
  .lt-loading-orb {
    width: 64px; height: 64px;
    margin: 0 auto 32px;
    position: relative;
  }
  .lt-loading-orb::before, .lt-loading-orb::after {
    content: '';
    position: absolute; border-radius: 50%;
    animation: spin 1.4s linear infinite;
  }
  .lt-loading-orb::before {
    inset: 0;
    border: 1px solid transparent;
    border-top-color: var(--gold);
    border-right-color: rgba(212,168,67,0.3);
  }
  .lt-loading-orb::after {
    inset: 8px;
    border: 1px solid transparent;
    border-top-color: rgba(212,168,67,0.5);
    animation-direction: reverse;
    animation-duration: 0.9s;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .lt-loading-dot {
    width: 8px; height: 8px;
    background: var(--gold);
    border-radius: 50%;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 12px var(--gold);
    animation: dotPulse 1.4s ease-in-out infinite;
  }
  .lt-loading-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 400; font-style: italic;
    color: var(--text); margin-bottom: 10px;
  }
  .lt-loading-sub {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2.5px;
    color: var(--text-low); text-transform: uppercase;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── ERROR ── */
  .lt-error {
    background: rgba(251,113,133,0.06);
    border: 1px solid rgba(251,113,133,0.18);
    border-radius: var(--radius);
    padding: 16px 22px;
    color: var(--red); font-size: 13px;
    margin-bottom: 28px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.3px;
    display: flex; align-items: center; gap: 10px;
  }

  /* ── RESULTS ── */
  .lt-results {
    animation: heroIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  .lt-section-divider {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 52px;
  }
  .lt-section-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
  }
  .lt-section-chip {
    display: flex; align-items: center; gap: 8px;
    background: var(--gold-dim);
    border: 1px solid rgba(212,168,67,0.18);
    border-radius: 100px;
    padding: 5px 16px;
  }
  .lt-section-chip span {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: var(--gold); text-transform: uppercase;
  }

  /* Question display */
  .lt-q-block { margin-bottom: 48px; }
  .lt-q-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-low); text-transform: uppercase;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .lt-q-label::before {
    content: ''; width: 20px; height: 1px; background: var(--text-low);
  }
  .lt-q-text {
    font-family: 'Playfair Display', serif;
    font-size: 30px; line-height: 1.35;
    font-weight: 400; font-style: italic;
    color: var(--text); letter-spacing: -0.3px;
  }

  /* Analysis block */
  .lt-analysis {
    position: relative;
    background: linear-gradient(135deg, rgba(212,168,67,0.04), rgba(212,168,67,0.01));
    border: 1px solid rgba(212,168,67,0.12);
    border-radius: 16px;
    padding: 36px 40px;
    margin-bottom: 52px;
    overflow: hidden;
  }
  .lt-analysis::before {
    content: '"';
    position: absolute; top: -20px; left: 28px;
    font-family: 'Playfair Display', serif;
    font-size: 120px; color: rgba(212,168,67,0.07);
    line-height: 1; pointer-events: none;
  }
  .lt-analysis-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  }
  .lt-analysis-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--gold), #9B6F1E);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    box-shadow: 0 0 16px rgba(212,168,67,0.3);
  }
  .lt-analysis-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px;
    color: var(--gold); text-transform: uppercase;
  }
  .lt-analysis-text {
    font-size: 16px; color: rgba(232,235,242,0.75);
    line-height: 1.85; font-weight: 300; letter-spacing: 0.2px;
    font-family: 'Outfit', sans-serif;
  }

  /* ── PATH CARDS ── */
  .lt-paths-title {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-low); text-transform: uppercase;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .lt-paths-title::before { content: ''; width: 20px; height: 1px; background: var(--text-low); }

  .lt-paths {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 14px;
  }

  .lt-path-card {
    border-radius: 16px;
    padding: 30px 26px;
    position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
    cursor: default;
  }

  .lt-path-card.safe {
    background: linear-gradient(145deg, #0A1018, #081014);
    border: 1px solid rgba(52,211,153,0.15);
  }
  .lt-path-card.safe::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
  }
  .lt-path-card.safe:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 32px rgba(52,211,153,0.08);
  }

  .lt-path-card.risky {
    background: linear-gradient(145deg, #10080A, #140810);
    border: 1px solid rgba(251,113,133,0.15);
  }
  .lt-path-card.risky::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--red), transparent);
  }
  .lt-path-card.risky:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.5), 0 0 32px rgba(251,113,133,0.08);
  }

  .lt-path-card.optimal {
    background: linear-gradient(145deg, #100D04, #0E0C08, #141008);
    border: 1px solid rgba(212,168,67,0.25);
    box-shadow: 0 0 48px rgba(212,168,67,0.07), inset 0 1px 0 rgba(212,168,67,0.12);
  }
  .lt-path-card.optimal::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-light) 50%, transparent 100%);
    box-shadow: 0 0 20px var(--gold-glow);
  }
  .lt-path-card.optimal:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.12);
  }

  /* Shimmer on optimal */
  .lt-path-card.optimal::after {
    content: '';
    position: absolute; top: 0; left: -150%;
    width: 80%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212,168,67,0.04), transparent);
    animation: cardShimmer 4s ease-in-out infinite;
  }
  @keyframes cardShimmer { 0%{left:-150%} 100%{left:200%} }

  .lt-path-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 22px;
    padding: 5px 12px; border-radius: 100px;
  }
  .lt-path-badge.safe   { background: rgba(52,211,153,0.08); color: var(--green); border: 1px solid rgba(52,211,153,0.18); }
  .lt-path-badge.risky  { background: rgba(251,113,133,0.08); color: var(--red);   border: 1px solid rgba(251,113,133,0.18); }
  .lt-path-badge.optimal{ background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(212,168,67,0.25); }

  .lt-path-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 500;
    letter-spacing: -0.3px; color: var(--text);
    margin-bottom: 10px; line-height: 1.2;
  }

  .lt-path-desc {
    font-size: 12px; color: var(--text-mid);
    line-height: 1.8; margin-bottom: 28px;
    font-weight: 300; letter-spacing: 0.2px;
  }

  .lt-path-prob-row { margin-bottom: 24px; }
  .lt-path-prob {
    font-family: 'Playfair Display', serif;
    font-size: 60px; font-weight: 700;
    line-height: 1; letter-spacing: -3px;
  }
  .lt-path-card.safe    .lt-path-prob { color: var(--green); }
  .lt-path-card.risky   .lt-path-prob { color: var(--red);   }
  .lt-path-card.optimal .lt-path-prob {
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lt-path-prob sup {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 400;
    vertical-align: super; letter-spacing: 0;
  }
  .lt-path-prob-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    color: var(--text-low); text-transform: uppercase; margin-top: 4px;
  }

  .lt-path-rule {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin-bottom: 18px;
  }
  .lt-path-card.optimal .lt-path-rule { background: rgba(212,168,67,0.1); }

  .lt-path-stat {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 11px;
  }
  .lt-path-stat-k {
    font-family: 'Space Mono', monospace;
    font-size: 9px; color: var(--text-low);
    letter-spacing: 1.5px; text-transform: uppercase;
  }
  .lt-path-stat-v {
    font-size: 12px; font-weight: 600;
    color: var(--text); letter-spacing: 0.3px;
  }

  /* ── BOTTOM ROW ── */
  .lt-bottom {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 14px;
  }

  .lt-regret-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px; padding: 36px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .lt-regret-card:hover { border-color: var(--border-hi); }

  .lt-insight-card {
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: 16px; padding: 36px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .lt-insight-card:hover { border-color: var(--border-hi); }

  .lt-card-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 3px;
    color: var(--text-low); text-transform: uppercase; margin-bottom: 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .lt-card-label::before { content: ''; width: 16px; height: 1px; background: var(--text-low); }

  .lt-regret-big {
    font-family: 'Playfair Display', serif;
    font-size: 88px; font-weight: 700;
    letter-spacing: -4px; line-height: 1;
    margin-bottom: 14px;
  }
  .lt-regret-pill {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 6px 14px;
    border-radius: 100px; margin-bottom: 18px;
  }
  .lt-regret-pill::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
  .lt-regret-desc {
    font-size: 13px; color: var(--text-mid);
    line-height: 1.8; font-weight: 300; letter-spacing: 0.2px;
  }

  .lt-rec-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold-dim);
    border: 1px solid rgba(212,168,67,0.2);
    color: var(--gold);
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px; margin-bottom: 18px;
  }
  .lt-rec-tag::before {
    content: '★'; font-size: 10px;
  }

  .lt-insight-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px; color: rgba(232,235,242,0.7);
    line-height: 1.85; font-weight: 400; letter-spacing: 0.1px;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(212,168,67,0.4); }
`

export default function Simulate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('career')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const resultsRef = useRef(null)

  const categories = [
    { id: 'career',        icon: '🧭', name: 'Career',    sub: 'Job · Growth' },
    { id: 'finance',       icon: '💎', name: 'Finance',   sub: 'Wealth · Investing' },
    { id: 'relationships', icon: '🌹', name: 'Love',      sub: 'Relations · Family' },
    { id: 'health',        icon: '⚡', name: 'Health',    sub: 'Fitness · Mind' },
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
      setError('Simulation failed. Please check your connection and try again.')
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [result])

  const rs = result?.regret_score ?? 0
  const regretColor  = rs < 20 ? 'var(--green)' : rs < 50 ? 'var(--amber)' : 'var(--red)'
  const regretBg     = rs < 20 ? 'rgba(52,211,153,0.08)' : rs < 50 ? 'rgba(252,211,77,0.08)' : 'rgba(251,113,133,0.08)'
  const regretBorder = rs < 20 ? 'rgba(52,211,153,0.2)'  : rs < 50 ? 'rgba(252,211,77,0.2)'  : 'rgba(251,113,133,0.2)'
  const regretLabel  = rs < 20 ? 'Low Risk' : rs < 50 ? 'Moderate' : 'High Risk'
  const regretDesc   = rs < 20
    ? 'Excellent alignment with your long-term values. This path carries minimal risk of future regret and high satisfaction potential.'
    : rs < 50
    ? 'Some uncertainty lies ahead. Proceed with clear intention and revisit your recommended path quarterly.'
    : 'Significant regret risk detected. Strongly consider the safe path and consult trusted advisors before committing.'

  return (
    <div className="lt-root">
      <style>{styles}</style>

      {/* Background orbs */}
      <div className="lt-bg-orb lt-bg-orb-1" />
      <div className="lt-bg-orb lt-bg-orb-2" />
      <div className="lt-bg-orb lt-bg-orb-3" />

      {/* Navbar */}
      <nav className="lt-nav">
        <div className="lt-logo">
          <div className="lt-logo-icon">🧬</div>
          <span className="lt-logo-text">LifeTwin</span>
        </div>
        <div className="lt-nav-center">
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Simulate',  path: '/simulate'  },
            { label: 'My Twin',   path: '/profile'   },
            { label: 'Insights',  path: '/insights'  },
          ].map(item => (
            <button key={item.path}
              className={`lt-nav-btn ${item.path === '/simulate' ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >{item.label}</button>
          ))}
        </div>
        <button className="lt-nav-back" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      <div className="lt-body">

        {/* Hero */}
        <div className="lt-hero">
          <div className="lt-hero-badge">
            <div className="lt-hero-badge-dot" />
            <span className="lt-hero-badge-text">AI-Powered Life Engine</span>
          </div>
          <h1 className="lt-hero-title">
            Simulate your<br />
            <span className="line2">future, today.</span>
          </h1>
          <p className="lt-hero-sub">
            Ask your digital twin anything — career pivots, financial moves, relationships, health. Get three data-driven paths with real probabilities.
          </p>
        </div>

        {/* Input */}
        <div className="lt-input-section">
          <div className="lt-input-outer">
            <textarea
              className="lt-textarea"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. What happens if I quit my job and start freelancing in 6 months?"
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) runSimulation() }}
            />
            <button className="lt-submit-btn" onClick={runSimulation} disabled={loading || !question.trim()}>
              {loading ? '◌' : '→'}
            </button>
          </div>
          <div className="lt-input-hint">Press ⌘ + Enter to simulate</div>
        </div>

        {/* Categories */}
        <div className="lt-cats">
          {categories.map(cat => (
            <div key={cat.id}
              className={`lt-cat ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              <div className="lt-cat-bottom" />
              <span className="lt-cat-icon">{cat.icon}</span>
              <div className="lt-cat-name">{cat.name}</div>
              <div className="lt-cat-sub">{cat.sub}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="lt-loading">
            <div className="lt-loading-orb">
              <div className="lt-loading-dot" />
            </div>
            <div className="lt-loading-title">Your twin is thinking...</div>
            <div className="lt-loading-sub">Building your simulation</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="lt-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="lt-results" ref={resultsRef}>

            <div className="lt-section-divider">
              <div className="lt-section-line" />
              <div className="lt-section-chip">
                <span>Simulation Complete</span>
              </div>
              <div className="lt-section-line" />
            </div>

            {/* Question echo */}
            <div className="lt-q-block">
              <div className="lt-q-label">Your Question</div>
              <div className="lt-q-text">"{question}"</div>
            </div>

            {/* Analysis */}
            <div className="lt-analysis">
              <div className="lt-analysis-header">
                <div className="lt-analysis-avatar">🧬</div>
                <div className="lt-analysis-label">Your Twin Says</div>
              </div>
              <div className="lt-analysis-text">{result.ai_analysis}</div>
            </div>

            {/* Paths */}
            <div className="lt-paths-title">Three Possible Paths</div>
            <div className="lt-paths">
              {[
                { key: 'path_a', badge: 'Safe Path',  cls: 'safe'    },
                { key: 'path_b', badge: 'Risky Path', cls: 'risky'   },
                { key: 'path_c', badge: '★ Optimal',  cls: 'optimal' },
              ].map(p => {
                const path = result[p.key]
                return (
                  <div key={p.key} className={`lt-path-card ${p.cls}`}>
                    <div className={`lt-path-badge ${p.cls}`}>{p.badge}</div>
                    <div className="lt-path-name">{path.name}</div>
                    <div className="lt-path-desc">{path.description}</div>
                    <div className="lt-path-prob-row">
                      <div className="lt-path-prob">
                        {path.probability}<sup>%</sup>
                      </div>
                      <div className="lt-path-prob-label">Success Probability</div>
                    </div>
                    <div className="lt-path-rule" />
                    {[
                      ['Risk Level',  path.risk_level],
                      ['Regret Risk', `${path.regret_risk}%`],
                      ['Timeline',    path.timeline],
                      ['Happiness',   path.happiness_score],
                    ].map(([k, v]) => (
                      <div key={k} className="lt-path-stat">
                        <span className="lt-path-stat-k">{k}</span>
                        <span className="lt-path-stat-v">{v}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Bottom row */}
            <div className="lt-bottom">
              <div className="lt-regret-card">
                <div className="lt-card-label">Regret Predictor</div>
                <div className="lt-regret-big" style={{ color: regretColor }}>{rs}%</div>
                <div className="lt-regret-pill" style={{ color: regretColor, background: regretBg, border: `1px solid ${regretBorder}` }}>
                  {regretLabel}
                </div>
                <div className="lt-regret-desc">{regretDesc}</div>
              </div>

              <div className="lt-insight-card">
                <div className="lt-card-label">Key Insight</div>
                <div className="lt-rec-tag">Recommended Path {result.recommended_path}</div>
                <div className="lt-insight-text">{result.key_insight}</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
