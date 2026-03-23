/**
 * TOMO — Offline Audio Queue
 *
 * When a voice recording is made without internet, the audio upload
 * and pipeline (transcribe → extract) can't run. This service queues
 * failed uploads and retries them when connectivity returns.
 *
 * Queue is persisted in AsyncStorage so it survives app restarts.
 *
 * USAGE:
 *   import { offlineQueue } from '@/services/offline-queue';
 *
 *   // After upload fails:
 *   await offlineQueue.enqueue({ sessionId, fileUri, entry });
 *
 *   // On app launch or when connectivity returns:
 *   await offlineQueue.processQueue();
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { audioService, edgeFunctions, sessionService } from './supabase';

const QUEUE_KEY = '@tomo_offline_audio_queue';

export interface QueuedUpload {
  sessionId: string;
  fileUri: string;
  entry: {
    trainingMode: string;
    sessionKind: string;
    durationMinutes: number;
    didSpar: boolean | null;
  };
  queuedAt: string; // ISO timestamp
}

async function getQueue(): Promise<QueuedUpload[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveQueue(queue: QueuedUpload[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export const offlineQueue = {
  /** Add a failed upload to the retry queue */
  async enqueue(item: Omit<QueuedUpload, 'queuedAt'>): Promise<void> {
    const queue = await getQueue();
    queue.push({ ...item, queuedAt: new Date().toISOString() });
    await saveQueue(queue);
  },

  /** Process all queued uploads. Call when connectivity returns. */
  async processQueue(): Promise<{ processed: number; failed: number }> {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return { processed: 0, failed: 0 };
    }

    const queue = await getQueue();
    if (queue.length === 0) {
      return { processed: 0, failed: 0 };
    }

    let processed = 0;
    const remaining: QueuedUpload[] = [];

    for (const item of queue) {
      try {
        // Upload audio
        const audioPath = await audioService.upload(item.sessionId, item.fileUri);
        if (!audioPath) {
          remaining.push(item);
          continue;
        }

        // Transcribe
        const transcriptionResult = await edgeFunctions.transcribe(audioPath);
        const transcript = transcriptionResult?.transcript ?? '';

        // Extract
        let extractedData = null;
        if (transcript) {
          const extractionResult = await edgeFunctions.extract(transcript, {
            mode: item.entry.trainingMode,
            kind: item.entry.sessionKind,
            duration: item.entry.durationMinutes,
            spar: item.entry.didSpar ?? undefined,
          });
          extractedData = extractionResult?.data ?? null;
        }

        // Update the session with audio path, transcript, and extraction results
        await sessionService.update(item.sessionId, {
          audio_path: audioPath,
          transcript: transcript || null,
          transcription_status: transcript ? 'completed' : 'failed',
          extraction_status: extractedData ? 'completed' : 'failed',
          ...(extractedData ? {
            techniques_drilled: extractedData.techniquesDrilled,
            lesson_topic: extractedData.lessonTopic,
            did_spar: extractedData.didSpar ?? item.entry.didSpar ?? false,
            sparring_rounds: extractedData.sparringRounds,
            instructor: extractedData.instructor,
            warmed_up: extractedData.warmedUp,
            submissions_given: extractedData.submissionsGiven,
            submissions_received: extractedData.submissionsReceived,
            injuries: extractedData.injuries,
          } : {}),
        });

        processed++;
      } catch {
        // Keep in queue for next retry
        remaining.push(item);
      }
    }

    await saveQueue(remaining);
    return { processed, failed: remaining.length };
  },

  /** Clear the queue (e.g., on sign out) */
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },
};
