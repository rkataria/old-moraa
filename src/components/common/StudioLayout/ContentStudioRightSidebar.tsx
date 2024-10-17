import { useDispatch } from 'react-redux'

import { NoteOverlay } from '../NotesOverlay'

import { FrameAppearance } from '@/components/event-content/FrameAppearance/FrameAppearance'
import { FrameSettings } from '@/components/event-content/FrameAppearance/FrameSettings'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { IFrame } from '@/types/frame.type'
import { getContentStudioRightSidebarControlKeys } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function ContentStudioRightSidebar() {
  const { preview } = useEventContext()
  const currentFrame = useCurrentFrame()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const dispatch = useDispatch()

  if (!currentFrame) return null
  if (!contentStudioRightSidebar) return null

  const controls = getContentStudioRightSidebarControlKeys(
    currentFrame as IFrame,
    preview
  )

  if (!controls.includes(contentStudioRightSidebar)) return null

  const renderContent = () => {
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
    <div
      className={cn(
        'flex-none w-72 h-full rounded-md mr-0 z-[2] bg-white border-1 border-gray-200',
        contentStudioRightSidebar ? 'visible' : 'hidden'
      )}>
      {renderContent()}
    </div>
  )
}
