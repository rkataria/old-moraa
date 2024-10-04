import { useDispatch } from 'react-redux'

import { NoteOverlay } from '../NotesOverlay'

import { FrameAppearance } from '@/components/event-content/FrameAppearance/FrameAppearance'
import { useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { cn } from '@/utils/utils'

export function ContentStudioRightSidebar() {
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const dispatch = useDispatch()

  const renderContent = () => {
    switch (contentStudioRightSidebar) {
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
        'flex-none w-72 h-full rounded-md mr-0 z-[2] bg-white',
        contentStudioRightSidebar ? 'visible' : 'hidden'
      )}>
      {renderContent()}
    </div>
  )
}
