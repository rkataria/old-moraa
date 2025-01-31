import { Image } from '@nextui-org/react'
import { MdAdd } from 'react-icons/md'
import { useDispatch } from 'react-redux'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { getBlankFrame } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export function GetStartedPlaceholder({ className }: { className?: string }) {
  const { sections, addFrameToSection } = useEventContext()
  const dispatch = useDispatch()

  return (
    <div className={cn('mt-16', className)}>
      <EmptyPlaceholder
        icon={<Image src="/images/empty-section.svg" width={400} />}
        title="Get Started with Frames"
        description="Your space is blank right now. Add some frames to visualize your event and take the first step in your planning journey"
        actionButton={
          <Button
            size="md"
            onClick={() => {
              dispatch(setIsPreviewOpenAction(false))
              addFrameToSection({
                frame: getBlankFrame('Untitled'),
                section: sections[0],
              })
            }}
            color="primary"
            startContent={<MdAdd size={28} />}>
            Add frame
          </Button>
        }
      />
    </div>
  )
}
