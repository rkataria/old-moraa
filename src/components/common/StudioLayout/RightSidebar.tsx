import { ReactNode } from 'react'

import { HEADER_HEIGHT } from './Header'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

const CONTAINER_OVERFLOW_CLASSNAMES =
  'overflow-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'

export function RightSidebar({ children }: { children: ReactNode }) {
  const { rightSidebarVisiblity } = useStudioLayout()

  return (
    <div
      className={cn(
        'flex-none w-64 h-[calc(100%_-_0.5rem)] ml-2 rounded-md bg-transparent text-black dark:text-white',
        CONTAINER_OVERFLOW_CLASSNAMES,
        {
          hidden: !rightSidebarVisiblity,
        }
      )}
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}>
      {children}
    </div>
  )
}
