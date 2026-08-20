import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  ShoppingCart, 
  Eye, 
  Heart, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    setQuickViewProduct, 
    toggleWishlist, 
    isInWishlist 
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1, false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Stock status pill formatting
  const getStockStatus = () => {
    if (!product.inStock || product.stock <= 0) {
      return (
        <span className="text-[10px] font-bold text-[#666666] uppercase font-mono">
          Out of Stock
        </span>
      );
    }
    if (product.stock <= 3) {
      return (
        <span className="text-[10px] font-bold text-[#E61919] uppercase font-mono animate-pulse flex items-center gap-1">
          <Flame className="w-3 h-3 text-[#E61919]" />
          Only {product.stock} Left!
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-[#00FF66] uppercase font-mono flex items-center gap-1">
        In Stock ({product.stock})
      </span>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setQuickViewProduct(product)}
      className="group relative bg-[#1A1A1A] border border-[#333333] hover:border-[#E61919] rounded-xl p-4 flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer"
    >
      {/* Product Image Box with dark inner border */}
      <div className="relative aspect-square w-full bg-[#222222] rounded-lg border border-[#333333] overflow-hidden mb-3.5">
        {/* Main Product Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#E61919] text-white font-black text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono">
              -{product.discountPercent}%
            </span>
          )}
          {product.isLimited && (
            <span className="bg-[#0F0F0F] text-[#E0E0E0] border border-[#333333] font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#E61919]" />
              {product.specs.editionType}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-md border transition-colors z-10 ${
            isWishlisted
              ? 'bg-[#E61919] border-[#E61919] text-white'
              : 'bg-[#0F0F0F]/80 border-[#333333] text-[#888888] hover:text-white hover:border-[#E61919]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-2.5 flex justify-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickView}
            className="w-full py-1.5 bg-white text-black hover:bg-[#E61919] hover:text-white text-[10px] font-black uppercase tracking-wider rounded transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3 h-3" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Scale */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] uppercase mb-1">
            <span className="truncate">{product.brand} • {product.specs.scale}</span>
            <span className="text-[#666666]">{product.specs.editionType}</span>
          </div>

          {/* Car Name */}
          <h3 className="text-sm font-bold text-white uppercase truncate group-hover:text-[#E61919] transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#FFB800] text-[#FFB800]'
                      : 'text-[#333333]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-[#888888]">{product.rating}</span>
            <span className="text-[10px] text-[#666666]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2.5 border-t border-[#333333] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-mono font-bold text-[#E61919]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] font-mono text-[#666666] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock status badge */}
            <div>{getStockStatus()}</div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || product.stock <= 0}
            className={`w-full py-2 px-3 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${
              !product.inStock || product.stock <= 0
                ? 'bg-[#222222] text-[#666666] border border-[#333333] cursor-not-allowed'
                : addedAnimation
                ? 'bg-[#00FF66] text-black font-bold'
                : 'bg-[#E61919] hover:bg-[#FF2E2E] active:scale-[0.98] text-white shadow-[0_0_10px_rgba(230,25,25,0.25)]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
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
        </div>
      </div>
    </div>
  );
};
