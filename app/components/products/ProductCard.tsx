'use client';

import React from 'react';
import { Card, Button, Typography, Rate, Tag, Grid } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/definitions';

const { Meta } = Card;
const { Text, Title } = Typography;

interface ProductCardProps {
    product: Product;
}

const { useBreakpoint } = Grid;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();
    const screens = useBreakpoint();
    const isMobile = !screens.sm; // xs only

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    // Explicitly handle hydration mismatch for useBreakpoint
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Default to desktop styles if not mounted to prevent hydration errors, or handle gracefully
    // Using isMobile calculation only after mount or ensuring default renders don't break layout
    const mobileView = mounted && isMobile;

    const discountedPrice = product.discount_percent ? product.price * (1 - product.discount_percent / 100) : product.price;

    return (
        <Card
            hoverable
            onClick={handleCardClick}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: mobileView ? 8 : 24 } }}
            cover={
                <div style={{ position: 'relative', height: mobileView ? 120 : 200, overflow: 'hidden' }}>
                    <Image
                        alt={product.name}
                        src={product.image_url}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.discount_percent > 0 && (
                        <Tag color="red" style={{ position: 'absolute', top: mobileView ? 4 : 10, left: mobileView ? 4 : 10, fontSize: mobileView ? 10 : 12, padding: mobileView ? '0 4px' : 'auto' }}>
                            -{product.discount_percent}%
                        </Tag>
                    )}
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ShoppingCartOutlined style={{ fontSize: mobileView ? 14 : 16 }} />}
                        style={{
                            position: 'absolute',
                            top: mobileView ? 4 : 10,
                            right: mobileView ? 4 : 10,
                            width: mobileView ? 28 : 32,
                            height: mobileView ? 28 : 32,
                            minWidth: mobileView ? 28 : 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart logic here (currently just UI)
                            // console.log('Add to cart')
                        }}
                    />
                </div>
            }
        >
            <Meta
                title={
                    <Link href={`/products/${product.id}`} style={{ color: 'inherit', fontSize: mobileView ? 13 : 16, whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.2, height: mobileView ? '2.4em' : 'auto' }}>
                        {product.name}
                    </Link>
                }
                description={
                    <div>
                        {!mobileView && <Text type="secondary" ellipsis>{product.category_name || product.category_id}</Text>}
                        <div style={{ marginTop: mobileView ? 4 : 8, display: 'flex', alignItems: 'center' }}>
                            {mobileView ? (
                                <>
                                    <StarFilled style={{ color: '#fadb14', fontSize: 12, marginRight: 4 }} />
                                    <Text type="secondary" style={{ fontSize: 11 }}>{product.rating}</Text>
                                </>
                            ) : (
                                <>
                                    <Rate disabled defaultValue={product.rating} allowHalf style={{ fontSize: 12 }} />
                                    <Text type="secondary" style={{ marginLeft: 8 }}>({product.rating})</Text>
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: mobileView ? 8 : 12, display: 'flex', flexDirection: mobileView ? 'column' : 'row', alignItems: mobileView ? 'flex-start' : 'baseline', gap: mobileView ? 0 : 8 }}>
                            <Title level={mobileView ? 5 : 4} style={{ margin: 0, fontSize: mobileView ? 14 : undefined }}>₹{discountedPrice.toFixed(2)}</Title>
                            {product.discountDetails && <Text delete type="secondary" style={{ fontSize: mobileView ? 11 : undefined }}>₹{product.price}</Text>}
                        </div>
                    </div>
                }
            />
        </Card>
    );
};

export default ProductCard;
