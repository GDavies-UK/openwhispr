const test = require("node:test");
const assert = require("node:assert/strict");

const { phoneRecordingTitle } = require("../../src/services/uploadNotes.ts");

// The phone names its meeting recordings "<title> (YYYY-MM-DD HH.MM).wav"
// (openwhispr-mobile/src/lib/notes/laptopHandoff.ts, laptopRecordingFileName,
// whose own test holds the same pattern). These are names it produces.

test("a phone meeting recording keeps its meeting's title", () => {
  assert.equal(
    phoneRecordingTitle("Garage performance review (2026-11-13 09.05).wav"),
    "Garage performance review"
  );
  assert.equal(phoneRecordingTitle("Route 15 debrief (2026-01-02 17.30).WAV"), "Route 15 debrief");
});

test("a title with its own brackets is kept whole", () => {
  assert.equal(phoneRecordingTitle("Budget (draft 2) (2026-11-13 09.05).wav"), "Budget (draft 2)");
});

test("an unnamed meeting is left to the generated title", () => {
  assert.equal(phoneRecordingTitle("Untitled meeting (2026-11-13 09.05).wav"), null);
  assert.equal(phoneRecordingTitle("Meeting (2026-11-13 09.05).wav"), null);
});

test("any other file is left to the generated title", () => {
  for (const name of [
    "Garage performance review.wav",
    "meeting-12.wav",
    "Interview (2026-11-13).wav",
    "Garage review (2026-11-13 09.05).m4a",
    "voice memo 0905.mp3",
  ]) {
    assert.equal(phoneRecordingTitle(name), null, name);
  }
});
