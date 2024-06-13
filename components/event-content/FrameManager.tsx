/* eslint-disable react/button-has-type */
import { Fragment, useContext, useState } from 'react'

import { useParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { v4 as uuidv4 } from 'uuid'

import { FrameContainer } from './FrameContainer'
import { Header } from './Header'
import { RightSidebar } from './RightSidebar'
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
import { FrameStatus } from '@/services/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent } from '@/utils/content.util'

export function FrameManager() {
  const { eventId } = useParams()
  const { event, isLoading: eventLoading } = useEvent({ id: eventId as string })
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(true)

  const {
    loading,
    syncing,
    currentFrame,
    sections,
    openContentTypePicker,
    setOpenContentTypePicker,
    insertAfterFrameId,
    insertInSectionId,
    addFrameToSection,
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

  const handleAddNewFrame = (
    contentType: ContentType,
    templateType: CANVAS_TEMPLATE_TYPES | undefined
  ) => {
    let currentSection
    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
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
      status: FrameStatus.DRAFT,
    }

    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: insertAfterFrameId!,
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
        <FrameContainer />
      </StudioLayout>
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={handleAddNewFrame}
      />
      <SyncingStatus syncing={syncing} />
    </>
  )
}
