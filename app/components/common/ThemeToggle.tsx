'use client';

import React from 'react';
import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '@/context/ThemeContext';
const ThemeToggle: React.FC = () => {
    const { currentTheme, toggleTheme } = useTheme();

    return (
        <Switch
            checked={currentTheme === 'dark'}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            aria-label="Toggle Theme"
        />
    );
};

export default ThemeToggle;
