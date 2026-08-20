import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    formatPrice, 
    appliedCoupon, 
    createOrder, 
    setActivePage, 
    showToast 
  } = useStore();

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Arjun Mehta',
    email: 'arjun.collector@apexmail.com',
    mobile: '+91 98450 12345',
    address: '42, Skyline Boulevard, Silicon Residency',
    landmark: 'Opposite Formula 1 Circuit',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    deliveryInstructions: 'Handle with extreme care, fragile mint card diecast packaging.',
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [upiId, setUpiId] = useState('arjun@okhdfcbank');
  
  // Card state
  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 8842',
    cardName: 'ARJUN MEHTA',
    expiry: '08/29',
    cvv: '984',
  });

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 50.0;
  const rawShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 9.99;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(cartSubtotal, appliedCoupon.discountAmount);
    }
  }

  const taxAmount = Number(((cartSubtotal - discountAmount) * 0.05).toFixed(2));
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + rawShipping + taxAmount);

  // Delivery estimation (3-5 business days from today)
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 3);
  const estDeliveryFormatted = estDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Cart is Empty', 'Please add products to cart before checkout', 'warning');
      setActivePage('shop');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.address || !formData.city || !formData.postalCode) {
      showToast('Missing Fields', 'Please fill in all required customer and shipping details', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: [...cart],
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'paid',
          transactionId: paymentMethod !== 'cod' ? `TXN-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
          upiApp: paymentMethod === 'upi' ? upiApp : undefined,
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          cardLast4: paymentMethod === 'card' ? '8842' : undefined,
          bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
        },
        pricing: {
          subtotal: cartSubtotal,
          shipping: rawShipping,
          discount: discountAmount,
          tax: taxAmount,
          total: finalTotal,
        },
        couponApplied: appliedCoupon?.code,
      });

      // Confetti burst!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E61919', '#ffffff', '#00FF66', '#FFB800'],
      });

      setIsSubmitting(false);
      showToast('Order Placed Successfully!', `Order #${order.id} has been registered. Tracking active.`, 'success');
      setActivePage('tracking');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#0F0F0F] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center text-[#E0E0E0]">
        <div className="w-14 h-14 rounded bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#888888] mb-4">
          <Truck className="w-6 h-6 text-[#E61919]" />
        </div>
        <h2 className="text-lg font-black uppercase text-white">Your cart is empty</h2>
        <p className="text-xs text-[#888888] max-w-sm mt-1 mb-6">
          Add authentic imported diecast and RLC exclusives to proceed with checkout.
        </p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-bold text-xs uppercase rounded transition-all"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F0F] py-8 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <span className="text-[#333333]">/</span>
          <span className="text-xs font-bold text-[#E61919] uppercase tracking-wider font-mono">
            Direct Collector Checkout
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Form (Customer Details + Shipping + Payment) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Details */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#E61919] text-white font-black text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-black italic uppercase tracking-tight text-white">
                      Customer Details
                    </h3>
                    <p className="text-[10px] text-[#888888]">Direct contact for dispatch notifications</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#00FF66] flex items-center gap-1 bg-[#111111] px-2 py-0.5 rounded border border-[#333333]">
                  <Lock className="w-3 h-3" /> SSL SECURE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Collector's Full Legal Name"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="collector@example.com"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address & Delivery */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#E61919] text-white font-black text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-black italic uppercase tracking-tight text-white">
                      Shipping Address & Delivery
                    </h3>
                    <p className="text-[10px] text-[#888888]">Rigid multi-box packaging with bubble reinforcement</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#E61919] text-[11px] font-mono font-bold bg-[#111111] px-2 py-0.5 rounded border border-[#333333]">
                  <Calendar className="w-3 h-3" />
                  <span>Est: {estDeliveryFormatted}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Street Address / Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 104, Horizon Heights, MG Road"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Grand Stand / Metro"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Postal / PIN Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 400050"
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 font-mono">
                    Destination Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61919]"
                  >
                    <option value="India">India (Express BlueDart / DTDC Air)</option>
                    <option value="United States">United States (USPS / DHL)</option>
                    <option value="United Kingdom">United Kingdom (Royal Mail / DHL)</option>
                    <option value="Germany">Germany (Deutsche Post / DHL)</option>
                    <option value="Japan">Japan (Japan Post / Sagawa)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options (UPI, Card, Net Banking, COD) */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded bg-[#E61919] text-white font-black text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-black italic uppercase tracking-tight text-white">
                      Payment Options
                    </h3>
                    <p className="text-[10px] text-[#888888]">Instant gateway verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#00FF66] text-[10px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>3D SECURE ENCRYPTED</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded border text-left flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#111111] border-[#E61919] text-white shadow-[0_0_10px_rgba(230,25,25,0.2)]'
                      : 'bg-[#0F0F0F] border-[#333333] text-[#888888] hover:border-[#666666] hover:text-white'
                  }`}
                >
                  <Smartphone className={`w-4 h-4 ${paymentMethod === 'upi' ? 'text-[#E61919]' : 'text-[#666666]'}`} />
                  <div>
                    <span className="text-xs font-bold uppercase block">UPI / QR</span>
                    <span className="text-[9px] text-[#888888] font-mono">GPay, PhonePe</span>
                  </div>
                </button>

                {/* 2. Credit/Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded border text-left flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#111111] border-[#E61919] text-white shadow-[0_0_10px_rgba(230,25,25,0.2)]'
                      : 'bg-[#0F0F0F] border-[#333333] text-[#888888] hover:border-[#666666] hover:text-white'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-[#E61919]' : 'text-[#666666]'}`} />
                  <div>
                    <span className="text-xs font-bold uppercase block">Card</span>
                    <span className="text-[9px] text-[#888888] font-mono">Visa, MC, RuPay</span>
                  </div>
                </button>

                {/* 3. Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded border text-left flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#111111] border-[#E61919] text-white shadow-[0_0_10px_rgba(230,25,25,0.2)]'
                      : 'bg-[#0F0F0F] border-[#333333] text-[#888888] hover:border-[#666666] hover:text-white'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${paymentMethod === 'netbanking' ? 'text-[#E61919]' : 'text-[#666666]'}`} />
                  <div>
                    <span className="text-xs font-bold uppercase block">Net Banking</span>
                    <span className="text-[9px] text-[#888888] font-mono">All Major Banks</span>
                  </div>
                </button>

                {/* 4. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded border text-left flex flex-col justify-between space-y-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#111111] border-[#E61919] text-white shadow-[0_0_10px_rgba(230,25,25,0.2)]'
                      : 'bg-[#0F0F0F] border-[#333333] text-[#888888] hover:border-[#666666] hover:text-white'
                  }`}
                >
                  <Banknote className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-[#E61919]' : 'text-[#666666]'}`} />
                  <div>
                    <span className="text-xs font-bold uppercase block">Pay on Delivery</span>
                    <span className="text-[9px] text-[#888888] font-mono">Cash / Handover</span>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#333333]">
                
                {/* UPI Mode View */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase font-mono">
                        Instant UPI Payment
                      </span>
                      <span className="text-[10px] text-[#00FF66] font-mono font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> ZERO SURCHARGE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-[#888888] uppercase font-mono">
                          Enter UPI Virtual Address
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="w-full bg-[#1A1A1A] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919] font-mono"
                        />
                        <div className="flex gap-2">
                          {['gpay', 'phonepe', 'paytm'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                setUpiApp(app as any);
                                setUpiId(app === 'gpay' ? 'collector@okaxis' : app === 'phonepe' ? 'collector@ybl' : 'collector@paytm');
                              }}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase font-mono transition-all ${
                                upiApp === app
                                  ? 'bg-[#E61919] text-white'
                                  : 'bg-[#1A1A1A] text-[#888888] border border-[#333333]'
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* QR Code Simulation */}
                      <div className="bg-[#1A1A1A] border border-[#333333] p-3 rounded flex items-center gap-3">
                        <div className="w-14 h-14 bg-white p-1 rounded flex items-center justify-center flex-shrink-0">
                          <QrCode className="w-12 h-12 text-black" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-white uppercase block text-[11px]">Scan with any UPI App</span>
                          <span className="text-[10px] text-[#888888] block">Google Pay, PhonePe, Paytm</span>
                          <span className="text-[10px] text-[#E61919] font-mono font-bold">Total: {formatPrice(finalTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Mode View */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase font-mono">
                        Card Details
                      </span>
                      <div className="flex gap-1.5 text-[9px] text-[#888888] font-mono">
                        <span className="bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#333333]">VISA</span>
                        <span className="bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#333333]">MASTERCARD</span>
                        <span className="bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#333333]">RUPAY</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#888888] uppercase font-mono mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          placeholder="4532 0000 0000 0000"
                          className="w-full bg-[#1A1A1A] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#E61919]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#888888] uppercase font-mono mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardData.cardName}
                          onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                          placeholder="NAME AS PRINTED ON CARD"
                          className="w-full bg-[#1A1A1A] border border-[#333333] rounded px-3 py-2 text-xs text-white uppercase placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#888888] uppercase font-mono mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM / YY"
                          className="w-full bg-[#1A1A1A] border border-[#333333] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E61919]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#888888] uppercase font-mono mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="•••"
                          className="w-full bg-[#1A1A1A] border border-[#333333] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E61919]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking View */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-white uppercase font-mono block">
                      Select Primary Banking Portal
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Citibank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-2 rounded border text-xs font-semibold text-left transition-all ${
                            selectedBank === b
                              ? 'bg-[#1A1A1A] border-[#E61919] text-white font-bold'
                              : 'bg-[#0F0F0F] border-[#333333] text-[#888888] hover:border-[#666666]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cash on Delivery View */}
                {paymentMethod === 'cod' && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 p-2.5 bg-[#1A1A1A] border border-[#333333] rounded text-xs text-[#E0E0E0]">
                      <Info className="w-4 h-4 text-[#E61919] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase text-white block">Cash On Delivery</span>
                        Pay via Cash or Courier QR scanner upon physical arrival.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5 sticky top-24">
              
              <div className="border-b border-[#333333] pb-3 flex items-center justify-between">
                <h3 className="text-sm font-black italic uppercase tracking-tight text-white">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
                </h3>
                <span className="text-xs text-[#E61919] font-bold font-mono">1:64 VAULT</span>
              </div>

              {/* Items Mini List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#222222] pr-1 space-y-2.5">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#222222] border border-[#333333] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white uppercase truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#888888] font-mono mt-0.5">
                        <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                        {item.withProtectorCase && (
                          <span className="text-[#E61919]">• +Protector</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatPrice(item.product.price * item.quantity + (item.withProtectorCase ? 3.50 * item.quantity : 0))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-[#333333] pt-3.5 space-y-2 text-xs text-[#888888] font-mono">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="text-white">{formatPrice(cartSubtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#00FF66]">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Air Express Shipping</span>
                  <span>
                    {rawShipping === 0 ? (
                      <span className="text-[#00FF66] font-bold uppercase">FREE</span>
                    ) : (
                      formatPrice(rawShipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Customs & GST (5%)</span>
                  <span className="text-white">{formatPrice(taxAmount)}</span>
                </div>

                <div className="border-t border-[#333333] pt-3 mt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Total Payable
                    </span>
                    <span className="text-[9px] text-[#666666]">Pre-cleared customs & insurance</span>
                  </div>
                  <span className="text-xl font-mono font-bold text-[#E61919]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#E61919] hover:bg-[#FF2E2E] active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(230,25,25,0.35)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Pay {formatPrice(finalTotal)} & Place Order</span>
                  </>
                )}
              </button>

              {/* Guarantees List */}
              <div className="space-y-1.5 pt-2 border-t border-[#333333] text-[10px] text-[#888888] font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66] flex-shrink-0" />
                  <span>100% Guaranteed Genuine Mattel Hot Wheels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#E61919] flex-shrink-0" />
                  <span>Real-time Live Courier Tracking & SMS Status</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
