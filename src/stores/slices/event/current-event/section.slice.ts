import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  setCurrentFrameIdAction,
  setCurrentSectionIdAction,
} from './event.slice'
import {
  deleteFrameAction,
  insertFrameAction,
  updateFrameAction,
} from './frame.slice'

import {
  attachThunkToBuilder,
  buildThunkState,
  getUpdatedSections,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import { updateMeetingThunk } from '@/stores/thunks/meeting.thunks'
import {
  createSectionThunk,
  deleteSectionsThunk,
  getSectionsThunk,
  updateSectionsFramesListThunk,
} from '@/stores/thunks/section.thunks'
import { FrameModel, SectionModel } from '@/types/models'
import { supabaseClient } from '@/utils/supabase/client'

type SectionState = {
  section: ThunkState<Array<SectionModel>>
  createSectionThunk: ThunkState<SectionModel>
  expandedSectionsInSessionPlanner: string[]
}

const initialState: SectionState = {
  section: buildThunkState<Array<SectionModel>>([]),
  createSectionThunk: buildThunkState<SectionModel>(),
  expandedSectionsInSessionPlanner: [],
}

export const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    insertSection: (state, action: PayloadAction<SectionModel>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.section.data?.push(action.payload)
    },
    updateSection: (state, action: PayloadAction<SectionModel>) => {
      const index = state.section.data?.findIndex(
        (section) => section.id === action.payload.id
      )

      if (state.section.data && typeof index === 'number' && index !== -1) {
        state.section.data[index] = action.payload
      }
    },
    reorderFrame: (
      state,
      action: PayloadAction<{
        frameId: string
        destinationSectionId: string
        destinationIndex: number
      }>
    ) => {
      if (
        typeof action.payload.destinationIndex !== 'number' ||
        !action.payload.destinationSectionId ||
        !action.payload.frameId
      ) {
        return
      }
      state.section.data?.forEach((section) => {
        if (section.frames?.includes(action.payload.frameId)) {
          section.frames = section.frames.filter(
            (frameId) => frameId !== action.payload.frameId
          )
        }
      })

      state.section.data?.forEach((section) => {
        if (section.id === action.payload.destinationSectionId) {
          section.frames?.splice(
            action.payload.destinationIndex,
            0,
            action.payload.frameId
          )
        }
      })
    },

    updateExpandedSectionsInSessionPlanner: (
      state,
      action: PayloadAction<string[]>
    ) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.expandedSectionsInSessionPlanner = action.payload
    },
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getSectionsThunk,
      getThunkState: (state) => state.section,
    })
    attachThunkToBuilder({
      builder,
      thunk: createSectionThunk,
      getThunkState: (state) => state.createSectionThunk,
    })
    builder.addCase(deleteSectionsThunk.fulfilled, (state, action) => {
      state.section.data =
        state.section.data?.filter(
          (section) => section.id !== action.payload.sectionId
        ) || null
    })
  },
})

attachStoreListener({
  actionCreator: createSectionThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const state = getState()
    const sections =
      state.event.currentEvent.meetingState.meeting.data!.sections!

    const insertAfterSectionIndex = sections?.indexOf(
      action.meta.arg.insertAfterSectionId || ''
    )

    const newSectionSequence = [...(sections || [])]
    if (insertAfterSectionIndex === -1) {
      newSectionSequence.push(action.payload.id)
    } else if (typeof insertAfterSectionIndex === 'number') {
      newSectionSequence.splice(
        insertAfterSectionIndex + 1,
        0,
        action.payload.id
      )
    } else {
      newSectionSequence.push(action.payload.id)
    }

    dispatch(
      updateMeetingThunk({
        data: {
          sections: newSectionSequence,
        },
        meetingId: state.event.currentEvent.meetingState.meeting!.data!.id,
      })
    )
  },
})

attachStoreListener({
  actionCreator: sectionSlice.actions.reorderFrame,
  effect: (_, { dispatch, getOriginalState, getState }) => {
    const originalSections =
      getOriginalState().event.currentEvent.sectionState.section.data
    const updatedSections =
      getState().event.currentEvent.sectionState.section.data

    dispatch(
      updateSectionsFramesListThunk({
        data: getUpdatedSections(originalSections || [], updatedSections || []),
      })
    )
  },
})

attachStoreListener({
  actionCreator: getSectionsThunk.fulfilled,
  effect: (_, { dispatch, getState }) => {
    const { eventId } = getState().event.currentEvent.eventState
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id

    dispatch(
      updateExpandedSectionsInSessionPlannerAction([
        getState().event.currentEvent.sectionState.section.data?.[0]
          ?.id as string,
      ])
    )
    supabaseClient
      .channel(`event:${eventId}-1`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section',
          filter: `meeting_id=eq.${meetingId}`,
        },
        async (payload) => {
          switch (payload.eventType) {
            case 'UPDATE': {
              const updatedSection = payload.new
              dispatch(updateSectionAction(updatedSection as SectionModel))
              break
            }
            case 'INSERT': {
              const newSection = payload.new
              dispatch(insertSectionAction(newSection as SectionModel))
              break
            }
            default:
              break
          }
        }
      )
      .subscribe()
  },
})

attachStoreListener({
  actionCreator: getSectionsThunk.fulfilled,
  effect: (_, { dispatch, getState }) => {
    const { eventId } = getState().event.currentEvent.eventState
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id
    const sectionIdToFrameIdMapping: { [x: string]: string[] } =
      getState().event.currentEvent.sectionState.section.data?.reduce(
        (acc, section) => ({ ...acc, [section.id]: section.frames }),
        {}
      ) || {}

    supabaseClient
      .channel(`event:${eventId}-2`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'frame',
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT': {
              const newFrame = payload.new as FrameModel

              dispatch(insertFrameAction(newFrame))
              break
            }
            case 'UPDATE': {
              const updatedFrame = payload.new as FrameModel
              const existingFrame =
                getState().event.currentEvent.frameState.frame.data?.find(
                  (frame) => updatedFrame.id === frame.id
                )

              dispatch(updateFrameAction({ ...existingFrame, ...updatedFrame }))
              break
            }
            case 'DELETE': {
              const deletedFrameId = payload.old?.id as string
              const sectionOfDeletedFrame =
                getState().event.currentEvent.sectionState.section.data?.find(
                  (section) => section.frames?.includes(deletedFrameId)
                )
              const sectionIdOfDeletedFrame =
                sectionOfDeletedFrame?.id as string
              dispatch(deleteFrameAction(deletedFrameId))

              const deletedFrameIndex =
                sectionIdToFrameIdMapping[sectionIdOfDeletedFrame]?.indexOf(
                  deletedFrameId
                )

              const previousFrameId =
                sectionIdToFrameIdMapping[sectionIdOfDeletedFrame]?.[
                  deletedFrameIndex - 1
                ]
              const newFramesSequence = sectionOfDeletedFrame?.frames?.filter(
                (frameId) => frameId !== deletedFrameId
              )

              if (newFramesSequence) {
                dispatch(
                  updateSectionsFramesListThunk({
                    data: [
                      {
                        id: sectionIdOfDeletedFrame,
                        frames: newFramesSequence,
                      },
                    ],
                  })
                )
              }

              if (previousFrameId) {
                dispatch(setCurrentFrameIdAction(previousFrameId))
              } else {
                dispatch(setCurrentSectionIdAction(sectionIdOfDeletedFrame))
              }
              break
            }

            default:
              break
          }
        }
      )
      .subscribe()
  },
})

export const {
  updateSectionAction,
  insertSectionAction,
  reorderFrameAction,
  updateExpandedSectionsInSessionPlannerAction,
} = renameSliceActions(sectionSlice.actions)
