import React, { useEffect, useState } from 'react';
import { Brain, RefreshCw, Info } from 'lucide-react';
import ModelStatusBanner from '../components/ModelStatusBanner';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

const XAI_CONCEPTS = [
  {
    term: 'SHAP Value',
    def:  'SHapley Additive exPlanations — a game-theory-based method that assigns each feature a contribution score for a specific prediction.',
  },
  {
    term: 'Global Importance',
    def:  'The mean absolute SHAP value across all predictions, showing which features are most influential overall.',
  },
  {
    term: 'Local Explanation',
    def:  'SHAP values for a single prediction showing why that specific chip was classified as Normal or Failure.',
  },
  {
    term: 'Feature Contribution',
    def:  'Positive SHAP → pushes prediction toward Failure. Negative SHAP → pushes prediction toward Normal.',
  },
];

export default function ExplainableAI() {
  const { modelConnected, backendOnline } = useApp();
  const [shapData, setShapData]           = useState(null);
  const [loading, setLoading]             = useState(false);

  const fetchShap = async () => {
    if (!backendOnline || !modelConnected) return;
    setLoading(true);
    try {
      const data = await api.shapGlobal();
      setShapData(data.features);
    } catch {
      // silent – chart shows placeholder
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShap(); }, [modelConnected, backendOnline]);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Explainable AI</h1>
        <p>Understand which sensor features drive chip failure predictions using SHAP analysis</p>
      </div>

      <ModelStatusBanner show={!modelConnected} />

      {/* Concept Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        {XAI_CONCEPTS.map(({ term, def }) => (
          <div key={term} className="card fade-in-up">
            <div className="card-body">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Info size={18} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: 6 }}>{term}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{def}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHAP Chart */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Global Feature Importance (SHAP)
        </h2>
        <button
          id="refresh-shap-btn"
          className="btn btn-secondary btn-sm"
          onClick={fetchShap}
          disabled={loading || !modelConnected}
          aria-label="Refresh SHAP data"
        >
          {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>
      <FeatureImportanceChart shapData={shapData} />

      {/* Feature Table */}
      {shapData && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <span className="card-title"><Brain /> Top Features Ranked</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table" aria-label="SHAP feature importance table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Feature</th>
                  <th>Mean |SHAP|</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                {shapData.map((f, i) => {
                  const max = shapData[0]?.importance ?? 1;
                  const pct = max > 0 ? (f.importance / max) * 100 : 0;
                  return (
                    <tr key={f.feature}>
                      <td style={{ color: 'var(--cyan)', fontWeight: 700 }}>#{i + 1}</td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{f.feature}</td>
                      <td>{f.importance.toFixed(4)}</td>
                      <td style={{ minWidth: 140 }}>
                        <div className="risk-bar-track">
                          <div
                            className="risk-bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, #00d4ff, #0088ff)`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Model Not Connected state for table */}
      {!modelConnected && !shapData && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-body">
            <div className="empty-state">
              <Brain />
              <h3>SHAP Data Unavailable</h3>
              <p>Connect the trained model to view feature importance rankings.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
