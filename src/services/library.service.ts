/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameService } from './frame.service'

import { IFrame } from '@/types/frame.type'
import { supabaseClient } from '@/utils/supabase/client'

const getFrameFromLibrary = async (profileId: string) => {
  const framesQuery = supabaseClient
    .from('library')
    .select('*, frame:frame_id (*)')
    .eq('profile_id', profileId)

  return framesQuery.then(
    (res: any) => res.data,
    (error: any) => {
      throw error
    }
  )
}

const saveFrameInLibrary = async (frameId: IFrame['id'], profileId: string) =>
  supabaseClient.functions.invoke('save-to-library', {
    body: {
      frameId,
      profileId,
    },
  })

const importFrameFromLibrary = async ({
  libraryId,
  meetingId,
  sectionId,
}: {
  libraryId: string
  sectionId: string
  meetingId: string
}) =>
  supabaseClient.functions.invoke('import-from-library', {
    body: {
      libraryId,
      meetingId,
      sectionId,
    },
  })

const deleteFrameFromLibrary = async (frameId: string) => {
  await FrameService.deleteFrame(frameId)
}

export const LibraryService = {
  saveFrameInLibrary,
  getFrameFromLibrary,
  deleteFrameFromLibrary,
  importFrameFromLibrary,
}
