/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameService } from './frame.service'

import { MediaTypeNames } from '@/components/common/Library/MediaLibrary'
import { IFrame } from '@/types/frame.type'
import { AssetsLibraryModel, FramesLibraryModel } from '@/types/models'
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
        data: res.data as Array<FramesLibraryModel & { frame: IFrame }>,
        count: res.count, // Optional if you modify the query to also fetch a count.
        page,
      }
    },
    (error: any) => {
      throw error
    }
  )
}

const getMediaFromLibrary = async ({
  profileId,
  page = 1,
  mediaTypes,
  search,
  pageSize = 8,
}: {
  profileId: string
  mediaTypes?: string[]
  page?: number
  search?: string
  pageSize: number
}) => {
  const offset = (page - 1) * pageSize

  const mediaQuery = supabaseClient
    .from('asset_library')
    .select('*', { count: 'exact' })
    .eq('profile_id', profileId)
    .or('is_deleted.is.null,is_deleted.eq.false')
    .range(offset, pageSize * page - 1)

  if (mediaTypes?.length) {
    mediaQuery.in('file_type', mediaTypes)
  }
  if (search) {
    mediaQuery.ilike('path', `%${search}%`)
  }

  return mediaQuery.then(
    (res: any) => {
      if (res.error) {
        throw res.error
      }

      return {
        data: res.data as Array<
          AssetsLibraryModel & { file_type: MediaTypeNames }
        >,
        count: res.count, // Optional if you modify the query to also fetch a count.
        page,
      }
    },
    (error: any) => {
      throw error
    }
  )
}

const saveMediaInLibrary = async ({
  path,
  profileId,
  mediaType,
}: {
  path: string
  profileId: string
  mediaType?: string
}) => {
  const mediaQuery = supabaseClient
    .from('asset_library')
    .insert({
      file_type: mediaType,
      path,
      profile_id: profileId,
    })
    .select('*')

  return mediaQuery.then(
    (res: any) => {
      if (res.error) {
        throw res.error
      }

      return res.data as AssetsLibraryModel
    },
    (error: any) => {
      throw error
    }
  )
}

const deleteMediaFromLibrary = async (mediaIds: string[]) => {
  const mediaQuery = supabaseClient
    .from('asset_library')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .in('id', mediaIds)

  return mediaQuery.then(
    (res: any) => {
      if (res.error) {
        throw res.error
      }

      return res.data
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
  breakoutActivityId,
  insertAfterFrameId,
}: {
  frameId: string
  sectionId: string
  meetingId: string
  breakoutFrameId?: string
  breakoutActivityId?: string
  insertAfterFrameId: string
}): Promise<{ success: boolean; frame: IFrame }> =>
  supabaseClient.functions
    .invoke('import-from-library', {
      body: {
        frameIds: [frameId],
        meetingId,
        sectionId,
        breakoutFrameId,
        insertAfterFrameId,
        breakoutActivityId,
      },
    })
    .then((res) => JSON.parse(res.data))

const deleteFrameFromLibrary = async (frameId: string) => {
  await FrameService.deleteFrame(frameId)
}

export const LibraryService = {
  saveFrameInLibrary,
  getMediaFromLibrary,
  saveMediaInLibrary,
  deleteMediaFromLibrary,
  getFrameFromLibrary: getFramesFromLibrary,
  deleteFrameFromLibrary,
  importFrameFromLibrary,
}
