import { ReactNode } from 'react'

import { HEADER_HEIGHT } from './Header'

import { cn } from '@/utils/utils'

export function MainContent({
  children,
  hasBottomSection,
}: {
  children: ReactNode
  hasBottomSection: boolean
}) {
  const MAIN_CONTAINER_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px ${hasBottomSection ? ' - 30vh' : ''})`

  return (
    <div
      className={cn(
        'flex-auto h-full overflow-hidden p-0',
        'border-1 border-gray-200 rounded-md'
      )}
      style={{
        maxHeight: MAIN_CONTAINER_HEIGHT,
      }}>
      <div className="h-full overflow-y-auto scrollbar-none bg-white rounded-md">
        {children}
      </div>
    </div>
  )
}
