import { useContext } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { FrameAppearanceToggleButton } from '../common/StudioLayout/FrameAppearanceToggleButton'
import { FrameConfigurationToggleButton } from '../common/StudioLayout/FrameConfigurationToggleButton'
import { FrameNoteToggleButton } from '../common/StudioLayout/FrameNoteToggleButton'
import { FrameStatusToggleButton } from '../common/StudioLayout/FrameStatusToggleButton'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebarControls() {
  const { currentFrame, eventMode, preview } = useContext(
    EventContext
  ) as EventContextType
  const { setRightSidebarVisiblity } = useStudioLayout()

  const { permissions } = useEventPermissions()

  const editable =
    permissions.canUpdateFrame && eventMode === 'edit' && !preview

  useHotkeys(
    ']',
    () => setRightSidebarVisiblity(null),
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    []
  )

  // Hide the right sidebar controls if it is not editable
  if (!editable || !currentFrame) {
    return <div className="w-2" />
  }

  return (
    <RightSidebarControlsWrapper>
      <FrameConfigurationToggleButton />
      <FrameAppearanceToggleButton />
      <FrameNoteToggleButton />
      <FrameStatusToggleButton />
    </RightSidebarControlsWrapper>
  )
}

function RightSidebarControlsWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-none w-14 h-full flex flex-col justify-start items-center gap-2 overflow-y-auto scrollbar-none scroll-smooth px-2">
      <div className="border-1 border-gray-200 p-1 rounded-md bg-white flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}
