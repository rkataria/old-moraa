import { useContext } from 'react'

import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbBubbleText } from 'react-icons/tb'
import { useDispatch } from 'react-redux'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function FrameNoteToggleButton() {
  const dispatch = useDispatch()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const { overviewOpen, currentSectionId } = useContext(
    EventContext
  ) as EventContextType
  const { permissions } = useEventPermissions()

  const toggleSidebar = () => {
    if (overviewOpen || currentSectionId) {
      toast.error('Please select frame to view notes')

      return
    }

    dispatch(
      setContentStudioRightSidebarAction(
        contentStudioRightSidebar === 'frame-notes' ? null : 'frame-notes'
      )
    )
  }

  useHotkeys('n', toggleSidebar, { enabled: permissions.canaccessNotes })

  if (!permissions.canaccessNotes) {
    return null
  }

  const isVisible = contentStudioRightSidebar === 'frame-notes'

  return (
    <Tooltip label="Notes" actionKey="N" placement="left">
      <Button
        size="sm"
        isIconOnly
        className={cn({
          'bg-primary-100': isVisible,
        })}
        onClick={toggleSidebar}>
        <TbBubbleText size={20} strokeWidth={1.5} />
      </Button>
    </Tooltip>
  )
}
