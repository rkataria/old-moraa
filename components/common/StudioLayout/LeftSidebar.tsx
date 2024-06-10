import { HEADER_HEIGHT } from './Header'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

const LEFT_SIDEBAR_WIDTH = 288
const LEFT_SIDEBAR_MIN_WIDTH = 56

export function LeftSidebar({ children }: { children: React.ReactNode }) {
  const { leftSidebarVisiblity } = useStudioLayout()

  // // Auto hide left sidebar when mouse is not over it and vice versa
  // useEffect(() => {
  //   const leftSidebar = document.getElementById('left-sidebar')

  //   const showLeftSidebar = () => {
  //     if (leftSidebarVisiblity === 'minimized') {
  //       toggleLeftSidebar()
  //     }
  //   }

  //   const hideLeftSidebar = () => {
  //     if (leftSidebarVisiblity === 'maximized') {
  //       toggleLeftSidebar()
  //     }
  //   }

  //   leftSidebar?.addEventListener('mouseover', showLeftSidebar)
  //   leftSidebar?.addEventListener('mouseleave', hideLeftSidebar)

  //   return () => {
  //     leftSidebar?.removeEventListener('mouseover', showLeftSidebar)
  //     leftSidebar?.removeEventListener('mouseleave', hideLeftSidebar)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [leftSidebarVisiblity])

  const leftSidebarWidth =
    leftSidebarVisiblity === 'maximized'
      ? `${LEFT_SIDEBAR_WIDTH}px`
      : `${LEFT_SIDEBAR_MIN_WIDTH}px`

  return (
    <div
      id="left-sidebar"
      className={cn(
        'flex-none h-full bg-white text-black dark:bg-gray-800 dark:text-white',
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
