import React from 'react';
import { History } from 'lucide-react';
import PredictionHistoryTable from '../components/PredictionHistoryTable';

export default function PredictionHistory() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Prediction History</h1>
        <p>All semiconductor chip predictions with timestamps, classes, and failure probabilities</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><History /> All Predictions</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <PredictionHistoryTable />
        </div>
      </div>
    </div>
  );
}
