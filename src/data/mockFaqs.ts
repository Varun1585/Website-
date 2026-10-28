import { FAQItem } from '../types';

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'purchasing',
    categoryLabel: 'Purchasing & Payment',
    question: 'Which payment methods are supported on OpenTickets?',
    answer: 'We support all major South African payment rails through 3D Secure 2.0 encryption: Visa and Mastercard credit & debit cards, Instant EFT via Capitec Pay, Ozow, and PayFast (Standard Bank, FNB, Absa, Nedbank, Investec), as well as mobile tap-to-pay via Apple Pay, Google Pay, SnapScan, and Zapper.',
  },
  {
    id: 'faq-2',
    category: 'purchasing',
    categoryLabel: 'Purchasing & Payment',
    question: 'How long are my tickets held while completing checkout?',
    answer: 'When you select ticket tiers and begin the checkout flow, your tickets are reserved exclusively in your session for 10 minutes. A visible timer is displayed at the top of checkout. If checkout is not finalized within 10 minutes, the allocation is returned to public inventory to ensure fair access.',
  },
  {
    id: 'faq-3',
    category: 'digital_passes',
    categoryLabel: 'Digital Passes & Entry',
    question: 'How do I access my tickets on the day of the event?',
    answer: 'Immediately upon purchase confirmation, your digital ticket pass with high-density QR code is accessible under "My Account > My Tickets". You will also receive an instant confirmation email and SMS containing a secure direct link. You can add the pass directly to Apple Wallet or Google Wallet, or present the live QR code directly on your phone screen at the turnstiles.',
  },
  {
    id: 'faq-4',
    category: 'digital_passes',
    categoryLabel: 'Digital Passes & Entry',
    question: 'Can I transfer or send a ticket to a friend or family member?',
    answer: 'Yes! Navigate to "My Account > My Tickets", select the ticket you wish to reassign, and click "Transfer Ticket". Enter the recipient’s full name and email address. They will receive a personalized digital pass with a freshly regenerated secure QR code, and the original ticket barcode in your account will be securely invalidated.',
  },
  {
    id: 'faq-5',
    category: 'digital_passes',
    categoryLabel: 'Digital Passes & Entry',
    question: 'Do I need to print my ticket or will mobile digital passes suffice?',
    answer: 'All OpenTickets scanner gates and turnstiles support 100% digital mobile scanning. Simply ensure your phone screen brightness is set to high when approaching the gate. However, if you prefer a hard copy, you can click "Download Printable Pass" from your confirmation modal or My Account to generate an official PDF.',
  },
  {
    id: 'faq-6',
    category: 'refunds',
    categoryLabel: 'Refunds & Postponements',
    question: 'What is the refund policy if an event is rescheduled or cancelled?',
    answer: 'If an event is officially cancelled by the organizers, 100% of the face value of your ticket is automatically refunded back to your original payment method within 5–7 business days. If an event is postponed, your existing ticket remains valid for the revised date, or you can request an instant full refund within 14 days of the date announcement.',
  },
  {
    id: 'faq-7',
    category: 'event_day',
    categoryLabel: 'Venues & Gate Access',
    question: 'What time do venue gates open, and what should I bring?',
    answer: 'Gate opening times vary per event and are highlighted on each event page and digital ticket pass (typically 1.5 to 2 hours prior to start time). Please bring your digital or printed ticket QR code and a valid photo ID (SA ID document, driver’s license, or passport). Prohibited items include outside alcohol, glassware, fireworks, and professional camera rigs unless press-accredited.',
  },
  {
    id: 'faq-8',
    category: 'organizer',
    categoryLabel: 'Organizer Portal',
    question: 'How do event organizers list and sell tickets on OpenTickets?',
    answer: 'Organizers can create an event in under 10 minutes via our CMS portal with real-time payout reconciliation, bespoke tier structures, seated venue layouts, and complimentary access to our handheld Android/iOS scanning software. Contact organizers@opentickets.co.za or use our 24/7 concierge drawer.',
  },
];
