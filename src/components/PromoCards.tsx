import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface PromoCardData {
  id: string;
  tag: string;
  title: string;
  category: string;
  image: string;
  badge: string;
}

const PROMO_ITEMS: PromoCardData[] = [
  {
    id: 'p1',
    tag: 'FROM $24.99 • JAPAN DIRECT',
    title: 'Rare JDM & GT Castings',
    category: 'new-arrivals',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    badge: 'JAPAN MINT',
  },
  {
    id: 'p2',
    tag: 'LIMITED DROP 2024 • RESTOCKED',
    title: 'Exclusive RLC & $TH Editions',
    category: 'limited-edition',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    badge: 'VAULT GRAIL',
  },
  {
    id: 'p3',
    tag: 'SCALE 1:64 • RUBBER TIRES',
    title: 'Boulevard & Team Transports',
    category: 'premium',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    badge: 'PREMIUM SET',
  },
];

export const PromoCards: React.FC = () => {
  const { setActivePage, setActiveCategory } = useStore();

  const handleCardClick = (category: string) => {
    setActiveCategory(category);
    setActivePage('shop');
  };

  return (
    <section className="bg-[#0F0F0F] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#333333]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#888888] font-mono">
            Featured Diecast Vault Sections
          </h2>
          <span className="text-[10px] text-[#666666] uppercase font-mono">
            Direct Import Collections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMO_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.category)}
              className="group relative h-56 bg-[#1A1A1A] rounded-xl overflow-hidden cursor-pointer border border-[#333333] hover:border-[#E61919] transition-all duration-300 flex flex-col justify-end p-5"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-60"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="bg-[#E61919] text-white text-[9px] px-2 py-0.5 font-bold rounded-sm uppercase tracking-wider font-mono">
                  {item.badge}
                </span>
              </div>

              {/* Text content */}
              <div className="relative z-10 space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E61919] uppercase tracking-wider block">
                    {item.tag}
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div>
                  <button className="inline-flex items-center gap-2 bg-white group-hover:bg-[#E61919] group-hover:text-white text-black font-black text-[11px] px-4 py-2 rounded-lg uppercase tracking-wider transition-colors">
                    <span>EXPLORE SECTION</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
