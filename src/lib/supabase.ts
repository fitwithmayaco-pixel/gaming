import { createClient } from '@supabase/supabase-js';
import type { Product, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('http')
  );
};

// Create client with fallback dummy values if not yet configured to prevent initialization errors
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-domain-gta6.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'dummy-anon-key'
);

const LOCAL_STORAGE_KEY = 'gta6_store_products_v2';
const LOCAL_STORAGE_USER_KEY = 'gta6_mock_user';

// Local storage fallback for products
export const getLocalProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local products', e);
    return INITIAL_PRODUCTS;
  }
};

export const saveLocalProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving local products', e);
  }
};

// API Services
export const fetchProductsService = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) {
    return getLocalProducts();
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // If table is empty or error, fallback to initial local items
      const local = getLocalProducts();
      return local;
    }

    return data as Product[];
  } catch (err) {
    console.warn('Failed to fetch from Supabase, using local fallback:', err);
    return getLocalProducts();
  }
};

export const createProductService = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  if (!isSupabaseConfigured()) {
    const newProduct: Product = {
      ...productData,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const current = getLocalProducts();
    const updated = [newProduct, ...current];
    saveLocalProducts(updated);
    return newProduct;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
};

export const updateProductService = async (id: string, updates: Partial<Product>): Promise<Product> => {
  if (!isSupabaseConfigured()) {
    const current = getLocalProducts();
    const updated = current.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p);
    saveLocalProducts(updated);
    const item = updated.find(p => p.id === id);
    if (!item) throw new Error('Product not found');
    return item;
  }

  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
};

export const deleteProductService = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const current = getLocalProducts();
    const updated = current.filter(p => p.id !== id);
    saveLocalProducts(updated);
    return;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const uploadProductImage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured()) {
    // Return a base64 / blob object URL for demo mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `thumbnails/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    throw new Error(`Upload error: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// User Profile & Roles
export const getUserProfileService = async (userId: string): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) {
    try {
      const mockUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (mockUser) return JSON.parse(mockUser);
    } catch {
      return null;
    }
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
};
