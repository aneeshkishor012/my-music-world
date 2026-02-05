"use client";

import { PropsWithChildren } from "react";
import MobileUIWrapper from "./MobileUIWrapper";

export default function MobileUIWrapperClient({ children }: PropsWithChildren) {
    return <MobileUIWrapper>{children}</MobileUIWrapper>;
}
