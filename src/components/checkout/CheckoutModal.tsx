import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Check, 
  ArrowRight, 
  Ticket, 
  Plus, 
  Minus, 
  Car, 
  Zap, 
  BookOpen,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { EventItem, TicketTier } from '../../types';
import { calculateOrderTotals, formatZAR, CheckoutAddOn } from '../../utils/ticketPricing';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  selectedTiers: { tier: TicketTier; quantity: number }[];
  onCompleteOrder: (orderDetails: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedTiers,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Cart tier quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    selectedTiers.forEach(item => {
      q[item.tier.id] = item.quantity;
    });
    return q;
  });

  // Sync state if selectedTiers updates
  useEffect(() => {
    const q: Record<string, number> = {};
    selectedTiers.forEach(item => {
      q[item.tier.id] = item.quantity;
    });
    setQuantities(q);
  }, [selectedTiers]);

  // Add-ons
  const [addOns, setAddOns] = useState<CheckoutAddOn[]>([
    { id: 'parking', name: 'VIP Priority Reserved Parking', price: 120, selected: false },
    { id: 'lanyard', name: 'Tour Commemorative Lanyard & Digital Guide', price: 85, selected: false },
    { id: 'express', name: 'Express Fast-Track Gate Lane', price: 50, selected: false },
  ]);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  // Attendee info
  const [fullName, setFullName] = useState('Varun Singh');
  const [email, setEmail] = useState('varunsingh5691@gmail.com');
  const [phone, setPhone] = useState('+27 82 459 8123');
  const [idNumber, setIdNumber] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instant_eft' | 'apple_pay' | 'snapscan'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Reservation countdown timer (10 minutes)
  const [secondsRemaining, setSecondsRemaining] = useState(600);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const currentCartItems = event.tiers
    .map(tier => ({
      id: tier.id,
      eventId: event.id,
      eventTitle: event.title,
      tierId: tier.id,
      tierName: tier.name,
      unitPrice: tier.price,
      quantity: quantities[tier.id] || 0,
      eventDate: event.date,
      venue: event.venue,
    }))
    .filter(item => item.quantity > 0);

  const totals = calculateOrderTotals(currentCartItems, addOns, appliedPromo);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'SAVE50' || code === 'EARLYBIRD') {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promotional voucher code.');
    }
  };

  const toggleAddOn = (id: string) => {
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const handleQuantityAdjust = (tierId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[tierId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [tierId]: updated };
    });
  };

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setStep(3);
  };

  const handleFinalSubmit = () => {
    const orderData = {
      event,
      cartItems: currentCartItems,
      addOns: addOns.filter(a => a.selected),
      totals,
      attendee: {
        fullName,
        email,
        phone,
        idNumber,
      },
      paymentMethod,
    };
    onCompleteOrder(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#10131C] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-[#0C0F17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950 font-bold">
              <Ticket className="w-4 h-4 -rotate-12" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Secure Express Checkout
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-md">
                {event.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-3 border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`py-3 text-center border-b-2 transition-colors ${
              step === 1 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1. Tickets &amp; Add-ons
          </button>
          <button
            onClick={() => totals.itemCount > 0 && setStep(2)}
            disabled={totals.itemCount === 0}
            className={`py-3 text-center border-b-2 transition-colors ${
              step === 2 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            2. Attendee Info
          </button>
          <button
            onClick={() => fullName && email && totals.itemCount > 0 && setStep(3)}
            disabled={!fullName || !email || totals.itemCount === 0}
            className={`py-3 text-center border-b-2 transition-colors ${
              step === 3 ? 'border-amber-400 text-amber-400 bg-amber-400/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            3. Payment
          </button>
        </div>

        {/* Body Content per Step */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Tickets & Add-ons */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Selected Tickets</h3>
                <div className="space-y-3">
                  {event.tiers.map((tier) => {
                    const qty = quantities[tier.id] || 0;
                    return (
                      <div
                        key={tier.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          qty > 0 ? 'bg-zinc-900/90 border-amber-400/40' : 'bg-zinc-900/30 border-zinc-800/80 opacity-70'
                        }`}
                      >
                        <div className="flex-1">
                          <span className="text-sm font-bold text-white block">{tier.name}</span>
                          <span className="text-xs text-amber-400 font-mono font-semibold">
                            {formatZAR(tier.price)} <span className="text-zinc-500 font-normal">each</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => handleQuantityAdjust(tier.id, -1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white font-mono">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityAdjust(tier.id, 1)}
                            disabled={qty >= 10}
                            className="w-7 h-7 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold flex items-center justify-center text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="pt-2 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-white mb-2">Enhance Your Experience</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {addOns.map((addon) => (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        addon.selected
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-zinc-200">{addon.name}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          addon.selected ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-700'
                        }`}>
                          {addon.selected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{formatZAR(addon.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voucher Code */}
              <div className="pt-2 border-t border-zinc-800">
                <label className="text-xs font-bold text-zinc-400 block mb-1.5">
                  Have a Promo Code or Fan Voucher?
                </label>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10 or SAVE50"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 uppercase font-mono placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    ✓ Promo "{appliedPromo}" applied successfully (-{formatZAR(totals.discountAmount)})
                  </span>
                )}
                {promoError && (
                  <span className="text-xs text-rose-400 block mt-1">{promoError}</span>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Attendee Info */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Attendee &amp; Ticket Delivery</h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Digital QR codes will be cryptographically issued to this email and mobile number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Full Name (as per ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">
                    Mobile Number (SMS Pass) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">
                    SA ID / Passport Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="For high-security entry"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>POPIA compliant: Your data is only used for turnstile gate verification.</span>
              </div>
            </form>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Select South African Payment Rail</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Transactions are routed via 3D Secure 2.0 with instantaneous bank tokenization.
                </p>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('instant_eft')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'instant_eft'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Capitec / Instant EFT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-bold">Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('snapscan')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'snapscan'
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-bold">SnapScan / Zapper</span>
                </button>
              </div>

              {/* Dynamic form based on paymentMethod */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                    <span>Cardholder: <strong>{fullName}</strong></span>
                    <span className="font-mono">Visa / Mastercard 3D Secure</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400 block">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 block">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'instant_eft' && (
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                  <span className="font-bold text-amber-400 block">Supported Instant EFT Banks:</span>
                  <p className="text-zinc-400">
                    Capitec Pay, FNB, Standard Bank, Absa, Nedbank, Investec, TymeBank, and Discovery Bank.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    No account proof needed. Direct app biometric confirmation.
                  </p>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-amber-400" />
                  <div>
                    <span className="font-bold block">Biometric Fast Pay Ready</span>
                    <span className="text-zinc-400 text-[11px]">Authenticate with Touch ID, Face ID, or Passcode.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'snapscan' && (
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                  <div>
                    <span className="font-bold block">Scan &amp; Pay</span>
                    <span className="text-zinc-400 text-[11px]">Instant QR scan via SnapScan or Zapper app.</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer: Price Summary & Navigation */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-[#0C0F17] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Price Breakdown Preview */}
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>{totals.itemCount} Ticket{totals.itemCount !== 1 ? 's' : ''}</span>
              <span>&middot;</span>
              <span>Fee: {formatZAR(totals.bookingFee)}</span>
              {totals.discountAmount > 0 && (
                <>
                  <span>&middot;</span>
                  <span className="text-emerald-400">Disc: -{formatZAR(totals.discountAmount)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-400">Total:</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {formatZAR(totals.grandTotal)}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">(incl. 15% VAT)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={totals.itemCount === 0}
                onClick={() => setStep((step + 1) as any)}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-zinc-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-7 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-400/25 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay {formatZAR(totals.grandTotal)}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
