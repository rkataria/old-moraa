import { HEADER_HEIGHT } from './Header'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export const LEFT_SIDEBAR_WIDTH = 224
export const LEFT_SIDEBAR_MIN_WIDTH = 84
const PADDING = 8

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
        'flex-none w-64 h-full bg-white border-1 border-gray-200 ml-2 mb-2 rounded-md overflow-hidden'
      )}
      style={{
        width: leftSidebarWidth,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT + PADDING}px)`,
      }}>
      {children}
    </div>
  )
}
