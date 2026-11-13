jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///docs/',
  cacheDirectory: 'file:///cache/',
  deleteAsync: jest.fn(async () => undefined),
  makeDirectoryAsync: jest.fn(async () => undefined),
  copyAsync: jest.fn(async () => undefined),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

import {
  formatRecordingLength,
  isAwaitingTranscription,
  laptopRecordingFileName,
  parseNoteTimestamp,
  sendRecordingToLaptop,
} from '../laptopHandoff';

const mockFs = jest.requireMock('expo-file-system/legacy') as Record<string, jest.Mock>;
const mockSharing = jest.requireMock('expo-sharing') as Record<string, jest.Mock>;

// The desktop reads these names back (src/services/uploadNotes.ts,
// phoneRecordingTitle). Keep this pattern and that one identical.
const LAPTOP_PATTERN = /^(.+) \((\d{4})-(\d{2})-(\d{2}) (\d{2})\.(\d{2})\)\.wav$/;

describe('laptopRecordingFileName', () => {
  const at = new Date(2026, 10, 13, 9, 5);

  it('names the file after the meeting and when it was recorded, in local time', () => {
    expect(laptopRecordingFileName('Garage performance review', at)).toBe(
      'Garage performance review (2026-11-13 09.05).wav',
    );
  });

  it('matches the pattern the laptop reads', () => {
    const match = LAPTOP_PATTERN.exec(laptopRecordingFileName('Route 15 debrief', at));
    expect(match?.[1]).toBe('Route 15 debrief');
  });

  it('replaces characters a file system refuses', () => {
    expect(laptopRecordingFileName('Q3: budget / "plan" <draft>?', at)).toBe(
      'Q3 budget plan draft (2026-11-13 09.05).wav',
    );
  });

  it('falls back to the default meeting title when there is no usable title', () => {
    expect(laptopRecordingFileName('  ///  ', at)).toBe('Untitled meeting (2026-11-13 09.05).wav');
    expect(laptopRecordingFileName(null, at)).toBe('Untitled meeting (2026-11-13 09.05).wav');
  });

  it('keeps long titles short enough for any file system', () => {
    const name = laptopRecordingFileName('x'.repeat(300), at);
    expect(name.length).toBeLessThanOrEqual(80 + ' (2026-11-13 09.05).wav'.length);
  });
});

describe('parseNoteTimestamp', () => {
  it("reads SQLite's zoneless datetime('now') as UTC", () => {
    expect(parseNoteTimestamp('2026-11-13 09:30:00').toISOString()).toBe(
      '2026-11-13T09:30:00.000Z',
    );
  });

  it('keeps a timestamp that already names its zone', () => {
    expect(parseNoteTimestamp('2026-11-13T09:30:00+01:00').toISOString()).toBe(
      '2026-11-13T08:30:00.000Z',
    );
  });

  it('uses now for a missing or unreadable value rather than an invalid date', () => {
    expect(Number.isNaN(parseNoteTimestamp(null).getTime())).toBe(false);
    expect(Number.isNaN(parseNoteTimestamp('not a date').getTime())).toBe(false);
  });
});

describe('isAwaitingTranscription', () => {
  const recorded = {
    id: 7,
    noteType: 'meeting',
    transcriptionStatus: 'idle',
    sourceFile: 'file:///docs/meeting-7.wav',
  };

  it('is true for a recorded meeting whose audio is still on the phone', () => {
    expect(isAwaitingTranscription(recorded)).toBe(true);
  });

  it('is false once transcription has started, finished or failed', () => {
    for (const status of ['recording', 'transcribing', 'diarizing', 'done', 'failed']) {
      expect(isAwaitingTranscription({ ...recorded, transcriptionStatus: status })).toBe(false);
    }
  });

  it('is false for an ordinary note, which is also idle by default', () => {
    expect(isAwaitingTranscription({ ...recorded, noteType: 'personal', sourceFile: null })).toBe(
      false,
    );
  });

  it("is false when the file is not this meeting's own recording", () => {
    expect(isAwaitingTranscription({ ...recorded, sourceFile: 'file:///docs/meeting-8.wav' })).toBe(
      false,
    );
  });
});

describe('sendRecordingToLaptop', () => {
  beforeEach(() => jest.clearAllMocks());

  const note = {
    id: 7,
    title: 'Garage review',
    createdAt: '2026-11-13 09:30:00',
    sourceFile: 'file:///docs/meeting-7.wav',
  };

  it('copies the recording under its laptop name and shares that copy', async () => {
    await sendRecordingToLaptop(note);
    const name = laptopRecordingFileName(note.title, parseNoteTimestamp(note.createdAt));
    const target = `file:///cache/laptop-handoff/${encodeURIComponent(name)}`;
    expect(mockFs.copyAsync).toHaveBeenCalledWith({ from: note.sourceFile, to: target });
    expect(mockSharing.shareAsync).toHaveBeenCalledWith(
      target,
      expect.objectContaining({ mimeType: 'audio/wav' }),
    );
  });

  it('clears the previous copy before making the new one, never after sharing', async () => {
    await sendRecordingToLaptop(note);
    const deleteOrder = mockFs.deleteAsync.mock.invocationCallOrder[0];
    const copyOrder = mockFs.copyAsync.mock.invocationCallOrder[0];
    const shareOrder = mockSharing.shareAsync.mock.invocationCallOrder[0];
    expect(deleteOrder).toBeLessThan(copyOrder);
    expect(mockFs.deleteAsync).toHaveBeenCalledTimes(1);
    expect(copyOrder).toBeLessThan(shareOrder);
  });

  it('refuses a note whose recording is gone, without opening the share sheet', async () => {
    await expect(sendRecordingToLaptop({ ...note, sourceFile: null })).rejects.toThrow(
      'no longer on this iPhone',
    );
    expect(mockSharing.shareAsync).not.toHaveBeenCalled();
  });

  it('says so when the phone cannot share', async () => {
    mockSharing.isAvailableAsync.mockResolvedValueOnce(false);
    await expect(sendRecordingToLaptop(note)).rejects.toThrow('Sharing is not available');
    expect(mockFs.copyAsync).not.toHaveBeenCalled();
  });
});

describe('formatRecordingLength', () => {
  it('reads like a person would say it', () => {
    expect(formatRecordingLength(42)).toBe('42 s');
    expect(formatRecordingLength(23 * 60 + 41)).toBe('24 min');
    expect(formatRecordingLength(60 * 60)).toBe('1 h');
    expect(formatRecordingLength(97 * 60)).toBe('1 h 37 min');
  });

  it('shows nothing for an unknown length', () => {
    for (const value of [null, undefined, 0, -3, Number.NaN]) {
      expect(formatRecordingLength(value)).toBeNull();
    }
  });
});
