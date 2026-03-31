'use client';

import React from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    UserOutlined,
    OrderedListOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        { key: '/admin', icon: <DashboardOutlined />, label: <Link href="/admin">Dashboard</Link> },
        { key: '/admin/categories', icon: <AppstoreOutlined />, label: <Link href="/admin/categories">Categories</Link> },
        { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link href="/admin/products">Products</Link> },
        { key: '/admin/users', icon: <UserOutlined />, label: <Link href="/admin/users">Users</Link> },
        { key: '/admin/orders', icon: <OrderedListOutlined />, label: <Link href="/admin/orders">Orders</Link> },
    ];

    const lastSegment = pathname.split('/').pop() || 'Dashboard';
    const pageTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

    return (
        <Layout style={{ minHeight: 'calc(100vh - 64px - 70px)' }}> {/* Subtract Header/Footer height approx */}
            <Sider width={200} style={{ background: colorBgContainer }} breakpoint="lg" collapsedWidth="0">
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menuItems}
                />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Admin' }, { title: pageTitle }]} />
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
