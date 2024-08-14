import { useContext } from 'react'

import { Button, Tooltip } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { LuClipboardEdit } from 'react-icons/lu'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function FrameNoteToggleButton() {
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()
  const { overviewOpen, currentSectionId } = useContext(
    EventContext
  ) as EventContextType
  const { permissions } = useEventPermissions()

  const toggleSidebar = () => {
    if (overviewOpen || currentSectionId) {
      toast.error('Please select frame to view notes')

      return
    }

    setRightSidebarVisiblity(
      rightSidebarVisiblity === 'frame-notes' ? null : 'frame-notes'
    )
  }

  if (!permissions.canaccessNotes) {
    return null
  }

  return (
    <Tooltip content="Frame Notes" placement="left">
      <Button
        size="sm"
        isIconOnly
        variant="light"
        className={cn('bg-gray-100 hover:bg-gray-200', {
          'bg-primary-100': rightSidebarVisiblity === 'frame-notes',
        })}
        onClick={toggleSidebar}>
        <LuClipboardEdit size={20} strokeWidth={1.7} />
      </Button>
    </Tooltip>
  )
}
