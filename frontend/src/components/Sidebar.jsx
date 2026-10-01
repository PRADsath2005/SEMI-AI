import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Home, Cpu, Brain, BarChart2,
  History, Info, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { label: 'Home',           path: '/',           icon: Home },
  { label: 'Dashboard',      path: '/dashboard',  icon: LayoutDashboard },
  { to_section: 'ANALYSIS' },
  { label: 'Chip Prediction',path: '/predict',    icon: Cpu },
  { label: 'Explainable AI', path: '/xai',        icon: Brain },
  { label: 'Risk Analysis',  path: '/risk',       icon: BarChart2 },
  { to_section: 'RECORDS' },
  { label: 'History',        path: '/history',    icon: History },
  { to_section: 'INFO' },
  { label: 'About',          path: '/about',      icon: Info },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const col = sidebarCollapsed;

  return (
    <aside className={`sidebar${col ? ' collapsed' : ''}`} aria-label="Main navigation">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo" aria-hidden="true">
          <Zap />
        </div>
        <div className="sidebar-brand">
          <div className="sidebar-title">SEMI-AI</div>
          <div className="sidebar-sub">Chip Failure Prediction</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" role="navigation">
        {NAV.map((item, i) => {
          if (item.to_section) {
            return (
              <div key={i} className="nav-section-label">{item.to_section}</div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              title={col ? item.label : undefined}
            >
              <Icon aria-hidden="true" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="sidebar-toggle">
        <button
          className="toggle-btn"
          onClick={() => setSidebarCollapsed(!col)}
          title={col ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={col ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {col ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
