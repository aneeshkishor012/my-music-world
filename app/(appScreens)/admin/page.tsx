'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <Title level={2}>Dashboard</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card variant={'borderless'}>
                        <Statistic
                            title="Total Sales"
                            value={112893}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant={'borderless'}>
                        <Statistic
                            title="Active Orders"
                            value={93}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant={'borderless'}>
                        <Statistic
                            title="New Users"
                            value={54}
                            prefix={<UserOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <Card title="Recent Activity">
                    <p>User #234 placed an order for ₹120.00</p>
                    <p>User #235 registered</p>
                    <p>Product "Wireless Headphones" stock low</p>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
