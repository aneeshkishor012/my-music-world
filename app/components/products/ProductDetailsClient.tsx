'use client';

import React from 'react';
import { Row, Col, Typography, Button, Rate, Tag, Divider, InputNumber, Carousel, Spin } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/definitions';
import { useCart } from '@/context/CartContext';

const { Title, Text, Paragraph } = Typography;

const ProductDetailsClient: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [quantity, setQuantity] = React.useState(1);

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Title level={3}>Product not found</Title></div>;
    }

    const discountedPrice = product.discount_percent ? product.price * (1 - product.discount_percent / 100) : product.price;

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const imagesToDisplay = product.images && product.images.length > 0 ? product.images : [product.image_url];

    return (
        <div style={{ padding: '24px 0' }}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                style={{ marginBottom: 24 }}
            >
                Back to Products
            </Button>

            <Row gutter={[48, 48]}>
                <Col xs={24} md={12}>
                    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#f5f5f5', borderRadius: 8, overflow: 'hidden' }}>
                        <Carousel autoplay>
                            {imagesToDisplay.map((img, index) => (
                                <div key={index} style={{ position: 'relative', width: '100%', height: '500px' }}>
                                    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                                        <Image
                                            src={img}
                                            alt={`${product.name} - View ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                        {product.discount_percent > 0 && (
                            <Tag color="red" style={{ position: 'absolute', top: 20, left: 20, fontSize: 16, zIndex: 10, padding: '4px 8px' }}>
                                -{product.discount_percent}% OFF
                            </Tag>
                        )}
                    </div>
                </Col>
                <Col xs={24} md={12}>
                    <Typography>
                        <Title level={2}>{product.name}</Title>
                        <Text type="secondary" style={{ fontSize: 16 }}>Category: {product.category}</Text>

                        <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Rate disabled defaultValue={product.rating} allowHalf />
                            <Text>({product.rating} / 5.0)</Text>
                        </div>

                        <Divider />

                        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'baseline', gap: 16 }}>
                            <Title level={1} style={{ margin: 0, color: 'var(--ant-color-primary)' }}>
                                ₹{discountedPrice.toFixed(2)}
                            </Title>
                            {product.discountDetails && (
                                <Text delete style={{ fontSize: 20, color: '#999' }}>₹{product.price.toFixed(2)}</Text>
                            )}
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <Title level={5}>Description</Title>
                            <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                                {product.description}
                            </Paragraph>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <InputNumber
                                min={1}
                                max={10}
                                value={quantity}
                                onChange={(val) => setQuantity(val || 1)}
                                size="large"
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                style={{ padding: '0 48px' }}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </Typography>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailsClient;
