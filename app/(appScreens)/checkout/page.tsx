'use client';

import React from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, Radio, Steps, message, Divider } from 'antd';
import { CreditCardOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = React.useState(0);
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems, router]);

    const total = getCartTotal();

    const onFinish = async (values: any) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success('Order placed successfully!');
            clearCart();
            router.push('/orders'); // Or success page
        }, 2000);
    };

    const nextStep = () => {
        form.validateFields().then(() => {
            setCurrentStep(currentStep + 1);
        });
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Checkout</Title>

            <Steps current={currentStep} items={[{ title: 'Shipping' }, { title: 'Payment' }, { title: 'Review' }]} style={{ marginBottom: 48 }} />

            <Form form={form} layout="vertical" onFinish={onFinish}>

                {/* Step 1: Shipping */}
                <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                    <Card title="Shipping Address">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                            <Input prefix={<HomeOutlined />} />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="state" label="State" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="zip" label="Zip Code" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" onClick={nextStep} block size="large">
                            Continue to Payment
                        </Button>
                    </Card>
                </div>

                {/* Step 2: Payment */}
                <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                    <Card title="Payment Method">
                        <Form.Item name="paymentMethod" initialValue="card">
                            <Radio.Group>
                                <Radio value="card">Credit/Debit Card</Radio>
                                <Radio value="paypal">PayPal</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8 }}>
                            <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true }]}>
                                <Input prefix={<CreditCardOutlined />} placeholder="0000 0000 0000 0000" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="expiry" label="Expiry Date" rules={[{ required: true }]}>
                                        <Input placeholder="MM/YY" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="cvc" label="CVC" rules={[{ required: true }]}>
                                        <Input placeholder="123" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                            <Button onClick={prevStep} size="large">Back</Button>
                            <Button type="primary" onClick={nextStep} block size="large">Review Order</Button>
                        </div>
                    </Card>
                </div>

                {/* Step 3: Review */}
                <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                    <Card title="Order Review">
                        <div style={{ marginBottom: 24 }}>
                            <Text strong>Items ({cartItems.length})</Text>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <Text>{item.product.name} x {item.quantity}</Text>
                                    <Text>₹{(item.product.price * item.quantity).toFixed(2)}</Text>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>Subtotal</Text>
                            <Text>₹{total.toFixed(2)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>Tax</Text>
                            <Text>₹{(total * 0.08).toFixed(2)}</Text>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <Title level={4}>Order Total</Title>
                            <Title level={4}>₹{(total * 1.08).toFixed(2)}</Title>
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                            <Button onClick={prevStep} size="large">Back</Button>
                            <Button type="primary" htmlType="submit" block size="large" loading={loading} icon={<CheckCircleOutlined />}>Place Order</Button>
                        </div>
                    </Card>
                </div>

            </Form>
        </div>
    );
};

export default CheckoutPage;
