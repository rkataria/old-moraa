import { Badge } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbBubbleText } from 'react-icons/tb'
import { useDispatch } from 'react-redux'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { cn } from '@/utils/utils'

export function FrameNoteToggleButton() {
  const dispatch = useDispatch()
  const currentFrame = useCurrentFrame()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )
  const { overviewOpen, currentSectionId } = useEventContext()
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
      {currentFrame?.notes ? (
        <Badge
          content=""
          color="danger"
          shape="circle"
          placement="top-right"
          hidden={!currentFrame?.notes}>
          <Button
            size="sm"
            isIconOnly
            className={cn('relative', {
              'bg-primary-100': isVisible,
            })}
            onClick={toggleSidebar}>
            <TbBubbleText size={20} strokeWidth={1.5} />
          </Button>
        </Badge>
      ) : (
        <Button
          size="sm"
          isIconOnly
          className={cn('relative', {
            'bg-primary-100': isVisible,
          })}
          onClick={toggleSidebar}>
          <TbBubbleText size={20} strokeWidth={1.5} />
        </Button>
      )}
    </Tooltip>
  )
}
