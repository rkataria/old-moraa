import { useEventContext } from '@/contexts/EventContext'
import { getFrameName } from '@/utils/getFrameName'
import { cn } from '@/utils/utils'

export function FrameName({ animate }: { animate?: boolean }) {
  const { currentFrame } = useEventContext()

  const frameName = getFrameName({ frame: currentFrame })

  return (
    <div className="flex overflow-x-hidden">
      <div
        className={cn('text-xs w-full whitespace-nowrap', {
          'animate-marquee': animate,
        })}>
        {frameName}
      </div>
    </div>
  )
}
