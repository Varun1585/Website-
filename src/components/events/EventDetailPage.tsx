import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Info, 
  Plus, 
  Minus, 
  Ticket, 
  Check, 
  Share2, 
  Heart,
  Navigation
} from 'lucide-react';
import { EventItem, TicketTier } from '../../types';
import { formatZAR } from '../../utils/ticketPricing';

interface EventDetailPageProps {
  event: EventItem;
  onBack: () => void;
  onProceedToCheckout: (event: EventItem, selectedTiers: { tier: TicketTier; quantity: number }[]) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onBack,
  onProceedToCheckout,
  isSaved = false,
  onToggleSave,
}) => {
  // Quantities per tier
  const [tierQuantities, setTierQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    event.tiers.forEach((tier, index) => {
      // Default select 1 ticket for the first tier to make testing and buying instantaneous
      initial[tier.id] = index === 0 ? 1 : 0;
    });
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'tiers' | 'venue' | 'lineup' | 'terms'>('tiers');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(event.tiers[0]?.name || null);

  const handleQuantityChange = (tierId: string, delta: number, max: number) => {
    setTierQuantities(prev => {
      const current = prev[tierId] || 0;
      const updated = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [tierId]: updated };
    });
  };

  const selectedTierList = event.tiers
    .map(tier => ({ tier, quantity: tierQuantities[tier.id] || 0 }))
    .filter(item => item.quantity > 0);

  const totalTickets = selectedTierList.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedTierList.reduce((sum, item) => sum + item.tier.price * item.quantity, 0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#0B0D13] min-h-screen text-zinc-100 pb-28 sm:pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-zinc-800/80 bg-[#0E121A]/80 backdrop-blur-md sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All Events</span>
          </button>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(event.id)}
                className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative w-full overflow-hidden bg-black min-h-[300px] sm:min-h-[380px] flex items-end">
        <img 
          src={event.heroBanner || event.coverImage}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13] via-[#0B0D13]/70 to-black/40" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-[10px]">
              {event.categoryLabel}
            </span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-300 font-medium">{event.organizer}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
            {event.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{event.time} (Gates: {event.doorsOpen})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Ticket Selection Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Tabs, Tiers & Venue Map */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab('tiers')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                  activeTab === 'tiers'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                1. Select Tickets
              </button>

              <button
                onClick={() => setActiveTab('venue')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                  activeTab === 'venue'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                2. Venue &amp; Seating Map
              </button>

              {event.lineup && event.lineup.length > 0 && (
                <button
                  onClick={() => setActiveTab('lineup')}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                    activeTab === 'lineup'
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  3. Lineup
                </button>
              )}

              <button
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                  activeTab === 'terms'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Event Guidelines
              </button>
            </div>

            {/* Tab: Select Tickets */}
            {activeTab === 'tiers' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span>Available Admission Categories</span>
                  <span>Direct QR Turnstile Issuance</span>
                </div>

                {event.tiers.map((tier) => {
                  const qty = tierQuantities[tier.id] || 0;
                  return (
                    <div
                      key={tier.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        qty > 0
                          ? 'bg-[#151924] border-amber-400/60 shadow-lg shadow-amber-500/5'
                          : 'bg-[#12151E] border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Tier Details */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">
                              {tier.name}
                            </h3>
                            {tier.available < 50 && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-mono">
                                Only {tier.available} left
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {tier.description}
                          </p>

                          {/* Perks List */}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2">
                            {tier.perks.map((perk, i) => (
                              <span key={i} className="text-[11px] text-zinc-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                {perk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & Quantity Counter */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                          <div className="text-left sm:text-right">
                            <span className="text-lg font-black text-amber-400 font-mono">
                              {formatZAR(tier.price)}
                            </span>
                            <span className="block text-[10px] text-zinc-500 uppercase">per ticket</span>
                          </div>

                          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(tier.id, -1, 10)}
                              disabled={qty === 0}
                              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 flex items-center justify-center text-white transition-colors"
                              aria-label={`Decrease quantity for ${tier.name}`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-white font-mono tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(tier.id, 1, 10)}
                              disabled={qty >= 10 || tier.available === 0}
                              className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 flex items-center justify-center text-zinc-950 font-bold transition-colors"
                              aria-label={`Increase quantity for ${tier.name}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: Venue & Interactive Seating Map */}
            {activeTab === 'venue' && (
              <div className="p-6 rounded-2xl bg-[#12151E] border border-zinc-800/80 space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Interactive Venue Layout &amp; Stadium Seating
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select a zone below to inspect spectator sightlines, sound coverage, and gate entrances.
                  </p>
                </div>

                {/* Simulated Interactive SVG Stadium / Arena Blueprint */}
                <div className="relative w-full aspect-[16/9] bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Stage Area */}
                  <div className="w-3/5 h-12 rounded-t-xl bg-gradient-to-b from-amber-500/30 to-amber-500/10 border-t-2 border-amber-400 flex items-center justify-center text-xs font-bold text-amber-300 tracking-widest uppercase mb-4 shadow-lg shadow-amber-500/10">
                    STAGE / PITCH MAIN STAGE
                  </div>

                  {/* Golden Circle Zone */}
                  <div 
                    onClick={() => setSelectedZone('Golden Circle')}
                    className={`w-3/4 py-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center mb-3 ${
                      selectedZone?.includes('Golden')
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-zinc-900/60 border-zinc-700/60 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    <span className="text-xs font-bold">Zone A · Golden Circle Front Standing</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Unobstructed view · 15m to artist</span>
                  </div>

                  {/* General Lawn & Grandstand */}
                  <div className="w-full grid grid-cols-3 gap-2">
                    <div 
                      onClick={() => setSelectedZone('West Upper')}
                      className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                        selectedZone?.includes('West')
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">West Stands</span>
                      <span className="text-[9px] text-zinc-500">Covered seating</span>
                    </div>

                    <div 
                      onClick={() => setSelectedZone('General Standing')}
                      className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                        selectedZone?.includes('General')
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">General Arena</span>
                      <span className="text-[9px] text-zinc-500">Festival lawn &amp; food stalls</span>
                    </div>

                    <div 
                      onClick={() => setSelectedZone('VIP Lounge')}
                      className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                        selectedZone?.includes('VIP')
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">VIP Deck</span>
                      <span className="text-[9px] text-zinc-500">Elevated terrace &amp; bar</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between w-full text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 font-mono">
                    <span>Gate 1 (Main Entrance)</span>
                    <span>Gate 2 (VIP Express Lane)</span>
                    <span>Gate 3 (Food Village &amp; Parking)</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Venue Address: <strong className="text-zinc-200">{event.address}, {event.city}</strong>. Dedicated parking marshals on site.
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Lineup */}
            {activeTab === 'lineup' && event.lineup && (
              <div className="p-6 rounded-2xl bg-[#12151E] border border-zinc-800/80 space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-white mb-2">
                  Artist &amp; Performer Schedule
                </h3>

                <div className="space-y-3">
                  {event.lineup.map((artist, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                      <div>
                        <span className="text-sm font-bold text-white block">{artist.name}</span>
                        <span className="text-xs text-zinc-400">{artist.role}</span>
                      </div>
                      {artist.time && (
                        <div className="px-2.5 py-1 bg-zinc-800 rounded-lg text-xs font-mono text-amber-400 font-semibold">
                          {artist.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Terms & Guidelines */}
            {activeTab === 'terms' && (
              <div className="p-6 rounded-2xl bg-[#12151E] border border-zinc-800/80 space-y-4 text-xs text-zinc-400 leading-relaxed animate-in fade-in">
                <h3 className="text-base font-bold text-white mb-2">
                  Event Entry Policy &amp; Security Protocol
                </h3>
                <p>
                  1. <strong className="text-zinc-200">Age Restrictions:</strong> {event.ageRestriction}. Please ensure attendees carry legitimate photo ID or South African Smart ID cards.
                </p>
                <p>
                  2. <strong className="text-zinc-200">Digital QR Verification:</strong> Screenshot or printed copies must maintain clean contrast. Digital QR passes will rotate cryptographic tokens 2 hours prior to doors opening to prevent fraudulent scalping.
                </p>
                <p>
                  3. <strong className="text-zinc-200">Refunds &amp; Cancellations:</strong> Full face-value refund guaranteed if the event is cancelled. Transfer to friends or family is complimentary via your User Dashboard.
                </p>
              </div>
            )}

            {/* Full Event Description Section */}
            <div className="p-6 rounded-2xl bg-[#12151E] border border-zinc-800/80 space-y-3">
              <h3 className="text-base font-bold text-white">About the Event</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {event.description}
              </p>
            </div>

          </div>

          {/* Right Column: Order Summary Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#12151E] border border-zinc-800/90 rounded-2xl p-6 space-y-5 shadow-2xl">
              
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Order Summary
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5 truncate">
                  {event.title}
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  {event.date} &middot; {event.venue}
                </span>
              </div>

              {/* Selected Tier Breakdown */}
              <div className="space-y-2.5">
                {selectedTierList.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500">
                    <Ticket className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
                    Please select at least 1 ticket to proceed.
                  </div>
                ) : (
                  selectedTierList.map(({ tier, quantity }) => (
                    <div key={tier.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-zinc-200 block">{tier.name}</span>
                        <span className="text-zinc-500 font-mono">
                          {quantity} &times; {formatZAR(tier.price)}
                        </span>
                      </div>
                      <span className="font-bold text-white font-mono">
                        {formatZAR(tier.price * quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal & Booking Note */}
              <div className="border-t border-zinc-800/80 pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Tickets Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatZAR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Service &amp; Turnstile Fee</span>
                  <span className="font-mono text-zinc-200">
                    {totalTickets > 0 ? 'R15.00' : 'R0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Estimated Total</span>
                  <span className="font-black text-amber-400 font-mono text-lg">
                    {formatZAR(totalTickets > 0 ? subtotal + 15 : 0)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={() => onProceedToCheckout(event, selectedTierList)}
                disabled={totalTickets === 0}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>
                  {totalTickets === 0 ? 'Select Tickets Above' : `Checkout (${totalTickets} Ticket${totalTickets > 1 ? 's' : ''})`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS 3D Secure 2.0 Encrypted</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Viewports */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0D13]/95 backdrop-blur-md border-t border-zinc-800 p-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 block uppercase">
            {totalTickets} Ticket{totalTickets !== 1 ? 's' : ''} Selected
          </span>
          <span className="text-base font-black text-amber-400 font-mono">
            {formatZAR(totalTickets > 0 ? subtotal + 15 : 0)}
          </span>
        </div>

        <button
          onClick={() => onProceedToCheckout(event, selectedTierList)}
          disabled={totalTickets === 0}
          className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Ticket className="w-4 h-4" />
          <span>Checkout</span>
        </button>
      </div>

    </div>
  );
};
