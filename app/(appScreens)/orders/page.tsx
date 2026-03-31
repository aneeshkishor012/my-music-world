'use client';

import React from 'react';
import { Table, Tag, Typography, Button } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const OrdersPage: React.FC = () => {
    // Mock orders
    const orders = [
        {
            key: '1',
            id: 'ORD-12345',
            date: '2023-05-20',
            total: 129.99,
            status: 'Delivered',
            items: 3
        },
        {
            key: '2',
            id: 'ORD-67890',
            date: '2023-06-15',
            total: 45.00,
            status: 'Processing',
            items: 1
        },
        {
            key: '3',
            id: 'ORD-54321',
            date: '2023-07-01',
            total: 299.50,
            status: 'Shipped',
            items: 2
        }
    ];

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Button type="link">{text}</Button>,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (price: number) => `₹${price.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'geekblue';
                if (status === 'Delivered') color = 'green';
                if (status === 'Processing') color = 'gold';
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button size="small">View Details</Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Title level={2}>My Orders</Title>
            <Table columns={columns} dataSource={orders} />

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Link href="/products">
                    <Button type="primary">Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
};

export default OrdersPage;
