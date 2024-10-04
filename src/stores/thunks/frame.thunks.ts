import { createAsyncThunk } from '@reduxjs/toolkit'

import { FrameService } from '@/services/frame.service'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'
import { FrameModel } from '@/types/models'

export const getFramesThunk = createAsyncThunk<Array<FrameModel>, string>(
  'event/getFrames',
  async (meetingId: string) => {
    const response = await FrameService.getFrames({ meetingId })

    return response.data
  }
)

type CreateFrameThunkParams = {
  meetingId: string
  sectionId: string
  frame: Partial<FrameModel>
  /**
   * This property being used in listener middleware to update the `section.frames` array
   * with the anticipated sequence of frames.
   */
  insertAfterFrameId?: string
}

type CreateFramesThunkParams = {
  sectionId: string
  // TODO: Fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frames: any
  insertAfterFrameId?: string
}
export const createFrameThunk = createAsyncThunk<
  FrameModel,
  CreateFrameThunkParams
>('event/createFrame', async ({ sectionId, frame, meetingId }) => {
  const response = await FrameService.createFrame({
    ...frame,
    meeting_id: meetingId,
    section_id: sectionId,
  })

  return response.data
})

export const createFramesThunk = createAsyncThunk<
  FrameModel[],
  CreateFramesThunkParams
>('event/createFrames', async (payload) => {
  const response = await FrameService.createFrames(payload.frames)

  return response.data
})

type UpdateFrameThunkParams = {
  frameId: string
  frame: Partial<FrameModel>
}
export const updateFrameThunk = createAsyncThunk<
  FrameModel,
  UpdateFrameThunkParams
>('event/updateFrame', async ({ frameId, frame }) => {
  const response = await FrameService.updateFrame({
    frameId,
    framePayload: frame as IFrame,
  })

  return response.data
})

type DeleteFrameThunkParams = {
  frameId: string
}

type DeleteFramesThunkParams = {
  frameIds: string[]
  sectionId: string
}

export const deleteFrameThunk = createAsyncThunk<void, DeleteFrameThunkParams>(
  'event/deleteFrame',
  async ({ frameId }) => {
    const response = await FrameService.deleteFrame(frameId)

    return response.data
  }
)

export const deleteFramesThunk = createAsyncThunk<
  void,
  DeleteFramesThunkParams
>('event/deleteFrames', async ({ frameIds, sectionId }) => {
  const response = await FrameService.deleteFrames({ frameIds, sectionId })

  return response.data
})

type BulkUpdateFrameStatus = {
  frameIds: Array<FrameModel['id']>
  status: FrameStatus
}
export const bulkUpdateFrameStatusThunk = createAsyncThunk<
  BulkUpdateFrameStatus,
  BulkUpdateFrameStatus
>('event/bulkUpdateFrameStatus', async ({ frameIds, status }) => {
  await FrameService.updateFrames({
    frameIds,
    framePayload: {
      status,
    },
  })

  return { frameIds, status }
})
