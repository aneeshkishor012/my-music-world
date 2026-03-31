'use client';

import React from 'react';
import { Row, Col, Typography, Input, Select, Space, Breadcrumb, Grid, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/lib/definitions';

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const ProductsPage: React.FC = () => {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
    const [sortOrder, setSortOrder] = React.useState<string>('default');

    // Explicitly handle hydration mismatch for useBreakpoint
    const [mounted, setMounted] = React.useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.sm && mounted; // xs only logic requiring mount

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData);
                }

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category_id === categoryFilter : true;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortOrder === 'price_asc') return a.price - b.price;
        if (sortOrder === 'price_desc') return b.price - a.price;
        return 0;
    });

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            {!isMobile && (
                <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Products' }]} style={{ marginBottom: 24 }} />
            )}

            <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>All Products</Title>

                <Space wrap>
                    <Search
                        id="product-search-input"
                        placeholder="Search products..."
                        allowClear
                        onSearch={value => setSearchTerm(value)}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Select
                        id="category-select"
                        placeholder="Category"
                        style={{ width: 150 }}
                        allowClear
                        onChange={val => setCategoryFilter(val)}
                        options={categories.map(c => ({ label: c.name, value: c.id }))}
                    />
                    <Select
                        id="sort-select"
                        defaultValue="default"
                        style={{ width: 150 }}
                        onChange={val => setSortOrder(val)}
                        options={[
                            { label: 'Sort by', value: 'default' },
                            { label: 'Price: Low to High', value: 'price_asc' },
                            { label: 'Price: High to Low', value: 'price_desc' },
                        ]}
                    />
                </Space>
            </div>

            <div style={{ flex: 1 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Typography.Text type="secondary">No products found.</Typography.Text>
                    </div>
                ) : (
                    <Row gutter={isMobile ? [8, 8] : [24, 24]}>
                        {filteredProducts.map(product => (
                            <Col xs={8} sm={12} md={8} lg={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
