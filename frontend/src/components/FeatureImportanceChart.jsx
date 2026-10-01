import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Brain } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PLACEHOLDER_FEATURES = [
  { feature: 'Feature 590',  importance: 0 },
  { feature: 'Feature 123',  importance: 0 },
  { feature: 'Feature 47',   importance: 0 },
  { feature: 'Feature 315',  importance: 0 },
  { feature: 'Feature 208',  importance: 0 },
  { feature: 'Feature 89',   importance: 0 },
  { feature: 'Feature 444',  importance: 0 },
  { feature: 'Feature 72',   importance: 0 },
  { feature: 'Feature 156',  importance: 0 },
  { feature: 'Feature 33',   importance: 0 },
];

export default function FeatureImportanceChart({ shapData }) {
  const features = shapData ?? PLACEHOLDER_FEATURES;

  const data = {
    labels: features.map((f) => f.feature),
    datasets: [
      {
        label: 'SHAP Importance',
        data: features.map((f) => f.importance),
        backgroundColor: features.map((_, i) =>
          `rgba(0, ${212 - i * 12}, ${255 - i * 8}, ${0.85 - i * 0.04})`
        ),
        borderColor: 'rgba(0, 212, 255, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (ctx) => ` SHAP: ${ctx.parsed.x.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#475569', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title"><Brain /> SHAP Feature Importance</span>
      </div>
      <div className="card-body">
        <div className="chart-container-lg">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
