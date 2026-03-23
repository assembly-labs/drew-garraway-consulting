-- Migration: Add DELETE RLS policy for audio-recordings storage bucket
-- Allows authenticated users to delete their own audio files.
-- Path pattern: {userId}/{sessionId}.m4a — ownership is enforced by the first folder segment.
-- Date: 2026-03-13

CREATE POLICY "Users delete own audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'audio-recordings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
