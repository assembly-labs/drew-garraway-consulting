import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';
import { getProductById } from '../data/products';
import type { Vendor } from '../data/vendors';
import { getVendorById } from '../data/vendors';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemWithDetails extends CartItem {
  product: Product;
  vendor: Vendor;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemsWithDetails: () => CartItemWithDetails[];
  getItemCount: () => number;
  getSubtotal: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gather_cart';
const SERVICE_FEE_PERCENT = 0.05; // 5%
const MIN_SERVICE_FEE = 2.00;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemsWithDetails = (): CartItemWithDetails[] => {
    return items
      .map(item => {
        const product = getProductById(item.productId);
        if (!product) return null;
        const vendor = getVendorById(product.vendorId);
        if (!vendor) return null;
        return { ...item, product, vendor };
      })
      .filter((item): item is CartItemWithDetails => item !== null);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return getItemsWithDetails().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getServiceFee = () => {
    const subtotal = getSubtotal();
    const calculatedFee = subtotal * SERVICE_FEE_PERCENT;
    return Math.max(calculatedFee, MIN_SERVICE_FEE);
  };

  const getTotal = () => {
    return getSubtotal() + getServiceFee();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemsWithDetails,
        getItemCount,
        getSubtotal,
        getServiceFee,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
