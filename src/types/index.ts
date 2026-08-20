export interface ProductSpec {
  scale: string;
  bodyMaterial: string;
  chassisMaterial: string;
  wheels: string;
  series: string;
  editionType: 'RLC Exclusive' | 'Super Treasure Hunt' | 'Car Culture' | 'Boulevard' | 'Team Transport' | 'Retro Entertainment' | 'Japan Import' | 'Convention Exclusive';
  year: number;
  countryOfOrigin: string;
  packaging: 'Mint on Card (MOC)' | 'Protector Case Included' | 'Factory Sealed Set' | 'Loose Collector Grade';
  itemNumber: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  userCity: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  helpfulVotes: number;
  pros?: string[];
  cons?: string[];
  cardConditionRating?: number; // 1-10
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  brand: string; // e.g. Nissan, Porsche, Ferrari, Lamborghini, Datsun, Ford, Mazda
  series: string;
  category: 'new-arrivals' | 'best-sellers' | 'limited-edition' | 'premium' | 'offers';
  price: number;
  originalPrice: number;
  discountPercent?: number;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  specs: ProductSpec;
  features: string[];
  tags: string[];
  isNew?: boolean;
  isLimited?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
  freeShipping?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  withProtectorCase?: boolean;
}

export type OrderStatus = 
  | 'order_placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface TimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  location?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  method: 'upi' | 'card' | 'netbanking' | 'cod';
  status: 'paid' | 'pending';
  transactionId?: string;
  upiApp?: string;
  upiId?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  payment: PaymentDetails;
  pricing: OrderPricing;
  couponApplied?: string;
  status: OrderStatus;
  timeline: TimelineStep[];
  carrier: {
    name: string;
    trackingUrl: string;
    estimatedDelivery: string;
    dispatchLocation: string;
  };
  createdAt: string;
}

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD (1.0)
}
