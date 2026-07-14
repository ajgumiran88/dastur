import type { Locale } from '@/lib/i18n';
import { site } from '@/config/site';

/** Strip everything but digits (wa.me requires a bare international number). */
function digits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Build a WhatsApp deep link with a pre-filled message. */
export function waLink(number: string, message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits(number)}?text=${text}`;
}

/** tel: link (keeps a leading +). */
export function telLink(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

/** mailto: link. */
export function mailto(email: string): string {
  return `mailto:${email}`;
}

/** Pre-filled order message; names a dish when provided. */
export function orderMessage(locale: Locale, dishName?: string): string {
  if (locale === 'ar') {
    return dishName
      ? `مرحباً دستور، أود طلب: ${dishName}`
      : 'مرحباً دستور، أود تقديم طلب.';
  }
  return dishName
    ? `Hello DASTUR, I'd like to order: ${dishName}`
    : "Hello DASTUR, I'd like to place an order.";
}

/** Convenience: the brand WhatsApp order link for a locale (optional dish). */
export function orderWaLink(locale: Locale, dishName?: string): string {
  return waLink(site.contact.whatsapp, orderMessage(locale, dishName));
}
