'use client';

import React from 'react';
import { Layout, Typography, Row, Col, Space, theme } from 'antd';
import {
    GithubOutlined,
    TwitterOutlined,
    LinkedinOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link, Title } = Typography;

const Footer: React.FC = () => {
    const { token } = theme.useToken();

    const contactLinks = [
        { key: 'github', icon: <GithubOutlined />, link: 'https://github.com' },
        { key: 'twitter', icon: <TwitterOutlined />, link: 'https://twitter.com' },
        { key: 'linkedin', icon: <LinkedinOutlined />, link: 'https://linkedin.com' },
    ];

    const footerLinks = [
        { key: 'about', title: 'About Us', link: '/about' },
        { key: 'contact', title: 'Contact', link: '/contact' },
        { key: 'terms', title: 'Terms of Service', link: '/terms' },
    ];

    return (
        <AntFooter
            style={{
                background: token.colorBgContainer,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                padding: '48px 24px',
            }}
        >
            <Row gutter={[32, 32]} justify="center">
                {/* Brand */}
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ marginBottom: 8, color: token.colorTextSecondary }}>
                        Markkam
                    </Title>
                    <Text type="secondary" style={{ color: token.colorTextSecondary }}>Premium E-commerce Experience</Text>
                </Col>

                {/* Links */}
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Space direction="vertical">
                        {footerLinks.map((item) => (
                            <Link
                                key={item.key}
                                href={item.link}
                                style={{ color: token.colorTextSecondary }}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </Space>
                </Col>

                {/* Social Icons */}
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                    <Space size="large">
                        {contactLinks.map((item) => (
                            <Link
                                key={item.key}
                                href={item.link}
                                target="_blank"
                                style={{ fontSize: 26, color: token.colorTextSecondary }}
                            >
                                {item.icon}
                            </Link>
                        ))}
                    </Space>
                </Col>
            </Row>

            {/* Bottom */}
            <div
                style={{
                    marginTop: 32,
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                    paddingTop: 16,
                    textAlign: 'center',
                }}
            >
                <Text type="secondary" style={{ fontSize: 14, color: token.colorTextSecondary }}>
                    © {new Date().getFullYear()} Markkam. All rights reserved.
                </Text>
            </div>
        </AntFooter>
    );
};

export default Footer;
