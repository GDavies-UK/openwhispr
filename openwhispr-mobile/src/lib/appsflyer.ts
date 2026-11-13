// Private build: install and ad attribution (AppsFlyer) is removed. These keep
// the shape the rest of the app calls and send nothing.
import type { TrackingAuthorizationStatus } from '@/lib/trackingTransparency';
import type { SuperwallPlacement } from '@/lib/superwall';
import type { TranscriptionProvider } from '@/types';

export type TranscriptionSource = 'keyboard' | 'recording' | 'file' | 'meeting';

export type AppsFlyerAttributionConsent = 'granted' | 'revoked' | 'undecided' | 'pending';

export function getAppsFlyerAttributionConsent(): AppsFlyerAttributionConsent {
  return 'revoked';
}

export function subscribeAppsFlyerAttribution(_listener: () => void): () => void {
  return () => {};
}

export async function getAppsFlyerRevenueId(): Promise<string | null> {
  return null;
}

export function setAppsFlyerTrackingAuthorizationStatus(
  _status: TrackingAuthorizationStatus,
): void {}

export async function refreshAppsFlyerTrackingAuthorization(): Promise<void> {}

export async function recheckAppsFlyerTrackingAuthorization(): Promise<void> {}

export function initAppsFlyer(): void {}

export function logAppsFlyerEvent(
  _eventName: string,
  _eventValues: Record<string, unknown> = {},
): void {}

export function logTutorialCompletion(_input: {
  keyboardInstalled: boolean;
  microphonePermissionGranted: boolean;
}): void {}

export function logTranscriptionCompleted(_input: {
  source: TranscriptionSource;
  provider: TranscriptionProvider;
}): void {}

export function logPaywallViewed(_placement: SuperwallPlacement): void {}

export function logSubscription(_productId: string, _placement: SuperwallPlacement): void {}
