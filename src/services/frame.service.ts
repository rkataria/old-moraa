/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFrame } from '@/types/frame.type'
import { supabaseClient } from '@/utils/supabase/client'

const getFrames = async ({
  meetingId,
  sectionIds,
  frameIds,
}: {
  meetingId?: string
  sectionIds?: string[]
  frameIds?: string[]
}) => {
  const query = supabaseClient.from('frame').select('*')

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionIds) query.in('section_id', sectionIds)
  if (frameIds) query.in('id', frameIds)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const createFrame = async (framePayload: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  meeting_id: string
  section_id: string
}) => {
  const query = supabaseClient
    .from('frame')
    .insert([framePayload])
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const createFrames = async (
  framesPayload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    meeting_id: string
    section_id: string
  }[]
) => {
  const query = supabaseClient.from('frame').insert([...framesPayload])

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const duplicateFrame = async (framePayload: {
  frameId: string
  sectionId: string
  meetingId: string
}) => {
  const query = supabaseClient.functions.invoke('duplicate-frame', {
    body: {
      ...framePayload,
    },
  })

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const updateFrame = async ({
  framePayload,
  frameId,
}: {
  framePayload: Partial<IFrame>
  frameId: string
}) => {
  const query = supabaseClient
    .from('frame')
    .update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(framePayload as any),
    })
    .eq('id', frameId)
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const updateFrames = async ({
  framePayload,
  frameIds,
  sectionId,
  meetingId,
}: {
  framePayload: Partial<IFrame>
  frameIds?: string[]
  sectionId?: string
  meetingId?: string
}) => {
  const query = supabaseClient.from('frame').update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(framePayload as any),
  })

  if (!frameIds && !sectionId && !meetingId) return null

  if (sectionId) query.eq('section_id', sectionId)
  if (meetingId) query.eq('meeting_id', meetingId)
  if (frameIds && frameIds.length > 0) query.in('id', frameIds)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteFrame = async (frameId: string) => {
  const query = supabaseClient.from('frame').delete().eq('id', frameId)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteFrames = async ({
  frameIds,
  sectionId,
}: {
  frameIds?: string[]
  sectionId?: string
}) => {
  const query = supabaseClient.from('frame').delete()

  if (!frameIds && !sectionId) return null

  if (sectionId) query.eq('section_id', sectionId)
  if (frameIds && frameIds.length > 0) query.in('id', frameIds)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

export const FrameService = {
  getFrames,
  createFrame,
  duplicateFrame,
  createFrames,
  updateFrame,
  updateFrames,
  deleteFrame,
  deleteFrames,
}
