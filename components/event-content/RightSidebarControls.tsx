import { useContext } from 'react'

import { EventSettingsToggleButton } from '../common/StudioLayout/EventSettingsToggleButton'
import { FrameAppearanceToggleButton } from '../common/StudioLayout/FrameAppearanceToggleButton'
import { FrameConfigurationToggleButton } from '../common/StudioLayout/FrameConfigurationToggleButton'
import { FrameNoteToggleButton } from '../common/StudioLayout/FrameNoteToggleButton'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebarControls() {
  const { currentFrame, isOwner, eventMode, preview } = useContext(
    EventContext
  ) as EventContextType

  const editable = isOwner && eventMode === 'edit' && !preview

  // Hide the right sidebar controls if it is not editable
  if (!editable) {
    return <div className="w-2" />
  }

  if (!currentFrame) {
    return (
      <RightSidebarControlsWrapper>
        <EventSettingsToggleButton />
      </RightSidebarControlsWrapper>
    )
  }

  return (
    <RightSidebarControlsWrapper>
      <EventSettingsToggleButton />
      <FrameConfigurationToggleButton />
      <FrameAppearanceToggleButton />
      <FrameNoteToggleButton />
    </RightSidebarControlsWrapper>
  )
}

function RightSidebarControlsWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-none w-14 h-full flex flex-col justify-start items-center gap-2 overflow-y-auto scrollbar-none scroll-smooth">
      {children}
    </div>
  )
}
