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
import { setExpandedSectionsAction } from '../../layout/studio.slice'

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
  deleteSectionThunk,
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
        frameIds: string[]
        destinationSectionId: string
        destinationIndex: number
        nestedActivities: string[]
      }>
    ) => {
      if (
        typeof action.payload.destinationIndex !== 'number' ||
        !action.payload.destinationSectionId ||
        !action.payload.frameIds.length
      ) {
        return
      }

      const frameIdSet = new Set(action.payload.frameIds) // Convert frameIds to a Set for faster lookups

      state.section.data?.forEach((section) => {
        if (section.frames) {
          section.frames = [
            ...section.frames.filter(
              (frameId) =>
                frameId &&
                !frameIdSet.has(frameId) &&
                !action.payload.nestedActivities.includes(frameId)
            ),
            ...section.frames.filter((frameId) =>
              action.payload.nestedActivities.includes(frameId)
            ),
          ]
        }
      })

      state.section.data?.forEach((section) => {
        if (section.frames) {
          // Filter out frames that are either in the frameIdSet or are blank (falsy values)
          section.frames = section.frames.filter(
            (frameId) => frameId && !frameIdSet.has(frameId)
          )
        }
      })

      state.section.data?.forEach((section) => {
        if (section.id === action.payload.destinationSectionId) {
          section.frames = section.frames || [] // Ensure frames is initialized as an array
          section.frames.splice(
            action.payload.destinationIndex,
            0,
            ...action.payload.frameIds
          )
        }
      })
    },
    reorderFrames: (
      state,
      action: PayloadAction<{
        frameIds: string[]
        destinationSectionId: string
        destinationIndex: number
      }>
    ) => {
      const { frameIds, destinationSectionId, destinationIndex } =
        action.payload

      if (
        !Array.isArray(frameIds) ||
        frameIds.length === 0 ||
        typeof destinationIndex !== 'number' ||
        !destinationSectionId
      ) {
        return
      }

      // Remove frames from their current sections
      state.section.data?.forEach((section) => {
        if (section.frames) {
          section.frames = section.frames.filter(
            (frameId) => !frameIds.includes(frameId)
          )
        }
      })

      // Add frames to the destination section
      state.section.data?.forEach((section) => {
        if (section.id === destinationSectionId) {
          section.frames = section.frames || []
          section.frames.splice(destinationIndex, 0, ...frameIds)
        }
      })
    },

    toggleSectionExpansionInPlanner: (
      state,
      action: PayloadAction<{
        id: string
        keepExpanded?: boolean
      }>
    ) => {
      const { id, keepExpanded = false } = action.payload
      const expandedSections = state.expandedSectionsInSessionPlanner

      if (!expandedSections.includes(id)) {
        state.expandedSectionsInSessionPlanner = [...expandedSections, id]
      } else if (!keepExpanded) {
        state.expandedSectionsInSessionPlanner = expandedSections.filter(
          (sectionId) => sectionId !== id
        )
      }
    },
    setExpandedSectionsInPlanner: (
      state,
      action: PayloadAction<{ ids: string[] }>
    ) => {
      const { ids } = action.payload

      state.expandedSectionsInSessionPlanner = [...ids]
    },
    resetSection: () => initialState,
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
    builder.addCase(deleteSectionThunk.fulfilled, (state, action) => {
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
  actionCreator: sectionSlice.actions.reorderFrames,
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
    const sections = getState().event.currentEvent.sectionState.section.data
    const meetingId =
      getState().event.currentEvent.meetingState.meeting.data?.id

    dispatch(
      setExpandedSectionsInPlannerAction({
        ids: sections?.map((section) => section.id) || [],
      })
    )
    dispatch(setExpandedSectionsAction([sections?.[0].id]))

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
  setExpandedSectionsInPlannerAction,
  toggleSectionExpansionInPlannerAction,
  resetSectionAction,
  reorderFramesAction,
} = renameSliceActions(sectionSlice.actions)
