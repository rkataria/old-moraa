import { StudioAgendaPanel } from '../AgendaPanel/StudioAgendaPanel'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function ContentStudioLeftSidebar() {
  const { contentStudioLeftSidebarVisible } = useStoreSelector(
    (state) => state.layout.studio
  )

  if (!contentStudioLeftSidebarVisible) return null

  return (
    <div className={cn('flex-none w-56 h-full rounded-md ml-0 z-[2] bg-white')}>
      <StudioAgendaPanel />
    </div>
  )
}
