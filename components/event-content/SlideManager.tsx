/* eslint-disable react/button-has-type */
import { Fragment, useContext, useState } from 'react'

import { useParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { v4 as uuidv4 } from 'uuid'

import { Header } from './Header'
import { RightSidebar } from './RightSidebar'
import { SlideContainer } from './SlideContainer'
import { AgendaPanel } from '../common/AgendaPanel'
import { Loading } from '../common/Loading'
import { StudioLayout } from '../common/StudioLayout'
import { SyncingStatus } from '../common/SyncingStatus'

import {
  ContentTypePicker,
  ContentType,
  CANVAS_TEMPLATE_TYPES,
} from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { SlideStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { getDefaultContent } from '@/utils/content.util'

export function SlideManager() {
  const { eventId } = useParams()
  const { event, isLoading: eventLoading } = useEvent({ id: eventId as string })
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(true)

  const {
    loading,
    syncing,
    currentSlide,
    sections,
    openContentTypePicker,
    setOpenContentTypePicker,
    insertAfterSlideId,
    insertInSectionId,
    addSlideToSection,
  } = useContext(EventContext) as EventContextType

  useHotkeys('f', () => setOpenContentTypePicker(true), [])

  useHotkeys(
    'ctrl + ]',
    () => setRightSidebarVisible(!rightSidebarVisible),
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    [rightSidebarVisible]
  )

  const handleAddNewSlide = (
    contentType: ContentType,
    templateType: CANVAS_TEMPLATE_TYPES | undefined
  ) => {
    let currentSection
    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentSlide?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const newSlide: ISlide = {
      id: uuidv4(),
      name: `Slide ${(insertInSection?.slides?.length || 0) + 1}`,
      config: {
        textColor: '#000',
        allowVoteOnMultipleOptions: false,
        showTitle: true,
        showDescription: [ContentType.COVER, ContentType.TEXT_IMAGE].includes(
          contentType
        ),
      },
      // TODO: Fix any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: getDefaultContent({ contentType, templateType }) as any,
      type: contentType,
      status: SlideStatus.DRAFT,
    }

    addSlideToSection({
      slide: newSlide,
      section: insertInSection,
      afterSlideId: insertAfterSlideId!,
    })
    setOpenContentTypePicker(false)
  }

  if (eventLoading || loading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <StudioLayout
        header={<Header event={event} />}
        leftSidebar={<AgendaPanel />}
        rightSidebar={
          <div className="pl-0 bg-white h-full">
            <RightSidebar />
          </div>
        }>
        <SlideContainer />
      </StudioLayout>
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={handleAddNewSlide}
      />
      <SyncingStatus syncing={syncing} />
    </>
  )
}
