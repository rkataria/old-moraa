/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/utils/supabase/client'

const getSections = async ({
  meetingId,
  sectionIds,
}: {
  meetingId?: string
  sectionIds?: string[]
}) => {
  const query = supabaseClient
    .from('section')
    .select('*')
    .order('created_at', { ascending: true })

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionIds) query.in('id', sectionIds)

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const getSection = async (sectionId: string) => {
  const query = supabaseClient
    .from('section')
    .select('*, framesWithContent:frame(*)')
    .eq('id', sectionId)
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const createSection = async (sectionPayload: {
  name: string
  meeting_id: string
  frames: string[]
}) => {
  const query = supabaseClient
    .from('section')
    .insert([sectionPayload])
    .select('*')
    .single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const updateSection = async ({
  payload,
  meetingId,
  sectionId,
}: {
  payload: {
    name?: string
    frames?: string[]
  }
  meetingId?: string
  sectionId?: string
}) => {
  const query = supabaseClient.from('section').update({ ...payload })

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionId) query.eq('id', sectionId)

  query.select('*').single()

  return query.then(
    (res: any) => res,
    (error: any) => {
      throw error
    }
  )
}

const deleteSection = async ({ sectionId }: { sectionId: string }) => {
  const res = await supabaseClient.from('section').delete().eq('id', sectionId)

  return res
}

export const SectionService = {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
}
