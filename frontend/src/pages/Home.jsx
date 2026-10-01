import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Brain, BarChart2, History, ChevronRight, Zap, Shield, Activity } from 'lucide-react';

const FEATURES = [
  { icon: Cpu,      title: 'Chip Failure Prediction', desc: 'Upload CSV data and get instant failure/normal classification for semiconductor chips.' },
  { icon: Brain,    title: 'Explainable AI (SHAP)',   desc: 'Understand which sensor features drive each prediction with SHAP value visualizations.' },
  { icon: BarChart2,title: 'Risk Analysis',            desc: 'Categorize chips by failure probability into Low, Medium, and High risk tiers.' },
  { icon: History,  title: 'Prediction History',      desc: 'Track all past predictions with timestamps, classes, and probability scores.' },
];

const TECH_BADGES = [
  'React.js', 'Python Flask', 'Scikit-learn', 'SHAP', 'Chart.js', 'SQLite', 'UCI SECOM',
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-tag fade-in-up">
            <Zap size={14} aria-hidden="true" />
            AI-Powered Semiconductor Intelligence
          </div>
          <h1 className="fade-in-up delay-1">
            Predict Chip Failures<br />
            <span>Before They Happen</span>
          </h1>
          <p className="fade-in-up delay-2">
            SEMI-AI leverages Random Forest machine learning and SHAP explainability
            to analyze semiconductor manufacturing sensor data from the UCI SECOM dataset,
            predicting chip failures with transparent, actionable insights.
          </p>
          <div className="hero-actions fade-in-up delay-3">
            <button
              id="get-started-btn"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/predict')}
              aria-label="Go to chip prediction page"
            >
              Get Started <ChevronRight size={18} />
            </button>
            <button
              id="view-dashboard-btn"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/dashboard')}
              aria-label="Go to dashboard"
            >
              View Dashboard
            </button>
          </div>
          <div className="hero-chips fade-in-up delay-4" aria-label="Technology tags">
            {TECH_BADGES.map((t) => (
              <span key={t} className="hero-chip">
                <Shield size={12} aria-hidden="true" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────── */}
      <section aria-label="Features" style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
          Core Capabilities
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
          Everything you need for end-to-end semiconductor chip failure analysis.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`card fade-in-up delay-${i + 1}`}
              style={{ padding: 0 }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                  background: 'var(--cyan-dim)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} style={{ color: 'var(--cyan)' }} aria-hidden="true" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Banner ──────────────────────────────────────── */}
      <section
        aria-label="Dataset statistics"
        style={{
          marginTop: 48,
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,136,255,0.06))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 24,
          textAlign: 'center',
        }}
      >
        {[
          { icon: Activity, val: '1,567', label: 'Dataset Records' },
          { icon: Cpu,       val: '590',   label: 'Sensor Features' },
          { icon: Brain,     val: 'RF',    label: 'ML Algorithm' },
          { icon: Shield,    val: 'SHAP',  label: 'XAI Method' },
        ].map(({ icon: Icon, val, label }) => (
          <div key={label}>
            <Icon size={28} style={{ color: 'var(--cyan)', margin: '0 auto 10px' }} aria-hidden="true" />
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cyan)', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
