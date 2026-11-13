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
