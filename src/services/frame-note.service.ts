/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const upsertFrameNotes = async ({
  notesPayload,
  frameId,
  noteId,
}: {
  notesPayload: {
    content: string
  }
  frameId: string
  noteId?: string
}) => {
  const query = supabaseClient
    .from('notes')
    .upsert(
      {
        content: notesPayload.content,
        frame_id: frameId,
        ...(noteId ? { id: noteId } : {}),
      },
      { onConflict: 'frame_id' }
    )
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const getFrameNotes = async ({ frameId }: { frameId: string }) => {
  const query = supabaseClient
    .from('notes')
    .select('*')
    .eq('frame_id', frameId)
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const FrameNotesService = {
  upsertFrameNotes,
  getFrameNotes,
}
