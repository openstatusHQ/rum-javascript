import type { NextWebVitalsMetric } from "next/app";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

export type WebVitalsMetric = NextWebVitalsMetric[] & {
  dsn: string;
  path: string;
  href: string;
  speed: string;
};

let queue: WebVitalsMetric[] = [];
let ingestEndpoint = "https://vitals.openstat.us/ingest";

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

export const reportWebVitals = ({ endpoint, dsn }: { endpoint?: string, dsn:string }) => {
  const pathName = usePathname();
  let href = "";
  if (endpoint) {
    ingestEndpoint = endpoint;
  }
  if (typeof window !== "undefined" && window?.location) {
    href = window.location.href;
  }
  const speed = getConnectionSpeed();

  useReportWebVitals((metric) =>
    collectMetrics({ ...metric, path: pathName, href, speed, dsn }),
  );
};
