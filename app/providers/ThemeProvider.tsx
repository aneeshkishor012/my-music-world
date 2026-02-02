"use client";

import React, { useState } from "react";
import { ConfigProvider } from "antd";

const defaultTheme = {
    colorPrimary: "#101936",
    borderRadius: 6,
    Button: {
        colorPrimary: "#050b24",
    },
};

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(defaultTheme);

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
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
