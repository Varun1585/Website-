import React from 'react';
import { Ticket, ShieldCheck, Heart, Globe, MessageSquare, ExternalLink } from 'lucide-react';
import { ActiveScreen } from './Navbar';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenSupportModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupportModal }) => {
  return (
    <footer className="w-full bg-[#07090E] border-t border-zinc-800/80 text-zinc-400 text-xs">
      {/* Upper Footer: Trust & Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 border-b border-zinc-800/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950">
                <Ticket className="w-4 h-4 -rotate-12" />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white uppercase">
                OPEN<span className="text-amber-400">TICKETS</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              South Africa’s premier elegant ticketing engine for concerts, rugby festivals, soccer derbies, and cultural galas.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {/* Social icons */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                <span className="font-bold text-xs">in</span>
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                <span className="font-bold text-xs">fb</span>
              </a>
              <a
                href="#whatsapp"
                aria-label="WhatsApp Support"
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs tracking-wider uppercase">
              Explore Events
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                  Featured Concerts &amp; Live Music
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-amber-400 transition-colors">
                  Betway Premiership &amp; Sports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-amber-400 transition-colors">
                  Interskole &amp; Rugby 7s
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-amber-400 transition-colors">
                  Cultural Galas &amp; Runway
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Organizers */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs tracking-wider uppercase">
              Support &amp; Portal
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-amber-400 transition-colors">
                  Concierge Support Desk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-amber-400 transition-colors">
                  My Tickets &amp; QR Passes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-amber-400 transition-colors">
                  CMS Plugins &amp; Organizers
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs tracking-wider uppercase">
              Security &amp; Compliance
            </h4>
            <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bank-Grade 3D Secure</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Encrypted with 256-bit SSL, PCI-DSS Level 1 compliance, and POPIA data privacy.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
              <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-zinc-300 cursor-pointer">POPIA</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div>
          &copy; 2024&ndash;2026 OpenTickets.co.za &mdash; All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Ticketing Servers Operational
          </span>
          <span>·</span>
          <span>Johannesburg &middot; Cape Town &middot; Durban</span>
        </div>
      </div>
    </footer>
  );
};
