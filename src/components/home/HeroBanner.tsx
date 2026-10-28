import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EventItem } from '../../types';
import { formatZAR } from '../../utils/ticketPricing';

interface HeroBannerProps {
  featuredEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onQuickBook: (event: EventItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredEvents,
  onSelectEvent,
  onQuickBook,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Safe fallback if featuredEvents is empty
  const events = featuredEvents.length > 0 ? featuredEvents : [];
  const currentEvent = events[currentIndex] || events[0];

  useEffect(() => {
    if (!isAutoPlaying || events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, events.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (!currentEvent) return null;

  return (
    <section 
      className="relative w-full overflow-hidden bg-black py-4 sm:py-6"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Featured Events Carousel"
    >
      {/* Container with widescreen presence */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-gradient-to-br from-zinc-900 to-black min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-10 lg:p-14 group">
          
          {/* Dynamic Background Image with Atmospheric Overlays */}
          <img
            src={currentEvent.heroBanner || currentEvent.coverImage}
            alt={currentEvent.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform scale-105 group-hover:scale-100"
          />

          {/* Luxury Noise/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent z-10" />

          {/* Distinctive Graphic Embellishment tailored per event */}
          <div className="absolute top-0 right-0 w-full sm:w-2/3 h-full z-10 pointer-events-none opacity-40 mix-blend-screen flex items-center justify-end pr-8">
            {currentEvent.slug.includes('appel') ? (
              <div className="text-right">
                <div className="text-amber-500 font-extrabold tracking-widest text-4xl sm:text-6xl uppercase opacity-20 select-none">
                  SOOS NET HY KAN
                </div>
                <div className="text-zinc-600 font-bold tracking-widest text-2xl uppercase opacity-30 select-none">
                  PORT ELIZABETH
                </div>
              </div>
            ) : currentEvent.slug.includes('pirates') ? (
              <div className="text-right">
                <div className="text-zinc-400 font-extrabold tracking-widest text-5xl sm:text-7xl uppercase opacity-15 select-none font-mono">
                  BUCCANEERS
                </div>
                <div className="text-white font-bold tracking-widest text-xl uppercase opacity-20 select-none">
                  ORLANDO 2026/27
                </div>
              </div>
            ) : (
              <div className="text-right">
                <div className="text-purple-400 font-extrabold tracking-widest text-4xl sm:text-6xl uppercase opacity-20 select-none">
                  EXTRAVAGANZA
                </div>
              </div>
            )}
          </div>

          {/* Content Layer */}
          <div className="relative z-20 max-w-2xl space-y-4">
            
            {/* Tagline / Category Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-amber-400 text-zinc-950 font-bold tracking-wide uppercase text-[11px] flex items-center gap-1 shadow-md shadow-amber-400/20">
                <Sparkles className="w-3 h-3" />
                {currentEvent.heroTag || 'Featured Event'}
              </span>
              <span className="text-zinc-400 font-medium tracking-wide">
                {currentEvent.categoryLabel}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-amber-400 font-mono font-semibold">
                {currentEvent.doorsOpen ? `Gates: ${currentEvent.doorsOpen}` : 'Live'}
              </span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
              {currentEvent.title}
            </h1>

            {/* Subtitle / Artist / Opponent info */}
            <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed line-clamp-2">
              {currentEvent.subtitle}
            </p>

            {/* Event Key Spec Bar (Date, Time, Venue) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{currentEvent.date}</span>
                <span className="text-zinc-500">·</span>
                <Clock className="w-3.5 h-3.5 text-zinc-400 ml-1 shrink-0" />
                <span>{currentEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate max-w-xs">{currentEvent.venue}, {currentEvent.city}</span>
              </div>
            </div>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onQuickBook(currentEvent)}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-400/20 hover:shadow-amber-400/30 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets &middot; From {formatZAR(currentEvent.priceFrom)}</span>
              </button>

              <button
                onClick={() => onSelectEvent(currentEvent)}
                className="px-5 py-3 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold rounded-xl text-xs sm:text-sm border border-zinc-700/80 transition-all flex items-center gap-2"
              >
                <span>View Event Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Left / Right Carousel Controls matching screenshot buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-amber-400"
            aria-label="Previous featured banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-amber-400"
            aria-label="Next featured banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`transition-all ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-amber-400 rounded-full'
                    : 'w-2 h-2 bg-zinc-600 hover:bg-zinc-400 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
