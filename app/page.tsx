'use client';

import { Button, Typography, Row, Col, Card, Spin } from 'antd';
import { ArrowRightOutlined, RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/definitions';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=8');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, var(--ant-color-primary-bg) 0%, var(--ant-color-bg-container) 100%)',
        borderRadius: 12,
        marginBottom: 48
      }}>
        <Title level={1}>Welcome to Markkam</Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 24px' }}>
          Discover premium products at unbeatable prices. Shop the latest trends in electronics, fashion, and home decor.
        </Paragraph>
        <Link href="/products">
          <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col xs={24} md={8}>
          <Card variant={'borderless'} style={{ textAlign: 'center' }}>
            <RocketOutlined style={{ fontSize: 32, color: 'var(--ant-color-primary)', marginBottom: 16 }} />
            <Title level={4}>Fast Delivery</Title>
            <Text type="secondary">Free shipping on all orders over ₹50</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant={'borderless'} style={{ textAlign: 'center' }}>
            <SafetyCertificateOutlined style={{ fontSize: 32, color: 'var(--ant-color-primary)', marginBottom: 16 }} />
            <Title level={4}>Secure Payment</Title>
            <Text type="secondary">100% secure payment processing</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant={'borderless'} style={{ textAlign: 'center' }}>
            <CustomerServiceOutlined style={{ fontSize: 32, color: 'var(--ant-color-primary)', marginBottom: 16 }} />
            <Title level={4}>24/7 Support</Title>
            <Text type="secondary">Dedicated support team to help you</Text>
          </Card>
        </Col>
      </Row>

      {/* Featured Products */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <Title level={2}>Featured Products</Title>
          <Link href="/products">See All</Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </section>
    </>
  );
}
