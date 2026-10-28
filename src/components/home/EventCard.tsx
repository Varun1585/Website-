import React from 'react';
import { EventItem } from '../../types';
import { MapPin, Clock, Ticket, ArrowRight, Heart } from 'lucide-react';
import { formatZAR } from '../../utils/ticketPricing';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
  onSelect: (event: EventItem) => void;
  onQuickBook: (event: EventItem) => void;
  isSaved?: boolean;
  onToggleSave?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  viewMode = 'grid',
  onSelect,
  onQuickBook,
  isSaved = false,
  onToggleSave,
}) => {
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(event)}
        className="group relative bg-[#12151E] hover:bg-[#161A26] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg hover:shadow-2xl"
      >
        {/* Left Side: Thumbnail + Date + Title */}
        <div className="flex items-center gap-4 flex-1">
          {/* Date Block */}
          <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800/90 flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:border-amber-400/40 transition-colors">
            <span className="text-xl font-extrabold text-amber-400 font-mono tracking-tighter">
              {event.day}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {event.month}
            </span>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-amber-400/90 tracking-wide">
                {event.categoryLabel}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-[11px] text-zinc-400">{event.city}</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span className="truncate max-w-[200px]">{event.venue}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{event.time}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Price + Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/60">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-zinc-500 block uppercase tracking-wider">Starts From</span>
            <span className="text-base font-bold text-white font-mono">
              {formatZAR(event.priceFrom)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(event.id);
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickBook(event);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid View Card (Matches OpenTickets card anatomy redesigned for dark luxury)
  return (
    <div 
      onClick={() => onSelect(event)}
      className="group relative bg-[#12151E] hover:bg-[#161B27] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Top Banner Artwork */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img 
          src={event.coverImage} 
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Subtle Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151E] via-transparent to-black/30 pointer-events-none" />

        {/* Featured Tag or Category */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-200 text-[10px] font-semibold uppercase tracking-wider">
            {event.categoryLabel}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(event.id);
            }}
            className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-zinc-800/80'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Event Title Watermark / Graphical Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <span className="text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
            {event.doorsOpen ? `Gates: ${event.doorsOpen}` : 'Live'}
          </span>
          <span className="text-xs font-bold text-amber-400 font-mono bg-black/80 px-2.5 py-1 rounded-lg border border-amber-400/30">
            From {formatZAR(event.priceFrom)}
          </span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        
        {/* Date + Title Block (Matches OpenTickets layout) */}
        <div className="flex items-start gap-4">
          
          {/* Prominent Red/Amber Date Block from reference screenshot */}
          <div className="flex flex-col items-center justify-center shrink-0 w-12 text-center pt-0.5">
            <span className="text-2xl font-black text-amber-400 font-mono leading-none tracking-tight">
              {event.day}
            </span>
            <span className="text-[11px] font-extrabold text-zinc-400 tracking-wider uppercase mt-1">
              {event.month}
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-10 bg-zinc-800/90 shrink-0 mt-1" />

          {/* Event Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>

            {/* Venue Location Pin (Matches OpenTickets 📍) */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            {/* Date-time stamp */}
            <div className="text-[11px] text-zinc-500 font-mono">
              {event.date}, {event.time}
            </div>
          </div>

        </div>

        {/* Card Action Strip */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-zinc-400 font-medium">
            {event.organizer}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickBook(event);
            }}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-amber-400 text-zinc-200 hover:text-zinc-950 text-xs font-bold rounded-lg border border-zinc-700 hover:border-amber-400 transition-all flex items-center gap-1.5"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
