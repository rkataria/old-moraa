/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { FrameService } from '@/services/frame.service'
import { MeetingService } from '@/services/meeting.service'
import { SectionService } from '@/services/section.service'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { ISection, IFrame } from '@/types/frame.type'
import { getDefaultCoverFrame } from '@/utils/content.util'

interface EventProviderProps {
  children: React.ReactNode
  eventMode: EventModeType
}

export const EventContext = createContext<EventContextType | null>(null)

export function EventProvider({ children, eventMode }: EventProviderProps) {
  const { eventId } = useParams()
  const useEventData = useEvent({
    id: eventId as string,
  })
  const { currentUser } = useAuth()
  const [sections, setSections] = useState<any[]>([])
  const [currentFrame, setCurrentFrame] = useState<any>(null)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [overviewOpen, setOverviewOpen] = useState<any>(false)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const supabase = createClientComponentClient()
  const [meeting, setMeeting] = useState<any>(null)
  const [showSectionPlaceholder, setShowSectionPlaceholder] =
    useState<boolean>(false)
  const [showFramePlaceholder, setShowFramePlaceholder] =
    useState<boolean>(false)

  const [insertAfterFrameId, setInsertAfterFrameId] = useState<string | null>(
    null
  )
  const [insertAfterSectionId, setInsertAfterSectionId] = useState<
    string | null
  >(null)
  const [insertInSectionId, setInsertInSectionId] = useState<string | null>(
    null
  )

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('')

  const [preview, setPreview] = useState<boolean>(false)

  const [error, setError] = useState<{
    frameId: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!useEventData.meeting) return

    setMeeting(useEventData.meeting)
  }, [useEventData.meeting])

  useEffect(() => {
    if (!useEventData.event || !currentUser) return

    setIsOwner(useEventData.event.owner_id === currentUser?.id)
    if (useEventData.event.owner_id === currentUser?.id) setOverviewOpen(true)
  }, [useEventData.event, currentUser])

  useEffect(() => {
    if (!meeting?.id) return

    // Don't subscribe to the changes if the user is not the owner and the event mode is not present
    // if (eventMode !== 'present' || !isOwner) return
    // if (eventMode === 'edit' && !isOwner) return

    // subscribe to the meeting updates
    const meetingUpdateSubscription = supabase
      .channel('meeting-update-channel')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meeting',
          filter: `id=eq.${meeting.id}`,
        },
        (payload) => {
          console.log('Meeting change received!', payload)
          if (payload?.new) {
            setMeeting(payload.new)
          }
        }
      )
      .subscribe()

    // subscribe to the section updates
    const sectionUpdateSubscription = supabase
      .channel('section-update-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section',
          filter: `meeting_id=eq.${meeting.id}`,
        },
        async (payload) => {
          console.log('Section change received!', payload)

          if (payload.eventType === 'UPDATE') {
            /**
             * Two approaches are considered for handling section updates:
             *
             * 1. Fetch the updated section, including all frame contents, and update the section's state.
             * 2. Update the section's state based on the payload data.
             *
             * Currently, the first approach is implemented to maintain frame order consistency and mitigate potential issues with content updates. However, this approach is not optimal, and further optimization or a refinement of the second approach may be necessary.
             */

            // Approach - 1
            const updatedSection = payload.new

            const sectionResponse = await SectionService.getSection(
              updatedSection.id
            )

            if (sectionResponse.error) {
              console.error(
                'error while fetching section: ',
                sectionResponse.error
              )

              return
            }

            const currentSectionWithFramesContent = sectionResponse.data
            // const previousFrameIds = sections
            //   .find((s) => s.id === updatedSection.id)
            //   ?.frames.map((frame: IFrame) => frame.id)
            // const newFrameIds = currentSectionWithFramesContent.frames || []
            // const diffFrameIds = newFrameIds.filter(
            //   (frameId: string) => !previousFrameIds?.includes(frameId)
            // )

            // if (diffFrameIds.length > 0) {
            //   setCurrentFrame(
            //     currentSectionWithFramesContent.framesWithContent.find(
            //       (s) => s.id === diffFrameIds[0]
            //     )
            //   )
            // }

            setSections((prevSections) => {
              const updatedSections = prevSections.map((section) => {
                if (section.id === updatedSection.id) {
                  const updateFramesOrder =
                    currentSectionWithFramesContent.frames?.map(
                      (frameId: string) =>
                        currentSectionWithFramesContent.framesWithContent.find(
                          (s) => s.id === frameId
                        )
                    )

                  return {
                    ...sectionResponse.data,
                    frames: updateFramesOrder || [],
                    framesWithContent: undefined,
                  }
                }

                return section
              })

              return updatedSections
            })

            // Approach - 2
            // if (payload.eventType === 'UPDATE') {
            //   const updatedSection = payload.new
            //   const _currentSection = sections.find(
            //     (s) => s.id === updatedSection.id
            //   )

            //   if (!_currentSection) return null

            //   const newFrameIds = updatedSection.frames // [1, 2, 4]
            //   const previousFrameIds = _currentSection.frames.map(
            //     (frame: IFrame) => frame.id
            //   ) // [1, 2, 3]
            //   const diffFrameIds = newFrameIds.filter(
            //     (frameId: string) => !previousFrameIds.includes(frameId)
            //   )

            //   console.log('diffFrameIds', diffFrameIds)
            //   console.log('previousFrameIds', previousFrameIds)
            //   console.log('newFrameIds', newFrameIds)

            //   // Check if the frame is added
            //   if (diffFrameIds.length > 0) {
            //     const sectionResponse = await SectionService.getSection(
            //       updatedSection.id
            //     )

            //     if (sectionResponse.error) {
            //       console.error(
            //         'error while fetching section: ',
            //         sectionResponse.error
            //       )

            //       return null
            //     }

            //     const currentSectionWithFramesContent = sectionResponse.data
            //     const firstNewFrame =
            //       currentSectionWithFramesContent.framesWithContent.find(
            //         (s) => s.id === diffFrameIds[0]
            //       )

            //     const updatedSections = sections.map((section) => {
            //       if (section.id === updatedSection.id) {
            //         const updateFramesOrder =
            //           currentSectionWithFramesContent.frames?.map(
            //             (frameId: string) =>
            //               currentSectionWithFramesContent.framesWithContent.find(
            //                 (s) => s.id === frameId
            //               )
            //           )

            //         return {
            //           ...sectionResponse.data,
            //           frames: updateFramesOrder || [],
            //           framesWithContent: undefined,
            //         }
            //       }

            //       return section
            //     })
            //     console.log('diffframeIds updatedSections', updatedSections)
            //     setCurrentFrame(firstNewFrame)
            //     setSections(updatedSections)
            //     setInsertAfterFrameId(null)
            //     setShowFramePlaceholder(false)

            //     return null
            //   }

            //   const isFramesOrderedChanged =
            //     newFrameIds.join(',') !== previousFrameIds.join(',')

            //   // Check if the frames order is changed
            //   if (isFramesOrderedChanged) {
            //     // Updated frames order
            //     const orderedFrames = newFrameIds.map((frameId: string) =>
            //       _currentSection.frames.find(
            //         (frame: IFrame) => frame.id === frameId
            //       )
            //     )
            //     const updatedSections = sections.map((section) => {
            //       if (section.id === updatedSection.id) {
            //         return { ...updatedSection, frames: orderedFrames }
            //       }

            //       return section
            //     })

            //     console.log('diffOrder updatedSections', updatedSections)
            //     setSections(updatedSections)
            //     setCurrentFrame(
            //       getNextFrame({ sections: updatedSections, currentFrame })
            //     )
            //     setInsertAfterFrameId(null)
            //     setShowFramePlaceholder(false)

            //     return null
            //   }

            //   const updatedSections = sections.map((section) => {
            //     if (section.id === updatedSection.id) {
            //       return { ...updatedSection, frames: section.frames }
            //     }

            //     return section
            //   })

            //   console.log('updatedSections', updatedSections)
            //   setSections(updatedSections)
            //   setInsertAfterFrameId(null)
            //   setShowFramePlaceholder(false)

            //   return null
            // }
          }
        }
      )
      .subscribe()

    // subscribe to the frame updates
    const frameUpdateSubscription = supabase
      .channel('frame-update-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'frame',
          filter: `meeting_id=eq.${meeting.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            let updatedFrame = payload.new

            setSections((prevSections) =>
              prevSections.map((section) => {
                if (section.id === updatedFrame.section_id) {
                  updatedFrame = {
                    ...section.frames.find(
                      (frame: IFrame) => frame?.id === updatedFrame?.id
                    ),
                    ...updatedFrame,
                  }

                  return {
                    ...section,
                    frames: section.frames.map((frame: IFrame) =>
                      frame?.id === updatedFrame?.id ? updatedFrame : frame
                    ),
                  }
                }

                return section
              })
            )

            if (updatedFrame.id === currentFrame?.id) {
              setCurrentFrame(updatedFrame)
            }
          }

          if (payload.eventType === 'DELETE') {
            const deletedFrameId = payload.old?.id
            const sectionFrameDeletedFrom = sections.find((section) =>
              section.frames.find(
                (frame: IFrame) => frame?.id === deletedFrameId
              )
            )
            const deletedFrame = sectionFrameDeletedFrom?.frames.find(
              (frame: IFrame) => frame?.id === deletedFrameId
            )

            const deletedFrameIndex = sectionFrameDeletedFrom?.frames.findIndex(
              (s: IFrame) => s.id === deletedFrameId
            )
            const previousFrame =
              sectionFrameDeletedFrom?.frames[deletedFrameIndex - 1]

            setSections((prevSections) =>
              prevSections.map((section) => {
                if (section.id === deletedFrame?.section_id) {
                  return {
                    ...section,
                    frames: section.frames.filter(
                      (frame: IFrame) => frame?.id !== deletedFrame.id
                    ),
                  }
                }

                return section
              })
            )

            if (previousFrame) {
              setCurrentFrame(previousFrame)
            }
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      meetingUpdateSubscription.unsubscribe()
      sectionUpdateSubscription.unsubscribe()
      frameUpdateSubscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id, sections, isOwner, currentFrame?.id])

  useEffect(() => {
    if (!meeting) return

    if (meeting?.sections && meeting.sections.length > 0) {
      fetchSectionsWithFrames({ ids: meeting.sections })

      return
    }
    addFirstFrame()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.sections])

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

  const fetchSectionsWithFrames = async ({ ids }: { ids: string[] }) => {
    const getSectionsData = await SectionService.getSections({
      sectionIds: ids,
    })

    if (getSectionsData.error) {
      console.error('error while fetching sections: ', getSectionsData.error)

      return
    }

    const getFramesData = await FrameService.getFrames({
      sectionIds: getSectionsData.data.map((s) => s.id),
    })

    if (getFramesData.error) {
      console.error('error while fetching frames: ', getFramesData.error)

      return
    }

    const frames = getFramesData.data
    const meetingSections: any[] = ids.map((id: string) =>
      getSectionsData.data.find((s) => s.id === id)
    )

    const sectionsWithFrames = meetingSections.map((section) => {
      const sectionFrames = section.frames.map(
        (id: string) => frames.find((s) => s?.id === id) as IFrame
      )

      return {
        ...section,
        frames: sectionFrames,
      }
    })

    setShowSectionPlaceholder(false)
    setSections(sectionsWithFrames)

    if (!currentFrame) {
      setCurrentFrame(sectionsWithFrames[0]?.frames[0])
    }

    setLoading(false)
  }

  const addFirstFrame = async () => {
    if (!isOwner) return

    setLoading(true)

    const firstFrame = getDefaultCoverFrame({
      name: useEventData.event.name,
      title: useEventData.event.name,
      description: useEventData.event.description,
    }) as IFrame

    await addFrameToSection({ frame: firstFrame })
    setLoading(false)
  }

  const addFrameToSection = async ({
    frame,
    section,
    afterFrameId,
  }: {
    frame: Partial<IFrame>
    section?: Partial<ISection>
    afterFrameId?: string
  }) => {
    if (!isOwner) return

    let _section
    let newSection = false

    if (!section?.id) {
      // 1. Create a new section
      const sectionResponse = await SectionService.createSection({
        name: `Section ${(sections?.length || 0) + 1}`,
        meeting_id: meeting?.id,
        frames: [],
      })

      if (sectionResponse.error) {
        console.error('error while creating section: ', sectionResponse.error)

        return
      }

      _section = sectionResponse.data
      newSection = true
    } else {
      _section = {
        ...section,
        frames: section?.frames?.map((s) => s?.id) || [],
      }
    }

    if (!_section) return

    // 2. Create a new frame
    setShowFramePlaceholder(true)

    const frameResponse = await FrameService.createFrame({
      ...frame,
      section_id: _section.id!,
      meeting_id: meeting?.id,
    })

    if (frameResponse.error) {
      console.error('error while creating frame: ', frameResponse.error)
      setShowFramePlaceholder(false)

      return
    }

    // 3. Update the section with the frame
    const updatedSectionFrameIds = _section.frames || []

    if (afterFrameId) {
      const index = updatedSectionFrameIds.indexOf(afterFrameId)
      updatedSectionFrameIds.splice(index + 1, 0, frameResponse.data.id)
    } else {
      updatedSectionFrameIds.push(frameResponse.data.id)
    }

    const updateSectionData = await updateSection({
      sectionPayload: {
        frames: updatedSectionFrameIds,
      },
      sectionId: _section.id,
    })

    if (!updateSectionData) {
      setShowFramePlaceholder(false)

      return
    }

    if (newSection) {
      // 4. Update the meeting with the section
      await updateMeeting({
        meetingPayload: {
          sections: [...(meeting.sections || []), _section.id],
        },
        meetingId: meeting.id,
      })
    }

    setShowFramePlaceholder(false)
    setCurrentFrame(frameResponse.data)
    setOverviewOpen(false)
    setCurrentSectionId(null)
  }

  const addSection = async ({
    name,
    addToLast,
    afterSectionId,
  }: Parameters<EventContextType['addSection']>[0]) => {
    if (showSectionPlaceholder) return

    if (!isOwner) return

    const sectionName = name || `Section ${(sections?.length || 0) + 1}`

    setShowSectionPlaceholder(true)
    const sectionResponse = await SectionService.createSection({
      name: sectionName,
      meeting_id: meeting?.id,
      frames: [],
    })

    if (sectionResponse.error) {
      console.error('error while creating section: ', sectionResponse.error)

      return
    }

    const sectionIds = meeting.sections || []
    const _currentSectionId = currentFrame?.section_id

    if (_currentSectionId && !addToLast && !afterSectionId) {
      const index = sectionIds.indexOf(currentSectionId)
      sectionIds.splice(index + 1, 0, sectionResponse.data.id)
    } else if (afterSectionId) {
      const index = sectionIds.indexOf(afterSectionId)
      sectionIds.splice(index + 1, 0, sectionResponse.data.id)
    } else {
      // Add the section at the end
      sectionIds.push(sectionResponse.data.id)
    }
    setSelectedSectionId(sectionResponse.data.id)
    setInsertInSectionId(sectionResponse.data.id)
    // Update the sections on meeting
    await updateMeeting({
      meetingPayload: {
        sections: sectionIds,
      },
      meetingId: meeting.id,
    })
  }

  const updateSection = async ({
    sectionPayload,
    sectionId,
    meetingId,
  }: {
    sectionPayload: {
      name?: string
      frames?: string[]
    }
    sectionId?: string
    meetingId?: string
  }) => {
    if (!isOwner) return null

    const sectionResponse = await SectionService.updateSection({
      payload: { ...sectionPayload },
      sectionId,
      meetingId,
    })

    if (sectionResponse.error) {
      console.error('error while updating section: ', sectionResponse.error)

      return null
    }

    return sectionResponse.data
  }

  const deleteSection = async ({ sectionId }: { sectionId: string }) => {
    const response = await MeetingService.updateMeeting({
      meetingPayload: {
        sections: meeting.sections.filter((id: string) => id !== sectionId),
      },
      meetingId: meeting.id,
    })

    if (response.error) {
      toast.error('Error while deleting section')

      return false
    }

    // delete section from db- will also cascade delete to frames, frame-response...
    const deleteResponse = await SectionService.deleteSection({ sectionId })

    if (deleteResponse.error) {
      toast.error('Error while deleting section')

      return false
    }

    toast.success('Section deleted successfully')

    return true
  }

  const updateMeeting = async ({
    meetingPayload,
    meetingId,
  }: {
    meetingPayload: {
      sections: string[]
    }
    meetingId: string
  }) => {
    if (!isOwner) return null

    const meetingResponse = await MeetingService.updateMeeting({
      meetingPayload: {
        sections: meetingPayload.sections,
      },
      meetingId,
    })

    if (meetingResponse.error) {
      console.error('error while updating meeting: ', meetingResponse.error)

      return null
    }

    return meetingResponse.data
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
    if (!isOwner) return null

    const importGoogleSlidesResponse = await supabase.functions.invoke(
      'import-google-slides',
      {
        body: {
          googleSlideUrl,
          meetingId: meeting.id,
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
    allowParticipantToUpdate = false,
  }: {
    framePayload: Partial<IFrame>
    frameId: string
    allowParticipantToUpdate?: boolean
  }) => {
    if (!isOwner && !allowParticipantToUpdate) return null
    if (!frameId) return null
    if (Object.keys(framePayload).length === 0) return null

    setSyncing(true)
    const updateFrameResponse = await FrameService.updateFrame({
      framePayload,
      frameId,
    })

    if (updateFrameResponse.error) {
      console.error('error while updating frame: ', updateFrameResponse.error)

      return null
    }

    setSyncing(false)

    return null
  }

  const updateFrames = async ({
    framePayload,
    frameIds,
  }: {
    framePayload: Partial<IFrame>
    frameIds: string[]
  }) => {
    if (!isOwner) return null
    if (!frameIds.length) return null
    if (Object.keys(framePayload).length === 0) return null

    setSyncing(true)
    const updateFrameResponse = await FrameService.updateFrames({
      framePayload,
      frameIds,
    })

    if (updateFrameResponse?.error) {
      console.error('error while updating frame: ', updateFrameResponse.error)

      return null
    }

    setSyncing(false)

    return null
  }

  const _deleteFrame = async (id: string) => {
    const Response = await FrameService.deleteFrame(id)

    if (Response.error) {
      console.error('error while deleting frame: ', Response.error)
    }
  }

  const deleteFrame = async (frame: IFrame) => {
    if (!isOwner) return null

    _deleteFrame(frame.id)

    // Update the section with the frame
    const section = sections.find((s) => s.id === frame.section_id)

    const _frames = section.frames
      .filter((s: IFrame) => s?.id !== frame.id)
      .filter((s: IFrame) => s?.id)

    await updateSection({
      sectionPayload: {
        frames: _frames.map((s: IFrame) => s?.id),
      },
      sectionId: section.id,
    })

    return null
  }

  const deleteBreakoutFrames = async (frame: IFrame) => {
    if (!isOwner) return null

    const breakoutIds = [frame.id]
    _deleteFrame(frame.id)

    if (frame?.config?.selectedBreakout === BREAKOUT_TYPES.ROOMS) {
      frame?.content?.breakoutDetails?.map(async (ele) => {
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

    const _frames = section.frames
      .filter((s: IFrame) => !breakoutIds?.includes(s?.id))
      .filter((s: IFrame) => s?.id)

    await updateSection({
      sectionPayload: {
        frames: _frames.map((s: IFrame) => s?.id),
      },
      sectionId: section.id,
    })

    return null
  }

  const moveUpFrame = async (frame: IFrame) => {
    if (!isOwner) return null

    const section = sections.find((s) => s.id === frame.section_id)
    const index = section.frames.findIndex((s: IFrame) => s?.id === frame.id)
    if (index === 0) return null

    const sectionFramesCopy = [...section.frames]

    const temp = sectionFramesCopy[index - 1]
    sectionFramesCopy[index - 1] = sectionFramesCopy[index]
    sectionFramesCopy[index] = temp

    await updateSection({
      sectionPayload: {
        frames: sectionFramesCopy.map((i: IFrame) => i.id),
      },
      sectionId: section.id,
    })

    const updatedSections = sections.map((s) =>
      s.id === section.id
        ? {
            ...s,
            frames: sectionFramesCopy,
          }
        : s
    )

    setSections(updatedSections)

    return null
  }

  const moveUpSection = async (section: ISection) => {
    if (!isOwner) return null

    const index = sections.findIndex((s) => s.id === section.id)
    if (index === 0) return null

    const sectionsCopy = [...sections]

    const temp = sectionsCopy[index - 1]
    sectionsCopy[index - 1] = sectionsCopy[index]
    sectionsCopy[index] = temp

    const updateMeetingResponseData = await updateMeeting({
      meetingPayload: {
        sections: sectionsCopy.map((s) => s.id),
      },
      meetingId: meeting.id,
    })

    if (!updateMeetingResponseData) return null

    setSections(sectionsCopy)

    return null
  }

  const moveDownSection = async (section: ISection) => {
    if (!isOwner) return null

    const index = sections.findIndex((s) => s.id === section.id)
    if (index === sections.length - 1) return null

    const sectionsCopy = [...sections]

    const temp = sectionsCopy[index + 1]
    sectionsCopy[index + 1] = sectionsCopy[index]
    sectionsCopy[index] = temp

    const updateMeetingResponseData = await updateMeeting({
      meetingPayload: {
        sections: sectionsCopy.map((s) => s.id),
      },
      meetingId: meeting.id,
    })

    if (!updateMeetingResponseData) return null

    setSections(sectionsCopy)

    return null
  }

  const moveDownFrame = async (frame: IFrame) => {
    if (!isOwner) return null

    const section = sections.find((s) => s.id === frame.section_id)
    const index = section.frames.findIndex((s: IFrame) => s?.id === frame.id)
    if (index === section.frames.length - 1) return null

    const sectionFramesCopy = [...section.frames]

    const temp = sectionFramesCopy[index + 1]
    sectionFramesCopy[index + 1] = sectionFramesCopy[index]
    sectionFramesCopy[index] = temp

    await updateSection({
      sectionPayload: {
        frames: sectionFramesCopy.map((i: IFrame) => i?.id),
      },
      sectionId: section.id,
    })

    const updatedSections = sections.map((s) =>
      s.id === section.id
        ? {
            ...s,
            frames: sectionFramesCopy,
          }
        : s
    )

    setSections(updatedSections)

    return null
  }

  const reorder = (list: string[], startIndex: number, endIndex: number) => {
    const result = list
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderFrame = async (result: OnDragEndResponder | any) => {
    if (!isOwner) return null

    const { source, destination } = result

    if (!destination) {
      return null
    }

    if (destination.droppableId === source.droppableId) {
      const sectionId = source.droppableId.split(
        'frame-droppable-sectionId-'
      )[1]
      const section = sections.find((s) => s.id === sectionId)
      if (!section) return null

      const items = reorder(
        section.frames.map((s: IFrame) => s?.id),
        source.index,
        destination.index
      )
      await updateSection({
        sectionPayload: {
          frames: items,
        },
        sectionId,
      })
    } else {
      const sourceSectionId = source.droppableId.split(
        'frame-droppable-sectionId-'
      )[1]
      const destinationSectionId = destination.droppableId.split(
        'frame-droppable-sectionId-'
      )[1]

      const sourceSection = sections.find((s) => s.id === sourceSectionId)
      const destinationSection = sections.find(
        (s) => s.id === destinationSectionId
      )

      if (!sourceSection || !destinationSection) return null

      const [removed] = sourceSection.frames.splice(source.index, 1)
      destinationSection.frames.splice(destination.index, 0, removed)

      await updateSection({
        sectionPayload: {
          frames: sourceSection.frames.map((i: IFrame) => i?.id),
        },
        sectionId: sourceSectionId,
      })
      await updateFrame({
        framePayload: {
          section_id: destinationSectionId,
        },
        frameId: removed.id,
      })
      await updateSection({
        sectionPayload: {
          frames: destinationSection.frames.map((i: IFrame) => i?.id),
        },
        sectionId: destinationSectionId,
      })

      return null
    }

    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderSection = async (result: OnDragEndResponder | any) => {
    const { source, destination } = result
    if (destination.droppableId !== 'section-droppable') return
    if (source.droppableId !== 'section-droppable') return

    const items = reorder(meeting.sections, source.index, destination.index)
    await updateMeeting({
      meetingPayload: {
        sections: items,
      },
      meetingId: meeting.id,
    })
  }

  const getCurrentFrame = (activityId: string): IFrame => {
    const _frames = sections.map((sec) => sec.frames).flat(2)
    const cFrame = _frames.find((f) => f?.id === activityId) as IFrame

    return cFrame
  }

  useHotkeys(
    'p',
    () => isOwner && eventMode === 'edit' && setPreview(!preview),
    [preview, isOwner, eventMode]
  )
  useHotkeys('ESC', () => isOwner && setPreview(false), [isOwner])
  useHotkeys('alt + n', () => addSection({}))

  return (
    <EventContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        eventId: eventId as string,
        eventMode:
          eventMode !== 'present' ? (isOwner ? 'edit' : 'view') : eventMode,
        meeting,
        currentFrame,
        overviewOpen,
        loading,
        syncing,
        isOwner,
        sections,
        showSectionPlaceholder,
        showFramePlaceholder,
        preview,
        error,
        openContentTypePicker,
        setOpenContentTypePicker,
        setPreview,
        currentSectionId,
        setCurrentFrame: (frame) => {
          setCurrentFrame(frame)

          if (frame) setOverviewOpen(false)
        },
        setCurrentSectionId,
        setOverviewOpen: (open) => {
          setCurrentFrame(null)
          setOverviewOpen(open)
        },
        insertAfterSectionId,
        insertAfterFrameId,
        insertInSectionId,
        selectedSectionId,
        setInsertAfterSectionId,
        setInsertAfterFrameId,
        setInsertInSectionId,
        setSelectedSectionId,
        importGoogleSlides,
        updateFrame,
        updateFrames,
        deleteFrame,
        moveUpFrame,
        moveDownFrame,
        reorderFrame,
        reorderSection,
        addSection,
        updateSection,
        deleteSection,
        addFrameToSection,
        moveUpSection,
        moveDownSection,
        getCurrentFrame,
        deleteBreakoutFrames,
      }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext() {
  const context = useContext(EventContext) as EventContextType

  if (!context) {
    throw new Error('useEvent must be used within EventProvider')
  }

  return context
}
