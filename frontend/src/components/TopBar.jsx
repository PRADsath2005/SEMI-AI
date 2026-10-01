import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const TITLES = {
  '/':          { title: 'SEMI-AI',          sub: 'AI-Based Semiconductor Chip Failure Prediction' },
  '/dashboard': { title: 'Dashboard',         sub: 'Overview of predictions and system health' },
  '/predict':   { title: 'Chip Prediction',   sub: 'Upload CSV and run failure analysis' },
  '/xai':       { title: 'Explainable AI',    sub: 'SHAP feature importance and prediction explanations' },
  '/risk':      { title: 'Risk Analysis',     sub: 'Failure probability and risk categories' },
  '/history':   { title: 'Prediction History',sub: 'All past chip prediction records' },
  '/about':     { title: 'About Project',     sub: 'Dataset, methodology, and technology stack' },
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { modelConnected, backendOnline } = useApp();
  const { title, sub } = TITLES[pathname] ?? { title: 'SEMI-AI', sub: '' };

  let statusLabel, statusClass;
  if (!backendOnline) {
    statusLabel = 'Backend Offline';
    statusClass = 'disconnected';
  } else if (!modelConnected) {
    statusLabel = 'Model Not Connected';
    statusClass = 'disconnected';
  } else {
    statusLabel = 'Model Ready';
    statusClass = 'connected';
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        {sub && <div className="topbar-breadcrumb">{sub}</div>}
      </div>
      <div className="topbar-right">
        <div className={`model-status-pill ${statusClass}`} role="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {statusLabel}
        </div>
      </div>
    </header>
  );
}
