import React, { useState } from 'react';
import { 
  User, 
  Ticket, 
  Clock, 
  Calendar, 
  MapPin, 
  Download, 
  Send, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Heart, 
  FileText, 
  Settings, 
  Smartphone,
  X,
  Sparkles
} from 'lucide-react';
import { TicketPass, OrderRecord, EventItem } from '../../types';
import { formatZAR } from '../../utils/ticketPricing';

interface UserProfileDashboardProps {
  orders: OrderRecord[];
  savedEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onTransferTicket: (ticketId: string, recipientName: string, recipientEmail: string) => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  orders,
  savedEvents,
  onSelectEvent,
  onTransferTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'passes' | 'orders' | 'saved' | 'settings'>('passes');
  
  // Selected ticket for full QR inspector
  const [inspectingTicket, setInspectingTicket] = useState<TicketPass | null>(null);
  
  // Transfer ticket modal state
  const [transferringTicket, setTransferringTicket] = useState<TicketPass | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Flatten all tickets across orders
  const allTickets: TicketPass[] = orders.flatMap(o => o.tickets);
  const activeTickets = allTickets.filter(t => t.status === 'active');

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferringTicket || !recipientName || !recipientEmail) return;

    onTransferTicket(transferringTicket.id, recipientName, recipientEmail);
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setTransferringTicket(null);
      setRecipientName('');
      setRecipientEmail('');
    }, 1500);
  };

  const handleDownloadCalendar = (ticket: TicketPass) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OpenTickets//Event Pass//EN
BEGIN:VEVENT
SUMMARY:${ticket.eventTitle}
DESCRIPTION:OpenTickets Admission Pass: ${ticket.ticketCode} - Tier: ${ticket.tierName}
LOCATION:${ticket.venue}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ticket.ticketCode}-calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#0B0D13] min-h-screen text-zinc-100 py-8">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8">
        
        {/* Profile Header Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#131723] to-zinc-900 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-2xl shadow-lg shadow-amber-400/20">
              VS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Varun Singh</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Fan
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                varunsingh5691@gmail.com &middot; +27 82 459 8123
              </p>
              <div className="text-[11px] text-zinc-500">
                OpenTickets Member since 2024 &middot; VIP Concierge Active
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
            <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl text-center min-w-[90px]">
              <span className="text-lg font-black text-amber-400 font-mono block">
                {activeTickets.length}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Active Passes</span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl text-center min-w-[90px]">
              <span className="text-lg font-black text-white font-mono block">
                {orders.length}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Past Orders</span>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl text-center min-w-[90px]">
              <span className="text-lg font-black text-white font-mono block">
                {savedEvents.length}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Saved Events</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'passes'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets &amp; Passes ({activeTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Events ({savedEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Security &amp; Preferences</span>
          </button>
        </div>

        {/* Tab 1: My Tickets & Passes */}
        {activeTab === 'passes' && (
          <div className="space-y-4 animate-in fade-in">
            {allTickets.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 space-y-3">
                <Ticket className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No tickets in your account yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  When you book tickets for upcoming live concerts, derbies, or festivals, your digital QR passes will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {allTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between gap-4 ${
                      tkt.status === 'active'
                        ? 'bg-[#121520] border-zinc-800/90 hover:border-amber-400/50 shadow-lg'
                        : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                    }`}
                  >
                    {/* Top Row: Event & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                            tkt.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {tkt.status}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">{tkt.ticketCode}</span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {tkt.eventTitle}
                        </h3>
                      </div>

                      <button
                        onClick={() => setInspectingTicket(tkt)}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                        title="View Full QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 text-xs text-zinc-300 border-t border-zinc-800/60 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{tkt.date} &middot; {tkt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">{tkt.venue}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400 pt-1 font-mono text-[11px]">
                        <span>Tier: <strong className="text-zinc-200">{tkt.tierName}</strong></span>
                        <span>Zone: <strong className="text-amber-400">{tkt.seatInfo || 'General'}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60">
                      <button
                        onClick={() => setInspectingTicket(tkt)}
                        className="py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show QR</span>
                      </button>

                      <button
                        onClick={() => handleDownloadCalendar(tkt)}
                        className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add Cal</span>
                      </button>

                      <button
                        disabled={tkt.status !== 'active'}
                        onClick={() => setTransferringTicket(tkt)}
                        className="py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Transfer</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 space-y-2">
                <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No past orders yet</h3>
                <p className="text-xs text-zinc-400">Your completed ticket purchases will be archived here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-5 rounded-2xl bg-[#12151E] border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-amber-400">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">{ord.date}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                          {ord.paymentMethod}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{ord.eventTitle}</h4>
                      <p className="text-xs text-zinc-400">{ord.itemsSummary}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase">Paid Total</span>
                        <span className="text-base font-bold text-white font-mono">
                          {formatZAR(ord.totalAmount)}
                        </span>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Events */}
        {activeTab === 'saved' && (
          <div className="space-y-4 animate-in fade-in">
            {savedEvents.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 space-y-2">
                <Heart className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No saved events</h3>
                <p className="text-xs text-zinc-400">Click the heart icon on any event card to bookmark it here for fast booking.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="p-4 rounded-2xl bg-[#12151E] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        {evt.categoryLabel}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{evt.title}</h4>
                      <p className="text-xs text-zinc-400">{evt.venue}, {evt.city}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                      <span className="font-mono text-zinc-300">{evt.date}</span>
                      <span className="font-bold text-amber-400 font-mono">From {formatZAR(evt.priceFrom)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Security & Preferences */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-[#12151E] border border-zinc-800/80 space-y-6 animate-in fade-in max-w-2xl">
            <h3 className="text-base font-bold text-white">Attendee Notification Preferences</h3>
            
            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">SMS Turnstile Gate Reminders</span>
                  <span className="text-zinc-400 text-[11px]">Receive an SMS link with your active pass 3 hours prior to gate opening.</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-amber-400 w-4 h-4 cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Tour &amp; Derby Presale Alerts</span>
                  <span className="text-zinc-400 text-[11px]">Notify me when early bird passes drop for my favorite sports and music genres.</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-amber-400 w-4 h-4 cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Two-Factor Authentication (2FA)</span>
                  <span className="text-zinc-400 text-[11px]">Require OTP verification when transferring tickets to prevent unauthorized claims.</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-amber-400 w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>
        )}

      </div>

      {/* Inspect Ticket QR Code Modal */}
      {inspectingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#12151E] border border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setInspectingTicket(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
              Official Entry Turnstile Pass
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              {inspectingTicket.eventTitle}
            </h3>

            {/* QR Card */}
            <div className="p-4 bg-white rounded-2xl shadow-xl mx-auto w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full text-zinc-950">
                <rect x="10" y="10" width="30" height="30" fill="currentColor" rx="3" />
                <rect x="15" y="15" width="20" height="20" fill="white" rx="2" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" rx="1" />
                <rect x="80" y="10" width="30" height="30" fill="currentColor" rx="3" />
                <rect x="85" y="15" width="20" height="20" fill="white" rx="2" />
                <rect x="90" y="20" width="10" height="10" fill="currentColor" rx="1" />
                <rect x="10" y="80" width="30" height="30" fill="currentColor" rx="3" />
                <rect x="15" y="85" width="20" height="20" fill="white" rx="2" />
                <rect x="20" y="90" width="10" height="10" fill="currentColor" rx="1" />
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
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-mono font-bold text-amber-400 block">
                {inspectingTicket.ticketCode}
              </span>
              <span className="text-xs text-zinc-300 font-semibold block">
                {inspectingTicket.tierName} &middot; {inspectingTicket.seatInfo}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Hold phone to scanner at gate. High screen brightness advised.
              </span>
            </div>

            <button
              onClick={() => setInspectingTicket(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Transfer Ticket Modal */}
      {transferringTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#12151E] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setTransferringTicket(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Secure Ticket Transfer
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Transfer Ticket to a Friend
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                A fresh cryptographic QR code will be generated for the recipient. Your original barcode will be permanently cancelled.
              </p>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Ticket:</span>
              <strong className="text-white block">{transferringTicket.eventTitle}</strong>
              <span className="text-amber-400 font-mono">{transferringTicket.ticketCode} ({transferringTicket.tierName})</span>
            </div>

            {transferSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="font-bold text-sm">Ticket Transferred Successfully!</h4>
                <p className="text-xs text-zinc-300">An invitation email has been dispatched to {recipientEmail}.</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johan van der Merwe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 block">Recipient Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. johan@example.co.za"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferringTicket(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Pass</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
