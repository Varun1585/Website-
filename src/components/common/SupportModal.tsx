import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Headphones, 
  Mail, 
  Phone,
  Clock
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('Ticket Inquiry');
  const [message, setMessage] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#12151E] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">OpenTickets Concierge Support</h3>
            <span className="text-xs text-zinc-400 block">7 Days a Week &middot; 07:00 &ndash; 23:00 SAST</span>
          </div>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <h4 className="text-base font-bold">Inquiry Dispatched!</h4>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">
              Our live South African concierge agent will reply via email and SMS within 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Inquiry Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="Ticket Inquiry">Ticket Inquiry / Barcode Issue</option>
                <option value="Refund Request">Refund or Event Postponement</option>
                <option value="Transfer Assistance">Ticket Transfer Assistance</option>
                <option value="Host an Event">Host an Event / Organizer Portal</option>
                <option value="General Support">General Box Office Support</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Ticket or Order # (Optional)</label>
              <input
                type="text"
                placeholder="e.g. OT-2026-APPEL-9421"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Message Details *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your request or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Avg Response: &lt; 15 mins
              </span>
              <span>Direct WhatsApp: +27 82 459 8123</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl font-bold transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Concierge</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
