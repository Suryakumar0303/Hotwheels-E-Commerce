import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Sparkles, Check } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductId?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, defaultProductId }) => {
  const { products, addReview } = useStore();

  const [productId, setProductId] = useState(defaultProductId || (products.length > 0 ? products[0].id : ''));
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [cardConditionRating, setCardConditionRating] = useState(10);
  const [proInput, setProInput] = useState('');
  const [prosList, setProsList] = useState<string[]>(['Mint unpunched card', 'Smooth Real Riders']);

  if (!isOpen) return null;

  const handleAddPro = () => {
    if (proInput.trim() && !prosList.includes(proInput.trim())) {
      setProsList([...prosList, proInput.trim()]);
      setProInput('');
    }
  };

  const handleRemovePro = (p: string) => {
    setProsList(prosList.filter((item) => item !== p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !title.trim() || !comment.trim()) return;

    addReview({
      productId,
      userName: userName.trim(),
      userAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000000)}?auto=format&fit=crop&w=200&q=80`,
      userCity: userCity.trim() || 'Collector Hub',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verifiedBuyer: true,
      pros: prosList,
      cardConditionRating,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-[#111111] border border-[#333333] rounded-xl w-full max-w-xl p-5 sm:p-6 space-y-5 text-[#E0E0E0] shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-[#E61919] font-bold uppercase font-mono mb-1">
              <Sparkles className="w-3 h-3" />
              <span>COLLECTOR COMMUNITY FEEDBACK</span>
            </div>
            <h3 className="text-base font-black italic text-white uppercase tracking-tight">
              WRITE DIECAST REVIEW
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white rounded border border-[#333333] hover:border-[#E61919] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Select Product */}
          <div>
            <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
              Select Diecast Model *
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E61919]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.specs.editionType})
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
              Collector Score *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-0.5 text-[#444444] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#FFB800] text-[#FFB800]'
                          : 'text-[#333333]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-bold text-xs text-[#FFB800] font-mono">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* User Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Rahul S."
                className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
              />
            </div>
            <div>
              <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
                Collector Location
              </label>
              <input
                type="text"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
              />
            </div>
          </div>

          {/* Card Condition Score Slider (1-10) */}
          <div className="bg-[#1A1A1A] p-3 rounded border border-[#333333] space-y-1.5">
            <div className="flex justify-between font-bold text-xs font-mono">
              <span className="text-[#888888] uppercase text-[10px]">Arrival Card Condition Score:</span>
              <span className="text-[#00FF66]">{cardConditionRating} / 10 (Mint Grade)</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={cardConditionRating}
              onChange={(e) => setCardConditionRating(Number(e.target.value))}
              className="w-full accent-[#E61919] cursor-pointer"
            />
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
              Review Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flawless unpunched card, Spectraflame paint is insane!"
              className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono mb-1">
              Detailed Experience *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Details on paint, tampo precision, Real Riders, packaging..."
              className="w-full bg-[#0F0F0F] border border-[#333333] rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
            />
          </div>

          {/* Pros Tags */}
          <div className="space-y-1">
            <label className="block text-[#888888] text-[10px] font-bold uppercase font-mono">
              Key Highlights
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={proInput}
                onChange={(e) => setProInput(e.target.value)}
                placeholder="Add pro (e.g. Heavy metal base)"
                className="flex-1 bg-[#0F0F0F] border border-[#333333] rounded px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E61919]"
              />
              <button
                type="button"
                onClick={handleAddPro}
                className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white font-bold rounded text-xs uppercase"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {prosList.map((p, idx) => (
                <span
                  key={idx}
                  onClick={() => handleRemovePro(p)}
                  className="bg-[#1A1A1A] text-[#00FF66] border border-[#333333] px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer hover:border-[#E61919] hover:text-[#E61919] transition-colors"
                >
                  <Check className="w-2.5 h-2.5" /> {p} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#333333]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[#888888] hover:text-white text-xs uppercase font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-black text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(230,25,25,0.25)]"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
