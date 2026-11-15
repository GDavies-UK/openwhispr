// These cover stock OpenWhispr; the private build has its own tests (privateBuildUi.test.js).
globalThis.__OPENWHISPR_STOCK_UI__ = true;

const assert = require("node:assert/strict");
const test = require("node:test");

test("saved sessions default to no helper and preserve explicit pending permission", async () => {
  const { createOnboardingSession, parseOnboardingSession } =
    await import("../../src/components/onboarding/flow.ts");
  const session = createOnboardingSession();
  assert.equal(session.permissionGuide, null);
  delete session.permissionGuide;
  const parse = (permissionGuide) =>
    parseOnboardingSession(JSON.stringify({ ...session, permissionGuide })).permissionGuide;
  assert.equal(parse(undefined), null);
  assert.equal(parse("screen-context"), "screen-context");
  assert.equal(parse("files"), null);
});
