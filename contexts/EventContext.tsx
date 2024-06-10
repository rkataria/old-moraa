/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { OnDragEndResponder } from 'react-beautiful-dnd'
import { useHotkeys } from 'react-hotkeys-hook'

import { useAuth } from '@/hooks/useAuth'
import { useEvent } from '@/hooks/useEvent'
import { MeetingService } from '@/services/meeting.service'
import { SectionService } from '@/services/section.service'
import { SlideService } from '@/services/slide.service'
import { EventContextType, EventModeType } from '@/types/event-context.type'
import { ISection, ISlide } from '@/types/slide.type'
import { getDefaultCoverSlide } from '@/utils/content.util'

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
  const [currentSlide, setCurrentSlide] = useState<any>(null)
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
  const [showSlidePlaceholder, setShowSlidePlaceholder] =
    useState<boolean>(false)

  const [insertAfterSlideId, setInsertAfterSlideId] = useState<string | null>(
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
    slideId: string
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
          event: 'UPDATE',
          schema: 'public',
          table: 'section',
          filter: `meeting_id=eq.${meeting.id}`,
        },
        async (payload) => {
          console.log('Section change received!', payload)

          /**
           * Two approaches are considered for handling section updates:
           *
           * 1. Fetch the updated section, including all slide contents, and update the section's state.
           * 2. Update the section's state based on the payload data.
           *
           * Currently, the first approach is implemented to maintain slide order consistency and mitigate potential issues with content updates. However, this approach is not optimal, and further optimization or a refinement of the second approach may be necessary.
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

            return null
          }

          const currentSectionWithSlidesContent = sectionResponse.data
          // const previousSlideIds = sections
          //   .find((s) => s.id === updatedSection.id)
          //   ?.slides.map((slide: ISlide) => slide.id)
          // const newSlideIds = currentSectionWithSlidesContent.slides || []
          // const diffSlideIds = newSlideIds.filter(
          //   (slideId: string) => !previousSlideIds?.includes(slideId)
          // )

          // if (diffSlideIds.length > 0) {
          //   setCurrentSlide(
          //     currentSectionWithSlidesContent.slidesWithContent.find(
          //       (s) => s.id === diffSlideIds[0]
          //     )
          //   )
          // }

          setSections((prevSections) => {
            const updatedSections = prevSections.map((section) => {
              if (section.id === updatedSection.id) {
                const updateSlidesOrder =
                  currentSectionWithSlidesContent.slides?.map(
                    (slideId: string) =>
                      currentSectionWithSlidesContent.slidesWithContent.find(
                        (s) => s.id === slideId
                      )
                  )

                return {
                  ...sectionResponse.data,
                  slides: updateSlidesOrder || [],
                  slidesWithContent: undefined,
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

          //   const newSlideIds = updatedSection.slides // [1, 2, 4]
          //   const previousSlideIds = _currentSection.slides.map(
          //     (slide: ISlide) => slide.id
          //   ) // [1, 2, 3]
          //   const diffSlideIds = newSlideIds.filter(
          //     (slideId: string) => !previousSlideIds.includes(slideId)
          //   )

          //   console.log('diffSlideIds', diffSlideIds)
          //   console.log('previousSlideIds', previousSlideIds)
          //   console.log('newSlideIds', newSlideIds)

          //   // Check if the slide is added
          //   if (diffSlideIds.length > 0) {
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

          //     const currentSectionWithSlidesContent = sectionResponse.data
          //     const firstNewSlide =
          //       currentSectionWithSlidesContent.slidesWithContent.find(
          //         (s) => s.id === diffSlideIds[0]
          //       )

          //     const updatedSections = sections.map((section) => {
          //       if (section.id === updatedSection.id) {
          //         const updateSlidesOrder =
          //           currentSectionWithSlidesContent.slides?.map(
          //             (slideId: string) =>
          //               currentSectionWithSlidesContent.slidesWithContent.find(
          //                 (s) => s.id === slideId
          //               )
          //           )

          //         return {
          //           ...sectionResponse.data,
          //           slides: updateSlidesOrder || [],
          //           slidesWithContent: undefined,
          //         }
          //       }

          //       return section
          //     })
          //     console.log('diffslideIds updatedSections', updatedSections)
          //     setCurrentSlide(firstNewSlide)
          //     setSections(updatedSections)
          //     setInsertAfterSlideId(null)
          //     setShowSlidePlaceholder(false)

          //     return null
          //   }

          //   const isSlidesOrderedChanged =
          //     newSlideIds.join(',') !== previousSlideIds.join(',')

          //   // Check if the slides order is changed
          //   if (isSlidesOrderedChanged) {
          //     // Updated slides order
          //     const orderedSlides = newSlideIds.map((slideId: string) =>
          //       _currentSection.slides.find(
          //         (slide: ISlide) => slide.id === slideId
          //       )
          //     )
          //     const updatedSections = sections.map((section) => {
          //       if (section.id === updatedSection.id) {
          //         return { ...updatedSection, slides: orderedSlides }
          //       }

          //       return section
          //     })

          //     console.log('diffOrder updatedSections', updatedSections)
          //     setSections(updatedSections)
          //     setCurrentSlide(
          //       getNextSlide({ sections: updatedSections, currentSlide })
          //     )
          //     setInsertAfterSlideId(null)
          //     setShowSlidePlaceholder(false)

          //     return null
          //   }

          //   const updatedSections = sections.map((section) => {
          //     if (section.id === updatedSection.id) {
          //       return { ...updatedSection, slides: section.slides }
          //     }

          //     return section
          //   })

          //   console.log('updatedSections', updatedSections)
          //   setSections(updatedSections)
          //   setInsertAfterSlideId(null)
          //   setShowSlidePlaceholder(false)

          //   return null
          // }

          return null
        }
      )
      .subscribe()

    // subscribe to the slide updates
    const slideUpdateSubscription = supabase
      .channel('slide-update-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slide',
          filter: `meeting_id=eq.${meeting.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            let updatedSlide = payload.new

            const updatedSections = sections.map((section) => {
              if (section.id === updatedSlide.section_id) {
                updatedSlide = {
                  ...section.slides.find(
                    (slide: ISlide) => slide.id === updatedSlide.id
                  ),
                  ...updatedSlide,
                }

                return {
                  ...section,
                  slides: section.slides.map((slide: ISlide) =>
                    slide.id === updatedSlide.id ? updatedSlide : slide
                  ),
                }
              }

              return section
            })

            setSections(updatedSections)

            if (updatedSlide.id === currentSlide?.id) {
              setCurrentSlide(updatedSlide)
            }
          }

          if (payload.eventType === 'DELETE') {
            const deletedSlideId = payload.old?.id
            const sectionSlideDeletedFrom = sections.find((section) =>
              section.slides.find(
                (slide: ISlide) => slide.id === deletedSlideId
              )
            )
            const deletedSlide = sectionSlideDeletedFrom?.slides.find(
              (slide: ISlide) => slide.id === deletedSlideId
            )

            const updatedSections = sections.map((section) => {
              if (section.id === deletedSlide?.section_id) {
                return {
                  ...section,
                  slides: section.slides.filter(
                    (slide: ISlide) => slide.id !== deletedSlide.id
                  ),
                }
              }

              return section
            })

            const deletedSlideIndex = sectionSlideDeletedFrom?.slides.findIndex(
              (s: ISlide) => s.id === deletedSlideId
            )
            const previousSlide =
              sectionSlideDeletedFrom?.slides[deletedSlideIndex - 1]

            setSections(updatedSections)

            if (previousSlide) {
              setCurrentSlide(previousSlide)
            }
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      meetingUpdateSubscription.unsubscribe()
      sectionUpdateSubscription.unsubscribe()
      slideUpdateSubscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id, sections, isOwner, currentSlide?.id])

  useEffect(() => {
    if (!meeting) return

    if (meeting?.sections && meeting.sections.length > 0) {
      fetchSectionsWithSlides({ ids: meeting.sections })

      return
    }
    addFirstSlide()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.sections])

  // useEffect(() => {
  //   if (!currentSlide) return

  //   const currentSlideElement = document.querySelector(
  //     `div[data-minislide-id="${currentSlide.id}"]`
  //   )

  //   if (!currentSlideElement) return

  //   currentSlideElement.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center',
  //   })
  // }, [currentSlide])

  const fetchSectionsWithSlides = async ({ ids }: { ids: string[] }) => {
    const getSectionsData = await SectionService.getSections({
      sectionIds: ids,
    })

    if (getSectionsData.error) {
      console.error('error while fetching sections: ', getSectionsData.error)

      return
    }

    const getSlidesData = await SlideService.getSlides({
      sectionIds: getSectionsData.data.map((s) => s.id),
    })

    if (getSlidesData.error) {
      console.error('error while fetching slides: ', getSlidesData.error)

      return
    }

    const slides = getSlidesData.data
    const meetingSections: any[] = ids.map((id: string) =>
      getSectionsData.data.find((s) => s.id === id)
    )

    const sectionsWithSlides = meetingSections.map((section) => {
      const sectionSlides = section.slides.map(
        (id: string) => slides.find((s) => s.id === id) as ISlide
      )

      return {
        ...section,
        slides: sectionSlides,
      }
    })

    setShowSectionPlaceholder(false)
    setSections(sectionsWithSlides)

    if (!currentSlide) {
      setCurrentSlide(sectionsWithSlides[0]?.slides[0])
    }

    setLoading(false)
  }

  const addFirstSlide = async () => {
    if (!isOwner) return

    setLoading(true)

    const firstSlide = getDefaultCoverSlide({
      name: useEventData.event.name,
      title: useEventData.event.name,
      description: useEventData.event.description,
    }) as ISlide

    await addSlideToSection({ slide: firstSlide })
    setLoading(false)
  }

  const addSlideToSection = async ({
    slide,
    section,
    afterSlideId,
  }: {
    slide: Partial<ISlide>
    section?: Partial<ISection>
    afterSlideId?: string
  }) => {
    if (!isOwner) return

    let _section
    let newSection = false

    if (!section?.id) {
      // 1. Create a new section
      const sectionResponse = await SectionService.createSection({
        name: `Untitled Section ${(sections?.length || 0) + 1}`,
        meeting_id: meeting?.id,
        slides: [],
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
        slides: section?.slides?.map((s) => s.id) || [],
      }
    }

    if (!_section) return

    // 2. Create a new slide
    setShowSlidePlaceholder(true)
    const slideResponse = await SlideService.createSlide({
      ...slide,
      section_id: _section.id!,
      meeting_id: meeting?.id,
    })
    setShowSlidePlaceholder(false)

    if (slideResponse.error) {
      console.error('error while creating slide: ', slideResponse.error)

      return
    }

    // 3. Update the section with the slide
    const updatedSectionSlideIds = _section.slides || []

    if (afterSlideId) {
      const index = updatedSectionSlideIds.indexOf(afterSlideId)
      updatedSectionSlideIds.splice(index + 1, 0, slideResponse.data.id)
    } else {
      updatedSectionSlideIds.push(slideResponse.data.id)
    }

    const updateSectionData = await updateSection({
      sectionPayload: {
        slides: updatedSectionSlideIds,
      },
      sectionId: _section.id,
    })

    if (!updateSectionData) {
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
  }

  const addSection = async ({
    name,
    addToLast,
    afterSectionId,
  }: Parameters<EventContextType['addSection']>[0]) => {
    if (showSectionPlaceholder) return

    if (!isOwner) return

    const sectionName =
      name || `Untitled Section ${(sections?.length || 0) + 1}`

    setShowSectionPlaceholder(true)
    const sectionResponse = await SectionService.createSection({
      name: sectionName,
      meeting_id: meeting?.id,
      slides: [],
    })

    if (sectionResponse.error) {
      console.error('error while creating section: ', sectionResponse.error)

      return
    }

    const sectionIds = meeting.sections || []
    const currentSectionId = currentSlide?.section_id

    if (currentSectionId && !addToLast && !afterSectionId) {
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
      slides?: string[]
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

  const deleteSection = async ({
    sectionId,
    meetingId,
  }: {
    sectionId: string
    meetingId: string
  }) => {
    const response = await MeetingService.updateMeeting({
      meetingPayload: {
        sections: meeting.sections.filter((id: string) => id !== sectionId),
      },
      meetingId,
    })

    if (response.error) {
      console.error('error while deleting section: ', response.error)

      return null
    }

    // delete section from db- will also cascade delete to slides, slide-response...
    await SectionService.deleteSection({ sectionId })

    return null
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
    slide,
    googleSlideUrl,
    startPosition,
    endPosition,
  }: {
    slide: ISlide
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
          sectionId: slide.section_id,
          startPosition,
          endPosition,
        },
      }
    )
    console.log(importGoogleSlidesResponse)
    if (!importGoogleSlidesResponse.data?.success) {
      console.error(
        'error while importing google slides: ',
        importGoogleSlidesResponse.data?.message
      )

      setError({
        slideId: slide.id,
        message: importGoogleSlidesResponse.data?.message,
      })

      return null
    }

    const { insertedSlides: insertedSlideIds } = importGoogleSlidesResponse.data

    const section = sections.find((s) => s.id === slide.section_id)
    const existingSlideIds = section?.slides.map((s: ISlide) => s.id) || []
    const existingSlideIdsWithoutGoogleSlideId = existingSlideIds.filter(
      (sid: string) => sid !== slide.id
    )
    const updatedSlideIds = [
      ...existingSlideIdsWithoutGoogleSlideId,
      ...insertedSlideIds,
    ]

    // Update section
    const sectionData = await updateSection({
      sectionPayload: {
        slides: updatedSlideIds,
      },
      sectionId: slide.section_id,
    })

    if (!sectionData) return null

    // Delete the google import slide
    const deleteSlideResponse = await SlideService.deleteSlide(slide.id)

    if (deleteSlideResponse.error) {
      console.error('error while deleting slide: ', deleteSlideResponse.error)

      return null
    }

    return null
  }

  const updateSlide = async ({
    slidePayload,
    slideId,
    allowParticipantToUpdate = false,
  }: {
    slidePayload: Partial<ISlide>
    slideId: string
    allowParticipantToUpdate?: boolean
  }) => {
    if (!isOwner && !allowParticipantToUpdate) return null
    if (!slideId) return null
    if (Object.keys(slidePayload).length === 0) return null

    setSyncing(true)
    const updateSlideResponse = await SlideService.updateSlide({
      slidePayload,
      slideId,
    })

    if (updateSlideResponse.error) {
      console.error('error while updating slide: ', updateSlideResponse.error)

      return null
    }

    setSyncing(false)

    return null
  }

  const updateSlides = async ({
    slidePayload,
    slideIds,
  }: {
    slidePayload: Partial<ISlide>
    slideIds: string[]
  }) => {
    if (!isOwner) return null
    if (!slideIds.length) return null
    if (Object.keys(slidePayload).length === 0) return null

    setSyncing(true)
    const updateSlideResponse = await SlideService.updateSlides({
      slidePayload,
      slideIds,
    })

    if (updateSlideResponse?.error) {
      console.error('error while updating slide: ', updateSlideResponse.error)

      return null
    }

    setSyncing(false)

    return null
  }

  const deleteSlide = async (slide: ISlide) => {
    if (!isOwner) return null

    const deleteSlideResponse = await SlideService.deleteSlide(slide.id)

    if (deleteSlideResponse.error) {
      console.error('error while deleting slide: ', deleteSlideResponse.error)

      return null
    }

    // Update the section with the slide
    const section = sections.find((s) => s.id === slide.section_id)
    await updateSection({
      sectionPayload: {
        slides: section.slides
          .filter((s: ISlide) => s.id !== slide.id)
          .map((s: ISlide) => s.id),
      },
      sectionId: section.id,
    })

    return null
  }

  const moveUpSlide = async (slide: ISlide) => {
    if (!isOwner) return null

    const section = sections.find((s) => s.id === slide.section_id)
    const index = section.slides.findIndex((s: ISlide) => s.id === slide.id)
    if (index === 0) return null

    const sectionSlidesCopy = [...section.slides]

    const temp = sectionSlidesCopy[index - 1]
    sectionSlidesCopy[index - 1] = sectionSlidesCopy[index]
    sectionSlidesCopy[index] = temp

    await updateSection({
      sectionPayload: {
        slides: sectionSlidesCopy.map((i: ISlide) => i.id),
      },
      sectionId: section.id,
    })

    const updatedSections = sections.map((s) =>
      s.id === section.id
        ? {
            ...s,
            slides: sectionSlidesCopy,
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

  const moveDownSlide = async (slide: ISlide) => {
    if (!isOwner) return null

    const section = sections.find((s) => s.id === slide.section_id)
    const index = section.slides.findIndex((s: ISlide) => s.id === slide.id)
    if (index === section.slides.length - 1) return null

    const sectionSlidesCopy = [...section.slides]

    const temp = sectionSlidesCopy[index + 1]
    sectionSlidesCopy[index + 1] = sectionSlidesCopy[index]
    sectionSlidesCopy[index] = temp

    await updateSection({
      sectionPayload: {
        slides: sectionSlidesCopy.map((i: ISlide) => i.id),
      },
      sectionId: section.id,
    })

    const updatedSections = sections.map((s) =>
      s.id === section.id
        ? {
            ...s,
            slides: sectionSlidesCopy,
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
  const reorderSlide = async (result: OnDragEndResponder | any) => {
    if (!isOwner) return null

    const { source, destination } = result

    if (!destination) {
      return null
    }

    if (destination.droppableId === source.droppableId) {
      const sectionId = source.droppableId.split(
        'slide-droppable-sectionId-'
      )[1]
      const section = sections.find((s) => s.id === sectionId)
      if (!section) return null

      const items = reorder(
        section.slides.map((s: ISlide) => s.id),
        source.index,
        destination.index
      )
      await updateSection({
        sectionPayload: {
          slides: items,
        },
        sectionId,
      })
    } else {
      const sourceSectionId = source.droppableId.split(
        'slide-droppable-sectionId-'
      )[1]
      const destinationSectionId = destination.droppableId.split(
        'slide-droppable-sectionId-'
      )[1]

      const sourceSection = sections.find((s) => s.id === sourceSectionId)
      const destinationSection = sections.find(
        (s) => s.id === destinationSectionId
      )

      if (!sourceSection || !destinationSection) return null

      const [removed] = sourceSection.slides.splice(source.index, 1)
      destinationSection.slides.splice(destination.index, 0, removed)

      await updateSection({
        sectionPayload: {
          slides: sourceSection.slides.map((i: ISlide) => i.id),
        },
        sectionId: sourceSectionId,
      })
      await updateSlide({
        slidePayload: {
          section_id: destinationSectionId,
        },
        slideId: removed.id,
      })
      await updateSection({
        sectionPayload: {
          slides: destinationSection.slides.map((i: ISlide) => i.id),
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
        eventMode:
          eventMode !== 'present' ? (isOwner ? 'edit' : 'view') : eventMode,
        meeting,
        currentSlide,
        overviewOpen,
        loading,
        syncing,
        isOwner,
        sections,
        showSectionPlaceholder,
        showSlidePlaceholder,
        preview,
        error,
        openContentTypePicker,
        setOpenContentTypePicker,
        setPreview,
        setCurrentSlide: (slide) => {
          setCurrentSlide(slide)
          setOverviewOpen(false)
        },
        setOverviewOpen: (open) => {
          setCurrentSlide(null)
          setOverviewOpen(open)
        },
        insertAfterSectionId,
        insertAfterSlideId,
        insertInSectionId,
        selectedSectionId,
        setInsertAfterSectionId,
        setInsertAfterSlideId,
        setInsertInSectionId,
        setSelectedSectionId,
        importGoogleSlides,
        updateSlide,
        updateSlides,
        deleteSlide,
        moveUpSlide,
        moveDownSlide,
        reorderSlide,
        reorderSection,
        addSection,
        updateSection,
        deleteSection,
        addSlideToSection,
        moveUpSection,
        moveDownSection,
      }}>
      {children}
    </EventContext.Provider>
  )
}
