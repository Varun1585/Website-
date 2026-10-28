import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderTotals, filterEvents, formatZAR } from './ticketPricing';

test('calculateOrderTotals computes correct subtotal and booking fee', () => {
  const items = [
    {
      id: '1',
      eventId: 'appel-pe',
      eventTitle: 'Appel in PE',
      tierId: 'general',
      tierName: 'General Admission',
      unitPrice: 250,
      quantity: 2,
      eventDate: '6 Nov 2026',
      venue: 'Boardwalk Hotel',
    },
  ];

  const result = calculateOrderTotals(items);
  assert.equal(result.ticketsSubtotal, 500);
  assert.equal(result.addOnsTotal, 0);
  assert.equal(result.subtotal, 500);
  assert.equal(result.bookingFee, 15);
  assert.equal(result.grandTotal, 515);
  assert.equal(result.itemCount, 2);
});

test('calculateOrderTotals applies promo code discount', () => {
  const items = [
    {
      id: '1',
      eventId: 'pirates-season',
      eventTitle: 'Orlando Pirates FC',
      tierId: 'grandstand',
      tierName: 'Grandstand',
      unitPrice: 1000,
      quantity: 1,
      eventDate: '2 Aug 2026',
      venue: 'Orlando Stadium',
    },
  ];

  const result = calculateOrderTotals(items, [], 'WELCOME10');
  assert.equal(result.subtotal, 1000);
  assert.equal(result.discountAmount, 100);
  assert.equal(result.grandTotal, 915); // 1000 - 100 + 15
});

test('filterEvents handles category isotope and query filters', () => {
  const sampleEvents = [
    {
      id: '1',
      title: 'Appel in PE',
      category: 'music',
      city: 'Port Elizabeth',
      venue: 'Boardwalk Hotel',
      priceFrom: 180,
      date: '2026-11-06',
    },
    {
      id: '2',
      title: 'Orlando Pirates vs Chiefs',
      category: 'sports',
      city: 'Johannesburg',
      venue: 'Orlando Stadium',
      priceFrom: 850,
      date: '2026-08-02',
    },
    {
      id: '3',
      title: 'KempieFees 2026',
      category: 'festivals',
      city: 'Kempton Park',
      venue: 'Hoërskool Kempton',
      priceFrom: 120,
      date: '2026-10-31',
    },
  ];

  const sportsOnly = filterEvents(sampleEvents, { category: 'sports' });
  assert.equal(sportsOnly.length, 1);
  assert.equal(sportsOnly[0].id, '2');

  const querySearch = filterEvents(sampleEvents, { searchQuery: 'Kempie' });
  assert.equal(querySearch.length, 1);
  assert.equal(querySearch[0].id, '3');

  const allCitiesFilter = filterEvents(sampleEvents, { city: 'All Cities' });
  assert.equal(allCitiesFilter.length, 3);

  const maxPriceFilter = filterEvents(sampleEvents, { maxPrice: 200 });
  assert.equal(maxPriceFilter.length, 2);
});

test('formatZAR formats numbers with R symbol', () => {
  const formatted = formatZAR(350);
  assert.ok(formatted.includes('350'));
  assert.ok(formatted.includes('R'));
});
