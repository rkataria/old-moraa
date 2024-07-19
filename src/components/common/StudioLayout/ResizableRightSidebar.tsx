import { ReactNode } from 'react'

import { HEADER_HEIGHT } from './Header'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

const CONTAINER_OVERFLOW_CLASSNAMES =
  'overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'

export function ResizableRightSidebar({ children }: { children: ReactNode }) {
  const { resizableRightSidebarVisiblity } = useStudioLayout()

  return (
    <div
      className={cn(
        'flex-none w-auto h-full rounded-md bg-white text-black dark:bg-gray-950 dark:text-white',
        CONTAINER_OVERFLOW_CLASSNAMES,
        {
          hidden: !resizableRightSidebarVisiblity,
        }
      )}
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}>
      {children}
    </div>
  )
}
