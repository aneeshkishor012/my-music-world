'use client';

import React, { Suspense } from 'react';
import LoginForm from '@/ui/login-form';
import { Card, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LoginPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            background: 'var(--ant-color-bg-layout)'
        }}>
            <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        background: '#1890ff',
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        marginBottom: 24
                    }}>
                        <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ShoppingOutlined style={{ fontSize: 40 }} />
                            <span style={{ fontSize: 32, fontWeight: 'bold' }}>Markkam</span>
                        </div>
                    </div>
                </div>
                <Suspense fallback={<div>Loading form...</div>}>
                    <LoginForm />
                </Suspense>
            </Card>
        </div>
    );
}