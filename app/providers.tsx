"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

// Using React.FC specifically handles the children prop expectation
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <SessionProvider children={children} />;
};

export default Providers;