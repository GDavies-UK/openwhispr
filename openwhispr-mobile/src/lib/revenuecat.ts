// Private build: in-app purchases (RevenueCat) are removed. Nothing is bought,
// restored or reported.
export function configureRevenueCat(): void {}

export async function identifyRevenueCatUser(_userId: string): Promise<boolean> {
  return false;
}

export async function resetRevenueCatUser(): Promise<void> {}

export async function reconcileRevenueCatPurchases(
  _billingUserId: string,
  _isCurrent: () => boolean,
): Promise<boolean> {
  return false;
}

export async function recordRevenueCatPurchase(_productId: string): Promise<boolean> {
  return false;
}

export async function getAppStorefrontCountryCode(): Promise<string | null> {
  return null;
}

export async function showAppStoreManageSubscriptions(): Promise<boolean> {
  return false;
}
