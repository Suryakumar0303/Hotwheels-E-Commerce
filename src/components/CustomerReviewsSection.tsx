import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  ThumbsUp, 
  ShieldCheck, 
  Sparkles, 
  MessageSquarePlus, 
  Award, 
  Check, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ReviewModal } from './ReviewModal';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, products, voteHelpful } = useStore();

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Compute rating metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const starBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (counts[star] !== undefined) counts[star]++;
    });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedStarFilter !== 'all' && Math.round(r.rating) !== selectedStarFilter) {
        return false;
      }
      if (selectedProductFilter !== 'all' && r.productId !== selectedProductFilter) {
        return false;
      }
      return true;
    });
  }, [reviews, selectedStarFilter, selectedProductFilter]);

  const getProductName = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    return p ? p.name : 'Collector Diecast Edition';
  };

  return (
    <section className="bg-[#0F0F0F] py-10 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] border-b border-[#333333] font-sans" id="reviews-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#1A1A1A] border border-[#333333] text-[10px] font-bold text-[#E61919] uppercase font-mono tracking-wider">
              <Award className="w-3 h-3" />
              <span>AUTHENTIC COMMUNITY RATINGS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic text-white uppercase tracking-tight">
              COLLECTOR RATINGS & REVIEWS
            </h2>
            <p className="text-xs text-[#888888] max-w-xl">
              Transparent feedback on paint tampo sharpness, Real Riders rubber wheels, and unpunched card condition.
            </p>
          </div>

          <button
            onClick={() => setIsWriteReviewOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E61919] hover:bg-[#FF2E2E] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_12px_rgba(230,25,25,0.3)]"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write Review</span>
          </button>
        </div>

        {/* Rating Breakdown & Summary Metrics Card */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Big Score */}
          <div className="md:col-span-4 text-center md:text-left space-y-1.5 md:border-r border-[#333333] md:pr-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] font-mono block">
              Overall Collector Score
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">{avgRating}</span>
              <span className="text-sm text-[#888888] font-bold font-mono">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-[#FFB800] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
              ))}
            </div>
            <p className="text-[11px] text-[#888888] pt-1">
              Based on <strong className="text-white">{totalReviews}</strong> certified collector reviews
            </p>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-5 space-y-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starBreakdown[stars as 1 | 2 | 3 | 4 | 5];
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <button
                  key={stars}
                  onClick={() => setSelectedStarFilter(selectedStarFilter === stars ? 'all' : stars)}
                  className={`w-full flex items-center gap-2.5 text-xs p-1 rounded transition-colors text-left font-mono ${
                    selectedStarFilter === stars ? 'bg-[#111111] border border-[#E61919]' : 'hover:bg-[#222222]'
                  }`}
                >
                  <span className="w-12 text-[11px] font-bold text-[#E0E0E0]">{stars} Star</span>
                  <div className="flex-1 bg-[#0F0F0F] h-1.5 rounded-full overflow-hidden border border-[#333333]">
                    <div
                      className="bg-[#E61919] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[#888888] text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Key Assurance Badges */}
          <div className="md:col-span-3 bg-[#0F0F0F] p-4 rounded-lg border border-[#333333] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#00FF66]">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] font-bold">99.8% Mint Grade Arrival</span>
            </div>
            <div className="flex items-center gap-2 text-[#E0E0E0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E61919] flex-shrink-0" />
              <span className="text-[11px]">100% Genuine Imports</span>
            </div>
            <div className="flex items-center gap-2 text-[#888888]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800] flex-shrink-0" />
              <span className="text-[11px]">UV Protectors Included</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1A1A1A] p-3 rounded-lg border border-[#333333]">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 text-xs text-[#888888] font-bold uppercase font-mono">
              <Filter className="w-3 h-3 text-[#E61919]" />
              <span>Filter:</span>
            </div>

            {/* Star Filter Pills */}
            <div className="flex gap-1 overflow-x-auto font-mono text-xs">
              <button
                onClick={() => setSelectedStarFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                  selectedStarFilter === 'all'
                    ? 'bg-[#E61919] text-white'
                    : 'bg-[#0F0F0F] text-[#888888] border border-[#333333] hover:text-white'
                }`}
              >
                All
              </button>
              {[5, 4, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStarFilter(s)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                    selectedStarFilter === s
                      ? 'bg-[#E61919] text-white'
                      : 'bg-[#0F0F0F] text-[#888888] border border-[#333333] hover:text-white'
                  }`}
                >
                  <span>{s}</span>
                  <Star className="w-2.5 h-2.5 fill-current" />
                </button>
              ))}
            </div>

            {/* Product Filter */}
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="bg-[#0F0F0F] border border-[#333333] text-[#E0E0E0] text-xs rounded px-2.5 py-1 focus:outline-none focus:border-[#E61919]"
            >
              <option value="all">All Diecast Models ({reviews.length})</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-[#888888] font-mono">
            Showing <strong className="text-white">{filteredReviews.length}</strong> reviews
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#1A1A1A] border border-[#333333] hover:border-[#666666] rounded-xl p-5 space-y-3 shadow-lg transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-[#333333] bg-[#222222]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white uppercase">{rev.userName}</h4>
                        {rev.verifiedBuyer && (
                          <span className="bg-[#111111] text-[#00FF66] border border-[#00FF66]/40 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Check className="w-2 h-2 stroke-[3]" /> VERIFIED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#888888] font-mono">{rev.userCity} • {rev.date}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-[#FFB800] text-[#FFB800]'
                            : 'text-[#333333]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Model tag */}
                <div className="text-[10px] text-[#E61919] font-mono font-bold bg-[#0F0F0F] px-2.5 py-0.5 rounded border border-[#333333] inline-block truncate max-w-full uppercase">
                  🚗 Model: {getProductName(rev.productId)}
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-white leading-snug uppercase">
                  "{rev.title}"
                </h3>

                {/* Comment */}
                <p className="text-xs text-[#888888] leading-relaxed">
                  {rev.comment}
                </p>

                {/* Pros List if available */}
                {rev.pros && rev.pros.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {rev.pros.map((pro, i) => (
                      <span
                        key={i}
                        className="bg-[#0F0F0F] text-[#00FF66] border border-[#333333] px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"
                      >
                        <Check className="w-2 h-2" />
                        {pro}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Card arrival condition score & helpful button */}
              <div className="pt-2.5 border-t border-[#333333] flex items-center justify-between text-xs text-[#888888] font-mono">
                {rev.cardConditionRating && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">Blister Grade:</span>
                    <span className="text-[10px] font-bold text-[#00FF66] bg-[#0F0F0F] px-1.5 py-0.5 rounded border border-[#333333]">
                      {rev.cardConditionRating}/10 Mint
                    </span>
                  </div>
                )}

                <button
                  onClick={() => voteHelpful(rev.id)}
                  className="flex items-center gap-1.5 text-[#888888] hover:text-white bg-[#0F0F0F] hover:bg-[#222222] px-2.5 py-1 rounded border border-[#333333] transition-colors"
                >
                  <ThumbsUp className="w-3 h-3 text-[#E61919]" />
                  <span className="text-[10px] font-semibold">Helpful ({rev.helpfulVotes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Writing Review */}
        <ReviewModal
          isOpen={isWriteReviewOpen}
          onClose={() => setIsWriteReviewOpen(false)}
        />
      </div>
    </section>
  );
};
