import { createContext, useContext } from 'react';
import type { AffiliateOffer } from '@/lib/affiliateOffer';
import {
  isTransactionalSuperwallPlacement,
  type SuperwallAttributes,
  type SuperwallPlacement,
} from '@/lib/superwall';

export type SuperwallPurchaseCompletion = 'purchased' | 'restored';

export type RegisterSuperwallGateOptions = {
  placement: SuperwallPlacement;
  /** Verified app-owned offer from an explicit creator submission; never sent to Superwall. */
  creatorOffer?: AffiliateOffer;
  params?: Partial<SuperwallAttributes> & Record<string, unknown>;
  feature?: () => void;
  onAccessGrantedWithoutPurchase?: () => void;
  onPurchaseComplete?: (completion: SuperwallPurchaseCompletion) => void;
  /** Called once the native paywall is on screen. */
  onPresent?: () => void;
  requiresAccount?: boolean;
  /** Cancels the registration when its screen is left. */
  signal?: AbortSignal;
};

// Private build: there is no paywall, so the state never leaves 'idle'.
export type PaywallState = { status: 'idle' };

type SuperwallGateContextValue = {
  register: (options: RegisterSuperwallGateOptions) => Promise<boolean>;
  state: PaywallState;
  /** False until the SDK's configure round trip completes; true when Superwall is off in this build. */
  isConfigured: boolean;
};

// Default mirrors DisabledSuperwallGateProvider's fail-open semantics so a
// screen rendered without a provider (tests) never swallows a pass-through
// feature; transactional placements still fail closed.
export const SuperwallGateContext = createContext<SuperwallGateContextValue>({
  register: async ({ placement, feature, onAccessGrantedWithoutPurchase, requiresAccount }) => {
    if (requiresAccount ?? isTransactionalSuperwallPlacement(placement)) return false;
    feature?.();
    onAccessGrantedWithoutPurchase?.();
    return true;
  },
  state: { status: 'idle' },
  isConfigured: true,
});

export function useSuperwallGate(): SuperwallGateContextValue {
  return useContext(SuperwallGateContext);
}
