import { FrameDetailsView } from './FrameDetailsView'
import { SessionPlanner } from './SessionPlanner'

import { ScheduleEventButtonWithModal } from '@/components/common/Schedule/ScheduleEventButtonWithModal'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { cn } from '@/utils/utils'

export function OverviewFrame() {
  const { permissions } = useEventPermissions()

  return (
    <div
      className={cn(
        'bg-gray-100 h-full  px-8 pt-10 bg-gradient-to-b from-white to-[#e9e9d2]',
        {
          'flex items-start gap-6': permissions.canUpdateFrame,
        }
      )}>
      {permissions.canUpdateFrame ? (
        <div className="bg-white rounded-xl shadow-sm p-4 w-[519px] border border-slate-300">
          <ScheduleEventButtonWithModal id="meta" withoutModal />
        </div>
      ) : (
        <FrameDetailsView />
      )}

      <SessionPlanner />
    </div>
  )
}
