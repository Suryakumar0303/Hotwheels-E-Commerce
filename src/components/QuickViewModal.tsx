import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Heart, 
  Truck, 
  Layers, 
  Sparkles, 
  Flame, 
  Check, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    formatPrice, 
    addToCart, 
    isInWishlist, 
    toggleWishlist,
    getProductReviews,
    setIsCartOpen,
    setActivePage
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [withProtector, setWithProtector] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const reviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    if (!product.inStock || product.stock <= 0) return;
    addToCart(product, quantity, withProtector);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product.inStock || product.stock <= 0) return;
    addToCart(product, quantity, withProtector);
    setQuickViewProduct(null);
    setActivePage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn font-sans">
      <div 
        className="relative bg-[#111111] border border-[#333333] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden text-[#E0E0E0] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-1.5 bg-[#1A1A1A] hover:bg-[#E61919] hover:text-white text-[#888888] rounded border border-[#333333] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Multi-angle Image Gallery */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#1A1A1A] border border-[#333333]">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="bg-[#E61919] text-white font-black text-[10px] px-2 py-0.5 rounded-sm uppercase font-mono">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                  {product.isLimited && (
                    <span className="bg-[#0F0F0F] text-[#E0E0E0] border border-[#333333] font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase font-mono flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#E61919]" />
                      {product.specs.editionType}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2 rounded border transition-all ${
                    isWishlisted
                      ? 'bg-[#E61919] border-[#E61919] text-white'
                      : 'bg-[#0F0F0F]/80 border-[#333333] text-[#888888] hover:text-white hover:border-[#E61919]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all flex-shrink-0 bg-[#1A1A1A] ${
                        selectedImageIndex === idx
                          ? 'border-[#E61919]'
                          : 'border-[#333333] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Collector Seal */}
              <div className="bg-[#1A1A1A] border border-[#333333] p-3 rounded-lg flex items-center gap-3 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#00FF66] flex-shrink-0" />
                <div className="text-[#888888] text-[11px]">
                  <span className="font-bold text-white uppercase block">Certified Mint Grade</span>
                  Inspected unpunched card, sharp corners & no blister fractures.
                </div>
              </div>
            </div>

            {/* Right: Product Details, Specs & Buying Action */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                
                {/* Brand & Series */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E61919] font-bold uppercase tracking-widest font-mono">
                    {product.brand} • {product.series}
                  </span>
                  <span className="text-[#888888] bg-[#1A1A1A] border border-[#333333] px-2 py-0.5 rounded text-[10px] font-mono">
                    ITEM #{product.specs.itemNumber}
                  </span>
                </div>

                {/* Car Name */}
                <h2 className="text-2xl font-black italic text-white leading-none uppercase">
                  {product.name}
                </h2>

                {/* Tagline */}
                <p className="text-xs text-[#888888] font-medium">
                  {product.tagline}
                </p>

                {/* Star Rating & Review Count */}
                <div className="flex items-center gap-2 py-0.5">
                  <div className="flex items-center text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#FFB800] text-[#FFB800]'
                            : 'text-[#333333]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{product.rating}</span>
                  <span className="text-[11px] text-[#888888]">
                    ({product.reviewCount} collector reviews)
                  </span>
                </div>

                {/* Pricing Box in Geometric Balance style */}
                <div className="p-3.5 bg-[#1A1A1A] rounded-lg border border-[#333333] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#888888] uppercase font-mono block">Collector Price</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-mono font-bold text-[#E61919]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs font-mono text-[#666666] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#888888] uppercase font-mono block">Vault Status</span>
                    {product.stock <= 3 ? (
                      <span className="text-xs font-mono font-bold text-[#E61919] uppercase flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3 text-[#E61919]" />
                        Only {product.stock} Left!
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#00FF66] uppercase">
                        In Stock ({product.stock} units)
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#888888] leading-relaxed">
                  {product.description}
                </p>

                {/* Diecast Specs Table */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-[#E61919]" />
                    <span>Technical Specifications</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#1A1A1A] p-2.5 rounded border border-[#333333]">
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Scale</span>
                      <span className="font-semibold text-white">{product.specs.scale}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Body Material</span>
                      <span className="font-semibold text-white">{product.specs.bodyMaterial}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Chassis</span>
                      <span className="font-semibold text-white">{product.specs.chassisMaterial}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Tires / Wheels</span>
                      <span className="font-semibold text-[#E61919]">{product.specs.wheels}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Packaging Grade</span>
                      <span className="font-semibold text-white">{product.specs.packaging}</span>
                    </div>
                    <div>
                      <span className="text-[#666666] block text-[10px] uppercase font-mono">Origin Import</span>
                      <span className="font-semibold text-white">{product.specs.countryOfOrigin}</span>
                    </div>
                  </div>
                </div>

                {/* Protector Case Option */}
                <label className="flex items-center gap-3 p-2.5 bg-[#1A1A1A] border border-[#333333] rounded cursor-pointer hover:border-[#E61919] transition-colors">
                  <input
                    type="checkbox"
                    checked={withProtector}
                    onChange={(e) => setWithProtector(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-[#E61919]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#E61919]" />
                      Add Clamshell Acrylic UV Protector (+{formatPrice(3.50)})
                    </span>
                  </div>
                </label>
              </div>

              {/* Quantity & Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-[#333333]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#333333] rounded bg-[#0F0F0F] overflow-hidden font-mono">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-2 text-[#888888] hover:text-white hover:bg-[#222222] font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-white min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-2.5 py-2 text-[#888888] hover:text-white hover:bg-[#222222] font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stock <= 0}
                    className={`flex-1 py-3 px-4 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      !product.inStock
                        ? 'bg-[#222222] text-[#666666] border border-[#333333] cursor-not-allowed'
                        : addedSuccess
                        ? 'bg-[#00FF66] text-black font-bold'
                        : 'bg-[#E61919] hover:bg-[#FF2E2E] text-white shadow-[0_0_12px_rgba(230,25,25,0.3)]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : !product.inStock ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Direct Instant Checkout */}
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock || product.stock <= 0}
                    className="py-3 px-5 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-white text-black hover:bg-[#E61919] hover:text-white transition-colors"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] pt-1 border-t border-[#222222]">
                  <span className="flex items-center gap-1 text-[#00FF66]">
                    <Truck className="w-3 h-3" />
                    Express Air Courier
                  </span>
                  <span>DISPATCHED IN 24H</span>
                  <span>ZERO CUSTOMS DUTY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Reviews Preview */}
          <div className="border-t border-[#333333] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#E61919]" />
                <span>Collector Feedback ({reviews.length})</span>
              </h3>
              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  setActivePage('reviews');
                }}
                className="text-[11px] text-[#E61919] hover:underline font-mono uppercase font-bold"
              >
                View Reviews →
              </button>
            </div>

            {reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviews.slice(0, 2).map((rev) => (
                  <div key={rev.id} className="bg-[#1A1A1A] p-3 rounded border border-[#333333] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      <div className="flex text-[#FFB800]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-[#FFB800]' : 'text-[#333333]'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <h5 className="text-[11px] font-bold text-white truncate">{rev.title}</h5>
                    <p className="text-[10px] text-[#888888] line-clamp-2">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
