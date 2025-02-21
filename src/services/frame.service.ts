/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFrame } from '@/types/frame.type'
import { BreakoutActivityModel, FrameModel } from '@/types/models'
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

const getBreakoutActivitiesOfMeeting = async ({
  page = 1,
  pageSize = 8,
  search,
  ...data
}: {
  meetingId: string
  search?: string
  page?: number
  pageSize: number
}) => {
  const offset = (page - 1) * pageSize
  const query = supabaseClient
    .from('breakout_activity')
    .select<
      '*, frame:breakout_frame_id(*), activity:activity_frame_id(*)',
      BreakoutActivityModel & { frame: FrameModel; activity: FrameModel }
    >('*, frame:breakout_frame_id(*), activity:activity_frame_id(*)', {
      count: 'exact',
    })
    .eq('frame.meeting_id', data.meetingId)
    .not('activity_frame_id', 'is', null)
    .order('created_at', { ascending: true })
    .range(offset, pageSize * page - 1)

  if (search) {
    query.ilike('activity.name', `%${search}%`)
  }

  return query.then(
    (res) => res,
    (error: any) => {
      throw error
    }
  )
}

const getActivityOfBreakoutFrame = async (data: {
  breakoutFrameId: string
}) => {
  const query = supabaseClient
    .from('breakout_activity')
    .select<
      '*, frame:breakout_frame_id(*), activity:activity_frame_id(*)',
      BreakoutActivityModel & { frame: FrameModel; activity: FrameModel }
    >('*, frame:breakout_frame_id(*), activity:activity_frame_id(*)')
    .eq('breakout_frame_id', data.breakoutFrameId)
    .order('created_at', { ascending: true })

  return query.then(
    (res) => res,
    (error: any) => {
      throw error
    }
  )
}

const createDefaultBreakoutActivities = async (data: {
  breakoutFrameId: string
  count: number
}) => {
  const query = supabaseClient.rpc('insert_breakout_activities', {
    breakout_id_input: data.breakoutFrameId,
    activity_count: data.count,
  })

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const createActivityBreakoutFrame = async (
  data: {
    breakoutFrameId: string
    activityFrameId?: string
    name: string
  }[]
) => {
  const query = supabaseClient
    .from('breakout_activity')
    .insert(
      data.map((breakout) => ({
        activity_frame_id: breakout.activityFrameId,
        breakout_frame_id: breakout.breakoutFrameId,
        name: breakout.name,
      }))
    )
    .select('*')

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const updateActivityBreakoutFrame = async (data: {
  activityId: string
  activityFrameId?: string | null
  name?: string
}) => {
  const query = supabaseClient
    .from('breakout_activity')
    .update({
      ...(data.activityFrameId !== undefined
        ? { activity_frame_id: data.activityFrameId }
        : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
    })
    .eq('id', data.activityId)
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteActivityBreakoutFrame = async (data: { activityId: string }) => {
  const query = supabaseClient
    .from('breakout_activity')
    .delete()
    .eq('id', data.activityId)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteActivityFramesOfBreakout = async (data: {
  activityIds: string[]
}) => {
  const query = supabaseClient
    .from('breakout_activity')
    .update({ activity_frame_id: null })
    .in('activity_frame_id', data.activityIds)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteActivitiesOfBreakoutFrame = async (data: {
  breakoutFrameId: string
}) => {
  const query = supabaseClient
    .from('breakout_activity')
    .delete()
    .eq('activity_frame_id', data.breakoutFrameId)

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
  getBreakoutActivitiesOfMeeting,
  getActivityOfBreakoutFrame,
  createActivityBreakoutFrame,
  createDefaultBreakoutActivities,
  updateActivityBreakoutFrame,
  deleteActivityBreakoutFrame,
  deleteActivitiesOfBreakoutFrame,
  deleteActivityFramesOfBreakout,
  createFrames,
  updateFrame,
  updateFrames,
  deleteFrame,
  deleteFrames,
}
