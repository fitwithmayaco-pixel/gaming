export type ProductCategory = 'ebook' | 'thumbnail' | 'sticker' | 'bundle' | 'all';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'ebook' | 'thumbnail' | 'sticker' | 'bundle';
  price: number;
  original_price?: number;
  image_url: string;
  preview_images?: string[];
  gumroad_url: string;
  badge?: string;
  features?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  rating?: number;
  sales_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}
