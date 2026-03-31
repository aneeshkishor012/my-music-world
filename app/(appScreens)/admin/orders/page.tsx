'use client';

import React from 'react';
import { Table, Tag, Typography, Select, Button, Space, message } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const AdminOrdersPage: React.FC = () => {
    // Mock Data
    const [orders, setOrders] = React.useState([
        { id: 'ORD-12345', customer: 'John Doe', total: 129.99, status: 'Processing', date: '2023-05-20' },
        { id: 'ORD-67890', customer: 'Jane Smith', total: 45.00, status: 'Shipped', date: '2023-06-15' },
        { id: 'ORD-54321', customer: 'Bob Johnson', total: 299.50, status: 'Delivered', date: '2023-07-01' },
    ]);

    const handleStatusChange = (id: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        message.success(`Order ${id} status updated to ${newStatus}`);
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (val: number) => `₹${val.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                >
                    <Option value="Processing">Processing</Option>
                    <Option value="Shipped">Shipped</Option>
                    <Option value="Delivered">Delivered</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            ),
        },
    ];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>Order Management</Title>
            <Table columns={columns} dataSource={orders} rowKey="id" />
        </div>
    );
};

export default AdminOrdersPage;
