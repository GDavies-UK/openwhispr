import React, { useCallback, useMemo } from 'react';
import { SuperwallGateContext } from '@/hooks/useSuperwallGate';
import type { RegisterSuperwallGateOptions } from '@/hooks/useSuperwallGate';
import { isTransactionalSuperwallPlacement } from '@/lib/superwall';

type Props = {
  children: React.ReactNode;
};

// Private build: no paywall, no subscriptions. Every feature gate opens at once.
// Billing placements (manage subscription, cloud usage limits, cloud sync) have
// nothing behind them here, so they do nothing.
export function OpenWhisprSuperwallProvider({ children }: Props) {
  const register = useCallback(
    async ({
      placement,
      feature,
      onAccessGrantedWithoutPurchase,
    }: RegisterSuperwallGateOptions): Promise<boolean> => {
      if (isTransactionalSuperwallPlacement(placement)) return false;
      feature?.();
      onAccessGrantedWithoutPurchase?.();
      return true;
    },
    [],
  );

  const value = useMemo(
    () => ({ register, state: { status: 'idle' } as const, isConfigured: true }),
    [register],
  );

  return <SuperwallGateContext.Provider value={value}>{children}</SuperwallGateContext.Provider>;
}
