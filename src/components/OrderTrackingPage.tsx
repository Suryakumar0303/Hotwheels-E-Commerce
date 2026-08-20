import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Truck, 
  CheckCircle2, 
  Package, 
  Clock, 
  Search, 
  Copy, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  Play, 
  FileText, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { 
    orders, 
    currentOrder, 
    setCurrentOrder, 
    advanceOrderStatus, 
    getOrderByIdOrTracking, 
    formatPrice, 
    setActivePage,
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const activeOrder = currentOrder || (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getOrderByIdOrTracking(searchQuery);
    if (found) {
      setCurrentOrder(found);
      showToast('Order Found', `Loaded tracking for ${found.id}`, 'success');
    } else {
      showToast('Order Not Found', 'No order matched that ID, tracking number, or email.', 'error');
    }
  };

  const copyTrackingNumber = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.trackingNumber);
    setCopied(true);
    showToast('Copied', 'Tracking number copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIndex = (status: OrderStatus) => {
    const statuses: OrderStatus[] = [
      'order_placed',
      'confirmed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];
    return statuses.indexOf(status);
  };

  const STEPS_CONFIG = [
    { key: 'order_placed', label: 'Order Placed', desc: 'Received & vault verified' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Customs clearance processed' },
    { key: 'packed', label: 'Packed', desc: 'Inspected mint card in protector' },
    { key: 'shipped', label: 'Shipped', desc: 'Dispatched via Air Courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Assigned to local delivery agent' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over in collector condition' },
  ];

  return (
    <div className="bg-[#0F0F0F] py-8 px-4 sm:px-6 lg:px-8 text-[#E0E0E0] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Live Lookup Search Bar */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#111111] border border-[#333333] text-[#E61919] text-[10px] font-bold uppercase font-mono tracking-wider mb-2">
                <Truck className="w-3 h-3" />
                <span>AIR CARGO TRACKING SYSTEM</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight">
                TRACK DIECAST SHIPMENT
              </h1>
              <p className="text-xs text-[#888888]">
                Real-time updates, customs milestones & courier handoffs.
              </p>
            </div>

            {/* Quick selector if multiple orders exist */}
            {orders.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#888888] font-mono">Recent Orders:</span>
                <div className="flex gap-1.5 overflow-x-auto">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setCurrentOrder(o)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                        activeOrder?.id === o.id
                          ? 'bg-[#E61919] text-white'
                          : 'bg-[#0F0F0F] text-[#888888] hover:text-white border border-[#333333]'
                      }`}
                    >
                      {o.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-98421), AWB (e.g. APD-EXP...), or Mobile number"
                className="w-full bg-[#0F0F0F] border border-[#333333] text-xs text-white placeholder-zinc-600 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#E61919] font-mono"
              />
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#E61919] hover:bg-[#FF2E2E] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(230,25,25,0.25)]"
            >
              Track
            </button>
          </form>
        </div>

        {/* If no order found */}
        {!activeOrder ? (
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-10 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#666666] mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">No Active Orders Found</h3>
            <p className="text-xs text-[#888888] max-w-sm mx-auto">
              Place an order from our catalog or enter your tracking code above to follow shipment progress.
            </p>
            <button
              onClick={() => setActivePage('shop')}
              className="px-5 py-2 bg-[#E61919] text-white font-bold text-xs uppercase rounded hover:bg-[#FF2E2E]"
            >
              Browse Diecast Vault
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Order Badge & Quick Details */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#333333]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-black text-white font-mono">{activeOrder.id}</h2>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#111111] text-[#E61919] border border-[#333333] font-mono">
                      {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#888888] font-mono">
                    Placed: <strong className="text-white">{new Date(activeOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Tracking Number pill with copy */}
                  <div className="flex items-center gap-2 bg-[#0F0F0F] border border-[#333333] px-3 py-1.5 rounded text-xs">
                    <span className="text-[#666666] font-mono text-[10px]">AWB:</span>
                    <span className="font-mono font-bold text-white text-xs">{activeOrder.trackingNumber}</span>
                    <button
                      onClick={copyTrackingNumber}
                      className="p-1 hover:text-[#E61919] text-[#888888] transition-colors"
                      title="Copy AWB"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Advance Step Interactive Simulator */}
                  {activeOrder.status !== 'delivered' && (
                    <button
                      onClick={() => advanceOrderStatus(activeOrder.id)}
                      className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#222222] text-[#E61919] border border-[#333333] hover:border-[#E61919] text-xs font-bold font-mono px-3 py-1.5 rounded transition-all"
                      title="Simulate Next Delivery Milestone"
                    >
                      <Play className="w-3 h-3 fill-[#E61919]" />
                      <span>Next Milestone →</span>
                    </button>
                  )}

                  {/* View Invoice Button */}
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="flex items-center gap-1.5 bg-[#0F0F0F] hover:bg-[#222222] text-[#E0E0E0] border border-[#333333] text-xs font-bold px-3 py-1.5 rounded transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E61919]" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>

              {/* 6-Step Visual Progression Bar */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#888888] uppercase tracking-wider font-mono">
                  <span>Shipment Lifecycle Status</span>
                  <span className="text-[#E61919]">
                    Step {getStatusIndex(activeOrder.status) + 1} of 6
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {STEPS_CONFIG.map((step, idx) => {
                    const currentIdx = getStatusIndex(activeOrder.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-lg border flex flex-col justify-between space-y-2 transition-all ${
                          isCurrent
                            ? 'bg-[#111111] border-[#E61919] text-white shadow-[0_0_10px_rgba(230,25,25,0.2)]'
                            : isDone
                            ? 'bg-[#111111] border-[#00FF66]/40 text-[#E0E0E0]'
                            : 'bg-[#0F0F0F] border-[#333333] text-[#666666]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                            isCurrent
                              ? 'bg-[#E61919] text-white'
                              : isDone
                              ? 'bg-[#00FF66] text-black'
                              : 'bg-[#222222] text-[#666666]'
                          }`}>
                            {isDone && !isCurrent ? <CheckCircle2 className="w-3 h-3 stroke-[3]" /> : idx + 1}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono font-bold text-[#E61919] uppercase animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold leading-tight uppercase ${isCurrent ? 'text-[#E61919]' : isDone ? 'text-white' : 'text-[#666666]'}`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-[#888888] mt-0.5 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Carrier & Estimated Delivery Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[#333333]">
                <div className="bg-[#0F0F0F] p-3.5 rounded border border-[#333333] flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center text-[#E61919] flex-shrink-0 border border-[#333333]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[#888888] block text-[10px] uppercase font-mono">Carrier & Freight</span>
                    <span className="font-bold text-white block">{activeOrder.carrier.name}</span>
                    <span className="text-[10px] text-[#666666] block font-mono">Hub: {activeOrder.carrier.dispatchLocation}</span>
                  </div>
                </div>

                <div className="bg-[#0F0F0F] p-3.5 rounded border border-[#333333] flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center text-[#00FF66] flex-shrink-0 border border-[#333333]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[#888888] block text-[10px] uppercase font-mono">Estimated Delivery</span>
                    <span className="font-bold text-[#00FF66] block">{activeOrder.carrier.estimatedDelivery}</span>
                    <span className="text-[10px] text-[#666666] block font-mono">Express Air Transit</span>
                  </div>
                </div>

                <div className="bg-[#0F0F0F] p-3.5 rounded border border-[#333333] flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center text-white flex-shrink-0 border border-[#333333]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[#888888] block text-[10px] uppercase font-mono">Destination</span>
                    <span className="font-bold text-white block truncate">{activeOrder.customer.city}, {activeOrder.customer.country}</span>
                    <span className="text-[10px] text-[#666666] block truncate font-mono">{activeOrder.customer.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Timeline + Items in Package */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 Cols: Detailed Audit Timeline */}
              <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#E61919]" />
                    <span>Tracking Milestones</span>
                  </h3>
                  <span className="text-[10px] text-[#888888] font-mono">GPS VERIFIED</span>
                </div>

                <div className="space-y-5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-[#333333]">
                  {activeOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-8 space-y-1">
                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded flex items-center justify-center z-10 transition-all ${
                          step.current
                            ? 'bg-[#E61919] text-white shadow-[0_0_10px_#E61919]'
                            : step.completed
                            ? 'bg-[#00FF66] text-black'
                            : 'bg-[#0F0F0F] border border-[#333333] text-[#666666]'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#666666]" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold uppercase ${step.current ? 'text-[#E61919]' : step.completed ? 'text-white' : 'text-[#666666]'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] font-mono text-[#888888] bg-[#0F0F0F] px-2 py-0.5 rounded border border-[#333333]">
                          {step.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-[#888888] leading-relaxed">
                        {step.description}
                      </p>

                      {step.location && (
                        <div className="flex items-center gap-1 text-[10px] text-[#666666] font-mono pt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-[#888888]" />
                          <span>Hub: {step.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Automated Customer Notifications & Item List */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Automated Notification Broadcasts */}
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#333333] pb-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#E61919]" />
                      <span>Notifications Dispatched</span>
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Order Confirmation Notification */}
                    <div className="p-2.5 bg-[#0F0F0F] rounded border border-[#333333] space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 text-[#00FF66] font-bold font-mono">
                          <Mail className="w-3 h-3" /> Email Dispatch
                        </span>
                        <span className="text-[#666666] font-mono">SENT</span>
                      </div>
                      <p className="text-[#888888] text-[11px]">
                        Sent to <strong className="text-white">{activeOrder.customer.email}</strong> with invoice & certificate.
                      </p>
                    </div>

                    {/* SMS / WhatsApp Notification */}
                    <div className="p-2.5 bg-[#0F0F0F] rounded border border-[#333333] space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 text-[#E0E0E0] font-bold font-mono">
                          <Phone className="w-3 h-3 text-[#E61919]" /> SMS / WhatsApp Live Link
                        </span>
                        <span className="text-[#666666] font-mono">DELIVERED</span>
                      </div>
                      <p className="text-[#888888] text-[11px]">
                        Sent to <strong className="text-white">{activeOrder.customer.mobile}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ordered Items In This Package */}
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 space-y-3.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-[#333333] pb-2.5">
                    Package Contents ({activeOrder.items.length})
                  </h3>

                  <div className="space-y-2.5">
                    {activeOrder.items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-2.5 bg-[#0F0F0F] p-2 rounded border border-[#333333]">
                        <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#333333] flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white uppercase truncate">{item.product.name}</h4>
                          <span className="text-[10px] text-[#888888] block font-mono">
                            Qty: {item.quantity} • {formatPrice(item.product.price)}
                          </span>
                        </div>
                        {item.withProtectorCase && (
                          <span className="text-[9px] font-bold font-mono text-[#E61919] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#333333] flex-shrink-0">
                            +PROTECTOR
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#333333] pt-2.5 flex justify-between items-baseline text-xs font-mono">
                    <span className="text-[#888888]">PAID VIA {activeOrder.payment.method.toUpperCase()}</span>
                    <span className="text-sm font-bold text-[#E61919]">
                      {formatPrice(activeOrder.pricing.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collector Receipt Modal */}
        {showInvoiceModal && activeOrder && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#333333] rounded-xl w-full max-w-2xl p-6 space-y-5 text-[#E0E0E0] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div>
                  <h3 className="text-base font-black text-white font-mono uppercase">HOTDRIVE APEX INVOICE</h3>
                  <span className="text-[10px] text-[#888888] font-mono">AUTHENTICITY & PURCHASE CERTIFICATE</span>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 text-[#888888] hover:text-white rounded border border-[#333333]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3 bg-[#1A1A1A] p-3 rounded border border-[#333333]">
                  <div>
                    <span className="text-[#666666] block text-[10px]">ORDER ID</span>
                    <span className="font-bold text-white">{activeOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[10px]">TRACKING AWB</span>
                    <span className="font-bold text-[#E61919]">{activeOrder.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[10px]">CUSTOMER</span>
                    <span className="font-bold text-white">{activeOrder.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[10px]">PAYMENT</span>
                    <span className="font-bold text-white uppercase">{activeOrder.payment.method} ({activeOrder.payment.status})</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-[#888888] uppercase">Product Breakdown</h4>
                  <div className="border border-[#333333] rounded overflow-hidden divide-y divide-[#222222] bg-[#1A1A1A]">
                    {activeOrder.items.map((item) => (
                      <div key={item.product.id} className="p-2.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white uppercase">{item.product.name}</span>
                          <span className="text-[10px] text-[#888888] block">
                            Scale {item.product.specs.scale} • Item #{item.product.specs.itemNumber}
                          </span>
                        </div>
                        <span className="font-bold text-[#E61919]">
                          {item.quantity} x {formatPrice(item.product.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-3 rounded border border-[#333333] space-y-1 text-right">
                  <div className="flex justify-between text-[#888888]">
                    <span>Subtotal:</span>
                    <span className="text-white">{formatPrice(activeOrder.pricing.subtotal)}</span>
                  </div>
                  {activeOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-[#00FF66]">
                      <span>Discount:</span>
                      <span>-{formatPrice(activeOrder.pricing.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#888888]">
                    <span>Air Express:</span>
                    <span>{activeOrder.pricing.shipping === 0 ? 'FREE' : formatPrice(activeOrder.pricing.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-[#888888]">
                    <span>Customs & GST:</span>
                    <span className="text-white">{formatPrice(activeOrder.pricing.tax)}</span>
                  </div>
                  <div className="border-t border-[#333333] pt-1.5 flex justify-between font-black text-sm text-[#E61919]">
                    <span>TOTAL PAID:</span>
                    <span>{formatPrice(activeOrder.pricing.total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#00FF66] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AUTHENTIC MATTEL IMPORT SEAL
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#E61919] hover:bg-[#FF2E2E] text-white font-bold text-xs uppercase rounded"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
