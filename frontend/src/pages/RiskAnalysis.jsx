import React, { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

import { Doughnut, Bar } from 'react-chartjs-2';

import {
  BarChart2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

import ModelStatusBanner from '../components/ModelStatusBanner';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);


// ── Risk Categories ──────────────────────────────────────

const RISK_CATEGORIES = [
  {
    label: 'Low Risk',
    range: '0 – 40%',
    color: '#10b981',
    desc: 'Lower predicted failure probability.',
  },
  {
    label: 'Medium Risk',
    range: '40 – 70%',
    color: '#f59e0b',
    desc: 'Moderate predicted failure probability.',
  },
  {
    label: 'High Risk',
    range: '70 – 100%',
    color: '#ef4444',
    desc: 'Higher predicted failure probability. Review required.',
  },
];


// ── Probability Labels ───────────────────────────────────

const DEFAULT_BINS = {
  labels: [
    '0-10%',
    '10-20%',
    '20-30%',
    '30-40%',
    '40-50%',
    '50-60%',
    '60-70%',
    '70-80%',
    '80-90%',
    '90-100%',
  ],
  counts: new Array(10).fill(0),
};


// ── Component ────────────────────────────────────────────

export default function RiskAnalysis() {

  const {
    modelConnected,
    backendOnline,
    dashboardStats,
  } = useApp();

  const [riskData, setRiskData] = useState(null);
  const [stats, setStats] = useState(dashboardStats);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // ── Fetch Risk Data ─────────────────────────────────────

  const fetchRisk = async () => {

    if (!backendOnline) {
      setError('Backend server is offline.');
      return;
    }

    setLoading(true);
    setError('');

    try {

      const [riskResponse, statsResponse] = await Promise.all([
        api.riskAnalysis(),
        fetch('/api/dashboard/stats').then(async (res) => {
          if (!res.ok) {
            throw new Error('Could not load dashboard statistics.');
          }
          return res.json();
        }),
      ]);

      setRiskData(riskResponse);
      setStats(statsResponse);

    } catch (err) {

      console.error('Risk analysis error:', err);

      setError(
        err.message || 'Unable to load risk analysis data.'
      );

    } finally {
      setLoading(false);
    }
  };


  // ── Load Data ───────────────────────────────────────────

  useEffect(() => {
    fetchRisk();
  }, [backendOnline, modelConnected]);


  // ── Doughnut Chart ──────────────────────────────────────

  const normal = Number(stats?.normal ?? 0);
  const failed = Number(stats?.failed ?? 0);

  const doughnutData = {
    labels: ['Normal', 'Failed'],

    datasets: [
      {
        data: [normal, failed],

        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],

        borderColor: [
          '#10b981',
          '#ef4444',
        ],

        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };


  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',

    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },

      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
      },
    },
  };


  // ── Probability Distribution ────────────────────────────

  const probBins =
    riskData?.probabilityBins ?? DEFAULT_BINS;


  const barData = {
    labels: probBins.labels,

    datasets: [
      {
        label: 'Prediction Count',
        data: probBins.counts,

        backgroundColor: probBins.labels.map((_, i) => {
          if (i >= 7) {
            return 'rgba(239, 68, 68, 0.7)';
          }

          if (i >= 4) {
            return 'rgba(245, 158, 11, 0.7)';
          }

          return 'rgba(16, 185, 129, 0.7)';
        }),

        borderRadius: 4,
      },
    ],
  };


  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
      },
    },

    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.04)',
        },

        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
          },
        },

        grid: {
          color: 'rgba(255,255,255,0.04)',
        },
      },
    },
  };


  // ── UI ─────────────────────────────────────────────────

  return (
    <div className="page-wrapper">

      {/* Page Header */}

      <div className="page-header">
        <h1>Risk Analysis</h1>

        <p>
          Failure probability visualization and risk category breakdown
        </p>
      </div>


      {/* Model Status */}

      <ModelStatusBanner show={!modelConnected} />


      {/* Error */}

      {error && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            padding: 16,
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      )}


      {/* Risk Category Cards */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >

        {RISK_CATEGORIES.map(({ label, range, color, desc }) => (

          <div
            key={label}
            className="card fade-in-up"
            style={{
              borderColor: `${color}30`,
            }}
          >

            <div className="card-body">

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >

                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color,
                  }}
                >
                  {label}
                </span>

              </div>


              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color,
                  marginBottom: 6,
                }}
              >
                {range}
              </div>


              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>

            </div>

          </div>

        ))}

      </div>


      {/* Charts Row */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 20,
          marginBottom: 24,
        }}
      >

        {/* Pass / Fail Chart */}

        <div className="card">

          <div className="card-header">

            <span className="card-title">
              <ShieldAlert />
              Pass / Fail Split
            </span>

          </div>


          <div className="card-body">

            {normal === 0 && failed === 0 ? (

              <div className="empty-state">
                <p>No prediction records available.</p>
              </div>

            ) : (

              <div style={{ height: 260 }}>
                <Doughnut
                  data={doughnutData}
                  options={doughnutOptions}
                />
              </div>

            )}

          </div>

        </div>


        {/* Probability Distribution */}

        <div className="card">

          <div className="card-header">

            <span className="card-title">
              <BarChart2 />
              Prediction Probability Distribution
            </span>


            <button
              id="refresh-risk-btn"
              className="btn btn-secondary btn-sm"
              onClick={fetchRisk}
              disabled={loading || !backendOnline}
              aria-label="Refresh risk data"
            >

              {loading ? (
                <span
                  className="spinner"
                  style={{
                    width: 14,
                    height: 14,
                  }}
                />
              ) : (
                <RefreshCw size={14} />
              )}

              Refresh

            </button>

          </div>


          <div className="card-body">

            <div className="chart-container">

              <Bar
                data={barData}
                options={barOptions}
              />

            </div>

          </div>

        </div>

      </div>


      {/* Probability Explanation */}

      <div className="card">

        <div className="card-header">

          <span className="card-title">
            How to Interpret Failure Probability
          </span>

        </div>


        <div className="card-body">

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >

            {[
              {
                title: 'Probability Score',
                body:
                  'The model outputs a probability between 0 and 1. A higher score indicates a higher predicted probability of failure.',
              },

              {
                title: 'Classification Threshold',
                body:
                  'The model uses its configured classification threshold. The threshold should be evaluated and selected using validation data.',
              },

              {
                title: 'Model Uncertainty',
                body:
                  'A probability near 0.5 may indicate uncertainty, but probability calibration should be checked before interpreting it as confidence.',
              },
            ].map(({ title, body }) => (

              <div key={title}>

                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--cyan)',
                    marginBottom: 6,
                  }}
                >
                  {title}
                </div>


                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  {body}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}