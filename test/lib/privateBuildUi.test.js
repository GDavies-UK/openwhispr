const assert = require("node:assert/strict");
const test = require("node:test");

const { decideUpsell } = require("../../src/lib/upsell.ts");

test("the private build never shows an upgrade prompt", () => {
  for (const isSignedIn of [false, true]) {
    for (const hasPaidAccess of [null, false, true]) {
      assert.equal(
        decideUpsell({ authLoaded: true, isSignedIn, hasPaidAccess, isPastDue: false }),
        "hide"
      );
    }
  }
});

test("the private build has no Plan & Billing section", async () => {
  const { buildSettingsNav } = await import("../../src/lib/settingsNav.ts");
  for (const isSignedIn of [false, true]) {
    const nav = buildSettingsNav({ isSignedIn, hasWorkspace: false, canManageSettings: false });
    assert.equal(
      nav.some((entry) => entry.id === "plansBilling"),
      false
    );
  }
});

test("the private build's first run has no account screen and no Cloud choice", async () => {
  const { getOnboardingRoute, createOnboardingSession } =
    await import("../../src/components/onboarding/flow.ts");

  const session = createOnboardingSession();
  assert.equal(session.authPath, "guest");
  assert.equal(session.setupMode, "local");
  assert.equal(session.currentStepId, "permissions");

  // Whatever an older saved session says, the route is the same three steps.
  for (const authPath of [null, "guest", "account"]) {
    for (const setupMode of [null, "cloud", "byok", "local"]) {
      const route = getOnboardingRoute({ authPath, setupMode, agentAllowed: true });
      assert.deepEqual(route, ["permissions", "dictation-hotkey", "local-setup"]);
    }
  }
});
