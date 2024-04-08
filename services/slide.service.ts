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
  slidePayload: {
    content: ISlide['content']
    config: ISlide['config']
    name: string
    status: ISlide['status']
    section_id?: string
  }
  slideId: string
}) => {
  const query = APIService.supabaseClient
    .from('slide')
    .update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: slidePayload.content as any,
      config: slidePayload.config,
      name: slidePayload.name,
      status: slidePayload.status,
      section_id: slidePayload.section_id,
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
  slidePayload: {
    content?: ISlide['content']
    config?: ISlide['config']
    name?: string
    status?: ISlide['status']
    section_id?: string
  }
  slideIds?: string[]
  sectionId?: string
  meetingId?: string
}) => {
  const query = APIService.supabaseClient.from('slide').update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: slidePayload.content as any,
    config: slidePayload.config,
    name: slidePayload.name,
    status: slidePayload.status,
    section_id: slidePayload.section_id,
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
