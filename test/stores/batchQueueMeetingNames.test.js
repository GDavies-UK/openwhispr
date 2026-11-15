const test = require("node:test");
const assert = require("node:assert/strict");
const { createRendererServer, installBrowserGlobals } = require("../lib/rendererTestHarness");

async function waitForQueueCompletion(useBatchQueueStore) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (!useBatchQueueStore.getState().isProcessing) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error("Batch queue did not finish");
}

test("each queued file is saved under the meeting name typed for it", async (t) => {
  installBrowserGlobals(t);
  globalThis.__savedTitles = [];
  globalThis.__releaseFirst = null;
  t.after(() => {
    delete globalThis.__savedTitles;
    delete globalThis.__releaseFirst;
  });

  const vite = await createRendererServer(t, {
    cachePrefix: "openwhispr-batch-meeting-names-test-",
    mockModules: {
      "/services/fileTranscription": `
        let calls = 0;
        export async function transcribeFileWithSpeakers() {
          calls += 1;
          // Hold the first file so the second one's name can be edited mid-run.
          if (calls === 1) await new Promise((resolve) => { globalThis.__releaseFirst = resolve; });
          return { success: true, text: "Transcript " + calls };
        }
      `,
      "/components/notes/shared": `
        export const DOWNLOAD_ERROR_KEYS = {};
        export function transcriptionErrorKey() { return null; }
        export function isUploadPolicyRefusal() { return false; }
        export function uploadRestrictionKey() { return ""; }
      `,
      "/services/uploadNotes": `
        export async function saveUploadNote(note) {
          globalThis.__savedTitles.push(note.title);
          return { success: true, note: { id: globalThis.__savedTitles.length } };
        }
        export function uploadTitleFallback() { return "Fallback"; }
        export function phoneRecordingTitle(name) {
          const m = /^(.+) \\(\\d{4}-\\d{2}-\\d{2} \\d{2}\\.\\d{2}\\)\\.wav$/.exec(name);
          return m ? m[1] : null;
        }
      `,
      "/stores/settingsStore": "export function getSettings() { return {}; }",
      "/stores/policyRules":
        "export function isTranscriptionContextAllowed() { return true; } export function isAudioFeatureAllowed() { return true; }",
      "/stores/policyStore": `
        export const usePolicyStore = { getState() { return {}; }, subscribe() { return () => {}; } };
      `,
    },
  });
  const { addFiles, setQueueItemTitle, processBatchQueue, useBatchQueueStore } =
    await vite.ssrLoadModule("/stores/batchQueueStore.ts");

  const items = addFiles([
    { name: "REC001.mp3", path: "/tmp/REC001.mp3", sizeBytes: 1 },
    { name: "Board meeting (2026-11-14 10.00).wav", path: "/tmp/b.wav", sizeBytes: 1 },
    { name: "REC003.mp3", path: "/tmp/REC003.mp3", sizeBytes: 1 },
  ]);
  // The phone's own title is offered as the starting name; other files start blank.
  assert.deepEqual(
    useBatchQueueStore.getState().queue.map((i) => i.title),
    ["", "Board meeting", ""]
  );
  setQueueItemTitle(items[0].id, "  Ops review  ");

  processBatchQueue(
    { transcription: { getApiKey: () => "" }, folderId: null, generateTitle: async () => "Generated" },
    { enabled: false }
  );
  for (let i = 0; i < 50 && !globalThis.__releaseFirst; i += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
  // Renamed while the first file is still transcribing: the new name is used.
  setQueueItemTitle(items[1].id, "Board meeting, November");
  globalThis.__releaseFirst();
  await waitForQueueCompletion(useBatchQueueStore);

  assert.deepEqual(globalThis.__savedTitles, [
    "Ops review",
    "Board meeting, November",
    "Generated",
  ]);
});
