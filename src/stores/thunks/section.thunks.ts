import { createAsyncThunk } from '@reduxjs/toolkit'

import { SectionService } from '@/services/section.service'
import { SectionModel } from '@/types/models'

type GetSectionsThunkParams =
  | { meetingId: string; sectionIds?: never }
  | { meetingId?: never; sectionIds: string[] }

export const getSectionsThunk = createAsyncThunk<
  Array<SectionModel>,
  GetSectionsThunkParams
>(
  'event/getSections',
  async ({ meetingId, sectionIds }: GetSectionsThunkParams) => {
    const response = await SectionService.getSections({ meetingId, sectionIds })

    return response.data
  }
)

type CreateSectionThunkParams = {
  meetingId: string
  sectionName: string
  frameIds?: Array<string>
} & (
  | {
      /**
       * This property being used in listener middleware to update the `meeting.sections` array
       * with the anticipated sequence of sections.
       */
      insertAfterSectionId?: string
      /**
       * This property being used in listener middleware to update the `meeting.sections` array
       * with the anticipated sequence of sections.
       */
      insertAfterFrameId?: never
    }
  | {
      /**
       * This property being used in listener middleware to update the `meeting.sections` array
       * with the anticipated sequence of sections.
       */
      insertAfterSectionId?: never
      /**
       * This property being used in listener middleware to update the `meeting.sections` array
       * with the anticipated sequence of sections.
       */
      insertAfterFrameId?: string
    }
)
export const createSectionThunk = createAsyncThunk<
  SectionModel,
  CreateSectionThunkParams
>(
  'event/createSection',
  async ({
    frameIds = [],
    meetingId,
    sectionName,
  }: CreateSectionThunkParams) => {
    const response = await SectionService.createSection({
      name: sectionName,
      frames: frameIds,
      meeting_id: meetingId,
    })

    return response.data
  }
)

type UpdateSectionThunkParams = {
  data: Pick<SectionModel, 'name' | 'frames' | 'config'>
  sectionId: SectionModel['id']
}
export const updateSectionThunk = createAsyncThunk<
  SectionModel,
  UpdateSectionThunkParams
>(
  'event/updateSectionThunk',
  async ({ sectionId, data }: UpdateSectionThunkParams) => {
    const response = await SectionService.updateSection({
      sectionId,
      payload: {
        ...(data.name && { name: data.name }),
        frames: data.frames || undefined,
        config: data.config || undefined,
      },
    })

    return response.data
  }
)

type UpdateSectionsFrameListThunkParams = {
  data: {
    id: string
    frames: string[]
  }[]
}
export const updateSectionsFramesListThunk = createAsyncThunk<
  SectionModel[],
  UpdateSectionsFrameListThunkParams
>(
  'event/updateSectionsFramesListThunk',
  async ({ data }: UpdateSectionsFrameListThunkParams) => {
    const response = await SectionService.updateSections({
      payload: data,
    })

    return response.data
  }
)

type DeleteSectionsThunkParams = {
  sectionId: string
}
export const deleteSectionThunk = createAsyncThunk<
  DeleteSectionsThunkParams,
  DeleteSectionsThunkParams
>(
  'event/deleteSectionThunk',
  async ({ sectionId }: DeleteSectionsThunkParams) => {
    await SectionService.deleteSection({ sectionId })

    return { sectionId }
  }
)
