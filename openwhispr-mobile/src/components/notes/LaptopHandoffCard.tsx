import { useState } from 'react';
import type React from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { SystemIcon } from '@/components/ui/SystemIcon';
import { safeHaptics } from '@/lib/utils';
import { formatRecordingLength, sendRecordingToLaptop } from '@/lib/notes/laptopHandoff';
import type { Note } from '@/data/types';

interface LaptopHandoffCardProps {
  note: Pick<Note, 'id' | 'title' | 'createdAt' | 'sourceFile' | 'audioDurationSeconds'>;
  /** Runs the on-device pipeline instead; the screen checks the models first. */
  onTranscribeHere: () => void;
  transcribingHere: boolean;
}

/**
 * Shown on a meeting the private build has recorded but not transcribed: the
 * laptop does the transcript, speaker labels and minutes, so the main action is
 * handing it the recording.
 */
export function LaptopHandoffCard({
  note,
  onTranscribeHere,
  transcribingHere,
}: LaptopHandoffCardProps): React.JSX.Element {
  const [sending, setSending] = useState(false);
  const length = formatRecordingLength(note.audioDurationSeconds);

  const send = async (): Promise<void> => {
    if (sending) return;
    safeHaptics('medium');
    setSending(true);
    try {
      await sendRecordingToLaptop(note);
    } catch (error) {
      Alert.alert(
        'Could not send the recording',
        error instanceof Error ? error.message : 'Try again.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View
      testID="laptop-handoff-card"
      className="mb-4 gap-3 bg-secondarySystemGroupedBackground p-4"
      style={{ borderRadius: 14, borderCurve: 'continuous' }}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-quaternarySystemFill">
          <SystemIcon name="waveform" mdName="AudioWaveform" size={18} color="brand" />
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-semibold text-label">
            Recording saved on this iPhone
          </Text>
          <Text className="mt-0.5 text-[13px] text-secondaryLabel">
            {length ? `${length} · ` : ''}not transcribed yet
          </Text>
        </View>
      </View>

      <Text className="text-[14px] leading-5 text-secondaryLabel">
        Send it to your laptop. It writes the transcript, labels who spoke and drafts the minutes
        and actions. On the laptop, open Notes → Upload and choose the file.
      </Text>

      <Pressable
        testID="send-to-laptop"
        accessibilityRole="button"
        onPress={() => {
          send().catch(() => undefined);
        }}
        disabled={sending || transcribingHere}
        className="h-11 flex-row items-center justify-center rounded-full bg-brand px-5 active:opacity-85 disabled:opacity-50"
      >
        {sending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <SystemIcon name="square.and.arrow.up" mdName="Share" size={15} color="#FFFFFF" />
            <Text className="ml-2 text-[14px] font-semibold text-white">Send to laptop</Text>
          </>
        )}
      </Pressable>

      <Pressable
        testID="transcribe-on-iphone"
        accessibilityRole="button"
        onPress={onTranscribeHere}
        disabled={sending || transcribingHere}
        className="h-9 flex-row items-center justify-center active:opacity-70 disabled:opacity-50"
      >
        {transcribingHere ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-[14px] font-medium text-link">
            Transcribe on this iPhone instead
          </Text>
        )}
      </Pressable>
    </View>
  );
}
