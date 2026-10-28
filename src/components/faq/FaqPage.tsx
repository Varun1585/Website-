import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare, 
  ShieldCheck, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import { MOCK_FAQS } from '../../data/mockFaqs';
import { FAQItem } from '../../types';

interface FaqPageProps {
  onOpenSupportModal?: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenSupportModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_FAQS[0]?.id || null);

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'purchasing', label: 'Purchasing & Payment' },
    { id: 'digital_passes', label: 'Digital Passes & Entry' },
    { id: 'refunds', label: 'Refunds & Cancellations' },
    { id: 'event_day', label: 'Venues & Gate Access' },
    { id: 'organizer', label: 'Organizer Portal' },
  ];

  const filteredFaqs = MOCK_FAQS.filter((faq) => {
    const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = 
      !query || 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-[#0B0D13] min-h-screen text-zinc-100 py-10">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center &amp; Box Office Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about booking live concert tickets, soccer derby passes, transfer rules, and turnstile entry across South Africa.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions (e.g. refunds, transfer ticket, Apple Wallet, payment)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400/80 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8 space-y-2">
              <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No matching answers found</h3>
              <p className="text-xs text-zinc-400">
                Try searching with different keywords or contact our 24/7 concierge support below.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-[#141823] border-amber-400/40 shadow-xl'
                      : 'bg-[#10131B] border-zinc-800/80 hover:border-zinc-700/80'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {faq.question}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-zinc-800/70 flex items-center justify-center text-zinc-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-in fade-in duration-150">
                      <p className="max-w-3xl">{faq.answer}</p>
                      
                      <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="font-mono uppercase tracking-wider">{faq.categoryLabel}</span>
                        <span>Was this helpful? Yes &middot; No</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Concierge Desk Callout Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#161B27] to-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need Dedicated Human Assistance?</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Speak directly with our Event Concierge
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Our South Africa box office support desk is staffed 7 days a week from 07:00 to 23:00.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenSupportModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Concierge Chat</span>
            </button>
            <a
              href="mailto:support@opentickets.co.za"
              className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
