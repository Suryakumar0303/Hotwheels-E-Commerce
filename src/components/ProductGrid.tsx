import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  Tag, 
  Layers, 
  Check, 
  ArrowUpDown,
  Filter
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useStore();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [selectedEditionType, setSelectedEditionType] = useState<string>('all');

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Extract unique edition types
  const editionTypes = useMemo(() => {
    const set = new Set(products.map((p) => p.specs.editionType));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Categories config
  const categories = [
    { id: 'all', label: 'All Models', icon: Layers },
    { id: 'new-arrivals', label: 'New Arrivals', icon: Sparkles },
    { id: 'best-sellers', label: 'Best Sellers', icon: Flame },
    { id: 'limited-edition', label: 'Limited Edition', icon: Sparkles },
    { id: 'premium', label: 'Premium', icon: Layers },
    { id: 'offers', label: 'Offers', icon: Tag },
  ];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (activeCategory === 'new-arrivals' && !product.isNew) return false;
      if (activeCategory === 'best-sellers' && !product.isBestSeller) return false;
      if (activeCategory === 'limited-edition' && !product.isLimited) return false;
      if (activeCategory === 'premium' && product.category !== 'premium' && product.specs.editionType !== 'Car Culture' && product.specs.editionType !== 'Team Transport') return false;
      if (activeCategory === 'offers' && !product.isOffer && (product.discountPercent || 0) < 20) return false;

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;

      // Edition type filter
      if (selectedEditionType !== 'all' && product.specs.editionType !== selectedEditionType) return false;

      // Stock filter
      if (inStockOnly && (!product.inStock || product.stock <= 0)) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchSeries = product.series.toLowerCase().includes(q);
        const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchSeries && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      // default featured: best sellers first, then limited
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [products, activeCategory, selectedBrand, selectedEditionType, inStockOnly, searchQuery, sortBy]);

  return (
    <section className="bg-[#0F0F0F] py-10 px-4 sm:px-6 lg:px-8 text-[#E0E0E0]" id="catalog-section">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#333333] pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#E61919] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm font-mono">
                LIVE CATALOG LISTING
              </span>
              <span className="text-xs text-[#888888] font-mono">SCALE 1:64</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
              COLLECTORS DIECAST INVENTORY
            </h2>
          </div>

          {/* Categories Tab Pill Bar in Geometric Balance style */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E61919] text-white shadow-md'
                      : 'bg-[#1A1A1A] text-[#888888] hover:text-white border border-[#333333]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left filters: Brand & Edition dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-[#888888] font-bold uppercase font-mono mr-1">
              <Filter className="w-3.5 h-3.5 text-[#E61919]" />
              <span>Filters:</span>
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#0F0F0F] border border-[#333333] text-[#E0E0E0] text-xs font-mono rounded px-3 py-1.5 focus:outline-none focus:border-[#E61919] cursor-pointer"
            >
              <option value="all">All Makes ({brands.length - 1})</option>
              {brands.filter(b => b !== 'all').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Edition Filter */}
            <select
              value={selectedEditionType}
              onChange={(e) => setSelectedEditionType(e.target.value)}
              className="bg-[#0F0F0F] border border-[#333333] text-[#E0E0E0] text-xs font-mono rounded px-3 py-1.5 focus:outline-none focus:border-[#E61919] cursor-pointer"
            >
              <option value="all">All Series Types</option>
              {editionTypes.filter(e => e !== 'all').map((ed) => (
                <option key={ed} value={ed}>
                  {ed}
                </option>
              ))}
            </select>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                inStockOnly
                  ? 'bg-[#111111] text-[#00FF66] border-[#00FF66]/60'
                  : 'bg-[#0F0F0F] text-[#888888] border-[#333333] hover:text-white'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                inStockOnly ? 'bg-[#00FF66] border-[#00FF66] text-black' : 'border-[#444444]'
              }`}>
                {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="uppercase text-[11px] font-bold">In Stock Only</span>
            </button>
          </div>

          {/* Right: Sort & Total Count */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-[#888888] font-mono">
              Count: <strong className="text-white font-bold">{filteredProducts.length}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#888888]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0F0F0F] border border-[#333333] text-[#E0E0E0] text-xs font-mono rounded px-3 py-1.5 focus:outline-none focus:border-[#E61919] cursor-pointer"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-12 text-center space-y-4">
            <SlidersHorizontal className="w-8 h-8 text-[#666666] mx-auto" />
            <h3 className="text-base font-bold uppercase text-white">No Matching Models In Vault</h3>
            <p className="text-xs text-[#888888] max-w-sm mx-auto">
              Try adjusting your filter options, clearing the search query, or switching categories.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedBrand('all');
                setSelectedEditionType('all');
                setInStockOnly(false);
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-[#E61919] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#FF2E2E] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
