import React from 'react';

/**
 * StatCard – displays a single KPI metric.
 *
 * Props:
 *   icon       – Lucide icon component
 *   label      – metric label string
 *   value      – metric value (string | number)
 *   desc       – optional sub-description
 *   accent     – 'cyan' | 'green' | 'red' | 'amber' | 'electric'
 */

const ACCENTS = {
  cyan:    { iconBg: 'rgba(0, 212, 255, 0.12)',  iconColor: '#00d4ff', gradient: 'linear-gradient(90deg, #00d4ff, #0088ff)', valueGrad: 'linear-gradient(135deg, #e2e8f0, #00d4ff)' },
  green:   { iconBg: 'rgba(16, 185, 129, 0.12)', iconColor: '#10b981', gradient: 'linear-gradient(90deg, #10b981, #06b6d4)', valueGrad: 'linear-gradient(135deg, #e2e8f0, #10b981)' },
  red:     { iconBg: 'rgba(239, 68, 68, 0.12)',  iconColor: '#ef4444', gradient: 'linear-gradient(90deg, #ef4444, #f97316)', valueGrad: 'linear-gradient(135deg, #e2e8f0, #ef4444)' },
  amber:   { iconBg: 'rgba(245, 158, 11, 0.12)', iconColor: '#f59e0b', gradient: 'linear-gradient(90deg, #f59e0b, #f97316)', valueGrad: 'linear-gradient(135deg, #e2e8f0, #f59e0b)' },
  electric:{ iconBg: 'rgba(0, 136, 255, 0.12)',  iconColor: '#0088ff', gradient: 'linear-gradient(90deg, #0088ff, #7c3aed)', valueGrad: 'linear-gradient(135deg, #e2e8f0, #0088ff)' },
};

export default function StatCard({ icon: Icon, label, value, desc, accent = 'cyan' }) {
  const a = ACCENTS[accent] ?? ACCENTS.cyan;

  return (
    <div
      className="stat-card fade-in-up"
      style={{ '--accent-gradient': a.gradient }}
    >
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: a.iconBg }}>
          {Icon && <Icon size={22} style={{ color: a.iconColor }} aria-hidden="true" />}
        </div>
        <span className="stat-label">{label}</span>
      </div>
      <div
        className="stat-value"
        style={{ '--value-gradient': a.valueGrad }}
        aria-label={`${label}: ${value}`}
      >
        {value ?? '—'}
      </div>
      {desc && <div className="stat-desc">{desc}</div>}
    </div>
  );
}
