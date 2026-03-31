'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Space, Drawer, Dropdown, Avatar, Spin } from 'antd';
import {
    ShoppingCartOutlined,
    UserOutlined,
    MenuOutlined,
    LogoutOutlined,
    SettingOutlined,
    EditOutlined,
    StarOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    GlobalOutlined,
    LoginOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation'; // ✅

const { Header: AntHeader } = Layout;

const Header = () => {
    const pathname = usePathname();
    const { isLoading, user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const menuItems = [
        { key: '/', label: <Link href="/">Home</Link> },
        { key: '/products', label: <Link href="/products">Products</Link> },
    ];

    const userMenuItemsBeforeLogin = [
        {
            key: 'login',
            label: <Link href="/login">Login</Link>,
            danger: false,
            icon: <Link href="/login"><LoginOutlined /></Link>,
        },
    ];

    const userMenuItemsAfterLogin = [
        { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
        { key: 'edit-profile', label: 'Edit Profile', icon: <EditOutlined /> },
        { key: 'review', label: 'Review', icon: <StarOutlined /> },
        { key: 'terms', label: 'Terms, Policies and Licenses', icon: <FileTextOutlined /> },
        { key: 'faq', label: 'Browse FAQs', icon: <QuestionCircleOutlined /> },
        { key: 'languages', label: 'Languages', icon: <GlobalOutlined /> },
        { type: 'divider' as const },
        { key: 'logout', label: 'Logout', onClick: logout, danger: true, icon: <LogoutOutlined /> },
    ];

    return (
        <AntHeader
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: 'var(--ant-color-bg-container)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button
                    className="mobile-menu-btn"
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setMobileMenuOpen(true)}
                    style={{ display: 'none', marginRight: '8px' }}
                />

                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'inherit', marginRight: '24px' }}>
                    Markkam
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'none' }}>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={[pathname]}
                        items={menuItems}
                        style={{ minWidth: 400, borderBottom: 'none', background: 'transparent' }}
                    />
                </div>
            </div>

            {/* Actions */}
            <Space size="middle">
                <ThemeToggle />
                <Link href="/cart">
                    <Badge count={getCartCount()} showZero>
                        <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />} />
                    </Badge>
                </Link>
                {user ? (
                    <Dropdown menu={{ items: userMenuItemsAfterLogin }} trigger={['click']}>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}>
                                {user.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
                            </Avatar>
                        </Space>
                    </Dropdown>
                ) : (
                    <Dropdown menu={{ items: userMenuItemsBeforeLogin }} trigger={['click']}>
                        <a onClick={e => e.preventDefault()}>
                            <Button type="primary" icon={<UserOutlined />} />
                        </a>
                    </Dropdown>
                )}
            </Space>

            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                size={200}
                closable={false}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ borderRight: 'none' }}
                />
            </Drawer>

            <style jsx global>{`
        @media (min-width: 768px) {
          .desktop-menu { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
           .desktop-menu { display: none !important; }
           .mobile-menu-btn { display: block !important; }
        }
      `}</style>
        </AntHeader>
    );
};

export default Header;
