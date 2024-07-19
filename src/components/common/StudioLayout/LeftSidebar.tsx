import { HEADER_HEIGHT } from './Header'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const LEFT_SIDEBAR_WIDTH = 288
export const LEFT_SIDEBAR_MIN_WIDTH = 56

export function LeftSidebar({ children }: { children: React.ReactNode }) {
  const { leftSidebarVisiblity } = useStudioLayout()

  const leftSidebarWidth =
    leftSidebarVisiblity === 'maximized'
      ? `${LEFT_SIDEBAR_WIDTH}px`
      : `${LEFT_SIDEBAR_MIN_WIDTH}px`

  return (
    <div
      id="left-sidebar"
      className={cn(
        'flex-none h-full bg-transparent text-black dark:text-white',
        'overflow-hidden' // No overflow for left sidebar, it should be hidden when it's too long and children will handle overflow
      )}
      style={{
        width: leftSidebarWidth,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}>
      {children}
    </div>
  )
}
