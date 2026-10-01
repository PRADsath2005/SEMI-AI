import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
);

const EMPTY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const EMPTY_TOTAL  = [0, 0, 0, 0, 0, 0];
const EMPTY_FAILED = [0, 0, 0, 0, 0, 0];

export default function PredictionHistoryChart({ historyData }) {
  const labels  = historyData?.labels  ?? EMPTY_LABELS;
  const total   = historyData?.total   ?? EMPTY_TOTAL;
  const failed  = historyData?.failed  ?? EMPTY_FAILED;

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Predictions',
        data: total,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d4ff',
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
      {
        label: 'Failures Detected',
        data: failed,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.06)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#475569', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#475569', font: { family: 'Inter', size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <TrendingUp /> Prediction Trend
        </span>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
