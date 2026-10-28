import React, { useState } from 'react';
import { 
  Calendar, 
  HelpCircle, 
  Headphones, 
  User, 
  Search, 
  Ticket, 
  ShoppingBag, 
  Menu, 
  X, 
  Globe,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type ActiveScreen = 'home' | 'search' | 'event-detail' | 'faq' | 'profile' | 'support';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTriggerSearch: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onTriggerSearch,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTriggerSearch();
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0D1017]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-colors lg:pl-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0 lg:hidden">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
                <Ticket className="w-4 h-4 text-zinc-950 transform -rotate-12 group-hover:rotate-0 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                    OPEN<span className="text-amber-400 group-hover:text-white transition-colors">TICKETS</span>
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search events, artists, stadiums, or cities (e.g. Appel, Orlando Pirates)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-zinc-900/90 border border-zinc-700/60 group-hover:border-zinc-600 focus:border-amber-400/80 rounded-xl pl-10 pr-20 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-zinc-300 transition-colors pointer-events-none" />
              
              <button
                onClick={onTriggerSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Action Zone: Nav Links, Language, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Desktop Nav Links */}
            <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-zinc-300">
              <button
                onClick={() => onNavigate('home')}
                className={`transition-colors hover:text-amber-400 ${activeScreen === 'home' ? 'text-amber-400' : ''}`}
              >
                Events
              </button>
              <button
                onClick={() => onNavigate('search')}
                className={`transition-colors hover:text-amber-400 ${activeScreen === 'search' ? 'text-amber-400' : ''}`}
              >
                Explore
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className={`transition-colors hover:text-amber-400 ${activeScreen === 'faq' ? 'text-amber-400' : ''}`}
              >
                FAQs
              </button>
              <button
                onClick={() => onNavigate('support')}
                className={`transition-colors hover:text-amber-400 ${activeScreen === 'support' ? 'text-amber-400' : ''}`}
              >
                Support
              </button>
            </nav>

            <div className="h-4 w-px bg-zinc-800 hidden xl:block" />

            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                aria-expanded={isLangOpen}
                aria-label="Language selection"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{selectedLanguage}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  {['English', 'Afrikaans', 'isiZulu'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        selectedLanguage === lang
                          ? 'text-amber-400 bg-amber-400/10 font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Dashboard Button */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                activeScreen === 'profile'
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">My Account</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-zinc-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-zinc-950 bg-amber-400 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Left Vertical Sidebar (Desktop & Mobile Drawer) matching OpenTickets Reference */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B0D14] border-r border-zinc-800/90 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarOpen ? 'shadow-2xl shadow-black/80' : ''}`}
      >
        <div>
          {/* Sidebar Header Brand */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigate('home');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Ticket className="w-4 h-4 text-zinc-950 -rotate-12" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-white uppercase block">
                  OPEN<span className="text-amber-400">TICKETS</span>
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-widest block uppercase">
                  South Africa
                </span>
              </div>
            </button>
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Group */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">
              Menu
            </div>

            <button
              onClick={() => {
                onNavigate('home');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeScreen === 'home'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="flex-1 text-left">Events</span>
              {activeScreen === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>

            <button
              onClick={() => {
                onNavigate('search');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeScreen === 'search'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span className="flex-1 text-left">Search &amp; Filter</span>
            </button>

            <button
              onClick={() => {
                onNavigate('faq');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeScreen === 'faq'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span className="flex-1 text-left">FAQs</span>
            </button>

            <button
              onClick={() => {
                onNavigate('support');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeScreen === 'support'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Headphones className="w-4 h-4 text-zinc-400" />
              <span className="flex-1 text-left">Support &amp; Concierge</span>
            </button>

            <button
              onClick={() => {
                onNavigate('profile');
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeScreen === 'profile'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="flex-1 text-left">My Account</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            </button>

            {/* Content / Organizer Section */}
            <div className="pt-4 mt-4 border-t border-zinc-800/70">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-2">
                Organizers &amp; Partners
              </div>
              <div className="p-3 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Host Your Event</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5">
                  Instant ticket settlement, seated arena mapping, and zero setup fee.
                </p>
                <button
                  onClick={() => {
                    onNavigate('support');
                    if (window.innerWidth < 1024) onToggleSidebar();
                  }}
                  className="w-full py-1.5 text-[11px] font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-center"
                >
                  Create Event
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Server status: Online</span>
            <span className="text-zinc-400 font-mono">v2.6</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};
