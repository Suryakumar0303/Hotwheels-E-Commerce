import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Instagram, 
  Youtube, 
  Twitter 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setActiveCategory, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('Subscribed!', 'You are on the VIP list for upcoming RLC and JDM drops.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#0A0A0A] text-[#888888] border-t border-[#333333] text-xs font-sans">
      {/* VIP Drop Announcement Newsletter Bar */}
      <div className="bg-[#111111] border-b border-[#333333] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[#E61919] font-bold uppercase font-mono tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3" />
              <span>COLLECTOR PRIORITY ACCESS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight">
              NEVER MISS A LIMITED RLC OR $TH DROP
            </h3>
            <p className="text-[#888888] text-xs max-w-md">
              Receive direct notifications 15 minutes before imported batches drop on the vault.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your collector email..."
                  className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
                />
                <Mail className="w-4 h-4 text-[#666666] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E61919] hover:bg-[#FF2E2E] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_12px_rgba(230,25,25,0.3)] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Join VIP Vault</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center tracking-tighter cursor-pointer" onClick={() => setActivePage('home')}>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase font-sans">
                HOTDRIVE <span className="text-[#E61919]">APEX</span>
              </span>
            </div>
            <p className="text-[#888888] text-xs leading-relaxed max-w-sm">
              The premier destination for authentic imported diecast cars, Red Line Club (RLC) exclusives, Super Treasure Hunts, and precision 1:64 scale collector models.
            </p>
            <div className="flex items-center gap-2.5 text-[#888888] pt-1">
              <span className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#333333] flex items-center justify-center hover:text-white hover:border-[#E61919] cursor-pointer transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </span>
              <span className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#333333] flex items-center justify-center hover:text-white hover:border-[#E61919] cursor-pointer transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </span>
              <span className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#333333] flex items-center justify-center hover:text-white hover:border-[#E61919] cursor-pointer transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Collections
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button
                  onClick={() => { setActiveCategory('new-arrivals'); setActivePage('shop'); }}
                  className="hover:text-[#E61919] transition-colors"
                >
                  New Arrivals 2024
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('best-sellers'); setActivePage('shop'); }}
                  className="hover:text-[#E61919] transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('limited-edition'); setActivePage('shop'); }}
                  className="hover:text-white transition-colors text-[#E61919]"
                >
                  RLC Exclusives & $TH
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('premium'); setActivePage('shop'); }}
                  className="hover:text-[#E61919] transition-colors"
                >
                  Car Culture Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('offers'); setActivePage('shop'); }}
                  className="hover:text-[#E61919] transition-colors"
                >
                  Offers & Discounts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Collector Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Collector Services
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => setActivePage('tracking')} className="hover:text-[#E61919] transition-colors">
                  Air Cargo Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('reviews')} className="hover:text-[#E61919] transition-colors">
                  Collector Reviews
                </button>
              </li>
              <li>
                <span className="text-[#666666]">Mint Grading Standard (1-10)</span>
              </li>
              <li>
                <span className="text-[#666666]">UV Protector Specs</span>
              </li>
              <li>
                <span className="text-[#666666]">Direct Customs Clearance</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Guarantees & Payments
            </h4>
            <div className="space-y-1.5 text-xs text-[#888888]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>100% Genuine Mattel Imports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#E61919]" />
                <span>Express Air Courier Transit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[9px] text-[#666666] block uppercase font-mono mb-1">
                Supported Gateways
              </span>
              <div className="flex flex-wrap gap-1 font-mono text-[9px] text-[#888888]">
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">UPI / QR</span>
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">GPay</span>
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">PhonePe</span>
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">Visa / MC</span>
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">NetBanking</span>
                <span className="bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-[#222222] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#666666] font-mono gap-3">
          <p>© 2026 HOTDRIVE APEX. All Hot Wheels trademarks belong to Mattel, Inc.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Customs & Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
