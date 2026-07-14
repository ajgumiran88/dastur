import { describe, it, expect } from 'vitest';
import { waLink, telLink, mailto, orderMessage, orderWaLink } from './links';

describe('links', () => {
  it('builds a wa.me link with digits only and encoded text', () => {
    const url = waLink('+971 50 123 4567', 'Hello DASTUR');
    expect(url.startsWith('https://wa.me/971501234567')).toBe(true);
    expect(url).toContain('text=Hello%20DASTUR');
  });

  it('builds tel/mailto links', () => {
    expect(telLink('+971 4 000 0000')).toBe('tel:+97140000000');
    expect(mailto('orders@dastur.example')).toBe('mailto:orders@dastur.example');
  });

  it('order message names the dish when provided', () => {
    expect(orderMessage('en', 'Machboos Laham')).toContain('Machboos Laham');
    expect(orderMessage('en')).toContain('place an order');
  });

  it('produces an Arabic order message', () => {
    expect(orderMessage('ar', 'هريس')).toContain('هريس');
  });

  it('orderWaLink composes a wa.me link with the order message', () => {
    const url = orderWaLink('en', 'Harees');
    expect(url.startsWith('https://wa.me/')).toBe(true);
    expect(url).toContain(encodeURIComponent('Harees'));
  });
});
