export interface Product {
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

export interface Category {
    id: string;
    name: string;
    description: string;
    image_url: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}