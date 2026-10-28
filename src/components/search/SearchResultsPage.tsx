import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowUpDown, 
  LayoutGrid, 
  ListFilter,
  Sparkles
} from 'lucide-react';
import { EventItem, EventCategory } from '../../types';
import { EventCard } from '../home/EventCard';
import { formatZAR } from '../../utils/ticketPricing';

interface SearchResultsPageProps {
  events: EventItem[];
  initialQuery?: string;
  onSelectEvent: (event: EventItem) => void;
  onQuickBook: (event: EventItem) => void;
  savedEventIds?: string[];
  onToggleSave?: (eventId: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  events,
  initialQuery = '',
  onSelectEvent,
  onQuickBook,
  savedEventIds = [],
  onToggleSave,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc' | 'title'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: EventCategory; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'music', label: 'Music & Concerts' },
    { id: 'sports', label: 'Sports & Football' },
    { id: 'festivals', label: 'Festivals & Outdoor' },
    { id: 'arts', label: 'Arts & Culture' },
    { id: 'community', label: 'School & Community' },
  ];

  const cities = [
    'All Cities',
    'Port Elizabeth',
    'Johannesburg',
    'Durban',
    'Cape Town',
    'Pretoria',
    'Rustenburg',
    'Kempton Park',
    'Hartbeespoort',
    'Stellenbosch',
  ];

  const filteredEvents = useMemo(() => {
    let result = events.filter((evt) => {
      // Category
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
        return false;
      }
      // City
      if (selectedCity !== 'all' && evt.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // Max price
      if (evt.priceFrom > maxPrice) {
        return false;
      }
      // Search text
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesSub = evt.subtitle.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesCity = evt.city.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesVenue && !matchesCity && !matchesDesc) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.priceFrom - b.priceFrom;
      }
      if (sortBy === 'price-desc') {
        return b.priceFrom - a.priceFrom;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [events, query, selectedCategory, selectedCity, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setMaxPrice(3000);
    setSortBy('date');
  };

  const hasActiveFilters = 
    query.trim() !== '' || 
    selectedCategory !== 'all' || 
    selectedCity !== 'all' || 
    maxPrice < 3000 || 
    sortBy !== 'date';

  return (
    <div className="w-full bg-[#0B0D13] min-h-screen text-zinc-100 py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        
        {/* Header & Main Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Search &amp; Discovery</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore Live Events
              </h1>
            </div>

            {/* View Mode & Active Counts */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                Found <strong className="text-amber-400 font-bold">{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? 's' : ''}
              </span>

              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  aria-label="List View"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by artist, tournament, team, stadium, or venue..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl pl-11 pr-24 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400/80 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Multi-Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#12151E] border border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as EventCategory)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* City / Province */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              City / Region
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <span>Max Starting Price</span>
              <span className="text-amber-400 font-mono">{formatZAR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={50}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer mt-2"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="date">Date: Earliest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Event Name (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Tags / Clear Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-zinc-500 text-[11px]">Active Filters:</span>
            {query && (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 flex items-center gap-1">
                "{query}"
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setQuery('')} />
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 flex items-center gap-1">
                {categories.find(c => c.id === selectedCategory)?.label}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {selectedCity !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 flex items-center gap-1">
                {selectedCity}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCity('all')} />
              </span>
            )}
            {maxPrice < 3000 && (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 flex items-center gap-1">
                &le; {formatZAR(maxPrice)}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setMaxPrice(3000)} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold ml-2 underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Results Grid / List */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-8 space-y-4">
            <Search className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No live events matched your criteria</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Try adjusting your price threshold, switching cities, or clearing keywords to view all scheduled events.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs shadow-md transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                viewMode={viewMode}
                onSelect={onSelectEvent}
                onQuickBook={onQuickBook}
                isSaved={savedEventIds.includes(evt.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
