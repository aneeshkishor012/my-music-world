'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Typography, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { TextArea } = Input;

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount_percent: number;
    rating: number;
    image_url: string;
    images: string[];
    category_id: string;
    category_name?: string;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Category {
    id: string;
    name: string;
}

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                message.error('Failed to fetch products');
            }
        } catch (error) {
            message.error('Error fetching products');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            message.error('Error fetching categories');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchProducts(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('Product deleted successfully');
                fetchProducts();
            } else {
                message.error('Failed to delete product');
            }
        } catch (error) {
            message.error('Error deleting product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            ...product,
            images: product.images?.join('\n') || '',
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const productData = {
                ...values,
                images: values.images ? values.images.split('\n').filter((url: string) => url.trim()) : [],
            };

            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                message.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
                setIsModalOpen(false);
                fetchProducts();
            } else {
                message.error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
            }
        } catch (error) {
            message.error('Validation failed');
        }
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (src: string) => src ? <img src={src} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : null,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `₹${price.toFixed(2)}`,
        },
        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => <Switch checked={is_active} disabled />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Delete the product"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const categoryOptions = categories.map(cat => ({
        label: cat.name,
        value: cat.id,
    }));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Products</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Product
                </Button>
            </div>

            <Table columns={columns} dataSource={products} rowKey="id" loading={loading} />

            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="id" label="Product ID" rules={[{ required: true }]}>
                        <Input disabled={!!editingProduct} />
                    </Form.Item>
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
                        <Select options={categoryOptions} />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber min={0} prefix="₹" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="discount_percent" label="Discount Percent">
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="rating" label="Rating">
                        <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="image_url" label="Main Image URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name="images" label="Additional Images (one URL per line)">
                        <TextArea rows={4} placeholder="Enter image URLs, one per line" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="is_active" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductsPage;
