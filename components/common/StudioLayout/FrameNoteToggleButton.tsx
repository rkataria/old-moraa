import { useContext } from 'react'

import toast from 'react-hot-toast'
import { LuClipboardEdit } from 'react-icons/lu'

import { Button, Tooltip } from '@nextui-org/react'

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
        isIconOnly
        onClick={toggleSidebar}
        variant="light"
        className={cn('cursor-pointer text-[#52525B]', {
          'text-[#7C3AED]': rightSidebarVisiblity === 'frame-notes',
        })}>
        <LuClipboardEdit size={20} strokeWidth={1.7} />
      </Button>
    </Tooltip>
  )
}
