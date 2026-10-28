export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  tierId: string;
  tierName: string;
  unitPrice: number;
  quantity: number;
  eventDate: string;
  venue: string;
}

export interface CheckoutAddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface OrderCalculation {
  ticketsSubtotal: number;
  addOnsTotal: number;
  subtotal: number;
  discountAmount: number;
  bookingFee: number;
  vatAmount: number; // 15% VAT component
  grandTotal: number;
  itemCount: number;
}

export const BOOKING_FEE_PER_ORDER = 15;
export const VAT_RATE = 0.15;

export function calculateOrderTotals(
  items: CartItem[],
  addOns: CheckoutAddOn[] = [],
  promoCode?: string
): OrderCalculation {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const ticketsSubtotal = items.reduce((sum, item) => sum + item.unitPrice * (item.quantity || 0), 0);
  const addOnsTotal = addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
  const subtotal = ticketsSubtotal + addOnsTotal;

  let discountAmount = 0;
  if (promoCode) {
    const code = promoCode.trim().toUpperCase();
    if (code === 'EARLYBIRD' || code === 'WELCOME10') {
      discountAmount = Math.round(subtotal * 0.10 * 100) / 100;
    } else if (code === 'SAVE50') {
      discountAmount = Math.min(subtotal, 50);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const bookingFee = itemCount > 0 ? BOOKING_FEE_PER_ORDER : 0;
  const grandTotal = Math.round((taxableAmount + bookingFee) * 100) / 100;
  
  // South African standard VAT (15% inclusive calculation)
  const vatAmount = Math.round((grandTotal * (VAT_RATE / (1 + VAT_RATE))) * 100) / 100;

  return {
    ticketsSubtotal,
    addOnsTotal,
    subtotal,
    discountAmount,
    bookingFee,
    vatAmount,
    grandTotal,
    itemCount,
  };
}

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('ZAR', 'R');
}

export interface FilterOptions {
  category?: string;
  searchQuery?: string;
  city?: string;
  maxPrice?: number;
}

export interface MinimalEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  city: string;
  venue: string;
  priceFrom: number;
  date: string;
}

export function filterEvents<T extends MinimalEvent>(events: T[], options: FilterOptions): T[] {
  const { category = 'all', searchQuery = '', city = 'all', maxPrice } = options;
  const query = searchQuery.trim().toLowerCase();

  return events.filter(event => {
    // Isotope category match
    if (category !== 'all' && event.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // City match
    const isAllCities = !city || city.toLowerCase() === 'all' || city.toLowerCase() === 'all cities';
    if (!isAllCities && event.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    // Max price
    if (typeof maxPrice === 'number' && maxPrice > 0 && event.priceFrom > maxPrice) {
      return false;
    }

    // Search query
    if (query) {
      const matchTitle = event.title.toLowerCase().includes(query);
      const matchSubtitle = event.subtitle ? event.subtitle.toLowerCase().includes(query) : false;
      const matchVenue = event.venue.toLowerCase().includes(query);
      const matchCity = event.city.toLowerCase().includes(query);
      if (!matchTitle && !matchSubtitle && !matchVenue && !matchCity) {
        return false;
      }
    }

    return true;
  });
}

export function generateTicketCode(eventId: string): string {
  const prefix = 'OT-2026';
  const cleanId = eventId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${cleanId || 'EVT'}-${randomSuffix}`;
}
