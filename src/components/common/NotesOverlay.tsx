/* eslint-disable jsx-a11y/control-has-associated-label */

import { Button } from '@nextui-org/react'
import { RxCross1 } from 'react-icons/rx'

import { Note } from './Note'

import { useEventContext } from '@/contexts/EventContext'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { cn } from '@/utils/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NoteOverlaySidebarWrapper({ contentClass, children, onClose }: any) {
  return (
    <div className={cn('w-full h-full')}>
      <div className="flex items-center justify-between w-full p-2">
        <h3 className="text-lg font-semibold tracking-tight text-center">
          Notes
        </h3>
        <Button variant="light" isIconOnly onClick={onClose}>
          <RxCross1 size={18} />
        </Button>
      </div>
      <div className={cn(contentClass)}>{children}</div>
    </div>
  )
}

export function NoteOverlay({
  editable = true,
  onClose,
}: {
  editable?: boolean
  onClose: () => void
}) {
  const { eventMode, preview } = useEventContext()
  const currentFrame = useCurrentFrame()

  const isEditable = editable && eventMode === 'edit' && !preview

  if (!currentFrame) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-lg font-semibold tracking-tight text-center">
          No frame selected
        </span>
      </div>
    )
  }

  return (
    <NoteOverlaySidebarWrapper
      contentClass="relative flex flex-col w-full h-[calc(100%_-_48px)] p-4"
      onClose={onClose}>
      <Note
        frameId={currentFrame.id}
        note={currentFrame.notes || ''}
        editable={isEditable}
        placeholder={isEditable ? 'Type your note here' : 'No notes found'}
        className="cursor-text"
      />
    </NoteOverlaySidebarWrapper>
  )
}
