import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { FrameAppearanceToggleButton } from './FrameAppearanceToggleButton'
import { FrameNoteToggleButton } from './FrameNoteToggleButton'
import { FrameStatusToggleButton } from './FrameStatusToggleButton'

import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'

export function ContentStudioRightSidebarControls() {
  const dispatch = useDispatch()
  const { eventMode, preview, currentFrame } = useEventContext()
  const { permissions } = useEventPermissions()

  const editable =
    permissions.canUpdateFrame &&
    eventMode === 'edit' &&
    !preview &&
    currentFrame

  useHotkeys(
    ']',
    () => dispatch(setContentStudioRightSidebarAction(null)),
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    []
  )

  return (
    <div className="flex-none flex flex-col justify-center items-center gap-2 p-2 rounded-md bg-white shadow-2xl">
      {editable && <FrameAppearanceToggleButton />}
      <FrameNoteToggleButton />
      {editable && <FrameStatusToggleButton />}
    </div>
  )
}
