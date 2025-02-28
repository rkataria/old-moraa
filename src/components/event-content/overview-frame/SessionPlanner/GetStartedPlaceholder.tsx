import { Image } from '@heroui/react'
import { MdAdd } from 'react-icons/md'
import { useDispatch } from 'react-redux'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { STUDIO_TABS } from '@/types/event.type'
import { getBlankFrame } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function GetStartedPlaceholder({
  className,
  fromTab,
}: {
  className?: string
  fromTab: STUDIO_TABS
}) {
  const dispatch = useDispatch()

  const { sections, addFrameToSection, setOpenContentTypePicker } =
    useEventContext()

  const handleStartedAction = () => {
    if (fromTab === STUDIO_TABS.SESSION_PLANNER) {
      dispatch(setIsPreviewOpenAction(false))
      addFrameToSection({
        frame: getBlankFrame('Untitled'),
        section: sections[0],
      })

      return
    }
    setOpenContentTypePicker(true)
  }

  return (
    <div className={cn('mt-16', className)}>
      <EmptyPlaceholder
        icon={<Image src="/images/empty-section.svg" width={400} />}
        title="Get Started with Frames"
        description="Your space is blank right now. Add some frames to visualize your event and take the first step in your planning journey"
        actionButton={
          <Button
            size="md"
            onClick={handleStartedAction}
            color="primary"
            startContent={<MdAdd size={28} />}>
            Add frame
          </Button>
        }
      />
    </div>
  )
}
