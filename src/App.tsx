/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar, ActiveScreen } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { IsotopeFilter } from './components/home/IsotopeFilter';
import { EventCard } from './components/home/EventCard';
import { EventDetailPage } from './components/events/EventDetailPage';
import { SearchResultsPage } from './components/search/SearchResultsPage';
import { FaqPage } from './components/faq/FaqPage';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { PaymentProcessingModal } from './components/checkout/PaymentProcessingModal';
import { UserProfileDashboard } from './components/profile/UserProfileDashboard';
import { SupportModal } from './components/common/SupportModal';

import { MOCK_EVENTS } from './data/mockEvents';
import { EventItem, EventCategory, TicketTier, OrderRecord, TicketPass } from './types';
import { filterEvents } from './utils/ticketPricing';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wishlist
  const [savedEventIds, setSavedEventIds] = useState<string[]>([
    'appel-in-pe-2026',
    'orlando-pirates-2026-27',
  ]);

  // Pre-seed 1 confirmed order so the Attendee Profile has immediate live QR passes
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      orderId: 'ord_init_1',
      orderNumber: 'OT-849210',
      date: '24 Oct 2026',
      eventId: 'appel-in-pe-2026',
      eventTitle: 'Appel in PE - Soos Net Hy Kan',
      itemsSummary: '2 Tickets (Golden Circle (Front Stage))',
      totalAmount: 575,
      paymentMethod: 'CAPITEC PAY',
      tickets: [
        {
          id: 'tkt_init_1',
          ticketCode: 'OT-2026-APPE-8491',
          orderId: 'ord_init_1',
          eventId: 'appel-in-pe-2026',
          eventTitle: 'Appel in PE - Soos Net Hy Kan',
          tierName: 'Golden Circle (Front Stage)',
          venue: 'Boardwalk Hotel and Casino, Port Elizabeth',
          date: '06 Nov 2026',
          time: '21:00',
          attendeeName: 'Varun Singh',
          attendeeEmail: 'varunsingh5691@gmail.com',
          attendeePhone: '+27 82 459 8123',
          status: 'active',
          purchasedAt: '2026-10-24T14:30:00Z',
          pricePaid: 280,
          seatInfo: 'Zone A · Barricade Turnstile',
          qrCodeSeed: 'OT-849210-golden-0',
        },
        {
          id: 'tkt_init_2',
          ticketCode: 'OT-2026-APPE-8492',
          orderId: 'ord_init_1',
          eventId: 'appel-in-pe-2026',
          eventTitle: 'Appel in PE - Soos Net Hy Kan',
          tierName: 'Golden Circle (Front Stage)',
          venue: 'Boardwalk Hotel and Casino, Port Elizabeth',
          date: '06 Nov 2026',
          time: '21:00',
          attendeeName: 'Varun Singh',
          attendeeEmail: 'varunsingh5691@gmail.com',
          attendeePhone: '+27 82 459 8123',
          status: 'active',
          purchasedAt: '2026-10-24T14:30:00Z',
          pricePaid: 280,
          seatInfo: 'Zone A · Barricade Turnstile',
          qrCodeSeed: 'OT-849210-golden-1',
        },
      ],
    },
  ]);

  // Checkout modal states
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutEvent, setCheckoutEvent] = useState<EventItem | null>(null);
  const [checkoutTiers, setCheckoutTiers] = useState<{ tier: TicketTier; quantity: number }[]>([]);

  // Payment processing modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any | null>(null);

  // Support Concierge modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Featured events for the dominant Hero Carousel
  const featuredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(e => e.featured);
  }, []);

  // Filtered events for the home isotope grid
  const filteredEvents = useMemo(() => {
    return filterEvents(MOCK_EVENTS, {
      category: activeCategory,
      city: selectedCity,
    });
  }, [activeCategory, selectedCity]);

  // Wishlisted event objects
  const savedEvents = useMemo(() => {
    return MOCK_EVENTS.filter(e => savedEventIds.includes(e.id));
  }, [savedEventIds]);

  // Wishlist toggle
  const handleToggleSave = (eventId: string) => {
    setSavedEventIds(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  // Select event to open detail page
  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setActiveScreen('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick book opens checkout directly with 1st tier pre-selected
  const handleQuickBook = (event: EventItem) => {
    setCheckoutEvent(event);
    setCheckoutTiers([{ tier: event.tiers[0], quantity: 1 }]);
    setCheckoutModalOpen(true);
  };

  // Proceed to checkout from event detail page
  const handleProceedToCheckout = (event: EventItem, selectedTiers: { tier: TicketTier; quantity: number }[]) => {
    setCheckoutEvent(event);
    setCheckoutTiers(selectedTiers);
    setCheckoutModalOpen(true);
  };

  // Trigger search from top navbar
  const handleTriggerSearch = () => {
    setActiveScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When checkout submits, open payment processing modal
  const handleCompleteOrder = (orderData: any) => {
    setCheckoutModalOpen(false);
    setPendingOrderData(orderData);
    setPaymentModalOpen(true);
  };

  // Save finalized order to attendee state
  const handleSaveConfirmedOrder = (newOrder: OrderRecord) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // Ticket transfer execution
  const handleTransferTicket = (ticketId: string, recipientName: string, recipientEmail: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => ({
        ...order,
        tickets: order.tickets.map(tkt => {
          if (tkt.id === ticketId) {
            return {
              ...tkt,
              status: 'transferred',
              attendeeName: `${recipientName} (Transferred)`,
              attendeeEmail: recipientEmail,
            };
          }
          return tkt;
        }),
      }))
    );
  };

  // Navigation router
  const handleNavigate = (screen: ActiveScreen) => {
    if (screen === 'support') {
      setIsSupportModalOpen(true);
      return;
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate cart badge count
  const cartBadgeCount = orders.flatMap(o => o.tickets).filter(t => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#0B0D13] text-zinc-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-300">
      
      {/* Top Navbar & Left Sidebar Navigation */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        cartCount={cartBadgeCount}
        onOpenCart={() => handleNavigate('profile')}
        searchQuery={navbarSearchQuery}
        onSearchChange={setNavbarSearchQuery}
        onTriggerSearch={handleTriggerSearch}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Screen Layout Container (Desktop leaves room for sidebar) */}
      <main className="flex-1 lg:pl-64 transition-all">
        
        {/* SCREEN 1: Home Page */}
        {activeScreen === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Dominant Hero Carousel above the fold */}
            <HeroBanner
              featuredEvents={featuredEvents}
              onSelectEvent={handleSelectEvent}
              onQuickBook={handleQuickBook}
            />

            {/* Isotope Filter Bar matching OpenTickets exact functionality */}
            <IsotopeFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              totalCount={filteredEvents.length}
            />

            {/* Event Cards Grid / List */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-[#12151E] rounded-2xl border border-zinc-800 p-8 space-y-3">
                  <p className="text-zinc-400 text-sm">
                    No events found in this category or city.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSelectedCity('All Cities');
                    }}
                    className="px-4 py-2 bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
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
                      onSelect={handleSelectEvent}
                      onQuickBook={handleQuickBook}
                      isSaved={savedEventIds.includes(evt.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* SCREEN 2: Event Detail Page */}
        {activeScreen === 'event-detail' && selectedEvent && (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => setActiveScreen('home')}
            onProceedToCheckout={handleProceedToCheckout}
            isSaved={savedEventIds.includes(selectedEvent.id)}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* SCREEN 3: Search Results Listing */}
        {activeScreen === 'search' && (
          <SearchResultsPage
            events={MOCK_EVENTS}
            initialQuery={navbarSearchQuery}
            onSelectEvent={handleSelectEvent}
            onQuickBook={handleQuickBook}
            savedEventIds={savedEventIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* SCREEN 4: FAQs Page */}
        {activeScreen === 'faq' && (
          <FaqPage onOpenSupportModal={() => setIsSupportModalOpen(true)} />
        )}

        {/* SCREEN 5: User Profile Dashboard */}
        {activeScreen === 'profile' && (
          <UserProfileDashboard
            orders={orders}
            savedEvents={savedEvents}
            onSelectEvent={handleSelectEvent}
            onTransferTicket={handleTransferTicket}
          />
        )}

      </main>

      {/* Footer */}
      <div className="lg:pl-64 transition-all">
        <Footer
          onNavigate={handleNavigate}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
        />
      </div>

      {/* MODAL: Checkout Flow */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        event={checkoutEvent}
        selectedTiers={checkoutTiers}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* MODAL: Payment Processing & QR Pass Issuance */}
      <PaymentProcessingModal
        isOpen={paymentModalOpen}
        orderData={pendingOrderData}
        onClose={() => setPaymentModalOpen(false)}
        onViewDashboard={() => {
          setPaymentModalOpen(false);
          setActiveScreen('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSaveConfirmedOrder={handleSaveConfirmedOrder}
      />

      {/* MODAL: Concierge Support */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

    </div>
  );
}
