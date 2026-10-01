import React from 'react';
import { AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Displays a banner reflecting the current backend / model connection state.
 *
 * - Backend offline  → red "Backend Offline" banner
 * - Backend online, model not loaded → amber "Model Not Connected" banner
 * - Backend online, model loaded    → green "Model Ready" banner (auto-dismisses after 6 s)
 *
 * Pass `show={false}` to hide entirely.
 */
export default function ModelStatusBanner({ show = true }) {
  const { backendOnline, modelConnected } = useApp();
  const [dismissed, setDismissed] = React.useState(false);

  // Reset dismissed state whenever connection status changes so the banner
  // re-appears if the model goes offline and comes back.
  const prevConnected = React.useRef(modelConnected);
  React.useEffect(() => {
    if (prevConnected.current !== modelConnected) {
      setDismissed(false);
      prevConnected.current = modelConnected;
    }
  }, [modelConnected]);

  // Auto-dismiss the "Model Ready" banner after 6 seconds
  React.useEffect(() => {
    if (backendOnline && modelConnected && !dismissed) {
      const t = setTimeout(() => setDismissed(true), 6000);
      return () => clearTimeout(t);
    }
  }, [backendOnline, modelConnected, dismissed]);

  if (!show || dismissed) return null;

  if (!backendOnline) {
    return (
      <div className="model-banner model-banner--error" role="alert">
        <WifiOff />
        <div className="model-banner-text">
          <strong>Backend Offline</strong>
          <p>
            The Flask server is not reachable at <code>http://localhost:5000</code>.
            Start it with <code>python app.py</code> inside <code>backend/</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!modelConnected) {
    return (
      <div className="model-banner" role="alert">
        <AlertTriangle />
        <div className="model-banner-text">
          <strong>Model Not Connected</strong>
          <p>
            No trained model is currently loaded. Place your <code>model.pkl</code> and
            SHAP explainer into <code>backend/models/</code> then restart the Flask server.
            Prediction features will activate automatically once the model is detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-banner model-banner--success" role="status">
      <CheckCircle />
      <div className="model-banner-text">
        <strong>Model Ready</strong>
        <p>Random Forest model is loaded and ready for predictions.</p>
      </div>
    </div>
  );
}
