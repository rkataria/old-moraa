import { APIService } from './api-service'

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
  const query = APIService.supabaseClient
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
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const getFrameNotes = async ({ frameId }: { frameId: string }) => {
  const query = APIService.supabaseClient
    .from('notes')
    .select('*')
    .eq('frame_id', frameId)
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

export const FrameNotesService = {
  upsertFrameNotes,
  getFrameNotes,
}
