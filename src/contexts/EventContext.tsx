/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react'

import { useParams, useRouter } from '@tanstack/react-router'
import { OnDragEndResponder } from 'react-beautiful-dnd'
import { useHotkeys } from 'react-hotkeys-hook'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { FrameService } from '@/services/frame.service'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  useEventLoadingSelector,
  useEventSelector,
} from '@/stores/hooks/useEventSections'
import {
  setCurrentEventIdAction,
  setCurrentSectionIdAction,
  setIsOverviewOpenAction,
  setIsPreviewOpenAction,
  setCurrentFrameIdAction,
} from '@/stores/slices/event/current-event/event.slice'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { reorderSectionsAction } from '@/stores/slices/event/current-event/meeting.slice'
import {
  handleExpandedSectionsInSessionPlannerAction,
  reorderFrameAction,
} from '@/stores/slices/event/current-event/section.slice'
import {
  createFrameThunk,
  deleteFrameThunk,
  updateFrameThunk,
} from '@/stores/thunks/frame.thunks'
import {
  createSectionThunk,
  deleteSectionsThunk,
  updateSectionThunk,
} from '@/stores/thunks/section.thunks'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { ISection, IFrame } from '@/types/frame.type'
import { FrameModel } from '@/types/models'
import { Json } from '@/types/supabase-db'
import { withPermissionCheck } from '@/utils/permissions'
import { supabaseClient } from '@/utils/supabase/client'

interface EventProviderProps {
  children: React.ReactNode
  eventMode: EventModeType
}

export const EventContext = createContext<EventContextType | null>(null)

export function EventProvider({ children, eventMode }: EventProviderProps) {
  const { eventId } = useParams({ strict: false })
  const currentFrame = useCurrentFrame()
  const isOverviewOpen = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isOverviewOpen
  )
  const currentSectionId = useStoreSelector(
    (store) => store.event.currentEvent.eventState.currentSectionId
  )
  const isOwner = useStoreSelector(
    (store) => store.event.currentEvent.eventState.isCurrentUserOwnerOfEvent
  )
  const isMeetingJoined = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )
  const isInBreakoutMeeting = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const dispatch = useStoreDispatch()
  const router = useRouter()
  const { action: eventViewFromQuery } = router.latestLocation.search as {
    action: string
  }

  const currentUser = useStoreSelector((state) => state.user.currentUser.user)
  const { permissions } = useEventPermissions()

  const sections = useEventSelector()

  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)
  const loading = useEventLoadingSelector()
  const syncing = useStoreSelector(
    (state) => state.event.currentEvent.frameState.updateFrameThunk.isLoading
  )
  useSyncValueInRedux({
    value: eventId || null,
    reduxStateSelector: (state) => state.event.currentEvent.eventState.eventId,
    actionFn: setCurrentEventIdAction,
  })
  const event = useStoreSelector(
    (state) => state.event.currentEvent.eventState.event.data
  )
  const meeting = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data
  )
  const [insertAfterFrameId, setInsertAfterFrameId] = useState<string | null>(
    null
  )
  const [insertAfterSectionId, setInsertAfterSectionId] = useState<
    string | null
  >(null)
  const [insertInSectionId, setInsertInSectionId] = useState<string | null>(
    null
  )
  const [, setAddedFromSessionPlanner] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('')

  const isPreviewOpen = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isPreviewOpen
  )

  const [error, setError] = useState<{
    frameId: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!event?.owner_id || !currentUser?.id) return

    if (event.owner_id !== currentUser.id) return

    if (eventViewFromQuery === 'view') {
      dispatch(setIsPreviewOpenAction(true))

      return
    }
    dispatch(setIsPreviewOpenAction(false))
  }, [currentUser?.id, eventViewFromQuery, event?.owner_id, dispatch])

  // useEffect(() => {
  //   if (!currentFrame) return

  //   const currentFrameElement = document.querySelector(
  //     `div[data-miniframe-id="${currentFrame.id}"]`
  //   )

  //   if (!currentFrameElement) return

  //   currentFrameElement.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center',
  //   })
  // }, [currentFrame])

  const handleSectionExpansionInSessionPlanner = (sectionId: string) => {
    if (isOverviewOpen) {
      dispatch(
        handleExpandedSectionsInSessionPlannerAction({
          id: sectionId,
          keepExpanded: true,
        })
      )
    }
  }

  const addFrameToSection = async ({
    frame,
    section,
    afterFrameId,
  }: {
    frame: Partial<IFrame>
    section: ISection
    afterFrameId?: string
  }) => {
    dispatch(
      createFrameThunk({
        frame: frame as Partial<FrameModel>,
        insertAfterFrameId: afterFrameId,
        meetingId: meeting!.id,
        sectionId: section!.id,
      })
    )

    handleSectionExpansionInSessionPlanner(section.id)
    setInsertAfterFrameId(frame.id!)
  }

  const addSection = async ({
    name,
    afterSectionId,
  }: Parameters<EventContextType['addSection']>[0]) => {
    const sectionName = name || `Section ${(sections?.length || 0) + 1}`

    dispatch(
      createSectionThunk({
        meetingId: meeting!.id,
        sectionName,
        frameIds: [],
        insertAfterSectionId: afterSectionId,
      })
    )
  }

  const updateSection = async ({
    sectionPayload,
    sectionId,
  }: {
    sectionPayload: {
      name?: string
      frames?: string[]
      config?: Json
    }
    sectionId: string
  }) => {
    dispatch(
      updateSectionThunk({
        sectionId,
        data: {
          name: sectionPayload.name || null,
          frames: sectionPayload.frames || null,
          config: sectionPayload.config || null,
        },
      })
    )
  }

  const deleteSection = async ({ sectionId }: { sectionId: string }) => {
    dispatch(deleteSectionsThunk({ sectionId }))

    return true
  }

  const importGoogleSlides = async ({
    frame,
    googleSlideUrl,
    startPosition,
    endPosition,
  }: {
    frame: IFrame
    googleSlideUrl: string
    startPosition: number
    endPosition: number | undefined
  }) => {
    const importGoogleSlidesResponse = await supabaseClient.functions.invoke(
      'import-google-slides',
      {
        body: {
          googleSlideUrl,
          meetingId: meeting!.id,
          sectionId: frame.section_id,
          startPosition,
          endPosition,
        },
      }
    )
    console.log(importGoogleSlidesResponse)
    if (!importGoogleSlidesResponse.data?.success) {
      console.error(
        'error while importing google Slides: ',
        importGoogleSlidesResponse.data?.message
      )

      setError({
        frameId: frame.id,
        message: importGoogleSlidesResponse.data?.message,
      })

      return importGoogleSlidesResponse.data
    }

    // const { insertedFrames: insertedFrameIds } = importGoogleSlidesResponse.data

    // const section = sections.find((s) => s.id === frame.section_id)
    // const existingFrameIds = section?.frames.map((s: IFrame) => s.id) || []
    // const existingFrameIdsWithoutGoogleSlideId = existingFrameIds.filter(
    //   (sid: string) => sid !== frame.id
    // )
    // const updatedFrameIds = [
    //   ...existingFrameIdsWithoutGoogleSlideId,
    //   ...insertedFrameIds,
    // ]

    // // Update section
    // const sectionData = await updateSection({
    //   sectionPayload: {
    //     frames: updatedFrameIds,
    //   },
    //   sectionId: frame.section_id,
    // })

    // if (!sectionData) return null

    // // Delete the google import frame
    // const deleteFrameResponse = await FrameService.deleteFrame(frame.id)

    // if (deleteFrameResponse.error) {
    //   console.error('error while deleting frame: ', deleteFrameResponse.error)

    //   return null
    // }

    return importGoogleSlidesResponse.data
  }

  const updateFrame = async ({
    framePayload,
    frameId,
    // allowParticipantToUpdate = false,
  }: {
    framePayload: Partial<IFrame>
    frameId: string
    // allowParticipantToUpdate?: boolean
  }) => {
    // if (!allowParticipantToUpdate) return null
    if (!frameId) return null
    if (Object.keys(framePayload).length === 0) return null

    dispatch(
      updateFrameThunk({
        frameId,
        frame: framePayload as Partial<FrameModel>,
      })
    )

    return null
  }

  const _deleteFrame = async (id: string) => {
    const Response = await FrameService.deleteFrame(id)

    if (Response.error) {
      console.error('error while deleting frame: ', Response.error)
    }
  }

  const deleteFrame = async (frame: IFrame) => {
    dispatch(deleteFrameThunk({ frameId: frame.id }))

    return null
  }

  const deleteBreakoutFrames = async (frame: IFrame) => {
    const breakoutIds = [frame.id]
    _deleteFrame(frame.id)

    if (frame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS) {
      frame?.content?.breakoutRooms?.map(async (ele) => {
        if (ele?.activityId) {
          _deleteFrame(ele?.activityId)
          breakoutIds.push(ele?.activityId)
        }

        return ele
      })
    } else if (frame?.content?.groupActivityId) {
      _deleteFrame(frame?.content?.groupActivityId)
      breakoutIds.push(frame?.content?.groupActivityId)
    }

    // Update the section with the frame
    const section = sections.find((s) => s.id === frame.section_id)

    const _frames = section!.frames
      .filter((s) => !breakoutIds?.includes(s?.id))
      .filter((s) => s?.id)

    await updateSection({
      sectionPayload: {
        frames: _frames.map((s) => s?.id),
      },
      sectionId: section!.id,
    })

    return null
  }

  const moveUpFrame = (frame: IFrame) => {
    const section = sections.find((s) => s.id === frame.section_id)
    const index = section!.frames.findIndex((s) => s?.id === frame.id)
    if (index === 0) return

    dispatch(
      reorderFrameAction({
        destinationSectionId: section!.id,
        destinationIndex: index - 1,
        frameId: frame.id,
      })
    )
  }

  const moveUpSection = async (section: ISection) => {
    const index = sections.findIndex((s) => s.id === section.id)
    if (index === 0) return

    dispatch(
      reorderSectionsAction({
        destinationIndex: index - 1,
        sourceIndex: index,
      })
    )
  }

  const moveDownSection = async (section: ISection) => {
    const index = sections.findIndex((s) => s.id === section.id)
    if (index === sections.length - 1) return

    dispatch(
      reorderSectionsAction({
        destinationIndex: index + 1,
        sourceIndex: index,
      })
    )
  }

  const moveDownFrame = async (frame: IFrame) => {
    const section = sections.find((s) => s.id === frame.section_id)
    const index = section!.frames.findIndex((s) => s?.id === frame.id)
    if (index === section!.frames.length - 1) return

    dispatch(
      reorderFrameAction({
        destinationSectionId: section!.id,
        destinationIndex: index + 1,
        frameId: frame.id,
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderFrame = async (result: OnDragEndResponder | any) => {
    const { destination, draggableId } = result
    const frameId = draggableId.split('frame-draggable-frameId-')[1]
    const destinationSectionId = destination.droppableId.split(
      'frame-droppable-sectionId-'
    )[1]

    if (!destination) return null

    dispatch(
      reorderFrameAction({
        frameId,
        destinationSectionId,
        destinationIndex: result.destination.index,
      })
    )

    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderSection = async (result: OnDragEndResponder | any) => {
    const { source, destination } = result
    if (destination.droppableId !== 'section-droppable') return
    if (source.droppableId !== 'section-droppable') return

    dispatch(
      reorderSectionsAction({
        sourceIndex: source.index as number,
        destinationIndex: destination.index as number,
      })
    )
  }

  const getFrameById = (frameId: string): IFrame => {
    const _frames = sections.map((sec) => sec.frames).flat(2)
    const cFrame = _frames.find((f) => f?.id === frameId) as IFrame

    return cFrame
  }

  useHotkeys(
    'e',
    () => {
      if (permissions.canUpdateFrame && eventMode === 'edit') {
        dispatch(setIsPreviewOpenAction(false))
        router.navigate({
          search: { action: 'edit' },
        })
      }
    },
    [permissions.canUpdateFrame, eventMode]
  )

  useHotkeys(
    'p',
    () => {
      if (eventMode !== 'edit') return
      if (!permissions.canUpdateFrame) return
      dispatch(setIsPreviewOpenAction(true))
      router.navigate({
        search: { action: 'view' },
      })
    },
    [permissions.canUpdateFrame]
  )

  useHotkeys('alt + N', () => !isPreviewOpen && addSection({}), [isPreviewOpen])

  const actions = {
    updateFrame: withPermissionCheck(updateFrame, permissions.canUpdateFrame),
    deleteFrame: withPermissionCheck(deleteFrame, permissions.canDeleteFrame),
    moveUpFrame: withPermissionCheck(moveUpFrame, permissions.canUpdateFrame),
    moveDownFrame: withPermissionCheck(
      moveDownFrame,
      permissions.canUpdateFrame
    ),
    reorderFrame: withPermissionCheck(reorderFrame, permissions.canUpdateFrame),
    reorderSection: withPermissionCheck(
      reorderSection,
      permissions.canUpdateSection
    ),
    addSection: withPermissionCheck(addSection, permissions.canCreateSection),
    updateSection: withPermissionCheck(
      updateSection,
      permissions.canUpdateSection
    ),
    deleteSection: withPermissionCheck(
      deleteSection,
      permissions.canDeleteSection
    ),
    addFrameToSection: withPermissionCheck(
      addFrameToSection,
      permissions.canCreateFrame
    ),
    moveUpSection: withPermissionCheck(
      moveUpSection,
      permissions.canUpdateSection
    ),
    moveDownSection: withPermissionCheck(
      moveDownSection,
      permissions.canUpdateSection
    ),

    importGoogleSlides: withPermissionCheck(
      importGoogleSlides,
      permissions.canUpdateFrame
    ),
    deleteBreakoutFrames: withPermissionCheck(
      deleteBreakoutFrames,
      permissions.canDeleteFrame
    ),
  }

  return (
    <EventContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        eventId: eventId as string,
        eventMode:
          eventMode !== 'present'
            ? permissions.canUpdateFrame
              ? 'edit'
              : 'view'
            : eventMode,
        meeting,
        currentFrame: currentFrame as IFrame | null,
        overviewOpen: isOverviewOpen,
        loading,
        syncing,
        isOwner: isOwner || false,
        sections: sections as ISection[],
        preview: isPreviewOpen,
        error,
        openContentTypePicker,
        currentSectionId,
        insertAfterSectionId,
        insertAfterFrameId,
        insertInSectionId,
        selectedSectionId,
        setOpenContentTypePicker,
        setPreview: (preview) => dispatch(setIsPreviewOpenAction(preview)),
        setCurrentFrame: (frame) => {
          dispatch(setCurrentFrameIdAction(frame?.id || null))
          if (frame && isOverviewOpen) dispatch(setIsOverviewOpenAction(false))

          if (!isMeetingJoined) return
          if (!frame?.content?.breakoutFrameId || isInBreakoutMeeting) {
            // Do not update session if it's a breakout frame.
            dispatch(
              updateMeetingSessionDataAction({
                currentFrameId: frame?.id,
              })
            )
          }
        },
        setCurrentSectionId: (sectionId) => {
          dispatch(setCurrentSectionIdAction(sectionId))
        },
        setOverviewOpen: (open) => {
          dispatch(setCurrentFrameIdAction(null))
          dispatch(setIsOverviewOpenAction(open))
        },
        setInsertAfterSectionId,
        setInsertAfterFrameId,
        setInsertInSectionId,
        setSelectedSectionId,
        getFrameById,
        setAddedFromSessionPlanner,
        ...actions,
      }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const context = useContext(EventContext) as EventContextType

  if (!context) {
    throw new Error(
      'useEventContext must be used within `EventContextProvider`'
    )
  }

  return context
}
