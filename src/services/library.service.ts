/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameService } from './frame.service'

import { IFrame } from '@/types/frame.type'
import { supabaseClient } from '@/utils/supabase/client'

const getFramesFromLibrary = async (profileId: string, page: number = 1) => {
  const offset = (page - 1) * 10

  const framesQuery = supabaseClient
    .from('library')
    .select('*, frame:frame_id (*)', { count: 'exact' })
    .eq('profile_id', profileId)
    .range(offset, 10 * page - 1)

  return framesQuery.then(
    (res: any) => {
      if (res.error) {
        throw res.error
      }

      return {
        data: res.data,
        count: res.count, // Optional if you modify the query to also fetch a count.
        page,
      }
    },
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
  frameId,
  meetingId,
  sectionId,
}: {
  frameId: string
  sectionId: string
  meetingId: string
}) =>
  supabaseClient.functions.invoke('import-from-library', {
    body: {
      frameId,
      meetingId,
      sectionId,
    },
  })

const deleteFrameFromLibrary = async (frameId: string) => {
  await FrameService.deleteFrame(frameId)
}

export const LibraryService = {
  saveFrameInLibrary,
  getFrameFromLibrary: getFramesFromLibrary,
  deleteFrameFromLibrary,
  importFrameFromLibrary,
}
