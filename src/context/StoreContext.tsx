import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Review, CartItem, Order, OrderStatus, Currency, TimelineStep } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_SAMPLE_ORDERS, CURRENCY_CONFIGS, POPULAR_COUPONS } from '../data/products';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentOrder: Order | null;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  getConvertedPrice: (amountInUSD: number) => number;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, withProtector?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleProtectorCase: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Reviews
  addReview: (newReview: Omit<Review, 'id' | 'date' | 'helpfulVotes'>) => void;
  getProductReviews: (productId: string) => Review[];
  voteHelpful: (reviewId: string) => void;
  
  // Orders & Checkout
  createOrder: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'timeline' | 'status' | 'createdAt' | 'carrier'>) => Order;
  advanceOrderStatus: (orderId: string) => void;
  getOrderByIdOrTracking: (query: string) => Order | undefined;
  setCurrentOrder: (order: Order | null) => void;
  
  // Navigation & Modals
  activePage: string;
  setActivePage: (page: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Coupon
  appliedCoupon: { code: string; discountPercent?: number; discountAmount?: number; description: string } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Toast
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'apex_diecast_cart_v1',
  WISHLIST: 'apex_diecast_wishlist_v1',
  ORDERS: 'apex_diecast_orders_v1',
  REVIEWS: 'apex_diecast_reviews_v1',
  CURRENCY: 'apex_diecast_curr_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ['hw-r34-nismo', 'hw-datsun-510-sth'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return (saved as Currency) || 'USD';
  });

  const [activePage, setActivePage] = useState<string>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    description: string;
  } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPrice = (amountInUSD: number): string => {
    const conf = CURRENCY_CONFIGS[currency];
    const converted = amountInUSD * conf.rate;
    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency === 'EUR') {
      return `€${converted.toFixed(2)}`;
    }
    if (currency === 'GBP') {
      return `£${converted.toFixed(2)}`;
    }
    return `$${converted.toFixed(2)}`;
  };

  const getConvertedPrice = (amountInUSD: number): number => {
    const conf = CURRENCY_CONFIGS[currency];
    return Number((amountInUSD * conf.rate).toFixed(2));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, withProtector = false) => {
    if (!product.inStock || product.stock <= 0) {
      showToast('Out of Stock', `${product.name} is currently out of stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newQty = Math.min(product.stock, prev[existingIndex].quantity + quantity);
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          withProtectorCase: withProtector || updated[existingIndex].withProtectorCase,
        };
        showToast('Cart Updated', `Updated quantity for ${product.name}`, 'info');
        return updated;
      } else {
        showToast('Added to Cart', `${product.name} has been added to your collector cart!`, 'success');
        return [...prev, { product, quantity: Math.min(quantity, product.stock), withProtectorCase: withProtector }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const toggleProtectorCase = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, withProtectorCase: !item.withProtectorCase }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemBase = item.product.price * item.quantity;
    const protectorAddon = item.withProtectorCase ? 3.50 * item.quantity : 0;
    return sum + itemBase + protectorAddon;
  }, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Wishlist', 'Item removed from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Wishlist', 'Item saved to your collector wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Reviews
  const addReview = (newReviewData: Omit<Review, 'id' | 'date' | 'helpfulVotes'>) => {
    const review: Review = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulVotes: 1,
    };
    setReviews((prev) => [review, ...prev]);

    // Update product rating and count
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === newReviewData.productId) {
          const newCount = prod.reviewCount + 1;
          const newRating = Number(
            (((prod.rating * prod.reviewCount) + newReviewData.rating) / newCount).toFixed(1)
          );
          return {
            ...prod,
            rating: newRating,
            reviewCount: newCount,
          };
        }
        return prod;
      })
    );

    showToast('Review Submitted', 'Thank you for rating this collectible! Your review is now live.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const voteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
    showToast('Feedback Received', 'Marked review as helpful', 'info');
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = POPULAR_COUPONS.find((c) => c.code === cleanCode);
    if (found) {
      setAppliedCoupon(found);
      showToast('Coupon Applied', `Code "${found.code}" applied: ${found.description}`, 'success');
      return { success: true, message: `Coupon applied: ${found.description}` };
    }
    showToast('Invalid Coupon', 'The coupon code entered is invalid or expired.', 'error');
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount removed', 'info');
  };

  // Orders
  const createOrder = (
    orderData: Omit<Order, 'id' | 'trackingNumber' | 'timeline' | 'status' | 'createdAt' | 'carrier'>
  ): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomDigits}`;
    const trackingNumber = `APD-EXP-${randomDigits}${Math.floor(10 + Math.random() * 90)}IN`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const timeline: TimelineStep[] = [
      {
        status: 'order_placed',
        title: 'Order Placed & Verified',
        description: 'Order placed securely and collector serial verified against vault stock.',
        timestamp: formattedDate,
        completed: true,
        current: false,
        location: 'ApexDiecast Central Logistics',
      },
      {
        status: 'confirmed',
        title: 'Payment & Customs Clearance',
        description: `Payment authenticated via ${orderData.payment.method.toUpperCase()}. Customs paperwork prepared.`,
        timestamp: formattedDate,
        completed: true,
        current: true,
        location: 'Import Gateway Vault',
      },
      {
        status: 'packed',
        title: 'Card & Blister Hardcase Packaging',
        description: 'Placed inside rigid UV acrylic protector cases with anti-crush air cushions.',
        timestamp: 'Estimated Next 6 Hours',
        completed: false,
        location: 'Packaging Station B4',
      },
      {
        status: 'shipped',
        title: 'Dispatched via Air Courier',
        description: 'Handed over to BlueDart / DHL Global Priority Express.',
        timestamp: 'Estimated Tomorrow',
        completed: false,
        location: 'Air Cargo Transfer Hub',
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier agent en route to your delivery location.',
        timestamp: 'Pending Dispatch',
        completed: false,
        location: `${orderData.customer.city} Distribution Center`,
      },
      {
        status: 'delivered',
        title: 'Collector Delivery Complete',
        description: 'Delivered in mint unopened condition with signed proof of delivery.',
        timestamp: 'Pending Delivery',
        completed: false,
        location: `${orderData.customer.address}, ${orderData.customer.city}`,
      },
    ];

    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 3);
    const formattedEstDelivery = estDeliveryDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' (Express 3-Day Air)';

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber,
      status: 'confirmed',
      timeline,
      carrier: {
        name: 'BlueDart Air Express / DHL International',
        trackingUrl: `https://track.apexcollector.com/${trackingNumber}`,
        estimatedDelivery: formattedEstDelivery,
        dispatchLocation: 'Singapore International Air Hub',
      },
      createdAt: now.toISOString(),
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = orderData.items.find((item) => item.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          return {
            ...prod,
            stock: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    const statuses: OrderStatus[] = [
      'order_placed',
      'confirmed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentIndex = statuses.indexOf(ord.status);
          if (currentIndex < statuses.length - 1) {
            const nextStatus = statuses[currentIndex + 1];
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' +
              now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const updatedTimeline = ord.timeline.map((step, idx) => {
              if (idx <= currentIndex + 1) {
                return {
                  ...step,
                  completed: true,
                  current: idx === currentIndex + 1,
                  timestamp: step.timestamp.includes('Estimated') || step.timestamp.includes('Pending')
                    ? timeStr
                    : step.timestamp,
                };
              }
              return { ...step, completed: false, current: false };
            });

            const updatedOrder = {
              ...ord,
              status: nextStatus,
              timeline: updatedTimeline,
            };

            if (currentOrder && currentOrder.id === orderId) {
              setCurrentOrder(updatedOrder);
            }

            showToast(
              'Tracking Updated',
              `Order ${ord.id} status is now: ${nextStatus.replace(/_/g, ' ').toUpperCase()}`,
              'info'
            );

            return updatedOrder;
          }
        }
        return ord;
      })
    );
  };

  const getOrderByIdOrTracking = (query: string): Order | undefined => {
    const clean = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.trackingNumber.toUpperCase() === clean ||
        o.customer.email.toLowerCase() === query.trim().toLowerCase() ||
        o.customer.mobile.replace(/\s+/g, '').includes(clean.replace(/\s+/g, ''))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        reviews,
        cart,
        wishlist,
        orders,
        currentOrder,
        currency,
        setCurrency,
        formatPrice,
        getConvertedPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleProtectorCase,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        addReview,
        getProductReviews,
        voteHelpful,
        createOrder,
        advanceOrderStatus,
        getOrderByIdOrTracking,
        setCurrentOrder,
        activePage,
        setActivePage,
        activeCategory,
        setActiveCategory,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
