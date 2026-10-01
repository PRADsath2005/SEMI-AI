import React from 'react';
import {
  Info, Database, Cpu, Brain, BarChart2,
  Code2, Server, GitBranch, ExternalLink,
} from 'lucide-react';

const TECH_STACK = [
  { icon: Code2,     name: 'React.js',      desc: 'Frontend UI framework',     color: '#61DAFB' },
  { icon: Server,    name: 'Python Flask',  desc: 'Backend REST API',          color: '#4CAF50' },
  { icon: Brain,     name: 'Scikit-learn',  desc: 'Machine learning library',  color: '#F7931E' },
  { icon: Brain,     name: 'SHAP',          desc: 'Explainable AI method',     color: '#00d4ff' },
  { icon: BarChart2, name: 'Chart.js',      desc: 'Data visualization',        color: '#FF6384' },
  { icon: Database,  name: 'SQLite',        desc: 'Lightweight database',      color: '#07B6D5' },
  { icon: GitBranch, name: 'Random Forest', desc: 'ML classification model',   color: '#10b981' },
  { icon: Cpu,       name: 'UCI SECOM',     desc: 'Training dataset',          color: '#f59e0b' },
];

const METHODOLOGY_STEPS = [
  { step: '01', title: 'Data Loading',       desc: 'Load UCI SECOM dataset (1,567 records × 590 features) with binary pass/fail labels.' },
  { step: '02', title: 'Preprocessing',      desc: 'Handle missing values via median imputation, apply StandardScaler normalization.' },
  { step: '03', title: 'Class Balancing',    desc: 'Use class_weight="balanced" in Random Forest to handle imbalanced failure classes.' },
  { step: '04', title: 'Model Training',     desc: 'Train Random Forest with 100 estimators, cross-validated on 80/20 train-test split.' },
  { step: '05', title: 'SHAP Explainability',desc: 'Compute SHAP TreeExplainer values to extract global and per-prediction feature contributions.' },
  { step: '06', title: 'API Integration',    desc: 'Expose predictions and SHAP data via Flask REST API for the React frontend to consume.' },
];

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>About This Project</h1>
        <p>Background, dataset, methodology, and technologies powering SEMI-AI</p>
      </div>

      {/* Project Description */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title"><Info /> Project Overview</span>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.9rem', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text-primary)' }}>SEMI-AI</strong> is an AI-powered web application for
            semiconductor chip failure prediction and explainable risk analysis. It uses machine learning to analyze
            sensor readings from the semiconductor manufacturing process and predict whether a chip will pass or fail
            quality control, while providing clear explanations of which process parameters contributed to the prediction.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.9rem' }}>
            The goal is to help semiconductor manufacturers reduce yield losses by identifying high-risk chips
            early in the production pipeline, enabling proactive intervention before costly downstream failures occur.
          </p>
        </div>
      </div>

      {/* Dataset */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title"><Database /> Dataset: UCI SECOM</span>
          <a
            href="https://archive.ics.uci.edu/dataset/179/secom"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            aria-label="Open UCI SECOM dataset page"
            id="secom-dataset-link"
          >
            <ExternalLink size={14} /> UCI Repository
          </a>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Records',     val: '1,567' },
              { label: 'Features',    val: '590' },
              { label: 'Normal',      val: '1,463' },
              { label: 'Failures',    val: '104' },
              { label: 'Failure Rate',val: '6.63%' },
              { label: 'Source',      val: 'UCI ML Repo' },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan)' }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.85rem' }}>
            The SECOM (SEmiCOnductor Manufacturing) dataset from the UCI Machine Learning Repository contains
            sensor readings collected during semiconductor manufacturing. Each record represents one chip, with
            590 anonymized process sensor signals and a binary pass/fail quality label. The dataset is highly
            imbalanced — only ~6.6% of chips are failures — making it a challenging real-world classification problem.
          </p>
        </div>
      </div>

      {/* Methodology */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title"><GitBranch /> ML Methodology</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {METHODOLOGY_STEPS.map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-sm)',
                  background: 'var(--cyan-dim)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan)',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {step}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <div className="card-header">
          <span className="card-title"><Cpu /> Technology Stack</span>
        </div>
        <div className="card-body">
          <div className="tech-grid">
            {TECH_STACK.map(({ icon: Icon, name, desc, color }) => (
              <div key={name} className="tech-item">
                <div className="tech-icon" style={{ background: `${color}15` }}>
                  <Icon size={24} style={{ color }} aria-hidden="true" />
                </div>
                <div className="tech-name">{name}</div>
                <div className="tech-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
