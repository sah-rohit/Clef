import { useEffect, useState } from "react";
import { useLocation } from "react-router";

/**
 * Thin gradient loading bar that plays on every route change.
 * Matches Apple/Linear style — fast, subtle, satisfying.
 */
export function PageLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setVisible(true);
    setKey(k => k + 1);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      key={key}
      className="loading-bar-brutal"
      style={{ pointerEvents: "none" }}
    />
  );
}
