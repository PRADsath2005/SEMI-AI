import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

function StatusBadge({ cls }) {
  if (cls === 'Normal') return <span className="badge badge-success">✓ Normal</span>;
  if (cls === 'Failure') return <span className="badge badge-danger">✗ Failure</span>;
  return <span className="badge badge-info">{cls}</span>;
}

function RiskBadge({ prob }) {
  if (prob === null || prob === undefined) return <span className="badge badge-info">N/A</span>;
  const p = parseFloat(prob);
  if (p >= 0.7) return <span className="badge badge-danger">High ({(p * 100).toFixed(1)}%)</span>;
  if (p >= 0.4) return <span className="badge badge-warning">Medium ({(p * 100).toFixed(1)}%)</span>;
  return <span className="badge badge-success">Low ({(p * 100).toFixed(1)}%)</span>;
}

const PAGE_SIZE = 8;

export default function PredictionHistoryTable({ data }) {
  const { predictions } = useApp();
  const rows = data ?? predictions;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <History />
        <h3>No predictions yet</h3>
        <p>Upload a CSV on the Chip Prediction page to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" aria-label="Prediction history">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>File / ID</th>
              <th>Chips</th>
              <th>Predicted Class</th>
              <th>Failure Probability</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={row.id ?? i}>
                <td style={{ color: '#475569' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td>{row.timestamp ?? '—'}</td>
                <td style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                  {row.filename ?? row.id ?? '—'}
                </td>
                <td>{row.count ?? 1}</td>
                <td><StatusBadge cls={row.predictedClass} /></td>
                <td><RiskBadge prob={row.failureProbability} /></td>
                <td>{row.riskLevel ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination" aria-label="Pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn${page === i + 1 ? ' active' : ''}`}
              onClick={() => setPage(i + 1)}
              aria-label={`Page ${i + 1}`}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
