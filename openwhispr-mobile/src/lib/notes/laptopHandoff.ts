import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { isManagedMeetingAudioUri } from '@/lib/transcriptAudio';
import { DEFAULT_MEETING_TITLE } from '@/lib/notes/meetingConstants';
import type { Note } from '@/data/types';

// The private build records meetings on the iPhone and hands the recording to
// the laptop app, which transcribes it, labels the speakers and writes the
// minutes there (Notes → Upload). The file's name carries the meeting's title
// and when it was recorded; the laptop reads both back from it
// (phoneRecordingTitle in the desktop's src/services/uploadNotes.ts), so the two
// sides must agree on the shape: "<title> (YYYY-MM-DD HH.MM).wav".

const HANDOFF_DIR = 'laptop-handoff/';

// Characters Windows and macOS refuse in a file name, plus control characters.
// eslint-disable-next-line no-control-regex
const UNSAFE_FILE_NAME = /[\\/:*?"<>|\u0000-\u001f]/g;

/** A recorded meeting that hasn't been transcribed yet, with its audio still on this iPhone. */
export function isAwaitingTranscription(
  note: Pick<Note, 'id' | 'noteType' | 'transcriptionStatus' | 'sourceFile'> | null | undefined,
): boolean {
  return (
    note?.noteType === 'meeting' &&
    note.transcriptionStatus === 'idle' &&
    isManagedMeetingAudioUri(note.id, note.sourceFile)
  );
}

/** "42 s", "24 min", "1 h 37 min"; null when the length is unknown. */
export function formatRecordingLength(seconds: number | null | undefined): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const rounded = Math.round(seconds);
  if (rounded < 60) return `${rounded} s`;
  const minutes = Math.round(rounded / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/** "<title> (YYYY-MM-DD HH.MM).wav", in the phone's local time. */
export function laptopRecordingFileName(
  title: string | null | undefined,
  recordedAt: Date,
): string {
  const cleaned = (title ?? '')
    .replace(UNSAFE_FILE_NAME, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Leave room for the stamp; most file systems stop at 255 bytes.
    .slice(0, 80)
    .trim();
  const name = cleaned || DEFAULT_MEETING_TITLE;
  const stamp =
    `${recordedAt.getFullYear()}-${pad(recordedAt.getMonth() + 1)}-${pad(recordedAt.getDate())} ` +
    `${pad(recordedAt.getHours())}.${pad(recordedAt.getMinutes())}`;
  return `${name} (${stamp}).wav`;
}

// SQLite's datetime('now') is UTC without a zone ("2026-11-13 09:30:00").
export function parseNoteTimestamp(value: string | null | undefined): Date {
  if (!value) return new Date();
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Opens the share sheet with a copy of the meeting's recording, named for the
 * laptop: AirDrop to a Mac, or Save to Files (iCloud Drive, OneDrive) for a PC.
 * The recording itself stays where it is, so it can be sent again.
 */
export async function sendRecordingToLaptop(
  note: Pick<Note, 'id' | 'title' | 'createdAt' | 'sourceFile'>,
): Promise<void> {
  if (!note.sourceFile || !isManagedMeetingAudioUri(note.id, note.sourceFile)) {
    throw new Error('The recording for this meeting is no longer on this iPhone.');
  }
  if (!FileSystem.cacheDirectory) throw new Error('Storage is not available.');

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this iPhone.');
  }

  // The previous copy is cleared here rather than after sharing: the share sheet
  // can resolve before AirDrop has finished reading the file.
  const dir = `${FileSystem.cacheDirectory}${HANDOFF_DIR}`;
  await FileSystem.deleteAsync(dir, { idempotent: true });
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const fileName = laptopRecordingFileName(note.title, parseNoteTimestamp(note.createdAt));
  // A file URI must be percent-encoded; the name on disk is the decoded one.
  const target = `${dir}${encodeURIComponent(fileName)}`;
  await FileSystem.copyAsync({ from: note.sourceFile, to: target });

  await Sharing.shareAsync(target, {
    mimeType: 'audio/wav',
    UTI: 'com.microsoft.waveform-audio',
    dialogTitle: 'Send recording to your laptop',
  });
}
