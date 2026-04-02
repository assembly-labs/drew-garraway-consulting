import type { TranscriptionResponse } from '../types';

export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
  const formData = new FormData();

  // Determine file extension based on mime type
  const mimeType = audioBlob.type;
  let extension = 'webm';
  if (mimeType.includes('mp4')) {
    extension = 'mp4';
  } else if (mimeType.includes('ogg')) {
    extension = 'ogg';
  }

  formData.append('audio', audioBlob, `recording.${extension}`);

  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.text };
  } catch (error) {
    if (error instanceof Error) {
      return { text: '', error: error.message };
    }
    return { text: '', error: 'An unexpected error occurred' };
  }
}
