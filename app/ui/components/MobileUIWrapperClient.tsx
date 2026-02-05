"use client";

import { ReactNode } from "react";
import MobileUIWrapper from "./MobileUIWrapper";

export default function MobileUIWrapperClient({ children }: { children: ReactNode }) {
    return <MobileUIWrapper>{children}</MobileUIWrapper>;
}
