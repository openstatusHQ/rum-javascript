import { type ReactNode, createContext } from "react";

const OpenStatusContext = createContext(null);

export const OpenStatusProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
