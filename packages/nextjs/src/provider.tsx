"use client";

import { usePathname } from "next/navigation";
import { reportWebVitals } from "./vitals";

export const OpenStatusProvider = ({
  endpoint,
  dsn,
}: {
  endpoint?: string;
  dsn: string;
}) => {
  const pathName = usePathname();
  reportWebVitals({ endpoint, dsn, path: pathName });
  return <></>;
};
