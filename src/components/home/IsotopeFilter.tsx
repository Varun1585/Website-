import React from 'react';
import { EventCategory } from '../../types';
import { Sparkles, SlidersHorizontal, LayoutGrid, ListFilter, MapPin } from 'lucide-react';

interface IsotopeFilterProps {
  activeCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalCount: number;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'all', label: 'All Events' },
  { id: 'music', label: 'Music & Concerts' },
  { id: 'sports', label: 'Sports & Football' },
  { id: 'festivals', label: 'Festivals & Outdoor' },
  { id: 'arts', label: 'Arts & Culture' },
  { id: 'community', label: 'School & Community' },
];

const CITIES = [
  'All Cities',
  'Johannesburg',
  'Durban',
  'Cape Town',
  'Port Elizabeth',
  'Pretoria',
  'Kempton Park',
  'Hartbeespoort',
];

export const IsotopeFilter: React.FC<IsotopeFilterProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  viewMode,
  onToggleViewMode,
  totalCount,
}) => {
  return (
    <div className="w-full bg-[#0B0D13] pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Box Office</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Events
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto text-xs text-zinc-400">
            <span className="font-mono tabular-nums text-zinc-300">
              <strong className="text-amber-400 font-bold">{totalCount}</strong> events found
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => onToggleViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-amber-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                aria-label="Grid View"
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-zinc-800 text-amber-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                aria-label="List View"
                title="List View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Isotope Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl backdrop-blur-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Location Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0 px-2">
            <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/70 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-400/60 cursor-pointer"
              aria-label="Filter events by city"
            >
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-zinc-900 text-zinc-200">
                  {city}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
