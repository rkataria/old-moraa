import { useDispatch } from 'react-redux'

import { ContentStudioRightSidebarControls } from './ContentStudioRightSidebarControls'
import { NoteOverlay } from '../NotesOverlay'

import { FrameAppearance } from '@/components/event-content/FrameAppearance/FrameAppearance'
import { FrameSettings } from '@/components/event-content/FrameAppearance/FrameSettings'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { IFrame } from '@/types/frame.type'
import { getContentStudioRightSidebarControlKeys } from '@/utils/content.util'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export const framesWithAppearance = [FrameType.MORAA_SLIDE]

export function ContentStudioRightSidebar() {
  const { preview } = useEventContext()
  const currentFrame = useCurrentFrame()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const dispatch = useDispatch()

  if (!currentFrame) return null

  const controls = getContentStudioRightSidebarControlKeys(
    currentFrame as IFrame,
    preview
  )

  console.log(controls)

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
        return <FrameSettings />
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col w-[16.75rem] flex-shrink-0 h-full rounded-lg mr-0 z-[2] bg-white border-1 border-gray-200'
      )}>
      <ContentStudioRightSidebarControls />
      <div className="h-full max-h-full p-4 pt-6 overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>
    </div>
  )
}
