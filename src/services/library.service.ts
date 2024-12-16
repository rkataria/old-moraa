/* eslint-disable @typescript-eslint/no-explicit-any */
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

const saveFrameInLibrary = async (
  framePayload: Partial<IFrame>,
  profileId: string
) => {
  const newFrame = await supabaseClient
    .from('frame')
    .insert([framePayload])
    .select('*')
    .single()

  const query = supabaseClient
    .from('library')
    .insert([
      {
        frame_id: newFrame.data?.id,
        profile_id: profileId,
      },
    ])
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const LibraryService = {
  saveFrameInLibrary,
  getFrameFromLibrary,
}
