"use client";

import { useState, type ReactNode } from "react";
import { ConfigProvider } from "antd";

const defaultTheme = {
  colorPrimary: "#101936",
  borderRadius: 6,
  Button: {
    colorPrimary: "#050b24",
  },
};

type ThemeProviderProps = {
  children?: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme] = useState(defaultTheme);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.colorPrimary,
          borderRadius: theme.borderRadius,
        },
        components: {
          Button: {
            colorPrimary: theme.Button.colorPrimary,
          },
          Dropdown: {
            colorBgElevated: "#0B1A33",
            colorText: "#ffffff",
          },
          Menu: {
            colorItemBgHover: "rgba(255,255,255,0.08)",
            colorItemText: "#ffffff",
            colorItemTextHover: "#ffffff"
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}