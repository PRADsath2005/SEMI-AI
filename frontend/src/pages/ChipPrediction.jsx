import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Trash2, Send } from 'lucide-react';
import ModelStatusBanner from '../components/ModelStatusBanner';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

function ResultCard({ result }) {
  const isFailure = result.predictedClass === 'Failure';
  const prob      = result.failureProbability ?? null;
  const probPct   = prob !== null ? (parseFloat(prob) * 100).toFixed(1) : null;

  let riskColor = '#10b981';
  let riskLabel = 'Low Risk';
  if (prob !== null) {
    if (parseFloat(prob) >= 0.7) { riskColor = '#ef4444'; riskLabel = 'High Risk'; }
    else if (parseFloat(prob) >= 0.4) { riskColor = '#f59e0b'; riskLabel = 'Medium Risk'; }
  }

  return (
    <div style={{
      background: isFailure ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)',
      border: `1px solid ${isFailure ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
      borderRadius: 'var(--radius-md)',
      padding: 20,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 16,
      marginBottom: 12,
    }}>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Predicted Class</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isFailure
            ? <XCircle size={20} style={{ color: '#ef4444' }} />
            : <CheckCircle size={20} style={{ color: '#10b981' }} />}
          <span style={{ fontWeight: 700, fontSize: '1rem', color: isFailure ? '#ef4444' : '#10b981' }}>
            {result.predictedClass}
          </span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Failure Probability</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: riskColor }}>
          {probPct !== null ? `${probPct}%` : 'N/A'}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Risk Level</div>
        <span className={`badge ${
          riskLabel === 'High Risk' ? 'badge-danger' :
          riskLabel === 'Medium Risk' ? 'badge-warning' : 'badge-success'
        }`}>{riskLabel}</span>
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Chips Analyzed</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
          {result.count ?? 1}
        </div>
      </div>
    </div>
  );
}

export default function ChipPrediction() {
  const { modelConnected, addPrediction } = useApp();
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null); // { headers, rows }
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const onDrop = useCallback((accepted, rejected) => {
    setError(null);
    setResult(null);
    if (rejected.length) {
      setError('Please upload a valid CSV file (max 20 MB).');
      return;
    }
    const f = accepted[0];
    setFile(f);

    // Parse first few rows for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split('\n').slice(0, 6);
      const headers = lines[0].split(',').map((h) => h.trim()).slice(0, 10);
      const rows = lines.slice(1, 5).map((l) =>
        l.split(',').map((v) => v.trim()).slice(0, 10)
      );
      setPreview({ headers, rows, totalCols: lines[0].split(',').length, totalRows: text.trim().split('\n').length - 1 });
    };
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.csv'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.predict(formData);
      setResult(res);
      addPrediction({
        id: res.id ?? Date.now().toString(),
        filename: file.name,
        timestamp: new Date().toLocaleString(),
        count: res.count ?? 1,
        predictedClass: res.predictedClass,
        failureProbability: res.failureProbability,
        failedCount: res.failedCount ?? 0,
        normalCount: res.normalCount ?? 0,
        riskLevel: res.riskLevel,
      });
    } catch (e) {
      setError(e.message ?? 'Prediction failed. Ensure the backend is running and model is loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Chip Failure Prediction</h1>
        <p>Upload a CSV file with sensor readings to classify chips as Normal or Failure</p>
      </div>

      <ModelStatusBanner show={!modelConnected} />

      {/* Upload Zone */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title"><Upload /> Upload CSV File</span>
          {file && (
            <button id="clear-file-btn" className="btn btn-secondary btn-sm" onClick={handleClear} aria-label="Clear file">
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
        <div className="card-body">
          <div
            {...getRootProps()}
            className={`upload-zone${isDragActive ? ' drag-active' : ''}`}
            id="csv-upload-zone"
            aria-label="CSV file upload area"
          >
            <input {...getInputProps()} id="csv-file-input" aria-label="Select CSV file" />
            <div className="upload-zone-icon" aria-hidden="true">
              {file ? <FileText /> : <Upload />}
            </div>
            {file ? (
              <>
                <div className="upload-title" style={{ color: 'var(--cyan)' }}>{file.name}</div>
                <div className="upload-sub">{(file.size / 1024).toFixed(1)} KB — Click or drag to replace</div>
              </>
            ) : (
              <>
                <div className="upload-title">
                  {isDragActive ? 'Drop the CSV here…' : 'Drag & drop your CSV file here'}
                </div>
                <div className="upload-sub">or click to browse — CSV format, max 20 MB</div>
              </>
            )}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
              padding: '12px 16px', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)',
              color: '#ef4444', fontSize: '0.85rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {file && (
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="predict-btn"
                className="btn btn-primary"
                onClick={handlePredict}
                disabled={loading || !modelConnected}
                aria-label="Run prediction"
              >
                {loading
                  ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analyzing…</>
                  : <><Send size={16} /> Run Prediction</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSV Preview */}
      {preview && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title"><FileText /> Data Preview</span>
            <span className="badge badge-info">{preview.totalRows} rows · {preview.totalCols} columns</span>
          </div>
          <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {preview.headers.map((h, i) => <th key={i}>{h}{i === 9 && preview.totalCols > 10 ? '…' : ''}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.totalCols > 10 && (
              <p style={{ padding: '10px 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Showing first 10 of {preview.totalCols} columns.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card fade-in-up">
          <div className="card-header">
            <span className="card-title">
              {result.predictedClass === 'Failure'
                ? <><XCircle style={{ color: '#ef4444' }} /> Prediction Result</>
                : <><CheckCircle style={{ color: '#10b981' }} /> Prediction Result</>}
            </span>
          </div>
          <div className="card-body">
            <ResultCard result={result} />
            {result.message && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 8 }}>{result.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
