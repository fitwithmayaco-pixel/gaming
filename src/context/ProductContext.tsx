import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { Product, ProductCategory } from '../types';
import {
  fetchProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  selectedCategory: ProductCategory;
  searchQuery: string;
  setSelectedCategory: (cat: ProductCategory) => void;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  featuredProducts: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const items = await fetchProductsService();
      setProducts(items);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
    const created = await createProductService(productData);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await updateProductService(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProduct = async (id: string) => {
    await deleteProductService(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      // Search filter
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.is_featured);
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        selectedCategory,
        searchQuery,
        setSelectedCategory,
        setSearchQuery,
        filteredProducts,
        featuredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
