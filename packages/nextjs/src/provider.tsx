"use client";

import { reportWebVitals } from "./vitals";

export const OpenStatusProvider = ({
  endpoint,
  dsn,
}: {
  endpoint?: string;
  dsn: string;
}) => {
  reportWebVitals({ endpoint, dsn });
  return <></>;
};
