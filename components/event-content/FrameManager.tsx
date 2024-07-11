/* eslint-disable react/button-has-type */
import { Fragment, useContext, useState } from 'react'

import { useParams } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { v4 as uuidv4 } from 'uuid'

import { FrameContainer } from './FrameContainer'
import { Header } from './Header'
import { ResizableRightSidebar } from './ResizableRightSidebar'
import { RightSidebar } from './RightSidebar'
import { RightSidebarControls } from './RightSidebarControls'
import { AgendaPanel } from '../common/AgendaPanel'
import {
  BREAKOUT_TYPES,
  BreakoutTypePicker,
} from '../common/BreakoutTypePicker'
import { Loading } from '../common/Loading'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { StudioLayout } from '../common/StudioLayout/Index'
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
  const [selectedContentType, setContentType] = useState<ContentType | null>(
    null
  )
  const [selectedTemplateType, setTemplateType] = useState<
    CANVAS_TEMPLATE_TYPES | undefined
  >(undefined)

  const [openBreakoutSelectorModal, setOpenBreakoutSelectorModal] =
    useState<boolean>(false)

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
    setAddNewFrameLoader,
  } = useContext(EventContext) as EventContextType

  useHotkeys('f', () => setOpenContentTypePicker(true), [])

  const handleAddNewFrame = (
    contentType: ContentType,
    templateType: CANVAS_TEMPLATE_TYPES | undefined,
    breakoutType?: BREAKOUT_TYPES,
    breakoutRoomsGroupsCount?: number,
    breakoutRoomsGroupsTime?: number
  ) => {
    let currentSection
    const _insertAfterFrameId = insertAfterFrameId || currentFrame?.id

    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    let frameConfig = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
    }

    setAddNewFrameLoader(true)

    if (contentType === ContentType.BREAKOUT) {
      const breakoutPayload = {
        selectedBreakout: breakoutType,
        breakoutCount: breakoutRoomsGroupsCount,
        breakoutTime: breakoutRoomsGroupsTime,
      }
      frameConfig = {
        ...frameConfig,
        ...breakoutPayload,
      }
    }

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: frameConfig,
      content: getDefaultContent({
        contentType,
        templateType,
        data: {
          breakoutCount: breakoutRoomsGroupsCount,
          selectedBreakout: breakoutType,
        },
        // TODO: Fix any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      type: contentType,
      status: FrameStatus.DRAFT,
    }

    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setOpenContentTypePicker(false)
    setContentType(null)
    setTemplateType(undefined)
    setOpenBreakoutSelectorModal(false)
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
        resizableRightSidebar={<ResizableRightSidebar />}
        rightSidebar={<RightSidebar />}
        rightSidebarControls={<RightSidebarControls />}>
        <FrameContainer />
      </StudioLayout>
      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={(content, templateType) => {
          if (content === ContentType.BREAKOUT) {
            setContentType(content)
            setTemplateType(templateType)
            setOpenBreakoutSelectorModal(true)
          } else {
            handleAddNewFrame(content, templateType)
          }
        }}
      />
      <SyncingStatus syncing={syncing} />
      <RenderIf isTrue={openBreakoutSelectorModal}>
        <BreakoutTypePicker
          open={openBreakoutSelectorModal}
          onClose={() => setOpenBreakoutSelectorModal(false)}
          onChoose={(
            contentType,
            breakoutRoomsGroupsCount,
            breakoutRoomsGroupsTime
          ) => {
            if (selectedContentType) {
              handleAddNewFrame(
                selectedContentType,
                selectedTemplateType,
                contentType,
                breakoutRoomsGroupsCount,
                breakoutRoomsGroupsTime
              )
            }
          }}
        />
      </RenderIf>
    </>
  )
}
