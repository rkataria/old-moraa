import { FrameDetailsView } from './FrameDetailsView'
import { LeftSection } from './LeftSection'
import { SessionPlanner } from './SessionPlanner'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { cn } from '@/utils/utils'

export function OverviewFrame() {
  const { permissions } = useEventPermissions()

  return (
    <div
      className={cn('h-full px-8 py-4', {
        'flex items-start gap-6 bg-pattern-1': permissions.canUpdateFrame,
        'bg-gradient-to-b from-white to-[#e9e9d2]': !permissions.canUpdateFrame,
      })}>
      {permissions.canUpdateFrame ? (
        <div className="bg-white rounded-xl p-4 w-[412px] border h-fit overflow-y-scroll scrollbar-none shadow-md">
          <LeftSection />
        </div>
      ) : (
        <FrameDetailsView className="bg-white rounded-xl p-4 border" />
      )}
      <SessionPlanner className="h-full overflow-y-scroll scrollbar-none shadow-md" />
    </div>
  )
}
