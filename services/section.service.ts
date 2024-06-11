import { APIService } from './api-service'

const getSections = async ({
  meetingId,
  sectionIds,
}: {
  meetingId?: string
  sectionIds?: string[]
}) => {
  const query = APIService.supabaseClient
    .from('section')
    .select('*')
    .order('created_at', { ascending: true })

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionIds) query.in('id', sectionIds)

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const getSection = async (sectionId: string) => {
  const query = APIService.supabaseClient
    .from('section')
    .select('*, framesWithContent:frame(*)')
    .eq('id', sectionId)
    .single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const createSection = async (sectionPayload: {
  name: string
  meeting_id: string
  frames: string[]
}) => {
  const query = APIService.supabaseClient
    .from('section')
    .insert([sectionPayload])
    .select('*')
    .single()

  return query.then(
    (res) => res,
    (error) => {
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
  const query = APIService.supabaseClient.from('section').update({ ...payload })

  if (meetingId) query.eq('meeting_id', meetingId)
  if (sectionId) query.eq('id', sectionId)

  query.select('*').single()

  return query.then(
    (res) => res,
    (error) => {
      throw error
    }
  )
}

const deleteSection = async ({ sectionId }: { sectionId: string }) => {
  const res = await APIService.supabaseClient
    .from('section')
    .delete()
    .eq('id', sectionId)

  return res
}

export const SectionService = {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
}
