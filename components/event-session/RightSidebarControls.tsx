import { useContext } from 'react'

import { FrameNoteToggleButton } from '../common/StudioLayout/FrameNoteToggleButton'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function RightSidebarControls() {
  const { currentFrame, isOwner } = useContext(EventContext) as EventContextType

  // Hide the right sidebar controls if it is not editable
  if (!isOwner) {
    return <div className="w-2" />
  }

  if (!currentFrame) {
    return <div className="w-2" />
  }

  return (
    <RightSidebarControlsWrapper>
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
