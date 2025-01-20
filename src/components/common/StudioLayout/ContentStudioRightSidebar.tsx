import { motion } from 'framer-motion'
import { MdOutlineToggleOff } from 'react-icons/md'
import { useDispatch } from 'react-redux'

import { ContentStudioRightSidebarControls } from './ContentStudioRightSidebarControls'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { NoteOverlay } from '../NotesOverlay'

import { FrameAppearance } from '@/components/event-content/FrameAppearance/FrameAppearance'
import { FrameSettings } from '@/components/event-content/FrameAppearance/FrameSettings'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export const framesWithAppearance = [FrameType.MORAA_SLIDE]

export function ContentStudioRightSidebar() {
  const { contentStudioRightSidebarVisible } = useStoreSelector(
    (state) => state.layout.studio
  )
  const { permissions } = useEventPermissions()
  const currentFrame = useCurrentFrame()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const isPreviewOpen = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isPreviewOpen
  )
  const showPreviewPlaceholder =
    isPreviewOpen && contentStudioRightSidebar !== 'frame-notes'

  const dispatch = useDispatch()

  if (!currentFrame) return null
  if (!permissions.canUpdateFrame) return null

  const renderContent = () => {
    if (showPreviewPlaceholder) {
      return (
        <EmptyPlaceholder
          icon={<MdOutlineToggleOff size={32} className="text-gray-600" />}
          description="Switch to edit mode"
          title=""
          classNames={{
            description: 'text-xs text-gray-600',
            wrapper: 'h-full gap-1',
          }}
        />
      )
    }
    switch (contentStudioRightSidebar) {
      case 'frame-settings':
        return <FrameSettings />
      case 'frame-appearance':
        return <FrameAppearance />
      case 'frame-notes':
        return (
          <NoteOverlay
            onClose={() => dispatch(setContentStudioRightSidebarAction(null))}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ marginRight: 0 }}
      animate={{
        marginRight: contentStudioRightSidebarVisible ? 0 : -290,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'flex flex-col w-[16.75rem] flex-shrink-0 h-full rounded-lg mr-0 z-[2] bg-white border-1 border-gray-200'
      )}>
      <ContentStudioRightSidebarControls />
      <div className="h-full max-h-full p-4 pt-6 overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>
    </motion.div>
  )
}
