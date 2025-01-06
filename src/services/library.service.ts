/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameService } from './frame.service'

import { IFrame } from '@/types/frame.type'
import { LibraryModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

const getFramesFromLibrary = async ({
  profileId,
  page = 1,
  frameTypes,
}: {
  profileId: string
  frameTypes?: string[]
  page?: number
}) => {
  const offset = (page - 1) * 8

  const framesQuery = supabaseClient
    .from('library')
    .select('*, frame:frame_id!inner(*)', { count: 'exact' })
    .eq('profile_id', profileId)
    .range(offset, 8 * page - 1)

  if (frameTypes?.length) {
    framesQuery.in('frame.type', frameTypes)
  }

  return framesQuery.then(
    (res: any) => {
      if (res.error) {
        throw res.error
      }

      return {
        data: res.data as Array<LibraryModel & { frame: IFrame }>,
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
  breakoutFrameId,
}: {
  frameId: string
  sectionId: string
  meetingId: string
  breakoutFrameId?: string
}): Promise<{ success: boolean; frame: IFrame }> =>
  supabaseClient.functions
    .invoke('import-from-library', {
      body: {
        frameId,
        meetingId,
        sectionId,
        breakoutFrameId,
      },
    })
    .then((res) => JSON.parse(res.data))

const deleteFrameFromLibrary = async (frameId: string) => {
  await FrameService.deleteFrame(frameId)
}

export const LibraryService = {
  saveFrameInLibrary,
  getFrameFromLibrary: getFramesFromLibrary,
  deleteFrameFromLibrary,
  importFrameFromLibrary,
}
