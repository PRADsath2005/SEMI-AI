import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AppContext = createContext(null);

const HEALTH_URL = '/api/health';
const PREDICTIONS_URL = '/api/predictions';
const POLL_INTERVAL_MS = 15000;

async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function AppProvider({ children }) {
  const [modelConnected, setModelConnected] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    normal: 0,
    failed: 0,
    failureRate: 0,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(HEALTH_URL, 4000);

      if (res.ok) {
        const data = await res.json();
        setBackendOnline(true);
        setModelConnected(data.model_loaded === true);
      } else {
        setBackendOnline(true);
        setModelConnected(false);
      }
    } catch {
      setBackendOnline(false);
      setModelConnected(false);
    }
  }, []);

  // Fetch prediction history from Flask backend
  const refreshPredictions = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(PREDICTIONS_URL, 10000);

      if (!res.ok) {
        throw new Error('Failed to fetch prediction history');
      }

      const result = await res.json();
      const records = Array.isArray(result.data) ? result.data : [];

      setPredictions(records);
    } catch (error) {
      console.error('Prediction history error:', error);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    refreshPredictions();

    const interval = setInterval(() => {
      checkHealth();
      refreshPredictions();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [checkHealth, refreshPredictions]);

  const addPrediction = (record) => {
    setPredictions((prev) => [record, ...prev]);

    setDashboardStats((prev) => {
      const total = prev.total + (record.count ?? 1);
      const failed = prev.failed + (record.failedCount ?? 0);
      const normal = prev.normal + (record.normalCount ?? 0);

      return {
        total,
        failed,
        normal,
        failureRate:
          total > 0 ? ((failed / total) * 100).toFixed(1) : 0,
      };
    });

    // Sync with database after a new prediction
    refreshPredictions();
  };

  return (
    <AppContext.Provider
      value={{
        modelConnected,
        backendOnline,
        predictions,
        dashboardStats,
        sidebarCollapsed,
        setSidebarCollapsed,
        addPrediction,
        refreshHealth: checkHealth,
        refreshPredictions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
};