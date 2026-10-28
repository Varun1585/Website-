import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Share2, 
  ArrowRight, 
  Ticket, 
  Smartphone, 
  Calendar, 
  MapPin, 
  Printer,
  Sparkles,
  Lock
} from 'lucide-react';
import { TicketPass, OrderRecord } from '../../types';
import { formatZAR, generateTicketCode } from '../../utils/ticketPricing';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  orderData: any | null;
  onClose: () => void;
  onViewDashboard: () => void;
  onSaveConfirmedOrder: (order: OrderRecord) => void;
}

export const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  isOpen,
  orderData,
  onClose,
  onViewDashboard,
  onSaveConfirmedOrder,
}) => {
  // Processing stage: 'authorizing' -> 'otp' -> 'confirmed'
  const [stage, setStage] = useState<'authorizing' | 'otp' | 'confirmed'>('authorizing');
  const [otpCode, setOtpCode] = useState('784912');
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);
  const [walletAdded, setWalletAdded] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderData) return;
    
    // Reset state
    setStage('authorizing');
    setWalletAdded(false);

    // Auto transition through payment simulation stages
    const timer1 = setTimeout(() => {
      setStage('otp');
    }, 1800);

    return () => {
      clearTimeout(timer1);
    };
  }, [isOpen, orderData]);

  if (!isOpen || !orderData) return null;

  const handleApproveOtp = () => {
    const orderNumber = `OT-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}`;

    // Create digital passes for each ticket
    const tickets: TicketPass[] = [];
    orderData.cartItems.forEach((item: any) => {
      for (let i = 0; i < item.quantity; i++) {
        tickets.push({
          id: `tkt_${Date.now()}_${i}`,
          ticketCode: generateTicketCode(orderData.event.slug),
          orderId,
          eventId: orderData.event.id,
          eventTitle: orderData.event.title,
          tierName: item.tierName,
          venue: orderData.event.venue,
          date: orderData.event.date,
          time: orderData.event.time,
          attendeeName: orderData.attendee.fullName,
          attendeeEmail: orderData.attendee.email,
          attendeePhone: orderData.attendee.phone,
          status: 'active',
          purchasedAt: new Date().toISOString(),
          pricePaid: item.unitPrice,
          seatInfo: item.tierName.includes('Reserved') ? `Row C · Seat ${14 + i}` : 'General Admission Turnstile',
          qrCodeSeed: `${orderNumber}-${item.tierId}-${i}`,
        });
      }
    });

    const newOrder: OrderRecord = {
      orderId,
      orderNumber,
      date: new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }),
      eventId: orderData.event.id,
      eventTitle: orderData.event.title,
      itemsSummary: `${tickets.length} Ticket${tickets.length > 1 ? 's' : ''} (${tickets.map(t => t.tierName).join(', ')})`,
      totalAmount: orderData.totals.grandTotal,
      paymentMethod: orderData.paymentMethod.toUpperCase().replace('_', ' '),
      tickets,
    };

    setCreatedOrder(newOrder);
    onSaveConfirmedOrder(newOrder);
    setStage('confirmed');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#11141E] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#0B0D14] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Bank-Level 3D Secure 2.0</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Transaction ID: #TX-{Date.now().toString().slice(-6)}
          </span>
        </div>

        {/* Dynamic Stages */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STAGE 1: Authorizing */}
          {stage === 'authorizing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-amber-400 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Contacting Payment Gateway...</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Routing request securely to {orderData.paymentMethod.toUpperCase().replace('_', ' ')} with end-to-end tokenization.
                </p>
              </div>

              <div className="w-full max-w-xs bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}

          {/* STAGE 2: 3D Secure OTP Challenge */}
          {stage === 'otp' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  3D Secure Bank Verification
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  A one-time security authentication token has been generated for your bank account.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Merchant: <strong>OpenTickets South Africa</strong></span>
                  <span className="font-mono text-amber-400 font-bold">{formatZAR(orderData.totals.grandTotal)}</span>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    One-Time PIN (OTP)
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <span className="text-[10px] text-zinc-500 block text-center">
                    Simulated test token pre-filled for instant verification
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApproveOtp}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Issue Tickets</span>
              </button>
            </div>
          )}

          {/* STAGE 3: Confirmed & QR Pass Generated */}
          {stage === 'confirmed' && createdOrder && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              
              {/* Success Badge */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Payment Confirmed!</h3>
                <p className="text-xs text-zinc-400">
                  Order <span className="font-mono text-amber-400 font-bold">{createdOrder.orderNumber}</span> &middot; Your passes are active.
                </p>
              </div>

              {/* Digital Pass Preview Card */}
              <div className="rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Official Admission Pass
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                      {createdOrder.eventTitle}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-zinc-500 font-mono block">Pass 1 of {createdOrder.tickets.length}</span>
                    <span className="text-xs font-bold text-zinc-200">{createdOrder.tickets[0]?.tierName}</span>
                  </div>
                </div>

                {/* QR Code Centerpiece */}
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                    {/* High-fidelity stylized SVG QR Code simulation */}
                    <svg viewBox="0 0 120 120" className="w-32 h-32 text-zinc-950">
                      {/* Outer Position Squares */}
                      <rect x="10" y="10" width="30" height="30" fill="currentColor" rx="4" />
                      <rect x="15" y="15" width="20" height="20" fill="white" rx="2" />
                      <rect x="20" y="20" width="10" height="10" fill="currentColor" rx="1" />

                      <rect x="80" y="10" width="30" height="30" fill="currentColor" rx="4" />
                      <rect x="85" y="15" width="20" height="20" fill="white" rx="2" />
                      <rect x="90" y="20" width="10" height="10" fill="currentColor" rx="1" />

                      <rect x="10" y="80" width="30" height="30" fill="currentColor" rx="4" />
                      <rect x="15" y="85" width="20" height="20" fill="white" rx="2" />
                      <rect x="20" y="90" width="10" height="10" fill="currentColor" rx="1" />

                      {/* Random Grid Data Modules */}
                      <rect x="48" y="15" width="6" height="6" fill="currentColor" />
                      <rect x="60" y="22" width="8" height="6" fill="currentColor" />
                      <rect x="48" y="35" width="12" height="6" fill="currentColor" />
                      <rect x="70" y="45" width="10" height="6" fill="currentColor" />
                      <rect x="20" y="52" width="6" height="12" fill="currentColor" />
                      <rect x="35" y="55" width="14" height="6" fill="currentColor" />
                      <rect x="55" y="55" width="10" height="10" fill="currentColor" />
                      <rect x="80" y="55" width="8" height="8" fill="currentColor" />
                      <rect x="100" y="60" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="75" width="8" height="8" fill="currentColor" />
                      <rect x="65" y="85" width="14" height="6" fill="currentColor" />
                      <rect x="85" y="80" width="8" height="14" fill="currentColor" />
                      <rect x="100" y="95" width="10" height="8" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="text-center space-y-0.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {createdOrder.tickets[0]?.ticketCode}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Turnstile verification: Present this code at gate
                    </span>
                  </div>
                </div>

                {/* Ticket Details Strip */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800 text-zinc-300">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Attendee</span>
                    <span className="font-semibold text-white">{orderData.attendee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Date &amp; Time</span>
                    <span className="font-semibold text-white">{orderData.event.date}, {orderData.event.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Venue</span>
                    <span className="font-semibold text-white truncate block">{orderData.event.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">Seat / Zone</span>
                    <span className="font-semibold text-amber-400">{createdOrder.tickets[0]?.seatInfo}</span>
                  </div>
                </div>

              </div>

              {/* Wallet & Print Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWalletAdded(true)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    walletAdded
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{walletAdded ? 'Added to Wallet ✓' : 'Add to Apple Wallet'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF Pass</span>
                </button>
              </div>

              {/* View Dashboard Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewDashboard();
                }}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
              >
                <span>View Tickets in My Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
