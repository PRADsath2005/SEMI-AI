import React, { useEffect, useState, useCallback } from "react";
import {
  Cpu,
  CheckCircle,
  XCircle,
  Percent,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import PredictionHistoryChart from "../components/PredictionHistoryChart";

const API_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    failed: 0,
    failureRate: 0,
  });

  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch dashboard statistics
      const statsResponse = await fetch(
        `${API_URL}/dashboard/stats`
      );

      if (!statsResponse.ok) {
        throw new Error("Unable to load dashboard statistics.");
      }

      const statsData = await statsResponse.json();

      setStats({
        total: Number(
          statsData.total ?? statsData.total_predictions ?? 0
        ),
        normal: Number(
          statsData.normal ?? statsData.normal_chips ?? 0
        ),
        failed: Number(
          statsData.failed ?? statsData.failed_chips ?? 0
        ),
        failureRate: Number(
          statsData.failureRate ??
          statsData.failure_rate ??
          0
        ),
      });

      // Fetch prediction history chart
      const historyResponse = await fetch(
        `${API_URL}/dashboard/history`
      );

      if (!historyResponse.ok) {
        throw new Error("Unable to load prediction history.");
      }

      const history = await historyResponse.json();
      setHistoryData(history);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const { total, normal, failed, failureRate } = stats;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>
          Real-time overview of semiconductor chip prediction metrics
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Cpu}
          label="Total Predictions"
          value={total}
          desc="Chips analyzed so far"
          accent="cyan"
        />

        <StatCard
          icon={CheckCircle}
          label="Normal Chips"
          value={normal}
          desc="Passed quality check"
          accent="green"
        />

        <StatCard
          icon={XCircle}
          label="Failed Chips"
          value={failed}
          desc="Flagged as failures"
          accent="red"
        />

        <StatCard
          icon={Percent}
          label="Failure Rate"
          value={total > 0 ? `${failureRate}%` : "—"}
          desc="Percentage of failures detected"
          accent="amber"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          marginTop: 24,
        }}
      >
        <h2
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Prediction History Trend
        </h2>

        <button
          id="refresh-dashboard-btn"
          className="btn btn-secondary btn-sm"
          onClick={fetchDashboard}
          disabled={loading}
          aria-label="Refresh dashboard data"
        >
          {loading ? (
            <span
              className="spinner"
              style={{ width: 14, height: 14 }}
            />
          ) : (
            <RefreshCw size={14} />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 16,
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      <PredictionHistoryChart historyData={historyData} />

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            title: "UCI SECOM Dataset",
            body:
              "The model is trained on semiconductor manufacturing records with sensor features and a binary pass/fail label.",
          },
          {
            title: "Algorithm",
            body:
              "Random Forest classifier with balanced class weights to handle class imbalance.",
          },
          {
            title: "Explainability",
            body:
              "SHAP values help identify the features influencing individual prediction results.",
          },
        ].map(({ title, body }) => (
          <div key={title} className="card">
            <div className="card-body">
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--cyan)",
                  marginBottom: 8,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}