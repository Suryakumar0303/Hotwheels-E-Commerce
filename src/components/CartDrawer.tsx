import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Check 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    toggleProtectorCase, 
    cartSubtotal, 
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActivePage,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 50.0;
  const rawShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 9.99;
  
  // Calculate discount
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

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActivePage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-[#333333] text-[#E0E0E0] flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0F0F0F] border-b border-[#333333] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#E61919] p-2 rounded text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black italic uppercase tracking-tight text-white">
                  COLLECTOR CART
                </h2>
                <span className="text-[10px] text-[#888888] font-mono">
                  {cart.length} MODELS ({cart.reduce((a, b) => a + b.quantity, 0)} TOTAL UNITS)
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#888888] hover:text-white rounded border border-[#333333] hover:border-[#E61919] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#1A1A1A] px-5 py-2.5 border-b border-[#333333]">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="flex items-center gap-1.5 text-[#E0E0E0]">
                <Truck className="w-3 h-3 text-[#E61919]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#00FF66] font-bold">FREE AIR SHIPPING UNLOCKED</span>
                ) : (
                  <span>
                    Add <strong className="text-[#E61919]">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Express
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#888888]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#0F0F0F] h-1.5 rounded-full overflow-hidden border border-[#333333]">
              <div
                className="bg-[#E61919] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#222222] space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#666666]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase text-white">Cart is Empty</h3>
                  <p className="text-xs text-[#888888] max-w-xs">
                    Browse our imported vault and add legendary RLC and Super Treasure Hunt models.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-5 py-2 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start gap-3">
                    {/* Product image */}
                    <div className="w-16 h-16 rounded bg-[#222222] border border-[#333333] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Name & Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white uppercase truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#666666] hover:text-[#E61919] transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-[#888888] block font-mono">
                        {item.product.specs.scale} • {item.product.specs.editionType}
                      </span>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-xs font-mono font-bold text-[#E61919]">
                          {formatPrice(item.product.price)}
                        </span>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#333333] bg-[#0F0F0F] rounded overflow-hidden font-mono">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-[#888888] hover:text-white hover:bg-[#222222] transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2 py-0.5 text-[#888888] hover:text-white hover:bg-[#222222] transition-colors disabled:opacity-30"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acrylic Protector Addon Toggle */}
                  <div 
                    onClick={() => toggleProtectorCase(item.product.id)}
                    className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition-all ${
                      item.withProtectorCase
                        ? 'bg-[#1A1A1A] border-[#E61919] text-white'
                        : 'bg-[#1A1A1A] border-[#333333] text-[#888888] hover:border-[#666666]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm flex items-center justify-center border ${
                        item.withProtectorCase ? 'bg-[#E61919] border-[#E61919] text-white' : 'border-[#444444]'
                      }`}>
                        {item.withProtectorCase && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] uppercase font-mono">
                        UV Clamshell Protector (+{formatPrice(3.50)})
                      </span>
                    </div>
                    <span className="text-[9px] text-[#E61919] font-mono uppercase font-bold">
                      {item.withProtectorCase ? 'Included' : '+Add'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon and Summary Box */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#0F0F0F] border-t border-[#333333] space-y-3.5">
              
              {/* Coupon Form */}
              <div className="space-y-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#1A1A1A] border border-[#00FF66]/40 p-2 rounded text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-[#00FF66]">
                      <Tag className="w-3 h-3" />
                      <span className="font-bold uppercase">{appliedCoupon.code}</span>
                      <span>({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] text-[#E61919] hover:underline uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="COUPON (HOTDRIVE15)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-white uppercase placeholder-zinc-600 rounded px-3 py-1.5 focus:outline-none focus:border-[#E61919]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-white hover:bg-[#E61919] hover:text-white text-black font-bold text-xs uppercase rounded transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[10px] text-[#E61919] font-mono">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#888888] font-mono pt-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-[#E0E0E0]">{formatPrice(cartSubtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#00FF66]">
                    <span>DISCOUNT</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span>
                    {rawShipping === 0 ? (
                      <strong className="text-[#00FF66] uppercase">FREE</strong>
                    ) : (
                      formatPrice(rawShipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>TAX (5%)</span>
                  <span className="text-[#E0E0E0]">{formatPrice(taxAmount)}</span>
                </div>

                <div className="border-t border-[#333333] pt-2 mt-1 flex justify-between items-baseline">
                  <span className="font-bold text-white uppercase tracking-wider">FINAL TOTAL</span>
                  <span className="text-lg font-black text-[#E61919]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-[#E61919] hover:bg-[#FF2E2E] active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(230,25,25,0.35)] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[9px] text-[#666666] font-mono">
                <span className="flex items-center gap-1 text-[#00FF66]">
                  <ShieldCheck className="w-3 h-3" />
                  256-Bit Encrypted
                </span>
                <span>•</span>
                <span>UPI, Cards, NetBanking, COD</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
