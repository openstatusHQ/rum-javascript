import type { NextWebVitalsMetric } from "next/app";
import { useReportWebVitals } from "next/web-vitals";

export type WebVitalsMetric = NextWebVitalsMetric[] & {
  dsn: string;
  path: string;
  href: string;
  speed: string;
  screen: string;
};

let queue: WebVitalsMetric[] = [];
let ingestEndpoint = "https://vitals.openstat.us";

export const collectMetrics = (metric: WebVitalsMetric) => {
  queue.push(metric);
  sendMetrics();
  queue = [];
};

const sendMetrics = () => {
  const body = JSON.stringify([...queue]);
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

export const reportWebVitals = ({ endpoint, dsn, path }: { endpoint?: string, dsn: string, path: string }) => {
  if (typeof window === "undefined" || !window) {
    return;
  }
  if (endpoint) {
    ingestEndpoint = endpoint;
  }

  const href = window.location.href;

  const speed = getConnectionSpeed();

  const screen = `${window.screen.width}x${window.screen.height}`;
  useReportWebVitals((metric) => {
    collectMetrics({ ...metric, path, href, speed, dsn, screen })
  });

};
