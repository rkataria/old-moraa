import { Chip } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import { PublishButton } from './PublishButton'
import { StudioTabs } from './StudioTabs'
import { AddParticipantsButtonWithModal } from '../common/AddParticipantsButtonWithModal'
import { AgendaPanelToggle } from '../common/AgendaPanel/AgendaPanelToggle'
import { MoraaLogo } from '../common/MoraaLogo'
import { PreviewSwitcher } from '../common/PreviewSwitcher'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { AIChatbotToggleButton } from '../common/StudioLayout/AIChatbotToggleButton'
import { SessionActionButton } from '../common/StudioLayout/SessionActionButton'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { toggleContentStudioLeftSidebarVisibleAction } from '@/stores/slices/layout/studio.slice'
import { getStatusColor } from '@/utils/event.util'

export function Header({
  event,
  refetchEvent,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchEvent: any
}) {
  const router = useRouter()
  const dispatch = useStoreDispatch()
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()
  const contentStudioLeftSidebarVisible = useStoreSelector(
    (state) => state.layout.studio.contentStudioLeftSidebarVisible
  )
  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)

  const { permissions } = useEventPermissions()

  const toggleNotesSidebar = () => {
    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-notes' ? null : 'frame-notes'
    )
  }

  useHotkeys('n', toggleNotesSidebar, [rightSidebarVisiblity])

  const renderActionButtons = () => (
    <>
      <AIChatbotToggleButton />
      <PreviewSwitcher />

      <AddParticipantsButtonWithModal eventId={event.id} />

      <SessionActionButton eventId={event.id} eventStatus={event.status} />
      <PublishButton
        eventStatus={event.status}
        eventId={event.id}
        refetchEvent={refetchEvent}
      />
    </>
  )

  if (!event) return null

  return (
    <div className="flex items-center justify-between w-full h-full px-6 bg-transparent">
      <div className="flex items-center gap-2 h-full flex-1">
        <div className="pr-4 border-r-2 border-gray-200 flex items-center">
          <MoraaLogo
            color="primary"
            filled
            onClick={() =>
              router.navigate({
                to: '/events',
              })
            }
          />
        </div>
        <div className="border-r-0 border-gray-200 font-semibold flex justify-start items-center gap-2 overflow-hidden">
          <motion.div
            initial={{
              position: 'relative',
              left: activeTab === 'content-studio' ? '0px' : '-40px',
              marginRight: activeTab === 'content-studio' ? '0px' : '-30px',
            }}
            animate={{
              left: activeTab === 'content-studio' ? '0vw' : '-40px',
              marginRight: activeTab === 'content-studio' ? '0px' : '-30px',
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}>
            <AgendaPanelToggle
              collapsed={!contentStudioLeftSidebarVisible}
              onToggle={() => {
                dispatch(toggleContentStudioLeftSidebarVisibleAction())
              }}
            />
          </motion.div>
          {/* <Tooltip content={event?.name} isDisabled={event?.name?.length < 45}> */}
          <span className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[28vw]">
            {event?.name}
          </span>
          {/* </Tooltip> */}
          <RenderIf isTrue={permissions.canUpdateFrame}>
            <Chip
              variant="flat"
              size="sm"
              className="rounded-lg"
              color={getStatusColor(event.status)}>
              {event.status}
            </Chip>
          </RenderIf>
        </div>
      </div>

      <div className="flex justify-center">
        <StudioTabs />
      </div>

      <div className="flex items-center justify-end h-full gap-2 flex-1">
        {renderActionButtons()}
      </div>
    </div>
  )
}
