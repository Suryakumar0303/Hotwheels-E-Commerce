import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  ChevronDown, 
  X, 
  Flame,
  Award,
  Sparkles,
  Menu
} from 'lucide-react';
import { Currency } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    currency,
    setCurrency,
    activePage,
    setActivePage,
    activeCategory,
    setActiveCategory,
    products,
    setQuickViewProduct,
    searchQuery,
    setSearchQuery,
    formatPrice,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'new-arrivals', label: 'New Arrivals', badge: 'Hot' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'limited-edition', label: 'Limited Edition', badge: 'RLC' },
    { id: 'premium', label: 'Premium' },
    { id: 'offers', label: 'Offers', badge: 'Save' },
  ];

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (activePage !== 'shop' && activePage !== 'home') {
      setActivePage('shop');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F] border-b border-[#333333] text-[#E0E0E0] font-sans transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] border-b border-[#222222] text-[#888888] text-[11px] font-bold py-1.5 px-4 text-center uppercase tracking-widest flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 text-[#E0E0E0]">
          <Flame className="w-3.5 h-3.5 text-[#E61919]" />
          <span>Japan & RLC Vault Drops Live • Free Global Air Delivery &gt; $50</span>
        </span>
        <span className="hidden md:inline-flex items-center gap-1 bg-[#1A1A1A] border border-[#333333] px-2 py-0.5 rounded text-[10px] text-[#888888]">
          Promo: <strong className="text-[#E61919] tracking-normal ml-1">HOTDRIVE15</strong> (15% OFF)
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Badge in Geometric Balance Style */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => { setActivePage('home'); setActiveCategory('all'); }}
          >
            <div className="bg-[#E61919] px-3.5 py-1 font-black italic tracking-tighter text-white text-xl rounded-sm shadow-md flex items-center gap-1.5">
              <span>HOTDRIVE</span>
            </div>
            <span className="hidden xl:inline-block text-[10px] uppercase font-bold tracking-widest text-[#666666] border-l border-[#333333] pl-3 font-mono">
              APEX DIECAST VAULT
            </span>
          </div>

          {/* Desktop Navigation Links with Red Underline Active State */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-[#888888]">
            <button
              onClick={() => { setActivePage('home'); }}
              className={`py-1 transition-colors ${
                activePage === 'home' 
                  ? 'text-white border-b-2 border-[#E61919]' 
                  : 'hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('new-arrivals'); }}
              className={`py-1 transition-colors flex items-center gap-1 ${
                activeCategory === 'new-arrivals' && activePage === 'shop'
                  ? 'text-white border-b-2 border-[#E61919]'
                  : 'hover:text-white'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('best-sellers'); }}
              className={`py-1 transition-colors ${
                activeCategory === 'best-sellers' && activePage === 'shop'
                  ? 'text-white border-b-2 border-[#E61919]'
                  : 'hover:text-white'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('limited-edition'); }}
              className={`py-1 transition-colors flex items-center gap-1 ${
                activeCategory === 'limited-edition' && activePage === 'shop'
                  ? 'text-white border-b-2 border-[#E61919]'
                  : 'text-[#E61919] hover:text-[#FF2E2E]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#E61919]" />
              Limited Edition
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('premium'); }}
              className={`py-1 transition-colors ${
                activeCategory === 'premium' && activePage === 'shop'
                  ? 'text-white border-b-2 border-[#E61919]'
                  : 'hover:text-white'
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('offers'); }}
              className={`py-1 transition-colors ${
                activeCategory === 'offers' && activePage === 'shop'
                  ? 'text-white border-b-2 border-[#E61919]'
                  : 'text-[#E61919] hover:text-[#FF2E2E]'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setActivePage('tracking')}
              className={`py-1 transition-colors flex items-center gap-1.5 ${
                activePage === 'tracking' 
                  ? 'text-white border-b-2 border-[#E61919]' 
                  : 'hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#888888]" />
              Shipment
            </button>
            <button
              onClick={() => setActivePage('reviews')}
              className={`py-1 transition-colors ${
                activePage === 'reviews' 
                  ? 'text-white border-b-2 border-[#E61919]' 
                  : 'hover:text-white'
              }`}
            >
              Reviews
            </button>
          </nav>

          {/* Search Bar matching Geometric Balance input style */}
          <div className="relative flex-1 max-w-xs md:max-w-xs" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search collectors models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#1A1A1A] text-xs text-[#E0E0E0] placeholder-[#666666] rounded-full pl-9 pr-8 py-2 border border-[#333333] focus:outline-none focus:border-[#E61919] transition-all font-sans"
              />
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#333333] rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-[#333333] text-[#E0E0E0]">
                <div className="px-3 py-2 bg-[#111111] text-[10px] font-bold uppercase tracking-wider text-[#888888] flex items-center justify-between">
                  <span>Matches ({searchResults.length})</span>
                  <span className="text-[#E61919]">ESC to Close</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#888888]">
                    No diecast model found matching "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setQuickViewProduct(item);
                        setIsSearchFocused(false);
                      }}
                      className="p-2.5 hover:bg-[#222222] flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#222222] rounded border border-[#333333] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate uppercase">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                          <span className="text-[#E61919] font-bold">{formatPrice(item.price)}</span>
                          <span className="text-[#666666]">•</span>
                          <span className="text-[#888888] truncate">{item.series}</span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-[#111111] text-[#888888] border border-[#333333]">
                        {item.specs.editionType}
                      </span>
                    </div>
                  ))
                )}
                {searchResults.length > 0 && (
                  <div 
                    onClick={() => {
                      setActivePage('shop');
                      setIsSearchFocused(false);
                    }}
                    className="p-2 text-center bg-[#111111] text-[11px] font-bold text-white hover:text-[#E61919] uppercase tracking-wider cursor-pointer"
                  >
                    View all catalog models →
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls (Currency, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Currency Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded bg-[#1A1A1A] border border-[#333333] text-[#E0E0E0] hover:border-[#E61919] transition-colors font-mono">
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#888888]" />
              </button>
              <div className="absolute right-0 mt-1 w-28 bg-[#1A1A1A] border border-[#333333] rounded shadow-xl py-1 hidden group-hover:block z-50">
                {(['USD', 'INR', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono font-bold hover:bg-[#222222] flex items-center justify-between ${currency === curr ? 'text-[#E61919] bg-[#222222]' : 'text-[#888888]'}`}
                  >
                    <span>{curr}</span>
                    <span className="text-[#666666] text-[10px]">
                      {curr === 'USD' ? '$' : curr === 'INR' ? '₹' : curr === 'EUR' ? '€' : '£'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setActivePage('shop')}
              title="Wishlist"
              className="relative p-2 text-[#888888] hover:text-[#E61919] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#E61919] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded transition-all active:scale-95 shadow-[0_0_10px_rgba(230,25,25,0.3)]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-black/40 text-white text-[11px] font-mono px-1.5 py-0.2 rounded">
                {String(cartCount).padStart(2, '0')}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#888888] hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Filter Navigation Sub-Bar */}
        <div className="hidden lg:flex items-center justify-between py-2 border-t border-[#222222] text-[11px] font-bold uppercase tracking-wider text-[#888888] overflow-x-auto">
          <div className="flex items-center space-x-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat.id && activePage === 'shop'
                    ? 'bg-[#1A1A1A] text-white border border-[#E61919]'
                    : 'hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                    cat.id === 'offers' ? 'bg-[#E61919] text-white' : 'bg-[#222222] text-[#E0E0E0] border border-[#333333]'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[#888888] text-[10px] font-mono">
            <span className="flex items-center gap-1 text-[#00FF66]">
              <ShieldCheck className="w-3.5 h-3.5" />
              MINT 10/10 CARD GRADE
            </span>
            <span className="text-[#333333]">|</span>
            <span className="flex items-center gap-1 text-[#FFB800]">
              <Award className="w-3.5 h-3.5" />
              GENUINE MATTEL IMPORTS
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A1A1A] border-b border-[#333333] px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-white"
            >
              Overview
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('all'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-white"
            >
              All Diecast
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('limited-edition'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-[#E61919]"
            >
              RLC Exclusives
            </button>
            <button
              onClick={() => { setActivePage('shop'); setActiveCategory('offers'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-[#E61919]"
            >
              Offers & Deals
            </button>
            <button
              onClick={() => { setActivePage('tracking'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-white flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" /> Track Shipment
            </button>
            <button
              onClick={() => { setActivePage('reviews'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left bg-[#111111] border border-[#333333] rounded text-white"
            >
              Collector Reviews
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
