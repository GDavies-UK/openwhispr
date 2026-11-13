// Private build: creator-code subscription offers are removed; no offer is ever loaded.
export interface AffiliateOffer {
  campaign: string;
  productId: string;
  country: string;
  currency: string;
  regularPrice: number;
  offerPrice: number;
  months: 3;
  redemptionUrl: string;
  expiresAt: string;
}
const OFFER_PERCENT_OFF = 20;
// Apple price tiers can't always hit exactly 20% off, so a storefront may use the highest tier
// below it. Anything deeper than this is a catalog typo (7.1 for 71), not a price tier.
const TIER_MAX_PERCENT_OFF = 30;
const MINOR_UNIT_TOLERANCE = 0.000001;
export function validAffiliateOffer(value: unknown, country: string): value is AffiliateOffer {
  if (!value || typeof value !== 'object') return false;
  const v = value as AffiliateOffer;
  try {
    const url = new URL(v.redemptionUrl);
    const digits =
      new Intl.NumberFormat('en', { style: 'currency', currency: v.currency }).resolvedOptions()
        .maximumFractionDigits ?? 2;
    const regularMinor = v.regularPrice * 10 ** digits;
    const offerMinor = v.offerPrice * 10 ** digits;
    return (
      typeof v.campaign === 'string' &&
      typeof v.productId === 'string' &&
      v.country === country &&
      /^[A-Z]{3}$/.test(v.currency) &&
      v.months === 3 &&
      Number.isFinite(v.regularPrice) &&
      v.regularPrice > 0 &&
      Number.isFinite(v.offerPrice) &&
      Math.abs(offerMinor - Math.round(offerMinor)) < MINOR_UNIT_TOLERANCE &&
      offerMinor <= regularMinor * (1 - OFFER_PERCENT_OFF / 100) + MINOR_UNIT_TOLERANCE &&
      offerMinor >= regularMinor * (1 - TIER_MAX_PERCENT_OFF / 100) - MINOR_UNIT_TOLERANCE &&
      Date.parse(v.expiresAt) > Date.now() &&
      url.protocol === 'https:' &&
      url.hostname === 'apps.apple.com' &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname === '/redeem' &&
      url.searchParams.get('ctx') === 'offercodes' &&
      /^\d+$/.test(url.searchParams.get('id') ?? '') &&
      /^[A-Za-z0-9]+$/.test(url.searchParams.get('code') ?? '')
    );
  } catch {
    return false;
  }
}
export async function loadAffiliateOffer(
  _isCallerCurrent: () => boolean = () => true,
): Promise<AffiliateOffer | null> {
  return null;
}
