import { APIService } from './api-service'

import { ISlide } from '@/types/slide.type'

const getSlides = async ({
  meetingId,
  sectionIds,
  slideIds,
}: {
  meetingId?: string
  sectionIds?: string[]
  slideIds?: string[]
}) => {
  const query = APIService.supabaseClient.from('slide').select('*')

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionIds) query.in('section_id', sectionIds)
  if (slideIds) query.in('id', slideIds)

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const createSlide = async (slidePayload: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  meeting_id: string
  section_id: string
}) => {
  const query = APIService.supabaseClient
    .from('slide')
    .insert([slidePayload])
    .select('*')
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const updateSlide = async ({
  slidePayload,
  slideId,
}: {
  slidePayload: Partial<ISlide>
  slideId: string
}) => {
  const query = APIService.supabaseClient
    .from('slide')
    .update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(slidePayload as any),
    })
    .eq('id', slideId)
    .select('*')
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const updateSlides = async ({
  slidePayload,
  slideIds,
  sectionId,
  meetingId,
}: {
  slidePayload: Partial<ISlide>
  slideIds?: string[]
  sectionId?: string
  meetingId?: string
}) => {
  const query = APIService.supabaseClient.from('slide').update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(slidePayload as any),
  })

  if (!slideIds && !sectionId && !meetingId) return null

  if (sectionId) query.eq('section_id', sectionId)
  if (meetingId) query.eq('meeting_id', meetingId)
  if (slideIds && slideIds.length > 0) query.in('id', slideIds)

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const deleteSlide = async (slideId: string) => {
  const query = APIService.supabaseClient
    .from('slide')
    .delete()
    .eq('id', slideId)

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const deleteSlides = async ({
  slideIds,
  sectionId,
}: {
  slideIds?: string[]
  sectionId?: string
}) => {
  const query = APIService.supabaseClient.from('slide').delete()

  if (!slideIds && !sectionId) return null

  if (sectionId) query.eq('section_id', sectionId)
  if (slideIds && slideIds.length > 0) query.in('id', slideIds)

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

export const SlideService = {
  getSlides,
  createSlide,
  updateSlide,
  updateSlides,
  deleteSlide,
  deleteSlides,
}
