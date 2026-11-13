import { getOnboardingRoute, getStepProgress } from '@/store/useOnboardingStore';

jest.mock('@/store/useConfigStore', () => ({
  useConfigStore: { getState: () => ({ config: null }) },
}));
jest.mock('@/utils/onboarding', () => ({
  FIRST_ONBOARDING_STEP: 'get-started',
  ONBOARDING_VERSION: 3,
  OnboardingService: {},
}));

describe('private build onboarding route', () => {
  it('skips the keyboard demo, the Cloud choice, the paywall, the account and tracking steps', () => {
    for (const mode of [null, 'cloud', 'private'] as const) {
      expect(getOnboardingRoute(mode)).toEqual([
        'get-started',
        'welcome',
        'microphone',
        'language',
        'private-download',
        'notifications',
        'graduation',
      ]);
    }
  });

  it('numbers only the steps the private route shows', () => {
    expect(getStepProgress('microphone')).toEqual({ current: 1, total: 3 });
    expect(getStepProgress('private-download')).toEqual({ current: 2, total: 3 });
    expect(getStepProgress('notifications')).toEqual({ current: 3, total: 3 });
    expect(getStepProgress('paywall')).toBeUndefined();
  });
});
