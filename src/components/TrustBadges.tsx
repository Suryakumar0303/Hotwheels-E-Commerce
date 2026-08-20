import React from 'react';
import { Plane, Award, Headphones, ShieldCheck, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Plane,
      title: 'Free Global Air Delivery',
      subtitle: 'Express air freight dispatched directly from international hubs on orders over $50.',
      tag: 'AIR EXPRESS',
    },
    {
      icon: Award,
      title: '100% Mint Collector Grade',
      subtitle: 'Unpunched blister cards, authentic Real Riders rubber wheels, and UV protector cases.',
      tag: '10/10 MINT',
    },
    {
      icon: Headphones,
      title: '24/7 Diecast Desk',
      subtitle: 'Direct collector support for pre-orders, customs clearance, and vault reservations.',
      tag: 'DIRECT DESK',
    },
  ];

  return (
    <section className="bg-[#0F0F0F] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#333333]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="bg-[#1A1A1A] border border-[#333333] p-4 rounded-xl flex items-start gap-4 hover:border-[#E61919] transition-colors"
              >
                <div className="w-12 h-12 rounded bg-[#222222] border border-[#333333] flex items-center justify-center flex-shrink-0 text-[#E61919]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {badge.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#888888] leading-relaxed">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
