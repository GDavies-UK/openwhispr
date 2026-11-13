// Private build: no advertising identifier is ever requested, so App Tracking
// Transparency is never asked for.
export type TrackingAuthorizationStatus =
  | 'authorized'
  | 'denied'
  | 'notDetermined'
  | 'notSupported';

export async function getTrackingAuthorizationStatus(): Promise<TrackingAuthorizationStatus> {
  return 'notSupported';
}

export async function requestTrackingAuthorization(): Promise<TrackingAuthorizationStatus> {
  return 'notSupported';
}
