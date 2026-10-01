import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChipPrediction from './pages/ChipPrediction';
import ExplainableAI from './pages/ExplainableAI';
import RiskAnalysis from './pages/RiskAnalysis';
import PredictionHistory from './pages/PredictionHistory';
import About from './pages/About';

function AppShell() {
  const { sidebarCollapsed } = useApp();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <TopBar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/dashboard"element={<Dashboard />} />
          <Route path="/predict"  element={<ChipPrediction />} />
          <Route path="/xai"      element={<ExplainableAI />} />
          <Route path="/risk"     element={<RiskAnalysis />} />
          <Route path="/history"  element={<PredictionHistory />} />
          <Route path="/about"    element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
