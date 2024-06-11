import { APIService } from './api-service'

const upsertSlideNotes = async ({
  notesPayload,
  slideId,
  noteId,
}: {
  notesPayload: {
    content: string
  }
  slideId: string
  noteId?: string
}) => {
  const query = APIService.supabaseClient
    .from('notes')
    .upsert(
      {
        content: notesPayload.content,
        slide_id: slideId,
        ...(noteId ? { id: noteId } : {}),
      },
      { onConflict: 'slide_id' }
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

const getSlideNotes = async ({ slideId }: { slideId: string }) => {
  const query = APIService.supabaseClient
    .from('notes')
    .select('*')
    .eq('slide_id', slideId)
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

export const SlideNotesService = {
  upsertSlideNotes,
  getSlideNotes,
}
