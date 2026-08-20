import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Shield, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Award, Zap } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'IMPORTED: JAPAN & RLC VAULT • 2024 DROP',
    title: 'COLLECTORS 1:64 GRAILS',
    subtitle: 'NISSAN SKYLINE GT-R & RLC EDITIONS',
    description: 'Direct imported diecast grails from Japan, US Mattel Creations & European Vaults. 100% Mint-On-Card with museum-grade UV clamshell protectors.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
    ctaText: 'EXPLORE RLC VAULT',
    categoryTarget: 'limited-edition',
    highlightBadge: 'RLC • STH • Boulevard',
    price: '$45.00',
  },
  {
    id: 2,
    tag: 'GERMAN & ITALIAN SUPERCAR SERIES',
    title: 'CAR CULTURE: EXOTIC ENVY',
    subtitle: 'PORSCHE 911 GT3 RS & FERRARI F40',
    description: 'Heavy metal body, metal chassis with authentic Michelin & Pirelli replica rubber tires. Complete your supercar scale garage today.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    ctaText: 'SHOP PREMIUM CARS',
    categoryTarget: 'premium',
    highlightBadge: 'Weissach Spec Available',
    price: '$38.50',
  },
  {
    id: 3,
    tag: 'LIMITED TIME COLLECTOR DISCOUNT',
    title: 'JDM TUNERS & RETRO ICONS',
    subtitle: 'UP TO 37% OFF ON BOX SETS & HAULERS',
    description: 'Take your collection to the apex. Enjoy instant discounts with coupon HOTDRIVE15 and free international air shipping over $50.',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
    ctaText: 'VIEW DISCOUNTED DEALS',
    categoryTarget: 'offers',
    highlightBadge: 'Instant 15% - 37% OFF',
    price: '$29.00',
  },
];

export const HeroBanner: React.FC = () => {
  const { setActivePage, setActiveCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleCtaClick = (category: string) => {
    setActiveCategory(category);
    setActivePage('shop');
  };

  return (
    <section className="relative bg-[#0F0F0F] text-[#E0E0E0] overflow-hidden border-b border-[#333333]">
      {/* Background with Dark Automotive Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center opacity-25 transform scale-105 transition-all duration-1000 filter saturate-150 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-[#0F0F0F]/70" />
      </div>

      {/* Geometric Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Content in Geometric Balance Style */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="bg-[#E61919] text-white text-[10px] px-2.5 py-1 font-bold rounded-sm uppercase tracking-widest font-mono">
                {slide.tag}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold tracking-widest text-[#888888] uppercase font-mono">
                {slide.title}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tight text-white leading-none">
                {slide.subtitle}
              </h1>
            </div>

            <p className="text-[#888888] text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
              {slide.description}
            </p>

            {/* CTA Buttons - Geometric Balance Style */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleCtaClick(slide.categoryTarget)}
                className="group inline-flex items-center gap-3 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(230,25,25,0.35)] active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActivePage('shop');
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#E61919] hover:text-white text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors border border-[#333333]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>View All 1:64 Models</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-[#888888] font-mono">
              <div className="flex items-center gap-1.5 text-[#00FF66]">
                <Shield className="w-3.5 h-3.5" />
                <span>100% Genuine Mattel</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#FFB800]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real Riders Rubber Wheels</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#E0E0E0]">
                <Award className="w-3.5 h-3.5 text-[#E61919]" />
                <span>Insured Express Air Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase in Geometric Balance Style */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Geometric Card Container */}
              <div className="bg-[#111111] border border-[#333333] rounded-xl p-5 shadow-2xl relative overflow-hidden group">
                
                {/* Red ambient blur glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-28 bg-[#E61919] blur-[70px] opacity-20 pointer-events-none" />

                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#E61919] text-white text-[10px] px-2 py-0.5 font-bold rounded-sm uppercase tracking-wider">
                    {slide.highlightBadge}
                  </span>
                  <span className="text-[#E61919] font-mono text-sm font-bold">
                    {slide.price}
                  </span>
                </div>

                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#333333] flex items-center justify-center mb-4">
                  <img
                    src={slide.image}
                    alt={slide.subtitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0F0F0F]/90 backdrop-blur-sm px-2.5 py-1 rounded border border-[#333333] text-[10px] font-mono text-[#888888] uppercase">
                    1/64 SCALE • METAL / METAL
                  </div>
                </div>

                {/* Card footer details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-sm font-black italic uppercase text-white truncate max-w-[200px]">
                        {slide.subtitle}
                      </h3>
                      <p className="text-[11px] text-[#888888] mt-0.5">
                        High-grade ZAMAC chassis with authentic tampos.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#00FF66] uppercase font-bold block">In Stock</span>
                      <div className="text-[#FFB800] text-[10px] font-mono">★★★★★ (28)</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCtaClick(slide.categoryTarget)}
                    className="w-full bg-[#1A1A1A] hover:bg-[#E61919] hover:text-white text-[#E0E0E0] border border-[#333333] hover:border-[#E61919] py-2.5 rounded-lg font-black uppercase text-xs tracking-widest transition-all"
                  >
                    Quick Order Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center justify-between mt-10 pt-4 border-t border-[#222222]">
          <div className="flex items-center space-x-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 transition-all rounded-full ${
                  currentSlide === index ? 'w-8 bg-[#E61919]' : 'w-2 bg-[#333333] hover:bg-[#666666]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="p-1.5 rounded bg-[#1A1A1A] border border-[#333333] text-[#888888] hover:text-white hover:border-[#E61919] transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="p-1.5 rounded bg-[#1A1A1A] border border-[#333333] text-[#888888] hover:text-white hover:border-[#E61919] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
