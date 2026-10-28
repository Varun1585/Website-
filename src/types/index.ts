export type EventCategory = 
  | 'all' 
  | 'music' 
  | 'sports' 
  | 'festivals' 
  | 'arts' 
  | 'community' 
  | 'conferences';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
  perks: string[];
}

export interface LineupArtist {
  name: string;
  role: string;
  time?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  categoryLabel: string;
  date: string;
  day: string;
  month: string;
  year: string;
  time: string;
  rawDate: string; // ISO date for sorting
  venue: string;
  address: string;
  city: string;
  province: string;
  priceFrom: number;
  featured: boolean;
  heroTag?: string;
  coverImage: string;
  heroBanner?: string;
  bannerGradient: string;
  description: string;
  organizer: string;
  doorsOpen: string;
  ageRestriction: string;
  tiers: TicketTier[];
  lineup?: LineupArtist[];
}

export interface TicketPass {
  id: string;
  ticketCode: string;
  orderId: string;
  eventId: string;
  eventTitle: string;
  tierName: string;
  venue: string;
  date: string;
  time: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  status: 'active' | 'used' | 'transferred';
  purchasedAt: string;
  pricePaid: number;
  seatInfo?: string;
  qrCodeSeed: string;
}

export interface OrderRecord {
  orderId: string;
  orderNumber: string;
  date: string;
  eventId: string;
  eventTitle: string;
  itemsSummary: string;
  totalAmount: number;
  paymentMethod: string;
  tickets: TicketPass[];
}

export interface FAQItem {
  id: string;
  category: 'purchasing' | 'digital_passes' | 'refunds' | 'event_day' | 'organizer';
  categoryLabel: string;
  question: string;
  answer: string;
}
