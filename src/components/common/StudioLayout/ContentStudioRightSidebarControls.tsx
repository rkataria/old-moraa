import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { FrameAppearanceToggleButton } from './FrameAppearanceToggleButton'
import { FrameNoteToggleButton } from './FrameNoteToggleButton'
import { FrameSettingsToggleButton } from './FrameSettingsToggleButton'
import { FrameStatusToggleButton } from './FrameStatusToggleButton'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function ContentStudioRightSidebarControls() {
  const dispatch = useDispatch()
  const { eventMode, currentFrame, preview } = useEventContext()
  const { permissions } = useEventPermissions()

  useHotkeys(
    ']',
    () => dispatch(setContentStudioRightSidebarAction(null)),
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    []
  )

  if (!permissions.canUpdateFrame && eventMode !== 'edit') {
    return null
  }

  const renderContent = () => {
    if (!currentFrame) return []

    if (preview) {
      return [<FrameNoteToggleButton />]
    }

    if ([FrameType.MORAA_SLIDE].includes(currentFrame.type as FrameType)) {
      return [
        <FrameAppearanceToggleButton />,
        <FrameNoteToggleButton />,
        <FrameStatusToggleButton />,
      ]
    }

    if (
      [
        FrameType.BREAKOUT,
        FrameType.POLL,
        FrameType.REFLECTION,
        FrameType.MORAA_BOARD,
        FrameType.PDF_VIEWER,
      ].includes(currentFrame.type as FrameType)
    ) {
      return [
        <FrameSettingsToggleButton />,
        <FrameNoteToggleButton />,
        <FrameStatusToggleButton />,
      ]
    }

    return [<FrameNoteToggleButton />, <FrameStatusToggleButton />]
  }

  if (renderContent().length === 0) return null

  return (
    <div
      className={cn(
        'flex-none flex flex-col justify-center items-center gap-2 p-2 rounded-md bg-white border-1 border-gray-200'
      )}>
      {renderContent()}
    </div>
  )
}
