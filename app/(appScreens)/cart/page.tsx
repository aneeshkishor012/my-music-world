'use client';

import React from 'react';
import { Typography, Row, Col, Card, List, Button, InputNumber, Divider, Empty, Avatar, Steps } from 'antd';
import { DeleteOutlined, CreditCardOutlined, ShoppingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const total = getCartTotal();

    const handleCheckout = () => {
        if (!user) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Empty description="Your cart is empty" />
                <Link href="/products" style={{ marginTop: 24, display: 'inline-block' }}>
                    <Button type="primary" size="large">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Title level={2} style={{ marginBottom: 32 }}>Shopping Cart</Title>

            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <Card>
                        <List
                            itemLayout="horizontal"
                            dataSource={cartItems}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="delete"
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeFromCart(item.product.id)}
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{ width: 80, height: 80, position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                                                {/* Using img for simplicity in list, or next/image */}
                                                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        }
                                        title={<Link href={`/products/${item.product.id}`}>{item.product.name}</Link>}
                                        description={
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                <Text type="secondary">{item.product.category}</Text>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                                                    <Text strong>₹{item.product.price.toFixed(2)}</Text>
                                                    <InputNumber
                                                        min={1}
                                                        max={10}
                                                        value={item.quantity}
                                                        onChange={(val) => updateQuantity(item.product.id, val || 1)}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    />
                                    <div style={{ minWidth: 80, textAlign: 'right' }}>
                                        <Text strong style={{ fontSize: 16 }}>
                                            ₹{(item.product.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Order Summary">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text>Subtotal</Text>
                            <Text strong>₹{total.toFixed(2)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text>Shipping</Text>
                            <Text strong>Free</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text>Tax (Estimated)</Text>
                            <Text strong>₹{(total * 0.08).toFixed(2)}</Text>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <Title level={4}>Total</Title>
                            <Title level={4}>₹{(total * 1.08).toFixed(2)}</Title>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<CreditCardOutlined />}
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;
