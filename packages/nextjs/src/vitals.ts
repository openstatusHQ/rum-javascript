import type { NextWebVitalsMetric } from "next/app";
import { useReportWebVitals } from "next/web-vitals";

export type OpenStatusMetrics = {
  session_id: string;
  dsn: string;
  path: string;
  href: string;
  speed: string;
  screen: string;
  data: NextWebVitalsMetric | [];
  event_type: "web-vitals" | "performance";
};

let queue: OpenStatusMetrics[] = [];
let ingestEndpoint = "https://ingest.openstat.us/v1";

let timeout: null | ReturnType<typeof setTimeout> = null;

export const collectMetrics = (metric: OpenStatusMetrics) => {
  queue.push(metric);
  timeout = setTimeout(() => {
    sendMetrics();
    timeout = null;
  }, 1000);
};

const sendMetrics = () => {
  if (queue.length === 0) return;
  const body = JSON.stringify([...queue]);
  queue = [];
  if (navigator.sendBeacon) {
    try {
      navigator.sendBeacon(ingestEndpoint, body);
    } catch (_e) {
      fetch(ingestEndpoint, { body, method: "POST", keepalive: true });
    }
  } else {
    fetch(ingestEndpoint, { body, method: "POST", keepalive: true });
  }
};

const getConnectionSpeed = () => {
  return "connection" in navigator &&
    navigator.connection &&
    // @ts-expect-error
    "effectiveType" in navigator.connection
    ? navigator.connection.effectiveType
    : "";
};

export const reportWebVitals = ({
  endpoint,
  dsn,
  path,
}: { endpoint?: string; dsn: string; path: string }) => {
  if (typeof window === "undefined" || !window) {
    return;
  }
  let sessionId = getSessionId();

  if (!sessionId) {
    sessionId = setSessionId();
  }
  if (endpoint) {
    ingestEndpoint = endpoint;
  }

  const href = window.location.href;

  const speed = getConnectionSpeed() as string;

  const screen = `${window.screen.width}x${window.screen.height}`;
  // getSessionId
  useReportWebVitals((metric) => {
    collectMetrics({
      path,
      href,
      speed,
      dsn,
      screen,
      data: metric,
      event_type: "web-vitals",
      session_id: sessionId,
    });
  });
};

// GenerateId
const generateId = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  );
};

const setSessionId = () => {
  const sessionId = generateId();
  sessionStorage.setItem("OpenStatusSessionId", sessionId);
  return sessionId;
};

const getSessionId = () => {
  return sessionStorage.getItem("OpenStatusSessionId");
};
