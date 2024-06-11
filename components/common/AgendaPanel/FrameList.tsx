import { FrameItem } from './FrameItem'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { IFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type FrameListProps = {
  frames: IFrame[]
}

export function FrameList({ frames }: FrameListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  return (
    <div
      className={cn('flex flex-col gap-2', {
        'p-2 pl-4 pr-0': sidebarExpanded,
        'py-2': !sidebarExpanded,
      })}>
      {frames.map((frame) => (
        <FrameItem key={frame.id} frame={frame} />
      ))}
    </div>
  )
}
