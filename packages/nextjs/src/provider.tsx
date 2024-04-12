"use client";

import { reportWebVitals } from "./vitals";

export const OpenStatusProvider = ({ endpoint }: { endpoint?: string }) => {
  reportWebVitals({ endpoint });
  return <></>;
};
