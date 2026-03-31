import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
    token: {
        fontSize: 16,
        colorPrimary: '#1677ff',
        borderRadius: 6,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
        Button: {
            fontWeight: 500,
        },
    },
};

export default themeConfig;
