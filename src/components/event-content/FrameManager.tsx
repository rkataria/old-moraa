/* eslint-disable react/button-has-type */
import { useState } from 'react'

import { useParams } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { FaTableCellsRowLock } from 'react-icons/fa6'
import { v4 as uuidv4 } from 'uuid'

import { Header } from './Header'
import { SwitchToEditModal } from './SwitchToEditModal'
import { AssignmentOption } from '../common/breakout/AssignmentOptionSelector'
import {
  BREAKOUT_TYPES,
  BreakoutTypePicker,
} from '../common/BreakoutTypePicker'
import { EmptyPlaceholder } from '../common/EmptyPlaceholder'
import { FramePicker } from '../common/FramePicker'
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal'
import { Loading } from '../common/Loading'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { StudioLayout } from '../common/StudioLayout/Index'
import { SyncingStatus } from '../common/SyncingStatus'

import { useEventContext } from '@/contexts/EventContext'
import { useEnsureEventEnrollment } from '@/hooks/useEnsureEventEnrollment'
import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setExpandedSectionsAction } from '@/stores/slices/layout/studio.slice'
import { FrameStatus, EventStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent, getFrameConfig } from '@/utils/content.util'
import { FrameType } from '@/utils/frame-picker.util'
import { KeyboardShortcuts } from '@/utils/utils'

export function FrameManager() {
  const { eventId } = useParams({ strict: false })
  const { permissions } = useEventPermissions()
  const {
    event,
    isLoading: eventLoading,
    refetch: refetchEvent,
  } = useEvent({ id: eventId as string })

  const [selectedContentType, setContentType] = useState<FrameType | null>(null)
  const [selectedTemplateKey, setTemplateKey] = useState<string | undefined>(
    undefined
  )

  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)

  const expandedSectionIds = useStoreSelector(
    (state) => state.layout.studio.expandedSections
  )

  const [openBreakoutSelectorModal, setOpenBreakoutSelectorModal] =
    useState<boolean>(false)

  const {
    preview,
    loading,
    syncing,
    currentFrame,
    sections,
    openContentTypePicker,
    insertAfterFrameId,
    insertInSectionId,
    addFrameToSection,
    setOpenContentTypePicker,
  } = useEventContext()

  const dispatch = useStoreDispatch()

  useHotkeys(
    KeyboardShortcuts['Studio Mode'].newFrame.key,
    () => setOpenContentTypePicker(true),
    { enabled: !preview && activeTab === 'content-studio' }
  )

  useEnsureEventEnrollment()

  const handleAddNewFrame = (
    type: FrameType,
    templateKey?: string,
    breakoutType?: BREAKOUT_TYPES,
    breakoutRoomsGroupsCount?: number,
    breakoutRoomsGroupsTime?: number,
    assignmentOption?: AssignmentOption
  ) => {
    let currentSection
    const _insertAfterFrameId = insertAfterFrameId || currentFrame?.id

    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: getFrameConfig({
        frameType: type,
        data: {
          breakoutType,
          breakoutRoomsGroupsCount,
          breakoutRoomsGroupsTime,
          assignmentOption,
        },
      }),
      content: getDefaultContent({
        frameType: type,
        templateKey,
        data: {
          breakoutRoomsCount: breakoutRoomsGroupsCount,
          breakoutType,
        },
        // TODO: Fix any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      type,
      status: FrameStatus.DRAFT,
    }

    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setOpenContentTypePicker(false)
    setContentType(null)
    setTemplateKey(undefined)
    setOpenBreakoutSelectorModal(false)

    if (!expandedSectionIds.includes(insertInSection.id)) {
      dispatch(
        setExpandedSectionsAction([...expandedSectionIds, insertInSection.id])
      )
    }
  }

  if (eventLoading || loading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    )
  }

  if (!permissions.canUpdateFrame && event.status !== EventStatus.ACTIVE) {
    return (
      <div className="w-screen h-screen grid place-items-center bg-primary-50">
        <EmptyPlaceholder
          icon={<FaTableCellsRowLock className="text-primary-300" size={200} />}
          description=" Keep an eye out for updates."
          title="You’ll gain access to the event once it’s officially published by the host."
        />
      </div>
    )
  }

  return (
    <>
      <StudioLayout
        header={<Header event={event} refetchEvent={refetchEvent} />}
      />
      <FramePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={(content, templateType) => {
          if (content === FrameType.BREAKOUT) {
            setContentType(content)
            setTemplateKey(templateType)
            setOpenBreakoutSelectorModal(true)
          } else {
            handleAddNewFrame(content, templateType)
          }
        }}
      />
      <SyncingStatus syncing={syncing} />
      <KeyboardShortcutsModal />
      <SwitchToEditModal />
      <RenderIf isTrue={openBreakoutSelectorModal}>
        <BreakoutTypePicker
          open={openBreakoutSelectorModal}
          onClose={() => setOpenBreakoutSelectorModal(false)}
          onChoose={(
            contentType,
            breakoutRoomsGroupsCount,
            breakoutRoomsGroupsTime,
            assignmentOption
          ) => {
            if (selectedContentType) {
              handleAddNewFrame(
                selectedContentType,
                selectedTemplateKey,
                contentType,
                breakoutRoomsGroupsCount,
                breakoutRoomsGroupsTime,
                assignmentOption
              )
            }
          }}
        />
      </RenderIf>
    </>
  )
}
